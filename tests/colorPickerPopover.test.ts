import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import ColorPickerPopover, { normalizeHex } from "../src/components/ui/ColorPickerPopover";

describe("ColorPickerPopover & In-Page Color Picker", () => {
  const root = path.resolve(__dirname, "..");

  describe("Hex normalization and validation", () => {
    it("normalizes 6-digit hex values with or without # and converts to uppercase", () => {
      assert.equal(normalizeHex("#245fd4"), "#245FD4");
      assert.equal(normalizeHex("245fd4"), "#245FD4");
      assert.equal(normalizeHex("#FFFFFF"), "#FFFFFF");
      assert.equal(normalizeHex("000000"), "#000000");
    });

    it("normalizes 3-digit shorthand hex values to 6-digit uppercase hex", () => {
      assert.equal(normalizeHex("#fff"), "#FFFFFF");
      assert.equal(normalizeHex("fff"), "#FFFFFF");
      assert.equal(normalizeHex("#123"), "#112233");
      assert.equal(normalizeHex("abc"), "#AABBCC");
    });

    it("rejects invalid hex strings and returns null", () => {
      assert.equal(normalizeHex(""), null);
      assert.equal(normalizeHex("blue"), null);
      assert.equal(normalizeHex("#12"), null);
      assert.equal(normalizeHex("#1234"), null);
      assert.equal(normalizeHex("#1234567"), null);
      assert.equal(normalizeHex("xyz123"), null);
      assert.equal(normalizeHex("!@#$"), null);
    });
  });

  describe("Component Rendering & Accessibility Attributes", () => {
    it("renders trigger button with accessibility attributes and color swatch background", () => {
      const html = ReactDOMServer.renderToString(
        React.createElement(ColorPickerPopover, {
          value: "#245FD4",
          onChange: () => {},
          label: "Brand color",
        })
      );

      assert.match(html, /role="dialog"/i === false ? /aria-haspopup="dialog"/ : /aria-haspopup="dialog"/);
      assert.match(html, /aria-haspopup="dialog"/);
      assert.match(html, /aria-expanded="false"/);
      assert.match(html, /background-color:#245FD4/i);
      assert.match(html, /Brand color/);
    });
  });

  describe("Replacement of native type='color' inputs across the codebase", () => {
    it("verifies no native input type='color' exists in SignatureDefaultsCard.tsx", () => {
      const fileContent = fs.readFileSync(
        path.join(root, "src/components/settings/SignatureDefaultsCard.tsx"),
        "utf-8"
      );
      assert.doesNotMatch(
        fileContent,
        /type=["']color["']/,
        "SignatureDefaultsCard should not contain native <input type='color'>"
      );
      assert.match(
        fileContent,
        /ColorPickerPopover/,
        "SignatureDefaultsCard should use ColorPickerPopover"
      );
    });

    it("verifies no native input type='color' exists in EditDetailsModal.tsx", () => {
      const fileContent = fs.readFileSync(
        path.join(root, "src/components/studio/EditDetailsModal.tsx"),
        "utf-8"
      );
      assert.doesNotMatch(
        fileContent,
        /type=["']color["']/,
        "EditDetailsModal should not contain native <input type='color'>"
      );
      assert.match(
        fileContent,
        /ColorPickerPopover/,
        "EditDetailsModal should use ColorPickerPopover for Text and Button colors"
      );
    });

    it("verifies the entire src directory has zero occurrences of native type='color'", () => {
      function checkDirectory(dir: string) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            checkDirectory(fullPath);
          } else if (/\.(tsx|jsx|html)$/.test(file)) {
            const content = fs.readFileSync(fullPath, "utf-8");
            assert.doesNotMatch(
              content,
              /<input[^>]*type=["']color["']/,
              `File ${fullPath} must not contain native <input type="color">`
            );
          }
        }
      }

      checkDirectory(path.join(root, "src"));
    });
  });
});
