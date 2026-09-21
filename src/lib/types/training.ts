import type { JobSeekerDisabilityType } from "@/lib/types/job-seeker";

export type TrainingFormat = "daring" | "luring" | "hybrid";

export type TrainingEnrollmentStatus =
  | "terdaftar"
  | "berlangsung"
  | "selesai"
  | "dibatalkan";

export type TrainingScheduleStatus =
  | "akan_datang"
  | "berlangsung"
  | "berakhir";

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
  endsAt: string;
  seatsLeft: number;
};

export type TrainingEnrollment = {
  id: string;
  trainingId: string;
  status: TrainingEnrollmentStatus;
  enrolledAt: string;
};

export type AdminTraining = {
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
  endsAt: string;
  seatsTotal: number;
  seatsLeft: number;
  isPublished: boolean;
  scheduleStatus: TrainingScheduleStatus;
  enrollmentCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminTrainingEnrollment = {
  id: string;
  status: TrainingEnrollmentStatus;
  enrolledAt: string;
  seeker: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    city: string;
    disabilityType: JobSeekerDisabilityType;
  };
};

export type AdminTrainingDetail = AdminTraining & {
  enrollments: AdminTrainingEnrollment[];
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

export const TRAINING_SCHEDULE_STATUS_LABEL: Record<
  TrainingScheduleStatus,
  string
> = {
  akan_datang: "Akan datang",
  berlangsung: "Sedang berjalan",
  berakhir: "Sudah berakhir",
};
