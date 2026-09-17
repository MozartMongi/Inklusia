"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  PLACEMENT_STATUS_FILTER_OPTIONS,
  hasActiveHistoryFilters,
  placementHistoryHref,
  type PlacementHistoryFilters,
} from "@/lib/placements/history-filters";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

const fieldClassName =
  "border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 min-h-11 w-full rounded-lg border px-3 text-base outline-none focus-visible:ring-3 md:text-sm";

type PlacementHistoryFormProps = {
  filters: PlacementHistoryFilters;
  companies: string[];
};

export function PlacementHistoryForm({
  filters,
  companies,
}: PlacementHistoryFormProps) {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextHref = placementHistoryHref({
      q: String(data.get("q") ?? ""),
      status: String(data.get("status") ?? "") as PlacementHistoryFilters["status"],
      perusahaan: String(data.get("perusahaan") ?? ""),
    });

    router.push(nextHref);
    window.setTimeout(() => {
      document.getElementById("hasil-riwayat")?.focus();
    }, 50);
  }

  return (
    <form
      method="get"
      action="/admin/penyaluran/riwayat"
      onSubmit={handleSubmit}
      className="border-border bg-card mb-6 rounded-xl border p-4 sm:p-5"
      aria-label="Saring riwayat penyaluran"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="q">Kata kunci</Label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={filters.q}
            placeholder="Nama, lowongan, atau perusahaan"
            autoComplete="off"
            className={fieldClassName}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={filters.status}
            className={fieldClassName}
          >
            <option value="">Semua status</option>
            {PLACEMENT_STATUS_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="perusahaan">Perusahaan</Label>
          <select
            id="perusahaan"
            name="perusahaan"
            defaultValue={filters.perusahaan}
            className={fieldClassName}
          >
            <option value="">Semua perusahaan</option>
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
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
          Terapkan saringan
        </button>
        {hasActiveHistoryFilters(filters) ? (
          <Link
            href="/admin/penyaluran/riwayat"
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
