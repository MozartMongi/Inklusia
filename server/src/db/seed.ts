import {
  DEV_ADMIN_USER_ID,
  DEV_JOB_SEEKER_PROFILE_ID,
  DEV_JOB_SEEKER_USER_ID,
} from "./seed-ids.js";
import { hashPassword } from "../auth/password.js";
import { pool } from "./pool.js";

/** Kredensial root admin awal (bootstrap lokal / seed). */
const ROOT_ADMIN_EMAIL = "info@inklusia.id";
const ROOT_ADMIN_PASSWORD = "BerkatBagiBangsa777";

type SeedJob = {
  userId: string;
  companyId: string;
  jobId: string;
  email: string;
  companyName: string;
  industry: string;
  address: string;
  title: string;
  description: string;
  requirements: string;
  disabilityFriendlyType: string;
  location: string;
  jobType: string;
  createdAt: string;
  isActive?: boolean;
};

const SEED_JOBS: SeedJob[] = [
  {
    userId: "10000000-0000-4000-8000-000000000001",
    companyId: "20000000-0000-4000-8000-000000000001",
    jobId: "30000000-0000-4000-8000-000000000001",
    email: "bank.harmoni@seed.inklusia.id",
    companyName: "Bank Harmoni Nusantara",
    industry: "Perbankan",
    address: "Jl. Jenderal Sudirman Kav. 52, Jakarta Selatan",
    title: "Customer Service Inclusive",
    description:
      "Melayani nasabah melalui chat dan email. Tim sudah terbiasa bekerja dengan rekan tuli dan memakai subtitle pada rapat.",
    requirements:
      "Komunikasi tertulis yang jelas, mampu menggunakan komputer, dan siap mengikuti pelatihan layanan inklusif.",
    disabilityFriendlyType: "tuli",
    location: "Jakarta Selatan",
    jobType: "penuh_waktu",
    createdAt: "2026-09-08T08:00:00.000Z",
  },
  {
    userId: "10000000-0000-4000-8000-000000000002",
    companyId: "20000000-0000-4000-8000-000000000002",
    jobId: "30000000-0000-4000-8000-000000000002",
    email: "telusur.digital@seed.inklusia.id",
    companyName: "Telusur Digital Indonesia",
    industry: "Teknologi",
    address: "Jl. Asia Afrika No. 8, Bandung",
    title: "Staf Entri Data",
    description:
      "Mengolah data pelanggan ke sistem internal. Meja dan jalur kantor ramah kursi roda, dengan toilet aksesibel di tiap lantai.",
    requirements:
      "Teliti, menguasai spreadsheet dasar, dan mampu bekerja dengan target harian yang wajar.",
    disabilityFriendlyType: "daksa",
    location: "Bandung",
    jobType: "penuh_waktu",
    createdAt: "2026-09-07T09:30:00.000Z",
  },
  {
    userId: "10000000-0000-4000-8000-000000000003",
    companyId: "20000000-0000-4000-8000-000000000003",
    jobId: "30000000-0000-4000-8000-000000000003",
    email: "suara.setara@seed.inklusia.id",
    companyName: "Suara Setara Media",
    industry: "Media",
    address: "Kantor virtual — seluruh Indonesia",
    title: "Penulis Konten",
    description:
      "Menulis artikel dan salinan kampanye dari rumah. Dokumen kerja tersedia dalam format yang kompatibel dengan pembaca layar.",
    requirements:
      "Portofolio tulisan, mampu riset mandiri, dan nyaman berkolaborasi lewat dokumen bersama.",
    disabilityFriendlyType: "netra",
    location: "Remote — seluruh Indonesia",
    jobType: "kontrak",
    createdAt: "2026-09-06T04:15:00.000Z",
  },
  {
    userId: "10000000-0000-4000-8000-000000000004",
    companyId: "20000000-0000-4000-8000-000000000004",
    jobId: "30000000-0000-4000-8000-000000000004",
    email: "karya.inklusif@seed.inklusia.id",
    companyName: "Karya Inklusif Teknologi",
    industry: "Teknologi",
    address: "Jl. Thamrin No. 12, Jakarta Pusat",
    title: "Software Engineer (Frontend)",
    description:
      "Membangun antarmuka web dengan fokus aksesibilitas. Lingkungan kerja mendukung jadwal terstruktur bagi rekan neurodivergent.",
    requirements:
      "Pengalaman React atau Next.js, peduli aksesibilitas web, dan mampu bekerja dalam tim kecil.",
    disabilityFriendlyType: "autisme",
    location: "Jakarta Pusat",
    jobType: "penuh_waktu",
    createdAt: "2026-09-05T11:00:00.000Z",
  },
  {
    userId: "10000000-0000-4000-8000-000000000005",
    companyId: "20000000-0000-4000-8000-000000000005",
    jobId: "30000000-0000-4000-8000-000000000005",
    email: "gudang.berkah@seed.inklusia.id",
    companyName: "Gudang Berkah Logistik",
    industry: "Logistik",
    address: "Kawasan Industri Rungkut, Surabaya",
    title: "Asisten Administrasi Gudang",
    description:
      "Membantu pencatatan barang masuk dan keluar. Tugas dapat disesuaikan, dengan mentor di tempat selama tiga bulan pertama.",
    requirements:
      "Mampu mengikuti instruksi tertulis dan lisan, teliti mencatat angka, dan siap shift pagi.",
    disabilityFriendlyType: "intelektual",
    location: "Surabaya",
    jobType: "paruh_waktu",
    createdAt: "2026-09-04T02:45:00.000Z",
  },
  {
    userId: "10000000-0000-4000-8000-000000000006",
    companyId: "20000000-0000-4000-8000-000000000006",
    jobId: "30000000-0000-4000-8000-000000000006",
    email: "studio.warna@seed.inklusia.id",
    companyName: "Studio Warna Setara",
    industry: "Desain",
    address: "Jl. Kaliurang Km. 5, Yogyakarta",
    title: "Desainer Grafis",
    description:
      "Membuat materi visual untuk klien UMKM. Brief dan umpan balik disampaikan secara tertulis agar mudah diikuti.",
    requirements:
      "Menguasai Figma atau Adobe, portofolio desain, dan mampu memenuhi tenggat yang disepakati.",
    disabilityFriendlyType: "tuli",
    location: "Yogyakarta",
    jobType: "lepas",
    createdAt: "2026-09-03T07:20:00.000Z",
  },
  {
    userId: "10000000-0000-4000-8000-000000000007",
    companyId: "20000000-0000-4000-8000-000000000007",
    jobId: "30000000-0000-4000-8000-000000000007",
    email: "wira.karya@seed.inklusia.id",
    companyName: "PT Wira Karya Negara",
    industry: "BUMN",
    address: "Jl. Pahlawan No. 1, Semarang",
    title: "Staf Akuntansi Junior",
    description:
      "Membantu rekonsiliasi dan pelaporan bulanan. Kantor BUMN dengan kuota disabilitas aktif dan pendampingan HRD.",
    requirements:
      "Lulusan D3/S1 akuntansi, teliti, dan menguasai Excel tingkat menengah.",
    disabilityFriendlyType: "semua",
    location: "Semarang",
    jobType: "penuh_waktu",
    createdAt: "2026-09-02T01:00:00.000Z",
  },
  {
    userId: "10000000-0000-4000-8000-000000000008",
    companyId: "20000000-0000-4000-8000-000000000008",
    jobId: "30000000-0000-4000-8000-000000000008",
    email: "rumah.kopi@seed.inklusia.id",
    companyName: "Rumah Kopi Inklusi",
    industry: "F&B",
    address: "Jl. Margonda Raya No. 45, Depok",
    title: "Magang Layanan Pelanggan",
    description:
      "Program magang tiga bulan dengan mentor. Cocok untuk kandidat yang baru memulai karier di lingkungan ramah disabilitas.",
    requirements:
      "Bersedia belajar, komunikasi ramah, dan dapat bekerja 20 jam per minggu.",
    disabilityFriendlyType: "daksa",
    location: "Depok",
    jobType: "magang",
    createdAt: "2026-09-01T10:10:00.000Z",
  },
  {
    userId: "10000000-0000-4000-8000-000000000008",
    companyId: "20000000-0000-4000-8000-000000000008",
    jobId: "30000000-0000-4000-8000-000000000009",
    email: "rumah.kopi@seed.inklusia.id",
    companyName: "Rumah Kopi Inklusi",
    industry: "F&B",
    address: "Jl. Margonda Raya No. 45, Depok",
    title: "Kasir Shift Malam (ditutup)",
    description:
      "Lowongan contoh yang sudah ditutup. Tidak boleh tampil di daftar publik.",
    requirements: "Pengalaman kasir minimal satu tahun.",
    disabilityFriendlyType: "semua",
    location: "Depok",
    jobType: "paruh_waktu",
    createdAt: "2026-08-20T10:00:00.000Z",
    isActive: false,
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const job of SEED_JOBS) {
      await client.query(
        `
        INSERT INTO users (id, email, password_hash, role)
        VALUES ($1, $2, 'seed', 'company')
        ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email
        `,
        [job.userId, job.email],
      );

      await client.query(
        `
        INSERT INTO company_profiles (
          id, user_id, company_name, address, industry, nib,
          contact_person_name, contact_person_position,
          contact_person_phone, contact_person_email
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          company_name = EXCLUDED.company_name,
          address = EXCLUDED.address,
          industry = EXCLUDED.industry,
          nib = EXCLUDED.nib,
          contact_person_name = EXCLUDED.contact_person_name,
          contact_person_position = EXCLUDED.contact_person_position,
          contact_person_phone = EXCLUDED.contact_person_phone,
          contact_person_email = EXCLUDED.contact_person_email
        `,
        [
          job.companyId,
          job.userId,
          job.companyName,
          job.address,
          job.industry,
          `9123456789${job.companyId.slice(-3)}`,
          "Tim Rekrutmen",
          "HRD",
          "0215550000",
          job.email,
        ],
      );

      await client.query(
        `
        INSERT INTO jobs (
          id, company_id, title, description, requirements,
          disability_friendly_type, location, job_type, is_active, created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          requirements = EXCLUDED.requirements,
          disability_friendly_type = EXCLUDED.disability_friendly_type,
          location = EXCLUDED.location,
          job_type = EXCLUDED.job_type,
          is_active = EXCLUDED.is_active,
          created_at = EXCLUDED.created_at
        `,
        [
          job.jobId,
          job.companyId,
          job.title,
          job.description,
          job.requirements,
          job.disabilityFriendlyType,
          job.location,
          job.jobType,
          job.isActive ?? true,
          job.createdAt,
        ],
      );
    }

    await client.query(
      `
      INSERT INTO users (id, email, password_hash, role)
      VALUES ($1, $2, 'seed', 'job_seeker')
      ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email
      `,
      [DEV_JOB_SEEKER_USER_ID, "sari.wulandari@contoh.inklusia.id"],
    );

    const rootPasswordHash = hashPassword(ROOT_ADMIN_PASSWORD);

    await client.query(
      `
      INSERT INTO users (
        id, email, password_hash, role, is_root_admin, full_name, status
      )
      VALUES ($1, $2, $3, 'admin', TRUE, 'Root Inklusia', 'aktif')
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        password_hash = EXCLUDED.password_hash,
        role = EXCLUDED.role,
        is_root_admin = EXCLUDED.is_root_admin,
        full_name = EXCLUDED.full_name,
        status = EXCLUDED.status,
        updated_at = NOW()
      `,
      [DEV_ADMIN_USER_ID, ROOT_ADMIN_EMAIL, rootPasswordHash],
    );

    await client.query(
      `
      INSERT INTO job_seeker_profiles (
        id, user_id, full_name, phone, address, disability_type, bio, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        address = EXCLUDED.address,
        disability_type = EXCLUDED.disability_type,
        bio = EXCLUDED.bio,
        updated_at = EXCLUDED.updated_at
      `,
      [
        DEV_JOB_SEEKER_PROFILE_ID,
        DEV_JOB_SEEKER_USER_ID,
        "Sari Wulandari",
        "0812-3456-7890",
        "Jl. Melati No. 14, Jakarta Selatan",
        "tuli",
        "Saya nyaman bekerja lewat teks dan siap belajar sistem baru. Fokus saya adalah layanan pelanggan dan administrasi yang rapi.",
        "2026-09-10T09:00:00.000Z",
      ],
    );

    await client.query("COMMIT");
    console.log(
      `Seed ${SEED_JOBS.length} lowongan contoh selesai (${SEED_JOBS.filter((job) => job.isActive !== false).length} aktif).`,
    );
    console.log("Seed profil pencari kerja Sari Wulandari selesai.");
    console.log(`Seed root admin ${ROOT_ADMIN_EMAIL} selesai.`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

try {
  await seed();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
