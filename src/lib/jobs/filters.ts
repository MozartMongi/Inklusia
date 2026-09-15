import {
  DISABILITY_FRIENDLY_LABEL,
  JOB_TYPE_LABEL,
  type DisabilityFriendlyType,
  type JobListing,
  type JobType,
} from "@/lib/types/job";

export type JobSearchFilters = {
  q: string;
  disabilitas: DisabilityFriendlyType | "";
  lokasi: string;
  jenis: JobType | "";
};

export function parseJobSearchFilters(
  searchParams: Record<string, string | string[] | undefined>,
): JobSearchFilters {
  return {
    q: firstParam(searchParams.q),
    disabilitas: parseDisability(firstParam(searchParams.disabilitas)),
    lokasi: firstParam(searchParams.lokasi),
    jenis: parseJobType(firstParam(searchParams.jenis)),
  };
}

export function filterJobs(
  jobs: JobListing[],
  filters: JobSearchFilters,
): JobListing[] {
  const keyword = filters.q.trim().toLowerCase();

  return jobs.filter((job) => {
    if (keyword) {
      const haystack = `${job.title} ${job.company.name}`.toLowerCase();
      if (!haystack.includes(keyword)) {
        return false;
      }
    }

    if (filters.disabilitas) {
      const matchesType = job.disabilityFriendlyType === filters.disabilitas;
      const openToAll = job.disabilityFriendlyType === "semua";
      if (!matchesType && !openToAll) {
        return false;
      }
    }

    if (filters.lokasi && job.location !== filters.lokasi) {
      return false;
    }

    if (filters.jenis && job.jobType !== filters.jenis) {
      return false;
    }

    return true;
  });
}

export function uniqueJobLocations(jobs: JobListing[]): string[] {
  return [...new Set(jobs.map((job) => job.location))].sort((a, b) =>
    a.localeCompare(b, "id"),
  );
}

export function hasActiveFilters(filters: JobSearchFilters): boolean {
  return Boolean(
    filters.q.trim() ||
      filters.disabilitas ||
      filters.lokasi ||
      filters.jenis,
  );
}

export const DISABILITY_FILTER_OPTIONS = (
  Object.keys(DISABILITY_FRIENDLY_LABEL) as DisabilityFriendlyType[]
).map((value) => ({
  value,
  label: DISABILITY_FRIENDLY_LABEL[value],
}));

export const JOB_TYPE_FILTER_OPTIONS = (
  Object.keys(JOB_TYPE_LABEL) as JobType[]
).map((value) => ({
  value,
  label: JOB_TYPE_LABEL[value],
}));

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

function parseDisability(value: string): DisabilityFriendlyType | "" {
  return value in DISABILITY_FRIENDLY_LABEL
    ? (value as DisabilityFriendlyType)
    : "";
}

function parseJobType(value: string): JobType | "" {
  return value in JOB_TYPE_LABEL ? (value as JobType) : "";
}
