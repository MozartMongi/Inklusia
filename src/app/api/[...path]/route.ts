import { INKLUSIA_SESSION_COOKIE } from "@/lib/auth/session-constants";
import { NextRequest, NextResponse } from "next/server";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function apiBaseUrl(): string {
  const configured = process.env.API_BASE_URL?.trim().replace(/\/$/, "");
  if (configured) {
    if (/^https?:\/\//i.test(configured)) {
      return configured;
    }
    return configured.startsWith("localhost") || configured.startsWith("127.")
      ? `http://${configured}`
      : `https://${configured}`;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("API_BASE_URL wajib disetel di lingkungan production.");
  }
  return "http://localhost:4000";
}

function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

function isAuthLogin(path: string[]) {
  return path.length === 2 && path[0] === "auth" && path[1] === "login";
}

function isAuthLogout(path: string[]) {
  return path.length === 2 && path[0] === "auth" && path[1] === "logout";
}

const SAFE_SEGMENT = /^[A-Za-z0-9._-]+$/;

function isSafeApiPath(path: string[]) {
  return (
    path.length > 0 &&
    path.length <= 10 &&
    path.every((segment) => SAFE_SEGMENT.test(segment))
  );
}

function clearLegacyRoleCookie(response: NextResponse) {
  response.cookies.set("inklusia-role", "", {
    path: "/",
    maxAge: 0,
  });
}

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  if (!isSafeApiPath(path)) {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const target = `${apiBaseUrl()}/api/${path.join("/")}${request.nextUrl.search}`;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }
  const accept = request.headers.get("accept");
  if (accept) {
    headers.set("accept", accept);
  }

  const token = request.cookies.get(INKLUSIA_SESSION_COOKIE)?.value;
  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  const method = request.method.toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? Buffer.from(await request.arrayBuffer()) : undefined;

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method,
      headers,
      body,
      redirect: "manual",
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { error: "Layanan API sedang tidak tersedia. Coba lagi nanti." },
      { status: 502 },
    );
  }

  if (isAuthLogout(path)) {
    const response = NextResponse.json({ data: { ok: true } });
    response.cookies.set(INKLUSIA_SESSION_COOKIE, "", {
      ...sessionCookieOptions(),
      maxAge: 0,
    });
    clearLegacyRoleCookie(response);
    return response;
  }

  const upstreamType = upstream.headers.get("content-type") ?? "";
  if (
    upstreamType.includes("application/pdf") ||
    upstreamType.includes("application/octet-stream")
  ) {
    const responseHeaders = new Headers();
    responseHeaders.set("content-type", upstreamType);
    const disposition = upstream.headers.get("content-disposition");
    if (disposition) {
      responseHeaders.set("content-disposition", disposition);
    }
    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  }

  const text = await upstream.text();
  const payload: unknown = text ? tryJson(text) : null;

  if (isAuthLogin(path) && upstream.ok && payload && typeof payload === "object") {
    const data = (payload as { data?: { accessToken?: unknown } }).data;
    if (data && typeof data.accessToken === "string") {
      const accessToken = data.accessToken;
      delete data.accessToken;
      const loginResponse = NextResponse.json(payload, {
        status: upstream.status,
      });
      loginResponse.cookies.set(
        INKLUSIA_SESSION_COOKIE,
        accessToken,
        sessionCookieOptions(),
      );
      clearLegacyRoleCookie(loginResponse);
      return loginResponse;
    }
  }

  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "content-type": upstreamType.includes("application/json")
        ? "application/json; charset=utf-8"
        : upstreamType || "application/json; charset=utf-8",
    },
  });
}

function tryJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
