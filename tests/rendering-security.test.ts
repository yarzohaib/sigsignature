import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  generateSignatureHtml,
  generateTemplateHtml,
  escapeHtml,
  safeUrl,
  safeImageUrl,
  normalizeWebsite,
  telHref,
} from "../src/lib/generateSignatureHtml";
import { generateStudioHtml } from "../src/lib/studio/renderStudioHtml";
import { generateFreeHtml } from "../src/lib/studio/free/renderFreeHtml";
import { renderTeamMemberHtml } from "../src/lib/team/render";
import { buildSafeDomFragment } from "../src/lib/clipboard";
import type { TemplateSignatureData } from "../src/types/template";
import type { StudioSignatureData } from "../src/types/studio";
import type { Team, TeamMember } from "../src/types/team";

/**
 * Asserts that the rendered HTML contains NO executable markup:
 * 1. No unescaped <script> tags.
 * 2. No unescaped <iframe> tags.
 * 3. No executable inline event handlers (<... on* = ...>).
 * 4. No javascript: or data:text/html in href or src attributes.
 */
function assertNoExecutableMarkup(html: string, context = ""): void {
  const prefix = context ? `[${context}] ` : "";

  // 1. No executable script or iframe tags
  assert.ok(
    !/<script\b/i.test(html),
    `${prefix}Output must not contain unescaped <script> tags`
  );
  assert.ok(
    !/<iframe\b/i.test(html),
    `${prefix}Output must not contain unescaped <iframe> tags`
  );

  // 2. No executable event handlers inside HTML tags (e.g. <img ... onerror=...>)
  assert.ok(
    !/<[a-zA-Z][^>]*\bon\w+\s*=/i.test(html),
    `${prefix}Output must not contain executable HTML event handlers (e.g. onerror, onload, onclick)`
  );

  // 3. No javascript: in href or src attributes
  assert.ok(
    !/(href|src)\s*=\s*["']?\s*javascript:/i.test(html),
    `${prefix}Output must not contain javascript: in href or src attributes`
  );

  // 4. No data:text/html in href or src attributes
  assert.ok(
    !/(href|src)\s*=\s*["']?\s*data:text\/html/i.test(html),
    `${prefix}Output must not contain data:text/html in href or src attributes`
  );
}

describe("Frontend Rendering Security Suite", () => {
  const XSS_PAYLOAD_IMG = '<img src=x onerror=alert(1)>';
  const XSS_PAYLOAD_SCRIPT = '<script>alert("XSS")</script>';
  const XSS_PAYLOAD_QUOTES = '" onmouseover="alert(\'XSS\')" data-x="';
  const XSS_JAVASCRIPT_URL = 'javascript:alert(document.domain)';

  const maliciousTemplateData: TemplateSignatureData = {
    templateId: "professional-minimal",
    fullName: `Jane ${XSS_PAYLOAD_IMG} Doe`,
    jobTitle: `Chief ${XSS_PAYLOAD_SCRIPT} Officer`,
    companyName: `Acme Corp ${XSS_PAYLOAD_QUOTES}`,
    email: `jane${XSS_PAYLOAD_IMG}@example.com`,
    phone: `+1 555 123 4567 ${XSS_PAYLOAD_SCRIPT}`,
    website: XSS_JAVASCRIPT_URL,
    avatarUrl: XSS_JAVASCRIPT_URL,
    companyLogoUrl: `<img src=x onerror=alert(2)>`,
    themeColor: "#245FD4",
    fontFamily: "Inter",
    layout: "two-column",
    socialIconsStyle: "filled",
    socials: {
      linkedin: XSS_JAVASCRIPT_URL,
      twitter: `https://x.com/safe${XSS_PAYLOAD_QUOTES}`,
      facebook: "",
    },
    optional: {
      address: `123 Main St ${XSS_PAYLOAD_SCRIPT}`,
      tagline: `Innovating safely ${XSS_PAYLOAD_IMG}`,
      disclaimer: `Confidential ${XSS_PAYLOAD_QUOTES}`,
    },
  };

  test("1. safeUrl and safeImageUrl restrict protocols and escape attribute characters", () => {
    // javascript: schemes are rejected
    assert.equal(safeUrl(XSS_JAVASCRIPT_URL), "");
    assert.equal(safeUrl("   JAVASCRIPT:alert(1)   "), "");
    assert.equal(safeUrl("vbscript:alert(1)"), "");
    assert.equal(safeUrl("data:text/html;base64,PHNjcmlwdD4="), "");

    // safe protocols are preserved and escaped
    assert.equal(safeUrl("https://sigsignature.com"), "https://sigsignature.com");
    assert.equal(safeUrl("http://example.com"), "http://example.com");
    assert.equal(safeUrl("mailto:support@sigsignature.com"), "mailto:support@sigsignature.com");
    assert.equal(safeUrl("tel:+15551234567"), "tel:+15551234567");

    // URLs with attribute breakout quotes are escaped
    assert.equal(
      safeUrl('https://example.com/path" onclick="alert(1)'),
      "https://example.com/path&quot; onclick=&quot;alert(1)"
    );

    // safeImageUrl restricts src values
    assert.equal(safeImageUrl("javascript:alert(1)"), "");
    assert.equal(safeImageUrl("data:text/html,<script>alert(1)</script>"), "");
    assert.equal(safeImageUrl("<img src=x onerror=alert(1)>"), "");
    assert.equal(safeImageUrl("https://cdn.sigsignature.com/photo.png"), "https://cdn.sigsignature.com/photo.png");
    assert.equal(safeImageUrl("/avatars/user.jpg"), "/avatars/user.jpg");
    assert.equal(
      safeImageUrl("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="),
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    );

    // normalizeWebsite rejects malicious scripts
    assert.equal(normalizeWebsite("javascript:alert(1)"), "");
    assert.equal(normalizeWebsite("<script>alert(1)</script>"), "");
    assert.equal(normalizeWebsite("www.sigsignature.com"), "https://www.sigsignature.com");

    // escapeHtml encodes all markup entities
    assert.equal(
      escapeHtml('<script>"hello" & \'world\'</script>'),
      "&lt;script&gt;&quot;hello&quot; &amp; &#39;world&#39;&lt;/script&gt;"
    );

    // telHref sanitizes numbers preserving leading +
    assert.equal(telHref("+1 (555) 123-4567"), "tel:+15551234567");
    assert.equal(telHref("555-1234"), "tel:5551234");
    assert.equal(telHref("invalid"), "");
  });

  test("2. generateTemplateHtml renders NO executable markup and neutralizes injection payloads", () => {
    const html = generateTemplateHtml(maliciousTemplateData);

    assertNoExecutableMarkup(html, "generateTemplateHtml");

    // Confirm that payload markup was safely encoded into HTML entities
    assert.ok(
      html.includes("&lt;img src=x onerror=alert(1)&gt;"),
      "Injected markup in name must be escaped"
    );
    assert.ok(
      html.includes("&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;"),
      "Injected script in job title must be escaped"
    );
    assert.ok(
      html.includes("&quot; onmouseover=&quot;alert(&#39;XSS&#39;)&quot; data-x=&quot;"),
      "Quotes must be escaped"
    );
  });

  test("3. generateSignatureHtml with various templates neutralizes all malicious payloads", () => {
    const templates = [
      "photoPop",
      "bigName",
      "centeredMinimal",
      "classicLetterhead",
      "boldBlock",
      "executiveCorporate",
      "compact",
      "ribbon",
      "single",
      "cleanLine",
      "colorBlock",
      "horizontal",
      "twoColumn",
      "boardroomCorporate",
      "splitBanner",
    ];

    for (const tId of templates) {
      const data: TemplateSignatureData = {
        ...maliciousTemplateData,
        templateId: tId,
      };

      const html = generateSignatureHtml(data);
      assertNoExecutableMarkup(html, `Template: ${tId}`);
    }
  });

  test("4. generateStudioHtml neutralizes XSS payloads in standard and extra blocks", () => {
    const studioData: StudioSignatureData = {
      fullName: `John ${XSS_PAYLOAD_IMG}`,
      jobTitle: `Architect ${XSS_PAYLOAD_SCRIPT}`,
      companyName: `Studio & Co. ${XSS_PAYLOAD_QUOTES}`,
      email: `john@example.com`,
      phone: `+1 555 9876`,
      website: `https://example.com`,
      avatarUrl: XSS_JAVASCRIPT_URL,
      companyLogoUrl: XSS_JAVASCRIPT_URL,
      themeColor: "#10B981",
      fontFamily: "Inter",
      layout: "two-column",
      socialIconsStyle: "filled",
      socials: {
        linkedin: XSS_JAVASCRIPT_URL,
        twitter: "",
        facebook: "",
      },
      optional: {},
      extras: [
        {
          type: "text",
          id: "extra-text",
          text: `Extra text block with ${XSS_PAYLOAD_IMG} and ${XSS_PAYLOAD_SCRIPT}`,
          align: "left",
          size: "sm",
          bold: false,
        },
        {
          type: "cta",
          id: "extra-cta",
          label: `Book Call ${XSS_PAYLOAD_QUOTES}`,
          url: XSS_JAVASCRIPT_URL,
          align: "left",
        },
        {
          type: "image",
          id: "extra-img",
          url: XSS_JAVASCRIPT_URL,
          linkUrl: XSS_JAVASCRIPT_URL,
          width: 80,
          align: "left",
        },
        {
          type: "banner",
          id: "extra-banner",
          imageUrl: XSS_JAVASCRIPT_URL,
          linkUrl: XSS_JAVASCRIPT_URL,
        },
      ],
    };

    const html = generateStudioHtml(studioData);
    assertNoExecutableMarkup(html, "generateStudioHtml");
    assert.ok(html.includes("&lt;img src=x onerror=alert(1)&gt;"), "Injected markup must be escaped");
  });

  test("5. generateFreeHtml neutralizes XSS in canvas elements", () => {
    const freeData: StudioSignatureData = {
      fullName: "Alex",
      jobTitle: "Dev",
      companyName: "Acme",
      email: "alex@example.com",
      phone: "+1 555 1234",
      website: "https://example.com",
      avatarUrl: "",
      themeColor: "#2563EB",
      fontFamily: "Roboto",
      layout: "two-column",
      socialIconsStyle: "filled",
      socials: {
        linkedin: "",
        twitter: "",
        facebook: "",
      },
      optional: {},
      elements: [
        {
          id: "el-1",
          type: "text",
          x: 0,
          y: 0,
          w: 200,
          h: 30,
          size: "md",
          bold: false,
          align: "left",
          text: `Canvas text ${XSS_PAYLOAD_SCRIPT} ${XSS_PAYLOAD_IMG}`,
        },
        {
          id: "el-2",
          type: "cta",
          x: 0,
          y: 40,
          w: 120,
          h: 36,
          label: `Click ${XSS_PAYLOAD_QUOTES}`,
          url: XSS_JAVASCRIPT_URL,
        },
        {
          id: "el-3",
          type: "image",
          x: 0,
          y: 80,
          w: 100,
          h: 100,
          url: XSS_JAVASCRIPT_URL,
          linkUrl: XSS_JAVASCRIPT_URL,
        },
      ],
    };

    const html = generateFreeHtml(freeData);
    assertNoExecutableMarkup(html, "generateFreeHtml");
  });

  test("6. renderTeamMemberHtml neutralizes XSS in team member details", () => {
    const team: Team = {
      id: "team-1",
      ownerId: "owner-1",
      name: "Engineering",
      kind: "template",
      templateId: "photoPop",
      templateVersion: 1,
      memberLimit: 3,
      data: {
        templateId: "photoPop",
        fullName: "Owner",
        jobTitle: "Owner",
        companyName: "Engineering",
        email: "owner@company.com",
        phone: "+1 555 0000",
        website: "https://company.com",
        avatarUrl: "",
        themeColor: "#F97316",
        fontFamily: "Arial",
        layout: "two-column",
        socialIconsStyle: "filled",
        socials: { linkedin: "", twitter: "", facebook: "" },
        optional: {},
      },
      members: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const member: TeamMember = {
      id: "mem-1",
      name: `Sarah ${XSS_PAYLOAD_IMG}`,
      email: `sarah${XSS_PAYLOAD_SCRIPT}@company.com`,
      jobTitle: `Director ${XSS_PAYLOAD_QUOTES}`,
      phone: "+1 555 4321",
      photoUrl: XSS_JAVASCRIPT_URL,
      socials: [
        { platform: "linkedin", url: XSS_JAVASCRIPT_URL },
      ],
      status: "sent",
      sentAt: null,
      acceptedAt: null,
      tokenExpiresAt: null,
      sendCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const html = renderTeamMemberHtml(team, member);
    assertNoExecutableMarkup(html, "renderTeamMemberHtml");
  });

  test("7. buildSafeDomFragment builds clean DOM without executable markup", () => {
    // Only run in DOM environments (Node mock or browser)
    if (typeof DOMParser === "undefined" || typeof document === "undefined") {
      return;
    }

    const maliciousHtml = `
      <div>
        <p>Hello World</p>
        <script>alert("PWNED")</script>
        <img src="x" onerror="alert('XSS')" />
        <a href="javascript:alert(1)">Click Me</a>
        <a href="https://sigsignature.com">Safe Link</a>
      </div>
    `;

    const fragment = buildSafeDomFragment(maliciousHtml);
    const testDiv = document.createElement("div");
    testDiv.appendChild(fragment);

    assert.equal(testDiv.querySelectorAll("script").length, 0, "No <script> elements permitted");
    assert.equal(testDiv.querySelector("img")?.getAttribute("onerror"), null, "onerror attribute must be removed");
    const links = testDiv.querySelectorAll("a");
    const jsLinks = Array.from(links).filter((a) => a.getAttribute("href")?.startsWith("javascript:"));
    assert.equal(jsLinks.length, 0, "No javascript: hrefs permitted");
    assert.equal(testDiv.querySelector("a[href='https://sigsignature.com']")?.textContent, "Safe Link");
  });

  test("8. Legitimate data with quotes, ampersands, and valid HTTPS URLs render properly", () => {
    const safeData: TemplateSignatureData = {
      templateId: "photoPop",
      fullName: "Conan O'Brien",
      jobTitle: "R&D Lead Engineer",
      companyName: "O'Brien & Partners",
      email: "conan@obrien.com",
      phone: "+1 555 0199",
      website: "https://www.obrien.com",
      avatarUrl: "https://sigsignature-prod-assets-2026.s3.ap-southeast-2.amazonaws.com/conan.jpg",
      themeColor: "#2563EB",
      fontFamily: "Inter",
      layout: "two-column",
      socialIconsStyle: "filled",
      socials: {
        linkedin: "https://linkedin.com/in/conan-obrien",
        twitter: "",
        facebook: "",
      },
      optional: {
        tagline: "Research & Development",
        disclaimer: "Confidentiality Notice & Disclaimer.",
      },
    };

    const html = generateSignatureHtml(safeData);
    assertNoExecutableMarkup(html, "Safe Data Test");

    // Legitimate characters are safely entity-escaped
    assert.ok(html.includes("Conan O&#39;Brien"));
    assert.ok(html.includes("R&amp;D Lead Engineer"));
    assert.ok(html.includes("href=\"https://www.obrien.com\""));
    assert.ok(html.includes("href=\"mailto:conan@obrien.com\""));
    assert.ok(html.includes("href=\"https://linkedin.com/in/conan-obrien\""));
    assert.ok(html.includes("src=\"https://sigsignature-prod-assets-2026.s3.ap-southeast-2.amazonaws.com/conan.jpg\""));
  });

  test("9. next.config redirects /forgot-password to /forgot with permanent 301/308 status", async () => {
    // Dynamic import to avoid build-time issues
    const nextConfigModule = await import("../next.config");
    const nextConfig = nextConfigModule.default || nextConfigModule;

    assert.equal(typeof nextConfig.redirects, "function");
    if (typeof nextConfig.redirects !== "function") {
      assert.fail("nextConfig.redirects is not defined");
    }
    const redirects = await nextConfig.redirects();

    const forgotPasswordRedirect = redirects.find(
      (r: { source: string }) => r.source === "/forgot-password"
    );
    assert.ok(forgotPasswordRedirect, "/forgot-password redirect must be configured");
    assert.equal(forgotPasswordRedirect.destination, "/forgot");
    assert.equal(forgotPasswordRedirect.permanent, true);

    const resetPasswordRedirect = redirects.find(
      (r: { source: string }) => r.source === "/reset-password"
    );
    assert.ok(resetPasswordRedirect, "/reset-password redirect must be configured");
    assert.equal(resetPasswordRedirect.destination, "/reset");
    assert.equal(resetPasswordRedirect.permanent, true);
  });
});
