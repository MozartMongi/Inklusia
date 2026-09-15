import { isUuid } from "../db/ids.js";
import { PLACEMENT_NOTE_MAX_LENGTH } from "../db/placements-schema.js";

export type ForwardInput = {
  jobSeekerId: string;
  jobId: string;
  note: string;
};

export type ForwardErrors = Partial<Record<keyof ForwardInput, string>>;

export function parseForwardBody(body: unknown): ForwardInput {
  const source = body && typeof body === "object" ? body : {};
  const record = source as Record<string, unknown>;

  return {
    jobSeekerId:
      typeof record.jobSeekerId === "string" ? record.jobSeekerId.trim() : "",
    jobId: typeof record.jobId === "string" ? record.jobId.trim() : "",
    note: typeof record.note === "string" ? record.note : "",
  };
}

export function validateForwardInput(values: ForwardInput): ForwardErrors {
  const errors: ForwardErrors = {};

  if (!values.jobSeekerId) {
    errors.jobSeekerId = "Pilih pencari kerja yang akan disalurkan.";
  } else if (!isUuid(values.jobSeekerId)) {
    errors.jobSeekerId = "Pencari kerja tidak valid.";
  }

  if (!values.jobId) {
    errors.jobId = "Pilih lowongan tujuan penyaluran.";
  } else if (!isUuid(values.jobId)) {
    errors.jobId = "Lowongan tidak valid.";
  }

  if (values.note.trim().length > PLACEMENT_NOTE_MAX_LENGTH) {
    errors.note = `Catatan maksimal ${PLACEMENT_NOTE_MAX_LENGTH} karakter.`;
  }

  return errors;
}
