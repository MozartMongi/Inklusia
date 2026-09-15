export type JobSeekerDisabilityType =
  | "tuli"
  | "daksa"
  | "netra"
  | "autisme"
  | "intelektual";

export type SkillLevel = "dasar" | "menengah" | "mahir";

export type JobSeekerSkill = {
  id: string;
  skillName: string;
  level: SkillLevel;
};

export type JobSeekerCertification = {
  id: string;
  name: string;
  issuer: string;
  year: string;
};

export type WorkExperience = {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string;
};

export type JobSeekerProfile = {
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
  skills: JobSeekerSkill[];
  certifications: JobSeekerCertification[];
  experiences: WorkExperience[];
  updatedAt: string;
};

export const JOB_SEEKER_DISABILITY_LABEL: Record<
  JobSeekerDisabilityType,
  string
> = {
  tuli: "Tuli / gangguan dengar",
  daksa: "Disabilitas daksa",
  netra: "Netra / low vision",
  autisme: "Autisme / neurodiversitas",
  intelektual: "Disabilitas intelektual",
};

export const SKILL_LEVEL_LABEL: Record<SkillLevel, string> = {
  dasar: "Dasar",
  menengah: "Menengah",
  mahir: "Mahir",
};
