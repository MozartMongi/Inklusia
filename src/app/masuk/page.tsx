import { SignInForm } from "@/components/auth/sign-in-form";
import { BrandLogo } from "@/components/brand/brand-logo";
import { PageActionLink } from "@/components/layout/page-action-link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk",
  description:
    "Masuk ke Inklusia sebagai pencari kerja, perusahaan, atau admin.",
};

export default function SignInPage() {
  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="flex flex-1 flex-col scroll-mt-24 focus-visible:outline-none"
    >
      <p className="mb-6">
        <PageActionLink href="/" tone="back">
          Kembali ke beranda
        </PageActionLink>
      </p>
      <div className="mb-8 flex flex-col items-center text-center">
        <BrandLogo className="h-12 sm:h-14" />
        <h1 className="text-foreground mt-6 text-3xl font-semibold tracking-tight">
          Masuk ke Inklusia
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Gunakan email dan kata sandi akun Anda. Jika data tidak cocok, pesan
          kesalahan akan ditampilkan.
        </p>
      </div>
      <SignInForm />
      <p className="mt-8 flex justify-center">
        <PageActionLink href="/daftar">
          Belum punya akun? Daftar
        </PageActionLink>
      </p>
    </main>
  );
}
