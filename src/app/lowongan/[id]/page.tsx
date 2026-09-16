import { RegisterCta } from "@/components/jobs/register-cta";
import { PageActionLink } from "@/components/layout/page-action-link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { fetchJobById } from "@/lib/api/jobs";
import { MOCK_JOBS } from "@/lib/mock/jobs";
import {
  DISABILITY_FRIENDLY_LABEL,
  JOB_TYPE_LABEL,
} from "@/lib/types/job";
import { Briefcase, Building2, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type JobDetailPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return MOCK_JOBS.filter((job) => job.isActive).map((job) => ({
    id: job.id,
  }));
}

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await fetchJobById(id);

  if (!job) {
    return { title: "Lowongan tidak ditemukan" };
  }

  return {
    title: `${job.title} di ${job.company.name}`,
    description: job.description,
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = await fetchJobById(id);

  if (!job) {
    notFound();
  }

  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-3xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
    >
      <p className="mb-6">
        <PageActionLink href="/lowongan" tone="back">
          Kembali ke daftar lowongan
        </PageActionLink>
      </p>

      <article>
        <header className="mb-8">
          <p className="text-muted-foreground mb-2 text-sm">
            {job.company.name}
          </p>
          <h1 className="text-foreground text-3xl font-semibold tracking-tight">
            {job.title}
          </h1>
          <ul className="text-foreground mt-4 flex flex-col gap-2 text-sm">
            <li className="flex items-start gap-2">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>
                <span className="sr-only">Lokasi: </span>
                {job.location}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Briefcase
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
              />
              <span>
                <span className="sr-only">Jenis pekerjaan: </span>
                {JOB_TYPE_LABEL[job.jobType]}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Building2
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
              />
              <span>
                <span className="sr-only">Industri: </span>
                {job.company.industry}
              </span>
            </li>
          </ul>
          <Badge
            variant="secondary"
            className="mt-4 h-auto max-w-full px-2.5 py-1 text-left text-sm leading-5 whitespace-normal"
          >
            {DISABILITY_FRIENDLY_LABEL[job.disabilityFriendlyType]}
          </Badge>
        </header>

        <section className="mb-8" aria-labelledby="deskripsi-heading">
          <h2
            id="deskripsi-heading"
            className="text-foreground mb-2 text-xl font-semibold"
          >
            Deskripsi pekerjaan
          </h2>
          <p className="text-foreground text-base leading-7">
            {job.description}
          </p>
        </section>

        <section className="mb-8" aria-labelledby="syarat-heading">
          <h2
            id="syarat-heading"
            className="text-foreground mb-2 text-xl font-semibold"
          >
            Syarat
          </h2>
          <p className="text-foreground text-base leading-7">
            {job.requirements}
          </p>
        </section>

        <section className="mb-8" aria-labelledby="perusahaan-heading">
          <h2
            id="perusahaan-heading"
            className="text-foreground mb-2 text-xl font-semibold"
          >
            Informasi perusahaan
          </h2>
          <dl className="text-foreground grid grid-cols-1 gap-3 text-base sm:grid-cols-[8rem_1fr]">
            <dt className="text-muted-foreground">Nama</dt>
            <dd>{job.company.name}</dd>
            <dt className="text-muted-foreground">Industri</dt>
            <dd>{job.company.industry}</dd>
            <dt className="text-muted-foreground">Alamat</dt>
            <dd>{job.company.address}</dd>
          </dl>
        </section>

        <aside className="border-border bg-card rounded-xl border p-4 sm:p-5">
          <p className="text-foreground text-base leading-7">
            Pencari kerja tidak melamar langsung. Daftarkan diri agar admin
            dapat menyalurkan profil Anda ke lowongan yang sesuai.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <RegisterCta />
            <Link
              href="/lowongan"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "min-h-11 px-4",
              })}
            >
              Lihat lowongan lain
            </Link>
          </div>
        </aside>
      </article>
    </main>
  );
}
