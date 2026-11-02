import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  getTemplateOptionalCapabilities,
  generateTemplatePlainText,
  generateTemplateHtml,
} from "../src/lib/templates/renderTemplateHtml";
import { AVAILABLE_TEMPLATES } from "../src/lib/templatesData";
import { TemplateSignatureData } from "../src/types/template";

describe("Template Optional Fields Capabilities & Plain-Text Consistency", () => {
  test("modern-dark correctly detects that optional tab fields are not supported", () => {
    const caps = getTemplateOptionalCapabilities("modern-dark", "compact");
    assert.equal(caps.hasAnyOptional, false);
    assert.equal(caps.supportsAddress, false);
    assert.equal(caps.supportsDisclaimer, false);
    assert.equal(caps.supportsTagline, false);
  });

  test("pastel-creative correctly detects that optional fields are supported", () => {
    const caps = getTemplateOptionalCapabilities("pastel-creative", "two-column");
    assert.equal(caps.hasAnyOptional, true);
    assert.equal(caps.supportsAddress, true);
    assert.equal(caps.supportsDisclaimer, true);
    assert.equal(caps.supportsTagline, true);
  });

  test("minimal-clean supports tagline only, so optional tab (address & disclaimer) is hidden", () => {
    const caps = getTemplateOptionalCapabilities("minimal-clean", "two-column");
    assert.equal(caps.hasAnyOptional, false);
    assert.equal(caps.supportsAddress, false);
    assert.equal(caps.supportsDisclaimer, false);
    assert.equal(caps.supportsTagline, true);
  });

  test("templates without optional fields (e.g. modern-dark) do not output address or disclaimer in plain-text copy", () => {
    const modernDark = AVAILABLE_TEMPLATES.find((t) => t.id === "modern-dark")!;
    const testData: TemplateSignatureData = {
      ...modernDark.defaultData,
      optional: {
        address: "123 Test Street",
        disclaimer: "Confidentiality notice here",
        tagline: "Ignored tagline",
      },
    };

    const plainText = generateTemplatePlainText(testData);
    assert.equal(plainText.includes("123 Test Street"), false);
    assert.equal(plainText.includes("Confidentiality notice here"), false);
    assert.equal(plainText.includes("Ignored tagline"), false);

    const html = generateTemplateHtml(testData);
    assert.equal(html.includes("123 Test Street"), false);
    assert.equal(html.includes("Confidentiality notice here"), false);
    assert.equal(html.includes("Ignored tagline"), false);
  });

  test("templates with optional fields (e.g. pastel-creative) output address and disclaimer consistently across HTML and plain-text", () => {
    const pastel = AVAILABLE_TEMPLATES.find((t) => t.id === "pastel-creative")!;
    const testData: TemplateSignatureData = {
      ...pastel.defaultData,
      optional: {
        address: "Itefaq Town, Lahore",
        disclaimer: "Proudly servicing Metropolitan and Regional Areas",
        tagline: "Creativity Redefined",
      },
    };

    const plainText = generateTemplatePlainText(testData);
    assert.equal(plainText.includes("Itefaq Town, Lahore"), true);
    assert.equal(plainText.includes("Proudly servicing Metropolitan and Regional Areas"), true);
    assert.equal(plainText.includes("Creativity Redefined"), true);

    const html = generateTemplateHtml(testData);
    assert.equal(html.includes("Itefaq Town, Lahore"), true);
    assert.equal(html.includes("Proudly servicing Metropolitan and Regional Areas"), true);
    assert.equal(html.includes("Creativity Redefined"), true);
  });
});
