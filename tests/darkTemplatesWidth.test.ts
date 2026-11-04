import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { AVAILABLE_TEMPLATES } from "../src/lib/templatesData";
import { generateTemplateHtml } from "../src/lib/templates/renderTemplateHtml";

describe("Dark Templates Expanded Width Matching Gallery", () => {
  it("Modern Dark table width is set to 294px matching Corporate Elegant", () => {
    const md = AVAILABLE_TEMPLATES.find((t) => t.id === "modern-dark");
    assert.ok(md, "modern-dark template must exist");

    const html = generateTemplateHtml(md.defaultData, { preview: true });
    assert.ok(
      html.includes('width="294"'),
      "Modern Dark outer table must specify width=\"294\""
    );
    assert.ok(
      html.includes("min-width:294px"),
      "Modern Dark outer table style must specify min-width:294px"
    );
    assert.ok(
      html.includes("max-width:294px"),
      "Modern Dark outer table style must specify max-width:294px"
    );
  });

  it("Bold Gradient table width is set to 294px matching Corporate Elegant", () => {
    const bg = AVAILABLE_TEMPLATES.find((t) => t.id === "bold-gradient");
    assert.ok(bg, "bold-gradient template must exist");

    const html = generateTemplateHtml(bg.defaultData, { preview: true });
    assert.ok(
      html.includes('width="294"'),
      "Bold Gradient outer table must specify width=\"294\""
    );
    assert.ok(
      html.includes("min-width:294px"),
      "Bold Gradient outer table style must specify min-width:294px"
    );
    assert.ok(
      html.includes("max-width:294px"),
      "Bold Gradient outer table style must specify max-width:294px"
    );
  });

  it("Bold Block table width is adjusted to 400px to match the wide aspect ratio of other darker templates", () => {
    const bb = AVAILABLE_TEMPLATES.find((t) => t.id === "bold-block");
    assert.ok(bb, "bold-block template must exist");

    const html = generateTemplateHtml(bb.defaultData, { preview: true });
    assert.ok(
      html.includes('width="400"'),
      "Bold Block outer table must specify width=\"400\""
    );
    assert.ok(
      html.includes("width:400px"),
      "Bold Block outer table style must specify width:400px"
    );
    assert.ok(
      html.includes("min-width:400px"),
      "Bold Block outer table style must specify min-width:400px"
    );
    assert.ok(
      html.includes("max-width:400px"),
      "Bold Block outer table style must specify max-width:400px"
    );
  });

  it("TemplateSignatureThumbnail and TemplateEditor include modern-dark and bold-gradient in preferTableBounds", () => {
    const thumbPath = path.resolve(__dirname, "../src/components/templates/TemplateSignatureThumbnail.tsx");
    const thumbContent = fs.readFileSync(thumbPath, "utf-8");

    assert.ok(
      thumbContent.includes('"modern-dark"'),
      "TemplateSignatureThumbnail preferTableBounds must include modern-dark"
    );
    assert.ok(
      thumbContent.includes('"bold-gradient"'),
      "TemplateSignatureThumbnail preferTableBounds must include bold-gradient"
    );
    assert.ok(
      thumbContent.includes('"bold-block"'),
      "TemplateSignatureThumbnail preferTableBounds must include bold-block"
    );

    const editorPath = path.resolve(__dirname, "../src/components/templates/TemplateEditor.tsx");
    const editorContent = fs.readFileSync(editorPath, "utf-8");

    assert.ok(
      editorContent.includes('"modern-dark"'),
      "TemplateEditor preferTableBounds must include modern-dark"
    );
    assert.ok(
      editorContent.includes('"bold-gradient"'),
      "TemplateEditor preferTableBounds must include bold-gradient"
    );
  });
});
