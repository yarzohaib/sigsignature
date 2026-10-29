import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { generateFreeHtml } from "../src/lib/studio/free/renderFreeHtml";
import { migrateFlowToFree } from "../src/lib/studio/free/migrate";
import { INITIAL_STUDIO_DATA } from "../src/lib/studio/types";
import type { StudioSignatureData, FreeTextElement } from "../src/types/studio";

describe("Design Studio Contact Icons & Free HTML Export", () => {
  test("renders text element with icon phone as nested table with absolute https .png URL and tel: link", () => {
    const data: StudioSignatureData = {
      ...INITIAL_STUDIO_DATA,
      themeColor: "#245FD4",
      canvas: { width: 600, height: 200 },
      elements: [
        {
          id: "phone-1",
          type: "text",
          x: 20,
          y: 40,
          w: 200,
          h: 24,
          text: "+1 (555) 345-6789",
          bind: "phone",
          icon: "phone",
          size: "sm",
          bold: false,
          align: "left",
        } as FreeTextElement,
      ],
    };

    const html = generateFreeHtml(data);

    // 1. Must contain absolute https .png URL
    assert.match(
      html,
      /https:\/\/[^"']+\/api\/icons\/minimal\/245fd4\/phone\.png/
    );

    // 2. Must render nested table with 22px icon cell and 178px text div (200 - 22)
    assert.match(html, /<table[^>]*width="200"/);
    assert.match(html, /<td[^>]*width="22"/);
    assert.match(html, /width:178px/);

    // 3. Must render safe tel: link
    assert.match(html, /href="tel:\+15553456789"/);

    // 4. Must NOT contain inline svg or data: URIs
    assert.equal(html.includes("<svg"), false, "HTML must not contain inline SVG");
    assert.equal(html.includes("data:"), false, "HTML must not contain data URI");
  });

  test("renders text element with icon email as nested table with absolute https .png URL and mailto: link", () => {
    const data: StudioSignatureData = {
      ...INITIAL_STUDIO_DATA,
      themeColor: "#245FD4",
      canvas: { width: 600, height: 200 },
      elements: [
        {
          id: "email-1",
          type: "text",
          x: 20,
          y: 40,
          w: 220,
          h: 24,
          text: "alex@example.com",
          bind: "email",
          icon: "email",
          size: "sm",
          bold: false,
          align: "left",
        } as FreeTextElement,
      ],
    };

    const html = generateFreeHtml(data);

    assert.match(
      html,
      /https:\/\/[^"']+\/api\/icons\/minimal\/245fd4\/email\.png/
    );
    assert.match(html, /<table[^>]*width="220"/);
    assert.match(html, /<td[^>]*width="22"/);
    assert.match(html, /width:198px/);
    assert.match(html, /href="mailto:alex@example\.com"/);
    assert.equal(html.includes("<svg"), false);
    assert.equal(html.includes("data:"), false);
  });

  test("renders text element with icon website as nested table with absolute https .png URL and normalized link", () => {
    const data: StudioSignatureData = {
      ...INITIAL_STUDIO_DATA,
      themeColor: "#059669",
      canvas: { width: 600, height: 200 },
      elements: [
        {
          id: "web-1",
          type: "text",
          x: 20,
          y: 40,
          w: 240,
          h: 24,
          text: "example.com",
          bind: "website",
          icon: "website",
          size: "sm",
          bold: false,
          align: "left",
        } as FreeTextElement,
      ],
    };

    const html = generateFreeHtml(data);

    assert.match(
      html,
      /https:\/\/[^"']+\/api\/icons\/minimal\/059669\/website\.png/
    );
    assert.match(html, /<table[^>]*width="240"/);
    assert.match(html, /<td[^>]*width="22"/);
    assert.match(html, /width:218px/);
    assert.match(html, /href="https:\/\/example\.com"/);
    assert.equal(html.includes("<svg"), false);
    assert.equal(html.includes("data:"), false);
  });

  test("renders text element with icon address as nested table with absolute https .png URL and text", () => {
    const data: StudioSignatureData = {
      ...INITIAL_STUDIO_DATA,
      themeColor: "#245FD4",
      canvas: { width: 600, height: 200 },
      elements: [
        {
          id: "addr-1",
          type: "text",
          x: 20,
          y: 40,
          w: 250,
          h: 24,
          text: "742 Evergreen Terrace, Springfield",
          icon: "address",
          size: "sm",
          bold: false,
          align: "left",
        } as FreeTextElement,
      ],
    };

    const html = generateFreeHtml(data);

    assert.match(
      html,
      /https:\/\/[^"']+\/api\/icons\/minimal\/245fd4\/address\.png/
    );
    assert.match(html, /<table[^>]*width="250"/);
    assert.match(html, /<td[^>]*width="22"/);
    assert.match(html, /width:228px/);
    assert.equal(html.includes("742 Evergreen Terrace, Springfield"), true);
    assert.equal(html.includes("<svg"), false);
    assert.equal(html.includes("data:"), false);
  });

  test("element without icon renders exactly as before (plain div without nested table)", () => {
    const data: StudioSignatureData = {
      ...INITIAL_STUDIO_DATA,
      themeColor: "#245FD4",
      canvas: { width: 600, height: 200 },
      elements: [
        {
          id: "title-1",
          type: "text",
          x: 20,
          y: 40,
          w: 200,
          h: 24,
          text: "Senior Product Designer",
          size: "md",
          bold: false,
          align: "left",
        } as FreeTextElement,
      ],
    };

    const html = generateFreeHtml(data);

    // Must NOT contain an icon <img> or a nested table with width 22
    assert.equal(html.includes("/api/icons/"), false);
    assert.equal(html.includes('width="22"'), false);
    assert.match(html, /Senior Product Designer/);
    assert.match(html, /width:200px;max-width:200px;/);
  });

  test("migrateFlowToFree sets default icon and bind on phone, email, and website", () => {
    const legacyData: StudioSignatureData = {
      ...INITIAL_STUDIO_DATA,
      fullName: "Daniel Wilson",
      jobTitle: "Designer",
      companyName: "Acme",
      phone: "+1 555 123 4567",
      email: "daniel@example.com",
      website: "https://acme.com",
      themeColor: "#245FD4",
      elements: [],
    };

    const migrated = migrateFlowToFree(legacyData);
    const elements = migrated.elements || [];

    const phoneEl = elements.find((el) => (el as FreeTextElement).bind === "phone") as FreeTextElement;
    assert.ok(phoneEl, "Phone element should have bind: phone");
    assert.equal(phoneEl.icon, "phone", "Phone element should have icon: phone");

    const emailEl = elements.find((el) => (el as FreeTextElement).bind === "email") as FreeTextElement;
    assert.ok(emailEl, "Email element should have bind: email");
    assert.equal(emailEl.icon, "email", "Email element should have icon: email");

    const webEl = elements.find((el) => (el as FreeTextElement).bind === "website") as FreeTextElement;
    assert.ok(webEl, "Website element should have bind: website");
    assert.equal(webEl.icon, "website", "Website element should have icon: website");
  });
});
