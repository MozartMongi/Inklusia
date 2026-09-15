import { PageActionLink } from "@/components/layout/page-action-link";
import { buttonVariants } from "@/components/ui/button";
import { Building2, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pilih jenis pendaftaran",
  description:
    "Daftar sebagai pencari kerja atau sebagai perusahaan di portal Inklusia.",
};

export default function RegisterChoicePage() {
  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-3xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
    >
      <p className="mb-6">
        <PageActionLink href="/" tone="back">
          Kembali ke beranda
        </PageActionLink>
      </p>
      <header className="mb-8">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Daftarkan Diri / Perusahaan Anda
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Pilih jalur pendaftaran. Pencari kerja mengisi identitas, foto, dan
          kata sandi. Perusahaan mengisi data lembaga, kesiapan inklusi, kontak,
          dan kata sandi.
        </p>
      </header>
      <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
        <li>
          <Link
            href="/daftar/pencari-kerja"
            className="border-border bg-card hover:border-primary/40 hover:bg-muted/40 focus-visible:ring-ring flex h-full min-h-40 flex-col gap-3 rounded-xl border p-5 focus-visible:ring-3 focus-visible:outline-none"
          >
            <span className="bg-secondary text-secondary-foreground inline-flex size-11 items-center justify-center rounded-lg">
              <UserRound aria-hidden="true" className="size-5" />
            </span>
            <span className="text-foreground text-lg font-semibold">
              Pencari Kerja
            </span>
            <span className="text-muted-foreground text-sm leading-6">
              Daftar sebagai penyandang disabilitas yang ingin disalurkan ke
              lowongan inklusif.
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/daftar/perusahaan"
            className="border-border bg-card hover:border-primary/40 hover:bg-muted/40 focus-visible:ring-ring flex h-full min-h-40 flex-col gap-3 rounded-xl border p-5 focus-visible:ring-3 focus-visible:outline-none"
          >
            <span className="bg-secondary text-secondary-foreground inline-flex size-11 items-center justify-center rounded-lg">
              <Building2 aria-hidden="true" className="size-5" />
            </span>
            <span className="text-foreground text-lg font-semibold">
              Perusahaan
            </span>
            <span className="text-muted-foreground text-sm leading-6">
              Daftar sebagai perusahaan yang membuka kesempatan kerja ramah
              disabilitas.
            </span>
          </Link>
        </li>
      </ul>
      <p className="mt-8">
        <Link href="/" className={buttonVariants({ variant: "ghost" })}>
          Batal, kembali ke lowongan
        </Link>
      </p>
    </main>
  );
}
