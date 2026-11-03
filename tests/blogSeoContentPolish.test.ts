import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { BLOG_POSTS } from "../src/lib/blogData";
import sitemap from "../src/app/sitemap";

describe("Blog & Guides SEO Polish & Content Enhancement", () => {
  const rootDir = path.resolve(__dirname, "..");

  describe("1. Sitemap Verification (public/sitemap.xml & app/sitemap.ts)", () => {
    it("public/sitemap.xml contains all 7 live blog post URLs", () => {
      const sitemapPath = path.join(rootDir, "public/sitemap.xml");
      const content = fs.readFileSync(sitemapPath, "utf-8");

      const expectedSlugs = [
        "what-belongs-in-an-email-signature",
        "why-outlook-uses-microsoft-word-to-render-html",
        "html-or-image-find-the-right-export-for-your-inbox",
        "one-brand-many-people-signature-system",
        "a-calmer-way-to-roll-out-your-next-email-signature",
        "your-next-campaign-already-has-a-place-to-show-up",
        "good-hierarchy-makes-a-small-signature-feel-effortless",
      ];

      for (const slug of expectedSlugs) {
        const expectedUrl = `<loc>https://www.sigsignature.com/blog/${slug}</loc>`;
        assert.ok(
          content.includes(expectedUrl),
          `public/sitemap.xml should contain ${expectedUrl}`
        );
      }
    });

    it("src/app/sitemap.ts dynamically includes all 7 blog posts and core guides", () => {
      const entries = sitemap();
      const urls = entries.map((e) => e.url);

      assert.ok(urls.includes("https://www.sigsignature.com/blog"), "sitemap should contain /blog");

      for (const post of BLOG_POSTS) {
        assert.ok(
          urls.includes(`https://www.sigsignature.com/blog/${post.slug}`),
          `sitemap.ts should contain /blog/${post.slug}`
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
      "your-next-campaign-already-has-a-place-to-show-up":
        "Email Signature Banners: How to Run Marketing Campaigns in Your Sign-Off",
      "good-hierarchy-makes-a-small-signature-feel-effortless":
        "Email Signature Typography & Hierarchy: Best Fonts, Sizes & Spacing",
      "a-calmer-way-to-roll-out-your-next-email-signature":
        "How to Roll Out Company-Wide Email Signatures for Your Team (Step-by-Step)",
      "what-belongs-in-an-email-signature":
        "What to Include in an Email Signature? (Best Practices & Examples)",
      "html-or-image-find-the-right-export-for-your-inbox":
        "HTML vs Image Email Signature: Which is Better for Deliverability?",
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
