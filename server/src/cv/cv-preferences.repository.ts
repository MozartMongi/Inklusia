import { pool } from "../db/pool.js";
import { isUuid } from "../db/ids.js";
import { CV_LAYOUT, type JobSeekerCvPreferenceRow } from "../db/cv-schema.js";

export type CvPreferenceDto = {
  id: string;
  jobSeekerId: string;
  layout: typeof CV_LAYOUT;
  lastGeneratedAt: string | null;
  lastDownloadedAt: string | null;
  updatedAt: string;
};

function mapPreference(row: JobSeekerCvPreferenceRow): CvPreferenceDto {
  return {
    id: row.id,
    jobSeekerId: row.job_seeker_profile_id,
    layout: CV_LAYOUT,
    lastGeneratedAt: row.last_generated_at?.toISOString() ?? null,
    lastDownloadedAt: row.last_downloaded_at?.toISOString() ?? null,
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function findCvPreferenceByProfileId(
  profileId: string,
): Promise<CvPreferenceDto | null> {
  if (!isUuid(profileId)) {
    return null;
  }

  const { rows } = await pool.query<JobSeekerCvPreferenceRow>(
    `
    SELECT
      id,
      job_seeker_profile_id,
      last_generated_at,
      last_downloaded_at,
      created_at,
      updated_at
    FROM job_seeker_cv_preferences
    WHERE job_seeker_profile_id = $1
    LIMIT 1
    `,
    [profileId],
  );

  const row = rows[0];
  return row ? mapPreference(row) : null;
}

export async function ensureCvPreference(
  profileId: string,
): Promise<CvPreferenceDto> {
  if (!isUuid(profileId)) {
    throw new Error("ensureCvPreference membutuhkan UUID profil.");
  }

  const { rows } = await pool.query<JobSeekerCvPreferenceRow>(
    `
    INSERT INTO job_seeker_cv_preferences (job_seeker_profile_id)
    VALUES ($1)
    ON CONFLICT (job_seeker_profile_id) DO UPDATE SET
      updated_at = job_seeker_cv_preferences.updated_at
    RETURNING
      id,
      job_seeker_profile_id,
      last_generated_at,
      last_downloaded_at,
      created_at,
      updated_at
    `,
    [profileId],
  );

  const row = rows[0];
  if (!row) {
    throw new Error("Preferensi CV gagal disimpan.");
  }

  return mapPreference(row);
}

export async function markCvGenerated(
  profileId: string,
  generatedAt: Date,
): Promise<CvPreferenceDto> {
  if (!isUuid(profileId)) {
    throw new Error("markCvGenerated membutuhkan UUID profil.");
  }

  const { rows } = await pool.query<JobSeekerCvPreferenceRow>(
    `
    INSERT INTO job_seeker_cv_preferences (
      job_seeker_profile_id,
      last_generated_at,
      updated_at
    )
    VALUES ($1, $2, $2)
    ON CONFLICT (job_seeker_profile_id) DO UPDATE SET
      last_generated_at = EXCLUDED.last_generated_at,
      updated_at = EXCLUDED.updated_at
    RETURNING
      id,
      job_seeker_profile_id,
      last_generated_at,
      last_downloaded_at,
      created_at,
      updated_at
    `,
    [profileId, generatedAt],
  );

  const row = rows[0];
  if (!row) {
    throw new Error("Preferensi CV gagal diperbarui.");
  }

  return mapPreference(row);
}

export async function markCvDownloaded(
  profileId: string,
  downloadedAt: Date,
): Promise<CvPreferenceDto> {
  if (!isUuid(profileId)) {
    throw new Error("markCvDownloaded membutuhkan UUID profil.");
  }

  const { rows } = await pool.query<JobSeekerCvPreferenceRow>(
    `
    INSERT INTO job_seeker_cv_preferences (
      job_seeker_profile_id,
      last_downloaded_at,
      updated_at
    )
    VALUES ($1, $2, $2)
    ON CONFLICT (job_seeker_profile_id) DO UPDATE SET
      last_downloaded_at = EXCLUDED.last_downloaded_at,
      updated_at = EXCLUDED.updated_at
    RETURNING
      id,
      job_seeker_profile_id,
      last_generated_at,
      last_downloaded_at,
      created_at,
      updated_at
    `,
    [profileId, downloadedAt],
  );

  const downloaded = rows[0];
  if (!downloaded) {
    throw new Error("Preferensi CV gagal diperbarui.");
  }

  return mapPreference(downloaded);
}
