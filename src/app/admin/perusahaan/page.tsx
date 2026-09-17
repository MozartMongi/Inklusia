import { AdminCompanyList } from "@/components/admin/admin-company-list";
import { fetchAdminCompanyDirectory } from "@/lib/api/admin";
import { parseCompanySearchFilters } from "@/lib/admin/company-filters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data perusahaan",
  description:
    "Daftar perusahaan terdaftar dengan pencarian nama dan saringan industri serta kota.",
};

type AdminCompaniesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminCompaniesPage({
  searchParams,
}: AdminCompaniesPageProps) {
  const params = await searchParams;
  const filters = parseCompanySearchFilters(params);
  const { companies, cities, industries } =
    await fetchAdminCompanyDirectory(params);

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
          Data perusahaan
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Tinjau perusahaan terdaftar dan kebutuhan karyawan mereka. Gunakan
          pencarian serta saringan industri dan kota untuk menemukan mitra yang
          relevan.
        </p>
      </header>
      <AdminCompanyList
        companies={companies}
        filters={filters}
        industries={industries}
        cities={cities}
      />
    </main>
  );
}
