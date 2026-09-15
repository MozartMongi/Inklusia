import type { JobListing } from "@/lib/types/job";

export const MOCK_JOBS: JobListing[] = [
  {
    id: "job-001",
    title: "Customer Service Inclusive",
    description:
      "Melayani nasabah melalui chat dan email. Tim sudah terbiasa bekerja dengan rekan tuli dan memakai subtitle pada rapat.",
    requirements:
      "Komunikasi tertulis yang jelas, mampu menggunakan komputer, dan siap mengikuti pelatihan layanan inklusif.",
    disabilityFriendlyType: "tuli",
    location: "Jakarta Selatan",
    jobType: "penuh_waktu",
    isActive: true,
    createdAt: "2026-09-08T08:00:00.000Z",
    company: {
      id: "co-001",
      name: "Bank Harmoni Nusantara",
      industry: "Perbankan",
      address: "Jl. Jenderal Sudirman Kav. 52, Jakarta Selatan",
    },
  },
  {
    id: "job-002",
    title: "Staf Entri Data",
    description:
      "Mengolah data pelanggan ke sistem internal. Meja dan jalur kantor ramah kursi roda, dengan toilet aksesibel di tiap lantai.",
    requirements:
      "Teliti, menguasai spreadsheet dasar, dan mampu bekerja dengan target harian yang wajar.",
    disabilityFriendlyType: "daksa",
    location: "Bandung",
    jobType: "penuh_waktu",
    isActive: true,
    createdAt: "2026-09-07T09:30:00.000Z",
    company: {
      id: "co-002",
      name: "Telusur Digital Indonesia",
      industry: "Teknologi",
      address: "Jl. Asia Afrika No. 8, Bandung",
    },
  },
  {
    id: "job-003",
    title: "Penulis Konten",
    description:
      "Menulis artikel dan salinan kampanye dari rumah. Dokumen kerja tersedia dalam format yang kompatibel dengan pembaca layar.",
    requirements:
      "Portofolio tulisan, mampu riset mandiri, dan nyaman berkolaborasi lewat dokumen bersama.",
    disabilityFriendlyType: "netra",
    location: "Remote — seluruh Indonesia",
    jobType: "kontrak",
    isActive: true,
    createdAt: "2026-09-06T04:15:00.000Z",
    company: {
      id: "co-003",
      name: "Suara Setara Media",
      industry: "Media",
      address: "Kantor virtual — seluruh Indonesia",
    },
  },
  {
    id: "job-004",
    title: "Software Engineer (Frontend)",
    description:
      "Membangun antarmuka web dengan fokus aksesibilitas. Lingkungan kerja mendukung jadwal terstruktur bagi rekan neurodivergent.",
    requirements:
      "Pengalaman React atau Next.js, peduli aksesibilitas web, dan mampu bekerja dalam tim kecil.",
    disabilityFriendlyType: "autisme",
    location: "Jakarta Pusat",
    jobType: "penuh_waktu",
    isActive: true,
    createdAt: "2026-09-05T11:00:00.000Z",
    company: {
      id: "co-004",
      name: "Karya Inklusif Teknologi",
      industry: "Teknologi",
      address: "Jl. Thamrin No. 12, Jakarta Pusat",
    },
  },
  {
    id: "job-005",
    title: "Asisten Administrasi Gudang",
    description:
      "Membantu pencatatan barang masuk dan keluar. Tugas dapat disesuaikan, dengan mentor di tempat selama tiga bulan pertama.",
    requirements:
      "Mampu mengikuti instruksi tertulis dan lisan, teliti mencatat angka, dan siap shift pagi.",
    disabilityFriendlyType: "intelektual",
    location: "Surabaya",
    jobType: "paruh_waktu",
    isActive: true,
    createdAt: "2026-09-04T02:45:00.000Z",
    company: {
      id: "co-005",
      name: "Gudang Berkah Logistik",
      industry: "Logistik",
      address: "Kawasan Industri Rungkut, Surabaya",
    },
  },
  {
    id: "job-006",
    title: "Desainer Grafis",
    description:
      "Membuat materi visual untuk klien UMKM. Brief dan umpan balik disampaikan secara tertulis agar mudah diikuti.",
    requirements:
      "Menguasai Figma atau Adobe, portofolio desain, dan mampu memenuhi tenggat yang disepakati.",
    disabilityFriendlyType: "tuli",
    location: "Yogyakarta",
    jobType: "lepas",
    isActive: true,
    createdAt: "2026-09-03T07:20:00.000Z",
    company: {
      id: "co-006",
      name: "Studio Warna Setara",
      industry: "Desain",
      address: "Jl. Kaliurang Km. 5, Yogyakarta",
    },
  },
  {
    id: "job-007",
    title: "Staf Akuntansi Junior",
    description:
      "Membantu rekonsiliasi dan pelaporan bulanan. Kantor BUMN dengan kuota disabilitas aktif dan pendampingan HRD.",
    requirements:
      "Lulusan D3/S1 akuntansi, teliti, dan menguasai Excel tingkat menengah.",
    disabilityFriendlyType: "semua",
    location: "Semarang",
    jobType: "penuh_waktu",
    isActive: true,
    createdAt: "2026-09-02T01:00:00.000Z",
    company: {
      id: "co-007",
      name: "PT Wira Karya Negara",
      industry: "BUMN",
      address: "Jl. Pahlawan No. 1, Semarang",
    },
  },
  {
    id: "job-008",
    title: "Magang Layanan Pelanggan",
    description:
      "Program magang tiga bulan dengan mentor. Cocok untuk kandidat yang baru memulai karier di lingkungan ramah disabilitas.",
    requirements:
      "Bersedia belajar, komunikasi ramah, dan dapat bekerja 20 jam per minggu.",
    disabilityFriendlyType: "daksa",
    location: "Depok",
    jobType: "magang",
    isActive: true,
    createdAt: "2026-09-01T10:10:00.000Z",
    company: {
      id: "co-008",
      name: "Rumah Kopi Inklusi",
      industry: "F&B",
      address: "Jl. Margonda Raya No. 45, Depok",
    },
  },
];
