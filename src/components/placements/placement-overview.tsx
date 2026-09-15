import { ContactPanel } from "@/components/placements/contact-panel";
import { ForwardForm } from "@/components/placements/forward-form";
import { OpenJobsQueue } from "@/components/placements/open-jobs-queue";
import { PlacementStats } from "@/components/placements/placement-stats";
import { RecentPlacements } from "@/components/placements/recent-placements";
import { SeekerQueue } from "@/components/placements/seeker-queue";
import type { PlacementOverview as PlacementOverviewData } from "@/lib/api/placements";

type PlacementOverviewProps = {
  data: PlacementOverviewData;
  cities: string[];
};

export function PlacementOverview({ data, cities }: PlacementOverviewProps) {
  return (
    <div className="flex flex-col gap-10">
      <PlacementStats stats={data.stats} />
      <SeekerQueue
        seekers={data.seekers}
        selectedSeeker={data.selectedSeeker}
        filters={data.filters}
        cities={cities}
      />
      <ForwardForm seeker={data.selectedSeeker} jobs={data.openJobs} />
      <ContactPanel
        seeker={data.selectedSeeker}
        logs={data.selectedContactLogs}
      />
      <OpenJobsQueue jobs={data.openJobs} />
      <RecentPlacements placements={data.recentPlacements} />
    </div>
  );
}
