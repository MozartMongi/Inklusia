import { AdminCompanyDetail } from "@/components/admin/admin-company-detail";
import {
  PageActionLink,
  PageActions,
} from "@/components/layout/page-action-link";
import {
  fetchAdminCompanyInquiries,
  fetchAdminCompanyProfile,
} from "@/lib/api/admin";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type AdminCompanyDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: AdminCompanyDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = await fetchAdminCompanyProfile(id);
  if (!profile) {
    return { title: "Perusahaan tidak ditemukan" };
  }
  return {
    title: `Profil ${profile.name}`,
    description: `Detail profil perusahaan ${profile.name} untuk ditinjau admin.`,
  };
}

export default async function AdminCompanyDetailPage({
  params,
}: AdminCompanyDetailPageProps) {
  const { id } = await params;
  const profile = await fetchAdminCompanyProfile(id);

  if (!profile) {
    notFound();
  }

  const inquiries = await fetchAdminCompanyInquiries(id);

  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-5xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
    >
      <p className="mb-6">
        <PageActionLink href="/admin/perusahaan" tone="back">
          Kembali ke daftar perusahaan
        </PageActionLink>
      </p>
      <header className="mb-8 max-w-3xl">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Dashboard admin
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Detail profil perusahaan
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Tinjau data perusahaan dan inquiry kebutuhan sebelum menyalurkan
          kandidat. Halaman ini bersifat baca saja.
        </p>
        <PageActions>
          <PageActionLink href="/admin/penyaluran" variant="default">
            Buka penyaluran
          </PageActionLink>
        </PageActions>
      </header>
      <AdminCompanyDetail profile={profile} inquiries={inquiries} />
    </main>
  );
}
