import { createHash, randomBytes } from "node:crypto";
import { pool } from "../db/pool.js";
import { hashPassword } from "./password.js";
import { findUserByEmail, updateUserPasswordHash } from "./users.repository.js";

const RESET_TTL_MS = 60 * 60 * 1000;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function requestPasswordReset(
  email: string,
): Promise<{ sent: true; debugToken?: string }> {
  const user = await findUserByEmail(email);
  // Respons seragam: selalu sukses agar email tidak terbongkar.
  if (!user) {
    return { sent: true };
  }

  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + RESET_TTL_MS);

  await pool.query(
    `
    INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
    VALUES ($1, $2, $3)
    `,
    [user.id, tokenHash, expiresAt.toISOString()],
  );

  // Belum ada layanan email: token dicatat di log lokal untuk uji manual.
  console.info(
    `[password-reset] token untuk ${user.email} (berlaku 1 jam): ${token}`,
  );

  return {
    sent: true,
    debugToken: process.env.NODE_ENV === "production" ? undefined : token,
  };
}

export async function confirmPasswordReset(input: {
  token: string;
  password: string;
}): Promise<{ reset: true } | { error: string }> {
  const token = input.token.trim();
  if (!token) {
    return { error: "Tautan reset tidak valid atau sudah kedaluwarsa." };
  }
  if (!input.password || input.password.length < 8) {
    return { error: "Kata sandi baru minimal 8 karakter." };
  }

  const tokenHash = hashToken(token);
  const { rows } = await pool.query<{
    id: string;
    user_id: string;
    expires_at: Date;
    used_at: Date | null;
  }>(
    `
    SELECT id, user_id, expires_at, used_at
    FROM password_reset_tokens
    WHERE token_hash = $1
    LIMIT 1
    `,
    [tokenHash],
  );

  const row = rows[0];
  if (!row || row.used_at || new Date(row.expires_at).getTime() < Date.now()) {
    return { error: "Tautan reset tidak valid atau sudah kedaluwarsa." };
  }

  const passwordHash = hashPassword(input.password);
  const updated = await updateUserPasswordHash(row.user_id, passwordHash);
  if (!updated) {
    return { error: "Tautan reset tidak valid atau sudah kedaluwarsa." };
  }

  await pool.query(
    `
    UPDATE password_reset_tokens
    SET used_at = NOW()
    WHERE id = $1
    `,
    [row.id],
  );

  return { reset: true };
}
