import pg from "pg";
import { databaseUrl, isProduction, jwtSecret, port } from "../config/env.js";

pg.types.setTypeParser(1082, (value: string) => value);

export { jwtSecret, port };

function sslForDatabaseUrl(url: string): boolean | { rejectUnauthorized: boolean } | undefined {
  try {
    const parsed = new URL(url);
    const sslMode = parsed.searchParams.get("sslmode");
    const hostname = parsed.hostname;
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1";

    if (sslMode === "disable" || isLocal) {
      return undefined;
    }

    if (
      sslMode === "require" ||
      sslMode === "no-verify" ||
      hostname.endsWith(".railway.app") ||
      hostname.endsWith(".rlwy.net") ||
      hostname.endsWith(".railway.internal")
    ) {
      return { rejectUnauthorized: false };
    }

    return undefined;
  } catch {
    return undefined;
  }
}

export const pool = new pg.Pool({
  connectionString: databaseUrl,
  ssl: sslForDatabaseUrl(databaseUrl),
  max: Number.parseInt(process.env.DATABASE_POOL_MAX ?? "10", 10),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

// Error pada koneksi idle tidak boleh menjatuhkan proses.
pool.on("error", (error) => {
  console.error("[db] koneksi idle bermasalah", isProduction ? error.message : error);
});
