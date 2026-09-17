import { TrainingCard } from "@/components/trainings/training-card";
import { TrainingEmptyState } from "@/components/trainings/training-empty-state";
import type { Training } from "@/lib/types/training";

type TrainingListProps = {
  trainings: Training[];
  unavailable?: boolean;
};

export function TrainingList({
  trainings,
  unavailable = false,
}: TrainingListProps) {
  if (trainings.length === 0) {
    return (
      <TrainingEmptyState variant="katalog" unavailable={unavailable} />
    );
  }

  return (
    <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
      {trainings.map((training) => (
        <li key={training.id} className="min-w-0">
          <TrainingCard training={training} />
        </li>
      ))}
    </ul>
  );
}
