import { apiGet, apiSend, isApiError } from "@/lib/api/http";
import type { CompanyInquiry, InquiryStatus } from "@/lib/types/inquiry";
import type { DisabilityFriendlyType, JobType } from "@/lib/types/job";

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
): Promise<{ data: CompanyInquiry } | { error: string }> {
  try {
    const data = await apiSend<CompanyInquiry>(
      "/api/me/company/inquiries",
      "POST",
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

export async function fetchMyCompanyInquiries(): Promise<CompanyInquiry[]> {
  return apiGet<CompanyInquiry[]>("/api/me/company/inquiries");
}

export async function fetchCompanyInquiryById(
  id: string,
): Promise<CompanyInquiry | null> {
  try {
    return await apiGet<CompanyInquiry>(`/api/me/company/inquiries/${id}`);
  } catch (error) {
    if (isApiError(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function updateCompanyInquiry(
  id: string,
  input: CreateInquiryInput,
): Promise<{ data: CompanyInquiry } | { error: string } | null> {
  try {
    const data = await apiSend<CompanyInquiry>(
      `/api/me/company/inquiries/${id}`,
      "PATCH",
      input,
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

export async function updateCompanyInquiryStatus(
  id: string,
  status: Extract<InquiryStatus, "menunggu" | "ditutup">,
): Promise<{ data: CompanyInquiry } | { error: string } | null> {
  try {
    const data = await apiSend<CompanyInquiry>(
      `/api/me/company/inquiries/${id}/status`,
      "PATCH",
      { status },
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
