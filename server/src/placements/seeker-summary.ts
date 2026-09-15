import type { JobSeekerProfileDto } from "../profiles/profile-dto.js";

export type JobSeekerSummaryDto = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  disabilityType: JobSeekerProfileDto["disabilityType"];
  city: string;
  profileCompleteness: number;
  skillNames: string[];
};

export function cityFromAddress(address: string): string {
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.at(-1) || address;
}

export function toSeekerSummary(profile: JobSeekerProfileDto): JobSeekerSummaryDto {
  return {
    id: profile.id,
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    disabilityType: profile.disabilityType,
    city: cityFromAddress(profile.address),
    profileCompleteness: profile.profileCompleteness,
    skillNames: profile.skills.map((skill) => skill.skillName),
  };
}
