import {
  DISABILITY_FRIENDLY_TYPES,
  JOB_TYPES,
  type DisabilityFriendlyType,
  type JobType,
} from "../db/jobs-schema.js";

export type JobListFilters = {
  q: string;
  disabilitas: DisabilityFriendlyType | "";
  lokasi: string;
  jenis: JobType | "";
};

const disabilitySet = new Set<string>(DISABILITY_FRIENDLY_TYPES);
const jobTypeSet = new Set<string>(JOB_TYPES);

export function parseJobListFilters(
  query: Record<string, unknown>,
): JobListFilters {
  return {
    q: firstString(query.q).trim(),
    disabilitas: parseDisability(firstString(query.disabilitas)),
    lokasi: firstString(query.lokasi).trim(),
    jenis: parseJobType(firstString(query.jenis)),
  };
}

function firstString(value: unknown): string {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : "";
  }
  return typeof value === "string" ? value : "";
}

function parseDisability(value: string): DisabilityFriendlyType | "" {
  return disabilitySet.has(value) ? (value as DisabilityFriendlyType) : "";
}

function parseJobType(value: string): JobType | "" {
  return jobTypeSet.has(value) ? (value as JobType) : "";
}
