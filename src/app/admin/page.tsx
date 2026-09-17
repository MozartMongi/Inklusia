import { AdminSummaryCards } from "@/components/admin/admin-summary-cards";
import {
  PageActionLink,
  PageActions,
} from "@/components/layout/page-action-link";
import { fetchAdminDashboardSummary } from "@/lib/api/admin";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard admin",
  description:
    "Ringkasan dashboard admin Inklusia untuk data pencari kerja, perusahaan, dan penyaluran.",
};

const QUICK_LINKS = [
  {
    href: "/admin/kebutuhan",
    title: "Tinjau kebutuhan lowongan",
    description: "Setujui inquiry perusahaan sebelum lowongan tampil publik.",
  },
  {
    href: "/admin/pencari-kerja",
    title: "Data pencari kerja",
    description: "Tinjau profil dan kelengkapan pencari kerja.",
  },
  {
    href: "/admin/perusahaan",
    title: "Data perusahaan",
    description: "Lihat perusahaan inklusif yang terdaftar.",
  },
  {
    href: "/admin/penyaluran",
    title: "Penyaluran kandidat",
    description: "Salurkan pencari kerja ke lowongan yang sesuai.",
  },
] as const;

export default async function AdminDashboardPage() {
  const summary = await fetchAdminDashboardSummary();

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
          Ringkasan
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Kelola data pencari kerja dan perusahaan, tinjau kebutuhan lowongan,
          lalu salurkan kandidat. Pencari kerja tidak melamar langsung.
        </p>
        <PageActions>
          <PageActionLink href="/admin/penyaluran" variant="default">
            Buka penyaluran
          </PageActionLink>
          <PageActionLink href="/admin/penyaluran/riwayat">
            Lihat riwayat
          </PageActionLink>
        </PageActions>
      </header>
      <AdminSummaryCards summary={summary} />
      <h2 className="text-foreground mb-4 text-xl font-semibold">
        Pintasan
      </h2>
      <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_LINKS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="border-border bg-card hover:border-primary/40 hover:bg-muted/40 focus-visible:ring-ring flex h-full min-h-36 flex-col gap-2 rounded-xl border p-5 focus-visible:ring-3 focus-visible:outline-none"
            >
              <span className="text-foreground text-lg font-semibold">
                {item.title}
              </span>
              <span className="text-muted-foreground text-sm leading-6">
                {item.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
