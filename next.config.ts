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
        hostname: "*.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/template",
        destination: "/templates",
        permanent: true,
      },
      {
        source: "/forgot",
        destination: "/forgot-password",
        permanent: true,
      },
      {
        source: "/reset-password",
        destination: "/reset",
        permanent: true,
      },
      {
        source: "/verify-email",
        destination: "/verify",
        permanent: true,
      },
      {
        source: "/unsubscribe",
        destination: "/privacy",
        permanent: true,
      },
      {
        source: "/usecase",
        destination: "/use-cases",
        permanent: true,
      },
      {
        source: "/use-case",
        destination: "/use-cases",
        permanent: true,
      },
      {
        source: "/usecases",
        destination: "/use-cases",
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
