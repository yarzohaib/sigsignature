import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isAllowedJpgOrPng } from "../src/lib/imageUtils";

describe("Strict Media Upload Validation (Only .jpg and .png)", () => {
  it("accepts valid .jpg files", () => {
    const file1 = new File(["dummy"], "avatar.jpg", { type: "image/jpeg" });
    const file2 = new File(["dummy"], "photo.JPG", { type: "image/jpeg" });
    const file3 = new File(["dummy"], "logo.jpg", { type: "image/jpg" });

    assert.equal(isAllowedJpgOrPng(file1), true);
    assert.equal(isAllowedJpgOrPng(file2), true);
    assert.equal(isAllowedJpgOrPng(file3), true);
  });

  it("accepts valid .png files", () => {
    const file1 = new File(["dummy"], "avatar.png", { type: "image/png" });
    const file2 = new File(["dummy"], "logo.PNG", { type: "image/png" });

    assert.equal(isAllowedJpgOrPng(file1), true);
    assert.equal(isAllowedJpgOrPng(file2), true);
  });

  it("rejects .jpeg files", () => {
    const file1 = new File(["dummy"], "avatar.jpeg", { type: "image/jpeg" });
    const file2 = new File(["dummy"], "photo.JPEG", { type: "image/jpeg" });

    assert.equal(isAllowedJpgOrPng(file1), false);
    assert.equal(isAllowedJpgOrPng(file2), false);
  });

  it("rejects .webp files", () => {
    const file1 = new File(["dummy"], "avatar.webp", { type: "image/webp" });
    const file2 = new File(["dummy"], "photo.WEBP", { type: "image/webp" });

    assert.equal(isAllowedJpgOrPng(file1), false);
    assert.equal(isAllowedJpgOrPng(file2), false);
  });

  it("rejects other formats (.svg, .gif, .bmp, .heic, .pdf)", () => {
    const svg = new File(["<svg/>"], "image.svg", { type: "image/svg+xml" });
    const gif = new File(["dummy"], "image.gif", { type: "image/gif" });
    const bmp = new File(["dummy"], "image.bmp", { type: "image/bmp" });
    const pdf = new File(["dummy"], "doc.pdf", { type: "application/pdf" });

    assert.equal(isAllowedJpgOrPng(svg), false);
    assert.equal(isAllowedJpgOrPng(gif), false);
    assert.equal(isAllowedJpgOrPng(bmp), false);
    assert.equal(isAllowedJpgOrPng(pdf), false);
  });
});
