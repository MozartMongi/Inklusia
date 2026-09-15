import { MOCK_COMPANY_PROFILE } from "@/lib/mock/company";
import type { CompanyProfile } from "@/lib/types/company";

/**
 * Kontrak API yang diasumsikan frontend:
 * GET /api/me/company → { data: CompanyProfile }
 * Saat ini memakai data tiruan sampai autentikasi Express siap.
 */
export async function fetchMyCompanyProfile(): Promise<CompanyProfile> {
  return MOCK_COMPANY_PROFILE;
}

export type CompanyProfileInput = {
  name: string;
  address: string;
  industry: string;
  nib: string;
  contactPerson: CompanyProfile["contactPerson"];
};

/**
 * Kontrak yang diasumsikan: PATCH /api/me/company
 * → { data: CompanyProfile }
 */
export async function saveCompanyProfile(
  input: CompanyProfileInput,
): Promise<{ data: CompanyProfile }> {
  return {
    data: {
      ...MOCK_COMPANY_PROFILE,
      ...input,
      updatedAt: new Date().toISOString(),
    },
  };
}
