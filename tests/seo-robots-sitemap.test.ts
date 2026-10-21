import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import robots from "../src/app/robots";
import { middleware } from "../src/middleware";
import { NextRequest } from "next/server";
import { siteMetadata, getSiteMetadata } from "../src/lib/seo";
import { metadata as homeMetadata } from "../src/app/page";
import { metadata as aboutMetadata } from "../src/app/about/page";
import { metadata as teamMetadata } from "../src/app/team/page";
import { metadata as contactMetadata } from "../src/app/contact/page";
import { metadata as updatesMetadata } from "../src/app/updates/page";
import { metadata as privacyMetadata } from "../src/app/privacy/page";
import { metadata as termsMetadata } from "../src/app/terms/page";
import { metadata as loginMetadata } from "../src/app/(Auth)/login/layout";
import { metadata as signupMetadata } from "../src/app/(Auth)/signup/layout";
import { metadata as forgotMetadata } from "../src/app/(Auth)/forgot/layout";
import { metadata as resetMetadata } from "../src/app/(Auth)/reset/layout";
import { metadata as verifyMetadata } from "../src/app/(Auth)/verify/layout";

describe("SEO, Robots.txt, Sitemap & Canonical Suite", () => {
  // 1. Robots.txt configuration
  test("1. robots.txt provides valid rules, allows public and authentication rendering, disallows private routes, and references sitemap", () => {
    delete process.env.NEXT_PUBLIC_PRE_LAUNCH;
    const rulesConfig = robots();

    // Verify Sitemap reference on canonical production domain
    assert.equal(rulesConfig.sitemap, "https://www.sigsignature.com/sitemap.xml");

    const rules = Array.isArray(rulesConfig.rules) ? rulesConfig.rules : [rulesConfig.rules];
    assert.ok(rules.length >= 1, "Must contain at least one user-agent rule");

    const wildcardRule = rules.find((r) => r.userAgent === "*");
    assert.ok(wildcardRule, "Must have rules for userAgent: *");

    // Check allowed paths
    const allowed = Array.isArray(wildcardRule.allow) ? wildcardRule.allow : [wildcardRule.allow || ""];
    assert.ok(allowed.includes("/"), "Must allow root /");
    assert.ok(allowed.includes("/about"), "Must allow /about");
    assert.ok(allowed.includes("/team"), "Must allow /team");
    assert.ok(allowed.includes("/contact"), "Must allow /contact");
    assert.ok(allowed.includes("/updates"), "Must allow /updates");
    assert.ok(allowed.includes("/terms"), "Must allow /terms");
    assert.ok(allowed.includes("/privacy"), "Must allow /privacy");
    assert.ok(allowed.includes("/login"), "Must allow /login");
    assert.ok(allowed.includes("/signup"), "Must allow /signup");
    assert.ok(allowed.includes("/forgot"), "Must allow /forgot");

    // Check that assets needed for rendering are allowed
    assert.ok(allowed.includes("/_next/static/"), "Must allow /_next/static/ for CSS/JS");
    assert.ok(allowed.includes("/_next/image"), "Must allow /_next/image for Next.js image optimization");
    assert.ok(allowed.includes("/favicon.ico"), "Must allow favicon");

    // Check disallowed private/token-based paths
    const disallowed = Array.isArray(wildcardRule.disallow) ? wildcardRule.disallow : [wildcardRule.disallow || ""];
    assert.ok(disallowed.includes("/dashboard"), "Must disallow /dashboard");
    assert.ok(disallowed.includes("/signatures"), "Must disallow /signatures");
    assert.ok(disallowed.includes("/team-signatures"), "Must disallow /team-signatures");
    assert.ok(disallowed.includes("/design-studio"), "Must disallow /design-studio");
    assert.ok(disallowed.includes("/settings"), "Must disallow /settings");
    assert.ok(disallowed.includes("/help"), "Must disallow /help");
    assert.ok(disallowed.includes("/s/"), "Must disallow /s/ (saved/preview signatures)");
    assert.ok(disallowed.includes("/reset"), "Must disallow /reset (token-dependent)");
    assert.ok(disallowed.includes("/verify"), "Must disallow /verify (token-dependent)");
    assert.ok(!disallowed.includes("/login"), "Must NOT disallow /login");
    assert.ok(!disallowed.includes("/signup"), "Must NOT disallow /signup");
    assert.ok(!disallowed.includes("/forgot"), "Must NOT disallow /forgot");
  });

  // 2. Pre-launch robots blocking
  test("2. robots.txt strictly disallows all crawling when NEXT_PUBLIC_PRE_LAUNCH=true", () => {
    process.env.NEXT_PUBLIC_PRE_LAUNCH = "true";
    try {
      const preLaunchRobots = robots();
      const rules = Array.isArray(preLaunchRobots.rules) ? preLaunchRobots.rules[0] : preLaunchRobots.rules;
      assert.equal(rules.disallow, "/", "Pre-launch mode must disallow / for all crawlers");
    } finally {
      delete process.env.NEXT_PUBLIC_PRE_LAUNCH;
    }
  });

  // 3. Sitemap.xml follows Puzzroo XML theme, namespaces, section comments, and working canonical pages
  test("3. sitemap.xml strictly follows the Puzzroo XML theme, schema, comments, authentication pages, and canonical URLs", () => {
    const sitemapPath = path.resolve(__dirname, "../public/sitemap.xml");
    assert.ok(fs.existsSync(sitemapPath), "public/sitemap.xml must exist");

    const xml = fs.readFileSync(sitemapPath, "utf-8");

    // Verify XML declaration and schema definitions
    assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), "Must start with XML declaration");
    assert.ok(xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'), "Must include standard sitemaps schema");
    assert.ok(xml.includes('xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'), "Must include xsi schema namespace");
    assert.ok(
      xml.includes('xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"'),
      "Must include xsi:schemaLocation reference"
    );

    // Verify Puzzroo-style section comments
    assert.ok(xml.includes("<!-- Homepage - Highest Priority -->"), "Must have Homepage section comment");
    assert.ok(xml.includes("<!-- Authentication Pages -->"), "Must have Authentication Pages section comment");
    assert.ok(xml.includes("<!-- Information Pages -->"), "Must have Information Pages section comment");
    assert.ok(xml.includes("<!-- Legal Pages -->"), "Must have Legal Pages section comment");

    // Extract all <loc> values
    const locMatches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    assert.equal(locMatches.length, 10, "Sitemap must contain exactly 10 public URLs");

    const expectedPages = [
      "https://www.sigsignature.com/",
      "https://www.sigsignature.com/login",
      "https://www.sigsignature.com/signup",
      "https://www.sigsignature.com/forgot",
      "https://www.sigsignature.com/about",
      "https://www.sigsignature.com/team",
      "https://www.sigsignature.com/contact",
      "https://www.sigsignature.com/updates",
      "https://www.sigsignature.com/privacy",
      "https://www.sigsignature.com/terms",
    ];

    for (const expected of expectedPages) {
      assert.ok(locMatches.includes(expected), `Sitemap must include loc: ${expected}`);
    }

    // Verify lastmod matches YYYY-MM-DD date format
    const lastmodMatches = [...xml.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].map((m) => m[1]);
    assert.equal(lastmodMatches.length, 10, "Every entry must have a lastmod");
    for (const dateStr of lastmodMatches) {
      assert.match(dateStr, /^\d{4}-\d{2}-\d{2}$/, `lastmod must strictly follow YYYY-MM-DD: ${dateStr}`);
    }

    // Assert NO private routes or token pages exist in sitemap
    assert.ok(!locMatches.some((u) => u.includes("dashboard")), "Must not include dashboard");
    assert.ok(!locMatches.some((u) => u.includes("signatures")), "Must not include signatures");
    assert.ok(!locMatches.some((u) => u.includes("design-studio")), "Must not include design-studio");
    assert.ok(!locMatches.some((u) => u.includes("/s/")), "Must not include /s/");
    assert.ok(!locMatches.some((u) => u.includes("reset")), "Must not include reset");
    assert.ok(!locMatches.some((u) => u.includes("verify")), "Must not include verify");
    assert.ok(!locMatches.some((u) => u.includes("forgot-password")), "Must not include redirects");
  });

  // 4. Pre-launch and Launch Header Controls via Middleware
  test("4. Middleware emits X-Robots-Tag: noindex on temporary domains and private routes, but NOT on public production pages or auth pages", () => {
    delete process.env.NEXT_PUBLIC_PRE_LAUNCH;

    // Case A: Temporary staging domain (sigsignature.vercel.app)
    const vercelReq = new NextRequest("https://sigsignature.vercel.app/about", {
      headers: { host: "sigsignature.vercel.app" },
    });
    const vercelRes = middleware(vercelReq);
    assert.equal(
      vercelRes.headers.get("X-Robots-Tag"),
      "noindex, nofollow, noarchive",
      "Temporary staging domain must be marked noindex, nofollow"
    );

    // Case B: Private route on production domain (/dashboard) with session
    const privateReq = new NextRequest("https://www.sigsignature.com/dashboard", {
      headers: {
        host: "www.sigsignature.com",
        cookie: "access_token=valid_token",
      },
    });
    const privateRes = middleware(privateReq);
    assert.equal(
      privateRes.headers.get("X-Robots-Tag"),
      "noindex, nofollow, noarchive",
      "Private dashboard route must be marked noindex"
    );

    // Case C: Token-based auth route on production domain (/reset)
    const resetReq = new NextRequest("https://www.sigsignature.com/reset", {
      headers: { host: "www.sigsignature.com" },
    });
    const resetRes = middleware(resetReq);
    assert.equal(
      resetRes.headers.get("X-Robots-Tag"),
      "noindex, nofollow, noarchive",
      "Token-based reset route must be marked noindex"
    );

    // Case D: Public production page on www.sigsignature.com (/about)
    const publicReq = new NextRequest("https://www.sigsignature.com/about", {
      headers: { host: "www.sigsignature.com" },
    });
    const publicRes = middleware(publicReq);
    assert.equal(
      publicRes.headers.get("X-Robots-Tag"),
      null,
      "Public production page must NOT have noindex header at launch"
    );

    // Case E: Public production root on www.sigsignature.com (/)
    const rootReq = new NextRequest("https://www.sigsignature.com/", {
      headers: { host: "www.sigsignature.com" },
    });
    const rootRes = middleware(rootReq);
    assert.equal(
      rootRes.headers.get("X-Robots-Tag"),
      null,
      "Public root homepage must NOT have noindex header at launch"
    );

    // Case F: Authentication pages on www.sigsignature.com (/login, /signup, /forgot)
    for (const authPath of ["/login", "/signup", "/forgot"]) {
      const authReq = new NextRequest(`https://www.sigsignature.com${authPath}`, {
        headers: { host: "www.sigsignature.com" },
      });
      const authRes = middleware(authReq);
      assert.equal(
        authRes.headers.get("X-Robots-Tag"),
        null,
        `Public auth page ${authPath} must NOT have noindex header at launch`
      );
    }
  });

  // 5. Layout Metadata Canonical & Robots
  test("5. Root layout configures metadataBase, canonical alternates, and indexable robots", () => {
    assert.equal(siteMetadata.metadataBase?.toString(), "https://www.sigsignature.com/");
    assert.equal(siteMetadata.alternates?.canonical, "https://www.sigsignature.com");

    // In production without NEXT_PUBLIC_PRE_LAUNCH, robots must allow indexing
    const robotsMeta = siteMetadata.robots as Record<string, unknown>;
    assert.equal(robotsMeta.index, true);
    assert.equal(robotsMeta.follow, true);

    // In pre-launch mode, robots must disallow indexing
    const preLaunchMeta = getSiteMetadata(true).robots as Record<string, unknown>;
    assert.equal(preLaunchMeta.index, false);
    assert.equal(preLaunchMeta.follow, false);
  });

  // 6. Absolute Canonical URLs on Each Distinct Public Page and Auth Page
  test("6. Every distinct public page and auth page sets its own absolute canonical URL pointing to itself", () => {
    // 1. Homepage
    assert.equal(
      homeMetadata.alternates?.canonical,
      "https://www.sigsignature.com",
      "Homepage canonical must point to https://www.sigsignature.com"
    );

    // 2. About
    assert.equal(
      aboutMetadata.alternates?.canonical,
      "https://www.sigsignature.com/about",
      "About page canonical must point to https://www.sigsignature.com/about"
    );

    // 3. Team
    assert.equal(
      teamMetadata.alternates?.canonical,
      "https://www.sigsignature.com/team",
      "Team page canonical must point to https://www.sigsignature.com/team"
    );

    // 4. Contact
    assert.equal(
      contactMetadata.alternates?.canonical,
      "https://www.sigsignature.com/contact",
      "Contact page canonical must point to https://www.sigsignature.com/contact"
    );

    // 5. Updates
    assert.equal(
      updatesMetadata.alternates?.canonical,
      "https://www.sigsignature.com/updates",
      "Updates page canonical must point to https://www.sigsignature.com/updates"
    );

    // 6. Privacy
    assert.equal(
      privacyMetadata.alternates?.canonical,
      "https://www.sigsignature.com/privacy",
      "Privacy page canonical must point to https://www.sigsignature.com/privacy"
    );

    // 7. Terms
    assert.equal(
      termsMetadata.alternates?.canonical,
      "https://www.sigsignature.com/terms",
      "Terms page canonical must point to https://www.sigsignature.com/terms"
    );

    // 8. Login
    assert.equal(
      loginMetadata.alternates?.canonical,
      "https://www.sigsignature.com/login",
      "Login page canonical must point to https://www.sigsignature.com/login"
    );
    assert.equal((loginMetadata.robots as Record<string, unknown>)?.index, true);

    // 9. Signup
    assert.equal(
      signupMetadata.alternates?.canonical,
      "https://www.sigsignature.com/signup",
      "Signup page canonical must point to https://www.sigsignature.com/signup"
    );
    assert.equal((signupMetadata.robots as Record<string, unknown>)?.index, true);

    // 10. Forgot
    assert.equal(
      forgotMetadata.alternates?.canonical,
      "https://www.sigsignature.com/forgot",
      "Forgot page canonical must point to https://www.sigsignature.com/forgot"
    );
    assert.equal((forgotMetadata.robots as Record<string, unknown>)?.index, true);

    // Non-indexable token flows remain noindex
    assert.equal((resetMetadata.robots as Record<string, unknown>)?.index, false);
    assert.equal((verifyMetadata.robots as Record<string, unknown>)?.index, false);

    // Verify all canonical URLs are mutually distinct
    const canonicals = [
      homeMetadata.alternates?.canonical,
      aboutMetadata.alternates?.canonical,
      teamMetadata.alternates?.canonical,
      contactMetadata.alternates?.canonical,
      updatesMetadata.alternates?.canonical,
      privacyMetadata.alternates?.canonical,
      termsMetadata.alternates?.canonical,
      loginMetadata.alternates?.canonical,
      signupMetadata.alternates?.canonical,
      forgotMetadata.alternates?.canonical,
    ];
    const uniqueCanonicals = new Set(canonicals);
    assert.equal(
      uniqueCanonicals.size,
      10,
      "All 10 public indexable pages must have unique canonical URLs"
    );
  });
});
