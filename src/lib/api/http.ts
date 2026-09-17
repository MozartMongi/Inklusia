import { INKLUSIA_SESSION_COOKIE } from "@/lib/auth/session-constants";

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string | undefined>;

  constructor(
    status: number,
    message: string,
    errors?: Record<string, string | undefined>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function apiOrigin(): string {
  if (typeof window !== "undefined") {
    return "";
  }

  const configured = process.env.API_BASE_URL?.trim().replace(/\/$/, "");
  if (configured) {
    return configured;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("API_BASE_URL wajib disetel di lingkungan production.");
  }

  return "http://localhost:4000";
}

async function serverAccessToken(): Promise<string | null> {
  if (typeof window !== "undefined") {
    return null;
  }

  const { cookies } = await import("next/headers");
  const store = await cookies();
  return store.get(INKLUSIA_SESSION_COOKIE)?.value ?? null;
}

export async function rawApiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  const isFormData =
    typeof FormData !== "undefined" && init.body instanceof FormData;

  if (!isFormData && init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  if (typeof window === "undefined") {
    const token = await serverAccessToken();
    if (token && !headers.has("authorization")) {
      headers.set("authorization", `Bearer ${token}`);
    }
  }

  try {
    return await fetch(`${apiOrigin()}${path}`, {
      ...init,
      headers,
      cache: "no-store",
      credentials: typeof window === "undefined" ? "omit" : "same-origin",
    });
  } catch {
    throw new ApiError(
      502,
      "Layanan data sedang tidak tersedia. Coba lagi nanti.",
    );
  }
}

export function isUnavailableError(error: unknown): boolean {
  return isApiError(error) && (error.status === 502 || error.status === 503);
}

function errorFromBody(status: number, body: unknown): ApiError {
  if (body && typeof body === "object") {
    const record = body as {
      error?: unknown;
      errors?: Record<string, string | undefined>;
    };
    const message =
      typeof record.error === "string"
        ? record.error
        : "Terjadi kesalahan pada server.";
    return new ApiError(status, message, record.errors);
  }

  return new ApiError(status, "Terjadi kesalahan pada server.");
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { error: text };
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await rawApiFetch(path, init);
  const body = await parseBody(response);

  if (!response.ok) {
    throw errorFromBody(response.status, body);
  }

  if (body && typeof body === "object" && "data" in body) {
    return (body as { data: T }).data;
  }

  return body as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: "GET" });
}

export function apiSend<T>(
  path: string,
  method: "POST" | "PATCH" | "PUT" | "DELETE",
  body?: unknown,
): Promise<T> {
  return apiRequest<T>(path, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  return apiRequest<T>(path, { method: "POST", body: formData });
}

export async function apiDownload(
  path: string,
  method: "GET" | "POST" = "POST",
): Promise<{ blob: Blob; fileName: string }> {
  const response = await rawApiFetch(path, { method });
  if (!response.ok) {
    const body = await parseBody(response);
    throw errorFromBody(response.status, body);
  }

  const blob = await response.blob();
  const disposition = response.headers.get("content-disposition") ?? "";
  const match = disposition.match(/filename="([^"]+)"/i);
  return { blob, fileName: match?.[1] ?? "cv-inklusia.pdf" };
}

export function searchQuery(
  record: Record<string, string | string[] | undefined | number | boolean | null>,
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(record)) {
    if (value === undefined || value === null || value === false) {
      continue;
    }
    const next = Array.isArray(value) ? value[0] : String(value);
    if (next) {
      params.set(key, next);
    }
  }

  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}
