import { CompanyRegisterForm } from "@/components/auth/company-register-form";
import { PageActionLink } from "@/components/layout/page-action-link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar sebagai perusahaan",
  description:
    "Isi data perusahaan, kesiapan inklusi, kontak person, dan kata sandi untuk mendaftar di Inklusia.",
};

export default function RegisterCompanyPage() {
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
          Pendaftaran perusahaan
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Lengkapi data lembaga, kesiapan inklusi, dan kontak person. Email
          kontak dipakai untuk masuk.
        </p>
      </header>
      <CompanyRegisterForm />
    </main>
  );
}
