CREATE TABLE IF NOT EXISTS placement_contact_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_seeker_profile_id UUID NOT NULL REFERENCES job_seeker_profiles (id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('telepon', 'email', 'whatsapp')),
  message TEXT NOT NULL,
  created_by_user_id UUID REFERENCES users (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT placement_contact_logs_message_length_chk CHECK (
    char_length(message) BETWEEN 10 AND 500
  )
);

CREATE INDEX IF NOT EXISTS placement_contact_logs_profile_created_at_idx
  ON placement_contact_logs (job_seeker_profile_id, created_at DESC);

CREATE INDEX IF NOT EXISTS placement_contact_logs_created_by_user_id_idx
  ON placement_contact_logs (created_by_user_id);
