import type { NextConfig } from "next";
import { getSecurityHeaders } from "./src/lib/csp";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sigsignature-prod-assets-2026.s3.ap-southeast-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "cdn2.hubspot.net",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/forgot-password",
        destination: "/forgot",
        permanent: true,
      },
      {
        source: "/reset-password",
        destination: "/reset",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: getSecurityHeaders(),
      },
    ];
  },
};

export default nextConfig;
