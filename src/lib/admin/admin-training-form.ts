import type { TrainingFormat } from "@/lib/types/training";

export type AdminTrainingFormValues = {
  title: string;
  summary: string;
  description: string;
  provider: string;
  format: TrainingFormat | "";
  durationLabel: string;
  skillTags: string;
  accessibilityNotes: string;
  startsAt: string;
  endsAt: string;
  seatsTotal: string;
  isPublished: boolean;
};

export type AdminTrainingFormErrors = Partial<
  Record<keyof AdminTrainingFormValues, string>
>;

export const EMPTY_ADMIN_TRAINING_FORM: AdminTrainingFormValues = {
  title: "",
  summary: "",
  description: "",
  provider: "",
  format: "",
  durationLabel: "",
  skillTags: "",
  accessibilityNotes: "",
  startsAt: "",
  endsAt: "",
  seatsTotal: "",
  isPublished: true,
};

export const ADMIN_TRAINING_FORMAT_OPTIONS: {
  value: TrainingFormat;
  label: string;
}[] = [
  { value: "daring", label: "Daring" },
  { value: "luring", label: "Luring" },
  { value: "hybrid", label: "Hybrid" },
];

const FIELD_ORDER: (keyof AdminTrainingFormValues)[] = [
  "title",
  "summary",
  "description",
  "provider",
  "format",
  "durationLabel",
  "skillTags",
  "accessibilityNotes",
  "startsAt",
  "endsAt",
  "seatsTotal",
];

export function firstAdminTrainingFormErrorField(
  errors: AdminTrainingFormErrors,
): keyof AdminTrainingFormValues | null {
  return FIELD_ORDER.find((field) => errors[field]) ?? null;
}

export function validateAdminTrainingForm(
  values: AdminTrainingFormValues,
): AdminTrainingFormErrors {
  const errors: AdminTrainingFormErrors = {};

  if (!values.title.trim()) errors.title = "Judul pelatihan wajib diisi.";
  if (!values.summary.trim()) errors.summary = "Ringkasan wajib diisi.";
  if (!values.description.trim()) {
    errors.description = "Deskripsi wajib diisi.";
  }
  if (!values.provider.trim()) errors.provider = "Penyelenggara wajib diisi.";
  if (
    values.format !== "daring" &&
    values.format !== "luring" &&
    values.format !== "hybrid"
  ) {
    errors.format = "Pilih format pelatihan.";
  }
  if (!values.durationLabel.trim()) {
    errors.durationLabel = "Durasi wajib diisi.";
  }
  if (!values.accessibilityNotes.trim()) {
    errors.accessibilityNotes = "Catatan aksesibilitas wajib diisi.";
  }
  if (!values.startsAt.trim()) {
    errors.startsAt = "Tanggal mulai wajib diisi.";
  }
  if (!values.endsAt.trim()) {
    errors.endsAt = "Tanggal selesai wajib diisi.";
  }

  const startsAt = values.startsAt ? new Date(values.startsAt) : null;
  const endsAt = values.endsAt ? new Date(values.endsAt) : null;
  if (startsAt && Number.isNaN(startsAt.getTime())) {
    errors.startsAt = "Tanggal mulai tidak valid.";
  }
  if (endsAt && Number.isNaN(endsAt.getTime())) {
    errors.endsAt = "Tanggal selesai tidak valid.";
  }
  if (
    startsAt &&
    endsAt &&
    !Number.isNaN(startsAt.getTime()) &&
    !Number.isNaN(endsAt.getTime()) &&
    endsAt < startsAt
  ) {
    errors.endsAt =
      "Tanggal selesai harus sama dengan atau setelah tanggal mulai.";
  }

  const seats = Number.parseInt(values.seatsTotal.trim(), 10);
  if (!values.seatsTotal.trim() || Number.isNaN(seats) || seats < 1) {
    errors.seatsTotal = "Kuota minimal 1 peserta.";
  }

  return errors;
}

export function adminTrainingFormToPayload(values: AdminTrainingFormValues) {
  return {
    title: values.title.trim(),
    summary: values.summary.trim(),
    description: values.description.trim(),
    provider: values.provider.trim(),
    format: values.format as TrainingFormat,
    durationLabel: values.durationLabel.trim(),
    skillTags: values.skillTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    accessibilityNotes: values.accessibilityNotes.trim(),
    startsAt: new Date(values.startsAt).toISOString(),
    endsAt: new Date(values.endsAt).toISOString(),
    seatsTotal: Number.parseInt(values.seatsTotal.trim(), 10),
    isPublished: values.isPublished,
  };
}
