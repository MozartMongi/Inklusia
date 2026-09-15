import type {
  JobSeekerDisabilityType,
  JobSeekerSkill,
  WorkExperience,
} from "@/lib/types/job-seeker";

export type CvTemplateId = "profesional";

export type CvTemplate = {
  id: CvTemplateId;
  name: string;
  description: string;
};

export const PROFESSIONAL_CV_TEMPLATE: CvTemplate = {
  id: "profesional",
  name: "Profesional",
  description:
    "Tata letak formal untuk dibagikan ke perusahaan saat admin menyalurkan profil.",
};

export type SimulatedCvDownload = {
  fileName: string;
  templateId: CvTemplateId;
};

export type GeneratedCv = {
  jobSeekerId: string;
  generatedAt: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  photoUrl: string | null;
  disabilityType: JobSeekerDisabilityType;
  bio: string;
  skills: JobSeekerSkill[];
  experiences: WorkExperience[];
};
