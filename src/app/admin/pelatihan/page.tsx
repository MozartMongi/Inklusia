import { AdminTrainingList } from "@/components/admin/admin-training-list";
import {
  PageActionLink,
  PageActions,
} from "@/components/layout/page-action-link";
import { fetchAdminTrainings } from "@/lib/api/admin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pelatihan",
  description:
    "Kelola katalog pelatihan keahlian yang ditampilkan kepada pencari kerja.",
};

export default async function AdminTrainingsPage() {
  const trainings = await fetchAdminTrainings();

  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-5xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
    >
      <header className="mb-8 max-w-3xl">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Dashboard admin
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Pelatihan
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Kelola pelatihan keahlian. Status jadwal (akan datang, sedang
          berjalan, atau sudah berakhir) dihitung otomatis dari tanggal
          pelaksanaan.
        </p>
        <PageActions>
          <PageActionLink href="/admin/pelatihan/baru" variant="default">
            Tambah pelatihan
          </PageActionLink>
        </PageActions>
      </header>
      <AdminTrainingList trainings={trainings} />
    </main>
  );
}
