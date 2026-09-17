import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SeekerSearchForm } from "@/components/placements/seeker-search-form";
import { seekerSearchHref, type SeekerSearchFilters } from "@/lib/placements/seeker-filters";
import { JOB_SEEKER_DISABILITY_LABEL } from "@/lib/types/job-seeker";
import type { JobSeekerSummary } from "@/lib/types/placement";
import Link from "next/link";

type SeekerQueueProps = {
  seekers: JobSeekerSummary[];
  selectedSeeker: JobSeekerSummary | null;
  filters: SeekerSearchFilters;
  cities: string[];
};

export function SeekerQueue({
  seekers,
  selectedSeeker,
  filters,
  cities,
}: SeekerQueueProps) {
  return (
    <section aria-labelledby="antrian-pencari-heading">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between">
        <h2
          id="antrian-pencari-heading"
          className="text-foreground text-xl font-semibold"
        >
          Pencari kerja siap ditinjau
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
      <SeekerSearchForm filters={filters} cities={cities} />
      {selectedSeeker ? (
        <p
          role="status"
          className="border-border bg-muted/40 mb-4 rounded-xl border px-4 py-3 text-sm"
        >
          Terpilih:{" "}
          <span className="text-foreground font-medium">
            {selectedSeeker.fullName}
          </span>
          . Lanjut ke formulir penyaluran di bawah.
        </p>
      ) : (
        <p className="text-muted-foreground mb-4 text-sm">
          Pilih satu pencari kerja dari daftar untuk disalurkan ke lowongan.
        </p>
      )}
      {seekers.length === 0 ? (
        <p
          role="status"
          className="border-border bg-card text-muted-foreground rounded-xl border px-4 py-10 text-center text-base"
        >
          Tidak ada pencari kerja yang cocok dengan pencarian atau saringan
          Anda. Coba kata kunci lain atau hapus saringan. Jika daftar masih
          kosong tanpa saringan, belum ada pencari kerja yang dapat disalurkan.
        </p>
      ) : (
        <ul className="grid list-none grid-cols-1 gap-4 p-0 lg:grid-cols-2">
          {seekers.map((seeker) => {
            const selected = selectedSeeker?.id === seeker.id;

            return (
              <li key={seeker.id} className="min-w-0">
                <article className="relative h-full">
                  <Card
                    className={`h-full overflow-visible ${selected ? "border-primary ring-primary/30 ring-2" : ""}`}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        <h3 className="text-lg leading-snug font-semibold">
                          <Link
                            href={seekerSearchHref({
                              ...filters,
                              pilih: seeker.id,
                            })}
                            aria-current={selected ? "true" : undefined}
                            className="focus-visible:ring-ring after:absolute after:inset-0 after:rounded-xl hover:underline focus-visible:ring-3 focus-visible:outline-none"
                          >
                            {seeker.fullName}
                          </Link>
                        </h3>
                      </CardTitle>
                      <CardDescription>{seeker.city}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      <Badge
                        variant="secondary"
                        className="h-auto max-w-full px-2.5 py-1 text-left text-xs leading-4 whitespace-normal"
                      >
                        {JOB_SEEKER_DISABILITY_LABEL[seeker.disabilityType]}
                      </Badge>
                      <p className="text-muted-foreground text-sm">
                        Kelengkapan profil {seeker.profileCompleteness} persen
                      </p>
                      <p className="text-foreground text-sm leading-6">
                        <span className="sr-only">Keahlian: </span>
                        {seeker.skillNames.join(", ")}
                      </p>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <span className="text-primary text-sm font-medium underline-offset-4">
                        {selected ? "Sedang dipilih" : "Pilih kandidat ini"}
                      </span>
                    </CardFooter>
                  </Card>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
