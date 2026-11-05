import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validateWebsiteUrl, isValidWebsiteUrl } from "../src/lib/validation";
import { generateTemplateHtml } from "../src/lib/templates/renderTemplateHtml";

describe("Template Editor Website Validation & Blank Company Name", () => {
  it("rejects invalid, malformed, or insecure website URLs", () => {
    assert.equal(validateWebsiteUrl(""), "Website URL is required.");
    assert.equal(validateWebsiteUrl("   "), "Website URL is required.");
    assert.equal(validateWebsiteUrl("bbnsjsjksj"), "Please enter a valid domain (e.g. www.company.com).");
    assert.equal(validateWebsiteUrl("http://company.com"), "Please enter a secure https:// website URL.");
    assert.equal(validateWebsiteUrl("ftp://company.com"), "Please enter a valid website URL.");
    assert.equal(validateWebsiteUrl("javascript:alert(1)"), "Please enter a valid website URL.");
    assert.equal(validateWebsiteUrl("https://foo"), "Please enter a valid domain (e.g. www.company.com).");
    assert.equal(validateWebsiteUrl("https://foo.c"), "Please enter a valid domain with an extension (e.g. .com, .io).");
  });

  it("accepts valid https URLs and naked domains", () => {
    assert.equal(validateWebsiteUrl("https://example.com"), null);
    assert.equal(validateWebsiteUrl("www.example.com"), null);
    assert.equal(validateWebsiteUrl("example.io"), null);
    assert.equal(validateWebsiteUrl("sub.domain.co.uk"), null);
    assert.equal(isValidWebsiteUrl("https://company.com/team"), true);
    assert.equal(isValidWebsiteUrl("bbnsjsjksj"), false);
  });

  it("does not render https:// visually in minimal-clean template", () => {
    const html = generateTemplateHtml(
      {
        templateId: "minimal-clean",
        fullName: "Test User",
        jobTitle: "Designer",
        email: "test@example.com",
        phone: "+1 555-0100",
        website: "https://www.mycompany.com",
        companyName: "Acme",
        avatarUrl: "",
        themeColor: "#245FD4",
        fontFamily: "Arial",
        layout: "two-column",
        socialIconsStyle: "filled",
        socials: { linkedin: "", twitter: "", facebook: "" },
        optional: {},
      },
      { preview: true }
    );

    // Link must point to secure https://
    assert.match(html, /href="https:\/\/www\.mycompany\.com"/);
    // Display text must NOT contain https://
    assert.ok(html.includes(">www.mycompany.com<"));
    assert.ok(!html.includes(">https://www.mycompany.com<"));
  });

  it("does not render default 'COMPANY' placeholder when companyName is blank in minimal-clean", () => {
    const html = generateTemplateHtml(
      {
        templateId: "minimal-clean",
        fullName: "Test User",
        jobTitle: "Designer",
        email: "test@example.com",
        phone: "+1 555-0100",
        website: "https://www.mycompany.com",
        companyName: "",
        avatarUrl: "",
        themeColor: "#245FD4",
        fontFamily: "Arial",
        layout: "two-column",
        socialIconsStyle: "filled",
        socials: { linkedin: "", twitter: "", facebook: "" },
        optional: {},
      },
      { preview: true }
    );

    assert.ok(!html.includes(">COMPANY<"));
    assert.ok(!html.includes("Tagline goes here"));
  });

  it("does not render default placeholder when companyName is blank in corporate-elegant", () => {
    const html = generateTemplateHtml(
      {
        templateId: "corporate-elegant",
        fullName: "Test User",
        jobTitle: "CEO",
        email: "test@example.com",
        phone: "+1 555-0100",
        website: "https://www.mycompany.com",
        companyName: "",
        avatarUrl: "",
        themeColor: "#245FD4",
        fontFamily: "Arial",
        layout: "two-column",
        socialIconsStyle: "filled",
        socials: { linkedin: "", twitter: "", facebook: "" },
        optional: {},
      },
      { preview: true }
    );

    assert.ok(!html.includes("ACME CORPORATION"));
  });

  it("dynamically detects whether templates support company name, logo, and profile photo", () => {
    const { getTemplateOptionalCapabilities } = require("../src/lib/templates/renderTemplateHtml");

    // minimal-clean has company name & photo, but no company logo
    const minimalCleanCaps = getTemplateOptionalCapabilities("minimal-clean");
    assert.equal(minimalCleanCaps.supportsCompanyName, true);
    assert.equal(minimalCleanCaps.supportsCompanyLogo, false);
    assert.equal(minimalCleanCaps.supportsProfilePhoto, true);

    // modern-dark has no company name and no company logo
    const modernDarkCaps = getTemplateOptionalCapabilities("modern-dark");
    assert.equal(modernDarkCaps.supportsCompanyName, false);
    assert.equal(modernDarkCaps.supportsCompanyLogo, false);
    assert.equal(modernDarkCaps.supportsProfilePhoto, true);

    // professional-minimal has no company name and no company logo
    const profMinimalCaps = getTemplateOptionalCapabilities("professional-minimal");
    assert.equal(profMinimalCaps.supportsCompanyName, false);
    assert.equal(profMinimalCaps.supportsCompanyLogo, false);
    assert.equal(profMinimalCaps.supportsProfilePhoto, true);

    // executive-corporate has company name & company logo, but no profile photo
    const execCorporateCaps = getTemplateOptionalCapabilities("executive-corporate");
    assert.equal(execCorporateCaps.supportsCompanyName, true);
    assert.equal(execCorporateCaps.supportsCompanyLogo, true);
    assert.equal(execCorporateCaps.supportsProfilePhoto, false);

    // pastel-creative supports company name, logo, and photo
    const pastelCreativeCaps = getTemplateOptionalCapabilities("pastel-creative");
    assert.equal(pastelCreativeCaps.supportsCompanyName, true);
    assert.equal(pastelCreativeCaps.supportsCompanyLogo, true);
    assert.equal(pastelCreativeCaps.supportsProfilePhoto, true);
  });
});
