export const DISABILITY_FRIENDLY_TYPES = [
  "semua",
  "tuli",
  "daksa",
  "netra",
  "autisme",
  "intelektual",
] as const;

export const JOB_TYPES = [
  "penuh_waktu",
  "paruh_waktu",
  "kontrak",
  "magang",
  "lepas",
] as const;

export type DisabilityFriendlyType = (typeof DISABILITY_FRIENDLY_TYPES)[number];
export type JobType = (typeof JOB_TYPES)[number];

export const DISABILITY_FRIENDLY_LABEL: Record<DisabilityFriendlyType, string> =
  {
    semua: "Ramah semua jenis disabilitas",
    tuli: "Ramah tuli / gangguan dengar",
    daksa: "Ramah disabilitas daksa",
    netra: "Ramah netra / low vision",
    autisme: "Ramah autisme / neurodiversitas",
    intelektual: "Ramah disabilitas intelektual",
  };

export const JOB_TYPE_LABEL: Record<JobType, string> = {
  penuh_waktu: "Penuh waktu",
  paruh_waktu: "Paruh waktu",
  kontrak: "Kontrak",
  magang: "Magang",
  lepas: "Lepas",
};

export const DISABILITY_FILTER_OPTIONS = DISABILITY_FRIENDLY_TYPES.map(
  (value) => ({
    value,
    label: DISABILITY_FRIENDLY_LABEL[value],
  }),
);

export const JOB_TYPE_FILTER_OPTIONS = JOB_TYPES.map((value) => ({
  value,
  label: JOB_TYPE_LABEL[value],
}));

export type JobRow = {
  id: string;
  company_id: string;
  title: string;
  description: string;
  requirements: string;
  disability_friendly_type: DisabilityFriendlyType;
  location: string;
  job_type: JobType;
  is_active: boolean;
  created_at: Date;
};
