import { pool } from "../db/pool.js";
import { isUuid } from "../db/ids.js";
import type {
  JobSeekerDisabilityType,
  JobSeekerExperienceRow,
  JobSeekerPhotoRow,
  JobSeekerProfileRow,
  JobSeekerSkillRow,
  SkillLevel,
} from "../db/job-seeker-schema.js";
import { mapJobSeekerProfile, type JobSeekerProfileDto } from "./profile-dto.js";
import { computeProfileCompleteness } from "./completeness.js";
import type { IdentityInput } from "./identity.js";

type ProfileWithEmail = JobSeekerProfileRow & { email: string };

const PROFILE_SELECT = `
  SELECT
    p.id,
    p.user_id,
    p.full_name,
    p.phone,
    p.address,
    p.disability_type,
    p.bio,
    p.created_at,
    p.updated_at,
    u.email
  FROM job_seeker_profiles p
  INNER JOIN users u ON u.id = p.user_id
`;

async function loadRelated(profileId: string) {
  const [skills, experiences, photos] = await Promise.all([
    pool.query<JobSeekerSkillRow>(
      `
      SELECT id, profile_id, skill_name, level, created_at
      FROM job_seeker_skills
      WHERE profile_id = $1
      ORDER BY created_at ASC
      `,
      [profileId],
    ),
    pool.query<JobSeekerExperienceRow>(
      `
      SELECT id, profile_id, company_name, position, start_date, end_date, description, created_at
      FROM job_seeker_experiences
      WHERE profile_id = $1
      ORDER BY start_date DESC
      `,
      [profileId],
    ),
    pool.query<JobSeekerPhotoRow>(
      `
      SELECT id, profile_id, kind, url, created_at, updated_at
      FROM job_seeker_photos
      WHERE profile_id = $1
      `,
      [profileId],
    ),
  ]);

  return {
    skills: skills.rows,
    experiences: experiences.rows,
    photos: photos.rows,
  };
}

function toDto(
  row: ProfileWithEmail,
  related: Awaited<ReturnType<typeof loadRelated>>,
): JobSeekerProfileDto {
  const { email, ...profile } = row;
  const mapped = mapJobSeekerProfile({
    profile,
    email,
    skills: related.skills,
    experiences: related.experiences,
    photos: related.photos,
  });
  mapped.profileCompleteness = computeProfileCompleteness(mapped).percent;
  return mapped;
}

export async function findProfileByUserId(
  userId: string,
): Promise<JobSeekerProfileDto | null> {
  if (!isUuid(userId)) {
    return null;
  }

  const { rows } = await pool.query<ProfileWithEmail>(
    `${PROFILE_SELECT} WHERE p.user_id = $1 LIMIT 1`,
    [userId],
  );

  const row = rows[0];
  if (!row) {
    return null;
  }

  const related = await loadRelated(row.id);
  return toDto(row, related);
}

export async function findProfileById(
  profileId: string,
): Promise<JobSeekerProfileDto | null> {
  if (!isUuid(profileId)) {
    return null;
  }

  const { rows } = await pool.query<ProfileWithEmail>(
    `${PROFILE_SELECT} WHERE p.id = $1 LIMIT 1`,
    [profileId],
  );

  const row = rows[0];
  if (!row) {
    return null;
  }

  const related = await loadRelated(row.id);
  return toDto(row, related);
}

export async function updateProfileIdentity(
  userId: string,
  input: IdentityInput & { disabilityType: JobSeekerDisabilityType },
): Promise<JobSeekerProfileDto | null> {
  if (!isUuid(userId)) {
    return null;
  }

  const { rows } = await pool.query<ProfileWithEmail>(
    `
    UPDATE job_seeker_profiles AS p
    SET
      full_name = $2,
      phone = $3,
      address = $4,
      disability_type = $5,
      bio = $6,
      updated_at = NOW()
    FROM users u
    WHERE p.user_id = $1 AND u.id = p.user_id
    RETURNING
      p.id,
      p.user_id,
      p.full_name,
      p.phone,
      p.address,
      p.disability_type,
      p.bio,
      p.created_at,
      p.updated_at,
      u.email
    `,
    [
      userId,
      input.fullName.trim(),
      input.phone.trim(),
      input.address.trim(),
      input.disabilityType,
      input.bio.trim(),
    ],
  );

  const row = rows[0];
  if (!row) {
    return null;
  }

  const related = await loadRelated(row.id);
  return toDto(row, related);
}

