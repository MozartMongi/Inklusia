import {
  isInquiryDisabilityFriendlyType,
  isInquiryJobType,
  mapCompanyInquiryRow,
  type CompanyInquiry,
  type CompanyInquiryRow,
} from "../db/inquiry-schema.js";
import type { DisabilityFriendlyType, JobType } from "../db/jobs-schema.js";
import { isUuid } from "../db/ids.js";
import { pool } from "../db/pool.js";
import { withdrawJobForInquiry } from "../jobs/job-publication.js";

export type CreateInquiryInput = {
  title: string;
  description: string;
  requirements: string;
  location: string;
  jobType: JobType;
  disabilityFriendlyType: DisabilityFriendlyType;
  headcount: number;
};

const INQUIRY_COLUMNS = `
  id,
  company_id,
  title,
  description,
  requirements,
  location,
  job_type,
  disability_friendly_type,
  headcount,
  status,
  review_note,
  reviewed_at,
  submitted_at,
  created_at,
  updated_at
`;

const INQUIRY_SELECT = `SELECT ${INQUIRY_COLUMNS} FROM company_inquiries`;

export async function createCompanyInquiry(
  companyId: string,
  input: CreateInquiryInput,
): Promise<CompanyInquiry | null> {
  if (!isUuid(companyId)) {
    return null;
  }

  // Kebutuhan baru selalu masuk antrean tinjauan admin, tidak langsung tayang.
  const { rows } = await pool.query<CompanyInquiryRow>(
    `
    INSERT INTO company_inquiries (
      company_id,
      title,
      description,
      requirements,
      location,
      job_type,
      disability_friendly_type,
      headcount,
      status,
      submitted_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'menunggu', NOW())
    RETURNING ${INQUIRY_COLUMNS}
    `,
    [
      companyId,
      input.title.trim(),
      input.description.trim(),
      input.requirements.trim(),
      input.location.trim(),
      input.jobType,
      input.disabilityFriendlyType,
      input.headcount,
    ],
  );

  const row = rows[0];
  return row ? mapCompanyInquiryRow(row) : null;
}

export async function listCompanyInquiries(
  companyId: string,
): Promise<CompanyInquiry[]> {
  if (!isUuid(companyId)) {
    return [];
  }

  const { rows } = await pool.query<CompanyInquiryRow>(
    `
    ${INQUIRY_SELECT}
    WHERE company_id = $1
    ORDER BY created_at DESC
    `,
    [companyId],
  );

  return rows.map(mapCompanyInquiryRow);
}

export async function findCompanyInquiryForCompany(
  companyId: string,
  inquiryId: string,
): Promise<CompanyInquiry | null> {
  if (!isUuid(companyId) || !isUuid(inquiryId)) {
    return null;
  }

  const { rows } = await pool.query<CompanyInquiryRow>(
    `
    ${INQUIRY_SELECT}
    WHERE company_id = $1 AND id = $2
    LIMIT 1
    `,
    [companyId, inquiryId],
  );

  const row = rows[0];
  return row ? mapCompanyInquiryRow(row) : null;
}

/**
 * Perubahan isi oleh perusahaan mengembalikan kebutuhan ke antrean tinjauan
 * dan mencabut lowongan yang sudah tayang, supaya konten yang tampil di publik
 * selalu versi yang pernah disetujui admin.
 */
export async function updateCompanyInquiryForCompany(
  companyId: string,
  inquiryId: string,
  input: CreateInquiryInput,
): Promise<CompanyInquiry | null> {
  if (!isUuid(companyId) || !isUuid(inquiryId)) {
    return null;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query<CompanyInquiryRow>(
      `
      UPDATE company_inquiries
      SET
        title = $3,
        description = $4,
        requirements = $5,
        location = $6,
        job_type = $7,
        disability_friendly_type = $8,
        headcount = $9,
        status = 'menunggu',
        review_note = '',
        reviewed_at = NULL,
        reviewed_by = NULL,
        submitted_at = NOW(),
        updated_at = NOW()
      WHERE company_id = $1 AND id = $2 AND status <> 'ditutup'
      RETURNING ${INQUIRY_COLUMNS}
      `,
      [
        companyId,
        inquiryId,
        input.title.trim(),
        input.description.trim(),
        input.requirements.trim(),
        input.location.trim(),
        input.jobType,
        input.disabilityFriendlyType,
        input.headcount,
      ],
    );

    const row = rows[0];
    if (!row) {
      await client.query("ROLLBACK");
      return null;
    }

    await withdrawJobForInquiry(client, inquiryId);
    await client.query("COMMIT");
    return mapCompanyInquiryRow(row);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Perusahaan hanya boleh menutup kebutuhan atau mengirimkannya ulang
 * untuk ditinjau. Menyetujui kebutuhan adalah wewenang admin.
 */
export async function updateCompanyInquiryStatusForCompany(
  companyId: string,
  inquiryId: string,
  status: "menunggu" | "ditutup",
): Promise<CompanyInquiry | null> {
  if (!isUuid(companyId) || !isUuid(inquiryId)) {
    return null;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query<CompanyInquiryRow>(
      `
      UPDATE company_inquiries
      SET
        status = $3,
        review_note = CASE WHEN $3 = 'menunggu' THEN '' ELSE review_note END,
        reviewed_at = CASE WHEN $3 = 'menunggu' THEN NULL ELSE reviewed_at END,
        reviewed_by = CASE WHEN $3 = 'menunggu' THEN NULL ELSE reviewed_by END,
        submitted_at = CASE WHEN $3 = 'menunggu' THEN NOW() ELSE submitted_at END,
        updated_at = NOW()
      WHERE company_id = $1 AND id = $2
      RETURNING ${INQUIRY_COLUMNS}
      `,
      [companyId, inquiryId, status],
    );

    const row = rows[0];
    if (!row) {
      await client.query("ROLLBACK");
      return null;
    }

    // Ditutup maupun dikirim ulang sama-sama mencabut lowongan dari publik.
    await withdrawJobForInquiry(client, inquiryId);
    await client.query("COMMIT");
    return mapCompanyInquiryRow(row);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export { isInquiryDisabilityFriendlyType, isInquiryJobType };
