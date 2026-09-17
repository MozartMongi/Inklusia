import { PlacementOverview } from "@/components/placements/placement-overview";
import { PageActionLink, PageActions } from "@/components/layout/page-action-link";
import { fetchPlacementOverview } from "@/lib/api/placements";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Penyaluran kandidat",
  description:
    "Ruang admin untuk meninjau pencari kerja dan menyalurkan mereka ke lowongan inklusif.",
};

type AdminPlacementPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPlacementPage({
  searchParams,
}: AdminPlacementPageProps) {
  const params = await searchParams;
  const data = await fetchPlacementOverview(params);

  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-6xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
    >
      <header className="mb-8 max-w-3xl">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Ruang admin
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Penyaluran kandidat
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Pencari kerja tidak melamar langsung. Admin meninjau profil, lalu
          menyalurkan kandidat ke perusahaan yang lowongannya sudah disetujui.
        </p>
        <PageActions>
          <PageActionLink href="/admin/kebutuhan">
            Tinjau kebutuhan lowongan
          </PageActionLink>
          <PageActionLink href="/admin/penyaluran/riwayat">
            Lihat riwayat penyaluran
          </PageActionLink>
        </PageActions>
      </header>
      <PlacementOverview data={data} cities={data.cities} />
    </main>
  );
}
