import { CompanyProfileForm } from "@/components/company/company-profile-form";
import { PageActionLink } from "@/components/layout/page-action-link";
import { fetchMyCompanyProfile } from "@/lib/api/company";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit profil perusahaan",
  description:
    "Ubah data perusahaan, NIB, dan kontak person untuk ruang perusahaan.",
};

export default async function EditCompanyProfilePage() {
  const profile = await fetchMyCompanyProfile();

  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-3xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
    >
      <p className="mb-6">
        <PageActionLink href="/perusahaan" tone="back">
          Kembali ke profil perusahaan
        </PageActionLink>
      </p>
      <header className="mb-8">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Ruang perusahaan
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Edit profil perusahaan
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Semua isian wajib. Perubahan disimpan ke profil perusahaan Anda.
        </p>
      </header>
      <CompanyProfileForm profile={profile} />
    </main>
  );
}
