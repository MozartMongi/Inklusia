import type { DisabilityFriendlyType, JobType } from "@/lib/types/job";

export type InquiryStatus = "terbuka" | "ditutup";

export type CompanyInquiry = {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  jobType: JobType;
  disabilityFriendlyType: DisabilityFriendlyType;
  headcount: number;
  status: InquiryStatus;
  createdAt: string;
};

export const INQUIRY_STATUS_LABEL: Record<InquiryStatus, string> = {
  terbuka: "Terbuka",
  ditutup: "Ditutup",
};
