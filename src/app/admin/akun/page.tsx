import { AdminAccountList } from "@/components/admin/admin-account-list";
import {
  PageActionLink,
  PageActions,
} from "@/components/layout/page-action-link";
import { fetchAdminAccounts } from "@/lib/api/admin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Akun admin",
  description:
    "Daftar akun admin Portal Kerja Inklusia, termasuk root admin yang digenerate di awal.",
};

export default async function AdminAccountsPage() {
  const accounts = await fetchAdminAccounts();

  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-5xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
    >
      <header className="mb-8 max-w-3xl">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Dashboard admin
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Akun admin
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Pantau akun yang dapat mengakses dashboard admin. Root admin (
          info@inklusia.id) digenerate di awal; admin tambahan hanya dapat
          dibuat oleh root.
        </p>
        <PageActions>
          <PageActionLink href="/admin/akun/baru" variant="default">
            Tambah akun admin
          </PageActionLink>
        </PageActions>
      </header>
      <AdminAccountList accounts={accounts} />
    </main>
  );
}
