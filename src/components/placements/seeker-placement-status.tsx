import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatPlacementDate,
  placementStatusBadgeVariant,
} from "@/lib/placements/format";
import {
  PLACEMENT_STATUS_LABEL,
  type Placement,
} from "@/lib/types/placement";
import Link from "next/link";

type SeekerPlacementStatusProps = {
  placements: Placement[];
};

export function SeekerPlacementStatus({
  placements,
}: SeekerPlacementStatusProps) {
  if (placements.length === 0) {
    return (
      <p
        role="status"
        className="border-border bg-card text-muted-foreground rounded-xl border px-4 py-10 text-center text-base"
      >
        Belum ada penyaluran. Lengkapi profil agar admin dapat menghubungkan
        Anda ke lowongan yang sesuai.
      </p>
    );
  }

  return (
    <ul className="grid list-none grid-cols-1 gap-4 p-0">
      {placements.map((placement) => (
        <li key={placement.id}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                <Link
                  href={`/lowongan/${placement.job.id}`}
                  className="focus-visible:ring-ring rounded-sm hover:underline focus-visible:ring-3 focus-visible:outline-none"
                >
                  {placement.job.title}
                </Link>
              </CardTitle>
              <CardDescription>
                {placement.job.companyName} · {placement.job.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Badge
                variant={placementStatusBadgeVariant(placement.status)}
                className="h-auto max-w-full px-2.5 py-1 text-left text-xs leading-4 whitespace-normal"
              >
                {PLACEMENT_STATUS_LABEL[placement.status]}
              </Badge>
              <p className="text-muted-foreground text-sm">
                Dikirim admin pada {formatPlacementDate(placement.createdAt)}
              </p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
