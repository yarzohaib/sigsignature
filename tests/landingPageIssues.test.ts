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

  it("z8tvbhx8pm & z8tvbhx8uu: contact form uses noValidate, custom inline errors, and standard name attributes", () => {
    const contactFormPath = path.join(root, "src/components/contact/ContactForm.tsx");
    const contactFormContent = fs.readFileSync(contactFormPath, "utf-8");
    assert.match(
      contactFormContent,
      /<form\s+noValidate/,
      "ContactForm must include noValidate to suppress browser native popup bubbles"
    );
    assert.match(
      contactFormContent,
      /name="name"/,
      "Name input must include name='name'"
    );
    assert.match(
      contactFormContent,
      /name="email"/,
      "Email input must include name='email'"
    );
    assert.match(
      contactFormContent,
      /name="about"/,
      "What's this about select must include name='about'"
    );
    assert.match(
      contactFormContent,
      /name="emailClient"/,
      "Email client select must include name='emailClient'"
    );
    assert.match(
      contactFormContent,
      /name="message"/,
      "Message textarea must include name='message'"
    );
    assert.match(
      contactFormContent,
      /name="attachment"/,
      "Attachment file input must include name='attachment'"
    );
    assert.match(
      contactFormContent,
      /id="contact-terms"\s+name="terms"/,
      "Terms checkbox must include id='contact-terms' and name='terms'"
    );
    assert.match(
      contactFormContent,
      /border-red-500/,
      "Validation error state must style input border red"
    );
  });

  it("z8tvbhx974: enforces max 16 chars on contact name with input slice guard", () => {
    const contactFormPath = path.join(root, "src/components/contact/ContactForm.tsx");
    const contactFormContent = fs.readFileSync(contactFormPath, "utf-8");
    assert.match(
      contactFormContent,
      /maxLength=\{16\}/,
      "Name input must enforce maxLength of 16"
    );
    assert.match(
      contactFormContent,
      /\.slice\(0,\s*16\)/,
      "Name input onChange must enforce .slice(0, 16) guard"
    );
  });

  it("z8tvbhx95c: closes Select dropdown on page scroll to prevent detaching over footer", () => {
    const selectPath = path.join(root, "src/components/ui/Select.tsx");
    const selectContent = fs.readFileSync(selectPath, "utf-8");
    assert.match(
      selectContent,
      /menuRef\.current\.contains\(target\)/,
      "Select must check if scroll occurred within menu"
    );
    assert.match(
      selectContent,
      /setOpen\(false\)/,
      "Select must close on page scroll when scrolling outside dropdown"
    );
  });

  it("z8tvbhx958: provides custom styled checkbox and enforces min 50 / max 5000 chars on message", () => {
    const contactFormPath = path.join(root, "src/components/contact/ContactForm.tsx");
    const contactFormContent = fs.readFileSync(contactFormPath, "utf-8");
    assert.match(
      contactFormContent,
      /maxLength=\{5000\}/,
      "Message textarea must enforce maxLength of 5000"
    );
    assert.match(
      contactFormContent,
      /5,000/,
      "Character counter must display 5,000 max"
    );
    assert.match(
      contactFormContent,
      /Message must be at least 50 characters/,
      "Validation must enforce minimum 50 characters on message"
    );
    assert.match(
      contactFormContent,
      /className="sr-only peer"/,
      "Checkbox must use styled custom element with hidden native input"
    );
  });

  it("z8tvbhx94f: side card on /contact uses soft tint background, squircle badges, and Lifebuoy icon", () => {
    const contactPagePath = path.join(root, "src/app/contact/page.tsx");
    const contactPageContent = fs.readFileSync(contactPagePath, "utf-8");
    assert.match(
      contactPageContent,
      /bg-\[#F8FAFC\]/,
      "How can we help? card must use soft #F8FAFC tint background"
    );
    assert.match(
      contactPageContent,
      /rounded-xl border border-slate-200\/80 bg-white/,
      "Help items must use squircle badge containers"
    );
    assert.match(
      contactPageContent,
      /circle cx="12" cy="12" r="9"/,
      "Technical help must render Lifebuoy icon"
    );
  });

  it("z8tvbhx925: blog hero features deep navy CTA button, balanced padding, and aligned search bar", () => {
    const blogPagePath = path.join(root, "src/app/blog/page.tsx");
    const blogPageContent = fs.readFileSync(blogPagePath, "utf-8");
    assert.match(
      blogPageContent,
      /bg-\[#0B2568\]/,
      "Hero CTA button must use deep navy #0B2568 background"
    );
    assert.match(
      blogPageContent,
      /pt-16 pb-8 sm:pt-10 sm:pb-10 lg:pt-12 lg:pb-12/,
      "Hero section must not have excessive void"
    );

    const blogListPath = path.join(root, "src/components/blog/BlogListSection.tsx");
    const blogListContent = fs.readFileSync(blogListPath, "utf-8");
    assert.match(
      blogListContent,
      /A little insight\. A better sign&#8209;off\./,
      "Title must use non-breaking hyphen to prevent broken 'sign- / off.' wrap"
    );
    assert.match(
      blogListContent,
      /md:items-center md:justify-between/,
      "Header row must align search input with title"
    );
  });

  it("z8tvbhx92a: article cards enforce line-clamp-2 on titles, line-clamp-3 on excerpts, and equal height", () => {
    const blogListPath = path.join(root, "src/components/blog/BlogListSection.tsx");
    const blogListContent = fs.readFileSync(blogListPath, "utf-8");
    assert.match(
      blogListContent,
      /line-clamp-2/,
      "Article titles must enforce line-clamp-2"
    );
    assert.match(
      blogListContent,
      /line-clamp-3/,
      "Article excerpts must enforce line-clamp-3"
    );
    assert.match(
      blogListContent,
      /flex h-full flex-col justify-between/,
      "Article cards must stretch to full height"
    );
  });

  it("z8tvbhx92m: 'Read the story' uses SVG arrow icon and integration row icons use uniform monochrome brand blue", () => {
    const blogListPath = path.join(root, "src/components/blog/BlogListSection.tsx");
    const blogListContent = fs.readFileSync(blogListPath, "utf-8");
    assert.match(
      blogListContent,
      /<path strokeLinecap="round" strokeLinejoin="round" d="M4\.5 19\.5l15-15m0 0H8\.25m11\.25 0v11\.25" \/>/,
      "'Read the story' link must render SVG diagonal arrow"
    );
    assert.doesNotMatch(
      blogListContent,
      /text-\[#EA4335\]/,
      "Gmail icon must not be red; must use uniform brand blue"
    );
    assert.doesNotMatch(
      blogListContent,
      /text-\[#0078D4\]/,
      "Outlook icon must not be different blue; must use uniform brand blue"
    );
  });

  it("z8tvbhx8uw: article card thumbnails have aria-hidden to prevent concatenating raw mock text as anchor title", () => {
    const blogListPath = path.join(root, "src/components/blog/BlogListSection.tsx");
    const blogListContent = fs.readFileSync(blogListPath, "utf-8");
    assert.match(
      blogListContent,
      /tabIndex=\{-1\}\s+aria-hidden="true"/,
      "Card thumbnail link must be aria-hidden with tabIndex=-1"
    );

    const visualPath = path.join(root, "src/components/blog/BlogCardVisual.tsx");
    const visualContent = fs.readFileSync(visualPath, "utf-8");
    assert.match(
      visualContent,
      /aria-hidden="true"/,
      "BlogCardVisual must mark mock signature containers aria-hidden"
    );
  });
});
