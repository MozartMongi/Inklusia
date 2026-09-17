import { fetchAuthMe } from "@/lib/api/auth";
import { INKLUSIA_SESSION_COOKIE } from "@/lib/auth/session-constants";
import type { UserRole } from "@/lib/types/auth";
import { cookies } from "next/headers";

export type AuthSession = {
  role: UserRole;
  isRootAdmin: boolean;
};

const GUEST_SESSION: AuthSession = {
  role: "tamu",
  isRootAdmin: false,
};

async function hasSessionCookie(): Promise<boolean> {
  const store = await cookies();
  return Boolean(store.get(INKLUSIA_SESSION_COOKIE)?.value);
}

/**
 * Membaca peran dari API (`GET /api/auth/me`), bukan dari cookie peran.
 * Tanpa sesi yang sah, pengunjung dianggap tamu — tidak ada default admin
 * atau perusahaan.
 */
export async function fetchCurrentSession(): Promise<AuthSession> {
  if (!(await hasSessionCookie())) {
    return GUEST_SESSION;
  }

  const me = await fetchAuthMe();
  if (!me) {
    return GUEST_SESSION;
  }

  return {
    role: me.role,
    isRootAdmin: me.isRootAdmin,
  };
}

export async function fetchUiSession(): Promise<AuthSession> {
  return fetchCurrentSession();
}

export async function requireCompanySession(): Promise<
  { ok: true; session: AuthSession } | { ok: false; session: AuthSession }
> {
  const session = await fetchCurrentSession();
  if (session.role !== "perusahaan") {
    return { ok: false, session };
  }
  return { ok: true, session };
}

export async function requireAdminSession(): Promise<
  { ok: true; session: AuthSession } | { ok: false; session: AuthSession }
> {
  const session = await fetchCurrentSession();
  if (session.role !== "admin") {
    return { ok: false, session };
  }
  return { ok: true, session };
}

export async function requireJobSeekerSession(): Promise<
  { ok: true; session: AuthSession } | { ok: false; session: AuthSession }
> {
  const session = await fetchCurrentSession();
  if (session.role !== "pencari_kerja") {
    return { ok: false, session };
  }
  return { ok: true, session };
}
