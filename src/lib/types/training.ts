export type TrainingFormat = "daring" | "luring" | "hybrid";

export type TrainingEnrollmentStatus =
  | "terdaftar"
  | "berlangsung"
  | "selesai"
  | "dibatalkan";

export type Training = {
  id: string;
  title: string;
  summary: string;
  description: string;
  provider: string;
  format: TrainingFormat;
  durationLabel: string;
  skillTags: string[];
  accessibilityNotes: string;
  startsAt: string;
  seatsLeft: number;
};

export type TrainingEnrollment = {
  id: string;
  trainingId: string;
  status: TrainingEnrollmentStatus;
  enrolledAt: string;
};

export const TRAINING_FORMAT_LABEL: Record<TrainingFormat, string> = {
  daring: "Daring",
  luring: "Luring",
  hybrid: "Hybrid",
};

export const TRAINING_ENROLLMENT_STATUS_LABEL: Record<
  TrainingEnrollmentStatus,
  string
> = {
  terdaftar: "Terdaftar",
  berlangsung: "Berlangsung",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};
