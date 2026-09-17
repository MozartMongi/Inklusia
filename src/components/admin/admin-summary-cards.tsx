import type { AdminDashboardSummary } from "@/lib/api/admin";
import Link from "next/link";

type AdminSummaryCardsProps = {
  summary: AdminDashboardSummary;
};

const CARDS = [
  {
    key: "seekers" as const,
    href: "/admin/pencari-kerja",
    label: "Pencari kerja",
    description: "Profil yang dapat ditinjau dan disalurkan.",
    value: (summary: AdminDashboardSummary) => summary.seekerCount,
  },
  {
    key: "companies" as const,
    href: "/admin/perusahaan",
    label: "Perusahaan",
    description: "Perusahaan inklusif yang terdaftar di portal.",
    value: (summary: AdminDashboardSummary) => summary.companyCount,
  },
  {
    key: "pending" as const,
    href: "/admin/kebutuhan",
    label: "Menunggu tinjauan",
    description: (summary: AdminDashboardSummary) =>
      `${summary.publishedJobCount} lowongan sedang tayang.`,
    value: (summary: AdminDashboardSummary) => summary.pendingInquiryCount,
  },
  {
    key: "inquiries" as const,
    href: "/admin/kebutuhan",
    label: "Kebutuhan karyawan",
    description: (summary: AdminDashboardSummary) =>
      `${summary.openInquiryCount} disetujui dari ${summary.inquiryCount} total.`,
    value: (summary: AdminDashboardSummary) => summary.inquiryCount,
  },
] as const;

export function AdminSummaryCards({ summary }: AdminSummaryCardsProps) {
  return (
    <ul
      aria-label="Ringkasan data admin"
      className="mb-8 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4"
    >
      {CARDS.map((card) => {
        const description =
          typeof card.description === "function"
            ? card.description(summary)
            : card.description;
        return (
          <li key={card.key}>
            <Link
              href={card.href}
              className="border-border bg-card hover:border-primary/40 hover:bg-muted/40 focus-visible:ring-ring flex h-full min-h-32 flex-col rounded-xl border p-5 focus-visible:ring-3 focus-visible:outline-none"
            >
              <p className="text-foreground text-3xl font-semibold tabular-nums">
                {card.value(summary)}
              </p>
              <p className="text-foreground mt-2 text-base font-semibold">
                {card.label}
              </p>
              <p className="text-muted-foreground mt-1 text-sm leading-6">
                {description}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
