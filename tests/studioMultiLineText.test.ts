import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { measureRenderedTextHeight } from "../src/lib/studio/shared";
import { studioReducer, INITIAL_STUDIO_DATA } from "../src/lib/studio/types";
import { generateFreeHtml } from "../src/lib/studio/free/renderFreeHtml";
import type { FreeElement, FreeTextElement, StudioSignatureData } from "../src/types/studio";

describe("Design Studio Multi-Line Text Preservation & Auto-Expansion", () => {
  describe("measureRenderedTextHeight", () => {
    test("returns minimum height for single-line text", () => {
      const hMd = measureRenderedTextHeight({ text: "Single line text", width: 200, size: "md" });
      assert.equal(hMd, 24);

      const hSm = measureRenderedTextHeight({ text: "Small text", width: 200, size: "sm" });
      assert.equal(hSm, 20);

      const hLg = measureRenderedTextHeight({ text: "Large text", width: 200, size: "lg" });
      assert.equal(hLg, 28);
    });

    test("expands height for multi-line text with explicit line breaks", () => {
      const multiLineText = "Line 1\nLine 2\nLine 3";
      const h = measureRenderedTextHeight({ text: multiLineText, width: 200, size: "md" });

      // 3 lines * 18px line-height = 54px > 24px
      assert.ok(h >= 54);
    });

    test("expands height for long wrapped text within bounding box", () => {
      // Long email/string as reported by user in screenshot (46 characters in 120px box)
      const longText = "Aliaunnn@gmail.comanoivewveowiewvivoewve9nvwe";
      const h = measureRenderedTextHeight({ text: longText, width: 120, size: "md" });

      // Long text wraps across at least 2-3 lines in 120px box
      assert.ok(h >= 36);
    });
  });

  describe("studioReducer COMMIT_TEXT_EDIT", () => {
    test("preserves newlines and updates element height", () => {
      const initialElement: FreeTextElement = {
        id: "txt-1",
        type: "text",
        text: "Initial text",
        size: "sm",
        bold: false,
        align: "left",
        x: 100,
        y: 40,
        w: 200,
        h: 24,
      };

      const state: StudioSignatureData = {
        ...INITIAL_STUDIO_DATA,
        canvas: { width: 600, height: 200 },
        elements: [initialElement],
      };

      const updatedText = "First line\nSecond line\nThird line";
      const nextState = studioReducer(state, {
        type: "COMMIT_TEXT_EDIT",
        payload: {
          id: "txt-1",
          text: updatedText,
          height: 56,
        },
      });

      const updatedEl = nextState.elements?.find((el) => el.id === "txt-1") as FreeTextElement;
      assert.equal(updatedEl.text, updatedText);
      assert.equal(updatedEl.h, 56);
    });

    test("pushes elements positioned below downward by deltaH", () => {
      const textEl: FreeTextElement = {
        id: "txt-1",
        type: "text",
        text: "Name",
        size: "sm",
        bold: false,
        align: "left",
        x: 100,
        y: 40,
        w: 200,
        h: 24, // bottom: 64
      };

      const titleEl: FreeTextElement = {
        id: "txt-2",
        type: "text",
        text: "Title",
        size: "sm",
        bold: false,
        align: "left",
        x: 100,
        y: 80, // below txt-1 (gap = 16)
        w: 200,
        h: 20,
      };

      const state: StudioSignatureData = {
        ...INITIAL_STUDIO_DATA,
        canvas: { width: 600, height: 200 },
        elements: [textEl, titleEl],
      };

      // Text expands from 24px to 64px (deltaH = +40px)
      const nextState = studioReducer(state, {
        type: "COMMIT_TEXT_EDIT",
        payload: {
          id: "txt-1",
          text: "First line\nSecond line\nThird line",
          height: 64,
        },
      });

      const updatedText = nextState.elements?.find((el) => el.id === "txt-1");
      const updatedTitle = nextState.elements?.find((el) => el.id === "txt-2");

      assert.equal(updatedText?.h, 64);
      // Title element was at y: 80, now pushed down by 40px -> y: 120
      assert.equal(updatedTitle?.y, 120);
    });

    test("auto-expands canvas height if pushed elements extend beyond current canvas", () => {
      const textEl: FreeTextElement = {
        id: "txt-1",
        type: "text",
        text: "Bottom block",
        size: "sm",
        bold: false,
        align: "left",
        x: 100,
        y: 160,
        w: 200,
        h: 24, // bottom: 184
      };

      const state: StudioSignatureData = {
        ...INITIAL_STUDIO_DATA,
        canvas: { width: 600, height: 200 },
        elements: [textEl],
      };

      // Text expands by 60px -> height 84 -> bottom = 160 + 84 = 244
      const nextState = studioReducer(state, {
        type: "COMMIT_TEXT_EDIT",
        payload: {
          id: "txt-1",
          text: "Line 1\nLine 2\nLine 3\nLine 4",
          height: 84,
        },
      });

      // Canvas height should auto-expand past 200 (244 + 24 = 268 or snapped)
      assert.ok((nextState.canvas?.height ?? 0) >= 268);
    });
  });

  describe("generateFreeHtml multi-line rendering", () => {
    test("converts newlines into <br /> and includes white-space:pre-wrap in output HTML", () => {
      const data: StudioSignatureData = {
        ...INITIAL_STUDIO_DATA,
        themeColor: "#245FD4",
        canvas: { width: 600, height: 200 },
        elements: [
          {
            id: "txt-multiline",
            type: "text",
            x: 20,
            y: 30,
            w: 240,
            h: 56,
            text: "Suite 400\n123 Innovation Drive\nSan Francisco, CA",
            size: "sm",
            bold: false,
            align: "left",
          },
        ],
      };

      const html = generateFreeHtml(data);

      // Must preserve line breaks as <br />
      assert.ok(html.includes("Suite 400<br />123 Innovation Drive<br />San Francisco, CA"));
      // Must include white-space:pre-wrap
      assert.ok(html.includes("white-space:pre-wrap"));
    });
  });
});
