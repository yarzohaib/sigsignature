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
      // 301 Redirects for Legacy / Duplicate Guide Slugs
      {
        source: "/help/guides/install-signature-gmail",
        destination: "/help/guides/install-gmail",
        permanent: true,
      },
      {
        source: "/help/guides/add-signature-outlook",
        destination: "/help/guides/install-outlook",
        permanent: true,
      },
      {
        source: "/help/guides/add-outlook",
        destination: "/help/guides/install-outlook",
        permanent: true,
      },
      {
        source: "/help/guides/install-signature-apple-mail",
        destination: "/help/guides/install-apple-mail",
        permanent: true,
      },
      {
        source: "/help/guides/dark-mode-email-signature",
        destination: "/help/guides/dark-mode-optimization",
        permanent: true,
      },
      {
        source: "/help/guides/email-safe-fonts-fallbacks",
        destination: "/help/guides/email-safe-fonts",
        permanent: true,
      },
      {
        source: "/help/guides/customize-brand-colors",
        destination: "/help/guides/customize-colors-themes",
        permanent: true,
      },
      {
        source: "/help/guides/fix-image-sizing-spacing",
        destination: "/help/guides/fix-image-sizing",
        permanent: true,
      },
      {
        source: "/help/guides/upload-logo-headshot-retina",
        destination: "/help/guides/upload-logos-headshots",
        permanent: true,
      },
      {
        source: "/help/guides/social-icons-badges-cta",
        destination: "/help/guides/add-social-icons-ctas",
        permanent: true,
      },
      {
        source: "/help/guides/manage-account-profile-password",
        destination: "/help/guides/manage-account",
        permanent: true,
      },
      {
        source: "/help/guides/upgrade-pro-team-plan",
        destination: "/help/guides/upgrade-pro-plan",
        permanent: true,
      },
      {
        source: "/help/guides/billing-stripe-invoices-payment-methods",
        destination: "/help/guides/manage-billing",
        permanent: true,
      },
      {
        source: "/help/guides/team-workspace-members-roles",
        destination: "/help/guides/team-workspace-management",
        permanent: true,
      },
      {
        source: "/help/guides/create-first-email-signature",
        destination: "/help/guides/create-first-signature",
        permanent: true,
      },
      {
        source: "/help/guides/format-contact-details",
        destination: "/help/guides/add-contact-details",
        permanent: true,
      },
      {
        source: "/help/guides/preview-desktop-mobile-signature",
        destination: "/help/guides/preview-desktop-mobile",
        permanent: true,
      },
      {
        source: "/help/guides/export-html-embed-code",
        destination: "/help/guides/export-html",
        permanent: true,
      },
      {
        source: "/help/guides/install-signature-yahoo-thunderbird",
        destination: "/help/guides/install-webmail",
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
