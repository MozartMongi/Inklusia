import { isUuid } from "../db/ids.js";
import { pool } from "../db/pool.js";
import {
  mapTrainingEnrollmentRow,
  mapTrainingRow,
  type Training,
  type TrainingEnrollment,
  type TrainingEnrollmentRow,
  type TrainingRow,
} from "../db/training-schema.js";

const TRAINING_SELECT = `
  SELECT
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
    seats_total,
    seats_left,
    is_published,
    created_at,
    updated_at
  FROM trainings
`;

export async function listPublishedTrainings(): Promise<Training[]> {
  const { rows } = await pool.query<TrainingRow>(
    `
    ${TRAINING_SELECT}
    WHERE is_published = TRUE
    ORDER BY starts_at ASC
    `,
  );
  return rows.map(mapTrainingRow);
}

export async function findPublishedTrainingById(
  id: string,
): Promise<Training | null> {
  if (!isUuid(id)) {
    return null;
  }

  const { rows } = await pool.query<TrainingRow>(
    `
    ${TRAINING_SELECT}
    WHERE id = $1 AND is_published = TRUE
    LIMIT 1
    `,
    [id],
  );

  const row = rows[0];
  return row ? mapTrainingRow(row) : null;
}

export async function findTrainingById(id: string): Promise<Training | null> {
  if (!isUuid(id)) {
    return null;
  }

  const { rows } = await pool.query<TrainingRow>(
    `
    ${TRAINING_SELECT}
    WHERE id = $1
    LIMIT 1
    `,
    [id],
  );

  const row = rows[0];
  return row ? mapTrainingRow(row) : null;
}

export async function listEnrollmentsForProfile(
  profileId: string,
): Promise<TrainingEnrollment[]> {
  if (!isUuid(profileId)) {
    return [];
  }

  const { rows } = await pool.query<TrainingEnrollmentRow>(
    `
    SELECT
      id,
      training_id,
      job_seeker_profile_id,
      status,
      enrolled_at,
      created_at,
      updated_at
    FROM training_enrollments
    WHERE job_seeker_profile_id = $1
    ORDER BY enrolled_at DESC
    `,
    [profileId],
  );

  return rows.map(mapTrainingEnrollmentRow);
}

export async function findActiveEnrollment(
  trainingId: string,
  profileId: string,
): Promise<TrainingEnrollment | null> {
  if (!isUuid(trainingId) || !isUuid(profileId)) {
    return null;
  }

  const { rows } = await pool.query<TrainingEnrollmentRow>(
    `
    SELECT
      id,
      training_id,
      job_seeker_profile_id,
      status,
      enrolled_at,
      created_at,
      updated_at
    FROM training_enrollments
    WHERE training_id = $1
      AND job_seeker_profile_id = $2
      AND status <> 'dibatalkan'
    LIMIT 1
    `,
    [trainingId, profileId],
  );

  const row = rows[0];
  return row ? mapTrainingEnrollmentRow(row) : null;
}

export async function enrollProfileInTraining(
  trainingId: string,
  profileId: string,
): Promise<
  | { data: TrainingEnrollment }
  | { error: string; status: 404 | 409 }
> {
  if (!isUuid(trainingId) || !isUuid(profileId)) {
    return { error: "Pelatihan tidak ditemukan.", status: 404 };
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const trainingResult = await client.query<TrainingRow>(
      `
      SELECT
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
        seats_total,
        seats_left,
        is_published,
        created_at,
        updated_at
      FROM trainings
      WHERE id = $1 AND is_published = TRUE
      FOR UPDATE
      `,
      [trainingId],
    );

    const training = trainingResult.rows[0];
    if (!training) {
      await client.query("ROLLBACK");
      return { error: "Pelatihan tidak ditemukan.", status: 404 };
    }

    if (training.seats_left <= 0) {
      await client.query("ROLLBACK");
      return { error: "Kuota pelatihan sudah penuh.", status: 409 };
    }

    const existing = await client.query(
      `
      SELECT id
      FROM training_enrollments
      WHERE training_id = $1
        AND job_seeker_profile_id = $2
        AND status <> 'dibatalkan'
      LIMIT 1
      `,
      [trainingId, profileId],
    );
    if (existing.rows[0]) {
      await client.query("ROLLBACK");
      return {
        error: "Anda sudah terdaftar pada pelatihan ini.",
        status: 409,
      };
    }

    const enrolled = await client.query<TrainingEnrollmentRow>(
      `
      INSERT INTO training_enrollments (
        training_id, job_seeker_profile_id, status
      )
      VALUES ($1, $2, 'terdaftar')
      RETURNING
        id,
        training_id,
        job_seeker_profile_id,
        status,
        enrolled_at,
        created_at,
        updated_at
      `,
      [trainingId, profileId],
    );

    await client.query(
      `
      UPDATE trainings
      SET seats_left = seats_left - 1, updated_at = NOW()
      WHERE id = $1 AND seats_left > 0
      `,
      [trainingId],
    );

    await client.query("COMMIT");

    const row = enrolled.rows[0];
    if (!row) {
      return { error: "Gagal mendaftar pelatihan.", status: 409 };
    }

    return { data: mapTrainingEnrollmentRow(row) };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
