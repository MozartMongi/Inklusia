import { AdminTrainingCreateForm } from "@/components/admin/admin-training-create-form";
import { PageActionLink } from "@/components/layout/page-action-link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tambah pelatihan",
  description: "Formulir menambah pelatihan keahlian baru oleh admin.",
};

export default function AdminTrainingCreatePage() {
  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-3xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
    >
      <p className="mb-6">
        <PageActionLink href="/admin/pelatihan" tone="back">
          Kembali ke daftar pelatihan
        </PageActionLink>
      </p>
      <header className="mb-8 max-w-3xl">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Dashboard admin
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Tambah pelatihan
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Isi detail pelatihan dan jadwal pelaksanaan. Pelatihan yang
          dipublikasikan akan tampil di halaman katalog publik.
        </p>
      </header>
      <AdminTrainingCreateForm />
    </main>
  );
}
