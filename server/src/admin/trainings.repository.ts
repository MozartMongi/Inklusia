import { isUuid } from "../db/ids.js";
import { pool } from "../db/pool.js";
import type { JobSeekerDisabilityType } from "../db/job-seeker-schema.js";
import {
  computeTrainingScheduleStatus,
  isTrainingFormat,
  type TrainingEnrollmentStatus,
  type TrainingFormat,
  type TrainingRow,
  type TrainingScheduleStatus,
} from "../db/training-schema.js";
import { cityFromAddress } from "../placements/seeker-summary.js";

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

export type CreateAdminTrainingInput = {
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
  isPublished: boolean;
};

type AdminTrainingListRow = TrainingRow & {
  enrollment_count: string;
};

type AdminEnrollmentRow = {
  id: string;
  status: TrainingEnrollmentStatus;
  enrolled_at: Date;
  profile_id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  disability_type: JobSeekerDisabilityType;
};

function mapAdminTraining(
  row: TrainingRow,
  enrollmentCount: number,
): AdminTraining {
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
    endsAt: row.ends_at.toISOString(),
    seatsTotal: row.seats_total,
    seatsLeft: row.seats_left,
    isPublished: row.is_published,
    scheduleStatus: computeTrainingScheduleStatus(row.starts_at, row.ends_at),
    enrollmentCount,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listAdminTrainings(): Promise<AdminTraining[]> {
  const { rows } = await pool.query<AdminTrainingListRow>(
    `
    SELECT
      t.id,
      t.title,
      t.summary,
      t.description,
      t.provider,
      t.format,
      t.duration_label,
      t.skill_tags,
      t.accessibility_notes,
      t.starts_at,
      t.ends_at,
      t.seats_total,
      t.seats_left,
      t.is_published,
      t.created_at,
      t.updated_at,
      (
        SELECT COUNT(*)::text
        FROM training_enrollments e
        WHERE e.training_id = t.id
          AND e.status <> 'dibatalkan'
      ) AS enrollment_count
    FROM trainings t
    ORDER BY t.starts_at DESC, t.created_at DESC
    `,
  );

  return rows.map((row) =>
    mapAdminTraining(row, Number.parseInt(row.enrollment_count, 10) || 0),
  );
}

export async function findAdminTrainingById(
  id: string,
): Promise<AdminTrainingDetail | null> {
  if (!isUuid(id)) {
    return null;
  }

  const trainingResult = await pool.query<AdminTrainingListRow>(
    `
    SELECT
      t.id,
      t.title,
      t.summary,
      t.description,
      t.provider,
      t.format,
      t.duration_label,
      t.skill_tags,
      t.accessibility_notes,
      t.starts_at,
      t.ends_at,
      t.seats_total,
      t.seats_left,
      t.is_published,
      t.created_at,
      t.updated_at,
      (
        SELECT COUNT(*)::text
        FROM training_enrollments e
        WHERE e.training_id = t.id
          AND e.status <> 'dibatalkan'
      ) AS enrollment_count
    FROM trainings t
    WHERE t.id = $1
    LIMIT 1
    `,
    [id],
  );

  const trainingRow = trainingResult.rows[0];
  if (!trainingRow) {
    return null;
  }

  const enrollmentResult = await pool.query<AdminEnrollmentRow>(
    `
    SELECT
      e.id,
      e.status,
      e.enrolled_at,
      p.id AS profile_id,
      p.full_name,
      u.email,
      p.phone,
      p.address,
      p.disability_type
    FROM training_enrollments e
    INNER JOIN job_seeker_profiles p ON p.id = e.job_seeker_profile_id
    INNER JOIN users u ON u.id = p.user_id
    WHERE e.training_id = $1
      AND e.status <> 'dibatalkan'
    ORDER BY e.enrolled_at DESC
    `,
    [id],
  );

  const enrollments: AdminTrainingEnrollment[] = enrollmentResult.rows.map(
    (row) => ({
      id: row.id,
      status: row.status,
      enrolledAt: row.enrolled_at.toISOString(),
      seeker: {
        id: row.profile_id,
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        city: cityFromAddress(row.address),
        disabilityType: row.disability_type,
      },
    }),
  );

  return {
    ...mapAdminTraining(
      trainingRow,
      Number.parseInt(trainingRow.enrollment_count, 10) || 0,
    ),
    enrollments,
  };
}

export async function createAdminTraining(
  input: CreateAdminTrainingInput,
): Promise<AdminTraining> {
  const { rows } = await pool.query<TrainingRow>(
    `
    INSERT INTO trainings (
      title,
      summary,
      description,
      provider,
      format,
      duration_label,
      skill_tags,
      accessibility_notes,
      starts_at,
      ends_at,
      seats_total,
      seats_left,
      is_published
    )
    VALUES (
      $1, $2, $3, $4, $5, $6,
      $7::text[], $8,
      $9::timestamptz, $10::timestamptz,
      $11, $11, $12
    )
    RETURNING
      id,
      title,
      summary,
      description,
      provider,
      format,
      duration_label,
      skill_tags,
      accessibility_notes,
      starts_at,
      ends_at,
      seats_total,
      seats_left,
      is_published,
      created_at,
      updated_at
    `,
    [
      input.title,
      input.summary,
      input.description,
      input.provider,
      input.format,
      input.durationLabel,
      input.skillTags,
      input.accessibilityNotes,
      input.startsAt,
      input.endsAt,
      input.seatsTotal,
      input.isPublished,
    ],
  );

  const row = rows[0];
  if (!row) {
    throw new Error("Gagal membuat pelatihan.");
  }

  return mapAdminTraining(row, 0);
}

export function parseCreateAdminTrainingInput(
  body: Record<string, unknown>,
): { data: CreateAdminTrainingInput } | { errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const summary = typeof body.summary === "string" ? body.summary.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const provider =
    typeof body.provider === "string" ? body.provider.trim() : "";
  const formatRaw = typeof body.format === "string" ? body.format.trim() : "";
  const durationLabel =
    typeof body.durationLabel === "string" ? body.durationLabel.trim() : "";
  const accessibilityNotes =
    typeof body.accessibilityNotes === "string"
      ? body.accessibilityNotes.trim()
      : "";
  const startsAtRaw =
    typeof body.startsAt === "string" ? body.startsAt.trim() : "";
  const endsAtRaw = typeof body.endsAt === "string" ? body.endsAt.trim() : "";
  const seatsTotalRaw = body.seatsTotal;
  const isPublished =
    typeof body.isPublished === "boolean" ? body.isPublished : true;

  const skillTags = Array.isArray(body.skillTags)
    ? body.skillTags
        .filter((tag): tag is string => typeof tag === "string")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : typeof body.skillTags === "string"
      ? body.skillTags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

  if (!title) errors.title = "Judul pelatihan wajib diisi.";
  if (!summary) errors.summary = "Ringkasan wajib diisi.";
  if (!description) errors.description = "Deskripsi wajib diisi.";
  if (!provider) errors.provider = "Penyelenggara wajib diisi.";
  if (!isTrainingFormat(formatRaw)) {
    errors.format = "Format pelatihan tidak valid.";
  }
  if (!durationLabel) errors.durationLabel = "Durasi wajib diisi.";
  if (!accessibilityNotes) {
    errors.accessibilityNotes = "Catatan aksesibilitas wajib diisi.";
  }

  const startsAtDate = startsAtRaw ? new Date(startsAtRaw) : null;
  const endsAtDate = endsAtRaw ? new Date(endsAtRaw) : null;
  if (!startsAtRaw || !startsAtDate || Number.isNaN(startsAtDate.getTime())) {
    errors.startsAt = "Tanggal mulai tidak valid.";
  }
  if (!endsAtRaw || !endsAtDate || Number.isNaN(endsAtDate.getTime())) {
    errors.endsAt = "Tanggal selesai tidak valid.";
  }
  if (
    startsAtDate &&
    endsAtDate &&
    !Number.isNaN(startsAtDate.getTime()) &&
    !Number.isNaN(endsAtDate.getTime()) &&
    endsAtDate < startsAtDate
  ) {
    errors.endsAt = "Tanggal selesai harus sama dengan atau setelah tanggal mulai.";
  }

  let seatsTotal = 0;
  if (
    typeof seatsTotalRaw === "number" &&
    Number.isInteger(seatsTotalRaw) &&
    seatsTotalRaw >= 1
  ) {
    seatsTotal = seatsTotalRaw;
  } else if (
    typeof seatsTotalRaw === "string" &&
    /^\d+$/.test(seatsTotalRaw.trim())
  ) {
    seatsTotal = Number.parseInt(seatsTotalRaw.trim(), 10);
    if (seatsTotal < 1) {
      errors.seatsTotal = "Kuota minimal 1 peserta.";
    }
  } else {
    errors.seatsTotal = "Kuota peserta wajib diisi (angka minimal 1).";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    data: {
      title,
      summary,
      description,
      provider,
      format: formatRaw as TrainingFormat,
      durationLabel,
      skillTags,
      accessibilityNotes,
      startsAt: startsAtDate!.toISOString(),
      endsAt: endsAtDate!.toISOString(),
      seatsTotal,
      isPublished,
    },
  };
}
