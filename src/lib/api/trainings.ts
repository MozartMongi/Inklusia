import { apiGet, apiSend, isApiError, isUnavailableError } from "@/lib/api/http";
import type { Training, TrainingEnrollment } from "@/lib/types/training";

export async function fetchTrainings(): Promise<{
  trainings: Training[];
  unavailable: boolean;
}> {
  try {
    return {
      trainings: await apiGet<Training[]>("/api/pelatihan"),
      unavailable: false,
    };
  } catch (error) {
    if (isUnavailableError(error)) {
      return { trainings: [], unavailable: true };
    }
    throw error;
  }
}

export async function fetchTrainingById(id: string): Promise<Training | null> {
  try {
    return await apiGet<Training>(`/api/pelatihan/${id}`);
  } catch (error) {
    if (isApiError(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function fetchMyTrainingEnrollments(): Promise<
  TrainingEnrollment[]
> {
  try {
    return await apiGet<TrainingEnrollment[]>("/api/me/pelatihan");
  } catch (error) {
    if (
      isApiError(error) &&
      (error.status === 401 || error.status === 403 || isUnavailableError(error))
    ) {
      return [];
    }
    throw error;
  }
}

export type EnrollTrainingResult =
  | { data: TrainingEnrollment }
  | { error: string };

export async function enrollInTraining(
  trainingId: string,
): Promise<EnrollTrainingResult> {
  try {
    const data = await apiSend<TrainingEnrollment>("/api/me/pelatihan", "POST", {
      trainingId,
    });
    return { data };
  } catch (error) {
    if (isApiError(error)) {
      return { error: error.message };
    }
    throw error;
  }
}
