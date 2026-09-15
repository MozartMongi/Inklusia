import type { PlacementStatus } from "@/lib/types/placement";

export function formatPlacementDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

export function placementStatusBadgeVariant(
  status: PlacementStatus,
): "secondary" | "default" | "outline" | "destructive" {
  if (status === "diterima") {
    return "default";
  }
  if (status === "ditolak") {
    return "destructive";
  }
  if (status === "dikirim") {
    return "secondary";
  }
  return "outline";
}
