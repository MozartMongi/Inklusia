import { AdminAccountCreateForm } from "@/components/admin/admin-account-create-form";
import { PageActionLink } from "@/components/layout/page-action-link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tambah akun admin",
  description: "Formulir menambah akun admin baru oleh root admin.",
};

export default function AdminAccountCreatePage() {
  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-3xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
    >
      <p className="mb-6">
        <PageActionLink href="/admin/akun" tone="back">
          Kembali ke daftar akun admin
        </PageActionLink>
      </p>
      <header className="mb-8 max-w-3xl">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Dashboard admin
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Tambah akun admin
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Buat akun admin baru untuk mengelola penyaluran. Email dan kata sandi
          akan dipakai sebagai kredensial masuk.
        </p>
      </header>
      <AdminAccountCreateForm />
    </main>
  );
}
