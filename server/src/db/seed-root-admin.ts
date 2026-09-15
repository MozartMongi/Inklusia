/**
 * Seed idempotent root admin default.
 * Email: info@inklusia.id
 */
import { hashPassword } from "../auth/password.js";
import { pool } from "./pool.js";
import { DEV_ADMIN_USER_ID } from "./seed-ids.js";

const ROOT_ADMIN_EMAIL = "info@inklusia.id";
const ROOT_ADMIN_PASSWORD = "BerkatBagiBangsa777";

async function seedRootAdmin() {
  const passwordHash = hashPassword(ROOT_ADMIN_PASSWORD);

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
    [DEV_ADMIN_USER_ID, ROOT_ADMIN_EMAIL, passwordHash],
  );

  // Jika email root sudah ada di baris lain, pastikan flag root aktif.
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
    [ROOT_ADMIN_EMAIL, passwordHash],
  );

  console.log(`Seed root admin ${ROOT_ADMIN_EMAIL} selesai.`);
}

try {
  await seedRootAdmin();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
