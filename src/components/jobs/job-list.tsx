import { JobCard } from "@/components/jobs/job-card";
import type { JobListing } from "@/lib/types/job";

type JobListProps = {
  jobs: JobListing[];
  hasFilters?: boolean;
  unavailable?: boolean;
};

export function JobList({
  jobs,
  hasFilters = false,
  unavailable = false,
}: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div
        role="status"
        className="border-border bg-card rounded-xl border px-4 py-10 text-center"
      >
        <p className="text-foreground text-base font-medium">
          {unavailable
            ? "Data lowongan sedang tidak dapat ditampilkan"
            : hasFilters
              ? "Tidak ada lowongan yang cocok"
              : "Belum ada lowongan yang ditampilkan"}
        </p>
        <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-6">
          {unavailable
            ? "Layanan data sedang tidak tersedia. Muat ulang halaman ini beberapa saat lagi."
            : hasFilters
              ? "Coba kata kunci lain atau hapus saringan."
              : "Lowongan tampil di sini setelah kebutuhan perusahaan disetujui admin. Periksa lagi nanti, atau daftarkan diri agar admin dapat menyalurkan profil Anda."}
        </p>
      </div>
    );
  }

  return (
    <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
      {jobs.map((job) => (
        <li key={job.id} className="min-w-0">
          <JobCard job={job} />
        </li>
      ))}
    </ul>
  );
}
