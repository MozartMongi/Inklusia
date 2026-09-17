import { SeekerSearchForm } from "@/components/placements/seeker-search-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SeekerSearchFilters } from "@/lib/placements/seeker-filters";
import { JOB_SEEKER_DISABILITY_LABEL } from "@/lib/types/job-seeker";
import type { JobSeekerSummary } from "@/lib/types/placement";
import Link from "next/link";

type AdminSeekerListProps = {
  seekers: JobSeekerSummary[];
  filters: SeekerSearchFilters;
  cities: string[];
};

export function AdminSeekerList({
  seekers,
  filters,
  cities,
}: AdminSeekerListProps) {
  return (
    <section aria-labelledby="daftar-pencari-heading">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between">
        <h2
          id="daftar-pencari-heading"
          className="text-foreground text-xl font-semibold"
        >
          Daftar pencari kerja
        </h2>
        <p
          id="hasil-pencari-kerja"
          tabIndex={-1}
          aria-live="polite"
          className="text-muted-foreground scroll-mt-24 rounded-sm text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring"
        >
          {seekers.length} pencari kerja ditampilkan
          {filters.q || filters.disabilitas || filters.kota
            ? " sesuai pencarian atau saringan"
            : ""}
        </p>
      </div>
      <SeekerSearchForm
        filters={filters}
        cities={cities}
        basePath="/admin/pencari-kerja"
      />
      {seekers.length === 0 ? (
        <p
          role="status"
          className="border-border bg-card text-muted-foreground rounded-xl border px-4 py-10 text-center text-base"
        >
          Tidak ada pencari kerja yang cocok dengan pencarian atau saringan
          Anda. Coba kata kunci lain atau hapus saringan. Jika daftar masih
          kosong tanpa saringan, belum ada pencari kerja terdaftar.
        </p>
      ) : (
        <ul className="grid list-none grid-cols-1 gap-4 p-0 lg:grid-cols-2">
          {seekers.map((seeker) => (
            <li key={seeker.id} className="min-w-0">
              <Card className="relative h-full overflow-visible">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    <h3 className="text-lg leading-snug font-semibold">
                      <Link
                        href={`/admin/pencari-kerja/${seeker.id}`}
                        className="focus-visible:ring-ring after:absolute after:inset-0 after:rounded-xl hover:underline focus-visible:ring-3 focus-visible:outline-none"
                      >
                        {seeker.fullName}
                      </Link>
                    </h3>
                  </CardTitle>
                  <CardDescription>
                    {seeker.city} · kelengkapan profil{" "}
                    {seeker.profileCompleteness}%
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Badge variant="secondary">
                    {JOB_SEEKER_DISABILITY_LABEL[seeker.disabilityType]}
                  </Badge>
                  <dl className="text-muted-foreground grid gap-1 text-sm">
                    <div className="flex flex-wrap gap-x-2">
                      <dt className="font-medium text-foreground">Email</dt>
                      <dd>{seeker.email}</dd>
                    </div>
                    <div className="flex flex-wrap gap-x-2">
                      <dt className="font-medium text-foreground">Telepon</dt>
                      <dd>{seeker.phone}</dd>
                    </div>
                  </dl>
                  {seeker.skillNames.length > 0 ? (
                    <p className="text-muted-foreground text-sm leading-6">
                      Keahlian: {seeker.skillNames.join(", ")}
                    </p>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Belum ada keahlian yang tercatat.
                    </p>
                  )}
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
