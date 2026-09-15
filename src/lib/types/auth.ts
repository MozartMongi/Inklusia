export type UserRole = "tamu" | "pencari_kerja" | "perusahaan" | "admin";

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  tamu: "pengunjung yang belum masuk",
  pencari_kerja: "pencari kerja",
  perusahaan: "perusahaan",
  admin: "admin",
};

export const USER_ROLES: UserRole[] = [
  "tamu",
  "pencari_kerja",
  "perusahaan",
  "admin",
];

export function isUserRole(value: string): value is UserRole {
  return USER_ROLES.includes(value as UserRole);
}
