import {
  INKLUSIA_ROLE_COOKIE,
  INKLUSIA_ROLE_HEADER,
} from "@/lib/auth/session-constants";
import { cookies, headers } from "next/headers";
import { isUserRole, type UserRole } from "@/lib/types/auth";

export { INKLUSIA_ROLE_COOKIE, INKLUSIA_ROLE_HEADER };

/**
 * Header diisi proxy dari ?peran= sampai login JWT terhubung.
 * Cookie opsional dengan nama yang sama untuk sesi tiruan.
 * Tanpa keduanya, sesi dianggap akun perusahaan (untuk ruang perusahaan).
 */
export type AuthSession = {
  role: UserRole;
};

async function readSessionRole(): Promise<UserRole | null> {
  const headerStore = await headers();
  const fromHeader = headerStore.get(INKLUSIA_ROLE_HEADER);
  if (fromHeader && isUserRole(fromHeader)) {
    return fromHeader;
  }

  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(INKLUSIA_ROLE_COOKIE)?.value;
  if (fromCookie && isUserRole(fromCookie)) {
    return fromCookie;
  }

  return null;
}

/**
 * Kontrak yang diasumsikan: GET /api/me → { data: { role: UserRole } }
 */
export async function fetchCurrentSession(): Promise<AuthSession> {
  const role = await readSessionRole();
  return { role: role ?? "perusahaan" };
}

/**
 * Sesi untuk chrome UI (header). Tanpa cookie/header dianggap tamu.
 */
export async function fetchUiSession(): Promise<AuthSession> {
  const role = await readSessionRole();
  return { role: role ?? "tamu" };
}

export async function requireCompanySession(): Promise<
  | { ok: true; session: AuthSession }
  | { ok: false; session: AuthSession }
> {
  const session = await fetchCurrentSession();
  if (session.role !== "perusahaan") {
    return { ok: false, session };
  }
  return { ok: true, session };
}

/**
 * Tanpa cookie/header, stub frontend menganggap sesi admin
 * (mirip default perusahaan di ruang perusahaan).
 */
export async function requireAdminSession(): Promise<
  | { ok: true; session: AuthSession }
  | { ok: false; session: AuthSession }
> {
  const role = await readSessionRole();
  const session: AuthSession = { role: role ?? "admin" };
  if (session.role !== "admin") {
    return { ok: false, session };
  }
  return { ok: true, session };
}
