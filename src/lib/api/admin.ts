import {
  MOCK_ADMIN_ACCOUNTS,
  adminAccountsStore,
} from "@/lib/mock/admin-accounts";
import { MOCK_ADMIN_COMPANIES } from "@/lib/mock/companies";
import { MOCK_COMPANY_PROFILES } from "@/lib/mock/company-profiles";
import { MOCK_COMPANY_INQUIRIES } from "@/lib/mock/inquiries";
import { MOCK_JOB_SEEKERS } from "@/lib/mock/job-seekers";
import { MOCK_JOB_SEEKER_PROFILES } from "@/lib/mock/job-seeker";
import type { AdminAccount } from "@/lib/types/admin-account";
import type { AdminCompanySummary, CompanyProfile } from "@/lib/types/company";
import type { CompanyInquiry } from "@/lib/types/inquiry";
import type { JobSeekerProfile } from "@/lib/types/job-seeker";

export type AdminDashboardSummary = {
  seekerCount: number;
  companyCount: number;
  inquiryCount: number;
  openInquiryCount: number;
};

/**
 * Kontrak yang diasumsikan:
 * GET /api/admin/ringkasan → { data: AdminDashboardSummary }
 */
export async function fetchAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  const openInquiryCount = MOCK_COMPANY_INQUIRIES.filter(
    (inquiry) => inquiry.status === "terbuka",
  ).length;

  return {
    seekerCount: MOCK_JOB_SEEKERS.length,
    companyCount: MOCK_ADMIN_COMPANIES.length,
    inquiryCount: MOCK_COMPANY_INQUIRIES.length,
    openInquiryCount,
  };
}

/**
 * Kontrak yang diasumsikan:
 * GET /api/admin/pencari-kerja/:id → { data: JobSeekerProfile }
 */
export async function fetchAdminJobSeekerProfile(
  id: string,
): Promise<JobSeekerProfile | null> {
  return (
    MOCK_JOB_SEEKER_PROFILES.find((profile) => profile.id === id) ?? null
  );
}

/**
 * Kontrak yang diasumsikan:
 * GET /api/admin/perusahaan → { data: AdminCompanySummary[] }
 */
export async function fetchAdminCompanies(): Promise<AdminCompanySummary[]> {
  return MOCK_ADMIN_COMPANIES;
}

/**
 * Kontrak yang diasumsikan:
 * GET /api/admin/perusahaan/:id → { data: CompanyProfile }
 */
export async function fetchAdminCompanyProfile(
  id: string,
): Promise<CompanyProfile | null> {
  return MOCK_COMPANY_PROFILES.find((profile) => profile.id === id) ?? null;
}

/**
 * Kontrak yang diasumsikan:
 * GET /api/admin/perusahaan/:id/inquiry → { data: CompanyInquiry[] }
 */
export async function fetchAdminCompanyInquiries(
  companyId: string,
): Promise<CompanyInquiry[]> {
  return MOCK_COMPANY_INQUIRIES.filter(
    (inquiry) => inquiry.companyId === companyId,
  ).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * Kontrak yang diasumsikan:
 * GET /api/admin/akun → { data: AdminAccount[] }
 */
export async function fetchAdminAccounts(): Promise<AdminAccount[]> {
  return [...adminAccountsStore].sort((a, b) => {
    if (a.kind !== b.kind) {
      return a.kind === "root" ? -1 : 1;
    }
    return a.fullName.localeCompare(b.fullName, "id");
  });
}

/**
 * Kontrak yang diasumsikan:
 * GET /api/admin/akun/:id → { data: AdminAccount }
 */
export async function fetchAdminAccount(
  id: string,
): Promise<AdminAccount | null> {
  return adminAccountsStore.find((account) => account.id === id) ?? null;
}

export type CreateAdminAccountInput = {
  fullName: string;
  email: string;
  /** Tidak disimpan di stub UI; hanya menandai kredensial dikirim. */
  password: string;
};

export type UpdateAdminAccountInput = {
  fullName: string;
  email: string;
  /** Opsional; jika diisi hanya mensimulasikan pergantian kata sandi. */
  password?: string;
};

/**
 * Kontrak yang diasumsikan:
 * POST /api/admin/akun → { data: AdminAccount }
 */
export async function createAdminAccount(
  input: CreateAdminAccountInput,
): Promise<{ data: AdminAccount } | { error: string }> {
  const email = input.email.trim().toLowerCase();
  if (adminAccountsStore.some((account) => account.email === email)) {
    return { error: "Email admin sudah terdaftar." };
  }

  const now = new Date().toISOString();
  const account: AdminAccount = {
    id: `adm-${String(adminAccountsStore.length + 1).padStart(3, "0")}`,
    fullName: input.fullName.trim(),
    email,
    kind: "admin",
    status: "aktif",
    createdAt: now,
    updatedAt: now,
  };
  adminAccountsStore.push(account);
  return { data: account };
}

/**
 * Kontrak yang diasumsikan:
 * PUT /api/admin/akun/:id → { data: AdminAccount }
 */
export async function updateAdminAccount(
  id: string,
  input: UpdateAdminAccountInput,
): Promise<{ data: AdminAccount } | { error: string } | null> {
  const account = adminAccountsStore.find((item) => item.id === id);
  if (!account) {
    return null;
  }

  const email = input.email.trim().toLowerCase();
  if (
    adminAccountsStore.some((item) => item.id !== id && item.email === email)
  ) {
    return { error: "Email admin sudah terdaftar." };
  }

  if (account.kind === "root" && email !== account.email) {
    return { error: "Email root admin tidak dapat diubah." };
  }

  account.fullName = input.fullName.trim();
  account.email = email;
  account.updatedAt = new Date().toISOString();
  return { data: { ...account } };
}

/**
 * Kontrak yang diasumsikan:
 * POST /api/admin/akun/:id/nonaktifkan|aktifkan → { data: AdminAccount }
 */
export async function setAdminAccountStatus(
  id: string,
  status: AdminAccount["status"],
): Promise<{ data: AdminAccount } | { error: string } | null> {
  const account = adminAccountsStore.find((item) => item.id === id);
  if (!account) {
    return null;
  }
  if (account.kind === "root") {
    return { error: "Akun root admin tidak dapat dinonaktifkan." };
  }

  account.status = status;
  account.updatedAt = new Date().toISOString();
  return { data: { ...account } };
}

/** Seed referensi; store runtime memakai adminAccountsStore. */
export { MOCK_ADMIN_ACCOUNTS };
