import { MOCK_JOB_SEEKER } from "@/lib/mock/job-seeker";
import type { JobSeekerProfile } from "@/lib/types/job-seeker";

/**
 * Kontrak API yang diasumsikan frontend:
 * GET /api/me/profile → { data: JobSeekerProfile }
 * Saat ini memakai data tiruan sampai autentikasi Express siap.
 */
export async function fetchMyJobSeekerProfile(): Promise<JobSeekerProfile> {
  return MOCK_JOB_SEEKER;
}

export type JobSeekerIdentityInput = {
  fullName: string;
  phone: string;
  address: string;
  disabilityType: JobSeekerProfile["disabilityType"];
  bio: string;
};

/**
 * Kontrak yang diasumsikan: PATCH /api/me/profile
 * { fullName, phone, address, disabilityType, bio } → { data: JobSeekerProfile }
 */
export async function saveJobSeekerIdentity(
  input: JobSeekerIdentityInput,
): Promise<{ data: JobSeekerProfile }> {
  return {
    data: {
      ...MOCK_JOB_SEEKER,
      ...input,
      updatedAt: new Date().toISOString(),
    },
  };
}
