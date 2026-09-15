import { pool } from "../db/pool.js";
import {
  JOB_SEEKER_DISABILITY_TYPES,
  type JobSeekerDisabilityType,
} from "../db/job-seeker-schema.js";

export type AdminSeekerSummary = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  disabilityType: JobSeekerDisabilityType;
  city: string;
  profileCompleteness: number;
  skillNames: string[];
};

export type AdminSeekerFilters = {
  q: string;
  disabilitas: JobSeekerDisabilityType | "";
  kota: string;
};

function cityFromAddress(address: string): string {
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return parts[parts.length - 1] ?? address;
}

export function parseAdminSeekerFilters(
  query: Record<string, unknown>,
): AdminSeekerFilters {
  const q = typeof query.q === "string" ? query.q : "";
  const disabilitasRaw =
    typeof query.disabilitas === "string" ? query.disabilitas : "";
  const kota = typeof query.kota === "string" ? query.kota : "";

  return {
    q,
    disabilitas: (
      JOB_SEEKER_DISABILITY_TYPES as readonly string[]
    ).includes(disabilitasRaw)
      ? (disabilitasRaw as JobSeekerDisabilityType)
      : "",
    kota,
  };
}

export async function listAdminSeekers(
  filters: AdminSeekerFilters,
): Promise<AdminSeekerSummary[]> {
  const { rows } = await pool.query<{
    id: string;
    full_name: string;
    email: string;
    phone: string;
    disability_type: JobSeekerDisabilityType;
    address: string;
    skill_names: string[] | null;
    photo_count: string;
    skill_count: string;
    experience_count: string;
  }>(
    `
    SELECT
      p.id,
      p.full_name,
      u.email,
      p.phone,
      p.disability_type,
      p.address,
      COALESCE(
        (
          SELECT array_agg(s.skill_name ORDER BY s.created_at ASC)
          FROM job_seeker_skills s
          WHERE s.profile_id = p.id
        ),
        ARRAY[]::text[]
      ) AS skill_names,
      (
        SELECT COUNT(*)::text FROM job_seeker_photos ph WHERE ph.profile_id = p.id
      ) AS photo_count,
      (
        SELECT COUNT(*)::text FROM job_seeker_skills sk WHERE sk.profile_id = p.id
      ) AS skill_count,
      (
        SELECT COUNT(*)::text FROM job_seeker_experiences ex WHERE ex.profile_id = p.id
      ) AS experience_count
    FROM job_seeker_profiles p
    INNER JOIN users u ON u.id = p.user_id
    ORDER BY p.updated_at DESC
    `,
  );

  return rows
    .map((row) => {
      const city = cityFromAddress(row.address);
      const hasIdentity = Boolean(
        row.full_name.trim() && row.phone.trim() && row.address.trim(),
      );
      const photoCount = Number(row.photo_count);
      const skillCount = Number(row.skill_count);
      const experienceCount = Number(row.experience_count);
      const checks = [
        hasIdentity,
        photoCount > 0,
        skillCount > 0,
        experienceCount > 0,
      ];
      const profileCompleteness = Math.round(
        (checks.filter(Boolean).length / checks.length) * 100,
      );

      return {
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        disabilityType: row.disability_type,
        city,
        profileCompleteness,
        skillNames: row.skill_names ?? [],
      };
    })
    .filter((seeker) => {
      const keyword = filters.q.trim().toLowerCase();
      if (keyword) {
        const haystack =
          `${seeker.fullName} ${seeker.skillNames.join(" ")}`.toLowerCase();
        if (!haystack.includes(keyword)) {
          return false;
        }
      }
      if (filters.disabilitas && seeker.disabilityType !== filters.disabilitas) {
        return false;
      }
      if (filters.kota && seeker.city !== filters.kota) {
        return false;
      }
      return true;
    });
}

export async function uniqueAdminSeekerCities(): Promise<string[]> {
  const seekers = await listAdminSeekers({ q: "", disabilitas: "", kota: "" });
  return [...new Set(seekers.map((seeker) => seeker.city))].sort((a, b) =>
    a.localeCompare(b, "id"),
  );
}
