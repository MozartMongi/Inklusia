import { SignInForm } from "@/components/auth/sign-in-form";
import { BrandLogo } from "@/components/brand/brand-logo";
import { PageActionLink } from "@/components/layout/page-action-link";
import {
  demoRoleLabel,
  MOCK_DEMO_AUTH_IDENTITIES,
  MOCK_GUEST_AUTH_SESSION,
} from "@/lib/mock/auth";
import { USER_ROLE_LABEL } from "@/lib/types/auth";
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
      <p className="text-muted-foreground mb-4 text-center text-sm" role="status">
        Status sesi tiruan: {USER_ROLE_LABEL[MOCK_GUEST_AUTH_SESSION.role]}.
      </p>
      <SignInForm />
      <section className="mt-8" aria-labelledby="akun-contoh-heading">
        <h2
          id="akun-contoh-heading"
          className="text-foreground text-base font-semibold"
        >
          Contoh akun tiruan
        </h2>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          Data ini hanya untuk menata halaman. Kata sandi tidak ditampilkan.
        </p>
        <ul className="mt-4 flex flex-col gap-3 p-0">
          {MOCK_DEMO_AUTH_IDENTITIES.map((identity) => (
            <li
              key={identity.email}
              className="border-border bg-card rounded-xl border px-4 py-3 text-sm"
            >
              <p className="text-foreground font-medium">{identity.name}</p>
              <p className="text-muted-foreground mt-1">
                {demoRoleLabel(identity.role)} · {identity.email}
              </p>
            </li>
          ))}
        </ul>
      </section>
      <p className="mt-8 flex justify-center">
        <PageActionLink href="/daftar">
          Belum punya akun? Daftar
        </PageActionLink>
      </p>
    </main>
  );
}
