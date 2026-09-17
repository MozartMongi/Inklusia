import { CompanySearchForm } from "@/components/admin/company-search-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CompanySearchFilters } from "@/lib/admin/company-filters";
import type { AdminCompanySummary } from "@/lib/types/company";
import Link from "next/link";

type AdminCompanyListProps = {
  companies: AdminCompanySummary[];
  filters: CompanySearchFilters;
  industries: string[];
  cities: string[];
};

export function AdminCompanyList({
  companies,
  filters,
  industries,
  cities,
}: AdminCompanyListProps) {
  return (
    <section aria-labelledby="daftar-perusahaan-heading">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between">
        <h2
          id="daftar-perusahaan-heading"
          className="text-foreground text-xl font-semibold"
        >
          Daftar perusahaan
        </h2>
        <p
          id="hasil-perusahaan"
          tabIndex={-1}
          aria-live="polite"
          className="text-muted-foreground focus-visible:ring-ring scroll-mt-24 rounded-sm text-sm outline-none focus-visible:ring-3"
        >
          {companies.length} perusahaan ditampilkan
          {filters.q || filters.industri || filters.kota
            ? " sesuai pencarian atau saringan"
            : ""}
        </p>
      </div>
      <CompanySearchForm
        filters={filters}
        industries={industries}
        cities={cities}
        basePath="/admin/perusahaan"
      />
      {companies.length === 0 ? (
        <p
          role="status"
          className="border-border bg-card text-muted-foreground rounded-xl border px-4 py-10 text-center text-base"
        >
          Tidak ada perusahaan yang cocok dengan pencarian atau saringan Anda.
          Coba kata kunci lain atau hapus saringan. Jika daftar masih kosong
          tanpa saringan, belum ada perusahaan terdaftar.
        </p>
      ) : (
        <ul className="grid list-none grid-cols-1 gap-4 p-0 lg:grid-cols-2">
          {companies.map((company) => (
            <li key={company.id} className="min-w-0">
              <Card className="relative h-full overflow-visible">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    <h3 className="text-lg leading-snug font-semibold">
                      <Link
                        href={`/admin/perusahaan/${company.id}`}
                        className="focus-visible:ring-ring after:absolute after:inset-0 after:rounded-xl hover:underline focus-visible:ring-3 focus-visible:outline-none"
                      >
                        {company.name}
                      </Link>
                    </h3>
                  </CardTitle>
                  <CardDescription>
                    {company.city} · {company.industry}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Badge variant="secondary">
                    {company.openInquiryCount > 0
                    ? `${company.openInquiryCount} lowongan tayang`
                    : "Belum ada lowongan tayang"}
                  </Badge>
                  <p className="text-muted-foreground text-sm leading-6">
                    {company.address}
                  </p>
                  <dl className="text-muted-foreground grid gap-1 text-sm">
                    <div className="flex flex-wrap gap-x-2">
                      <dt className="text-foreground font-medium">Kontak</dt>
                      <dd>{company.contactName}</dd>
                    </div>
                    <div className="flex flex-wrap gap-x-2">
                      <dt className="text-foreground font-medium">Email</dt>
                      <dd>{company.contactEmail}</dd>
                    </div>
                    <div className="flex flex-wrap gap-x-2">
                      <dt className="text-foreground font-medium">Telepon</dt>
                      <dd>{company.contactPhone}</dd>
                    </div>
                  </dl>
                  <p className="text-primary relative z-10 text-sm font-medium">
                    Lihat detail profil
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
