import { pool } from "../db/pool.js";
import { isUuid } from "../db/ids.js";
import type { PlacementStatus } from "../db/placements-schema.js";
import {
  mapPlacementRow,
  type PlacementDto,
  type PlacementJoinRow,
} from "./placement-dto.js";

const PLACEMENT_SELECT = `
  SELECT
    p.id,
    p.status,
    p.created_at,
    pr.id AS seeker_id,
    pr.full_name,
    pr.disability_type,
    j.id AS job_id,
    j.title,
    j.location,
    c.id AS company_id,
    c.company_name
  FROM placements p
  INNER JOIN job_seeker_profiles pr ON pr.id = p.job_seeker_profile_id
  INNER JOIN jobs j ON j.id = p.job_id
  INNER JOIN company_profiles c ON c.id = j.company_id
`;

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === "23505"
  );
}

export async function createPlacement(input: {
  profileId: string;
  jobId: string;
  note: string;
  createdByUserId: string;
}): Promise<PlacementDto | "duplicate"> {
  if (!isUuid(input.profileId) || !isUuid(input.jobId)) {
    throw new Error("createPlacement membutuhkan UUID yang valid.");
  }

  try {
    const { rows } = await pool.query<PlacementJoinRow>(
      `
      WITH inserted AS (
        INSERT INTO placements (
          job_seeker_profile_id,
          job_id,
          status,
          note,
          created_by_user_id
        )
        VALUES ($1, $2, 'dikirim', $3, $4)
        RETURNING id, status, created_at, job_seeker_profile_id, job_id
      )
      SELECT
        p.id,
        p.status,
        p.created_at,
        pr.id AS seeker_id,
        pr.full_name,
        pr.disability_type,
        j.id AS job_id,
        j.title,
        j.location,
        c.id AS company_id,
        c.company_name
      FROM inserted p
      INNER JOIN job_seeker_profiles pr ON pr.id = p.job_seeker_profile_id
      INNER JOIN jobs j ON j.id = p.job_id
      INNER JOIN company_profiles c ON c.id = j.company_id
      `,
      [
        input.profileId,
        input.jobId,
        input.note.trim(),
        input.createdByUserId,
      ],
    );

    const row = rows[0];
    if (!row) {
      throw new Error("Penyaluran gagal disimpan.");
    }

    return mapPlacementRow(row);
  } catch (error) {
    if (isUniqueViolation(error)) {
      return "duplicate";
    }
    throw error;
  }
}

export async function listPlacementsForProfile(
  profileId: string,
  options: { statuses?: readonly PlacementStatus[] } = {},
): Promise<PlacementDto[]> {
  if (!isUuid(profileId)) {
    return [];
  }

  const statuses = options.statuses ?? [];
  const { rows } = await pool.query<PlacementJoinRow>(
    `
    ${PLACEMENT_SELECT}
    WHERE p.job_seeker_profile_id = $1
      AND (cardinality($2::text[]) = 0 OR p.status = ANY($2::text[]))
    ORDER BY p.created_at DESC
    `,
    [profileId, statuses],
  );

  return rows.map(mapPlacementRow);
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

export async function listPlacements(filters: {
  q: string;
  status: PlacementStatus | "";
  perusahaan: string;
}): Promise<PlacementDto[]> {
  const keyword = filters.q ? `%${escapeLike(filters.q)}%` : "";

  const { rows } = await pool.query<PlacementJoinRow>(
    `
    ${PLACEMENT_SELECT}
    WHERE (
        $1 = ''
        OR pr.full_name ILIKE $1 ESCAPE '\\'
        OR j.title ILIKE $1 ESCAPE '\\'
        OR c.company_name ILIKE $1 ESCAPE '\\'
      )
      AND ($2 = '' OR p.status = $2)
      AND ($3 = '' OR c.company_name = $3)
    ORDER BY p.created_at DESC
    `,
    [keyword, filters.status, filters.perusahaan],
  );

  return rows.map(mapPlacementRow);
}

export async function updatePlacementStatus(
  placementId: string,
  status: PlacementStatus,
): Promise<PlacementDto | null> {
  if (!isUuid(placementId)) {
    return null;
  }

  const { rows } = await pool.query<{ id: string }>(
    `
    UPDATE placements
    SET status = $2, updated_at = NOW()
    WHERE id = $1
    RETURNING id
    `,
    [placementId, status],
  );

  const id = rows[0]?.id;
  if (!id) {
    return null;
  }

  return findPlacementById(id);
}

export async function findPlacementById(
  placementId: string,
): Promise<PlacementDto | null> {
  if (!isUuid(placementId)) {
    return null;
  }

  const { rows } = await pool.query<PlacementJoinRow>(
    `
    ${PLACEMENT_SELECT}
    WHERE p.id = $1
    LIMIT 1
    `,
    [placementId],
  );

  const row = rows[0];
  return row ? mapPlacementRow(row) : null;
}

export async function listPlacementsForCompany(
  companyId: string,
): Promise<PlacementDto[]> {
  if (!isUuid(companyId)) {
    return [];
  }

  const { rows } = await pool.query<PlacementJoinRow>(
    `
    ${PLACEMENT_SELECT}
    WHERE c.id = $1
      AND p.status <> 'menunggu'
    ORDER BY p.created_at DESC
    `,
    [companyId],
  );

  return rows.map(mapPlacementRow);
}
