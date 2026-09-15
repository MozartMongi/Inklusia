import { createHmac, timingSafeEqual } from "node:crypto";
import { jwtSecret } from "../db/pool.js";
import type { AuthUser } from "./users.repository.js";

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

type AccessTokenPayload = {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

function encodeJson(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function decodeJson<T>(value: string): T | null {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

function signPayload(data: string): string {
  return createHmac("sha256", jwtSecret).update(data).digest("base64url");
}

function signaturesMatch(actual: string, expected: string): boolean {
  const left = Buffer.from(actual);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function signAccessToken(user: Pick<AuthUser, "id" | "email" | "role">): string {
  const now = Math.floor(Date.now() / 1000);
  const header = encodeJson({ alg: "HS256", typ: "JWT" });
  const payload = encodeJson({
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  } satisfies AccessTokenPayload);
  const data = `${header}.${payload}`;
  return `${data}.${signPayload(data)}`;
}

export function verifyAccessToken(token: string): { userId: string } | null {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  const [header, payload, signature] = parts;
  const data = `${header}.${payload}`;
  if (!signaturesMatch(signature, signPayload(data))) {
    return null;
  }

  const body = decodeJson<AccessTokenPayload>(payload);
  if (!body?.sub || typeof body.exp !== "number") {
    return null;
  }

  if (body.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return { userId: body.sub };
}
