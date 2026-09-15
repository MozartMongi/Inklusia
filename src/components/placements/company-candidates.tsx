import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CompanyReceivedCandidate } from "@/lib/api/placements";
import {
  formatPlacementDate,
  placementStatusBadgeVariant,
} from "@/lib/placements/format";
import { JOB_SEEKER_DISABILITY_LABEL } from "@/lib/types/job-seeker";
import { PLACEMENT_STATUS_LABEL } from "@/lib/types/placement";
import Link from "next/link";

type CompanyCandidatesProps = {
  candidates: CompanyReceivedCandidate[];
};

export function CompanyCandidates({ candidates }: CompanyCandidatesProps) {
  if (candidates.length === 0) {
    return (
      <p
        role="status"
        className="border-border bg-card text-muted-foreground rounded-xl border px-4 py-10 text-center text-base"
      >
        Belum ada kandidat yang disalurkan admin ke perusahaan Anda.
      </p>
    );
  }

  return (
    <ul className="grid list-none grid-cols-1 gap-4 p-0">
      {candidates.map(({ placement, seeker }) => (
        <li key={placement.id}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {placement.jobSeeker.fullName}
              </CardTitle>
              <CardDescription>
                Disalurkan untuk{" "}
                <Link
                  href={`/lowongan/${placement.job.id}`}
                  className="text-primary font-medium underline underline-offset-4 hover:decoration-2 focus-visible:ring-ring rounded-sm focus-visible:ring-3 focus-visible:outline-none"
                >
                  {placement.job.title}
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Badge
                variant={placementStatusBadgeVariant(placement.status)}
                className="h-auto max-w-full px-2.5 py-1 text-left text-xs leading-4 whitespace-normal"
              >
                {PLACEMENT_STATUS_LABEL[placement.status]}
              </Badge>
              <Badge
                variant="secondary"
                className="h-auto max-w-full px-2.5 py-1 text-left text-xs leading-4 whitespace-normal"
              >
                {JOB_SEEKER_DISABILITY_LABEL[placement.jobSeeker.disabilityType]}
              </Badge>
              {seeker ? (
                <>
                  <p className="text-muted-foreground text-sm">{seeker.city}</p>
                  <p className="text-foreground text-sm leading-6">
                    <span className="sr-only">Keahlian: </span>
                    {seeker.skillNames.join(", ")}
                  </p>
                </>
              ) : null}
              <p className="text-muted-foreground text-sm">
                Diterima dari admin pada{" "}
                {formatPlacementDate(placement.createdAt)}
              </p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
