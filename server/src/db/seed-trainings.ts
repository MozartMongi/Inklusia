/**
 * Seed idempotent katalog pelatihan + contoh pendaftaran pencari kerja.
 */
import { pool } from "./pool.js";
import {
  DEV_JOB_SEEKER_PROFILE_ID,
  DEV_TRAINING_ENROLLMENT_IDS,
  DEV_TRAINING_IDS,
} from "./seed-ids.js";

type SeedTraining = {
  id: string;
  title: string;
  summary: string;
  description: string;
  provider: string;
  format: "daring" | "luring" | "hybrid";
  durationLabel: string;
  skillTags: string[];
  accessibilityNotes: string;
  startsAt: string;
  seatsTotal: number;
  seatsLeft: number;
};

const SEED_TRAININGS: SeedTraining[] = [
  {
    id: DEV_TRAINING_IDS[0],
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
    seatsTotal: 20,
    seatsLeft: 12,
  },
  {
    id: DEV_TRAINING_IDS[1],
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
    seatsTotal: 16,
    seatsLeft: 8,
  },
  {
    id: DEV_TRAINING_IDS[2],
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
    seatsTotal: 20,
    seatsLeft: 15,
  },
  {
    id: DEV_TRAINING_IDS[3],
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
    seatsTotal: 10,
    seatsLeft: 5,
  },
];

async function seedTrainings() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const training of SEED_TRAININGS) {
      await client.query(
        `
        INSERT INTO trainings (
          id, title, summary, description, provider, format,
          duration_label, skill_tags, accessibility_notes, starts_at,
          seats_total, seats_left, is_published
        )
        VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8::text[], $9, $10::timestamptz,
          $11, $12, TRUE
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          summary = EXCLUDED.summary,
          description = EXCLUDED.description,
          provider = EXCLUDED.provider,
          format = EXCLUDED.format,
          duration_label = EXCLUDED.duration_label,
          skill_tags = EXCLUDED.skill_tags,
          accessibility_notes = EXCLUDED.accessibility_notes,
          starts_at = EXCLUDED.starts_at,
          seats_total = EXCLUDED.seats_total,
          seats_left = EXCLUDED.seats_left,
          is_published = TRUE,
          updated_at = NOW()
        `,
        [
          training.id,
          training.title,
          training.summary,
          training.description,
          training.provider,
          training.format,
          training.durationLabel,
          training.skillTags,
          training.accessibilityNotes,
          training.startsAt,
          training.seatsTotal,
          training.seatsLeft,
        ],
      );
    }

    // Contoh pendaftaran untuk profil seed Sari (jika profil ada).
    const profile = await client.query(
      `SELECT id FROM job_seeker_profiles WHERE id = $1 LIMIT 1`,
      [DEV_JOB_SEEKER_PROFILE_ID],
    );

    if (profile.rows[0]) {
      await client.query(
        `
        INSERT INTO training_enrollments (
          id, training_id, job_seeker_profile_id, status, enrolled_at
        )
        VALUES
          ($1, $2, $3, 'berlangsung', '2026-09-01T08:00:00.000Z'),
          ($4, $5, $3, 'terdaftar', '2026-09-10T10:30:00.000Z')
        ON CONFLICT (id) DO UPDATE SET
          status = EXCLUDED.status,
          enrolled_at = EXCLUDED.enrolled_at,
          updated_at = NOW()
        `,
        [
          DEV_TRAINING_ENROLLMENT_IDS[0],
          DEV_TRAINING_IDS[1],
          DEV_JOB_SEEKER_PROFILE_ID,
          DEV_TRAINING_ENROLLMENT_IDS[1],
          DEV_TRAINING_IDS[0],
        ],
      );
    }

    await client.query("COMMIT");
    console.log(
      `Seed ${SEED_TRAININGS.length} pelatihan selesai` +
        (profile.rows[0] ? " (+ 2 pendaftaran contoh)." : "."),
    );
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

try {
  await seedTrainings();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
