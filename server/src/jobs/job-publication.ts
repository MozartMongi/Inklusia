import type { PoolClient } from "pg";

/**
 * Menerbitkan lowongan dari kebutuhan yang baru disetujui admin.
 * Satu kebutuhan memetakan ke satu lowongan (unique index `jobs_inquiry_id_key`),
 * jadi persetujuan ulang memperbarui baris yang sama, bukan menggandakannya.
 */
export async function publishJobForInquiry(
  client: PoolClient,
  inquiryId: string,
  reviewerUserId: string,
): Promise<string | null> {
  const { rows } = await client.query<{ id: string }>(
    `
    INSERT INTO jobs (
      company_id,
      inquiry_id,
      title,
      description,
      requirements,
      disability_friendly_type,
      location,
      job_type,
      status,
      is_active,
      approved_at,
      approved_by
    )
    SELECT
      i.company_id,
      i.id,
      i.title,
      i.description,
      i.requirements,
      i.disability_friendly_type,
      i.location,
      i.job_type,
      'disetujui',
      TRUE,
      NOW(),
      $2
    FROM company_inquiries i
    WHERE i.id = $1
    ON CONFLICT (inquiry_id) WHERE inquiry_id IS NOT NULL
    DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      requirements = EXCLUDED.requirements,
      disability_friendly_type = EXCLUDED.disability_friendly_type,
      location = EXCLUDED.location,
      job_type = EXCLUDED.job_type,
      status = 'disetujui',
      is_active = TRUE,
      approved_at = NOW(),
      approved_by = EXCLUDED.approved_by
    RETURNING id
    `,
    [inquiryId, reviewerUserId],
  );

  return rows[0]?.id ?? null;
}

/**
 * Mencabut lowongan dari halaman publik ketika kebutuhannya ditolak,
 * ditutup, atau diubah perusahaan sehingga perlu ditinjau ulang.
 */
export async function withdrawJobForInquiry(
  client: PoolClient,
  inquiryId: string,
): Promise<void> {
  await client.query(
    `
    UPDATE jobs
    SET status = 'menunggu', is_active = FALSE
    WHERE inquiry_id = $1
    `,
    [inquiryId],
  );
}
