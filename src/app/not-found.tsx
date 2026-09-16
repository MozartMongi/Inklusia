import { PageActionLink } from "@/components/layout/page-action-link";

export default function NotFound() {
  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-3xl flex-1 scroll-mt-24 px-4 py-16 text-center focus-visible:outline-none sm:px-6"
    >
      <h1 className="text-foreground text-3xl font-semibold tracking-tight">
        Halaman tidak ditemukan
      </h1>
      <p className="text-muted-foreground mt-3 text-base leading-7">
        Lowongan atau halaman yang Anda cari tidak tersedia.
      </p>
      <p className="mt-6 flex justify-center">
        <PageActionLink href="/lowongan" tone="back">
          Kembali ke daftar lowongan
        </PageActionLink>
      </p>
    </main>
  );
}
