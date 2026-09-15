import { MOCK_CONTACT_LOGS } from "@/lib/mock/contacts";
import { MOCK_JOBS } from "@/lib/mock/jobs";
import { MOCK_JOB_SEEKERS } from "@/lib/mock/job-seekers";
import { MOCK_PLACEMENTS } from "@/lib/mock/placements";
import {
  filterPlacements,
  parsePlacementHistoryFilters,
  type PlacementHistoryFilters,
} from "@/lib/placements/history-filters";
import {
  filterSeekers,
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
  openJobs: JobListing[];
  recentPlacements: Placement[];
  stats: {
    seekerCount: number;
    openJobCount: number;
    waitingCount: number;
    sentCount: number;
  };
};

/**
 * Kontrak API yang diasumsikan frontend:
 * GET /api/admin/penyaluran?q=&disabilitas=&kota=&pilih=
 *   → { data: PlacementOverview }
 * Saat ini memakai data tiruan sampai backend Express siap.
 */
export async function fetchPlacementOverview(
  searchParams: Record<string, string | string[] | undefined> = {},
): Promise<PlacementOverview> {
  const filters = parseSeekerSearchFilters(searchParams);
  const seekers = filterSeekers(MOCK_JOB_SEEKERS, filters);
  const selectedSeeker =
    MOCK_JOB_SEEKERS.find((seeker) => seeker.id === filters.pilih) ?? null;
  const openJobs = MOCK_JOBS.filter((job) => job.isActive);
  const waitingCount = MOCK_PLACEMENTS.filter(
    (placement) => placement.status === "menunggu",
  ).length;
  const sentCount = MOCK_PLACEMENTS.filter(
    (placement) =>
      placement.status === "dikirim" || placement.status === "diterima",
  ).length;

  return {
    seekers,
    selectedSeeker,
    selectedContactLogs: selectedSeeker
      ? MOCK_CONTACT_LOGS.filter((log) => log.jobSeekerId === selectedSeeker.id)
      : [],
    filters,
    openJobs,
    recentPlacements: [...MOCK_PLACEMENTS].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    ),
    stats: {
      seekerCount: MOCK_JOB_SEEKERS.length,
      openJobCount: openJobs.length,
      waitingCount,
      sentCount,
    },
  };
}

export type CreatePlacementInput = {
  jobSeekerId: string;
  jobId: string;
  note: string;
};

/**
 * Kontrak yang diasumsikan: POST /api/admin/penyaluran
 * { jobSeekerId, jobId, note } → { data: Placement }
 */
/**
 * Kontrak API yang diasumsikan frontend:
 * GET /api/me/penyaluran → { data: Placement[] }
 * Memakai data tiruan pencari kerja yang sedang "masuk".
 */
export const MOCK_COMPANY_SESSION = {
  id: "co-001",
  name: "Bank Harmoni Nusantara",
};

export type CompanyReceivedCandidate = {
  placement: Placement;
  seeker: JobSeekerSummary | null;
};

/**
 * Kontrak API yang diasumsikan frontend:
 * GET /api/company/kandidat → { data: CompanyReceivedCandidate[] }
 * Memakai perusahaan tiruan yang sedang "masuk".
 */
/**
 * Kontrak API yang diasumsikan frontend:
 * GET /api/admin/penyaluran/riwayat?q=&status=&perusahaan=
 *   → { data: Placement[] }
 */
export async function fetchAdminPlacementHistory(
  searchParams: Record<string, string | string[] | undefined> = {},
): Promise<{
  placements: Placement[];
  filters: PlacementHistoryFilters;
}> {
  const filters = parsePlacementHistoryFilters(searchParams);
  const placements = filterPlacements(
    [...MOCK_PLACEMENTS].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    filters,
  );

  return { placements, filters };
}

export async function fetchCompanyReceivedCandidates(
  companyId = MOCK_COMPANY_SESSION.id,
): Promise<CompanyReceivedCandidate[]> {
  return MOCK_PLACEMENTS.filter(
    (placement) =>
      placement.job.companyId === companyId &&
      placement.status !== "menunggu",
  )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((placement) => ({
      placement,
      seeker:
        MOCK_JOB_SEEKERS.find((item) => item.id === placement.jobSeeker.id) ??
        null,
    }));
}

export async function fetchMyPlacements(): Promise<Placement[]> {
  return MOCK_PLACEMENTS.filter(
    (placement) =>
      placement.jobSeeker.id === "js-001" &&
      (placement.status === "menunggu" || placement.status === "dikirim"),
  ).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * Kontrak API yang diasumsikan frontend:
 * GET /api/me/penyaluran/riwayat → { data: Placement[] }
 */
export async function fetchMyPlacementHistory(): Promise<Placement[]> {
  return MOCK_PLACEMENTS.filter(
    (placement) => placement.jobSeeker.id === "js-001",
  ).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createPlacement(
  input: CreatePlacementInput,
): Promise<{ data: Placement }> {
  const seeker = MOCK_JOB_SEEKERS.find(
    (item) => item.id === input.jobSeekerId,
  );
  const job = MOCK_JOBS.find((item) => item.id === input.jobId && item.isActive);

  if (!seeker || !job) {
    throw new Error("Pencari kerja atau lowongan tidak ditemukan.");
  }

  return {
    data: {
      id: `pl-mock-${Date.now()}`,
      jobSeeker: {
        id: seeker.id,
        fullName: seeker.fullName,
        disabilityType: seeker.disabilityType,
      },
      job: {
        id: job.id,
        title: job.title,
        companyId: job.company.id,
        companyName: job.company.name,
        location: job.location,
      },
      status: "dikirim",
      createdAt: new Date().toISOString(),
    },
  };
}

export type CreateContactLogInput = {
  jobSeekerId: string;
  channel: ContactChannel;
  message: string;
};

/**
 * Kontrak yang diasumsikan: POST /api/admin/penyaluran/kontak
 * { jobSeekerId, channel, message } → { data: PlacementContactLog }
 */
export async function createContactLog(
  input: CreateContactLogInput,
): Promise<{ data: PlacementContactLog }> {
  const seeker = MOCK_JOB_SEEKERS.find((item) => item.id === input.jobSeekerId);

  if (!seeker) {
    throw new Error("Pencari kerja tidak ditemukan.");
  }

  return {
    data: {
      id: `ct-mock-${Date.now()}`,
      jobSeekerId: seeker.id,
      channel: input.channel,
      message: input.message,
      createdAt: new Date().toISOString(),
    },
  };
}
