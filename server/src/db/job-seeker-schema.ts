export const JOB_SEEKER_DISABILITY_TYPES = [
  "tuli",
  "daksa",
  "netra",
  "autisme",
  "intelektual",
] as const;

export type JobSeekerDisabilityType =
  (typeof JOB_SEEKER_DISABILITY_TYPES)[number];

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

export const JOB_SEEKER_DISABILITY_OPTIONS = JOB_SEEKER_DISABILITY_TYPES.map(
  (value) => ({
    value,
    label: JOB_SEEKER_DISABILITY_LABEL[value],
  }),
);

export type JobSeekerProfileRow = {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address: string;
  disability_type: JobSeekerDisabilityType;
  disability_notes: string;
  bio: string;
  created_at: Date;
  updated_at: Date;
};

export const SKILL_LEVELS = ["dasar", "menengah", "mahir"] as const;

export type SkillLevel = (typeof SKILL_LEVELS)[number];

export const SKILL_LEVEL_LABEL: Record<SkillLevel, string> = {
  dasar: "Dasar",
  menengah: "Menengah",
  mahir: "Mahir",
};

export type JobSeekerSkillRow = {
  id: string;
  profile_id: string;
  skill_name: string;
  level: SkillLevel;
  created_at: Date;
};

export type JobSeekerExperienceRow = {
  id: string;
  profile_id: string;
  company_name: string;
  position: string;
  start_date: Date | string;
  end_date: Date | string | null;
  description: string;
  created_at: Date;
};

export const JOB_SEEKER_PHOTO_KINDS = ["photo", "ktp"] as const;

export type JobSeekerPhotoKind = (typeof JOB_SEEKER_PHOTO_KINDS)[number];

export type JobSeekerPhotoRow = {
  id: string;
  profile_id: string;
  kind: JobSeekerPhotoKind;
  url: string;
  created_at: Date;
  updated_at: Date;
};
