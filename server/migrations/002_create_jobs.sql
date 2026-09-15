CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES company_profiles (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  disability_friendly_type TEXT NOT NULL CHECK (
    disability_friendly_type IN (
      'semua',
      'tuli',
      'daksa',
      'netra',
      'autisme',
      'intelektual'
    )
  ),
  location TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (
    job_type IN (
      'penuh_waktu',
      'paruh_waktu',
      'kontrak',
      'magang',
      'lepas'
    )
  ),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS jobs_company_id_idx ON jobs (company_id);
CREATE INDEX IF NOT EXISTS jobs_is_active_created_at_idx ON jobs (is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS jobs_location_idx ON jobs (location);
CREATE INDEX IF NOT EXISTS jobs_job_type_idx ON jobs (job_type);
CREATE INDEX IF NOT EXISTS jobs_disability_friendly_type_idx ON jobs (disability_friendly_type);
CREATE INDEX IF NOT EXISTS jobs_title_lower_idx ON jobs (lower(title));
