/**
 * Skema TypeScript untuk tabel `trainings` dan `training_enrollments`
 * (migrasi 015_create_trainings.sql).
 */

export const TRAINING_FORMATS = ["daring", "luring", "hybrid"] as const;
export type TrainingFormat = (typeof TRAINING_FORMATS)[number];

export const TRAINING_ENROLLMENT_STATUSES = [
  "terdaftar",
  "berlangsung",
  "selesai",
  "dibatalkan",
] as const;
export type TrainingEnrollmentStatus =
  (typeof TRAINING_ENROLLMENT_STATUSES)[number];

export type TrainingRow = {
  id: string;
  title: string;
  summary: string;
  description: string;
  provider: string;
  format: TrainingFormat;
  duration_label: string;
  skill_tags: string[];
  accessibility_notes: string;
  starts_at: Date;
  seats_total: number;
  seats_left: number;
  is_published: boolean;
  created_at: Date;
  updated_at: Date;
};

export type TrainingEnrollmentRow = {
  id: string;
  training_id: string;
  job_seeker_profile_id: string;
  status: TrainingEnrollmentStatus;
  enrolled_at: Date;
  created_at: Date;
  updated_at: Date;
};

/** Payload API katalog (camelCase, selaras frontend). */
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

export function mapTrainingRow(row: TrainingRow): Training {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    description: row.description,
    provider: row.provider,
    format: row.format,
    durationLabel: row.duration_label,
    skillTags: row.skill_tags ?? [],
    accessibilityNotes: row.accessibility_notes,
    startsAt: row.starts_at.toISOString(),
    seatsLeft: row.seats_left,
  };
}

export function mapTrainingEnrollmentRow(
  row: TrainingEnrollmentRow,
): TrainingEnrollment {
  return {
    id: row.id,
    trainingId: row.training_id,
    status: row.status,
    enrolledAt: row.enrolled_at.toISOString(),
  };
}

export function isTrainingFormat(value: string): value is TrainingFormat {
  return (TRAINING_FORMATS as readonly string[]).includes(value);
}

export function isTrainingEnrollmentStatus(
  value: string,
): value is TrainingEnrollmentStatus {
  return (TRAINING_ENROLLMENT_STATUSES as readonly string[]).includes(value);
}
