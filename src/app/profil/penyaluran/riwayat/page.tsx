import { SeekerPlacementStatus } from "@/components/placements/seeker-placement-status";
import { PageActionLink } from "@/components/layout/page-action-link";
import { fetchMyPlacementHistory } from "@/lib/api/placements";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riwayat penyaluran",
  description:
    "Riwayat lengkap penyaluran profil pencari kerja ke perusahaan.",
};

export default async function SeekerPlacementHistoryPage() {
  const placements = await fetchMyPlacementHistory();

  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-3xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
    >
      <p className="mb-6">
        <PageActionLink href="/profil/penyaluran" tone="back">
          Kembali ke status penyaluran
        </PageActionLink>
      </p>
      <header className="mb-8">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Ruang pencari kerja
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Riwayat penyaluran
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Semua penyaluran profil Anda, termasuk yang sudah diterima atau
          ditolak perusahaan.
        </p>
      </header>
      <p className="text-muted-foreground mb-4 text-sm" aria-live="polite">
        {placements.length} penyaluran ditampilkan
      </p>
      <SeekerPlacementStatus placements={placements} />
    </main>
  );
}
