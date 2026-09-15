import type { PlacementContactLog } from "@/lib/types/placement";

export const MOCK_CONTACT_LOGS: PlacementContactLog[] = [
  {
    id: "ct-001",
    jobSeekerId: "js-001",
    channel: "email",
    message:
      "Mengirim email bahwa profil Sari sudah diteruskan ke Bank Harmoni.",
    createdAt: "2026-09-10T09:15:00.000Z",
  },
  {
    id: "ct-002",
    jobSeekerId: "js-002",
    channel: "telepon",
    message: "Menelepon Budi untuk memastikan jadwal wawancara entri data.",
    createdAt: "2026-09-09T06:00:00.000Z",
  },
];
