-- Index untuk pencarian/saringan data perusahaan (admin & ruang perusahaan).
-- Tabel company_profiles sendiri sudah dibuat di 001_create_users_and_company_profiles.sql.

CREATE INDEX IF NOT EXISTS company_profiles_industry_idx
  ON company_profiles (industry);

CREATE INDEX IF NOT EXISTS company_profiles_company_name_lower_idx
  ON company_profiles (lower(company_name));

CREATE INDEX IF NOT EXISTS company_profiles_updated_at_idx
  ON company_profiles (updated_at DESC);
