-- Tambah opsi 'lainnya' pada jenis disabilitas pencari kerja
-- dan jenis disabilitas yang didukung lowongan/kebutuhan perusahaan.

DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    WHERE rel.relname = 'job_seeker_profiles'
      AND con.contype = 'c'
      AND pg_get_constraintdef(con.oid) ILIKE '%disability_type%'
  LOOP
    EXECUTE format(
      'ALTER TABLE job_seeker_profiles DROP CONSTRAINT %I',
      rec.conname
    );
  END LOOP;
END $$;

ALTER TABLE job_seeker_profiles
  ADD CONSTRAINT job_seeker_profiles_disability_type_check CHECK (
    disability_type IN (
      'tuli',
      'daksa',
      'netra',
      'autisme',
      'intelektual',
      'lainnya'
    )
  );

DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    WHERE rel.relname = 'jobs'
      AND con.contype = 'c'
      AND pg_get_constraintdef(con.oid) ILIKE '%disability_friendly_type%'
  LOOP
    EXECUTE format(
      'ALTER TABLE jobs DROP CONSTRAINT %I',
      rec.conname
    );
  END LOOP;
END $$;

ALTER TABLE jobs
  ADD CONSTRAINT jobs_disability_friendly_type_check CHECK (
    disability_friendly_type IN (
      'semua',
      'tuli',
      'daksa',
      'netra',
      'autisme',
      'intelektual',
      'lainnya'
    )
  );

DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    WHERE rel.relname = 'company_inquiries'
      AND con.contype = 'c'
      AND pg_get_constraintdef(con.oid) ILIKE '%disability_friendly_type%'
  LOOP
    EXECUTE format(
      'ALTER TABLE company_inquiries DROP CONSTRAINT %I',
      rec.conname
    );
  END LOOP;
END $$;

ALTER TABLE company_inquiries
  ADD CONSTRAINT company_inquiries_disability_friendly_type_check CHECK (
    disability_friendly_type IN (
      'semua',
      'tuli',
      'daksa',
      'netra',
      'autisme',
      'intelektual',
      'lainnya'
    )
  );
