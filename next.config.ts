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

    // Same-origin proxy so browser uploads avoid cross-origin preflight.
    // Production Nginx currently only adds CORS on /graphql, not /academy/upload.
    return [
      {
        source: "/academy/upload/:path*",
        destination: `${apiOrigin}/academy/upload/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${apiOrigin}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
