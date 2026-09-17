import {
  PageActionLink,
  PageActions,
} from "@/components/layout/page-action-link";
import { TrainingList } from "@/components/trainings/training-list";
import { fetchTrainings } from "@/lib/api/trainings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pelatihan keahlian",
  description:
    "Daftar pelatihan untuk menambah keahlian yang dicari perusahaan inklusif.",
};

export default async function TrainingsPage() {
  const { trainings, unavailable } = await fetchTrainings();

  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-6xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
    >
      <header className="mb-8 max-w-3xl">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Peningkatan keahlian
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
          Pelatihan keahlian
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Ikuti pelatihan untuk memperkuat keterampilan yang sering dicari
          perusahaan inklusif.
        </p>
        <PageActions>
          <PageActionLink href="/pelatihan/saya">
            Lihat pelatihan saya
          </PageActionLink>
          <PageActionLink href="/profil" tone="back">
            Kembali ke profil
          </PageActionLink>
        </PageActions>
      </header>

      <section aria-labelledby="daftar-pelatihan-heading">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between">
          <h2
            id="daftar-pelatihan-heading"
            className="text-foreground text-xl font-semibold"
          >
            Daftar pelatihan
          </h2>
          <p className="text-muted-foreground text-sm" aria-live="polite">
            {unavailable
              ? "Data pelatihan belum dapat dimuat"
              : `${trainings.length} pelatihan ditampilkan`}
          </p>
        </div>
        <TrainingList trainings={trainings} unavailable={unavailable} />
      </section>
    </main>
  );
}
