import {
  MOCK_TRAININGS,
  trainingEnrollmentsStore,
} from "@/lib/mock/trainings";
import type {
  Training,
  TrainingEnrollment,
} from "@/lib/types/training";

/**
 * Kontrak yang diasumsikan:
 * GET /api/pelatihan → { data: Training[] }
 */
export async function fetchTrainings(): Promise<Training[]> {
  return [...MOCK_TRAININGS].sort((a, b) =>
    a.startsAt.localeCompare(b.startsAt),
  );
}

/**
 * Kontrak yang diasumsikan:
 * GET /api/pelatihan/:id → { data: Training }
 */
export async function fetchTrainingById(
  id: string,
): Promise<Training | null> {
  return MOCK_TRAININGS.find((training) => training.id === id) ?? null;
}

/**
 * Kontrak yang diasumsikan:
 * GET /api/me/pelatihan → { data: TrainingEnrollment[] }
 */
export async function fetchMyTrainingEnrollments(): Promise<
  TrainingEnrollment[]
> {
  return [...trainingEnrollmentsStore].sort((a, b) =>
    b.enrolledAt.localeCompare(a.enrolledAt),
  );
}

export type EnrollTrainingResult =
  | { data: TrainingEnrollment }
  | { error: string };

/**
 * Kontrak yang diasumsikan:
 * POST /api/me/pelatihan → { data: TrainingEnrollment }
 */
export async function enrollInTraining(
  trainingId: string,
): Promise<EnrollTrainingResult> {
  const training = MOCK_TRAININGS.find((item) => item.id === trainingId);
  if (!training) {
    return { error: "Pelatihan tidak ditemukan." };
  }
  if (training.seatsLeft <= 0) {
    return { error: "Kuota pelatihan sudah penuh." };
  }
  if (
    trainingEnrollmentsStore.some(
      (item) =>
        item.trainingId === trainingId && item.status !== "dibatalkan",
    )
  ) {
    return { error: "Anda sudah terdaftar pada pelatihan ini." };
  }

  const enrollment: TrainingEnrollment = {
    id: `enr-${String(trainingEnrollmentsStore.length + 1).padStart(3, "0")}`,
    trainingId,
    status: "terdaftar",
    enrolledAt: new Date().toISOString(),
  };
  trainingEnrollmentsStore.push(enrollment);
  return { data: enrollment };
}
