import type { NextConfig } from "next";

function resolveApiOrigin(): string | null {
  const override =
    process.env.ACADEMY_API_ORIGIN || process.env.NEXT_PUBLIC_API_BASE_URL;
  if (override) return override.replace(/\/$/, "");

  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL;
  if (!graphqlUrl) return null;

  try {
    return new URL(graphqlUrl).origin;
  } catch {
    return null;
  }
}

const apiOrigin = resolveApiOrigin();

const nextConfig: NextConfig = {
  images: {
    // Next 16 blocks optimizing images from private/local IPs by default.
    // Local API media lives on localhost:3000 while the app may run on 3001.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      { protocol: "https", hostname: "www.discart.me", pathname: "/uploads/**" },
      { protocol: "https", hostname: "discart.me", pathname: "/uploads/**" },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3000",
        pathname: "/uploads/**",
      },
    ],
  },
  async rewrites() {
    if (!apiOrigin) return [];

    // Proxy media URLs stored as /uploads/... so the Vercel app can serve them.
    // Uploads themselves POST directly to the API host (see uploads.ts) — that
    // requires Nginx CORS for the frontend origin in production.
    return [
      {
        source: "/uploads/:path*",
        destination: `${apiOrigin}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
