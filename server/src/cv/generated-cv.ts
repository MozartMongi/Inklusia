import { CV_LAYOUT, type CvLayoutId } from "../db/cv-schema.js";
import type { JobSeekerProfileDto } from "../profiles/profile-dto.js";

export type GeneratedCv = {
  jobSeekerId: string;
  generatedAt: string;
  layoutId: CvLayoutId;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  photoUrl: string | null;
  disabilityType: JobSeekerProfileDto["disabilityType"];
  bio: string;
  skills: JobSeekerProfileDto["skills"];
  experiences: JobSeekerProfileDto["experiences"];
};

export function buildGeneratedCv(
  profile: JobSeekerProfileDto,
  generatedAt = new Date().toISOString(),
): GeneratedCv {
  return {
    jobSeekerId: profile.id,
    generatedAt,
    layoutId: CV_LAYOUT.id,
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
