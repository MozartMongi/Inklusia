"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  SEEKER_DISABILITY_FILTER_OPTIONS,
  hasActiveSeekerFilters,
  seekerSearchHref,
  type SeekerSearchFilters,
} from "@/lib/placements/seeker-filters";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

const fieldClassName =
  "border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 min-h-11 w-full rounded-lg border px-3 text-base outline-none focus-visible:ring-3 md:text-sm";

type SeekerSearchFormProps = {
  filters: SeekerSearchFilters;
  cities: string[];
  /** Default: /admin/penyaluran */
  basePath?: string;
};

export function SeekerSearchForm({
  filters,
  cities,
  basePath = "/admin/penyaluran",
}: SeekerSearchFormProps) {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextHref = seekerSearchHref(
      {
        q: String(data.get("q") ?? ""),
        disabilitas: String(
          data.get("disabilitas") ?? "",
        ) as SeekerSearchFilters["disabilitas"],
        kota: String(data.get("kota") ?? ""),
        pilih: filters.pilih,
      },
      basePath,
    );

    router.push(nextHref);
    window.setTimeout(() => {
      document.getElementById("hasil-pencari-kerja")?.focus();
    }, 50);
  }

  return (
    <form
      method="get"
      action={basePath}
      onSubmit={handleSubmit}
      className="border-border bg-card mb-6 rounded-xl border p-4 sm:p-5"
      aria-label="Cari dan saring pencari kerja"
    >
      {filters.pilih ? (
        <input type="hidden" name="pilih" value={filters.pilih} />
      ) : null}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="q">Kata kunci</Label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={filters.q}
            placeholder="Nama atau keahlian"
            autoComplete="off"
            className={fieldClassName}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="disabilitas">Jenis disabilitas</Label>
          <select
            id="disabilitas"
            name="disabilitas"
            defaultValue={filters.disabilitas}
            className={fieldClassName}
          >
            <option value="">Semua jenis</option>
            {SEEKER_DISABILITY_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
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
        {hasActiveSeekerFilters(filters) ? (
          <Link
            href={seekerSearchHref({ pilih: filters.pilih }, basePath)}
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
