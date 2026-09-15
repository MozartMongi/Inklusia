-- Inquiry kebutuhan karyawan difabel dari perusahaan.

CREATE TABLE IF NOT EXISTS company_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES company_profiles (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
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
  headcount INTEGER NOT NULL DEFAULT 1 CHECK (headcount >= 1),
  status TEXT NOT NULL DEFAULT 'terbuka' CHECK (
    status IN ('terbuka', 'ditutup')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS company_inquiries_company_id_idx
  ON company_inquiries (company_id);

CREATE INDEX IF NOT EXISTS company_inquiries_status_created_at_idx
  ON company_inquiries (status, created_at DESC);

CREATE INDEX IF NOT EXISTS company_inquiries_company_status_idx
  ON company_inquiries (company_id, status);

CREATE INDEX IF NOT EXISTS company_inquiries_location_idx
  ON company_inquiries (location);

CREATE INDEX IF NOT EXISTS company_inquiries_job_type_idx
  ON company_inquiries (job_type);

CREATE INDEX IF NOT EXISTS company_inquiries_disability_friendly_type_idx
  ON company_inquiries (disability_friendly_type);
