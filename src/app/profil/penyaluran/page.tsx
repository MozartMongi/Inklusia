import { SeekerPlacementStatus } from "@/components/placements/seeker-placement-status";
import {
  PageActionLink,
  PageActions,
} from "@/components/layout/page-action-link";
import { fetchMyPlacements } from "@/lib/api/placements";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Status penyaluran",
  description:
    "Lihat status penyaluran profil Anda ke lowongan yang dipilih admin.",
};

export default async function SeekerPlacementStatusPage() {
  const placements = await fetchMyPlacements();

  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-3xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
    >
      <p className="mb-6">
        <PageActionLink href="/profil" tone="back">
          Kembali ke profil
        </PageActionLink>
      </p>
      <header className="mb-8">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Ruang pencari kerja
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Status penyaluran
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Anda tidak melamar langsung. Jika admin menyalurkan profil Anda, status
          terkini muncul di sini.
        </p>
        <PageActions>
          <PageActionLink href="/profil/penyaluran/riwayat">
            Lihat riwayat penyaluran
          </PageActionLink>
        </PageActions>
      </header>
      <SeekerPlacementStatus placements={placements} />
    </main>
  );
}
