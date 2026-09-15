import type { JobSeekerDisabilityType } from "../db/job-seeker-schema.js";
import type { PlacementStatus } from "../db/placements-schema.js";

export type PlacementDto = {
  id: string;
  jobSeeker: {
    id: string;
    fullName: string;
    disabilityType: JobSeekerDisabilityType;
  };
  job: {
    id: string;
    title: string;
    companyId: string;
    companyName: string;
    location: string;
  };
  status: PlacementStatus;
  createdAt: string;
};

export type PlacementJoinRow = {
  id: string;
  status: PlacementStatus;
  created_at: Date;
  seeker_id: string;
  full_name: string;
  disability_type: JobSeekerDisabilityType;
  job_id: string;
  title: string;
  location: string;
  company_id: string;
  company_name: string;
};

export function mapPlacementRow(row: PlacementJoinRow): PlacementDto {
  return {
    id: row.id,
    jobSeeker: {
      id: row.seeker_id,
      fullName: row.full_name,
      disabilityType: row.disability_type,
    },
    job: {
      id: row.job_id,
      title: row.title,
      companyId: row.company_id,
      companyName: row.company_name,
      location: row.location,
    },
    status: row.status,
    createdAt: row.created_at.toISOString(),
  };
}
