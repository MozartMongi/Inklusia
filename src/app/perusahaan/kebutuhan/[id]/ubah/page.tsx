import { InquiryForm } from "@/components/company/inquiry-form";
import { PageActionLink } from "@/components/layout/page-action-link";
import { fetchMyCompanyProfile } from "@/lib/api/company";
import { fetchCompanyInquiryById } from "@/lib/api/inquiries";
import { MOCK_COMPANY_INQUIRIES } from "@/lib/mock/inquiries";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type EditInquiryPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return MOCK_COMPANY_INQUIRIES.map((inquiry) => ({ id: inquiry.id }));
}

export async function generateMetadata({
  params,
}: EditInquiryPageProps): Promise<Metadata> {
  const { id } = await params;
  const inquiry = await fetchCompanyInquiryById(id);

  if (!inquiry) {
    return { title: "Inquiry tidak ditemukan" };
  }

  return {
    title: `Ubah inquiry ${inquiry.title}`,
    description: "Perbarui kebutuhan karyawan. Admin yang menyalurkan kandidat.",
  };
}

export default async function EditInquiryPage({ params }: EditInquiryPageProps) {
  const { id } = await params;
  const [profile, inquiry] = await Promise.all([
    fetchMyCompanyProfile(),
    fetchCompanyInquiryById(id),
  ]);

  if (!inquiry) {
    notFound();
  }

  const isClosed = inquiry.status === "ditutup";

  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-3xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
    >
      <p className="mb-6">
        <PageActionLink href="/perusahaan/kebutuhan" tone="back">
          Kembali ke daftar inquiry
        </PageActionLink>
      </p>
      <header className="mb-8">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Ruang perusahaan
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Ubah inquiry karyawan
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          {isClosed
            ? `${inquiry.title} sudah ditutup. Buka kembali dari daftar inquiry untuk mengubahnya.`
            : `Perbarui ${inquiry.title}. Perubahan masih simulasi sampai API perusahaan siap.`}
        </p>
      </header>
      {isClosed ? (
        <p
          role="status"
          className="border-border bg-card text-muted-foreground rounded-xl border px-4 py-10 text-center text-base"
        >
          Inquiry ditutup. Kembali ke daftar untuk membuka kembali atau membuat
          inquiry baru.
        </p>
      ) : (
        <InquiryForm companyName={profile.name} inquiry={inquiry} />
      )}
    </main>
  );
}
