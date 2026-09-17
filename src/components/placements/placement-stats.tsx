import type { PlacementOverview } from "@/lib/api/placements";

type PlacementStatsProps = {
  stats: PlacementOverview["stats"];
};

export function PlacementStats({ stats }: PlacementStatsProps) {
  const items = [
    { label: "Pencari kerja", value: stats.seekerCount },
    { label: "Lowongan aktif", value: stats.openJobCount },
    { label: "Menunggu dikirim", value: stats.waitingCount },
    { label: "Sudah tersalur", value: stats.sentCount },
  ];

  return (
    <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-4">
      {items.map((item) => (
        <li
          key={item.label}
          className="border-border bg-card rounded-xl border px-4 py-4"
        >
          <p className="text-foreground text-2xl font-semibold tabular-nums">
            {item.value}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">{item.label}</p>
        </li>
      ))}
    </ul>
  );
}
