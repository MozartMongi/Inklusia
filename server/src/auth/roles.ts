import type { UserRole } from "../db/users-schema.js";

/** Peran yang dipakai kontrak API frontend (Bahasa Indonesia). */
export type ApiUserRole = "pencari_kerja" | "perusahaan" | "admin";

export function toApiRole(role: UserRole): ApiUserRole {
  switch (role) {
    case "job_seeker":
      return "pencari_kerja";
    case "company":
      return "perusahaan";
    case "admin":
      return "admin";
  }
}

export function redirectPathForRole(role: UserRole): string {
  switch (role) {
    case "job_seeker":
      return "/profil";
    case "company":
      return "/perusahaan";
    case "admin":
      return "/admin";
  }
}
