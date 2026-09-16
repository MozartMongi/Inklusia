-- Katalog pelatihan keahlian + pendaftaran pencari kerja.

CREATE TABLE IF NOT EXISTS trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  provider TEXT NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('daring', 'luring', 'hybrid')),
  duration_label TEXT NOT NULL,
  skill_tags TEXT[] NOT NULL DEFAULT '{}',
  accessibility_notes TEXT NOT NULL DEFAULT '',
  starts_at TIMESTAMPTZ NOT NULL,
  seats_total INTEGER NOT NULL CHECK (seats_total >= 0),
  seats_left INTEGER NOT NULL CHECK (seats_left >= 0),
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT trainings_seats_left_lte_total CHECK (seats_left <= seats_total)
);

CREATE TABLE IF NOT EXISTS training_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_id UUID NOT NULL REFERENCES trainings (id) ON DELETE CASCADE,
  job_seeker_profile_id UUID NOT NULL REFERENCES job_seeker_profiles (id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'terdaftar' CHECK (
    status IN ('terdaftar', 'berlangsung', 'selesai', 'dibatalkan')
  ),
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS training_enrollments_active_unique_idx
  ON training_enrollments (training_id, job_seeker_profile_id)
  WHERE status <> 'dibatalkan';

CREATE INDEX IF NOT EXISTS trainings_published_starts_at_idx
  ON trainings (is_published, starts_at ASC);

CREATE INDEX IF NOT EXISTS trainings_format_idx
  ON trainings (format);

CREATE INDEX IF NOT EXISTS training_enrollments_profile_id_idx
  ON training_enrollments (job_seeker_profile_id);

CREATE INDEX IF NOT EXISTS training_enrollments_training_id_idx
  ON training_enrollments (training_id);

CREATE INDEX IF NOT EXISTS training_enrollments_status_idx
  ON training_enrollments (status);
