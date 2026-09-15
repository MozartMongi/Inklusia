import type { JobSeekerProfile } from "@/lib/types/job-seeker";

export const MOCK_JOB_SEEKER: JobSeekerProfile = {
  id: "js-001",
  userId: "user-js-001",
  email: "sari.wulandari@contoh.inklusia.id",
  fullName: "Sari Wulandari",
  photoUrl: null,
  ktpPhotoUrl: "/images/mock-ktp-placeholder.svg",
  disabilityType: "tuli",
  disabilityNotes:
    "Tuli sejak lahir, nyaman komunikasi tertulis dan chat. Butuh subtitle pada rapat video.",
  address: "Jl. Melati No. 14, Jakarta Selatan",
  phone: "0812-3456-7890",
  bio: "Saya nyaman bekerja lewat teks dan siap belajar sistem baru. Fokus saya adalah layanan pelanggan dan administrasi yang rapi.",
  profileCompleteness: 80,
  skills: [
    { id: "sk-001", skillName: "Komunikasi tertulis", level: "mahir" },
    { id: "sk-002", skillName: "Microsoft Excel", level: "menengah" },
    { id: "sk-003", skillName: "Layanan pelanggan", level: "menengah" },
  ],
  certifications: [
    {
      id: "ct-001",
      name: "Pelayanan Pelanggan Inklusif",
      issuer: "Inklusia Academy",
      year: "2024",
    },
  ],
  experiences: [
    {
      id: "we-001",
      companyName: "Warung Digital Nusantara",
      position: "Staf layanan chat",
      startDate: "2023-03-01",
      endDate: "2025-08-31",
      description:
        "Menjawab pertanyaan pelanggan lewat chat dan email, serta mencatat tiket yang perlu ditindaklanjuti tim lain.",
    },
    {
      id: "we-002",
      companyName: "Koperasi Maju Bersama",
      position: "Asisten administrasi",
      startDate: "2021-07-01",
      endDate: "2023-02-28",
      description:
        "Membantu entri data anggota dan merapikan arsip surat masuk secara digital.",
    },
  ],
  updatedAt: "2026-09-10T09:00:00.000Z",
};

export const MOCK_JOB_SEEKER_PROFILES: JobSeekerProfile[] = [
  MOCK_JOB_SEEKER,
  {
    id: "js-002",
    userId: "user-js-002",
    email: "budi.santoso@contoh.inklusia.id",
    fullName: "Budi Santoso",
    photoUrl: null,
    ktpPhotoUrl: "/images/mock-ktp-placeholder.svg",
    disabilityType: "daksa",
    disabilityNotes:
      "Pengguna kursi roda. Butuh akses ramp, toilet aksesibel, dan meja yang dapat disesuaikan tingginya.",
    address: "Jl. Merdeka No. 5, Bandung",
    phone: "0813-2211-4455",
    bio: "Teliti pada entri data dan pengarsipan. Terbiasa bekerja dengan target harian yang jelas.",
    profileCompleteness: 100,
    skills: [
      { id: "sk-201", skillName: "Entri data", level: "mahir" },
      { id: "sk-202", skillName: "Spreadsheet", level: "mahir" },
      { id: "sk-203", skillName: "Pengarsipan", level: "menengah" },
    ],
    certifications: [
      {
        id: "ct-201",
        name: "Microsoft Office Specialist",
        issuer: "Certiport",
        year: "2023",
      },
    ],
    experiences: [
      {
        id: "we-201",
        companyName: "Kantor Pos Bandung",
        position: "Staf entri data",
        startDate: "2022-01-01",
        endDate: null,
        description:
          "Memasukkan data paket dan pelanggan ke sistem internal setiap hari.",
      },
    ],
    updatedAt: "2026-09-11T08:00:00.000Z",
  },
  {
    id: "js-003",
    userId: "user-js-003",
    email: "lina.kartika@contoh.inklusia.id",
    fullName: "Lina Kartika",
    photoUrl: null,
    ktpPhotoUrl: null,
    disabilityType: "netra",
    disabilityNotes:
      "Low vision. Menggunakan pembaca layar NVDA dan butuh dokumen dalam format teks yang dapat diakses.",
    address: "Jl. Kaliurang Km 7, Yogyakarta",
    phone: "0821-7788-9900",
    bio: "Menulis dan meriset dengan baik. Terbiasa bekerja jarak jauh dengan alat bantu aksesibilitas.",
    profileCompleteness: 64,
    skills: [
      { id: "sk-301", skillName: "Penulisan", level: "mahir" },
      { id: "sk-302", skillName: "Riset", level: "menengah" },
      { id: "sk-303", skillName: "Pembaca layar", level: "mahir" },
    ],
    certifications: [],
    experiences: [],
    updatedAt: "2026-09-09T10:00:00.000Z",
  },
  {
    id: "js-004",
    userId: "user-js-004",
    email: "andi.pratama@contoh.inklusia.id",
    fullName: "Andi Pratama",
    photoUrl: null,
    ktpPhotoUrl: "/images/mock-ktp-placeholder.svg",
    disabilityType: "autisme",
    disabilityNotes:
      "Lebih nyaman dengan instruksi tertulis, jadwal yang jelas, dan lingkungan kerja yang tenang.",
    address: "Jl. Thamrin No. 2, Jakarta Pusat",
    phone: "0857-1000-2233",
    bio: "Frontend developer yang fokus pada aksesibilitas web dan komponen React yang rapi.",
    profileCompleteness: 90,
    skills: [
      { id: "sk-401", skillName: "React", level: "mahir" },
      { id: "sk-402", skillName: "Aksesibilitas web", level: "mahir" },
      { id: "sk-403", skillName: "TypeScript", level: "menengah" },
    ],
    certifications: [
      {
        id: "ct-401",
        name: "Web Accessibility Specialist",
        issuer: "IAAP",
        year: "2025",
      },
    ],
    experiences: [
      {
        id: "we-401",
        companyName: "Studio Kode Inklusif",
        position: "Frontend developer",
        startDate: "2024-02-01",
        endDate: null,
        description:
          "Membangun antarmuka React dan audit aksesibilitas pada produk internal.",
      },
    ],
    updatedAt: "2026-09-12T07:30:00.000Z",
  },
  {
    id: "js-005",
    userId: "user-js-005",
    email: "rina.dewi@contoh.inklusia.id",
    fullName: "Rina Dewi",
    photoUrl: null,
    ktpPhotoUrl: null,
    disabilityType: "intelektual",
    disabilityNotes:
      "Membutuhkan mentor di bulan pertama dan instruksi tugas yang dibagi langkah demi langkah.",
    address: "Jl. Darmo No. 18, Surabaya",
    phone: "0819-3344-5566",
    bio: "Senang pencatatan sederhana dan kerja tim. Siap belajar dengan pendampingan.",
    profileCompleteness: 55,
    skills: [
      { id: "sk-501", skillName: "Pencatatan", level: "dasar" },
      { id: "sk-502", skillName: "Kerja tim", level: "menengah" },
    ],
    certifications: [],
    experiences: [],
    updatedAt: "2026-09-08T11:00:00.000Z",
  },
];
