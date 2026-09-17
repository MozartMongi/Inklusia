import { apiGet, isApiError, isUnavailableError, searchQuery } from "@/lib/api/http";
import {
  parseJobSearchFilters,
  type JobSearchFilters,
} from "@/lib/jobs/filters";
import type { JobListing } from "@/lib/types/job";

export type JobFilterOptions = {
  lokasi: string[];
  disabilitas: Array<{ value: string; label: string }>;
  jenis: Array<{ value: string; label: string }>;
};

export async function fetchJobs(
  searchParams: Record<string, string | string[] | undefined> = {},
): Promise<{
  jobs: JobListing[];
  filters: JobSearchFilters;
  unavailable: boolean;
}> {
  const filters = parseJobSearchFilters(searchParams);
  try {
    const jobs = await apiGet<JobListing[]>(
      `/api/jobs${searchQuery({
        q: filters.q,
        disabilitas: filters.disabilitas,
        lokasi: filters.lokasi,
        jenis: filters.jenis,
      })}`,
    );
    return { jobs, filters, unavailable: false };
  } catch (error) {
    if (isUnavailableError(error)) {
      return { jobs: [], filters, unavailable: true };
    }
    throw error;
  }
}

export async function fetchJobById(id: string): Promise<JobListing | null> {
  try {
    return await apiGet<JobListing>(`/api/jobs/${id}`);
  } catch (error) {
    if (isApiError(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function fetchJobFilterOptions(): Promise<JobFilterOptions> {
  try {
    return await apiGet<JobFilterOptions>("/api/jobs/filters");
  } catch (error) {
    if (isUnavailableError(error)) {
      return { lokasi: [], disabilitas: [], jenis: [] };
    }
    throw error;
  }
}
