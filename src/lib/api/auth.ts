import { ApiError, apiGet, apiSend, apiUpload, isApiError, isUnavailableError } from "@/lib/api/http";
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
  photoFile: File;
  ktpFile: File;
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
  profileKind: "file" | "website";
  profileWebsite: string;
  profileFile: File | null;
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
  inclusionMessage: string;
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
    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("phone", input.phone);
    formData.append("address", input.address);
    formData.append("disabilityType", input.disabilityType);
    formData.append("disabilityNotes", input.disabilityNotes);
    formData.append("photoFileName", input.photoFile.name);
    formData.append("ktpFileName", input.ktpFile.name);
    formData.append("skills", JSON.stringify(input.skills));
    formData.append("certifications", JSON.stringify(input.certifications));
    formData.append("experiences", JSON.stringify(input.experiences));
    formData.append("photo", input.photoFile);
    formData.append("ktp", input.ktpFile);

    const data = await apiUpload<AuthUserPayload>(
      "/api/auth/register/pencari-kerja",
      formData,
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
    const path = "/api/auth/register/perusahaan";
    const payload = {
      name: input.name,
      address: input.address,
      industry: input.industry,
      profileKind: input.profileKind,
      profileWebsite: input.profileWebsite,
      contactName: input.contactName,
      contactPosition: input.contactPosition,
      contactPhone: input.contactPhone,
      contactEmail: input.contactEmail,
      password: input.password,
      hasDisabilityEmployees: input.hasDisabilityEmployees,
      disabilityWorkersNeeded: input.disabilityWorkersNeeded,
      neededSkills: input.neededSkills,
      disabilityHirePlan: input.disabilityHirePlan,
      hasCsrOrGrant: input.hasCsrOrGrant,
      inclusionMessage: input.inclusionMessage,
    };

    if (input.profileKind === "file" && input.profileFile) {
      const formData = new FormData();
      for (const [key, value] of Object.entries(payload)) {
        if (value === null) {
          continue;
        }
        formData.append(key, String(value));
      }
      formData.append("profileFile", input.profileFile);
      const data = await apiUpload<AuthUserPayload>(path, formData);
      return { data };
    }

    const data = await apiSend<AuthUserPayload>(path, "POST", payload);
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
