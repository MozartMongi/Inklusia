import { apiGet, apiSend, isApiError, searchQuery } from "@/lib/api/http";
import type { CompanySearchFilters } from "@/lib/admin/company-filters";
import type { SeekerSearchFilters } from "@/lib/placements/seeker-filters";
import type { AdminAccount } from "@/lib/types/admin-account";
import type { AdminCompanySummary, CompanyProfile } from "@/lib/types/company";
import type { AdminInquiry, CompanyInquiry } from "@/lib/types/inquiry";
import type { JobSeekerProfile } from "@/lib/types/job-seeker";
import type { JobSeekerSummary } from "@/lib/types/placement";

export type AdminDashboardSummary = {
  seekerCount: number;
  companyCount: number;
  inquiryCount: number;
  openInquiryCount: number;
  pendingInquiryCount: number;
  publishedJobCount: number;
};

export type AdminCompanyDirectory = {
  companies: AdminCompanySummary[];
  cities: string[];
  industries: string[];
  filters: CompanySearchFilters;
};

export type AdminSeekerDirectory = {
  seekers: JobSeekerSummary[];
  cities: string[];
  filters: SeekerSearchFilters;
};

export type AdminInquiryQueue = {
  inquiries: AdminInquiry[];
  status: string;
};

export async function fetchAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  return apiGet<AdminDashboardSummary>("/api/admin/ringkasan");
}

export async function fetchAdminSeekers(
  searchParams: Record<string, string | string[] | undefined> = {},
): Promise<AdminSeekerDirectory> {
  return apiGet<AdminSeekerDirectory>(
    `/api/admin/pencari-kerja${searchQuery(searchParams)}`,
  );
}

export async function fetchAdminJobSeekerProfile(
  id: string,
): Promise<JobSeekerProfile | null> {
  try {
    return await apiGet<JobSeekerProfile>(`/api/admin/pencari-kerja/${id}`);
  } catch (error) {
    if (isApiError(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function fetchAdminCompanyDirectory(
  searchParams: Record<string, string | string[] | undefined> = {},
): Promise<AdminCompanyDirectory> {
  return apiGet<AdminCompanyDirectory>(
    `/api/admin/perusahaan${searchQuery(searchParams)}`,
  );
}

export async function fetchAdminCompanies(): Promise<AdminCompanySummary[]> {
  const directory = await fetchAdminCompanyDirectory();
  return directory.companies;
}

export async function fetchAdminCompanyProfile(
  id: string,
): Promise<CompanyProfile | null> {
  try {
    return await apiGet<CompanyProfile>(`/api/admin/perusahaan/${id}`);
  } catch (error) {
    if (isApiError(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function fetchAdminCompanyInquiries(
  companyId: string,
): Promise<CompanyInquiry[]> {
  try {
    return await apiGet<CompanyInquiry[]>(
      `/api/admin/perusahaan/${companyId}/inquiry`,
    );
  } catch (error) {
    if (isApiError(error) && error.status === 404) {
      return [];
    }
    throw error;
  }
}

export async function fetchAdminInquiries(
  status = "menunggu",
): Promise<AdminInquiryQueue> {
  return apiGet<AdminInquiryQueue>(
    `/api/admin/kebutuhan${searchQuery({ status })}`,
  );
}

export async function reviewAdminInquiry(
  id: string,
  input: { keputusan: "disetujui" | "ditolak"; catatan: string },
): Promise<{ data: AdminInquiry } | { error: string }> {
  try {
    const data = await apiSend<AdminInquiry>(
      `/api/admin/kebutuhan/${id}/tinjau`,
      "PATCH",
      input,
    );
    return { data };
  } catch (error) {
    if (isApiError(error)) {
      return { error: error.message };
    }
    throw error;
  }
}

export async function fetchAdminAccounts(): Promise<AdminAccount[]> {
  return apiGet<AdminAccount[]>("/api/admin/akun");
}

export async function fetchAdminAccount(
  id: string,
): Promise<AdminAccount | null> {
  try {
    return await apiGet<AdminAccount>(`/api/admin/akun/${id}`);
  } catch (error) {
    if (isApiError(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export type CreateAdminAccountInput = {
  fullName: string;
  email: string;
  password: string;
};

export type UpdateAdminAccountInput = {
  fullName: string;
  email: string;
  password?: string;
};

export async function createAdminAccount(
  input: CreateAdminAccountInput,
): Promise<{ data: AdminAccount } | { error: string }> {
  try {
    const data = await apiSend<AdminAccount>("/api/admin/akun", "POST", input);
    return { data };
  } catch (error) {
    if (isApiError(error)) {
      return { error: error.message };
    }
    throw error;
  }
}

export async function updateAdminAccount(
  id: string,
  input: UpdateAdminAccountInput,
): Promise<{ data: AdminAccount } | { error: string } | null> {
  try {
    const data = await apiSend<AdminAccount>(`/api/admin/akun/${id}`, "PUT", input);
    return { data };
  } catch (error) {
    if (isApiError(error) && error.status === 404) {
      return null;
    }
    if (isApiError(error)) {
      return { error: error.message };
    }
    throw error;
  }
}

export async function setAdminAccountStatus(
  id: string,
  status: AdminAccount["status"],
): Promise<{ data: AdminAccount } | { error: string } | null> {
  const action = status === "nonaktif" ? "nonaktifkan" : "aktifkan";
  try {
    const data = await apiSend<AdminAccount>(
      `/api/admin/akun/${id}/${action}`,
      "POST",
    );
    return { data };
  } catch (error) {
    if (isApiError(error) && error.status === 404) {
      return null;
    }
    if (isApiError(error)) {
      return { error: error.message };
    }
    throw error;
  }
}
