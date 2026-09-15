import type { PoolClient } from "pg";
import { pool } from "../db/pool.js";
import { hashPassword } from "./password.js";
import { findUserByEmail, type AuthUser } from "./users.repository.js";
import type {
  RegisterSeekerCertificationInput,
  RegisterSeekerExperienceInput,
  RegisterSeekerInput,
  RegisterSeekerSkillInput,
} from "./register-seeker.js";

export async function registerJobSeekerAccount(
  input: RegisterSeekerInput,
): Promise<{ user: AuthUser } | { conflict: true }> {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    return { conflict: true };
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const passwordHash = hashPassword(input.password);
    const userResult = await client.query<{
      id: string;
      email: string;
      role: "job_seeker";
      is_root_admin: boolean;
    }>(
      `
      INSERT INTO users (email, password_hash, role)
      VALUES ($1, $2, 'job_seeker')
      RETURNING id, email, role, is_root_admin
      `,
      [input.email.trim().toLowerCase(), passwordHash],
    );
    const userRow = userResult.rows[0];

    const profileResult = await client.query<{ id: string }>(
      `
      INSERT INTO job_seeker_profiles (
        user_id, full_name, phone, address, disability_type, disability_notes, bio
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
      `,
      [
        userRow.id,
        input.fullName.trim(),
        input.phone.trim(),
        input.address.trim(),
        input.disabilityType,
        input.disabilityNotes.trim(),
        input.disabilityNotes.trim(),
      ],
    );
    const profileId = profileResult.rows[0].id;

    await insertSkills(client, profileId, input.skills);
    await insertCertifications(client, profileId, input.certifications);
    await insertExperiences(client, profileId, input.experiences);

    if (input.photoFileName.trim()) {
      await client.query(
        `
        INSERT INTO job_seeker_photos (profile_id, kind, url)
        VALUES ($1, 'photo', $2)
        ON CONFLICT (profile_id, kind) DO UPDATE SET
          url = EXCLUDED.url,
          updated_at = NOW()
        `,
        [profileId, `pending://${input.photoFileName.trim()}`],
      );
    }
    if (input.ktpFileName.trim()) {
      await client.query(
        `
        INSERT INTO job_seeker_photos (profile_id, kind, url)
        VALUES ($1, 'ktp', $2)
        ON CONFLICT (profile_id, kind) DO UPDATE SET
          url = EXCLUDED.url,
          updated_at = NOW()
        `,
        [profileId, `pending://${input.ktpFileName.trim()}`],
      );
    }

    await client.query("COMMIT");

    return {
      user: {
        id: userRow.id,
        email: userRow.email,
        role: "job_seeker",
        isRootAdmin: userRow.is_root_admin,
        status: "aktif",
      },
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function insertSkills(
  client: PoolClient,
  profileId: string,
  skills: RegisterSeekerSkillInput[],
) {
  for (const skill of skills) {
    if (!skill.skillName.trim()) {
      continue;
    }
    await client.query(
      `
      INSERT INTO job_seeker_skills (profile_id, skill_name, level)
      VALUES ($1, $2, $3)
      `,
      [profileId, skill.skillName.trim(), skill.level],
    );
  }
}

async function insertCertifications(
  client: PoolClient,
  profileId: string,
  certifications: RegisterSeekerCertificationInput[],
) {
  for (const certification of certifications) {
    if (!certification.name.trim()) {
      continue;
    }
    await client.query(
      `
      INSERT INTO job_seeker_certifications (profile_id, name, issuer, year)
      VALUES ($1, $2, $3, $4)
      `,
      [
        profileId,
        certification.name.trim(),
        certification.issuer.trim(),
        certification.year.trim(),
      ],
    );
  }
}

async function insertExperiences(
  client: PoolClient,
  profileId: string,
  experiences: RegisterSeekerExperienceInput[],
) {
  for (const experience of experiences) {
    if (!experience.companyName.trim() || !experience.position.trim()) {
      continue;
    }
    await client.query(
      `
      INSERT INTO job_seeker_experiences (
        profile_id, company_name, position, start_date, end_date, description
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        profileId,
        experience.companyName.trim(),
        experience.position.trim(),
        experience.startDate,
        experience.endDate,
        experience.description.trim(),
      ],
    );
  }
}
