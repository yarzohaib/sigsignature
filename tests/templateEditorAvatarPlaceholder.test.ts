import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

describe("Template Customizer Avatar Placeholder Shape Fix", () => {
  const rootDir = path.resolve(__dirname, "..");

  it("verifies public/placeholder-avatar.svg does not contain a background circle fill", () => {
    const svgPath = path.join(rootDir, "public/placeholder-avatar.svg");
    const content = fs.readFileSync(svgPath, "utf-8");

    assert.ok(
      !content.includes('fill="#F1F5F9"'),
      "placeholder-avatar.svg should not contain the faint background circle #F1F5F9"
    );
    assert.ok(
      !content.includes('cx="20" cy="20" r="20"'),
      "placeholder-avatar.svg should not contain full boundary circle"
    );
  });

  it("verifies TemplateEditor profile photo upload box uses flat squircle container without nested circle", () => {
    const editorPath = path.join(rootDir, "src/components/templates/TemplateEditor.tsx");
    const content = fs.readFileSync(editorPath, "utf-8");

    // Must use rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center
    assert.ok(
      content.includes("rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center"),
      "Avatar container must use unified rounded-2xl squircle with flat bg-slate-50"
    );

    // Must NOT contain nested circle wrapper (e.g. rounded-full bg-slate-100) inside avatar upload box
    const uploadBoxMatch = content.match(/\{supportsProfilePhoto[\s\S]*?\{isUploadingPhoto \? "Uploading\.\.\."/);
    assert.ok(uploadBoxMatch, "Should locate profile photo upload section in TemplateEditor");

    const uploadBoxSection = uploadBoxMatch[0];
    assert.ok(
      !uploadBoxSection.includes("rounded-full bg-slate-100"),
      "Profile photo box must not contain a nested circle container (rounded-full bg-slate-100)"
    );
    assert.ok(
      uploadBoxSection.includes("text-slate-400"),
      "Placeholder avatar silhouette must use text-slate-400"
    );
  });

  it("verifies all 6 primary form inputs have standardized flex h-5 header rows for horizontal alignment", () => {
    const editorPath = path.join(rootDir, "src/components/templates/TemplateEditor.tsx");
    const content = fs.readFileSync(editorPath, "utf-8");

    const requiredFields = [
      "Full Name",
      "Job Title",
      "Company Name",
      "Email Address",
      "Phone Number",
      "Website URL",
    ];

    for (const field of requiredFields) {
      const fieldPattern = new RegExp(
        `<div className="flex h-5 items-center justify-between">\\s*<label[^>]*>[\\s\\S]*?${field}`,
        "m"
      );
      assert.ok(
        fieldPattern.test(content),
        `Field "${field}" must use standardized <div className="flex h-5 items-center justify-between"> wrapper`
      );
    }
  });

  it("verifies templates do not inject /sophia-reynolds.png when avatarUrl is cleared", async () => {
    const { AVAILABLE_TEMPLATES } = await import("../src/lib/templatesData");
    const { generateTemplateHtml } = await import("../src/lib/templates/renderTemplateHtml");

    for (const template of AVAILABLE_TEMPLATES) {
      const html = generateTemplateHtml(
        {
          ...template.defaultData,
          avatarUrl: "", // Cleared / removed avatar
          templateId: template.id,
        },
        { preview: true }
      );

      assert.ok(
        !html.includes("sophia-reynolds.png"),
        `Template "${template.id}" must not fall back to /sophia-reynolds.png when avatar is cleared`
      );
    }
  });

  it("verifies guest user base64 data:image URL is accepted and rendered in template preview", async () => {
    const { AVAILABLE_TEMPLATES } = await import("../src/lib/templatesData");
    const { generateTemplateHtml } = await import("../src/lib/templates/renderTemplateHtml");

    const guestDataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

    const modernDark = AVAILABLE_TEMPLATES.find((t) => t.id === "modern-dark") || AVAILABLE_TEMPLATES[0];
    const html = generateTemplateHtml(
      {
        ...modernDark.defaultData,
        avatarUrl: guestDataUrl,
        templateId: "modern-dark",
      },
      { preview: true }
    );

    assert.ok(
      html.includes(guestDataUrl),
      "Template preview must render the guest user data:image URL when provided"
    );
  });
});
