import { AdminAccountEditForm } from "@/components/admin/admin-account-edit-form";
import { PageActionLink } from "@/components/layout/page-action-link";
import { fetchAdminAccount } from "@/lib/api/admin";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type AdminAccountEditPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: AdminAccountEditPageProps): Promise<Metadata> {
  const { id } = await params;
  const account = await fetchAdminAccount(id);
  if (!account) {
    return { title: "Akun admin tidak ditemukan" };
  }
  return {
    title: `Ubah ${account.fullName}`,
    description: `Edit atau nonaktifkan akun admin ${account.fullName}.`,
  };
}

export default async function AdminAccountEditPage({
  params,
}: AdminAccountEditPageProps) {
  const { id } = await params;
  const account = await fetchAdminAccount(id);

  if (!account) {
    notFound();
  }

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
          Kelola akun admin
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Perbarui data akun atau nonaktifkan akses. Perubahan bersifat simulasi
          di frontend sampai API backend tersedia.
        </p>
      </header>
      <AdminAccountEditForm account={account} />
    </main>
  );
}
