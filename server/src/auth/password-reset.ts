import { createHash, randomBytes } from "node:crypto";
import { appBaseUrl } from "../config/env.js";
import { pool } from "../db/pool.js";
import { sendMail } from "../mail/mailer.js";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH, hashPassword } from "./password.js";
import { findUserByEmail, updateUserPasswordHash } from "./users.repository.js";

const RESET_TTL_MS = 60 * 60 * 1000;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function requestPasswordReset(
  email: string,
): Promise<{ sent: true }> {
  const user = await findUserByEmail(email);
  // Respons seragam: selalu sukses agar email tidak terbongkar.
  if (!user) {
    return { sent: true };
  }

  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + RESET_TTL_MS);

  // Token lama yang belum dipakai dibatalkan agar hanya satu tautan aktif.
  await pool.query(
    `
    UPDATE password_reset_tokens
    SET used_at = NOW()
    WHERE user_id = $1 AND used_at IS NULL
    `,
    [user.id],
  );

  await pool.query(
    `
    INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
    VALUES ($1, $2, $3)
    `,
    [user.id, tokenHash, expiresAt.toISOString()],
  );

  const resetUrl = `${appBaseUrl}/masuk/reset-kata-sandi?token=${token}`;
  await sendMail({
    to: user.email,
    subject: "Atur ulang kata sandi Inklusia",
    text: [
      "Halo,",
      "",
      "Kami menerima permintaan untuk mengatur ulang kata sandi akun Inklusia Anda.",
      "Buka tautan berikut untuk membuat kata sandi baru (berlaku 1 jam):",
      resetUrl,
      "",
      "Jika Anda tidak meminta hal ini, abaikan email ini. Kata sandi Anda tidak berubah.",
    ].join("\n"),
    html: [
      "<p>Halo,</p>",
      "<p>Kami menerima permintaan untuk mengatur ulang kata sandi akun Inklusia Anda.</p>",
      `<p><a href="${resetUrl}">Buat kata sandi baru</a> (tautan berlaku 1 jam).</p>`,
      "<p>Jika Anda tidak meminta hal ini, abaikan email ini. Kata sandi Anda tidak berubah.</p>",
    ].join(""),
  });

  return { sent: true };
}

export async function confirmPasswordReset(input: {
  token: string;
  password: string;
}): Promise<{ reset: true } | { error: string }> {
  const token = input.token.trim();
  if (!token) {
    return { error: "Tautan reset tidak valid atau sudah kedaluwarsa." };
  }
  if (!input.password || input.password.length < MIN_PASSWORD_LENGTH) {
    return { error: `Kata sandi baru minimal ${MIN_PASSWORD_LENGTH} karakter.` };
  }
  if (input.password.length > MAX_PASSWORD_LENGTH) {
    return { error: `Kata sandi baru maksimal ${MAX_PASSWORD_LENGTH} karakter.` };
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
