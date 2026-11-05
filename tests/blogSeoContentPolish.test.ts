import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { BLOG_POSTS } from "../src/lib/blogData";

describe("Blog & Guides SEO Polish & Content Enhancement", () => {
  const rootDir = path.resolve(__dirname, "..");

  describe("1. Sitemap Verification (public/sitemap.xml)", () => {
    it("public/sitemap.xml contains all 8 live blog post URLs", () => {
      const sitemapPath = path.join(rootDir, "public/sitemap.xml");
      const content = fs.readFileSync(sitemapPath, "utf-8");

      const expectedSlugs = [
        "why-outlook-uses-microsoft-word-to-render-html",
        "why-gmail-clips-email-signatures-102kb-fix",
        "how-to-prevent-outlook-image-blowouts-dpi-scaling",
        "the-base64-image-trap-why-embedded-signatures-trigger-spam",
        "the-dark-mode-email-inversion-blueprint-protecting-logos",
        "the-times-new-roman-trap-defensive-email-font-stacks",
        "do-email-signature-links-hurt-domain-deliverability",
        "why-div-tags-fail-in-email-signatures-nested-table-architecture",
      ];

      for (const slug of expectedSlugs) {
        const expectedUrl = `<loc>https://www.sigsignature.com/blog/${slug}</loc>`;
        assert.ok(
          content.includes(expectedUrl),
          `public/sitemap.xml should contain ${expectedUrl}`
        );
      }
    });

    it("public/sitemap.xml includes all 8 blog posts and core guides", () => {
      const sitemapPath = path.join(rootDir, "public/sitemap.xml");
      const content = fs.readFileSync(sitemapPath, "utf-8");

      assert.ok(content.includes("<loc>https://www.sigsignature.com/blog</loc>"), "sitemap should contain /blog");

      for (const post of BLOG_POSTS) {
        assert.ok(
          content.includes(`<loc>https://www.sigsignature.com/blog/${post.slug}</loc>`),
          `public/sitemap.xml should contain /blog/${post.slug}`
        );
      }
    });
  });

  describe("2. Internal Contextual Linking (Guides & Blog Posts)", () => {
    const requiredAnchorText = "create your signature with our free email signature generator";
    const requiredHref = "https://www.sigsignature.com/";

    it("GuideArticle.tsx includes the exact contextual anchor link to homepage", () => {
      const guideArticlePath = path.join(rootDir, "src/components/help/GuideArticle.tsx");
      const content = fs.readFileSync(guideArticlePath, "utf-8");

      assert.ok(
        content.includes(requiredAnchorText),
        "GuideArticle.tsx must include required anchor text"
      );
      assert.ok(
        content.includes(`href="${requiredHref}"`),
        "GuideArticle.tsx link must point to https://www.sigsignature.com/"
      );
    });

    it("BlogPost slug page includes the exact contextual anchor link to homepage", () => {
      const blogPagePath = path.join(rootDir, "src/app/blog/[slug]/page.tsx");
      const content = fs.readFileSync(blogPagePath, "utf-8");

      assert.ok(
        content.includes(requiredAnchorText),
        "BlogPost slug page must include required anchor text"
      );
      assert.ok(
        content.includes(`href="${requiredHref}"`),
        "BlogPost slug page link must point to https://www.sigsignature.com/"
      );
    });

    it("Every blog post content markdown includes the contextual anchor link at the end", () => {
      for (const post of BLOG_POSTS) {
        assert.ok(
          post.contentMarkdown.includes(requiredAnchorText),
          `Blog post "${post.slug}" markdown must contain anchor text "${requiredAnchorText}"`
        );
        assert.ok(
          post.contentMarkdown.includes(`[${requiredAnchorText}](${requiredHref})`) ||
          post.contentMarkdown.includes(`[create your signature with our free email signature generator](https://www.sigsignature.com/)`),
          `Blog post "${post.slug}" markdown must link to ${requiredHref}`
        );
      }
    });
  });

  describe("3. Brand Name Consistency ('Sig Signature' vs 'SigSignature')", () => {
    it("blogData.ts does not contain 'SigSignature' outside of URLs", () => {
      const blogDataPath = path.join(rootDir, "src/lib/blogData.ts");
      const content = fs.readFileSync(blogDataPath, "utf-8");

      // Replace valid URLs before checking
      const sanitized = content
        .replace(/https?:\/\/[^\s"'`)]+/g, "")
        .replace(/cdn\.sigsignature\.com/g, "")
        .replace(/sigsignature\.com/g, "");

      const matches = sanitized.match(/\bSigSignature\b/g);
      assert.strictEqual(
        matches,
        null,
        `Found unspaced 'SigSignature' in blogData.ts: ${matches?.join(", ")}`
      );
    });

    it("BlogPost slug page uses official 'Sig Signature' brand name", () => {
      const blogPagePath = path.join(rootDir, "src/app/blog/[slug]/page.tsx");
      const content = fs.readFileSync(blogPagePath, "utf-8");

      assert.ok(
        !content.includes("SigSignature automatically compiles"),
        "Callout box should use 'Sig Signature' with space"
      );
      assert.ok(
        content.includes("Sig Signature automatically compiles"),
        "Callout box should say 'Sig Signature automatically compiles'"
      );
    });

    it("BlogCardVisual.tsx uses official 'Sig Signature' brand name", () => {
      const visualPath = path.join(rootDir, "src/components/blog/BlogCardVisual.tsx");
      const content = fs.readFileSync(visualPath, "utf-8");

      assert.ok(
        content.includes('<span className="font-heading text-lg font-bold">Sig Signature</span>'),
        "BlogCardVisual should render 'Sig Signature' with a space"
      );
    });
  });

  describe("4. Broken Characters in Bylines Fix", () => {
    it("BlogPost slug page uses &bull; instead of broken characters in bylines", () => {
      const blogPagePath = path.join(rootDir, "src/app/blog/[slug]/page.tsx");
      const content = fs.readFileSync(blogPagePath, "utf-8");

      assert.ok(
        content.includes("&bull;"),
        "BlogPost slug page should use &bull; for category and date separators"
      );
    });

    it("BlogCardVisual.tsx uses &bull; separator", () => {
      const visualPath = path.join(rootDir, "src/components/blog/BlogCardVisual.tsx");
      const content = fs.readFileSync(visualPath, "utf-8");

      assert.ok(
        content.includes("&bull;"),
        "BlogCardVisual should use &bull; for byline separators"
      );
    });
  });

  describe("5. SEO-Friendly Blog Titles & Metadata", () => {
    const titleMap: Record<string, string> = {
      "why-outlook-uses-microsoft-word-to-render-html":
        "Why Outlook Uses Microsoft Word to Render HTML (And How to Fix It)",
      "why-gmail-clips-email-signatures-102kb-fix":
        "Why Gmail Clips Email Signatures at 102KB (And How to Stay Under 10KB)",
      "how-to-prevent-outlook-image-blowouts-dpi-scaling":
        "How to Prevent Outlook Image Blowouts: The 96 DPI vs 120 DPI Display Scaling Bug",
      "the-base64-image-trap-why-embedded-signatures-trigger-spam":
        "The Base64 Image Trap: Why Embedded Signatures Trigger Spam Filters",
      "the-dark-mode-email-inversion-blueprint-protecting-logos":
        "The Dark Mode Email Inversion Blueprint: Protecting Transparent Logos from Disappearing",
      "the-times-new-roman-trap-defensive-email-font-stacks":
        "The Times New Roman Trap: Building Defensive Font Stacks for Corporate Email",
      "do-email-signature-links-hurt-domain-deliverability":
        "Do Email Signature Links Hurt Domain Deliverability? The 1-CTA Discipline",
      "why-div-tags-fail-in-email-signatures-nested-table-architecture":
        "Why Div Tags Fail in Email Signatures: The Master Nested Table Architecture",
    };

    for (const [slug, expectedTitle] of Object.entries(titleMap)) {
      it(`verifies slug "${slug}" has updated title: "${expectedTitle}"`, () => {
        const post = BLOG_POSTS.find((p) => p.slug === slug);
        assert.ok(post, `Post with slug ${slug} should exist`);
        assert.strictEqual(post.title, expectedTitle);
      });
    }
  });

  describe("6. Blog Content Depth, Examples & FAQs", () => {
    for (const post of BLOG_POSTS) {
      it(`post "${post.slug}" has comprehensive word count (>= 750 words)`, () => {
        const wordCount = post.contentMarkdown.trim().split(/\s+/).length;
        assert.ok(
          wordCount >= 750,
          `Post "${post.slug}" has ${wordCount} words, expected at least 750`
        );
      });

      it(`post "${post.slug}" contains practical examples and FAQs`, () => {
        const md = post.contentMarkdown;
        // Check for FAQ section
        assert.ok(
          md.includes("Frequently Asked Questions") || md.includes("## Frequently Asked Questions"),
          `Post "${post.slug}" should contain an FAQ section`
        );
        // Check for at least 2 questions marked with ### or **
        const faqQuestionCount = (md.match(/###\s+[^\n]+\?/g) || []).length;
        assert.ok(
          faqQuestionCount >= 2,
          `Post "${post.slug}" should have at least 2 FAQ questions ending in '?', found ${faqQuestionCount}`
        );
        // Check for practical examples
        assert.ok(
          md.toLowerCase().includes("example") || md.toLowerCase().includes("case studies") || md.toLowerCase().includes("scenario"),
          `Post "${post.slug}" should include practical examples`
        );
      });
    }
  });
});
