import type { GeneratedCv } from "@/lib/types/cv";

export type CvPreviewGap = {
  id: "foto" | "ringkasan" | "keahlian" | "pengalaman";
  label: string;
  href: string;
};

export function getCvPreviewGaps(cv: GeneratedCv): CvPreviewGap[] {
  const gaps: CvPreviewGap[] = [];

  if (!cv.photoUrl) {
    gaps.push({
      id: "foto",
      label: "Foto diri",
      href: "/profil#dokumen",
    });
  }
  if (!cv.bio.trim()) {
    gaps.push({
      id: "ringkasan",
      label: "Ringkasan",
      href: "/profil#data-diri",
    });
  }
  if (cv.skills.length === 0) {
    gaps.push({
      id: "keahlian",
      label: "Keahlian",
      href: "/profil#keahlian",
    });
  }
  if (cv.experiences.length === 0) {
    gaps.push({
      id: "pengalaman",
      label: "Pengalaman kerja",
      href: "/profil#pengalaman",
    });
  }

  return gaps;
}
