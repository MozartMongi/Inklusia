export const CV_LAYOUT_ID = "profesional" as const;

export type CvLayoutId = typeof CV_LAYOUT_ID;

export const CV_LAYOUT = {
  id: CV_LAYOUT_ID,
  name: "Profesional",
  description:
    "Tata letak formal untuk dibagikan ke perusahaan saat admin menyalurkan profil.",
} as const;

export type JobSeekerCvPreferenceRow = {
  id: string;
  job_seeker_profile_id: string;
  last_generated_at: Date | null;
  last_downloaded_at: Date | null;
  created_at: Date;
  updated_at: Date;
};
