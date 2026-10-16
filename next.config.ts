import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sigsignature-assets-prod.s3.ap-southeast-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
