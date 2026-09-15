import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { BrandLogo } from "@/components/brand/brand-logo";
import { PageActionLink } from "@/components/layout/page-action-link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lupa kata sandi",
  description: "Minta tautan untuk mengatur ulang kata sandi akun Inklusia.",
};

export default function ForgotPasswordPage() {
  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="flex flex-1 flex-col scroll-mt-24 focus-visible:outline-none"
    >
      <p className="mb-6">
        <PageActionLink href="/masuk" tone="back">
          Kembali ke masuk
        </PageActionLink>
      </p>
      <div className="mb-8 flex flex-col items-center text-center">
        <BrandLogo className="h-12 sm:h-14" />
        <h1 className="text-foreground mt-6 text-3xl font-semibold tracking-tight">
          Lupa kata sandi
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Kami akan mengirim tautan reset ke email akun Anda. Proses masih
          simulasi sampai API siap.
        </p>
      </div>
      <ForgotPasswordForm />
    </main>
  );
}
