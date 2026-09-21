/**
 * Membersihkan data contoh pelatihan seed (katalog sekarang dikelola admin).
 */
import { pool } from "./pool.js";
import {
  DEV_TRAINING_ENROLLMENT_IDS,
  DEV_TRAINING_IDS,
} from "./seed-ids.js";

async function clearSeedTrainings() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `
      DELETE FROM training_enrollments
      WHERE id = ANY($1::uuid[])
         OR training_id = ANY($2::uuid[])
      `,
      [DEV_TRAINING_ENROLLMENT_IDS, DEV_TRAINING_IDS],
    );

    const deleted = await client.query(
      `
      DELETE FROM trainings
      WHERE id = ANY($1::uuid[])
      RETURNING id
      `,
      [DEV_TRAINING_IDS],
    );

    await client.query("COMMIT");
    console.log(
      `Data contoh pelatihan dibersihkan (${deleted.rowCount ?? 0} pelatihan).`,
    );
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

try {
  await clearSeedTrainings();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
