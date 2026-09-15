import type { Training, TrainingEnrollment } from "@/lib/types/training";

export const MOCK_TRAININGS: Training[] = [
  {
    id: "trn-001",
    title: "Komunikasi tertulis untuk layanan pelanggan",
    summary:
      "Latih menulis respons jelas dan sopan untuk chat, email, dan tiket dukungan.",
    description:
      "Pelatihan ini membekali peserta dengan pola jawaban layanan pelanggan yang ramah, ringkas, dan mudah dibaca pembaca layar. Materi mencakup penyusun pesan, eskalasi, serta etika komunikasi digital.",
    provider: "Akademi Inklusia",
    format: "daring",
    durationLabel: "4 pertemuan · 2 minggu",
    skillTags: ["Komunikasi tertulis", "Layanan pelanggan", "Email"],
    accessibilityNotes:
      "Materi tersedia dalam teks dan rekaman ber-caption. Diskusi memakai chat dan voice opsional.",
    startsAt: "2026-10-06T09:00:00.000Z",
    seatsLeft: 12,
  },
  {
    id: "trn-002",
    title: "Spreadsheet dasar untuk entri data",
    summary:
      "Kuasai Excel/Google Sheets untuk menyortir, memfilter, dan merapikan data.",
    description:
      "Dari navigasi sel hingga rumus sederhana (SUM, IF, VLOOKUP dasar). Latihan memakai data contoh yang relevan dengan pekerjaan administrasi inklusif.",
    provider: "Pusat Keterampilan Digital",
    format: "hybrid",
    durationLabel: "6 pertemuan · 3 minggu",
    skillTags: ["Spreadsheet", "Entri data", "Microsoft Excel"],
    accessibilityNotes:
      "Instruksi keyboard-first. Sesi luring di ruang aksesibel dengan jalur kursi roda.",
    startsAt: "2026-10-13T02:00:00.000Z",
    seatsLeft: 8,
  },
  {
    id: "trn-003",
    title: "Persiapan wawancara kerja inklusif",
    summary:
      "Latihan menjawab pertanyaan umum dan menjelaskan akomodasi dengan percaya diri.",
    description:
      "Simulasi wawancara dengan umpan balik. Termasuk bagaimana menjelaskan kebutuhan aksesibilitas tanpa mengorbankan fokus pada kompetensi.",
    provider: "Akademi Inklusia",
    format: "daring",
    durationLabel: "3 pertemuan · 1 minggu",
    skillTags: ["Wawancara", "Komunikasi", "Persiapan kerja"],
    accessibilityNotes:
      "Juru bahasa isyarat tersedia bila diminta 3 hari sebelumnya. Materi dalam teks besar.",
    startsAt: "2026-10-20T04:00:00.000Z",
    seatsLeft: 15,
  },
  {
    id: "trn-004",
    title: "Pengarsipan digital dan organisasi berkas",
    summary:
      "Bangun kebiasaan folder, penamaan berkas, dan pencadangan yang rapi.",
    description:
      "Praktik menata dokumen kerja, metadata sederhana, dan checklist keamanan berkas untuk peran administrasi atau back-office.",
    provider: "Komunitas Kerja Inklusif",
    format: "luring",
    durationLabel: "2 hari intensif",
    skillTags: ["Pengarsipan", "Administrasi", "Organisasi"],
    accessibilityNotes:
      "Lokasi dekat transportasi umum. Materi cetak dan digital disediakan.",
    startsAt: "2026-11-03T01:00:00.000Z",
    seatsLeft: 5,
  },
];

/** Pendaftaran contoh untuk “Pelatihan saya”. */
export const MOCK_TRAINING_ENROLLMENTS: TrainingEnrollment[] = [
  {
    id: "enr-001",
    trainingId: "trn-002",
    status: "berlangsung",
    enrolledAt: "2026-09-01T08:00:00.000Z",
  },
  {
    id: "enr-002",
    trainingId: "trn-001",
    status: "terdaftar",
    enrolledAt: "2026-09-10T10:30:00.000Z",
  },
];

/** Store mutabel untuk aksi ikut/batal pelatihan di stub UI. */
export const trainingEnrollmentsStore: TrainingEnrollment[] =
  MOCK_TRAINING_ENROLLMENTS.map((item) => ({ ...item }));
