import { SignOutButton } from "@/components/auth/sign-out-button";
import {
  PageActionLink,
  PageActions,
} from "@/components/layout/page-action-link";
import { ProfileView } from "@/components/profile/profile-view";
import { fetchMyJobSeekerProfile } from "@/lib/api/job-seeker";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil pencari kerja",
  description:
    "Lihat data diri, dokumen, keahlian, dan pengalaman kerja pencari kerja.",
};

export default async function JobSeekerProfilePage() {
  const profile = await fetchMyJobSeekerProfile();

  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-3xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
    >
      <header className="mb-8">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Ruang pencari kerja
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Profil pencari kerja
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Lengkapi profil ini agar admin dapat menyalurkan Anda ke perusahaan
          yang membutuhkan. Pencari kerja tidak melamar langsung ke lowongan.
        </p>
        <PageActions>
          <PageActionLink href="/profil/cv" variant="default">
            Buat CV otomatis
          </PageActionLink>
          <PageActionLink href="/pelatihan">Pelatihan keahlian</PageActionLink>
          <PageActionLink href="/profil/penyaluran">
            Lihat status penyaluran
          </PageActionLink>
          <SignOutButton variant="page" />
        </PageActions>
      </header>
      <ProfileView profile={profile} />
    </main>
  );
}
