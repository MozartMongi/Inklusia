import type {
  JobSeekerDisabilityType,
  JobSeekerExperienceRow,
  JobSeekerPhotoRow,
  JobSeekerProfileRow,
  JobSeekerSkillRow,
  SkillLevel,
} from "../db/job-seeker-schema.js";

export type JobSeekerProfileDto = {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  photoUrl: string | null;
  ktpPhotoUrl: string | null;
  disabilityType: JobSeekerDisabilityType;
  address: string;
  phone: string;
  bio: string;
  profileCompleteness: number;
  skills: Array<{
    id: string;
    skillName: string;
    level: SkillLevel;
  }>;
  experiences: Array<{
    id: string;
    companyName: string;
    position: string;
    startDate: string;
    endDate: string | null;
    description: string;
  }>;
  updatedAt: string;
};

function isoDate(value: Date | string): string {
  if (typeof value === "string") {
    return value.slice(0, 10);
  }
  const year = value.getUTCFullYear();
  const month = String(value.getUTCMonth() + 1).padStart(2, "0");
  const day = String(value.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function mapJobSeekerProfile(input: {
  profile: JobSeekerProfileRow;
  email: string;
  skills: JobSeekerSkillRow[];
  experiences: JobSeekerExperienceRow[];
  photos: JobSeekerPhotoRow[];
}): JobSeekerProfileDto {
  const photoUrl =
    input.photos.find((photo) => photo.kind === "photo")?.url ?? null;
  const ktpPhotoUrl =
    input.photos.find((photo) => photo.kind === "ktp")?.url ?? null;

  return {
    id: input.profile.id,
    userId: input.profile.user_id,
    email: input.email,
    fullName: input.profile.full_name,
    photoUrl,
    ktpPhotoUrl,
    disabilityType: input.profile.disability_type,
    address: input.profile.address,
    phone: input.profile.phone,
    bio: input.profile.bio,
    profileCompleteness: 0,
    skills: input.skills.map((skill) => ({
      id: skill.id,
      skillName: skill.skill_name,
      level: skill.level,
    })),
    experiences: input.experiences.map((experience) => ({
      id: experience.id,
      companyName: experience.company_name,
      position: experience.position,
      startDate: isoDate(experience.start_date),
      endDate: experience.end_date ? isoDate(experience.end_date) : null,
      description: experience.description,
    })),
    updatedAt: input.profile.updated_at.toISOString(),
  };
}
