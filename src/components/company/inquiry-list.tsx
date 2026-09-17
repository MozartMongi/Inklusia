import { InquiryCard } from "@/components/company/inquiry-card";
import type { CompanyInquiry } from "@/lib/types/inquiry";

type InquiryListProps = {
  inquiries: CompanyInquiry[];
};

export function InquiryList({ inquiries }: InquiryListProps) {
  if (inquiries.length === 0) {
    return (
      <p
        role="status"
        className="border-border bg-card text-muted-foreground rounded-xl border px-4 py-10 text-center text-base"
      >
        Belum ada kebutuhan karyawan. Buat kebutuhan baru agar admin meninjau
        dan menerbitkan lowongan.
      </p>
    );
  }

  return (
    <ul className="grid list-none grid-cols-1 gap-4 p-0">
      {inquiries.map((inquiry) => (
        <li key={inquiry.id}>
          <InquiryCard inquiry={inquiry} />
        </li>
      ))}
    </ul>
  );
}
