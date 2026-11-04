import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { isValidEmail, sanitizePhone, isValidPhone, isValidPersonName, MAX_LENGTH, MIN_LENGTH } from "../src/lib/validation";
import { generateTemplateHtml } from "../src/lib/templates/renderTemplateHtml";
import { generateFreeHtml } from "../src/lib/studio/free/renderFreeHtml";
import { INITIAL_STUDIO_DATA } from "../src/lib/studio/types";
import type { TemplateSignatureData } from "../src/types/template";
import type { StudioSignatureData, FreeTextElement } from "../src/types/studio";

describe("Field Validation & Sanitization System", () => {
  test("isValidEmail: accepts valid email formats", () => {
    assert.equal(isValidEmail("maruim1677@gmail.com"), true);
    assert.equal(isValidEmail("jane.doe@company.com"), true);
    assert.equal(isValidEmail("alex+filter@sub.domain.org"), true);
    assert.equal(isValidEmail("contact@thenevon.com"), true);
  });

  test("isValidEmail: rejects invalid email formats", () => {
    // Missing @ symbol (the exact bug reported by user)
    assert.equal(isValidEmail("maruim1677gmail.com"), false);
    // Missing domain extension
    assert.equal(isValidEmail("user@gmail"), false);
    // Missing username
    assert.equal(isValidEmail("@company.com"), false);
    // Missing domain
    assert.equal(isValidEmail("user@"), false);
    // Spaces in email
    assert.equal(isValidEmail("user name@company.com"), false);
    // Empty or whitespace
    assert.equal(isValidEmail(""), false);
    assert.equal(isValidEmail("   "), false);
  });

  test("sanitizePhone: strips all letters and non-phone characters", () => {
    // Letters should not be accepted at all
    assert.equal(sanitizePhone("abcdef"), "");
    assert.equal(sanitizePhone("123abc456"), "123456");
    assert.equal(sanitizePhone("Phone: +1 555 123 4567 ext 89"), "+1 555 123 4567  89");
    // Numbers, +, -, space, and parens are preserved
    assert.equal(sanitizePhone("+1 (555) 345-6789"), "+1 (555) 345-6789");
    assert.equal(sanitizePhone("0300-1234567"), "0300-1234567");
    // Special illegal characters like @, #, $, %, ^, & are stripped
    assert.equal(sanitizePhone("+1#555$345%"), "+1555345");
  });

  test("isValidPhone: validates realistic digit length (6-15 digits)", () => {
    // Valid phone numbers
    assert.equal(isValidPhone("+1 (555) 345-6789"), true);
    assert.equal(isValidPhone("03001234567"), true);
    assert.equal(isValidPhone("+44 20 7946 0958"), true);
    assert.equal(isValidPhone("123456"), true); // minimum 6 digits

    // Invalid phone numbers
    assert.equal(isValidPhone(""), false);
    assert.equal(isValidPhone("12345"), false); // too short (< 6 digits)
    assert.equal(isValidPhone("1234567890123456"), false); // too long (16 digits > 15 max)
    assert.equal(isValidPhone("1234567890123456789012345678901234567890"), false); // 40+ digits
  });

  test("Signature Preview: does not accept invalid email into output HTML", () => {
    const invalidEmail = "maruim1677gmail.com";
    const data: TemplateSignatureData = {
      templateId: "minimal-clean",
      layout: "horizontal",
      fullName: "Daniel Wilson",
      jobTitle: "Designer",
      companyName: "Acme Corp",
      phone: "+1 (555) 345-6789",
      email: isValidEmail(invalidEmail) ? invalidEmail : "",
      website: "https://acme.com",
      themeColor: "#245FD4",
      fontFamily: "Inter",
      avatarUrl: "",
      socialIconsStyle: "minimal",
      socials: { linkedin: "", twitter: "", facebook: "", instagram: "" },
      optional: {},
    };

    const html = generateTemplateHtml(data);
    // Assert invalid email was rejected and not included in rendered output
    assert.equal(html.includes(invalidEmail), false);
    assert.equal(html.includes("mailto:maruim1677gmail.com"), false);
  });

  test("Signature Preview: accepts valid email into output HTML", () => {
    const validEmail = "maruim1677@gmail.com";
    const data: TemplateSignatureData = {
      templateId: "minimal-clean",
      layout: "horizontal",
      fullName: "Daniel Wilson",
      jobTitle: "Designer",
      companyName: "Acme Corp",
      phone: "+1 (555) 345-6789",
      email: isValidEmail(validEmail) ? validEmail : "",
      website: "https://acme.com",
      themeColor: "#245FD4",
      fontFamily: "Inter",
      avatarUrl: "",
      socialIconsStyle: "minimal",
      socials: { linkedin: "", twitter: "", facebook: "", instagram: "" },
      optional: {},
    };

    const html = generateTemplateHtml(data);
    assert.equal(html.includes(validEmail), true);
    assert.equal(html.includes("mailto:maruim1677@gmail.com"), true);
  });

  test("MAX_LENGTH constants are configured for all field types", () => {
    assert.equal(MAX_LENGTH.NAME, 80);
    assert.equal(MAX_LENGTH.FIRST_NAME, 20);
    assert.equal(MAX_LENGTH.LAST_NAME, 20);
    assert.equal(MIN_LENGTH.FIRST_NAME, 2);
    assert.equal(MAX_LENGTH.JOB_TITLE, 80);
    assert.equal(MAX_LENGTH.COMPANY, 80);
    assert.equal(MAX_LENGTH.EMAIL, 100);
    assert.equal(MAX_LENGTH.PHONE, 25);
    assert.equal(MAX_LENGTH.WEBSITE, 120);
    assert.equal(MAX_LENGTH.TAGLINE, 120);
    assert.equal(MAX_LENGTH.ADDRESS, 150);
    assert.equal(MAX_LENGTH.DISCLAIMER, 500);
    assert.equal(MAX_LENGTH.SOCIAL_URL, 250);
    assert.equal(MAX_LENGTH.URL, 300);
    assert.equal(MAX_LENGTH.PASSWORD, 128);
    assert.equal(MAX_LENGTH.MESSAGE, 2000);
  });

  test("isValidPersonName: validates names and rejects HTML/markup/control chars", () => {
    // Valid standard and international names
    assert.equal(isValidPersonName("John"), true);
    assert.equal(isValidPersonName("Mary Jane"), true);
    assert.equal(isValidPersonName("O'Connor"), true);
    assert.equal(isValidPersonName("Jean-Luc"), true);
    assert.equal(isValidPersonName("Dr. Smith"), true);

    // Invalid names containing markup or control characters
    assert.equal(isValidPersonName("<script>alert(1)</script>"), false);
    assert.equal(isValidPersonName("Hello<world>"), false);
    assert.equal(isValidPersonName("Bad\x00Name"), false);
  });

  test("Design Studio: does not export invalid email on bound element", () => {
    const invalidEmail = "maruim1677gmail.com";
    const studioData: StudioSignatureData = {
      ...INITIAL_STUDIO_DATA,
      elements: [
        {
          id: "email-1",
          type: "text",
          x: 0,
          y: 0,
          w: 200,
          h: 30,
          text: invalidEmail,
          bind: "email",
        } as FreeTextElement,
      ],
      canvas: { width: 600, height: 200 },
    };

    const html = generateFreeHtml(studioData);
    assert.equal(html.includes(invalidEmail), false);
    assert.equal(html.includes("mailto:"), false);
  });

  test("Design Studio: exports valid email on bound element with safe mailto", () => {
    const validEmail = "maruim1677@gmail.com";
    const studioData: StudioSignatureData = {
      ...INITIAL_STUDIO_DATA,
      elements: [
        {
          id: "email-1",
          type: "text",
          x: 0,
          y: 0,
          w: 200,
          h: 30,
          text: validEmail,
          bind: "email",
        } as FreeTextElement,
      ],
      canvas: { width: 600, height: 200 },
    };

    const html = generateFreeHtml(studioData);
    assert.equal(html.includes(validEmail), true);
    assert.equal(html.includes("href=\"mailto:maruim1677@gmail.com\""), true);
  });

  test("Design Studio: does not export invalid phone with letters on bound element", () => {
    const invalidPhone = "abc-not-a-phone";
    const studioData: StudioSignatureData = {
      ...INITIAL_STUDIO_DATA,
      elements: [
        {
          id: "phone-1",
          type: "text",
          x: 0,
          y: 0,
          w: 200,
          h: 30,
          text: invalidPhone,
          bind: "phone",
        } as FreeTextElement,
      ],
      canvas: { width: 600, height: 200 },
    };

    const html = generateFreeHtml(studioData);
    assert.equal(html.includes(invalidPhone), false);
    assert.equal(html.includes("tel:"), false);
  });

  test("Design Studio: exports valid phone on bound element with safe tel", () => {
    const validPhone = "+1 (555) 345-6789";
    const studioData: StudioSignatureData = {
      ...INITIAL_STUDIO_DATA,
      elements: [
        {
          id: "phone-1",
          type: "text",
          x: 0,
          y: 0,
          w: 200,
          h: 30,
          text: validPhone,
          bind: "phone",
        } as FreeTextElement,
      ],
      canvas: { width: 600, height: 200 },
    };

    const html = generateFreeHtml(studioData);
    assert.equal(html.includes(validPhone), true);
    assert.equal(html.includes("href=\"tel:"), true);
  });

  test("Team Signatures: does not render invalid social icons in HTML preview", async () => {
    const { renderTeamMemberHtml } = await import("../src/lib/team/render");
    const { AVAILABLE_TEMPLATES } = await import("../src/lib/templatesData");
    const defaultData = AVAILABLE_TEMPLATES[0].defaultData;
    const team: Parameters<typeof renderTeamMemberHtml>[0] = {
      id: "team-1",
      ownerId: "owner-1",
      memberLimit: 10,
      kind: "template",
      templateId: "corporate-elegant",
      templateVersion: 1,
      name: "Acme Team",
      data: {
        ...defaultData,
        templateId: "corporate-elegant",
        fullName: "Original Owner",
        email: "owner@acme.com",
      },
      members: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const memberWithInvalidSocials: Parameters<typeof renderTeamMemberHtml>[1] = {
      id: "mem-1",
      name: "Maryam Fatima",
      jobTitle: "HR",
      email: "maruim1677@gmail.com",
      phone: "+1 555 123 4567",
      photoUrl: "",
      socials: [
        { platform: "linkedin", url: "2u7812792" }, // Invalid - does not start with https://
        { platform: "instagram", url: "98w982989298392" }, // Invalid - does not start with https://
        { platform: "x", url: "https://x.com/acme" }, // Valid
      ],
      status: "draft",
      sentAt: null,
      acceptedAt: null,
      tokenExpiresAt: null,
      sendCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const html = renderTeamMemberHtml(team, memberWithInvalidSocials, { preview: true });

    // Valid X/Twitter link should render
    assert.match(html, /twitter|x\.com/i);

    // Invalid LinkedIn and Instagram links should NOT render
    assert.equal(html.includes("2u7812792"), false, "Invalid LinkedIn URL must not be in HTML");
    assert.equal(html.includes("98w982989298392"), false, "Invalid Instagram URL must not be in HTML");
    assert.equal(html.includes("linkedin"), false, "LinkedIn icon should not be rendered for invalid URL");
    assert.equal(html.includes("instagram"), false, "Instagram icon should not be rendered for invalid URL");
  });

  test("Design Studio: does not render invalid social icons in export HTML", () => {
    const studioData: StudioSignatureData = {
      ...INITIAL_STUDIO_DATA,
      elements: [
        {
          id: "soc-1",
          type: "social",
          x: 20,
          y: 50,
          w: 120,
          h: 24,
        },
      ],
      socials: {
        linkedin: "2u7812792", // Invalid
        instagram: "98w982989298392", // Invalid
        facebook: "https://www.facebook.com/acme", // Valid
        twitter: "",
      },
    };

    const html = generateFreeHtml(studioData);

    // Facebook should render
    assert.match(html, /facebook/i);

    // Invalid LinkedIn and Instagram should NOT render
    assert.equal(html.includes("2u7812792"), false, "Invalid LinkedIn URL must not be in HTML");
    assert.equal(html.includes("98w982989298392"), false, "Invalid Instagram URL must not be in HTML");
    assert.equal(html.includes("linkedin"), false, "LinkedIn icon must not render for invalid URL");
    assert.equal(html.includes("instagram"), false, "Instagram icon must not render for invalid URL");
  });
});
