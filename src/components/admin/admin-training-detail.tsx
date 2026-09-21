import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JOB_SEEKER_DISABILITY_LABEL } from "@/lib/types/job-seeker";
import {
  TRAINING_ENROLLMENT_STATUS_LABEL,
  TRAINING_FORMAT_LABEL,
  TRAINING_SCHEDULE_STATUS_LABEL,
  type AdminTrainingDetail,
  type TrainingScheduleStatus,
} from "@/lib/types/training";
import Link from "next/link";

type AdminTrainingDetailProps = {
  training: AdminTrainingDetail;
};

function scheduleBadgeVariant(
  status: TrainingScheduleStatus,
): "default" | "secondary" | "outline" {
  if (status === "berlangsung") return "default";
  if (status === "akan_datang") return "secondary";
  return "outline";
}

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function AdminTrainingDetailView({ training }: AdminTrainingDetailProps) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge variant={scheduleBadgeVariant(training.scheduleStatus)}>
              {TRAINING_SCHEDULE_STATUS_LABEL[training.scheduleStatus]}
            </Badge>
            <Badge variant="outline">
              {TRAINING_FORMAT_LABEL[training.format]}
            </Badge>
            <Badge variant={training.isPublished ? "secondary" : "destructive"}>
              {training.isPublished ? "Dipublikasikan" : "Tidak dipublikasikan"}
            </Badge>
          </div>
          <CardTitle className="text-foreground text-2xl font-semibold">
            {training.title}
          </CardTitle>
          <CardDescription className="mt-1 text-base">
            {training.provider}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-foreground text-base leading-7">
            {training.summary}
          </p>
        </CardContent>
      </Card>

      <section aria-labelledby="info-pelatihan-heading">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              <h2 id="info-pelatihan-heading" className="text-xl font-semibold">
                Informasi pelatihan
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailItem
                label="Mulai"
                value={formatDateTime(training.startsAt)}
              />
              <DetailItem
                label="Selesai"
                value={formatDateTime(training.endsAt)}
              />
              <DetailItem label="Durasi" value={training.durationLabel} />
              <DetailItem
                label="Kuota"
                value={`${training.seatsLeft} dari ${training.seatsTotal} tersisa`}
              />
              <DetailItem
                label="Tag keahlian"
                value={
                  training.skillTags.length > 0
                    ? training.skillTags.join(", ")
                    : "—"
                }
              />
              <DetailItem
                label="Peserta aktif"
                value={`${training.enrollmentCount} pencari kerja`}
              />
            </dl>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="deskripsi-admin-heading">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              <h2 id="deskripsi-admin-heading" className="text-xl font-semibold">
                Deskripsi
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground text-base leading-7">
              {training.description}
            </p>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="aksesibilitas-admin-heading">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              <h2
                id="aksesibilitas-admin-heading"
                className="text-xl font-semibold"
              >
                Aksesibilitas
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground text-base leading-7">
              {training.accessibilityNotes}
            </p>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="peserta-pelatihan-heading">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              <h2
                id="peserta-pelatihan-heading"
                className="text-xl font-semibold"
              >
                Pencari kerja yang mendaftar
              </h2>
            </CardTitle>
            <CardDescription>
              Daftar peserta aktif (tidak termasuk yang dibatalkan).
            </CardDescription>
          </CardHeader>
          <CardContent>
            {training.enrollments.length === 0 ? (
              <p
                role="status"
                className="text-muted-foreground text-base leading-7"
              >
                Belum ada pencari kerja yang mendaftar pada pelatihan ini.
              </p>
            ) : (
              <ul className="flex list-none flex-col gap-3 p-0">
                {training.enrollments.map((enrollment) => (
                  <li
                    key={enrollment.id}
                    className="border-border rounded-xl border p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-foreground text-base font-semibold">
                          <Link
                            href={`/admin/pencari-kerja/${enrollment.seeker.id}`}
                            className="hover:underline focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
                          >
                            {enrollment.seeker.fullName}
                          </Link>
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {enrollment.seeker.email} · {enrollment.seeker.phone}
                        </p>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {enrollment.seeker.city} ·{" "}
                          {
                            JOB_SEEKER_DISABILITY_LABEL[
                              enrollment.seeker.disabilityType
                            ]
                          }
                        </p>
                      </div>
                      <div className="flex flex-col items-start gap-1 sm:items-end">
                        <Badge variant="secondary">
                          {
                            TRAINING_ENROLLMENT_STATUS_LABEL[
                              enrollment.status
                            ]
                          }
                        </Badge>
                        <p className="text-muted-foreground text-xs">
                          Mendaftar {formatShortDate(enrollment.enrolledAt)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="text-foreground mt-1 text-base leading-7">{value}</dd>
    </div>
  );
}
