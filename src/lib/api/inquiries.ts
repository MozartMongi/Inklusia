import { MOCK_COMPANY_PROFILE } from "@/lib/mock/company";
import { MOCK_COMPANY_INQUIRIES } from "@/lib/mock/inquiries";
import type { CompanyInquiry, InquiryStatus } from "@/lib/types/inquiry";
import type { DisabilityFriendlyType, JobType } from "@/lib/types/job";

/**
 * Kontrak yang diasumsikan:
 * GET /api/me/company/inquiries → { data: CompanyInquiry[] }
 * GET /api/me/company/inquiries/:id → { data: CompanyInquiry }
 * POST /api/me/company/inquiries → { data: CompanyInquiry }
 * PATCH /api/me/company/inquiries/:id → { data: CompanyInquiry }
 * PATCH /api/me/company/inquiries/:id/status → { data: CompanyInquiry }
 */
export type CreateInquiryInput = {
  title: string;
  description: string;
  requirements: string;
  location: string;
  jobType: JobType;
  disabilityFriendlyType: DisabilityFriendlyType;
  headcount: number;
};

export async function createCompanyInquiry(
  input: CreateInquiryInput,
): Promise<{ data: CompanyInquiry }> {
  return {
    data: {
      id: `inq-mock-${Date.now()}`,
      companyId: MOCK_COMPANY_PROFILE.id,
      ...input,
      status: "terbuka",
      createdAt: new Date().toISOString(),
    },
  };
}

export async function fetchMyCompanyInquiries(): Promise<CompanyInquiry[]> {
  return [...MOCK_COMPANY_INQUIRIES].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export async function fetchCompanyInquiryById(
  id: string,
): Promise<CompanyInquiry | null> {
  return MOCK_COMPANY_INQUIRIES.find((inquiry) => inquiry.id === id) ?? null;
}

export async function updateCompanyInquiry(
  id: string,
  input: CreateInquiryInput,
): Promise<{ data: CompanyInquiry } | null> {
  const current = await fetchCompanyInquiryById(id);
  if (!current) {
    return null;
  }

  return {
    data: {
      ...current,
      ...input,
    },
  };
}

export async function updateCompanyInquiryStatus(
  id: string,
  status: InquiryStatus,
): Promise<{ data: CompanyInquiry } | null> {
  const current = await fetchCompanyInquiryById(id);
  if (!current) {
    return null;
  }

  return {
    data: {
      ...current,
      status,
    },
  };
}
