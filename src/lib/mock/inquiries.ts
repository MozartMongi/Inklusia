import type { CompanyInquiry } from "@/lib/types/inquiry";

export const MOCK_COMPANY_INQUIRIES: CompanyInquiry[] = [
  {
    id: "inq-001",
    companyId: "co-001",
    title: "Customer Service Inclusive",
    description:
      "Membutuhkan staf layanan nasabah melalui chat dan email. Tim sudah terbiasa bekerja dengan rekan tuli.",
    requirements:
      "Komunikasi tertulis yang jelas, mampu menggunakan komputer, siap mengikuti pelatihan layanan inklusif.",
    location: "Jakarta Selatan",
    jobType: "penuh_waktu",
    disabilityFriendlyType: "tuli",
    headcount: 2,
    status: "terbuka",
    createdAt: "2026-09-08T08:00:00.000Z",
  },
  {
    id: "inq-002",
    companyId: "co-001",
    title: "Staf Administrasi Kantor",
    description:
      "Membantu arsip, jadwal, dan pelayanan tamu di kantor cabang. Meja dan jalur kursi roda sudah tersedia.",
    requirements:
      "Teliti, mampu menggunakan spreadsheet, nyaman bekerja di kantor pada jam paruh waktu.",
    location: "Jakarta Selatan",
    jobType: "paruh_waktu",
    disabilityFriendlyType: "daksa",
    headcount: 1,
    status: "ditutup",
    createdAt: "2026-09-12T03:00:00.000Z",
  },
  {
    id: "inq-003",
    companyId: "co-003",
    title: "Penulis Konten Aksesibel",
    description:
      "Menulis artikel kampanye dari rumah. Dokumen kerja kompatibel pembaca layar.",
    requirements:
      "Portofolio tulisan, mampu riset mandiri, nyaman kolaborasi jarak jauh.",
    location: "Remote — seluruh Indonesia",
    jobType: "kontrak",
    disabilityFriendlyType: "netra",
    headcount: 1,
    status: "terbuka",
    createdAt: "2026-09-06T04:15:00.000Z",
  },
  {
    id: "inq-004",
    companyId: "co-003",
    title: "Editor Video Subtitle",
    description:
      "Menyiapkan subtitle dan ringkasan teks untuk video kampanye inklusi.",
    requirements:
      "Teliti, menguasai subtitle editor dasar, komunikasi tertulis jelas.",
    location: "Remote — seluruh Indonesia",
    jobType: "lepas",
    disabilityFriendlyType: "tuli",
    headcount: 1,
    status: "terbuka",
    createdAt: "2026-09-10T02:00:00.000Z",
  },
  {
    id: "inq-005",
    companyId: "co-004",
    title: "Software Engineer (Frontend)",
    description:
      "Membangun antarmuka web dengan fokus aksesibilitas. Jadwal kerja terstruktur.",
    requirements:
      "Pengalaman React atau Next.js, peduli aksesibilitas web.",
    location: "Jakarta Pusat",
    jobType: "penuh_waktu",
    disabilityFriendlyType: "autisme",
    headcount: 1,
    status: "terbuka",
    createdAt: "2026-09-05T11:00:00.000Z",
  },
  {
    id: "inq-006",
    companyId: "co-006",
    title: "Desainer Grafis",
    description:
      "Membuat materi visual untuk klien UMKM. Brief disampaikan secara tertulis.",
    requirements: "Menguasai Figma atau Adobe, portofolio desain.",
    location: "Yogyakarta",
    jobType: "lepas",
    disabilityFriendlyType: "tuli",
    headcount: 1,
    status: "terbuka",
    createdAt: "2026-09-03T07:20:00.000Z",
  },
  {
    id: "inq-007",
    companyId: "co-008",
    title: "Magang Layanan Pelanggan",
    description:
      "Program magang tiga bulan dengan mentor di kedai kopi inklusif.",
    requirements:
      "Bersedia belajar, komunikasi ramah, dapat bekerja 20 jam per minggu.",
    location: "Depok",
    jobType: "magang",
    disabilityFriendlyType: "daksa",
    headcount: 2,
    status: "terbuka",
    createdAt: "2026-09-01T10:10:00.000Z",
  },
];
