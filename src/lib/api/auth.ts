import { ApiError, apiGet, apiSend, isApiError, isUnavailableError } from "@/lib/api/http";
import type {
  RegisterSeekerCertificationDraft,
  RegisterSeekerExperienceDraft,
  RegisterSeekerSkillDraft,
} from "@/lib/auth/register-seeker";
import type { JobSeekerDisabilityType } from "@/lib/types/job-seeker";
import type { UserRole } from "@/lib/types/auth";

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

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthUserPayload = {
  id: string;
  email: string;
  role: Exclude<UserRole, "tamu">;
  redirectTo?: string;
  isRootAdmin?: boolean;
  fullName?: string;
};

export type LoginSuccess = {
  data: AuthUserPayload;
};

export type AuthMe = {
  id: string;
  email: string;
  fullName: string;
  role: Exclude<UserRole, "tamu">;
  isRootAdmin: boolean;
  redirectTo: string;
};

function failureFromError(error: unknown): { error: string } {
  if (isApiError(error)) {
    return { error: error.message };
  }
  throw error;
}

export async function registerJobSeeker(
  input: RegisterJobSeekerInput,
): Promise<{ data: AuthUserPayload } | { error: string; errors?: ApiError["errors"] }> {
  try {
    const data = await apiSend<AuthUserPayload>(
      "/api/auth/register/pencari-kerja",
      "POST",
      input,
    );
    return { data };
  } catch (error) {
    if (isApiError(error)) {
      return { error: error.message, errors: error.errors };
    }
    throw error;
  }
}

export async function registerCompany(
  input: RegisterCompanyInput,
): Promise<{ data: AuthUserPayload } | { error: string; errors?: ApiError["errors"] }> {
  try {
    const data = await apiSend<AuthUserPayload>(
      "/api/auth/register/perusahaan",
      "POST",
      input,
    );
    return { data };
  } catch (error) {
    if (isApiError(error)) {
      return { error: error.message, errors: error.errors };
    }
    throw error;
  }
}

export async function login(
  input: LoginInput,
): Promise<LoginSuccess | { error: string }> {
  try {
    const data = await apiSend<AuthUserPayload>("/api/auth/login", "POST", input);
    return { data };
  } catch (error) {
    return failureFromError(error);
  }
}

export async function fetchAuthMe(): Promise<AuthMe | null> {
  try {
    return await apiGet<AuthMe>("/api/auth/me");
  } catch (error) {
    if (
      isApiError(error) &&
      (error.status === 401 || error.status === 403 || isUnavailableError(error))
    ) {
      return null;
    }
    throw error;
  }
}

export async function requestPasswordReset(input: {
  email: string;
}): Promise<{ data: { sent: true } }> {
  return {
    data: await apiSend<{ sent: true }>(
      "/api/auth/lupa-kata-sandi",
      "POST",
      input,
    ),
  };
}

export async function confirmPasswordReset(input: {
  token: string;
  password: string;
}): Promise<{ data: { reset: true } } | { error: string }> {
  try {
    const data = await apiSend<{ reset: true }>(
      "/api/auth/reset-kata-sandi",
      "POST",
      input,
    );
    return { data };
  } catch (error) {
    return failureFromError(error);
  }
}

export async function logout(): Promise<{ data: { ok: true } }> {
  try {
    return {
      data: await apiSend<{ ok: true }>("/api/auth/logout", "POST"),
    };
  } catch {
    return { data: { ok: true } };
  }
}
