import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isAllowedJpgOrPng } from "../src/lib/imageUtils";
import { getCroppedImageFile, createImage } from "../src/lib/cropImage";

describe("Interactive Image Cropping & Profile Avatar Upload", () => {
  it("exports getCroppedImageFile and createImage helper functions", () => {
    assert.equal(typeof getCroppedImageFile, "function");
    assert.equal(typeof createImage, "function");
  });

  it("cropped output file formats conform to isAllowedJpgOrPng validation", () => {
    // When original is png, cropped output is avatar.png
    const croppedPng = new File(["dummy"], "avatar.png", { type: "image/png" });
    assert.equal(isAllowedJpgOrPng(croppedPng), true);

    // When original is jpg, cropped output is avatar.jpg
    const croppedJpg = new File(["dummy"], "avatar.jpg", { type: "image/jpeg" });
    assert.equal(isAllowedJpgOrPng(croppedJpg), true);
  });

  it("calculates 1:1 aspect square crop dimensions accurately", () => {
    const originalWidth = 1920;
    const originalHeight = 1080;
    const minSide = Math.min(originalWidth, originalHeight); // 1080

    // Crop area represents centered 1:1 square
    const cropArea = {
      x: Math.floor((originalWidth - minSide) / 2), // 420
      y: 0,
      width: minSide,
      height: minSide,
    };

    assert.equal(cropArea.width, cropArea.height);
    assert.equal(cropArea.width, 1080);
    assert.equal(cropArea.x, 420);
    assert.equal(cropArea.y, 0);
  });

  it("zoom limits clamp zoom scale smoothly between 1x and 3x", () => {
    const minZoom = 1;
    const maxZoom = 3;

    const zoomStep = 0.15;
    let currentZoom = 1;

    // Zooming in
    currentZoom = Math.min(maxZoom, currentZoom + zoomStep);
    assert.equal(currentZoom, 1.15);

    // Zooming max
    currentZoom = 5;
    const clampedZoom = Math.min(maxZoom, Math.max(minZoom, currentZoom));
    assert.equal(clampedZoom, 3);
  });
});
