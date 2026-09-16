import { JobList } from "@/components/jobs/job-list";
import { JobSearchForm } from "@/components/jobs/job-search-form";
import { RegisterCta } from "@/components/jobs/register-cta";
import { PageActionLink } from "@/components/layout/page-action-link";
import { fetchActiveJobs, fetchJobs } from "@/lib/api/jobs";
import { uniqueJobLocations } from "@/lib/jobs/filters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lowongan kerja ramah disabilitas",
  description:
    "Jelajahi kesempatan dari perusahaan yang membuka ruang bagi penyandang disabilitas.",
};

type JobsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const [{ jobs, filters }, allJobs] = await Promise.all([
    fetchJobs(params),
    fetchActiveJobs(),
  ]);
  const locations = uniqueJobLocations(allJobs);

  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-6xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
    >
      <header className="mb-8 max-w-3xl">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Portal kerja inklusif
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
          Lowongan kerja ramah disabilitas
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Jelajahi kesempatan dari perusahaan yang membuka ruang bagi
          penyandang disabilitas. Lengkapi profil nanti agar admin dapat
          menyalurkan Anda ke lowongan yang sesuai.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <RegisterCta className="inline-flex max-w-full" />
          <PageActionLink href="/masuk">Sudah punya akun? Masuk</PageActionLink>
        </div>
      </header>

      <section aria-labelledby="daftar-lowongan-heading">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between">
          <h2
            id="daftar-lowongan-heading"
            className="text-foreground text-xl font-semibold"
          >
            Daftar lowongan
          </h2>
          <p
            id="hasil-pencarian"
            tabIndex={-1}
            aria-live="polite"
            className="text-muted-foreground scroll-mt-24 rounded-sm text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring"
          >
            {jobs.length} lowongan ditampilkan
            {filters.q ||
            filters.disabilitas ||
            filters.lokasi ||
            filters.jenis
              ? " sesuai pencarian atau saringan"
              : ""}
          </p>
        </div>
        <JobSearchForm filters={filters} locations={locations} />
        <JobList jobs={jobs} />
      </section>
    </main>
  );
}
