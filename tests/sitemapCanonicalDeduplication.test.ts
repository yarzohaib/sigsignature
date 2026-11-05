import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { DETAILED_GUIDES, LEGACY_GUIDE_SLUG_REDIRECTS } from "../src/lib/guidesData";

describe("Sitemap & Canonical URL Deduplication Audit", () => {
  const rootDir = path.resolve(__dirname, "..");

  function parsePublicSitemapUrls(): string[] {
    const publicSitemap = fs.readFileSync(path.join(rootDir, "public/sitemap.xml"), "utf-8");
    const matches = [...publicSitemap.matchAll(/<loc>(.*?)<\/loc>/g)];
    return matches.map((m) => m[1]);
  }

  it("public/sitemap.xml contains schema attributes and section comments", () => {
    const publicSitemap = fs.readFileSync(path.join(rootDir, "public/sitemap.xml"), "utf-8");
    assert.ok(
      publicSitemap.includes('xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'),
      "sitemap.xml must have xmlns:xsi"
    );
    assert.ok(
      publicSitemap.includes('xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"'),
      "sitemap.xml must have xsi:schemaLocation"
    );
    assert.ok(
      publicSitemap.includes("<!-- Homepage - Highest Priority -->"),
      "sitemap.xml must contain section comments"
    );
    assert.ok(
      publicSitemap.includes("<!-- Core Product & Conversion Pages -->"),
      "sitemap.xml must contain section comments"
    );
    assert.ok(
      publicSitemap.includes("<!-- Help Center & Documentation -->"),
      "sitemap.xml must contain section comments"
    );
  });

  it("sitemap contains exactly 42 unique URLs with 0 duplicate guides", () => {
    const urls = parsePublicSitemapUrls();

    assert.equal(urls.length, 42, `Expected exactly 42 URLs in sitemap, got ${urls.length}`);
    const uniqueUrls = new Set(urls);
    assert.equal(uniqueUrls.size, 42, "All URLs in sitemap must be unique");
  });

  it("homepage in sitemap matches canonical (no trailing slash)", () => {
    const urls = parsePublicSitemapUrls();

    assert.ok(
      urls.includes("https://www.sigsignature.com"),
      "Sitemap must contain https://www.sigsignature.com without trailing slash"
    );
    assert.ok(
      !urls.includes("https://www.sigsignature.com/"),
      "Sitemap must NOT contain https://www.sigsignature.com/ with trailing slash"
    );

    const publicSitemap = fs.readFileSync(path.join(rootDir, "public/sitemap.xml"), "utf-8");
    assert.ok(
      publicSitemap.includes("<loc>https://www.sigsignature.com</loc>"),
      "public/sitemap.xml must contain https://www.sigsignature.com"
    );
    assert.ok(
      !publicSitemap.includes("<loc>https://www.sigsignature.com/</loc>"),
      "public/sitemap.xml must not contain trailing slash for homepage"
    );
  });

  it("all 17 removed duplicate guide slugs are excluded from sitemap and registered in redirects", () => {
    const urls = parsePublicSitemapUrls();

    const duplicateSlugsToRemove = [
      "install-signature-gmail",
      "add-signature-outlook",
      "add-outlook",
      "install-signature-apple-mail",
      "dark-mode-email-signature",
      "email-safe-fonts-fallbacks",
      "customize-brand-colors",
      "fix-image-sizing-spacing",
      "upload-logo-headshot-retina",
      "social-icons-badges-cta",
      "manage-account-profile-password",
      "upgrade-pro-team-plan",
      "billing-stripe-invoices-payment-methods",
      "team-workspace-members-roles",
      "create-first-email-signature",
      "format-contact-details",
      "preview-desktop-mobile-signature",
    ];

    for (const slug of duplicateSlugsToRemove) {
      assert.ok(
        !urls.includes(`https://www.sigsignature.com/help/guides/${slug}`),
        `Sitemap should NOT contain duplicate slug: ${slug}`
      );
      assert.ok(
        Boolean(LEGACY_GUIDE_SLUG_REDIRECTS[slug]),
        `LEGACY_GUIDE_SLUG_REDIRECTS must redirect duplicate slug: ${slug}`
      );
    }
  });

  it("all 19 canonical guide slugs exist in sitemap", () => {
    const urls = parsePublicSitemapUrls();

    const canonicalSlugs = [
      "create-first-signature",
      "choose-email-signature-template",
      "add-contact-details",
      "preview-desktop-mobile",
      "fix-image-sizing",
      "customize-colors-themes",
      "upload-logos-headshots",
      "email-safe-fonts",
      "dark-mode-optimization",
      "add-social-icons-ctas",
      "install-gmail",
      "install-outlook",
      "export-html",
      "install-apple-mail",
      "install-webmail",
      "manage-account",
      "upgrade-pro-plan",
      "manage-billing",
      "team-workspace-management",
    ];

    for (const slug of canonicalSlugs) {
      assert.ok(
        urls.includes(`https://www.sigsignature.com/help/guides/${slug}`),
        `Sitemap must contain canonical guide: /help/guides/${slug}`
      );
      assert.ok(
        Boolean(DETAILED_GUIDES[slug]),
        `DETAILED_GUIDES must contain canonical guide: ${slug}`
      );
    }
  });

  it("next.config.ts contains 301 redirects for /template and legacy guide slugs", () => {
    const configPath = path.join(rootDir, "next.config.ts");
    const content = fs.readFileSync(configPath, "utf-8");

    assert.ok(content.includes('source: "/template"'), "next.config.ts must redirect /template");
    assert.ok(content.includes('destination: "/templates"'), "next.config.ts must point /template to /templates");
    assert.ok(content.includes('source: "/help/guides/install-signature-gmail"'));
    assert.ok(content.includes('destination: "/help/guides/install-gmail"'));
    assert.ok(content.includes('source: "/help/guides/add-signature-outlook"'));
    assert.ok(content.includes('destination: "/help/guides/install-outlook"'));
    assert.ok(content.includes('source: "/help/guides/add-outlook"'));
  });
});
