import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TRAINING_FORMAT_LABEL,
  TRAINING_SCHEDULE_STATUS_LABEL,
  type AdminTraining,
  type TrainingScheduleStatus,
} from "@/lib/types/training";
import Link from "next/link";

type AdminTrainingListProps = {
  trainings: AdminTraining[];
};

function scheduleBadgeVariant(
  status: TrainingScheduleStatus,
): "default" | "secondary" | "outline" {
  if (status === "berlangsung") return "default";
  if (status === "akan_datang") return "secondary";
  return "outline";
}

function formatScheduleRange(startsAt: string, endsAt: string): string {
  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${formatter.format(new Date(startsAt))} – ${formatter.format(new Date(endsAt))}`;
}

export function AdminTrainingList({ trainings }: AdminTrainingListProps) {
  return (
    <section aria-labelledby="daftar-pelatihan-admin-heading">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between">
        <h2
          id="daftar-pelatihan-admin-heading"
          className="text-foreground text-xl font-semibold"
        >
          Daftar pelatihan
        </h2>
        <p className="text-muted-foreground text-sm" aria-live="polite">
          {trainings.length} pelatihan ditampilkan
        </p>
      </div>

      {trainings.length === 0 ? (
        <p
          role="status"
          className="border-border bg-card text-muted-foreground rounded-xl border px-4 py-10 text-center text-base leading-7"
        >
          Belum ada pelatihan yang dibuat. Tambahkan pelatihan baru agar dapat
          ditampilkan di katalog publik dan diikuti pencari kerja.
        </p>
      ) : (
        <ul className="grid list-none grid-cols-1 gap-4 p-0 lg:grid-cols-2">
          {trainings.map((training) => (
            <li key={training.id} className="min-w-0">
              <Card className="relative h-full overflow-visible">
                <CardHeader>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <Badge
                      variant={scheduleBadgeVariant(training.scheduleStatus)}
                    >
                      {
                        TRAINING_SCHEDULE_STATUS_LABEL[
                          training.scheduleStatus
                        ]
                      }
                    </Badge>
                    <Badge variant="outline">
                      {TRAINING_FORMAT_LABEL[training.format]}
                    </Badge>
                    {!training.isPublished ? (
                      <Badge variant="destructive">Tidak dipublikasikan</Badge>
                    ) : null}
                  </div>
                  <CardTitle className="text-lg font-semibold">
                    <h3 className="text-lg leading-snug font-semibold">
                      <Link
                        href={`/admin/pelatihan/${training.id}`}
                        className="focus-visible:ring-ring after:absolute after:inset-0 after:rounded-xl hover:underline focus-visible:ring-3 focus-visible:outline-none"
                      >
                        {training.title}
                      </Link>
                    </h3>
                  </CardTitle>
                  <CardDescription>
                    {training.provider} ·{" "}
                    {formatScheduleRange(training.startsAt, training.endsAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <p className="text-muted-foreground text-sm leading-6">
                    {training.summary}
                  </p>
                  <dl className="text-muted-foreground grid gap-1 text-sm">
                    <div className="flex flex-wrap gap-x-2">
                      <dt className="text-foreground font-medium">Durasi</dt>
                      <dd>{training.durationLabel}</dd>
                    </div>
                    <div className="flex flex-wrap gap-x-2">
                      <dt className="text-foreground font-medium">Kuota</dt>
                      <dd>
                        {training.seatsLeft}/{training.seatsTotal} tersisa
                      </dd>
                    </div>
                    <div className="flex flex-wrap gap-x-2">
                      <dt className="text-foreground font-medium">Peserta</dt>
                      <dd>{training.enrollmentCount} terdaftar</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
