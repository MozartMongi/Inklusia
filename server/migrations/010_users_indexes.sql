-- Index untuk autentikasi dan filter akun pengguna.
-- Tabel users sendiri sudah dibuat di 001_create_users_and_company_profiles.sql.

CREATE INDEX IF NOT EXISTS users_email_lower_idx
  ON users (lower(email));

CREATE INDEX IF NOT EXISTS users_role_idx
  ON users (role);

CREATE INDEX IF NOT EXISTS users_is_root_admin_idx
  ON users (is_root_admin)
  WHERE is_root_admin = TRUE;
