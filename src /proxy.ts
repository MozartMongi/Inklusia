import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const INKLUSIA_ROLE_HEADER = "x-inklusia-role";

export function proxy(request: NextRequest) {
  const peran = request.nextUrl.searchParams.get("peran");
  if (!peran) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(INKLUSIA_ROLE_HEADER, peran);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/perusahaan",
    "/perusahaan/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
