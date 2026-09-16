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

export type CreateInquiryInput = {
  title: string;
  description: string;
  requirements: string;
  location: string;
  jobType: JobType;
  disabilityFriendlyType: DisabilityFriendlyType;
  headcount: number;
};

const INQUIRY_SELECT = `
  SELECT
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
    created_at,
    updated_at
  FROM company_inquiries
`;

export async function createCompanyInquiry(
  companyId: string,
  input: CreateInquiryInput,
): Promise<CompanyInquiry | null> {
  if (!isUuid(companyId)) {
    return null;
  }

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
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'terbuka')
    RETURNING
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
      created_at,
      updated_at
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

export async function updateCompanyInquiryForCompany(
  companyId: string,
  inquiryId: string,
  input: CreateInquiryInput,
): Promise<CompanyInquiry | null> {
  if (!isUuid(companyId) || !isUuid(inquiryId)) {
    return null;
  }

  const { rows } = await pool.query<CompanyInquiryRow>(
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
      updated_at = NOW()
    WHERE company_id = $1 AND id = $2
    RETURNING
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
      created_at,
      updated_at
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
  return row ? mapCompanyInquiryRow(row) : null;
}

export async function updateCompanyInquiryStatusForCompany(
  companyId: string,
  inquiryId: string,
  status: "terbuka" | "ditutup",
): Promise<CompanyInquiry | null> {
  if (!isUuid(companyId) || !isUuid(inquiryId)) {
    return null;
  }

  const { rows } = await pool.query<CompanyInquiryRow>(
    `
    UPDATE company_inquiries
    SET status = $3, updated_at = NOW()
    WHERE company_id = $1 AND id = $2
    RETURNING
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
      created_at,
      updated_at
    `,
    [companyId, inquiryId, status],
  );

  const row = rows[0];
  return row ? mapCompanyInquiryRow(row) : null;
}

export { isInquiryDisabilityFriendlyType, isInquiryJobType };
