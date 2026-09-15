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
  TRAINING_FORMAT_LABEL,
  type Training,
} from "@/lib/types/training";
import { CalendarDays, GraduationCap, Users } from "lucide-react";
import Link from "next/link";

type TrainingCardProps = {
  training: Training;
};

function formatStartDate(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function TrainingCard({ training }: TrainingCardProps) {
  const detailHref = `/pelatihan/${training.id}`;

  return (
    <article className="relative h-full">
      <Card className="h-full overflow-visible">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            <h3 className="text-lg leading-snug font-semibold">
              <Link
                href={detailHref}
                className="focus-visible:ring-ring after:absolute after:inset-0 after:rounded-xl hover:underline focus-visible:ring-3 focus-visible:outline-none"
              >
                {training.title}
              </Link>
            </h3>
          </CardTitle>
          <CardDescription className="text-foreground/80 flex items-center gap-2 text-sm">
            <GraduationCap aria-hidden="true" className="size-4 shrink-0" />
            <span>{training.provider}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          <p className="text-muted-foreground text-sm leading-6">
            {training.summary}
          </p>
          <ul className="text-foreground flex flex-col gap-2 text-sm">
            <li className="flex items-start gap-2">
              <CalendarDays
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
              />
              <span>
                <span className="sr-only">Mulai: </span>
                {formatStartDate(training.startsAt)} · {training.durationLabel}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Users aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>
                <span className="sr-only">Sisa kuota: </span>
                {training.seatsLeft} kursi tersisa
              </span>
            </li>
          </ul>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {TRAINING_FORMAT_LABEL[training.format]}
            </Badge>
            {training.skillTags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="mt-auto">
          <span className="text-primary text-sm font-medium underline-offset-4">
            Lihat detail pelatihan
          </span>
        </CardFooter>
      </Card>
    </article>
  );
}
