-- Tata letak CV bersifat tetap. Tabel ini bukan katalog pilihan;
-- hanya mencatat kapan CV terakhir disusun atau diunduh.

CREATE TABLE IF NOT EXISTS job_seeker_cv_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_seeker_profile_id UUID NOT NULL UNIQUE
    REFERENCES job_seeker_profiles (id) ON DELETE CASCADE,
  last_generated_at TIMESTAMPTZ,
  last_downloaded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS job_seeker_cv_preferences_profile_id_idx
  ON job_seeker_cv_preferences (job_seeker_profile_id);
