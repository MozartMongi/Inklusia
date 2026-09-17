import { JobSeekerRegisterForm } from "@/components/auth/job-seeker-register-form";
import { PageActionLink } from "@/components/layout/page-action-link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar sebagai pencari kerja",
  description:
    "Isi identitas, foto, disabilitas, dan kata sandi untuk mendaftar sebagai pencari kerja.",
};

export default function RegisterJobSeekerPage() {
  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-3xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
    >
      <p className="mb-6">
        <PageActionLink href="/daftar" tone="back">
          Kembali ke pilihan pendaftaran
        </PageActionLink>
      </p>
      <header className="mb-8">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Pendaftaran
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Pendaftaran pencari kerja
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Lengkapi data diri, keterangan disabilitas, dan dokumen. Keahlian,
          sertifikasi, serta pengalaman boleh dikosongkan. Setelah daftar,
          masuk untuk mengunggah foto diri dan KTP.
        </p>
      </header>
      <JobSeekerRegisterForm />
    </main>
  );
}
