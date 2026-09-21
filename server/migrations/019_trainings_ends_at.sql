-- Jadwal selesai pelatihan untuk status akan datang / berlangsung / berakhir.

ALTER TABLE trainings
  ADD COLUMN IF NOT EXISTS ends_at TIMESTAMPTZ;

UPDATE trainings
SET ends_at = starts_at + INTERVAL '7 days'
WHERE ends_at IS NULL;

ALTER TABLE trainings
  ALTER COLUMN ends_at SET NOT NULL;

ALTER TABLE trainings
  DROP CONSTRAINT IF EXISTS trainings_ends_at_gte_starts_at;

ALTER TABLE trainings
  ADD CONSTRAINT trainings_ends_at_gte_starts_at
  CHECK (ends_at >= starts_at);

CREATE INDEX IF NOT EXISTS trainings_starts_ends_at_idx
  ON trainings (starts_at ASC, ends_at ASC);
