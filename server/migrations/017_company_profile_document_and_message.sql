-- Profil perusahaan (berkas atau website) dan pesan opsional dari formulir registrasi.

ALTER TABLE company_profiles
  ADD COLUMN IF NOT EXISTS profile_kind TEXT NOT NULL DEFAULT ''
    CHECK (profile_kind IN ('', 'file', 'website')),
  ADD COLUMN IF NOT EXISTS profile_website TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS profile_file_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS profile_file_path TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS inclusion_message TEXT NOT NULL DEFAULT '';
