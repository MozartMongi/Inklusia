import { AdminInquiryReviewList } from "@/components/admin/admin-inquiry-review-list";
import { PageActionLink, PageActions } from "@/components/layout/page-action-link";
import { fetchAdminInquiries } from "@/lib/api/admin";
import { INQUIRY_STATUS_LABEL, type InquiryStatus } from "@/lib/types/inquiry";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tinjauan kebutuhan lowongan",
  description:
    "Setujui atau tolak kebutuhan karyawan dari perusahaan. Hanya yang disetujui yang tampil sebagai lowongan publik.",
};

type AdminInquiriesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const STATUS_FILTERS = ["menunggu", "disetujui", "ditolak", "ditutup", "semua"] as const;

export default async function AdminInquiriesPage({
  searchParams,
}: AdminInquiriesPageProps) {
  const params = await searchParams;
  const raw = Array.isArray(params.status) ? params.status[0] : params.status;
  const status =
    raw && STATUS_FILTERS.includes(raw as (typeof STATUS_FILTERS)[number])
      ? raw
      : "menunggu";
  const { inquiries } = await fetchAdminInquiries(status);

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
          Tinjauan kebutuhan lowongan
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Perusahaan mengajukan kebutuhan karyawan. Lowongan hanya tampil di
          portal publik setelah Anda menyetujui kebutuhan tersebut.
        </p>
        <PageActions>
          <PageActionLink href="/admin/penyaluran">
            Buka penyaluran
          </PageActionLink>
        </PageActions>
      </header>

      <nav aria-label="Saringan status kebutuhan" className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((value) => {
          const href =
            value === "menunggu"
              ? "/admin/kebutuhan"
              : `/admin/kebutuhan?status=${value}`;
          const current = status === value;
          return (
            <Link
              key={value}
              href={href}
              aria-current={current ? "page" : undefined}
              className={
                current
                  ? "bg-primary text-primary-foreground inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium"
                  : "border-border text-foreground hover:bg-muted inline-flex min-h-11 items-center rounded-lg border px-3 text-sm font-medium"
              }
            >
              {value === "semua"
                ? "Semua"
                : INQUIRY_STATUS_LABEL[value as InquiryStatus]}
            </Link>
          );
        })}
      </nav>

      <AdminInquiryReviewList inquiries={inquiries} />
    </main>
  );
}
