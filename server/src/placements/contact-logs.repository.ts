import { pool } from "../db/pool.js";
import { isUuid } from "../db/ids.js";
import type {
  ContactChannel,
  PlacementContactLogRow,
} from "../db/contact-logs-schema.js";

export type ContactLogDto = {
  id: string;
  jobSeekerId: string;
  channel: ContactChannel;
  message: string;
  createdAt: string;
};

function mapContactLog(row: PlacementContactLogRow): ContactLogDto {
  return {
    id: row.id,
    jobSeekerId: row.job_seeker_profile_id,
    channel: row.channel,
    message: row.message,
    createdAt: row.created_at.toISOString(),
  };
}

export async function createContactLog(input: {
  profileId: string;
  channel: ContactChannel;
  message: string;
  createdByUserId: string;
}): Promise<ContactLogDto> {
  const { rows } = await pool.query<PlacementContactLogRow>(
    `
    INSERT INTO placement_contact_logs (
      job_seeker_profile_id,
      channel,
      message,
      created_by_user_id
    )
    VALUES ($1, $2, $3, $4)
    RETURNING id, job_seeker_profile_id, channel, message, created_by_user_id, created_at
    `,
    [input.profileId, input.channel, input.message.trim(), input.createdByUserId],
  );

  const row = rows[0];
  if (!row) {
    throw new Error("Catatan kontak gagal disimpan.");
  }

  return mapContactLog(row);
}

export async function listContactLogsForProfile(
  profileId: string,
): Promise<ContactLogDto[]> {
  if (!isUuid(profileId)) {
    return [];
  }

  const { rows } = await pool.query<PlacementContactLogRow>(
    `
    SELECT id, job_seeker_profile_id, channel, message, created_by_user_id, created_at
    FROM placement_contact_logs
    WHERE job_seeker_profile_id = $1
    ORDER BY created_at DESC
    `,
    [profileId],
  );

  return rows.map(mapContactLog);
}