export async function findProfileIdByUserId(
  userId: string,
): Promise<string | null> {
  if (!isUuid(userId)) {
    return null;
  }

  const { rows } = await pool.query<{ id: string }>(
    `
    SELECT id
    FROM job_seeker_profiles
    WHERE user_id = $1
    LIMIT 1
    `,
    [userId],
  );

  return rows[0]?.id ?? null;
}

export async function upsertProfilePhoto(
  profileId: string,
  kind: "photo" | "ktp",
  url: string,
): Promise<void> {
  await pool.query(
    `
    INSERT INTO job_seeker_photos (profile_id, kind, url)
    VALUES ($1, $2, $3)
    ON CONFLICT (profile_id, kind) DO UPDATE SET
      url = EXCLUDED.url,
      updated_at = NOW()
    `,
    [profileId, kind, url],
  );
}

export async function createSkill(
  profileId: string,
  input: { skillName: string; level: SkillLevel },
): Promise<"ok" | "duplicate"> {
  const { rows } = await pool.query<{ id: string }>(
    `
    SELECT id
    FROM job_seeker_skills
    WHERE profile_id = $1 AND lower(skill_name) = lower($2)
    LIMIT 1
    `,
    [profileId, input.skillName.trim()],
  );
  if (rows[0]) {
    return "duplicate";
  }

  await pool.query(
    `
    INSERT INTO job_seeker_skills (profile_id, skill_name, level)
    VALUES ($1, $2, $3)
    `,
    [profileId, input.skillName.trim(), input.level],
  );
  return "ok";
}

export async function updateSkill(
  profileId: string,
  skillId: string,
  input: { skillName?: string; level?: SkillLevel },
): Promise<"ok" | "missing" | "duplicate"> {
  if (!isUuid(skillId)) {
    return "missing";
  }

  if (input.skillName) {
    const { rows } = await pool.query<{ id: string }>(
      `
      SELECT id
      FROM job_seeker_skills
      WHERE profile_id = $1 AND lower(skill_name) = lower($2) AND id <> $3
      LIMIT 1
      `,
      [profileId, input.skillName.trim(), skillId],
    );
    if (rows[0]) {
      return "duplicate";
    }
  }

  const { rowCount } = await pool.query(
    `
    UPDATE job_seeker_skills
    SET
      skill_name = COALESCE($3, skill_name),
      level = COALESCE($4, level)
    WHERE id = $1 AND profile_id = $2
    `,
    [
      skillId,
      profileId,
      input.skillName?.trim() ?? null,
      input.level ?? null,
    ],
  );

  return rowCount ? "ok" : "missing";
}

export async function deleteSkill(
  profileId: string,
  skillId: string,
): Promise<boolean> {
  if (!isUuid(skillId)) {
    return false;
  }

  const { rowCount } = await pool.query(
    `
    DELETE FROM job_seeker_skills
    WHERE id = $1 AND profile_id = $2
    `,
    [skillId, profileId],
  );
  return Boolean(rowCount);
}

export async function createExperience(
  profileId: string,
  input: {
    companyName: string;
    position: string;
    startDate: string;
    endDate: string | null;
    description: string;
  },
): Promise<void> {
  await pool.query(
    `
    INSERT INTO job_seeker_experiences (
      profile_id, company_name, position, start_date, end_date, description
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [
      profileId,
      input.companyName.trim(),
      input.position.trim(),
      input.startDate,
      input.endDate,
      input.description.trim(),
    ],
  );
}

export async function updateExperience(
  profileId: string,
  experienceId: string,
  input: {
    companyName: string;
    position: string;
    startDate: string;
    endDate: string | null;
    description: string;
  },
): Promise<boolean> {
  if (!isUuid(experienceId)) {
    return false;
  }

  const { rowCount } = await pool.query(
    `
    UPDATE job_seeker_experiences
    SET
      company_name = $3,
      position = $4,
      start_date = $5,
      end_date = $6,
      description = $7
    WHERE id = $1 AND profile_id = $2
    `,
    [
      experienceId,
      profileId,
      input.companyName.trim(),
      input.position.trim(),
      input.startDate,
      input.endDate,
      input.description.trim(),
    ],
  );
  return Boolean(rowCount);
}

export async function deleteExperience(
  profileId: string,
  experienceId: string,
): Promise<boolean> {
  if (!isUuid(experienceId)) {
    return false;
  }

  const { rowCount } = await pool.query(
    `
    DELETE FROM job_seeker_experiences
    WHERE id = $1 AND profile_id = $2
    `,
    [experienceId, profileId],
  );
  return Boolean(rowCount);
}
