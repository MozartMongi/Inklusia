import { apiDownload, apiGet } from "@/lib/api/http";
import {
  PROFESSIONAL_CV_TEMPLATE,
  type CvTemplate,
  type GeneratedCv,
} from "@/lib/types/cv";

export async function fetchMyGeneratedCv(): Promise<GeneratedCv> {
  return apiGet<GeneratedCv>("/api/me/cv");
}

export async function fetchCvTemplate(): Promise<CvTemplate> {
  return PROFESSIONAL_CV_TEMPLATE;
}

export async function downloadGeneratedCv(): Promise<{
  blob: Blob;
  fileName: string;
}> {
  return apiDownload("/api/me/cv/unduh", "POST");
}
