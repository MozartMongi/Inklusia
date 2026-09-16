CREATE TABLE IF NOT EXISTS job_seeker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  disability_type TEXT NOT NULL CHECK (
    disability_type IN (
      'tuli',
      'daksa',
      'netra',
      'autisme',
      'intelektual'
    )
  ),
  bio TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS job_seeker_profiles_disability_type_idx
  ON job_seeker_profiles (disability_type);
CREATE INDEX IF NOT EXISTS job_seeker_profiles_full_name_lower_idx
  ON job_seeker_profiles (lower(full_name));
