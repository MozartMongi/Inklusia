-- Kolom keterangan disabilitas + sertifikasi untuk registrasi pencari kerja.

ALTER TABLE job_seeker_profiles
  ADD COLUMN IF NOT EXISTS disability_notes TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS job_seeker_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES job_seeker_profiles (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS job_seeker_certifications_profile_id_idx
  ON job_seeker_certifications (profile_id);
