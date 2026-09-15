import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCRYPT_KEYLEN = 64;

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
  if (!stored) {
    return false;
  }

  if (stored.startsWith("scrypt$")) {
    const [, salt, expectedHex] = stored.split("$");
    if (!salt || !expectedHex) {
      return false;
    }
    const actual = scryptSync(password, salt, SCRYPT_KEYLEN);
    const expected = Buffer.from(expectedHex, "hex");
    return (
      actual.length === expected.length && timingSafeEqual(actual, expected)
    );
  }

  // Seed lama memakai string polos "seed" — hanya cocok untuk data contoh lokal.
  if (stored === "seed") {
    return password === "seed";
  }

  return false;
}
