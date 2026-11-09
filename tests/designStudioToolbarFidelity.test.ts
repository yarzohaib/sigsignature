import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("Design Studio Floating Toolbar & Dropdown Fidelity", async (t) => {
  await t.test("Select component menu has z-index high enough (z-[70]) to stack above FloatingToolbar (z-60)", () => {
    const selectFile = fs.readFileSync(
      path.resolve(process.cwd(), "src/components/ui/Select.tsx"),
      "utf8"
    );
    assert.match(
      selectFile,
      /className=\{`z-\[70\]/,
      "Select dropdown menu should have z-[70] so it renders above FloatingToolbar (z-60) and panels"
    );
  });

  await t.test("FloatingToolbar updatePosition clamps left boundary strictly to toolsPanelRight + 8", () => {
    const toolbarFile = fs.readFileSync(
      path.resolve(process.cwd(), "src/components/studio/FloatingToolbar.tsx"),
      "utf8"
    );
    assert.match(
      toolbarFile,
      /const minViewportLeft = toolsPanelRight > 0 \? toolsPanelRight \+ 8 : 8;/,
      "Toolbar must clamp its minimum left position to toolsPanelRight + 8"
    );
    assert.match(
      toolbarFile,
      /left = Math\.max\(minViewportLeft, Math\.min\(left, maxViewportLeft\)\);/,
      "Toolbar position must be clamped within minViewportLeft and maxViewportLeft"
    );
  });

  await t.test("FloatingToolbar has responsive max-width and compact split lines button", () => {
    const toolbarFile = fs.readFileSync(
      path.resolve(process.cwd(), "src/components/studio/FloatingToolbar.tsx"),
      "utf8"
    );
    assert.match(
      toolbarFile,
      /max-w-\[calc\(100vw-16px\)\]/,
      "Floating toolbar must use responsive max-width to avoid clipping on narrow viewports"
    );
    assert.match(
      toolbarFile,
      /<span>Split lines<\/span>/,
      "Split lines button text should be compact ('Split lines') to prevent horizontal overflow"
    );
  });

  await t.test("FreeElementView prevents top badge clipping when element.y < 14", () => {
    const elementViewFile = fs.readFileSync(
      path.resolve(process.cwd(), "src/components/studio/FreeElementView.tsx"),
      "utf8"
    );
    assert.match(
      elementViewFile,
      /const isNearTopEdge = element\.y < 14;/,
      "FreeElementView should detect if element is near the top edge"
    );
    assert.match(
      elementViewFile,
      /isNearTopEdge \? "top-0\.5" : "-top-3\.5"/,
      "Top badge must position inside element bounds (top-0.5) when element is positioned at y < 14"
    );
  });

  await t.test("MOVE_ELEMENT preserves canvas height and does not glitch-expand canvas when dragged to bottom boundary", () => {
    const typesFile = fs.readFileSync(
      path.resolve(process.cwd(), "src/lib/studio/types.ts"),
      "utf8"
    );
    // Ensure MOVE_ELEMENT does not recalculate nextHeight with maxBottom + 24
    const moveElementBlock = typesFile.slice(
      typesFile.indexOf('case "MOVE_ELEMENT":'),
      typesFile.indexOf('case "RESIZE_ELEMENT":')
    );
    assert.doesNotMatch(
      moveElementBlock,
      /snap\(maxBottom \+ 24/,
      "MOVE_ELEMENT should not auto-expand canvas height with snap(maxBottom + 24) on drop"
    );
  });
});
