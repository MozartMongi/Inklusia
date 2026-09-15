import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DISABILITY_FRIENDLY_LABEL,
  JOB_TYPE_LABEL,
  type JobListing,
} from "@/lib/types/job";
import Link from "next/link";

type OpenJobsQueueProps = {
  jobs: JobListing[];
};

export function OpenJobsQueue({ jobs }: OpenJobsQueueProps) {
  return (
    <section aria-labelledby="lowongan-penyaluran-heading">
      <h2
        id="lowongan-penyaluran-heading"
        className="text-foreground mb-4 text-xl font-semibold"
      >
        Lowongan yang menunggu kandidat
      </h2>
      <ul className="grid list-none grid-cols-1 gap-4 p-0">
        {jobs.map((job) => (
          <li key={job.id} className="min-w-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  <Link
                    href={`/lowongan/${job.id}`}
                    className="focus-visible:ring-ring rounded-sm hover:underline focus-visible:ring-3 focus-visible:outline-none"
                  >
                    {job.title}
                  </Link>
                </CardTitle>
                <CardDescription>
                  {job.company.name} · {job.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{JOB_TYPE_LABEL[job.jobType]}</Badge>
                <Badge
                  variant="secondary"
                  className="h-auto max-w-full px-2.5 py-1 text-left text-xs leading-4 whitespace-normal"
                >
                  {DISABILITY_FRIENDLY_LABEL[job.disabilityFriendlyType]}
                </Badge>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
