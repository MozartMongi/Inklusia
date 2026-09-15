import {
  PLACEMENT_STATUS_LABEL,
  type Placement,
  type PlacementStatus,
} from "@/lib/types/placement";

export type PlacementHistoryFilters = {
  q: string;
  status: PlacementStatus | "";
  perusahaan: string;
};

export function parsePlacementHistoryFilters(
  searchParams: Record<string, string | string[] | undefined>,
): PlacementHistoryFilters {
  return {
    q: firstParam(searchParams.q),
    status: parseStatus(firstParam(searchParams.status)),
    perusahaan: firstParam(searchParams.perusahaan),
  };
}

export function filterPlacements(
  placements: Placement[],
  filters: PlacementHistoryFilters,
): Placement[] {
  const keyword = filters.q.trim().toLowerCase();

  return placements.filter((placement) => {
    if (keyword) {
      const haystack =
        `${placement.jobSeeker.fullName} ${placement.job.title} ${placement.job.companyName}`.toLowerCase();
      if (!haystack.includes(keyword)) {
        return false;
      }
    }

    if (filters.status && placement.status !== filters.status) {
      return false;
    }

    if (filters.perusahaan && placement.job.companyName !== filters.perusahaan) {
      return false;
    }

    return true;
  });
}

export function uniquePlacementCompanies(placements: Placement[]): string[] {
  return [
    ...new Set(placements.map((placement) => placement.job.companyName)),
  ].sort((a, b) => a.localeCompare(b, "id"));
}

export function hasActiveHistoryFilters(
  filters: PlacementHistoryFilters,
): boolean {
  return Boolean(filters.q.trim() || filters.status || filters.perusahaan);
}

export function placementHistoryHref(
  filters: Partial<PlacementHistoryFilters>,
): string {
  const params = new URLSearchParams();

  if (filters.q?.trim()) {
    params.set("q", filters.q.trim());
  }
  if (filters.status) {
    params.set("status", filters.status);
  }
  if (filters.perusahaan) {
    params.set("perusahaan", filters.perusahaan);
  }

  const query = params.toString();
  return query
    ? `/admin/penyaluran/riwayat?${query}`
    : "/admin/penyaluran/riwayat";
}

export const PLACEMENT_STATUS_FILTER_OPTIONS = (
  Object.keys(PLACEMENT_STATUS_LABEL) as PlacementStatus[]
).map((value) => ({
  value,
  label: PLACEMENT_STATUS_LABEL[value],
}));

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

function parseStatus(value: string): PlacementStatus | "" {
  return value in PLACEMENT_STATUS_LABEL ? (value as PlacementStatus) : "";
}
