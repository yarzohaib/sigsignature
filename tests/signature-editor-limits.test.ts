import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { MAX_LENGTH } from "../src/lib/validation";

describe("Strict Character Limits in Signature Editor & Inputs", () => {
  it("enforces exact character limits in MAX_LENGTH", () => {
    assert.equal(MAX_LENGTH.NAME, 20, "Full Name must be max 20 characters");
    assert.equal(MAX_LENGTH.JOB_TITLE, 24, "Job Title must be max 24 characters");
    assert.equal(MAX_LENGTH.COMPANY, 24, "Company Name must be max 24 characters");
    assert.equal(MAX_LENGTH.EMAIL, 30, "Email Address must be max 30 characters");
    assert.equal(MAX_LENGTH.WEBSITE, 40, "Website URL must be max 40 characters");
  });

  it("enforces native HTML maxLength and name attributes in TemplateEditor inputs", () => {
    const templateEditorPath = path.resolve(
      __dirname,
      "../src/components/templates/TemplateEditor.tsx"
    );
    const content = fs.readFileSync(templateEditorPath, "utf-8");

    // Full Name
    assert.match(
      content,
      /<input[\s\S]*?name="fullName"[\s\S]*?maxLength=\{MAX_LENGTH\.NAME\}/,
      "TemplateEditor must enforce name='fullName' and maxLength={MAX_LENGTH.NAME} (20)"
    );

    // Job Title
    assert.match(
      content,
      /<input[\s\S]*?name="jobTitle"[\s\S]*?maxLength=\{MAX_LENGTH\.JOB_TITLE\}/,
      "TemplateEditor must enforce name='jobTitle' and maxLength={MAX_LENGTH.JOB_TITLE} (24)"
    );

    // Company Name
    assert.match(
      content,
      /<input[\s\S]*?name="companyName"[\s\S]*?maxLength=\{MAX_LENGTH\.COMPANY\}/,
      "TemplateEditor must enforce name='companyName' and maxLength={MAX_LENGTH.COMPANY} (24)"
    );

    // Email Address
    assert.match(
      content,
      /<input[\s\S]*?name="email"[\s\S]*?maxLength=\{MAX_LENGTH\.EMAIL\}/,
      "TemplateEditor must enforce name='email' and maxLength={MAX_LENGTH.EMAIL} (30)"
    );

    // Website URL
    assert.match(
      content,
      /<input[\s\S]*?name="websiteUrl"[\s\S]*?maxLength=\{MAX_LENGTH\.WEBSITE\}/,
      "TemplateEditor must enforce name='websiteUrl' and maxLength={MAX_LENGTH.WEBSITE} (40)"
    );
  });
});
