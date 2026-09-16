import { pool } from "../db/pool.js";
import { isUuid } from "../db/ids.js";
import type { JobListFilters } from "./filters.js";
import { mapJobRow, type JobListing, type JobListRow } from "./job-listing.js";

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

/**
 * Syarat tayang publik: lowongan sudah disetujui admin DAN masih aktif.
 * Semua query publik harus memakai klausa ini.
 */
const PUBLISHED_JOB_CONDITION = `j.status = 'disetujui' AND j.is_active = TRUE`;

export async function listActiveJobs(
  filters: JobListFilters,
): Promise<JobListing[]> {
  const keyword = filters.q ? `%${escapeLike(filters.q)}%` : "";

  const { rows } = await pool.query<JobListRow>(
    `
    SELECT
      j.id,
      j.title,
      j.description,
      j.requirements,
      j.disability_friendly_type,
      j.location,
      j.job_type,
      j.is_active,
      j.created_at,
      c.id AS company_id,
      c.company_name,
      c.industry,
      c.address
    FROM jobs j
    INNER JOIN company_profiles c ON c.id = j.company_id
    WHERE ${PUBLISHED_JOB_CONDITION}
      AND (
        $1 = ''
        OR j.title ILIKE $1 ESCAPE '\\'
        OR c.company_name ILIKE $1 ESCAPE '\\'
      )
      AND (
        $2 = ''
        OR j.disability_friendly_type = $2
        OR j.disability_friendly_type = 'semua'
      )
      AND ($3 = '' OR j.location = $3)
      AND ($4 = '' OR j.job_type = $4)
    ORDER BY j.created_at DESC
    `,
    [keyword, filters.disabilitas, filters.lokasi, filters.jenis],
  );

  return rows.map(mapJobRow);
}

export async function listActiveJobLocations(): Promise<string[]> {
  const { rows } = await pool.query<{ location: string }>(
    `
    SELECT DISTINCT j.location
    FROM jobs j
    WHERE ${PUBLISHED_JOB_CONDITION}
    `,
  );

  return rows
    .map((row) => row.location)
    .sort((a, b) => a.localeCompare(b, "id"));
}

const JOB_WITH_COMPANY_SELECT = `
  SELECT
    j.id,
    j.title,
    j.description,
    j.requirements,
    j.disability_friendly_type,
    j.location,
    j.job_type,
    j.is_active,
    j.created_at,
    c.id AS company_id,
    c.company_name,
    c.industry,
    c.address
  FROM jobs j
  INNER JOIN company_profiles c ON c.id = j.company_id
`;

export async function findActiveJobById(
  id: string,
): Promise<JobListing | null> {
  if (!isUuid(id)) {
    return null;
  }

  const { rows } = await pool.query<JobListRow>(
    `
    ${JOB_WITH_COMPANY_SELECT}
    WHERE j.id = $1 AND ${PUBLISHED_JOB_CONDITION}
    LIMIT 1
    `,
    [id],
  );

  const row = rows[0];
  return row ? mapJobRow(row) : null;
}

/** Dipakai admin penyaluran: hanya lowongan yang benar-benar tayang. */
export async function listPublishedJobsForPlacement(): Promise<JobListing[]> {
  const { rows } = await pool.query<JobListRow>(
    `
    ${JOB_WITH_COMPANY_SELECT}
    WHERE ${PUBLISHED_JOB_CONDITION}
    ORDER BY j.created_at DESC
    `,
  );

  return rows.map(mapJobRow);
}
