-- Nama tampilan + status aktif akun admin (kelola oleh root admin).

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS full_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'aktif';

ALTER TABLE users
  DROP CONSTRAINT IF EXISTS users_status_check;

ALTER TABLE users
  ADD CONSTRAINT users_status_check
  CHECK (status IN ('aktif', 'nonaktif'));

UPDATE users
SET full_name = 'Root Inklusia'
WHERE is_root_admin = TRUE
  AND (full_name IS NULL OR full_name = '');
