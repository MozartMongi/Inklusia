-- Alur persetujuan admin: kebutuhan (inquiry) dari perusahaan harus disetujui
-- admin sebelum terbit menjadi lowongan publik.
--
-- Status inquiry:
--   menunggu  → baru dikirim perusahaan, menunggu tinjauan admin
--   disetujui → admin menyetujui, lowongan terbit di /lowongan
--   ditolak   → admin menolak, disertai catatan
--   ditutup   → perusahaan menutup kebutuhan, lowongan ikut dicabut

-- 1. Kolom moderasi pada company_inquiries.
ALTER TABLE company_inquiries
  ADD COLUMN IF NOT EXISTS review_note TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- 2. Ganti daftar status. Data lama berstatus 'terbuka' belum pernah ditinjau,
--    jadi dipindahkan ke 'menunggu' supaya tidak otomatis tampil ke publik.
ALTER TABLE company_inquiries
  DROP CONSTRAINT IF EXISTS company_inquiries_status_check;

UPDATE company_inquiries
SET status = 'menunggu'
WHERE status = 'terbuka';

ALTER TABLE company_inquiries
  ALTER COLUMN status SET DEFAULT 'menunggu';

ALTER TABLE company_inquiries
  ADD CONSTRAINT company_inquiries_status_check CHECK (
    status IN ('menunggu', 'disetujui', 'ditolak', 'ditutup')
  );

-- 3. Kolom publikasi pada jobs. Lowongan hanya tampil publik bila
--    status = 'disetujui' DAN is_active = TRUE.
ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS inquiry_id UUID
    REFERENCES company_inquiries (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'menunggu',
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users (id) ON DELETE SET NULL;

-- Lowongan yang sudah ada sebelum alur moderasi dianggap sudah disetujui
-- agar tidak hilang dari daftar publik saat migrasi dijalankan.
UPDATE jobs
SET status = 'disetujui', approved_at = COALESCE(approved_at, created_at)
WHERE status = 'menunggu' AND inquiry_id IS NULL;

ALTER TABLE jobs
  DROP CONSTRAINT IF EXISTS jobs_status_check;

ALTER TABLE jobs
  ADD CONSTRAINT jobs_status_check CHECK (
    status IN ('menunggu', 'disetujui', 'ditolak')
  );

-- Satu inquiry hanya boleh menghasilkan satu lowongan.
CREATE UNIQUE INDEX IF NOT EXISTS jobs_inquiry_id_key
  ON jobs (inquiry_id)
  WHERE inquiry_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS jobs_status_is_active_created_at_idx
  ON jobs (status, is_active, created_at DESC);

CREATE INDEX IF NOT EXISTS company_inquiries_status_submitted_at_idx
  ON company_inquiries (status, submitted_at DESC);
