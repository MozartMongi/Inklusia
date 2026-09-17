import { PlacementHistoryForm } from "@/components/placements/placement-history-form";
import { RecentPlacements } from "@/components/placements/recent-placements";
import { PageActionLink } from "@/components/layout/page-action-link";
import { fetchAdminPlacementHistory } from "@/lib/api/placements";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riwayat penyaluran",
  description:
    "Riwayat lengkap penyaluran kandidat oleh admin.",
};

type AdminPlacementHistoryPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPlacementHistoryPage({
  searchParams,
}: AdminPlacementHistoryPageProps) {
  const params = await searchParams;
  const { placements, filters, companies } =
    await fetchAdminPlacementHistory(params);

  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-6xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
    >
      <p className="mb-6">
        <PageActionLink href="/admin/penyaluran" tone="back">
          Kembali ke penyaluran
        </PageActionLink>
      </p>
      <header className="mb-8 max-w-3xl">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Ruang admin
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Riwayat penyaluran
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Semua catatan penyaluran kandidat ke perusahaan, termasuk yang masih
          menunggu dikirim.
        </p>
      </header>
      <p
        id="hasil-riwayat"
        tabIndex={-1}
        aria-live="polite"
        className="text-muted-foreground mb-4 scroll-mt-24 rounded-sm text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring"
      >
        {placements.length} penyaluran ditampilkan
        {filters.q || filters.status || filters.perusahaan
          ? " sesuai saringan"
          : ""}
      </p>
      <PlacementHistoryForm filters={filters} companies={companies} />
      <RecentPlacements
        placements={placements}
        heading="Daftar riwayat"
        headingId="daftar-riwayat-heading"
      />
    </main>
  );
}
