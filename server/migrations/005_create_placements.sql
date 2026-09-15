CREATE TABLE IF NOT EXISTS placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_seeker_profile_id UUID NOT NULL REFERENCES job_seeker_profiles (id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'menunggu' CHECK (
    status IN ('menunggu', 'dikirim', 'diterima', 'ditolak')
  ),
  note TEXT NOT NULL DEFAULT '',
  created_by_user_id UUID REFERENCES users (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT placements_profile_job_uq UNIQUE (job_seeker_profile_id, job_id),
  CONSTRAINT placements_note_length_chk CHECK (char_length(note) <= 500)
);

CREATE INDEX IF NOT EXISTS placements_job_seeker_profile_id_idx
  ON placements (job_seeker_profile_id);

CREATE INDEX IF NOT EXISTS placements_job_id_idx
  ON placements (job_id);

CREATE INDEX IF NOT EXISTS placements_status_created_at_idx
  ON placements (status, created_at DESC);

CREATE INDEX IF NOT EXISTS placements_created_by_user_id_idx
  ON placements (created_by_user_id);
