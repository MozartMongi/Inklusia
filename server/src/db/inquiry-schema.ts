import {
  DISABILITY_FRIENDLY_TYPES,
  JOB_TYPES,
  type DisabilityFriendlyType,
  type JobType,
} from "./jobs-schema.js";

export const INQUIRY_STATUSES = ["terbuka", "ditutup"] as const;

export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const INQUIRY_STATUS_LABEL: Record<InquiryStatus, string> = {
  terbuka: "Terbuka",
  ditutup: "Ditutup",
};

export type CompanyInquiryRow = {
  id: string;
  company_id: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  job_type: JobType;
  disability_friendly_type: DisabilityFriendlyType;
  headcount: number;
  status: InquiryStatus;
  created_at: Date;
  updated_at: Date;
};

/** Payload API inquiry (camelCase, selaras frontend). */
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

export function mapCompanyInquiryRow(row: CompanyInquiryRow): CompanyInquiry {
  return {
    id: row.id,
    companyId: row.company_id,
    title: row.title,
    description: row.description,
    requirements: row.requirements,
    location: row.location,
    jobType: row.job_type,
    disabilityFriendlyType: row.disability_friendly_type,
    headcount: row.headcount,
    status: row.status,
    createdAt: row.created_at.toISOString(),
  };
}

export function isInquiryStatus(value: string): value is InquiryStatus {
  return (INQUIRY_STATUSES as readonly string[]).includes(value);
}

export function isInquiryJobType(value: string): value is JobType {
  return (JOB_TYPES as readonly string[]).includes(value);
}

export function isInquiryDisabilityFriendlyType(
  value: string,
): value is DisabilityFriendlyType {
  return (DISABILITY_FRIENDLY_TYPES as readonly string[]).includes(value);
}
