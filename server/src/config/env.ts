import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const serverRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

config({ path: path.join(serverRoot, ".env") });

export const nodeEnv = process.env.NODE_ENV ?? "development";
export const isProduction = nodeEnv === "production";

const problems: string[] = [];

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    problems.push(`${name} belum disetel.`);
    return "";
  }
  return value;
}

/** Nilai wajib di production, boleh memakai default saat pengembangan lokal. */
function requiredInProduction(name: string, developmentFallback: string): string {
  const value = process.env[name]?.trim();
  if (value) {
    return value;
  }
  if (isProduction) {
    problems.push(`${name} wajib disetel di lingkungan production.`);
    return "";
  }
  return developmentFallback;
}

export const databaseUrl = required("DATABASE_URL");

export const jwtSecret = requiredInProduction(
  "JWT_SECRET",
  "pengembangan-lokal-inklusia-jwt-secret",
);

if (isProduction && jwtSecret.length < 32) {
  problems.push("JWT_SECRET minimal 32 karakter di lingkungan production.");
}

export const port = Number.parseInt(process.env.PORT ?? "4000", 10);
if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  problems.push("PORT harus berupa nomor port yang valid.");
}

/**
 * Daftar origin frontend yang boleh memanggil API, dipisah koma.
 * Tanpa allowlist, browser lain tetap diblokir oleh CORS.
 */
export const allowedOrigins = (
  process.env.CORS_ALLOWED_ORIGINS ??
  (isProduction ? "" : "http://localhost:3000,http://localhost:3001")
)
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

if (isProduction && allowedOrigins.length === 0) {
  problems.push(
    "CORS_ALLOWED_ORIGINS wajib disetel di production (mis. https://inklusia.id).",
  );
}

/** Alamat publik frontend, dipakai untuk menyusun tautan reset kata sandi. */
export const appBaseUrl = (
  process.env.APP_BASE_URL ?? allowedOrigins[0] ?? "http://localhost:3000"
).replace(/\/$/, "");

/**
 * Jumlah proxy tepercaya di depan API (Railway/Vercel/Nginx = 1).
 * Wajib benar agar rate limit membaca IP asli, bukan IP proxy.
 */
export const trustProxyHops = Number.parseInt(
  process.env.TRUST_PROXY_HOPS ?? (isProduction ? "1" : "0"),
  10,
);

/** Kosong berarti pengiriman email belum aktif. */
export const smtpUrl = process.env.SMTP_URL?.trim() ?? "";
export const mailFromAddress =
  process.env.MAIL_FROM?.trim() || "Inklusia <no-reply@inklusia.id>";

if (problems.length > 0) {
  throw new Error(
    [
      "Konfigurasi environment belum lengkap:",
      ...problems.map((problem) => `  - ${problem}`),
      "Salin server/.env.example menjadi server/.env lalu lengkapi nilainya.",
    ].join("\n"),
  );
}
