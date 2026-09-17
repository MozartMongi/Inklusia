import { pool } from "../db/pool.js";
import {
  mapCompanyProfileRow,
  type CompanyProfile,
  type CompanyProfileRow,
} from "../db/company-schema.js";
import { isUuid } from "../db/ids.js";

export type AdminCompanySummary = {
  id: string;
  name: string;
  industry: string;
  city: string;
  address: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  openInquiryCount: number;
};

export type AdminCompanyFilters = {
  q: string;
  industri: string;
  kota: string;
};

function cityFromAddress(address: string): string {
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return parts[parts.length - 1] ?? address;
}

export function parseAdminCompanyFilters(
  query: Record<string, unknown>,
): AdminCompanyFilters {
  return {
    q: typeof query.q === "string" ? query.q : "",
    industri: typeof query.industri === "string" ? query.industri : "",
    kota: typeof query.kota === "string" ? query.kota : "",
  };
}

export async function listAdminCompanies(
  filters: AdminCompanyFilters,
): Promise<AdminCompanySummary[]> {
  const { rows } = await pool.query<{
    id: string;
    company_name: string;
    industry: string;
    address: string;
    contact_person_name: string;
    contact_person_email: string;
    contact_person_phone: string;
    open_inquiry_count: string;
  }>(
    `
    SELECT
      c.id,
      c.company_name,
      c.industry,
      c.address,
      c.contact_person_name,
      c.contact_person_email,
      c.contact_person_phone,
      (
        SELECT COUNT(*)::text
        FROM company_inquiries i
        WHERE i.company_id = c.id AND i.status = 'disetujui'
      ) AS open_inquiry_count
    FROM company_profiles c
    ORDER BY c.updated_at DESC
    `,
  );

  return rows
    .map((row) => ({
      id: row.id,
      name: row.company_name,
      industry: row.industry,
      city: cityFromAddress(row.address),
      address: row.address,
      contactName: row.contact_person_name,
      contactEmail: row.contact_person_email,
      contactPhone: row.contact_person_phone,
      openInquiryCount: Number(row.open_inquiry_count),
    }))
    .filter((company) => {
      const keyword = filters.q.trim().toLowerCase();
      if (keyword) {
        const haystack =
          `${company.name} ${company.industry} ${company.contactName}`.toLowerCase();
        if (!haystack.includes(keyword)) {
          return false;
        }
      }
      if (filters.industri && company.industry !== filters.industri) {
        return false;
      }
      if (filters.kota && company.city !== filters.kota) {
        return false;
      }
      return true;
    });
}

export async function uniqueAdminCompanyFacets(): Promise<{
  cities: string[];
  industries: string[];
}> {
  const companies = await listAdminCompanies({
    q: "",
    industri: "",
    kota: "",
  });
  return {
    cities: [...new Set(companies.map((company) => company.city))].sort(
      (a, b) => a.localeCompare(b, "id"),
    ),
    industries: [...new Set(companies.map((company) => company.industry))].sort(
      (a, b) => a.localeCompare(b, "id"),
    ),
  };
}

export async function findAdminCompanyProfile(
  id: string,
): Promise<(CompanyProfile & { inquiries: unknown[] }) | null> {
  if (!isUuid(id)) {
    return null;
  }

  const { rows } = await pool.query<CompanyProfileRow>(
    `
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
      inclusion_message,
      created_at,
      updated_at
    FROM company_profiles
    WHERE id = $1
    LIMIT 1
    `,
    [id],
  );

  const row = rows[0];
  if (!row) {
    return null;
  }

  const inquiries = await pool.query<{
    id: string;
    company_id: string;
    title: string;
    description: string;
    requirements: string;
    location: string;
    job_type: string;
    disability_friendly_type: string;
    headcount: number;
    status: string;
    review_note: string;
    reviewed_at: Date | null;
    submitted_at: Date;
    created_at: Date;
  }>(
    `
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
      review_note,
      reviewed_at,
      submitted_at,
      created_at
    FROM company_inquiries
    WHERE company_id = $1
    ORDER BY created_at DESC
    `,
    [id],
  );

  return {
    ...mapCompanyProfileRow(row),
    inquiries: inquiries.rows.map((inquiry) => ({
      id: inquiry.id,
      companyId: inquiry.company_id,
      title: inquiry.title,
      description: inquiry.description,
      requirements: inquiry.requirements,
      location: inquiry.location,
      jobType: inquiry.job_type,
      disabilityFriendlyType: inquiry.disability_friendly_type,
      headcount: inquiry.headcount,
      status: inquiry.status,
      reviewNote: inquiry.review_note ?? "",
      reviewedAt: inquiry.reviewed_at
        ? new Date(inquiry.reviewed_at).toISOString()
        : null,
      submittedAt: new Date(
        inquiry.submitted_at ?? inquiry.created_at,
      ).toISOString(),
      createdAt: new Date(inquiry.created_at).toISOString(),
    })),
  };
}
