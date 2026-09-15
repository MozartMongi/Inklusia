import type { Placement } from "@/lib/types/placement";

export const MOCK_PLACEMENTS: Placement[] = [
  {
    id: "pl-001",
    jobSeeker: {
      id: "js-001",
      fullName: "Sari Wulandari",
      disabilityType: "tuli",
    },
    job: {
      id: "job-001",
      title: "Customer Service Inclusive",
      companyId: "co-001",
      companyName: "Bank Harmoni Nusantara",
      location: "Jakarta Selatan",
    },
    status: "dikirim",
    createdAt: "2026-09-10T08:00:00.000Z",
  },
  {
    id: "pl-002",
    jobSeeker: {
      id: "js-002",
      fullName: "Budi Santoso",
      disabilityType: "daksa",
    },
    job: {
      id: "job-002",
      title: "Staf Entri Data",
      companyId: "co-002",
      companyName: "Telusur Digital Indonesia",
      location: "Bandung",
    },
    status: "diterima",
    createdAt: "2026-09-09T04:30:00.000Z",
  },
  {
    id: "pl-003",
    jobSeeker: {
      id: "js-004",
      fullName: "Andi Pratama",
      disabilityType: "autisme",
    },
    job: {
      id: "job-004",
      title: "Software Engineer (Frontend)",
      companyId: "co-004",
      companyName: "Karya Inklusif Teknologi",
      location: "Jakarta Pusat",
    },
    status: "menunggu",
    createdAt: "2026-09-11T02:15:00.000Z",
  },
  {
    id: "pl-004",
    jobSeeker: {
      id: "js-003",
      fullName: "Lina Kartika",
      disabilityType: "netra",
    },
    job: {
      id: "job-003",
      title: "Penulis Konten",
      companyId: "co-003",
      companyName: "Suara Setara Media",
      location: "Remote — seluruh Indonesia",
    },
    status: "ditolak",
    createdAt: "2026-09-08T09:45:00.000Z",
  },
  {
    id: "pl-005",
    jobSeeker: {
      id: "js-005",
      fullName: "Rina Dewi",
      disabilityType: "intelektual",
    },
    job: {
      id: "job-001",
      title: "Customer Service Inclusive",
      companyId: "co-001",
      companyName: "Bank Harmoni Nusantara",
      location: "Jakarta Selatan",
    },
    status: "dikirim",
    createdAt: "2026-09-12T03:20:00.000Z",
  },
  {
    id: "pl-006",
    jobSeeker: {
      id: "js-001",
      fullName: "Sari Wulandari",
      disabilityType: "tuli",
    },
    job: {
      id: "job-006",
      title: "Desainer Grafis",
      companyId: "co-006",
      companyName: "Studio Warna Setara",
      location: "Yogyakarta",
    },
    status: "ditolak",
    createdAt: "2026-08-20T07:00:00.000Z",
  },
];
