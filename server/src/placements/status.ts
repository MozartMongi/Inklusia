import {
  PLACEMENT_STATUSES,
  type PlacementStatus,
} from "../db/placements-schema.js";

export type StatusInput = {
  status: PlacementStatus | "";
};

export type StatusErrors = Partial<Record<keyof StatusInput, string>>;

function isPlacementStatus(value: string): value is PlacementStatus {
  return PLACEMENT_STATUSES.includes(value as PlacementStatus);
}

export function parseStatusBody(body: unknown): StatusInput {
  const source = body && typeof body === "object" ? body : {};
  const record = source as Record<string, unknown>;
  const status = typeof record.status === "string" ? record.status.trim() : "";

  return {
    status: isPlacementStatus(status) ? status : "",
  };
}

export function validateStatusInput(values: StatusInput): StatusErrors {
  const errors: StatusErrors = {};
  if (!values.status) {
    errors.status = "Status penyaluran wajib dipilih.";
  }
  return errors;
}
