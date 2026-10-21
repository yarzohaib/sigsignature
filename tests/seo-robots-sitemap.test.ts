import { test, describe } from "node:test";
import assert from "node:assert/strict";
import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";
import { middleware } from "../src/middleware";
import { NextRequest } from "next/server";
import { siteMetadata, getSiteMetadata } from "../src/lib/seo";

describe("SEO, Robots.txt & Sitemap Suite", () => {
  // 1. Robots.txt configuration
  test("1. robots.txt provides valid rules, allows public rendering, disallows private routes, and references sitemap", () => {
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

    // Check that assets needed for rendering are allowed
    assert.ok(allowed.includes("/_next/static/"), "Must allow /_next/static/ for CSS/JS");
    assert.ok(allowed.includes("/_next/image"), "Must allow /_next/image for Next.js image optimization");
    assert.ok(allowed.includes("/favicon.ico"), "Must allow favicon");

    // Check disallowed private/auth paths
    const disallowed = Array.isArray(wildcardRule.disallow) ? wildcardRule.disallow : [wildcardRule.disallow || ""];
    assert.ok(disallowed.includes("/dashboard"), "Must disallow /dashboard");
    assert.ok(disallowed.includes("/signatures"), "Must disallow /signatures");
    assert.ok(disallowed.includes("/team-signatures"), "Must disallow /team-signatures");
    assert.ok(disallowed.includes("/design-studio"), "Must disallow /design-studio");
    assert.ok(disallowed.includes("/settings"), "Must disallow /settings");
    assert.ok(disallowed.includes("/help"), "Must disallow /help");
    assert.ok(disallowed.includes("/s/"), "Must disallow /s/ (saved/preview signatures)");
    assert.ok(disallowed.includes("/login"), "Must disallow /login");
    assert.ok(disallowed.includes("/signup"), "Must disallow /signup");
    assert.ok(disallowed.includes("/forgot"), "Must disallow /forgot");
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

  // 3. Sitemap.xml canonical public URLs
  test("3. sitemap.xml includes only canonical, working public pages on www.sigsignature.com", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);

    // Assert canonical domain
    for (const url of urls) {
      assert.ok(url.startsWith("https://www.sigsignature.com"), `URL must use production domain: ${url}`);
    }

    // Exactly 7 public canonical pages
    const expectedPages = [
      "https://www.sigsignature.com/",
      "https://www.sigsignature.com/about",
      "https://www.sigsignature.com/team",
      "https://www.sigsignature.com/contact",
      "https://www.sigsignature.com/updates",
      "https://www.sigsignature.com/terms",
      "https://www.sigsignature.com/privacy",
    ];

    assert.equal(urls.length, 7, "Sitemap should contain exactly the 7 public indexable pages");
    for (const expected of expectedPages) {
      assert.ok(urls.includes(expected), `Sitemap must include ${expected}`);
    }

    // Assert NO private routes or redirects exist in sitemap
    assert.ok(!urls.some((u) => u.includes("dashboard")), "Must not include dashboard");
    assert.ok(!urls.some((u) => u.includes("signatures")), "Must not include signatures");
    assert.ok(!urls.some((u) => u.includes("design-studio")), "Must not include design-studio");
    assert.ok(!urls.some((u) => u.includes("/s/")), "Must not include /s/");
    assert.ok(!urls.some((u) => u.includes("login")), "Must not include login");
    assert.ok(!urls.some((u) => u.includes("signup")), "Must not include signup");
    assert.ok(!urls.some((u) => u.includes("forgot")), "Must not include forgot");
    assert.ok(!urls.some((u) => u.includes("forgot-password")), "Must not include redirects");

    // Verify metadata presence
    for (const entry of entries) {
      assert.ok(entry.lastModified instanceof Date, "lastModified must be a Date object");
      assert.ok(typeof entry.changeFrequency === "string", "changeFrequency must be provided");
      assert.ok(typeof entry.priority === "number" && entry.priority > 0 && entry.priority <= 1, "priority must be between 0 and 1");
    }
  });

  // 4. Pre-launch and Launch Header Controls via Middleware
  test("4. Middleware emits X-Robots-Tag: noindex on temporary domains and private routes, but NOT on public production pages", () => {
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

    // Case C: Auth route on production domain (/login)
    const loginReq = new NextRequest("https://www.sigsignature.com/login", {
      headers: { host: "www.sigsignature.com" },
    });
    const loginRes = middleware(loginReq);
    assert.equal(
      loginRes.headers.get("X-Robots-Tag"),
      "noindex, nofollow, noarchive",
      "Auth login route must be marked noindex"
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
  });

  // 5. Layout Metadata Canonical & Robots
  test("5. Root layout configures metadataBase, canonical alternates, and indexable robots", () => {
    assert.equal(siteMetadata.metadataBase?.toString(), "https://www.sigsignature.com/");
    assert.deepEqual(siteMetadata.alternates?.canonical, "./");

    // In production without NEXT_PUBLIC_PRE_LAUNCH, robots must allow indexing
    const robotsMeta = siteMetadata.robots as Record<string, unknown>;
    assert.equal(robotsMeta.index, true);
    assert.equal(robotsMeta.follow, true);

    // In pre-launch mode, robots must disallow indexing
    const preLaunchMeta = getSiteMetadata(true).robots as Record<string, unknown>;
    assert.equal(preLaunchMeta.index, false);
    assert.equal(preLaunchMeta.follow, false);
  });
});
