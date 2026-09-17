import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCRYPT_KEYLEN = 64;

export const MIN_PASSWORD_LENGTH = 8;
/** scrypt berbanding lurus dengan panjang input, jadi batasi agar tidak jadi vektor DoS. */
export const MAX_PASSWORD_LENGTH = 128;

/** Format: scrypt$saltHex$hashHex */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(
  password: string,
  stored: string,
): boolean {
  if (!stored || password.length > MAX_PASSWORD_LENGTH) {
    return false;
  }

  if (!stored.startsWith("scrypt$")) {
    return false;
  }

  const [, salt, expectedHex] = stored.split("$");
  if (!salt || !expectedHex) {
    return false;
  }

  const actual = scryptSync(password, salt, SCRYPT_KEYLEN);
  const expected = Buffer.from(expectedHex, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
