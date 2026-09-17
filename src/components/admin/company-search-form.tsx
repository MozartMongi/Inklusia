"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  companySearchHref,
  hasActiveCompanyFilters,
  type CompanySearchFilters,
} from "@/lib/admin/company-filters";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

const fieldClassName =
  "border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 min-h-11 w-full rounded-lg border px-3 text-base outline-none focus-visible:ring-3 md:text-sm";

type CompanySearchFormProps = {
  filters: CompanySearchFilters;
  industries: string[];
  cities: string[];
  basePath?: string;
};

export function CompanySearchForm({
  filters,
  industries,
  cities,
  basePath = "/admin/perusahaan",
}: CompanySearchFormProps) {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextHref = companySearchHref(
      {
        q: String(data.get("q") ?? ""),
        industri: String(data.get("industri") ?? ""),
        kota: String(data.get("kota") ?? ""),
      },
      basePath,
    );

    router.push(nextHref);
    window.setTimeout(() => {
      document.getElementById("hasil-perusahaan")?.focus();
    }, 50);
  }

  return (
    <form
      method="get"
      action={basePath}
      onSubmit={handleSubmit}
      className="border-border bg-card mb-6 rounded-xl border p-4 sm:p-5"
      aria-label="Cari dan saring perusahaan"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="q">Kata kunci</Label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={filters.q}
            placeholder="Nama, industri, atau kontak"
            autoComplete="off"
            className={fieldClassName}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="industri">Industri</Label>
          <select
            id="industri"
            name="industri"
            defaultValue={filters.industri}
            className={fieldClassName}
          >
            <option value="">Semua industri</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="kota">Kota</Label>
          <select
            id="kota"
            name="kota"
            defaultValue={filters.kota}
            className={fieldClassName}
          >
            <option value="">Semua kota</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="submit"
          className={buttonVariants({
            size: "lg",
            className: "min-h-11 w-full px-4 sm:w-auto",
          })}
        >
          Terapkan pencarian
        </button>
        {hasActiveCompanyFilters(filters) ? (
          <Link
            href={companySearchHref({}, basePath)}
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "min-h-11 w-full px-4 sm:w-auto",
            })}
          >
            Hapus saringan
          </Link>
        ) : null}
      </div>
    </form>
  );
}
