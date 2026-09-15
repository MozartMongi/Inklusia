import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { BrandLogo } from "@/components/brand/brand-logo";
import { PageActionLink } from "@/components/layout/page-action-link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atur ulang kata sandi",
  description: "Konfirmasi kata sandi baru setelah meminta tautan reset.",
};

type ResetPasswordPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(
  value: string | string[] | undefined,
): string | null {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0];
  }
  return null;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = firstParam(params.token);

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
          Konfirmasi reset kata sandi
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Buat kata sandi baru untuk akun Anda. Pastikan tautan masih berlaku.
        </p>
      </div>
      <ResetPasswordForm token={token} />
    </main>
  );
}
