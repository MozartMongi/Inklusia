export const PLACEMENT_STATUSES = [
  "menunggu",
  "dikirim",
  "diterima",
  "ditolak",
] as const;

export type PlacementStatus = (typeof PLACEMENT_STATUSES)[number];

export const PLACEMENT_STATUS_LABEL: Record<PlacementStatus, string> = {
  menunggu: "Menunggu dikirim",
  dikirim: "Sudah dikirim ke perusahaan",
  diterima: "Diterima perusahaan",
  ditolak: "Ditolak perusahaan",
};

export const PLACEMENT_STATUS_OPTIONS = PLACEMENT_STATUSES.map((value) => ({
  value,
  label: PLACEMENT_STATUS_LABEL[value],
}));

export const PLACEMENT_NOTE_MAX_LENGTH = 500;

export type PlacementRow = {
  id: string;
  job_seeker_profile_id: string;
  job_id: string;
  status: PlacementStatus;
  note: string;
  created_by_user_id: string | null;
  created_at: Date;
  updated_at: Date;
};
