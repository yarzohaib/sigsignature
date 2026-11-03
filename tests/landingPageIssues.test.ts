import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Landing Page & Marketing Screens QA Polish", () => {
  const root = path.resolve(__dirname, "..");

  it("z8tvbhx8ry: eliminates excessive void by removing min-h-100svh and balancing padding", () => {
    const timelinePath = path.join(root, "src/components/landing/HowItWorksTimeline.tsx");
    const timelineContent = fs.readFileSync(timelinePath, "utf-8");
    assert.doesNotMatch(
      timelineContent,
      /md:min-h-\[100svh\]/,
      "HowItWorksTimeline should not force 100svh min-height on desktop"
    );
    assert.doesNotMatch(
      timelineContent,
      /md:justify-center/,
      "HowItWorksTimeline should not force vertical centering inside a full-screen container"
    );

    const templatesPath = path.join(root, "src/components/landing/PopularTemplatesSection.tsx");
    const templatesContent = fs.readFileSync(templatesPath, "utf-8");
    assert.match(
      templatesContent,
      /pb-12 sm:pb-16 lg:pb-16/,
      "PopularTemplatesSection should have balanced bottom padding"
    );
  });

  it("z8tvbhx933: restores Figma CTA button gradient, balanced height, and microcopy", () => {
    const ctaPath = path.join(root, "src/components/landing/CtaBanner.tsx");
    const ctaContent = fs.readFileSync(ctaPath, "utf-8");
    assert.match(
      ctaContent,
      /No credit card\. No designer\. No developer\. Just you\./,
      "CTA Banner must display canonical Figma microcopy"
    );
    assert.match(
      ctaContent,
      /linear-gradient\(180deg, #FFFFFF 0%, #EFF6FF 100%\)/,
      "CTA button must have subtle gradient sheen"
    );
    assert.match(
      ctaContent,
      /text-\[#0B2568\]/,
      "CTA button text must match Figma deep navy color"
    );
  });

  it("z8tvbhx8qc: ensures category pills on templates section have horizontal scroll padding and start naturally", () => {
    const templatesPath = path.join(root, "src/components/landing/PopularTemplatesSection.tsx");
    const templatesContent = fs.readFileSync(templatesPath, "utf-8");
    assert.match(
      templatesContent,
      /justify-start.+sm:justify-center/,
      "Category pills must align to start on mobile so the first pill is reachable"
    );
    assert.match(
      templatesContent,
      /scroll-px-4/,
      "Category pills must include scroll padding"
    );
  });

  it("z8tvbhx93u: renders active blue accent indicator on Step 01 and muted tracks on Step 02 & 03", () => {
    const useCasesPath = path.join(root, "src/app/use-cases/page.tsx");
    const useCasesContent = fs.readFileSync(useCasesPath, "utf-8");
    assert.match(
      useCasesContent,
      /border-t-2 border-\[#245FD4\]/,
      "Step 01 must have active blue accent bar"
    );
    assert.match(
      useCasesContent,
      /border-t border-slate-200/,
      "Steps 02 and 03 must have muted track borders"
    );
  });

  it("z8tvbhx93t & z8tvbhx93f: renders Execute tab label, glowing border ring, and borderless social icons", () => {
    const previewPath = path.join(root, "src/components/use-cases/UseCasePreview.tsx");
    const previewContent = fs.readFileSync(previewPath, "utf-8");
    assert.match(
      previewContent,
      />\s*Execute\s*<\/button>/,
      "Tab label must be 'Execute' matching Figma"
    );
    assert.match(
      previewContent,
      /border border-white\/20 bg-\[#062058\]/,
      "Executive dark preview card must feature glowing border outline"
    );
    assert.match(
      previewContent,
      /thenevon@gmail\.com.+text-slate-800|text-white\/90/,
      "Email address should not be bright blue"
    );
  });

  it("z8tvbhx93r: renders Choose Your Package heading, audience toggle, and trust badges on /pricing", () => {
    const pricingPath = path.join(root, "src/app/pricing/page.tsx");
    const pricingContent = fs.readFileSync(pricingPath, "utf-8");
    assert.match(
      pricingContent,
      /Choose Your Package\./,
      "Pricing page must feature centered 'Choose Your Package.' heading"
    );
    assert.match(
      pricingContent,
      /Businesses & Team/,
      "Pricing page must include Businesses & Team audience toggle"
    );
    assert.match(
      pricingContent,
      /Best Value Price/,
      "Professional tier must feature 'Best Value Price' badge"
    );
    assert.match(
      pricingContent,
      /Money back guarantee/,
      "Trust badge 'Money back guarantee' must be present below cards"
    );
    assert.match(
      pricingContent,
      /24\/7 Live support/,
      "Trust badge '24/7 Live support' must be present below cards"
    );
    assert.match(
      pricingContent,
      /10k\+ users globally/,
      "Trust badge '10k+ users globally' must be present below cards"
    );
  });
});
