import {
  JOB_SEEKER_DISABILITY_LABEL,
  type JobSeekerDisabilityType,
} from "@/lib/types/job-seeker";
import type { JobSeekerSummary } from "@/lib/types/placement";

export type SeekerSearchFilters = {
  q: string;
  disabilitas: JobSeekerDisabilityType | "";
  kota: string;
  pilih: string;
};

export function parseSeekerSearchFilters(
  searchParams: Record<string, string | string[] | undefined>,
): SeekerSearchFilters {
  return {
    q: firstParam(searchParams.q),
    disabilitas: parseDisability(firstParam(searchParams.disabilitas)),
    kota: firstParam(searchParams.kota),
    pilih: firstParam(searchParams.pilih),
  };
}

export function filterSeekers(
  seekers: JobSeekerSummary[],
  filters: SeekerSearchFilters,
): JobSeekerSummary[] {
  const keyword = filters.q.trim().toLowerCase();

  return seekers.filter((seeker) => {
    if (keyword) {
      const haystack = `${seeker.fullName} ${seeker.skillNames.join(" ")}`.toLowerCase();
      if (!haystack.includes(keyword)) {
        return false;
      }
    }

    if (filters.disabilitas && seeker.disabilityType !== filters.disabilitas) {
      return false;
    }

    if (filters.kota && seeker.city !== filters.kota) {
      return false;
    }

    return true;
  });
}

export function uniqueSeekerCities(seekers: JobSeekerSummary[]): string[] {
  return [...new Set(seekers.map((seeker) => seeker.city))].sort((a, b) =>
    a.localeCompare(b, "id"),
  );
}

export function hasActiveSeekerFilters(filters: SeekerSearchFilters): boolean {
  return Boolean(filters.q.trim() || filters.disabilitas || filters.kota);
}

export function seekerSearchHref(
  filters: Partial<SeekerSearchFilters>,
  basePath = "/admin/penyaluran",
): string {
  const params = new URLSearchParams();

  if (filters.q?.trim()) {
    params.set("q", filters.q.trim());
  }
  if (filters.disabilitas) {
    params.set("disabilitas", filters.disabilitas);
  }
  if (filters.kota) {
    params.set("kota", filters.kota);
  }
  if (filters.pilih) {
    params.set("pilih", filters.pilih);
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export const SEEKER_DISABILITY_FILTER_OPTIONS = (
  Object.keys(JOB_SEEKER_DISABILITY_LABEL) as JobSeekerDisabilityType[]
).map((value) => ({
  value,
  label: JOB_SEEKER_DISABILITY_LABEL[value],
}));

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

function parseDisability(value: string): JobSeekerDisabilityType | "" {
  return value in JOB_SEEKER_DISABILITY_LABEL
    ? (value as JobSeekerDisabilityType)
    : "";
}
