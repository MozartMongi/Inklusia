import type { NextConfig } from "next";

function normalizeApiBase(raw: string | undefined): string {
  let value = (raw ?? "http://localhost:4000").trim().replace(/\/$/, "");
  if (!/^https?:\/\//i.test(value)) {
    value =
      value.startsWith("localhost") || value.startsWith("127.")
        ? `http://${value}`
        : `https://${value}`;
  }
  return value;
}

const apiBase = normalizeApiBase(process.env.API_BASE_URL);

let apiUrl: URL | null = null;
try {
  apiUrl = new URL(apiBase);
} catch {
  apiUrl = null;
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${apiBase}/uploads/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/admin",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/profil",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/profil/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/perusahaan",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/perusahaan/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  images: apiUrl
    ? {
        remotePatterns: [
          {
            protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
            hostname: apiUrl.hostname,
            ...(apiUrl.port ? { port: apiUrl.port } : {}),
            pathname: "/uploads/**",
          },
        ],
      }
    : undefined,
};

export default nextConfig;
