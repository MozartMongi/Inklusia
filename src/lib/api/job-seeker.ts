import { apiGet, apiSend, apiUpload, isApiError } from "@/lib/api/http";
import type { JobSeekerProfile, SkillLevel } from "@/lib/types/job-seeker";

export async function fetchMyJobSeekerProfile(): Promise<JobSeekerProfile> {
  return apiGet<JobSeekerProfile>("/api/me/profile");
}

export type JobSeekerIdentityInput = {
  fullName: string;
  phone: string;
  address: string;
  disabilityType: JobSeekerProfile["disabilityType"];
  bio: string;
};

export async function saveJobSeekerIdentity(
  input: JobSeekerIdentityInput,
): Promise<{ data: JobSeekerProfile } | { error: string }> {
  try {
    const data = await apiSend<JobSeekerProfile>("/api/me/profile", "PATCH", input);
    return { data };
  } catch (error) {
    if (isApiError(error)) {
      return { error: error.message };
    }
    throw error;
  }
}

export async function addJobSeekerSkill(input: {
  skillName: string;
  level: SkillLevel;
}): Promise<{ data: JobSeekerProfile } | { error: string }> {
  try {
    const data = await apiSend<JobSeekerProfile>(
      "/api/me/profile/skills",
      "POST",
      input,
    );
    return { data };
  } catch (error) {
    if (isApiError(error)) {
      return { error: error.message };
    }
    throw error;
  }
}

export async function updateJobSeekerSkill(
  id: string,
  input: { skillName?: string; level?: SkillLevel },
): Promise<{ data: JobSeekerProfile } | { error: string }> {
  try {
    const data = await apiSend<JobSeekerProfile>(
      `/api/me/profile/skills/${id}`,
      "PATCH",
      input,
    );
    return { data };
  } catch (error) {
    if (isApiError(error)) {
      return { error: error.message };
    }
    throw error;
  }
}

export async function deleteJobSeekerSkill(
  id: string,
): Promise<{ data: JobSeekerProfile } | { error: string }> {
  try {
    const data = await apiSend<JobSeekerProfile>(
      `/api/me/profile/skills/${id}`,
      "DELETE",
    );
    return { data };
  } catch (error) {
    if (isApiError(error)) {
      return { error: error.message };
    }
    throw error;
  }
}

export async function addJobSeekerExperience(input: {
  companyName: string;
  position: string;
  startDate: string;
  endDate: string | null;
  current?: boolean;
  description: string;
}): Promise<{ data: JobSeekerProfile } | { error: string }> {
  try {
    const data = await apiSend<JobSeekerProfile>(
      "/api/me/profile/experiences",
      "POST",
      input,
    );
    return { data };
  } catch (error) {
    if (isApiError(error)) {
      return { error: error.message };
    }
    throw error;
  }
}

export async function deleteJobSeekerExperience(
  id: string,
): Promise<{ data: JobSeekerProfile } | { error: string }> {
  try {
    const data = await apiSend<JobSeekerProfile>(
      `/api/me/profile/experiences/${id}`,
      "DELETE",
    );
    return { data };
  } catch (error) {
    if (isApiError(error)) {
      return { error: error.message };
    }
    throw error;
  }
}

export async function uploadJobSeekerDocument(
  kind: "photo" | "ktp",
  file: File,
): Promise<{ data: JobSeekerProfile } | { error: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const path =
    kind === "photo" ? "/api/me/profile/photo" : "/api/me/profile/ktp";

  try {
    const data = await apiUpload<JobSeekerProfile>(path, formData);
    return { data };
  } catch (error) {
    if (isApiError(error)) {
      return { error: error.message };
    }
    throw error;
  }
}
