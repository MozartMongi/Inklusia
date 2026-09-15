import { TrainingEmptyState } from "@/components/trainings/training-empty-state";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TRAINING_ENROLLMENT_STATUS_LABEL,
  TRAINING_FORMAT_LABEL,
  type Training,
  type TrainingEnrollment,
} from "@/lib/types/training";
import { CalendarDays, GraduationCap } from "lucide-react";
import Link from "next/link";

export type MyTrainingItem = {
  enrollment: TrainingEnrollment;
  training: Training;
};

type MyTrainingListProps = {
  items: MyTrainingItem[];
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function MyTrainingList({ items }: MyTrainingListProps) {
  if (items.length === 0) {
    return <TrainingEmptyState variant="saya" />;
  }

  return (
    <ul className="grid list-none grid-cols-1 gap-4 p-0">
      {items.map(({ enrollment, training }) => (
        <li key={enrollment.id} className="min-w-0">
          <article className="relative">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <CardTitle className="text-lg font-semibold">
                    <h3 className="text-lg leading-snug font-semibold">
                      <Link
                        href={`/pelatihan/${training.id}`}
                        className="focus-visible:ring-ring after:absolute after:inset-0 after:rounded-xl hover:underline focus-visible:ring-3 focus-visible:outline-none"
                      >
                        {training.title}
                      </Link>
                    </h3>
                  </CardTitle>
                  <Badge variant="secondary">
                    {TRAINING_ENROLLMENT_STATUS_LABEL[enrollment.status]}
                  </Badge>
                </div>
                <CardDescription className="text-foreground/80 flex items-center gap-2 text-sm">
                  <GraduationCap
                    aria-hidden="true"
                    className="size-4 shrink-0"
                  />
                  <span>{training.provider}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                <p className="text-muted-foreground flex items-start gap-2">
                  <CalendarDays
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0"
                  />
                  <span>
                    Terdaftar {formatDate(enrollment.enrolledAt)} ·{" "}
                    {TRAINING_FORMAT_LABEL[training.format]}
                  </span>
                </p>
              </CardContent>
              <CardFooter>
                <span className="text-primary text-sm font-medium underline-offset-4">
                  Buka detail pelatihan
                </span>
              </CardFooter>
            </Card>
          </article>
        </li>
      ))}
    </ul>
  );
}
