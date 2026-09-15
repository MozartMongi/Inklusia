CREATE TABLE IF NOT EXISTS job_seeker_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES job_seeker_profiles (id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('dasar', 'menengah', 'mahir')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS job_seeker_skills_profile_id_idx
  ON job_seeker_skills (profile_id);
CREATE INDEX IF NOT EXISTS job_seeker_skills_name_lower_idx
  ON job_seeker_skills (lower(skill_name));

CREATE TABLE IF NOT EXISTS job_seeker_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES job_seeker_profiles (id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT job_seeker_experiences_dates_chk CHECK (
    end_date IS NULL OR end_date >= start_date
  )
);

CREATE INDEX IF NOT EXISTS job_seeker_experiences_profile_id_idx
  ON job_seeker_experiences (profile_id);
CREATE INDEX IF NOT EXISTS job_seeker_experiences_start_date_idx
  ON job_seeker_experiences (profile_id, start_date DESC);

CREATE TABLE IF NOT EXISTS job_seeker_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES job_seeker_profiles (id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('photo', 'ktp')),
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT job_seeker_photos_profile_kind_uq UNIQUE (profile_id, kind)
);

CREATE INDEX IF NOT EXISTS job_seeker_photos_profile_id_idx
  ON job_seeker_photos (profile_id);
