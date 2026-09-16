-- Tabel induk yang dibutuhkan foreign key jobs.company_id → company_profiles.id.

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('job_seeker', 'company', 'admin')),
  is_root_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS company_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  address TEXT NOT NULL,
  industry TEXT NOT NULL,
  nib TEXT NOT NULL DEFAULT '',
  contact_person_name TEXT NOT NULL DEFAULT '',
  contact_person_position TEXT NOT NULL DEFAULT '',
  contact_person_phone TEXT NOT NULL DEFAULT '',
  contact_person_email TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
