import type { AdminCompanySummary } from "@/lib/types/company";

export type CompanySearchFilters = {
  q: string;
  industri: string;
  kota: string;
};

export function parseCompanySearchFilters(
  searchParams: Record<string, string | string[] | undefined>,
): CompanySearchFilters {
  return {
    q: firstParam(searchParams.q),
    industri: firstParam(searchParams.industri),
    kota: firstParam(searchParams.kota),
  };
}

export function filterCompanies(
  companies: AdminCompanySummary[],
  filters: CompanySearchFilters,
): AdminCompanySummary[] {
  const keyword = filters.q.trim().toLowerCase();

  return companies.filter((company) => {
    if (keyword) {
      const haystack =
        `${company.name} ${company.industry} ${company.contactName}`.toLowerCase();
      if (!haystack.includes(keyword)) {
        return false;
      }
    }

    if (filters.industri && company.industry !== filters.industri) {
      return false;
    }

    if (filters.kota && company.city !== filters.kota) {
      return false;
    }

    return true;
  });
}

export function uniqueCompanyCities(
  companies: AdminCompanySummary[],
): string[] {
  return [...new Set(companies.map((company) => company.city))].sort((a, b) =>
    a.localeCompare(b, "id"),
  );
}

export function uniqueCompanyIndustries(
  companies: AdminCompanySummary[],
): string[] {
  return [...new Set(companies.map((company) => company.industry))].sort(
    (a, b) => a.localeCompare(b, "id"),
  );
}

export function hasActiveCompanyFilters(
  filters: CompanySearchFilters,
): boolean {
  return Boolean(filters.q.trim() || filters.industri || filters.kota);
}

export function companySearchHref(
  filters: Partial<CompanySearchFilters>,
  basePath = "/admin/perusahaan",
): string {
  const params = new URLSearchParams();

  if (filters.q?.trim()) {
    params.set("q", filters.q.trim());
  }
  if (filters.industri) {
    params.set("industri", filters.industri);
  }
  if (filters.kota) {
    params.set("kota", filters.kota);
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}
