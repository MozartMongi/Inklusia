import { apiGet, apiSend, isApiError, searchQuery } from "@/lib/api/http";
import {
  parsePlacementHistoryFilters,
  type PlacementHistoryFilters,
} from "@/lib/placements/history-filters";
import {
  parseSeekerSearchFilters,
  type SeekerSearchFilters,
} from "@/lib/placements/seeker-filters";
import type { JobListing } from "@/lib/types/job";
import type {
  ContactChannel,
  JobSeekerSummary,
  Placement,
  PlacementContactLog,
} from "@/lib/types/placement";

export type PlacementOverview = {
  seekers: JobSeekerSummary[];
  selectedSeeker: JobSeekerSummary | null;
  selectedContactLogs: PlacementContactLog[];
  filters: SeekerSearchFilters;
  cities: string[];
  openJobs: JobListing[];
  recentPlacements: Placement[];
  stats: {
    seekerCount: number;
    openJobCount: number;
    waitingCount: number;
    sentCount: number;
  };
};

export async function fetchPlacementOverview(
  searchParams: Record<string, string | string[] | undefined> = {},
): Promise<PlacementOverview> {
  const filters = parseSeekerSearchFilters(searchParams);
  return apiGet<PlacementOverview>(
    `/api/admin/penyaluran${searchQuery({
      q: filters.q,
      disabilitas: filters.disabilitas,
      kota: filters.kota,
      pilih: filters.pilih,
    })}`,
  );
}

export type CreatePlacementInput = {
  jobSeekerId: string;
  jobId: string;
  note: string;
};

export type CompanyReceivedCandidate = {
  placement: Placement;
  seeker: JobSeekerSummary | null;
};

export async function fetchAdminPlacementHistory(
  searchParams: Record<string, string | string[] | undefined> = {},
): Promise<{
  placements: Placement[];
  filters: PlacementHistoryFilters;
  companies: string[];
}> {
  const filters = parsePlacementHistoryFilters(searchParams);
  const placements = await apiGet<Placement[]>(
    `/api/admin/penyaluran/riwayat${searchQuery({
      q: filters.q,
      status: filters.status,
      perusahaan: filters.perusahaan,
    })}`,
  );
  const catalog = await apiGet<Placement[]>("/api/admin/penyaluran/riwayat");
  const companies = [
    ...new Set(catalog.map((item) => item.job.companyName)),
  ].sort((a, b) => a.localeCompare(b, "id"));

  return { placements, filters, companies };
}

export async function fetchCompanyReceivedCandidates(): Promise<
  CompanyReceivedCandidate[]
> {
  return apiGet<CompanyReceivedCandidate[]>("/api/company/kandidat");
}

export async function fetchMyPlacements(): Promise<Placement[]> {
  return apiGet<Placement[]>("/api/me/penyaluran");
}

export async function fetchMyPlacementHistory(): Promise<Placement[]> {
  return apiGet<Placement[]>("/api/me/penyaluran/riwayat");
}

export async function createPlacement(
  input: CreatePlacementInput,
): Promise<{ data: Placement } | { error: string }> {
  try {
    const data = await apiSend<Placement>("/api/admin/penyaluran", "POST", input);
    return { data };
  } catch (error) {
    if (isApiError(error)) {
      return { error: error.message };
    }
    throw error;
  }
}

export type CreateContactLogInput = {
  jobSeekerId: string;
  channel: ContactChannel;
  message: string;
};

export async function createContactLog(
  input: CreateContactLogInput,
): Promise<{ data: PlacementContactLog } | { error: string }> {
  try {
    const data = await apiSend<PlacementContactLog>(
      "/api/admin/penyaluran/kontak",
      "POST",
      input,
    );
    return { data };
  } catch (error) {
    if (isApiError(error)) {
      return { error: error.message };
    }
    throw error;
  }
}
