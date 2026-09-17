import {
  PageActionLink,
  PageActions,
} from "@/components/layout/page-action-link";
import { MyTrainingList } from "@/components/trainings/my-training-list";
import {
  fetchMyTrainingEnrollments,
  fetchTrainings,
} from "@/lib/api/trainings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pelatihan saya",
  description:
    "Pantau pelatihan yang sudah Anda ikuti atau daftarkan.",
};

export default async function MyTrainingsPage() {
  const [enrollments, catalog] = await Promise.all([
    fetchMyTrainingEnrollments(),
    fetchTrainings(),
  ]);

  const items = enrollments
    .map((enrollment) => {
      const training = catalog.trainings.find(
        (item) => item.id === enrollment.trainingId,
      );
      if (!training) {
        return null;
      }
      return { enrollment, training };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-3xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
    >
      <header className="mb-8">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Peningkatan keahlian
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Pelatihan saya
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Ringkasan pendaftaran pelatihan Anda. Status diperbarui setelah Anda
          mendaftar dari detail pelatihan.
        </p>
        <PageActions>
          <PageActionLink href="/pelatihan" variant="default">
            Jelajahi katalog
          </PageActionLink>
          <PageActionLink href="/profil" tone="back">
            Kembali ke profil
          </PageActionLink>
        </PageActions>
      </header>

      <p className="text-muted-foreground mb-4 text-sm" aria-live="polite">
        {items.length} pelatihan ditampilkan
      </p>
      <MyTrainingList items={items} />
    </main>
  );
}
