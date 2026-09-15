import { SignOutButton } from "@/components/auth/sign-out-button";
import { CompanyProfileView } from "@/components/company/company-profile-view";
import {
  PageActionLink,
  PageActions,
} from "@/components/layout/page-action-link";
import { fetchMyCompanyProfile } from "@/lib/api/company";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ruang perusahaan",
  description:
    "Lihat data perusahaan, NIB, dan kontak person yang dipakai admin untuk penyaluran kandidat.",
};

export default async function CompanySpacePage() {
  const profile = await fetchMyCompanyProfile();

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
          Profil perusahaan
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Data ini memakai profil tiruan {profile.name}. Perusahaan tidak
          menerima lamaran langsung; admin yang menyalurkan kandidat.
        </p>
        <PageActions>
          <PageActionLink href="/perusahaan/edit">
            Edit profil perusahaan
          </PageActionLink>
          <PageActionLink href="/perusahaan/kebutuhan">
            Daftar inquiry karyawan
          </PageActionLink>
          <PageActionLink href="/perusahaan/kebutuhan/baru" variant="default">
            Buat inquiry karyawan
          </PageActionLink>
          <PageActionLink href="/perusahaan/kandidat">
            Lihat kandidat tersalur
          </PageActionLink>
          <SignOutButton variant="page" />
        </PageActions>
      </header>
      <CompanyProfileView profile={profile} />
    </main>
  );
}
