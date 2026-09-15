import { CompanyCandidates } from "@/components/placements/company-candidates";
import { PageActionLink, PageActions } from "@/components/layout/page-action-link";
import {
  fetchCompanyReceivedCandidates,
  MOCK_COMPANY_SESSION,
} from "@/lib/api/placements";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kandidat tersalur",
  description:
    "Daftar pencari kerja yang admin salurkan ke perusahaan Anda.",
};

export default async function CompanyCandidatesPage() {
  const candidates = await fetchCompanyReceivedCandidates();

  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-3xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
    >
      <header className="mb-8">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Ruang perusahaan
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Kandidat tersalur
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          {MOCK_COMPANY_SESSION.name} menerima kandidat dari admin. Perusahaan
          tidak menerima lamaran langsung dari pencari kerja.
        </p>
        <PageActions>
          <PageActionLink href="/perusahaan" tone="back">
            Kembali ke profil perusahaan
          </PageActionLink>
        </PageActions>
      </header>
      <p
        className="text-muted-foreground mb-4 text-sm"
        aria-live="polite"
      >
        {candidates.length} kandidat ditampilkan
      </p>
      <CompanyCandidates candidates={candidates} />
    </main>
  );
}
