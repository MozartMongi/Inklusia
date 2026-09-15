import type { GeneratedCv } from "@/lib/types/cv";
import type { JobSeekerProfile } from "@/lib/types/job-seeker";

export function generatedCvFromProfile(
  profile: JobSeekerProfile,
  generatedAt: string,
): GeneratedCv {
  return {
    jobSeekerId: profile.id,
    generatedAt,
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    address: profile.address,
    photoUrl: profile.photoUrl,
    disabilityType: profile.disabilityType,
    bio: profile.bio,
    skills: profile.skills,
    experiences: profile.experiences,
  };
}
