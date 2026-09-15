import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DISABILITY_FRIENDLY_LABEL,
  JOB_TYPE_LABEL,
  type JobListing,
} from "@/lib/types/job";
import { Briefcase, Building2, MapPin } from "lucide-react";
import Link from "next/link";

type JobCardProps = {
  job: JobListing;
};

export function JobCard({ job }: JobCardProps) {
  const detailHref = `/lowongan/${job.id}`;

  return (
    <article className="relative h-full">
      <Card className="h-full overflow-visible">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            <h3 className="text-lg leading-snug font-semibold">
              <Link
                href={detailHref}
                className="focus-visible:ring-ring after:absolute after:inset-0 after:rounded-xl hover:underline focus-visible:ring-3 focus-visible:outline-none"
              >
                {job.title}
              </Link>
            </h3>
          </CardTitle>
          <CardDescription className="text-foreground/80 flex items-center gap-2 text-sm">
            <Building2 aria-hidden="true" className="size-4 shrink-0" />
            <span>{job.company.name}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          <p className="text-muted-foreground text-sm leading-6">
            {job.description}
          </p>
          <ul className="text-foreground flex flex-col gap-2 text-sm">
            <li className="flex items-start gap-2">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>
                <span className="sr-only">Lokasi: </span>
                {job.location}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Briefcase
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
              />
              <span>
                <span className="sr-only">Jenis pekerjaan: </span>
                {JOB_TYPE_LABEL[job.jobType]}
              </span>
            </li>
          </ul>
          <Badge
            variant="secondary"
            className="h-auto max-w-full px-2.5 py-1 text-left text-xs leading-4 whitespace-normal"
          >
            {DISABILITY_FRIENDLY_LABEL[job.disabilityFriendlyType]}
          </Badge>
        </CardContent>
        <CardFooter className="mt-auto">
          <span className="text-primary text-sm font-medium underline-offset-4">
            Lihat detail lowongan
          </span>
        </CardFooter>
      </Card>
    </article>
  );
}
