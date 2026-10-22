import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Footer Social Icons Figma Alignment Suite", () => {
  const footerFilePath = path.resolve(
    __dirname,
    "../src/components/landing/Footer.tsx"
  );
  const globalsCssPath = path.resolve(__dirname, "../src/app/globals.css");

  test("1. Footer social icons container specifies exact 10px gap matching Figma", () => {
    assert.ok(fs.existsSync(footerFilePath), "Footer.tsx must exist");
    const content = fs.readFileSync(footerFilePath, "utf-8");

    // Must use 10px gap matching Frame 1984079118
    assert.ok(
      content.includes("gap-[10px]"),
      "Footer social icons container must have gap-[10px]"
    );
  });

  test("2. globals.css defines .footer-social-btn with 30px dimensions, #FCFCFC fill, and linear gradient border", () => {
    assert.ok(fs.existsSync(globalsCssPath), "globals.css must exist");
    const css = fs.readFileSync(globalsCssPath, "utf-8");

    assert.ok(
      css.includes(".footer-social-btn"),
      "globals.css must define .footer-social-btn"
    );
    assert.ok(
      css.includes("width: 30px"),
      "Must have width: 30px"
    );
    assert.ok(
      css.includes("height: 30px"),
      "Must have height: 30px"
    );
    assert.ok(
      css.includes("#FCFCFC"),
      "Must have #FCFCFC background color"
    );
    assert.ok(
      css.includes("#245FD4") && css.includes("#022977"),
      "Must have linear gradient from #245FD4 to #022977"
    );
    assert.ok(
      css.includes("border: 1px solid transparent"),
      "Must use 1px border"
    );
  });

  test("3. Footer social icons include Facebook, Instagram, and LinkedIn with correct accessibility and brand color", () => {
    const content = fs.readFileSync(footerFilePath, "utf-8");

    // Verify Facebook
    assert.ok(content.includes('aria-label="Facebook"'));
    assert.ok(content.includes(">f<") || content.includes("> f <") || content.includes(">\n              f\n"));

    // Verify Instagram
    assert.ok(content.includes('aria-label="Instagram"'));

    // Verify LinkedIn
    assert.ok(content.includes('aria-label="LinkedIn"'));
    assert.ok(content.includes(">in<") || content.includes("> in <") || content.includes(">\n              in\n"));

    // Verify brand icon color
    assert.ok(content.includes("text-[#022977]"));
  });
});
