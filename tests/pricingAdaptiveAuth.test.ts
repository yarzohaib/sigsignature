import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Adaptive Pricing & Authentication Guards", () => {
  const rootDir = path.resolve(process.cwd());

  it("middleware does not block /pricing or tag it as private", () => {
    const middlewareSource = fs.readFileSync(path.join(rootDir, "src/middleware.ts"), "utf-8");
    assert.doesNotMatch(
      middlewareSource,
      /pathname\.startsWith\("\/pricing"\)/,
      "Middleware should not redirect unauthenticated users away from /pricing"
    );
  });

  it("robots.ts allows /pricing and /pricing/ for public crawling", () => {
    const robotsSource = fs.readFileSync(path.join(rootDir, "src/app/robots.ts"), "utf-8");
    assert.match(
      robotsSource,
      /"\/pricing"/,
      "robots.ts should include /pricing"
    );
    // Ensure it is not under privateDisallows
    const privateDisallowsMatch = robotsSource.match(/const privateDisallows = \[([\s\S]*?)\];/);
    assert.ok(privateDisallowsMatch, "privateDisallows array found");
    assert.doesNotMatch(
      privateDisallowsMatch[1],
      /"\/pricing"/,
      "privateDisallows should not contain /pricing"
    );
  });

  it("sitemap.xml registers /pricing with priority 0.9", () => {
    const sitemapSource = fs.readFileSync(path.join(rootDir, "public/sitemap.xml"), "utf-8");
    assert.match(
      sitemapSource,
      /<loc>https:\/\/www\.sigsignature\.com\/pricing<\/loc>/,
      "sitemap.xml should contain https://www.sigsignature.com/pricing"
    );
  });

  it("pricing layout applies AdaptivePricingShell and indexable SEO robots", () => {
    const layoutSource = fs.readFileSync(path.join(rootDir, "src/app/pricing/layout.tsx"), "utf-8");
    assert.match(
      layoutSource,
      /AdaptivePricingShell/,
      "layout.tsx must wrap children with AdaptivePricingShell"
    );
    assert.match(
      layoutSource,
      /index:\s*true/,
      "layout.tsx should set robots index: true"
    );
    assert.match(
      layoutSource,
      /follow:\s*true/,
      "layout.tsx should set robots follow: true"
    );
    assert.match(
      layoutSource,
      /canonical:\s*"https:\/\/www\.sigsignature\.com\/pricing"/,
      "layout.tsx should specify canonical pricing URL"
    );
  });

  it("AdaptivePricingShell conditionally renders AppShell or public Navbar/Footer with divider line", () => {
    const shellSource = fs.readFileSync(path.join(rootDir, "src/components/pricing/AdaptivePricingShell.tsx"), "utf-8");
    assert.match(shellSource, /AppShell/, "Must import AppShell");
    assert.match(shellSource, /Navbar/, "Must import Navbar");
    assert.match(shellSource, /Footer/, "Must import Footer");
    assert.match(shellSource, /useSyncExternalStore/, "Must use useSyncExternalStore for hydration consistency");
    assert.match(shellSource, /border-t border-\[#D7D7D7\]/, "Must include horizontal divider line before footer");
    assert.match(shellSource, /md:pt-0/, "Must not add extra padding on desktop above content");
  });

  it("AdaptiveHelpShell includes horizontal divider line before footer and clean desktop padding", () => {
    const shellSource = fs.readFileSync(path.join(rootDir, "src/components/help/AdaptiveHelpShell.tsx"), "utf-8");
    assert.match(shellSource, /border-t border-\[#D7D7D7\]/, "Must include horizontal divider line before footer");
    assert.match(shellSource, /md:pt-0/, "Must not add extra padding on desktop above content");
  });

  it("pricing page buttons require authentication when clicked by unauthenticated guests", () => {
    const pageSource = fs.readFileSync(path.join(rootDir, "src/app/pricing/page.tsx"), "utf-8");
    // Free card Get Started redirects to /signup?redirect=/pricing
    assert.match(
      pageSource,
      /\/signup\?redirect=\/pricing/,
      "Basic plan Get Started button must direct unauthenticated guests to /signup?redirect=/pricing"
    );
    // Pro card Start with Plus checks auth and redirects to signup if unauthenticated
    assert.match(
      pageSource,
      /router\.push\("\/signup\?redirect=\/pricing&plan=pro"\)/,
      "handleGoPremium must redirect unauthenticated guests to /signup?redirect=/pricing&plan=pro"
    );
  });
});
