export type JobType =
  | "penuh_waktu"
  | "paruh_waktu"
  | "kontrak"
  | "magang"
  | "lepas";

export type DisabilityFriendlyType =
  | "semua"
  | "tuli"
  | "daksa"
  | "netra"
  | "autisme"
  | "intelektual"
  | "lainnya";

export type CompanySummary = {
  id: string;
  name: string;
  industry: string;
  address: string;
};

export type JobListing = {
  id: string;
  title: string;
  description: string;
  requirements: string;
  disabilityFriendlyType: DisabilityFriendlyType;
  location: string;
  jobType: JobType;
  isActive: boolean;
  createdAt: string;
  company: CompanySummary;
};

export const JOB_TYPE_LABEL: Record<JobType, string> = {
  penuh_waktu: "Penuh waktu",
  paruh_waktu: "Paruh waktu",
  kontrak: "Kontrak",
  magang: "Magang",
  lepas: "Lepas",
};

export const DISABILITY_FRIENDLY_LABEL: Record<DisabilityFriendlyType, string> =
  {
    semua: "Ramah semua jenis disabilitas",
    tuli: "Ramah tuli / gangguan dengar",
    daksa: "Ramah disabilitas daksa",
    netra: "Ramah netra / low vision",
    autisme: "Ramah autisme / neurodiversitas",
    intelektual: "Ramah disabilitas intelektual",
    lainnya: "Ramah disabilitas lainnya",
  };
