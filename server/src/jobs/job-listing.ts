import type { DisabilityFriendlyType, JobType } from "../db/jobs-schema.js";

export type JobListing = {
  id: string;
  title: string;
  description: string;
  requirements: string;
  disabilityFriendlyType: DisabilityFriendlyType;
  location: string;
  jobType: JobType;
  isActive: boolean;
  createdAt: string;
  company: {
    id: string;
    name: string;
    industry: string;
    address: string;
  };
};

export type JobListRow = {
  id: string;
  title: string;
  description: string;
  requirements: string;
  disability_friendly_type: DisabilityFriendlyType;
  location: string;
  job_type: JobType;
  is_active: boolean;
  created_at: Date;
  company_id: string;
  company_name: string;
  industry: string;
  address: string;
};

export function mapJobRow(row: JobListRow): JobListing {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    requirements: row.requirements,
    disabilityFriendlyType: row.disability_friendly_type,
    location: row.location,
    jobType: row.job_type,
    isActive: row.is_active,
    createdAt: row.created_at.toISOString(),
    company: {
      id: row.company_id,
      name: row.company_name,
      industry: row.industry,
      address: row.address,
    },
  };
}
