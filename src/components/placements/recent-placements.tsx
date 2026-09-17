import { Badge } from "@/components/ui/badge";
import {
  formatPlacementDate,
  placementStatusBadgeVariant,
} from "@/lib/placements/format";
import {
  PLACEMENT_STATUS_LABEL,
  type Placement,
} from "@/lib/types/placement";
import Link from "next/link";

type RecentPlacementsProps = {
  placements: Placement[];
  heading?: string;
  headingId?: string;
};

export function RecentPlacements({
  placements,
  heading = "Penyaluran terbaru",
  headingId = "penyaluran-terbaru-heading",
}: RecentPlacementsProps) {
  if (placements.length === 0) {
    return (
      <p
        role="status"
        className="border-border bg-card text-muted-foreground rounded-xl border px-4 py-10 text-center text-base"
      >
        Belum ada penyaluran. Setelah admin menyalurkan kandidat, riwayatnya
        tampil di sini.
      </p>
    );
  }

  return (
    <section aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="text-foreground mb-4 text-xl font-semibold"
      >
        {heading}
      </h2>
      <div className="border-border overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <caption className="sr-only">
            Daftar penyaluran kandidat ke lowongan beserta statusnya
          </caption>
          <thead className="bg-muted">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                Pencari kerja
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Lowongan
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Status
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Tanggal
              </th>
            </tr>
          </thead>
          <tbody>
            {placements.map((placement) => (
              <tr key={placement.id} className="border-border border-t">
                <th scope="row" className="text-foreground px-4 py-3 font-medium">
                  {placement.jobSeeker.fullName}
                </th>
                <td className="px-4 py-3">
                  <Link
                    href={`/lowongan/${placement.job.id}`}
                    className="text-primary font-medium underline underline-offset-4 hover:decoration-2 focus-visible:ring-ring rounded-sm focus-visible:ring-3 focus-visible:outline-none"
                  >
                    {placement.job.title}
                  </Link>
                  <p className="text-muted-foreground mt-1">
                    {placement.job.companyName}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={placementStatusBadgeVariant(placement.status)}
                    className="h-auto max-w-full px-2.5 py-1 text-left text-xs leading-4 whitespace-normal"
                  >
                    {PLACEMENT_STATUS_LABEL[placement.status]}
                  </Badge>
                </td>
                <td className="text-muted-foreground px-4 py-3">
                  {formatPlacementDate(placement.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
