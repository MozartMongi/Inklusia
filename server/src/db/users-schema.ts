/**
 * Skema TypeScript untuk tabel `users`
 * (dibuat di 001_create_users_and_company_profiles.sql).
 */
export const USER_ROLES = ["job_seeker", "company", "admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  job_seeker: "Pencari kerja",
  company: "Perusahaan",
  admin: "Admin",
};

export type UserAccountStatus = "aktif" | "nonaktif";

export type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  is_root_admin: boolean;
  full_name: string;
  status: UserAccountStatus;
  created_at: Date;
  updated_at: Date;
};

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isRootAdmin: boolean;
  status: UserAccountStatus;
};

export function isUserRole(value: string): value is UserRole {
  return (USER_ROLES as readonly string[]).includes(value);
}

export function mapUserRowToAuthUser(row: UserRow): AuthUser | null {
  if (!isUserRole(row.role)) {
    return null;
  }

  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name ?? "",
    role: row.role,
    isRootAdmin: row.is_root_admin,
    status: row.status === "nonaktif" ? "nonaktif" : "aktif",
  };
}
