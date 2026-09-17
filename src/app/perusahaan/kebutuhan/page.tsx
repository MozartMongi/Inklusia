import { InquiryList } from "@/components/company/inquiry-list";
import {
  PageActionLink,
  PageActions,
} from "@/components/layout/page-action-link";
import { fetchMyCompanyInquiries } from "@/lib/api/inquiries";
import { fetchMyCompanyProfile } from "@/lib/api/company";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar inquiry karyawan",
  description:
    "Lihat inquiry kebutuhan karyawan yang sudah diajukan. Admin yang menyalurkan kandidat.",
};

export default async function CompanyInquiriesPage() {
  const [profile, inquiries] = await Promise.all([
    fetchMyCompanyProfile(),
    fetchMyCompanyInquiries(),
  ]);

  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-3xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
    >
      <header className="mb-8">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Ruang perusahaan
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Inquiry karyawan
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Daftar kebutuhan {profile.name}. Lowongan tampil di portal setelah
          admin menyetujui inquiry. Perusahaan tidak menerima lamaran langsung.
        </p>
        <PageActions>
          <PageActionLink href="/perusahaan" tone="back">
            Kembali ke profil perusahaan
          </PageActionLink>
          <PageActionLink href="/perusahaan/kebutuhan/baru" variant="default">
            Buat inquiry karyawan
          </PageActionLink>
        </PageActions>
      </header>
      <p className="text-muted-foreground mb-4 text-sm" aria-live="polite">
        {inquiries.length} inquiry ditampilkan
      </p>
      <InquiryList inquiries={inquiries} />
    </main>
  );
}
