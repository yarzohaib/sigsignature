import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { findFreeSpot, snap, clampToCanvas } from "../src/lib/studio/free/geometry";
import { studioReducer, INITIAL_STUDIO_DATA } from "../src/lib/studio/types";
import type { FreeElement, StudioSignatureData } from "../src/types/studio";

describe("Studio Element Centering & Smart Vertical Stacking", () => {
  const canvas = { width: 600, height: 200 };

  test("spawns the first element horizontally and vertically centered on an empty canvas", () => {
    const size = { w: 200, h: 24 };
    const spot = findFreeSpot(size, [], canvas, "rounded");

    const expectedX = Math.round((canvas.width - size.w) / 2); // (600 - 200) / 2 = 200
    const expectedY = snap((canvas.height - size.h) / 2, 4); // (200 - 24) / 2 = 88

    assert.equal(spot.x, expectedX);
    assert.equal(spot.y, expectedY);
  });

  test("spawns elements with different widths horizontally centered", () => {
    // Team Field Website: w = 180, h = 20
    const spotWebsite = findFreeSpot({ w: 180, h: 20 }, [], canvas, "rounded");
    assert.equal(spotWebsite.x, Math.round((600 - 180) / 2)); // 210

    // CTA Button: w = 140, h = 36
    const spotCta = findFreeSpot({ w: 140, h: 36 }, [], canvas, "rounded");
    assert.equal(spotCta.x, Math.round((600 - 140) / 2)); // 230

    // Divider: w = 240, h = 1
    const spotDivider = findFreeSpot({ w: 240, h: 1 }, [], canvas, "rounded");
    assert.equal(spotDivider.x, Math.round((600 - 240) / 2)); // 180
  });

  test("stacks subsequent elements vertically below existing elements with a 16px gap when center is occupied", () => {
    const firstEl: FreeElement = {
      id: "el_1",
      type: "text",
      text: "John Doe",
      size: "md",
      bold: true,
      align: "left",
      x: 200,
      y: 88,
      w: 200,
      h: 24,
    };

    // Adding Team Field "Website" (w: 180, h: 20)
    const spot = findFreeSpot({ w: 180, h: 20 }, [firstEl], canvas, "rounded");

    // Must be horizontally centered: (600 - 180) / 2 = 210
    assert.equal(spot.x, 210);

    // Must stack cleanly below firstEl with a 16px gap: 88 + 24 + 16 = 128
    assert.equal(spot.y, 128);
  });

  test("sequentially stacks multiple elements without overlapping", () => {
    const elements: FreeElement[] = [];

    // 1. Name text
    const spot1 = findFreeSpot({ w: 200, h: 24 }, elements, canvas, "rounded");
    elements.push({
      id: "el_1",
      type: "text",
      text: "John Doe",
      size: "md",
      bold: true,
      align: "left",
      x: spot1.x,
      y: spot1.y,
      w: 200,
      h: 24,
    });
    assert.equal(spot1.x, 200);
    assert.equal(spot1.y, 88);

    // 2. Job title
    const spot2 = findFreeSpot({ w: 180, h: 20 }, elements, canvas, "rounded");
    elements.push({
      id: "el_2",
      type: "text",
      text: "Software Engineer",
      size: "sm",
      bold: false,
      align: "left",
      x: spot2.x,
      y: spot2.y,
      w: 180,
      h: 20,
    });
    assert.equal(spot2.x, 210);
    assert.equal(spot2.y, 128); // 88 + 24 + 16 = 128

    // 3. Website team field
    const spot3 = findFreeSpot({ w: 180, h: 20 }, elements, canvas, "rounded");
    elements.push({
      id: "el_3",
      type: "text",
      text: "https://example.com",
      size: "sm",
      bold: false,
      align: "left",
      x: spot3.x,
      y: spot3.y,
      w: 180,
      h: 20,
    });
    assert.equal(spot3.x, 210);
    assert.equal(spot3.y, 164); // 128 + 20 + 16 = 164

    // 4. CTA button (w: 140, h: 36)
    const spot4 = findFreeSpot({ w: 140, h: 36 }, elements, canvas, "rounded");
    elements.push({
      id: "el_4",
      type: "cta",
      label: "Book a Call",
      url: "",
      x: spot4.x,
      y: spot4.y,
      w: 140,
      h: 36,
    });
    assert.equal(spot4.x, 230); // (600 - 140) / 2 = 230
    assert.equal(spot4.y, 200); // 164 + 20 + 16 = 200
  });

  test("handles pill shape boundary constraints while centering", () => {
    const spot = findFreeSpot({ w: 200, h: 24 }, [], canvas, "pill");
    assert.equal(spot.x, 200);
    assert.equal(spot.y, 88);

    // Verify clamped position stays identical
    const clamped = clampToCanvas({ x: spot.x, y: spot.y, w: 200, h: 24 }, canvas, "pill");
    assert.equal(clamped.x, spot.x);
    assert.equal(clamped.y, spot.y);
  });

  test("studioReducer ADD_ELEMENT auto-expands canvas height without clipping", () => {
    let state: StudioSignatureData = {
      ...INITIAL_STUDIO_DATA,
      canvas: { width: 600, height: 200 },
      elements: [],
    };

    // Add element 1
    const currentCanvas1 = state.canvas || { width: 600, height: 200 };
    const spot1 = findFreeSpot({ w: 200, h: 24 }, state.elements || [], currentCanvas1, "rounded");
    state = studioReducer(state, {
      type: "ADD_ELEMENT",
      payload: {
        id: "el_1",
        type: "text",
        text: "Name",
        size: "md",
        bold: true,
        align: "left",
        x: spot1.x,
        y: spot1.y,
        w: 200,
        h: 24,
      },
    });

    // Add element 2
    const currentCanvas2 = state.canvas || { width: 600, height: 200 };
    const spot2 = findFreeSpot({ w: 180, h: 20 }, state.elements || [], currentCanvas2, "rounded");
    state = studioReducer(state, {
      type: "ADD_ELEMENT",
      payload: {
        id: "el_2",
        type: "text",
        text: "Title",
        size: "sm",
        bold: false,
        align: "left",
        x: spot2.x,
        y: spot2.y,
        w: 180,
        h: 20,
      },
    });

    // Add element 3
    const currentCanvas3 = state.canvas || { width: 600, height: 200 };
    const spot3 = findFreeSpot({ w: 180, h: 20 }, state.elements || [], currentCanvas3, "rounded");
    state = studioReducer(state, {
      type: "ADD_ELEMENT",
      payload: {
        id: "el_3",
        type: "text",
        text: "Website",
        size: "sm",
        bold: false,
        align: "left",
        x: spot3.x,
        y: spot3.y,
        w: 180,
        h: 20,
      },
    });

    // Add element 4 (CTA button)
    const currentCanvas4 = state.canvas || { width: 600, height: 200 };
    const spot4 = findFreeSpot({ w: 140, h: 36 }, state.elements || [], currentCanvas4, "rounded");
    state = studioReducer(state, {
      type: "ADD_ELEMENT",
      payload: {
        id: "el_4",
        type: "cta",
        label: "Book a Call",
        url: "",
        x: spot4.x,
        y: spot4.y,
        w: 140,
        h: 36,
      },
    });

    assert.equal(state.elements?.length, 4);
    assert.equal(state.elements?.[0].x, 200);
    assert.equal(state.elements?.[0].y, 88);
    assert.equal(state.elements?.[1].x, 210);
    assert.equal(state.elements?.[1].y, 128);
    assert.equal(state.elements?.[2].x, 210);
    assert.equal(state.elements?.[2].y, 164);
    assert.equal(state.elements?.[3].x, 230);
    assert.equal(state.elements?.[3].y, 200);

    // Canvas height should have auto-expanded past 200 to accommodate element 4
    assert.ok((state.canvas?.height || 0) >= 236);
  });
});
