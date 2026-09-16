import type { CompanyProfileRow } from "../db/company-schema.js";
import {
  mapCompanyProfileRow,
  type CompanyProfile,
} from "../db/company-schema.js";
import { isUuid } from "../db/ids.js";
import { pool } from "../db/pool.js";

export type CompanySummary = {
  id: string;
  name: string;
  industry: string;
  address: string;
};

type CompanySummaryRow = Pick<
  CompanyProfileRow,
  "id" | "company_name" | "industry" | "address"
>;

const COMPANY_PROFILE_SELECT = `
  SELECT
    id,
    user_id,
    company_name,
    address,
    industry,
    nib,
    contact_person_name,
    contact_person_position,
    contact_person_phone,
    contact_person_email,
    created_at,
    updated_at
  FROM company_profiles
`;

function mapCompany(row: CompanySummaryRow): CompanySummary {
  return {
    id: row.id,
    name: row.company_name,
    industry: row.industry,
    address: row.address,
  };
}

export async function findCompanyProfileByUserId(
  userId: string,
): Promise<CompanyProfile | null> {
  if (!isUuid(userId)) {
    return null;
  }

  const { rows } = await pool.query<CompanyProfileRow>(
    `
    ${COMPANY_PROFILE_SELECT}
    WHERE user_id = $1
    LIMIT 1
    `,
    [userId],
  );

  const row = rows[0];
  return row ? mapCompanyProfileRow(row) : null;
}

export async function findCompanyByUserId(
  userId: string,
): Promise<CompanySummary | null> {
  if (!isUuid(userId)) {
    return null;
  }

  const { rows } = await pool.query<CompanySummaryRow>(
    `
    SELECT id, company_name, industry, address
    FROM company_profiles
    WHERE user_id = $1
    LIMIT 1
    `,
    [userId],
  );

  const row = rows[0];
  return row ? mapCompany(row) : null;
}

export async function findCompanyById(
  id: string,
): Promise<CompanySummary | null> {
  if (!isUuid(id)) {
    return null;
  }

  const { rows } = await pool.query<CompanySummaryRow>(
    `
    SELECT id, company_name, industry, address
    FROM company_profiles
    WHERE id = $1
    LIMIT 1
    `,
    [id],
  );

  const row = rows[0];
  return row ? mapCompany(row) : null;
}

export async function updateCompanyProfileByUserId(
  userId: string,
  input: {
    name: string;
    address: string;
    industry: string;
    nib: string;
    contactPerson: {
      name: string;
      position: string;
      phone: string;
      email: string;
    };
  },
): Promise<CompanyProfile | null> {
  if (!isUuid(userId)) {
    return null;
  }

  const { rows } = await pool.query<CompanyProfileRow>(
    `
    UPDATE company_profiles
    SET
      company_name = $2,
      address = $3,
      industry = $4,
      nib = $5,
      contact_person_name = $6,
      contact_person_position = $7,
      contact_person_phone = $8,
      contact_person_email = $9,
      updated_at = NOW()
    WHERE user_id = $1
    RETURNING
      id,
      user_id,
      company_name,
      address,
      industry,
      nib,
      contact_person_name,
      contact_person_position,
      contact_person_phone,
      contact_person_email,
      created_at,
      updated_at
    `,
    [
      userId,
      input.name.trim(),
      input.address.trim(),
      input.industry.trim(),
      input.nib.replace(/\D/g, ""),
      input.contactPerson.name.trim(),
      input.contactPerson.position.trim(),
      input.contactPerson.phone.trim(),
      input.contactPerson.email.trim().toLowerCase(),
    ],
  );

  const row = rows[0];
  return row ? mapCompanyProfileRow(row) : null;
}
