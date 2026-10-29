import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { AVAILABLE_TEMPLATES } from "../src/lib/templatesData";
import { generateTemplateHtml } from "../src/lib/templates/renderTemplateHtml";
import { GET as iconRouteHandler } from "../src/app/api/icons/[style]/[color]/[network]/route";
import { CONTACT_ICONS, isContactIcon, SOCIAL_NETWORKS } from "../src/lib/email-core/iconGlyphs";
import type { TemplateSignatureData } from "../src/types/template";

const TEMPLATES_WITH_CONTACT_ICONS = [
  "pastel-creative",
  "professional-minimal",
  "modern-dark",
  "corporate-elegant",
  "bold-gradient",
  "minimal-clean",
];

const FULL_SIGNATURE_DATA: TemplateSignatureData = {
  templateId: "minimal-clean",
  layout: "horizontal",
  fullName: "Jane Doe",
  jobTitle: "Chief Executive Officer",
  companyName: "Acme Innovations Ltd",
  phone: "+1 (555) 234-5678",
  email: "jane.doe@example.com",
  website: "https://www.example.com",
  themeColor: "#245FD4",
  fontFamily: "Inter",
  avatarUrl: "https://www.sigsignature.com/jane-doe.png",
  socialIconsStyle: "minimal",
  socials: {
    linkedin: "https://linkedin.com/in/janedoe",
    twitter: "https://twitter.com/janedoe",
    facebook: "https://facebook.com/janedoe",
    instagram: "https://instagram.com/janedoe",
    github: "https://github.com/janedoe",
    youtube: "https://youtube.com/janedoe",
    website: "https://www.example.com",
  },
  optional: {
    address: "123 Market St, Suite 400, San Francisco, CA",
    tagline: "Empowering Next-Gen Signatures",
    disclaimer: "CONFIDENTIALITY NOTICE: This transmission is intended only for the addressee.",
  },
};

const PNG_MAGIC_BYTES = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

describe("Contact Icons System & Template Export", () => {
  test("icon system constants include contact glyphs", () => {
    assert.ok(CONTACT_ICONS.includes("phone"));
    assert.ok(CONTACT_ICONS.includes("email"));
    assert.ok(CONTACT_ICONS.includes("website"));
    assert.ok(CONTACT_ICONS.includes("address"));

    assert.ok(isContactIcon("phone"));
    assert.ok(isContactIcon("email"));
    assert.ok(isContactIcon("website"));
    assert.ok(isContactIcon("address"));
    assert.strictEqual(isContactIcon("linkedin"), false);

    assert.ok(SOCIAL_NETWORKS.includes("phone"));
    assert.ok(SOCIAL_NETWORKS.includes("email"));
    assert.ok(SOCIAL_NETWORKS.includes("address"));
  });

  test("exported HTML from every template contains no <svg and no data: URIs", () => {
    for (const template of AVAILABLE_TEMPLATES) {
      const data: TemplateSignatureData = {
        ...FULL_SIGNATURE_DATA,
        templateId: template.id,
      };

      const html = generateTemplateHtml(data);

      assert.strictEqual(
        html.includes("<svg"),
        false,
        `Template "${template.id}" exported HTML must not contain inline <svg>`
      );
      assert.strictEqual(
        html.includes("data:"),
        false,
        `Template "${template.id}" exported HTML must not contain data: URIs`
      );
    }
  });

  test("the 6 contact-icon templates render phone, email, and website as absolute https <img> ending in .png", () => {
    for (const templateId of TEMPLATES_WITH_CONTACT_ICONS) {
      const data: TemplateSignatureData = {
        ...FULL_SIGNATURE_DATA,
        templateId,
      };

      const html = generateTemplateHtml(data);

      // Verify phone icon
      const phoneMatch = html.match(/<img[^>]+src="([^">]+)"[^>]*alt="Phone"/i);
      assert.ok(
        phoneMatch,
        `Template "${templateId}" must render an <img> with alt="Phone"`
      );
      const phoneSrc = phoneMatch[1];
      assert.ok(
        phoneSrc.startsWith("https://") && phoneSrc.endsWith("/phone.png"),
        `Phone src must be absolute https ending in /phone.png, got: ${phoneSrc}`
      );

      // Verify email icon
      const emailMatch = html.match(/<img[^>]+src="([^">]+)"[^>]*alt="Email"/i);
      assert.ok(
        emailMatch,
        `Template "${templateId}" must render an <img> with alt="Email"`
      );
      const emailSrc = emailMatch[1];
      assert.ok(
        emailSrc.startsWith("https://") && emailSrc.endsWith("/email.png"),
        `Email src must be absolute https ending in /email.png, got: ${emailSrc}`
      );

      // Verify website icon
      const websiteMatch = html.match(/<img[^>]+src="([^">]+)"[^>]*alt="Website"/i);
      assert.ok(
        websiteMatch,
        `Template "${templateId}" must render an <img> with alt="Website"`
      );
      const websiteSrc = websiteMatch[1];
      assert.ok(
        websiteSrc.startsWith("https://") && websiteSrc.endsWith("/website.png"),
        `Website src must be absolute https ending in /website.png, got: ${websiteSrc}`
      );
    }
  });

  test("the 6 contact-icon templates use table rows with fixed width icon cells and valign middle", () => {
    for (const templateId of TEMPLATES_WITH_CONTACT_ICONS) {
      const data: TemplateSignatureData = {
        ...FULL_SIGNATURE_DATA,
        templateId,
      };

      const html = generateTemplateHtml(data);

      // Must have table cell with width="20"
      assert.ok(
        html.includes('width="20"'),
        `Template "${templateId}" must contain icon cell with width="20"`
      );
      // Must not contain flex, gap, or margin on contact table
      assert.ok(
        !html.includes("display:flex") && !html.includes("display: flex"),
        `Template "${templateId}" must not use display:flex in tables`
      );
    }
  });

  test("API route returns 200 image/png with long cache headers for all contact glyphs and styles", async () => {
    const styles = ["filled", "outline", "circle", "minimal"] as const;
    const contactNetworks = ["phone", "email", "address", "website"] as const;
    // Test both a palette color (#245FD4 -> "245fd4") and a non-palette color ("a855f7")
    const testColors = ["245fd4", "a855f7"];

    for (const style of styles) {
      for (const network of contactNetworks) {
        for (const color of testColors) {
          const req = new Request(`https://www.sigsignature.com/api/icons/${style}/${color}/${network}.png`);
          const res = await iconRouteHandler(req, {
            params: Promise.resolve({ style, color, network: `${network}.png` }),
          });

          assert.strictEqual(
            res.status,
            200,
            `Expected 200 for ${style}/${color}/${network}.png, got ${res.status}`
          );
          const contentType = res.headers.get("content-type");
          assert.ok(
            contentType?.includes("image/png"),
            `Expected image/png content-type, got ${contentType}`
          );
          const cacheControl = res.headers.get("cache-control");
          assert.ok(
            cacheControl?.includes("public") && cacheControl?.includes("max-age=31536000"),
            `Expected immutable cache headers, got ${cacheControl}`
          );

          const arrayBuffer = await res.arrayBuffer();
          const buf = Buffer.from(arrayBuffer);
          assert.ok(buf.length > 100, `Buffer should have valid PNG length, got ${buf.length}`);
          assert.strictEqual(
            buf.subarray(0, 8).compare(PNG_MAGIC_BYTES),
            0,
            `Buffer must begin with valid PNG magic bytes`
          );
        }
      }
    }
  });
});
