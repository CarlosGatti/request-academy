import type { NextConfig } from "next";

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
};

export default nextConfig;
