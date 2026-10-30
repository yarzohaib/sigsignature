import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { generateFreeHtml } from "../src/lib/studio/free/renderFreeHtml";
import { studioReducer, INITIAL_STUDIO_DATA } from "../src/lib/studio/types";
import type {
  StudioSignatureData,
  FreeTextElement,
  FreeCtaElement,
  FreeDividerElement,
} from "../src/types/studio";

describe("Design Studio Per-Element Font & Color Styling", () => {
  test("renders text element with per-element font family and custom color", () => {
    const data: StudioSignatureData = {
      ...INITIAL_STUDIO_DATA,
      fontFamily: "Inter",
      themeColor: "#245FD4",
      canvas: { width: 600, height: 200 },
      elements: [
        {
          id: "text-custom",
          type: "text",
          x: 20,
          y: 40,
          w: 200,
          h: 24,
          text: "Senior Product Designer",
          fontFamily: "Georgia",
          color: "#059669",
          size: "md",
          bold: false,
          align: "left",
        } as FreeTextElement,
        {
          id: "text-default",
          type: "text",
          x: 20,
          y: 80,
          w: 200,
          h: 24,
          text: "ACME Corporation",
          size: "sm",
          bold: false,
          align: "left",
        } as FreeTextElement,
      ],
    };

    const html = generateFreeHtml(data);

    // 1. Custom element should have Georgia font and custom color
    assert.match(html, /Georgia/);
    assert.match(html, /#059669/i);

    // 2. Default element should fall back to Inter
    assert.match(html, /Inter/);
  });

  test("renders CTA element with per-element font family, background color, and text color", () => {
    const data: StudioSignatureData = {
      ...INITIAL_STUDIO_DATA,
      fontFamily: "Inter",
      themeColor: "#245FD4",
      canvas: { width: 600, height: 200 },
      elements: [
        {
          id: "cta-custom",
          type: "cta",
          x: 20,
          y: 40,
          w: 160,
          h: 36,
          label: "Book Appointment",
          url: "https://example.com/book",
          fontFamily: "Roboto",
          color: "#DC2626",
          textColor: "#FEF08A",
        } as FreeCtaElement,
      ],
    };

    const html = generateFreeHtml(data);

    // CTA background color, text color, and font
    assert.match(html, /background-color:#DC2626/i);
    assert.match(html, /color:#FEF08A/i);
    assert.match(html, /Roboto/);
    assert.match(html, /Book Appointment/);
  });

  test("renders divider element with per-element color", () => {
    const data: StudioSignatureData = {
      ...INITIAL_STUDIO_DATA,
      themeColor: "#245FD4",
      canvas: { width: 600, height: 200 },
      elements: [
        {
          id: "div-custom",
          type: "divider",
          x: 20,
          y: 60,
          w: 200,
          h: 1,
          orientation: "horizontal",
          thickness: 2,
          color: "#7C3AED",
        } as FreeDividerElement,
      ],
    };

    const html = generateFreeHtml(data);
    assert.match(html, /#7C3AED/i);
  });

  test("studioReducer handles SPLIT_TEXT_ELEMENT action correctly", () => {
    const initialData: StudioSignatureData = {
      ...INITIAL_STUDIO_DATA,
      elements: [
        {
          id: "multiline-text",
          type: "text",
          x: 40,
          y: 30,
          w: 240,
          h: 60,
          text: "John Doe\njohn@example.com\n+1 555 123 4567",
          fontFamily: "DM Sans",
          color: "#1E293B",
          size: "lg",
          bold: true,
          align: "left",
        } as FreeTextElement,
      ],
    };

    const state = studioReducer(initialData, {
      type: "SPLIT_TEXT_ELEMENT",
      payload: { id: "multiline-text" },
    });

    assert.equal(state.elements?.length, 3, "Multiline text should split into 3 elements");

    const [first, second, third] = state.elements as FreeTextElement[];

    // First line
    assert.equal(first.id, "multiline-text");
    assert.equal(first.text, "John Doe");
    assert.equal(first.fontFamily, "DM Sans");
    assert.equal(first.color, "#1E293B");
    assert.equal(first.y, 30);

    // Second line (email)
    assert.equal(second.text, "john@example.com");
    assert.equal(second.bind, "email");
    assert.equal(second.icon, "email");
    assert.equal(second.fontFamily, "DM Sans");
    assert.equal(second.color, "#1E293B");
    assert.equal(second.y > first.y, true);

    // Third line (phone)
    assert.equal(third.text, "+1 555 123 4567");
    assert.equal(third.bind, "phone");
    assert.equal(third.icon, "phone");
    assert.equal(third.fontFamily, "DM Sans");
    assert.equal(third.color, "#1E293B");
    assert.equal(third.y > second.y, true);
  });
});
