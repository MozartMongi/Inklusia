import { USER_ROLE_LABEL, type UserRole } from "@/lib/types/auth";

export type DemoAuthIdentity = {
  role: Exclude<UserRole, "tamu">;
  name: string;
  email: string;
};

/**
 * Data tiruan untuk kerangka halaman masuk.
 * Tidak menyertakan kata sandi.
 */
export const MOCK_GUEST_AUTH_SESSION = {
  role: "tamu" as const,
};

export const MOCK_DEMO_AUTH_IDENTITIES: DemoAuthIdentity[] = [
  {
    role: "pencari_kerja",
    name: "Sari Wulandari",
    email: "sari.wulandari@contoh.inklusia.id",
  },
  {
    role: "perusahaan",
    name: "Bank Harmoni Nusantara",
    email: "bank.harmoni@seed.inklusia.id",
  },
  {
    role: "admin",
    name: "Admin Inklusia",
    email: "info@inklusia.id",
  },
];

export function demoRoleLabel(role: DemoAuthIdentity["role"]): string {
  return USER_ROLE_LABEL[role];
}

/**
 * Kata sandi stub untuk akun contoh di frontend.
 * Jangan ditampilkan di UI. Bukan kata sandi produksi.
 */
export const MOCK_DEMO_LOGIN_PASSWORD = "simulasi123";
