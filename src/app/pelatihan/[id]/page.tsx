import {
  PageActionLink,
} from "@/components/layout/page-action-link";
import { EnrollTrainingButton } from "@/components/trainings/enroll-training-button";
import { Badge } from "@/components/ui/badge";
import {
  fetchMyTrainingEnrollments,
  fetchTrainingById,
} from "@/lib/api/trainings";
import { TRAINING_FORMAT_LABEL } from "@/lib/types/training";
import {
  Accessibility,
  CalendarDays,
  Clock3,
  GraduationCap,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type TrainingDetailPageProps = {
  params: Promise<{ id: string }>;
};

function formatStartDate(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export async function generateMetadata({
  params,
}: TrainingDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const training = await fetchTrainingById(id);
  if (!training) {
    return { title: "Pelatihan tidak ditemukan" };
  }
  return {
    title: training.title,
    description: training.summary,
  };
}

export default async function TrainingDetailPage({
  params,
}: TrainingDetailPageProps) {
  const { id } = await params;
  const [training, enrollments] = await Promise.all([
    fetchTrainingById(id),
    fetchMyTrainingEnrollments(),
  ]);

  if (!training) {
    notFound();
  }

  const alreadyEnrolled = enrollments.some(
    (item) =>
      item.trainingId === training.id && item.status !== "dibatalkan",
  );

  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-3xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
    >
      <p className="mb-6">
        <PageActionLink href="/pelatihan" tone="back">
          Kembali ke daftar pelatihan
        </PageActionLink>
      </p>

      <article>
        <header className="mb-8">
          <p className="text-muted-foreground mb-2 text-sm">
            {training.provider}
          </p>
          <h1 className="text-foreground text-3xl font-semibold tracking-tight">
            {training.title}
          </h1>
          <p className="text-muted-foreground mt-3 text-base leading-7">
            {training.summary}
          </p>
          <ul className="text-foreground mt-4 flex flex-col gap-2 text-sm">
            <li className="flex items-start gap-2">
              <CalendarDays
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
              />
              <span>
                <span className="sr-only">Mulai: </span>
                {formatStartDate(training.startsAt)}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Clock3 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>
                <span className="sr-only">Durasi: </span>
                {training.durationLabel}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <GraduationCap
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
              />
              <span>
                <span className="sr-only">Format: </span>
                {TRAINING_FORMAT_LABEL[training.format]}
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
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary">
              {TRAINING_FORMAT_LABEL[training.format]}
            </Badge>
            {training.skillTags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        <section className="mb-8" aria-labelledby="deskripsi-pelatihan-heading">
          <h2
            id="deskripsi-pelatihan-heading"
            className="text-foreground mb-2 text-xl font-semibold"
          >
            Tentang pelatihan
          </h2>
          <p className="text-foreground text-base leading-7">
            {training.description}
          </p>
        </section>

        <section className="mb-8" aria-labelledby="aksesibilitas-heading">
          <h2
            id="aksesibilitas-heading"
            className="text-foreground mb-2 text-xl font-semibold"
          >
            Aksesibilitas
          </h2>
          <p className="text-foreground flex items-start gap-2 text-base leading-7">
            <Accessibility
              aria-hidden="true"
              className="mt-1 size-4 shrink-0"
            />
            <span>{training.accessibilityNotes}</span>
          </p>
        </section>

        <aside className="border-border bg-card rounded-xl border p-4 sm:p-5">
          <p className="text-foreground text-base leading-7">
            Pendaftaran tersimpan ke akun Anda. Setelah terdaftar, Anda dapat
            memantau status di halaman Pelatihan saya.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <EnrollTrainingButton
              trainingId={training.id}
              trainingTitle={training.title}
              alreadyEnrolled={alreadyEnrolled}
              seatsLeft={training.seatsLeft}
            />
            <PageActionLink href="/pelatihan/saya">
              Lihat pelatihan saya
            </PageActionLink>
          </div>
        </aside>
      </article>
    </main>
  );
}
