import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
config({ path: path.join(serverRoot, ".env") });

pg.types.setTypeParser(1082, (value: string) => value);

const databaseUrl = process.env.DATABASE_URL;
export const port = Number(process.env.PORT ?? 4000);

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL belum disetel. Salin server/.env.example menjadi server/.env.",
  );
}

const configuredJwtSecret = process.env.JWT_SECRET;
if (!configuredJwtSecret && process.env.NODE_ENV === "production") {
  throw new Error(
    "JWT_SECRET belum disetel. Salin server/.env.example menjadi server/.env.",
  );
}

export const jwtSecret: string =
  configuredJwtSecret ?? "dev-inklusia-local-jwt-secret-change-me";
export const pool = new pg.Pool({ connectionString: databaseUrl });
