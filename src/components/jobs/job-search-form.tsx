"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DISABILITY_FILTER_OPTIONS,
  JOB_TYPE_FILTER_OPTIONS,
  hasActiveFilters,
  type JobSearchFilters,
} from "@/lib/jobs/filters";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

const fieldClassName =
  "border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 min-h-11 w-full rounded-lg border px-3 text-base outline-none focus-visible:ring-3 md:text-sm";

type JobSearchFormProps = {
  filters: JobSearchFilters;
  locations: string[];
};

export function JobSearchForm({ filters, locations }: JobSearchFormProps) {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    for (const [key, value] of data.entries()) {
      const text = String(value).trim();
      if (text) {
        params.set(key, text);
      }
    }

    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
    window.setTimeout(() => {
      document.getElementById("hasil-pencarian")?.focus();
    }, 50);
  }

  return (
    <form
      method="get"
      action="/"
      onSubmit={handleSubmit}
      className="border-border bg-card mb-6 rounded-xl border p-4 sm:p-5"
      aria-label="Cari dan saring lowongan"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="q">Kata kunci</Label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={filters.q}
            placeholder="Posisi atau nama perusahaan"
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
            {DISABILITY_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="lokasi">Lokasi</Label>
          <select
            id="lokasi"
            name="lokasi"
            defaultValue={filters.lokasi}
            className={fieldClassName}
          >
            <option value="">Semua lokasi</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="jenis">Jenis pekerjaan</Label>
          <select
            id="jenis"
            name="jenis"
            defaultValue={filters.jenis}
            className={fieldClassName}
          >
            <option value="">Semua jenis pekerjaan</option>
            {JOB_TYPE_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
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
        {hasActiveFilters(filters) ? (
          <Link
            href="/"
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
