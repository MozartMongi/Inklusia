import type { DisabilityFriendlyType, JobType } from "@/lib/types/job";

export type InquiryStatus = "menunggu" | "disetujui" | "ditolak" | "ditutup";

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
  reviewNote: string;
  reviewedAt: string | null;
  submittedAt: string;
  createdAt: string;
};

export type AdminInquiry = CompanyInquiry & {
  company: { id: string; name: string; industry: string; address: string };
  jobId: string | null;
};

export const INQUIRY_STATUS_LABEL: Record<InquiryStatus, string> = {
  menunggu: "Menunggu persetujuan",
  disetujui: "Disetujui & tayang",
  ditolak: "Ditolak",
  ditutup: "Ditutup",
};
