/**
 * Seed idempotent akun root admin.
 * Kredensial dibaca dari environment — tidak pernah ditulis di kode.
 *
 * Jalankan: ROOT_ADMIN_EMAIL=... ROOT_ADMIN_PASSWORD=... npm run seed:root-admin
 */
import { hashPassword, MIN_PASSWORD_LENGTH } from "../auth/password.js";
import { isProduction } from "../config/env.js";
import { pool } from "./pool.js";
import { DEV_ADMIN_USER_ID } from "./seed-ids.js";

const email = process.env.ROOT_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ROOT_ADMIN_PASSWORD ?? "";

if (!email || !password) {
  throw new Error(
    "ROOT_ADMIN_EMAIL dan ROOT_ADMIN_PASSWORD wajib disetel saat menjalankan seed root admin.",
  );
}

const minimumLength = isProduction ? 12 : MIN_PASSWORD_LENGTH;
if (password.length < minimumLength) {
  throw new Error(
    `ROOT_ADMIN_PASSWORD minimal ${minimumLength} karakter.`,
  );
}

async function seedRootAdmin() {
  const passwordHash = hashPassword(password);

  // Baris root admin dikunci pada satu id agar seed ulang tidak menggandakan akun.
  await pool.query(
    `
    INSERT INTO users (
      id, email, password_hash, role, is_root_admin, full_name, status
    )
    VALUES ($1, $2, $3, 'admin', TRUE, 'Root Inklusia', 'aktif')
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      password_hash = EXCLUDED.password_hash,
      role = EXCLUDED.role,
      is_root_admin = TRUE,
      full_name = EXCLUDED.full_name,
      status = 'aktif',
      updated_at = NOW()
    `,
    [DEV_ADMIN_USER_ID, email, passwordHash],
  );

  // Jika email root sudah dipakai baris lain, pastikan flag root tetap aktif.
  await pool.query(
    `
    UPDATE users
    SET
      role = 'admin',
      is_root_admin = TRUE,
      password_hash = $2,
      full_name = CASE
        WHEN full_name IS NULL OR full_name = '' THEN 'Root Inklusia'
        ELSE full_name
      END,
      status = 'aktif',
      updated_at = NOW()
    WHERE lower(email) = lower($1)
    `,
    [email, passwordHash],
  );

  console.log(`Seed root admin ${email} selesai.`);
}

try {
  await seedRootAdmin();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
