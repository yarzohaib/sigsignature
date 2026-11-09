import test from "node:test";
import assert from "node:assert/strict";
import { AVAILABLE_TEMPLATES } from "../src/lib/templatesData";
import { render as renderExecutiveCorporate } from "../src/lib/templates/designs/executiveCorporate";

test("Templates & Editor Design Fidelity", async (t) => {
  await t.test("Template curation integrity", () => {
    const executive = AVAILABLE_TEMPLATES.find((t) => t.id === "executive-corporate");
    assert.ok(executive, "Executive Corporate template should exist");
    assert.equal(executive.defaultData.themeColor, "#DCBB9A");
    assert.equal(executive.defaultData.fontFamily, "Montserrat");
    assert.ok(executive.defaultData.socials.linkedin, "Should have demo linkedin link");

    const pastel = AVAILABLE_TEMPLATES.find((t) => t.id === "pastel-creative");
    assert.ok(pastel, "Pastel Creative template should exist");
    assert.equal(pastel.defaultData.themeColor, "#EC4899");
    assert.ok(pastel.defaultData.socials.linkedin, "Should have demo linkedin link");
    assert.ok(pastel.defaultData.socials.instagram, "Should have demo instagram link");

    const centered = AVAILABLE_TEMPLATES.find((t) => t.id === "centered-minimal");
    assert.ok(centered, "Centered Minimal template should exist");
    assert.equal(centered.defaultData.themeColor, "#0F766E");
    assert.ok(centered.defaultData.socials.linkedin, "Should have demo linkedin link");
  });

  await t.test("Executive Corporate layout preserves vertical divider line and columns", () => {
    const executive = AVAILABLE_TEMPLATES.find((t) => t.id === "executive-corporate");
    assert.ok(executive);
    const html = renderExecutiveCorporate(executive.defaultData);

    // Verify vertical divider line has width and background color
    assert.match(html, /divider-cell/);
    assert.match(html, /width:2px/);
    assert.match(html, /background-color:#DCBB9A/);

    // Verify left logo card and spacers have min-width preventing collapse
    assert.match(html, /min-width:220px/);
    assert.match(html, /min-width:16px/);
  });

  await t.test("Template slug normalization handles prefixes and underscores", () => {
    function findTemplateByParam(param: string) {
      const raw = param.trim().toLowerCase();
      const normalized = raw.replace(/^0*[0-9]+_/, "").replace(/[_\s]+/g, "-");
      return (
        AVAILABLE_TEMPLATES.find((t) => t.id.toLowerCase() === raw) ||
        AVAILABLE_TEMPLATES.find((t) => t.id.toLowerCase() === normalized) ||
        AVAILABLE_TEMPLATES.find((t) => t.name.toLowerCase() === raw)
      );
    }

    assert.equal(findTemplateByParam("03_pastel_creative")?.id, "pastel-creative");
    assert.equal(findTemplateByParam("07_executive_corporate")?.id, "executive-corporate");
    assert.equal(findTemplateByParam("09_centered_minimal")?.id, "centered-minimal");
    assert.equal(findTemplateByParam("executive_corporate")?.id, "executive-corporate");
    assert.equal(findTemplateByParam("Executive Corporate")?.id, "executive-corporate");
    assert.equal(findTemplateByParam("pastel-creative")?.id, "pastel-creative");
  });
});
