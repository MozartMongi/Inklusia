import type {
  RegisterSeekerCertificationDraft,
  RegisterSeekerExperienceDraft,
  RegisterSeekerSkillDraft,
} from "@/lib/auth/register-seeker";
import {
  MOCK_DEMO_AUTH_IDENTITIES,
  MOCK_DEMO_LOGIN_PASSWORD,
} from "@/lib/mock/auth";
import type { JobSeekerDisabilityType } from "@/lib/types/job-seeker";

export type RegisterJobSeekerInput = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  disabilityType: JobSeekerDisabilityType;
  disabilityNotes: string;
  photoFileName: string;
  ktpFileName: string;
  skills: Array<Pick<RegisterSeekerSkillDraft, "skillName" | "level">>;
  certifications: Array<
    Pick<RegisterSeekerCertificationDraft, "name" | "issuer" | "year">
  >;
  experiences: Array<
    Pick<
      RegisterSeekerExperienceDraft,
      "companyName" | "position" | "startDate" | "description"
    > & { endDate: string | null }
  >;
};

/**
 * Kontrak yang diasumsikan:
 * POST /api/auth/register/pencari-kerja → { data: { id, email, role } }
 * Kata sandi tidak dikembalikan.
 */
export async function registerJobSeeker(
  input: RegisterJobSeekerInput,
): Promise<{
  data: { id: string; email: string; role: "pencari_kerja" };
}> {
  void input.password;
  return {
    data: {
      id: `js-reg-${Date.now()}`,
      email: input.email,
      role: "pencari_kerja",
    },
  };
}

export type RegisterCompanyInput = {
  name: string;
  address: string;
  industry: string;
  contactName: string;
  contactPosition: string;
  contactPhone: string;
  contactEmail: string;
  password: string;
  hasDisabilityEmployees: "ya" | "tidak";
  disabilityWorkersNeeded: number;
  neededSkills: string;
  disabilityHirePlan: string | null;
  hasCsrOrGrant: "ya" | "tidak";
};

/**
 * Kontrak yang diasumsikan:
 * POST /api/auth/register/perusahaan → { data: { id, email, role } }
 * Email kontak person dipakai sebagai kredensial masuk. Kata sandi tidak dikembalikan.
 */
export async function registerCompany(
  input: RegisterCompanyInput,
): Promise<{
  data: { id: string; email: string; role: "perusahaan" };
}> {
  void input.password;
  return {
    data: {
      id: `co-reg-${Date.now()}`,
      email: input.contactEmail,
      role: "perusahaan",
    },
  };
}

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginSuccess = {
  data: {
    id: string;
    email: string;
    role: "pencari_kerja" | "perusahaan" | "admin";
  };
};

/**
 * Kontrak yang diasumsikan:
 * POST /api/auth/login → { data: { id, email, role } }
 * atau { error } bila kredensial tidak cocok. Kata sandi tidak dikembalikan.
 */
export async function login(
  input: LoginInput,
): Promise<LoginSuccess | { error: string }> {
  const email = input.email.trim().toLowerCase();
  const identity = MOCK_DEMO_AUTH_IDENTITIES.find(
    (item) => item.email.toLowerCase() === email,
  );

  if (!identity || input.password !== MOCK_DEMO_LOGIN_PASSWORD) {
    return { error: "Email atau kata sandi tidak sesuai." };
  }

  return {
    data: {
      id: `user-${identity.role}`,
      email: identity.email,
      role: identity.role,
    },
  };
}

/**
 * Kontrak yang diasumsikan:
 * POST /api/auth/lupa-kata-sandi → { data: { sent: true } }
 * Respons sukses seragam agar email tidak terbongkar ada/tidaknya.
 */
export async function requestPasswordReset(input: {
  email: string;
}): Promise<{ data: { sent: true } }> {
  void input.email;
  return { data: { sent: true } };
}

/**
 * Kontrak yang diasumsikan:
 * POST /api/auth/reset-kata-sandi → { data: { reset: true } }
 * atau { error } bila token tidak valid. Kata sandi tidak dikembalikan.
 */
export async function confirmPasswordReset(input: {
  token: string;
  password: string;
}): Promise<{ data: { reset: true } } | { error: string }> {
  void input.password;
  if (!input.token.trim()) {
    return { error: "Tautan reset tidak valid atau sudah kedaluwarsa." };
  }
  return { data: { reset: true } };
}

/**
 * Kontrak yang diasumsikan:
 * POST /api/auth/logout → { data: { ok: true } }
 * Frontend membersihkan cookie sesi tiruan.
 */
export async function logout(): Promise<{ data: { ok: true } }> {
  return { data: { ok: true } };
}
