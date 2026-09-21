import { AdminTrainingDetailView } from "@/components/admin/admin-training-detail";
import { PageActionLink } from "@/components/layout/page-action-link";
import { fetchAdminTraining } from "@/lib/api/admin";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type AdminTrainingDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: AdminTrainingDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const training = await fetchAdminTraining(id);
  if (!training) {
    return { title: "Pelatihan tidak ditemukan" };
  }
  return {
    title: training.title,
    description: `Detail pelatihan ${training.title} dan daftar peserta.`,
  };
}

export default async function AdminTrainingDetailPage({
  params,
}: AdminTrainingDetailPageProps) {
  const { id } = await params;
  const training = await fetchAdminTraining(id);

  if (!training) {
    notFound();
  }

  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-5xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
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
          Detail pelatihan
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Tinjau informasi pelatihan dan pencari kerja yang sudah mendaftar.
        </p>
      </header>
      <AdminTrainingDetailView training={training} />
    </main>
  );
}
