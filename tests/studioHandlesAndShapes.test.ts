import { describe, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { buildIconSvg } from "../src/lib/email-core/iconSvg";
import { renderSocialLinksHtml } from "../src/lib/studio/shared";
import { INITIAL_STUDIO_DATA } from "../src/lib/studio/types";

describe("Design Studio Handles Aspect Ratio & Social Shapes", () => {
  const freeElementViewPath = path.resolve(__dirname, "../src/components/studio/FreeElementView.tsx");
  const floatingToolbarPath = path.resolve(__dirname, "../src/components/studio/FloatingToolbar.tsx");

  test("FreeElementView disables edge/side handles for image and logo to lock aspect ratio", () => {
    const content = fs.readFileSync(freeElementViewPath, "utf8");
    assert.ok(
      content.includes('element.type === "image" || element.type === "logo"'),
      "Should check for image or logo"
    );
    assert.ok(
      content.includes('activeHandles = ["nw", "ne", "se", "sw"]'),
      "Should only expose corner anchors for media/logo elements"
    );
  });

  test("FloatingToolbar shape selector is enabled for social icons", () => {
    const content = fs.readFileSync(floatingToolbarPath, "utf8");
    assert.ok(
      content.includes('elementType === "social"'),
      "Floating toolbar should allow shape changes on social icons"
    );
  });

  test("buildIconSvg generates square (rx=0) and pill (circle rx=20) icons", () => {
    const squareSvg = buildIconSvg("filled", "#245FD4", "linkedin", "square");
    assert.ok(squareSvg.includes('rx="0"'), "Square icon should have rx=0");

    const roundedSvg = buildIconSvg("filled", "#245FD4", "linkedin", "rounded");
    assert.ok(roundedSvg.includes('rx="8"'), "Rounded icon should have rx=8");

    const pillSvg = buildIconSvg("filled", "#245FD4", "linkedin", "pill");
    assert.ok(pillSvg.includes("<circle"), "Pill icon should use circle geometry");
  });

  test("renderSocialLinksHtml applies shape override to social icon borders and SVGs", () => {
    const htmlSquare = renderSocialLinksHtml(
      INITIAL_STUDIO_DATA,
      "#245FD4",
      "Inter, sans-serif",
      true,
      24,
      "square"
    );
    assert.ok(htmlSquare.includes("border-radius:0px"), "Square HTML should have border-radius:0px");

    const htmlPill = renderSocialLinksHtml(
      INITIAL_STUDIO_DATA,
      "#245FD4",
      "Inter, sans-serif",
      true,
      24,
      "pill"
    );
    assert.ok(htmlPill.includes("border-radius:999px"), "Pill HTML should have border-radius:999px");
  });
});
