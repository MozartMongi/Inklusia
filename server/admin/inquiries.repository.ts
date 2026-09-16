import {
  mapCompanyInquiryRow,
  type CompanyInquiry,
  type CompanyInquiryRow,
  type InquiryReviewDecision,
  type InquiryStatus,
} from "../db/inquiry-schema.js";
import { isUuid } from "../db/ids.js";
import { pool } from "../db/pool.js";
import {
  publishJobForInquiry,
  withdrawJobForInquiry,
} from "../jobs/job-publication.js";

const INQUIRY_COLUMNS = `
  i.id,
  i.company_id,
  i.title,
  i.description,
  i.requirements,
  i.location,
  i.job_type,
  i.disability_friendly_type,
  i.headcount,
  i.status,
  i.review_note,
  i.reviewed_at,
  i.submitted_at,
  i.created_at,
  i.updated_at
`;

export type AdminInquiry = CompanyInquiry & {
  company: { id: string; name: string; industry: string; address: string };
  jobId: string | null;
};

type AdminInquiryRow = CompanyInquiryRow & {
  company_name: string;
  industry: string;
  address: string;
  job_id: string | null;
};

function mapAdminInquiryRow(row: AdminInquiryRow): AdminInquiry {
  return {
    ...mapCompanyInquiryRow(row),
    company: {
      id: row.company_id,
      name: row.company_name,
      industry: row.industry,
      address: row.address,
    },
    jobId: row.job_id,
  };
}

/**
 * Antrean moderasi admin. Tanpa filter status, yang tampil lebih dulu adalah
 * kebutuhan `menunggu` (paling lama mengantre di atas).
 */
export async function listAdminInquiries(
  status: InquiryStatus | "semua",
): Promise<AdminInquiry[]> {
  const { rows } = await pool.query<AdminInquiryRow>(
    `
    SELECT
      ${INQUIRY_COLUMNS},
      c.company_name,
      c.industry,
      c.address,
      j.id AS job_id
    FROM company_inquiries i
    INNER JOIN company_profiles c ON c.id = i.company_id
    LEFT JOIN jobs j ON j.inquiry_id = i.id
    WHERE ($1 = 'semua' OR i.status = $1)
    ORDER BY
      CASE WHEN i.status = 'menunggu' THEN 0 ELSE 1 END,
      i.submitted_at ASC
    `,
    [status],
  );

  return rows.map(mapAdminInquiryRow);
}

export async function findAdminInquiry(
  inquiryId: string,
): Promise<AdminInquiry | null> {
  if (!isUuid(inquiryId)) {
    return null;
  }

  const { rows } = await pool.query<AdminInquiryRow>(
    `
    SELECT
      ${INQUIRY_COLUMNS},
      c.company_name,
      c.industry,
      c.address,
      j.id AS job_id
    FROM company_inquiries i
    INNER JOIN company_profiles c ON c.id = i.company_id
    LEFT JOIN jobs j ON j.inquiry_id = i.id
    WHERE i.id = $1
    LIMIT 1
    `,
    [inquiryId],
  );

  const row = rows[0];
  return row ? mapAdminInquiryRow(row) : null;
}

export type ReviewInquiryInput = {
  inquiryId: string;
  decision: InquiryReviewDecision;
  reviewNote: string;
  reviewerUserId: string;
};

export type ReviewInquiryResult =
  | { ok: true; inquiry: AdminInquiry }
  | { ok: false; reason: "tidak_ditemukan" | "sudah_ditutup" };

/**
 * Keputusan admin dan penerbitan/pencabutan lowongan dijalankan dalam satu
 * transaksi agar status kebutuhan tidak pernah berbeda dengan apa yang tayang.
 */
export async function reviewCompanyInquiry(
  input: ReviewInquiryInput,
): Promise<ReviewInquiryResult> {
  if (!isUuid(input.inquiryId)) {
    return { ok: false, reason: "tidak_ditemukan" };
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query<{ status: InquiryStatus }>(
      `SELECT status FROM company_inquiries WHERE id = $1 FOR UPDATE`,
      [input.inquiryId],
    );

    const existing = rows[0];
    if (!existing) {
      await client.query("ROLLBACK");
      return { ok: false, reason: "tidak_ditemukan" };
    }
    if (existing.status === "ditutup") {
      await client.query("ROLLBACK");
      return { ok: false, reason: "sudah_ditutup" };
    }

    await client.query(
      `
      UPDATE company_inquiries
      SET
        status = $2,
        review_note = $3,
        reviewed_at = NOW(),
        reviewed_by = $4,
        updated_at = NOW()
      WHERE id = $1
      `,
      [input.inquiryId, input.decision, input.reviewNote, input.reviewerUserId],
    );

    if (input.decision === "disetujui") {
      await publishJobForInquiry(client, input.inquiryId, input.reviewerUserId);
    } else {
      await withdrawJobForInquiry(client, input.inquiryId);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  const inquiry = await findAdminInquiry(input.inquiryId);
  return inquiry
    ? { ok: true, inquiry }
    : { ok: false, reason: "tidak_ditemukan" };
}
