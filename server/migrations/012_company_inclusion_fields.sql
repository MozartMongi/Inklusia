-- Data kesiapan inklusi dari formulir registrasi perusahaan.

ALTER TABLE company_profiles
  ADD COLUMN IF NOT EXISTS has_disability_employees BOOLEAN,
  ADD COLUMN IF NOT EXISTS disability_workers_needed INTEGER NOT NULL DEFAULT 0
    CHECK (disability_workers_needed >= 0),
  ADD COLUMN IF NOT EXISTS needed_skills TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS disability_hire_plan TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS has_csr_or_grant BOOLEAN;
