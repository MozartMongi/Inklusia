import type {
  JobSeekerCertificationRow,
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
  disabilityNotes: string;
  address: string;
  phone: string;
  bio: string;
  profileCompleteness: number;
  skills: Array<{
    id: string;
    skillName: string;
    level: SkillLevel;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    year: string;
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

function usablePhotoUrl(url: string | null | undefined): string | null {
  if (!url || url.startsWith("pending://")) {
    return null;
  }
  return url;
}

export function mapJobSeekerProfile(input: {
  profile: JobSeekerProfileRow;
  email: string;
  skills: JobSeekerSkillRow[];
  certifications: JobSeekerCertificationRow[];
  experiences: JobSeekerExperienceRow[];
  photos: JobSeekerPhotoRow[];
}): JobSeekerProfileDto {
  const photoUrl = usablePhotoUrl(
    input.photos.find((photo) => photo.kind === "photo")?.url,
  );
  const ktpPhotoUrl = usablePhotoUrl(
    input.photos.find((photo) => photo.kind === "ktp")?.url,
  );

  return {
    id: input.profile.id,
    userId: input.profile.user_id,
    email: input.email,
    fullName: input.profile.full_name,
    photoUrl,
    ktpPhotoUrl,
    disabilityType: input.profile.disability_type,
    disabilityNotes: input.profile.disability_notes ?? "",
    address: input.profile.address,
    phone: input.profile.phone,
    bio: input.profile.bio,
    profileCompleteness: 0,
    skills: input.skills.map((skill) => ({
      id: skill.id,
      skillName: skill.skill_name,
      level: skill.level,
    })),
    certifications: input.certifications.map((certification) => ({
      id: certification.id,
      name: certification.name,
      issuer: certification.issuer,
      year: certification.year,
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
