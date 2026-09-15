import {
  filterJobs,
  parseJobSearchFilters,
  type JobSearchFilters,
} from "@/lib/jobs/filters";
import { MOCK_JOBS } from "@/lib/mock/jobs";
import type { JobListing } from "@/lib/types/job";

/**
 * Kontrak API yang diasumsikan frontend:
 * GET /api/jobs?q=&disabilitas=&lokasi=&jenis= → { data: JobListing[] }
 * GET /api/jobs/:id → { data: JobListing }
 * Saat ini memakai data tiruan sampai backend Express siap.
 */
export async function fetchJobs(
  searchParams: Record<string, string | string[] | undefined> = {},
): Promise<{ jobs: JobListing[]; filters: JobSearchFilters }> {
  const filters = parseJobSearchFilters(searchParams);
  const activeJobs = MOCK_JOBS.filter((job) => job.isActive);
  return { jobs: filterJobs(activeJobs, filters), filters };
}

export async function fetchJobById(id: string): Promise<JobListing | null> {
  return MOCK_JOBS.find((job) => job.id === id && job.isActive) ?? null;
}

export async function fetchActiveJobs(): Promise<JobListing[]> {
  return MOCK_JOBS.filter((job) => job.isActive);
}
