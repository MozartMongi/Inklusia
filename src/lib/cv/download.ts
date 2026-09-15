import type { GeneratedCv } from "@/lib/types/cv";

export function simulatedCvFileName(cv: GeneratedCv): string {
  const slug = cv.fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `cv-${slug || "pencari-kerja"}-profesional.pdf`;
}
