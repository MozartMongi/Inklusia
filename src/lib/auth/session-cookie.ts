import { INKLUSIA_ROLE_COOKIE } from "@/lib/auth/session-constants";
import type { UserRole } from "@/lib/types/auth";

export function writeRoleCookie(role: Exclude<UserRole, "tamu">) {
  document.cookie = `${INKLUSIA_ROLE_COOKIE}=${role}; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`;
}

export function clearRoleCookie() {
  document.cookie = `${INKLUSIA_ROLE_COOKIE}=; Path=/; SameSite=Lax; Max-Age=0`;
}
