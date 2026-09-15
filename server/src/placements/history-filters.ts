import {
  PLACEMENT_STATUSES,
  type PlacementStatus,
} from "../db/placements-schema.js";

export type PlacementHistoryFilters = {
  q: string;
  status: PlacementStatus | "";
  perusahaan: string;
};

const statusSet = new Set<string>(PLACEMENT_STATUSES);

export function parsePlacementHistoryFilters(
  query: Record<string, unknown>,
): PlacementHistoryFilters {
  const status = firstString(query.status);
  return {
    q: firstString(query.q).trim(),
    status: statusSet.has(status) ? (status as PlacementStatus) : "",
    perusahaan: firstString(query.perusahaan).trim(),
  };
}

function firstString(value: unknown): string {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : "";
  }
  return typeof value === "string" ? value : "";
}
