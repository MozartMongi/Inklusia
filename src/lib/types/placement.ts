import type { JobSeekerDisabilityType } from "@/lib/types/job-seeker";

export type PlacementStatus =
  | "menunggu"
  | "dikirim"
  | "diterima"
  | "ditolak";

export type JobSeekerSummary = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  disabilityType: JobSeekerDisabilityType;
  city: string;
  profileCompleteness: number;
  skillNames: string[];
};

export type ContactChannel = "telepon" | "email" | "whatsapp";

export type PlacementContactLog = {
  id: string;
  jobSeekerId: string;
  channel: ContactChannel;
  message: string;
  createdAt: string;
};

export type PlacementJobSummary = {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  location: string;
};

export type Placement = {
  id: string;
  jobSeeker: Pick<JobSeekerSummary, "id" | "fullName" | "disabilityType">;
  job: PlacementJobSummary;
  status: PlacementStatus;
  createdAt: string;
};

export const PLACEMENT_STATUS_LABEL: Record<PlacementStatus, string> = {
  menunggu: "Menunggu dikirim",
  dikirim: "Sudah dikirim ke perusahaan",
  diterima: "Diterima perusahaan",
  ditolak: "Ditolak perusahaan",
};

export const CONTACT_CHANNEL_LABEL: Record<ContactChannel, string> = {
  telepon: "Telepon",
  email: "Email",
  whatsapp: "WhatsApp",
};
