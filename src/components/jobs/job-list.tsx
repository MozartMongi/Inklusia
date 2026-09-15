import { JobCard } from "@/components/jobs/job-card";
import type { JobListing } from "@/lib/types/job";

type JobListProps = {
  jobs: JobListing[];
};

export function JobList({ jobs }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <p
        role="status"
        className="border-border bg-card text-muted-foreground rounded-xl border px-4 py-10 text-center text-base"
      >
        Tidak ada lowongan yang cocok dengan pencarian atau saringan Anda.
        Coba kata kunci lain atau hapus saringan.
      </p>
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
