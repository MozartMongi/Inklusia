import { CvWorkspace } from "@/components/cv/cv-workspace";
import { PageActionLink } from "@/components/layout/page-action-link";
import { fetchMyGeneratedCv } from "@/lib/api/cv";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV Otomatis",
  description:
    "CV yang disusun otomatis dari data profil pencari kerja.",
};

export default async function GeneratedCvPage() {
  const cv = await fetchMyGeneratedCv();

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
          CV Otomatis
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          CV ini disusun dari data profil Anda dengan tata letak profesional.
          Lengkapi profil agar isinya lebih lengkap sebelum dibagikan ke
          perusahaan.
        </p>
      </header>
      <CvWorkspace cv={cv} />
    </main>
  );
}
