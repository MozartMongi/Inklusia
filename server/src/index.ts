import { app } from "./app.js";
import { nodeEnv, port } from "./config/env.js";
import { pool } from "./db/pool.js";

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`API Inklusia berjalan di port ${port} (${nodeEnv}).`);
});

// Platform hosting mengirim SIGTERM saat deploy ulang; tutup koneksi dengan rapi
// agar permintaan yang sedang berjalan tidak terputus di tengah jalan.
let shuttingDown = false;

function shutdown(signal: NodeJS.Signals) {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  console.log(`[api] menerima ${signal}, menutup server...`);

  const forceExit = setTimeout(() => {
    console.error("[api] shutdown melebihi batas waktu, keluar paksa.");
    process.exit(1);
  }, 10_000);
  forceExit.unref();

  server.close(() => {
    void pool.end().then(
      () => process.exit(0),
      () => process.exit(1),
    );
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

process.on("unhandledRejection", (reason) => {
  console.error("[api] unhandled rejection", reason);
});
