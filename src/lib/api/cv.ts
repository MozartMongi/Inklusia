import { simulatedCvFileName } from "@/lib/cv/download";
import { generatedCvFromProfile } from "@/lib/cv/from-profile";
import { MOCK_JOB_SEEKER } from "@/lib/mock/job-seeker";
import {
  PROFESSIONAL_CV_TEMPLATE,
  type CvTemplate,
  type GeneratedCv,
  type SimulatedCvDownload,
} from "@/lib/types/cv";

/**
 * Kontrak API yang diasumsikan frontend:
 * GET /api/me/cv → { data: GeneratedCv }
 */
export async function fetchMyGeneratedCv(): Promise<GeneratedCv> {
  return generatedCvFromProfile(MOCK_JOB_SEEKER, "2026-09-13T10:00:00.000Z");
}

/**
 * Kontrak API yang diasumsikan frontend:
 * GET /api/cv/template → { data: CvTemplate }
 * Generate CV selalu memakai template Profesional.
 */
export async function fetchCvTemplate(): Promise<CvTemplate> {
  return PROFESSIONAL_CV_TEMPLATE;
}

/**
 * Kontrak API yang diasumsikan frontend:
 * POST /api/me/cv/unduh → { data: SimulatedCvDownload }
 * Frontend fase ini mensimulasikan unduhan, tanpa berkas PDF sungguhan.
 */
export async function simulateCvDownload(
  cv: GeneratedCv,
): Promise<SimulatedCvDownload> {
  return {
    fileName: simulatedCvFileName(cv),
    templateId: PROFESSIONAL_CV_TEMPLATE.id,
  };
}
