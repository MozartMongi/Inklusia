import { apiGet, apiSend, isApiError } from "@/lib/api/http";
import type { CompanyProfile } from "@/lib/types/company";

export async function fetchMyCompanyProfile(): Promise<CompanyProfile> {
  return apiGet<CompanyProfile>("/api/me/company");
}

export type CompanyProfileInput = {
  name: string;
  address: string;
  industry: string;
  nib: string;
  contactPerson: CompanyProfile["contactPerson"];
};

export async function saveCompanyProfile(
  input: CompanyProfileInput,
): Promise<{ data: CompanyProfile } | { error: string }> {
  try {
    const data = await apiSend<CompanyProfile>("/api/me/company", "PATCH", input);
    return { data };
  } catch (error) {
    if (isApiError(error)) {
      return { error: error.message };
    }
    throw error;
  }
}
