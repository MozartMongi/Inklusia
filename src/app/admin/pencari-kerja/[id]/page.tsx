import { AdminSeekerDetail } from "@/components/admin/admin-seeker-detail";
import {
  PageActionLink,
  PageActions,
} from "@/components/layout/page-action-link";
import { fetchAdminJobSeekerProfile } from "@/lib/api/admin";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type AdminSeekerDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: AdminSeekerDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = await fetchAdminJobSeekerProfile(id);
  if (!profile) {
    return { title: "Pencari kerja tidak ditemukan" };
  }
  return {
    title: `Profil ${profile.fullName}`,
    description: `Detail profil pencari kerja ${profile.fullName} untuk ditinjau admin.`,
  };
}

export default async function AdminSeekerDetailPage({
  params,
}: AdminSeekerDetailPageProps) {
  const { id } = await params;
  const profile = await fetchAdminJobSeekerProfile(id);

  if (!profile) {
    notFound();
  }

  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-5xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
    >
      <p className="mb-6">
        <PageActionLink href="/admin/pencari-kerja" tone="back">
          Kembali ke daftar pencari kerja
        </PageActionLink>
      </p>
      <header className="mb-8 max-w-3xl">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Dashboard admin
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Detail profil pencari kerja
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Tinjau data lengkap sebelum menyalurkan kandidat ke perusahaan. Profil
          ini bersifat baca saja di dashboard admin.
        </p>
        <PageActions>
          <PageActionLink
            href={`/admin/penyaluran?pilih=${profile.id}`}
            variant="default"
          >
            Salurkan kandidat ini
          </PageActionLink>
        </PageActions>
      </header>
      <AdminSeekerDetail profile={profile} />
    </main>
  );
}
