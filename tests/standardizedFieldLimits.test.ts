import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { MAX_LENGTH } from "../src/lib/validation";

describe("Standardized Form Validation Limits & Preview Card Overflow", () => {
  it("enforces exact standardized character limits in MAX_LENGTH", () => {
    // Requirements:
    // full name: 20 chars
    // title: 24 chars
    // first name / last name: 20 chars
    // company name: 24 chars
    // email address: 30 chars
    // url / website: 40 chars
    // social: 50 chars
    assert.equal(MAX_LENGTH.JOB_TITLE, 24, "Job title max length must be 24");
    assert.equal(MAX_LENGTH.FIRST_NAME, 20, "First name max length must be 20");
    assert.equal(MAX_LENGTH.LAST_NAME, 20, "Last name max length must be 20");
    assert.equal(MAX_LENGTH.NAME, 20, "Full name max length must be 20");
    assert.equal(MAX_LENGTH.COMPANY, 24, "Company name max length must be 24");
    assert.equal(MAX_LENGTH.EMAIL, 30, "Email address max length must be 30");
    assert.equal(MAX_LENGTH.WEBSITE, 40, "Website max length must be 40");
    assert.equal(MAX_LENGTH.SOCIAL_URL, 50, "Social URL max length must be 50");
    assert.equal(MAX_LENGTH.URL, 40, "URL max length must be 40");
    assert.equal(MAX_LENGTH.PHONE, 25, "Phone max length must be 25");
  });

  it("ensures TemplateEditor applies standardized MAX_LENGTH to all fields", () => {
    const templateEditorPath = path.resolve(__dirname, "../src/components/templates/TemplateEditor.tsx");
    const content = fs.readFileSync(templateEditorPath, "utf-8");

    assert.ok(content.includes("maxLength={MAX_LENGTH.NAME}"), "TemplateEditor uses MAX_LENGTH.NAME");
    assert.ok(content.includes("maxLength={MAX_LENGTH.JOB_TITLE}"), "TemplateEditor uses MAX_LENGTH.JOB_TITLE");
    assert.ok(content.includes("maxLength={MAX_LENGTH.COMPANY}"), "TemplateEditor uses MAX_LENGTH.COMPANY");
    assert.ok(content.includes("maxLength={MAX_LENGTH.EMAIL}"), "TemplateEditor uses MAX_LENGTH.EMAIL");
    assert.ok(content.includes("maxLength={MAX_LENGTH.PHONE}"), "TemplateEditor uses MAX_LENGTH.PHONE");
    assert.ok(content.includes("maxLength={MAX_LENGTH.WEBSITE}"), "TemplateEditor uses MAX_LENGTH.WEBSITE");
    assert.ok(content.includes("maxLength={MAX_LENGTH.SOCIAL_URL}"), "TemplateEditor uses MAX_LENGTH.SOCIAL_URL");
  });

  it("ensures SignaturePreviewFrame injects word-break and overflow wrapping to prevent preview card blowout", () => {
    const framePath = path.resolve(__dirname, "../src/components/studio/SignaturePreviewFrame.tsx");
    const content = fs.readFileSync(framePath, "utf-8");

    assert.ok(content.includes("word-break: break-word"), "iframe CSS contains word-break: break-word");
    assert.ok(content.includes("overflow-wrap: break-word"), "iframe CSS contains overflow-wrap: break-word");
    assert.ok(content.includes("hyphens: auto"), "iframe CSS contains hyphens: auto");
  });

  it("ensures MemberModal uses standardized limits for name, email, job title, and socials", () => {
    const memberModalPath = path.resolve(__dirname, "../src/components/team/MemberModal.tsx");
    const content = fs.readFileSync(memberModalPath, "utf-8");

    assert.ok(content.includes("maxLength={MAX_LENGTH.NAME}"), "MemberModal uses MAX_LENGTH.NAME");
    assert.ok(content.includes("maxLength={MAX_LENGTH.EMAIL}"), "MemberModal uses MAX_LENGTH.EMAIL");
    assert.ok(content.includes("maxLength={MAX_LENGTH.JOB_TITLE}"), "MemberModal uses MAX_LENGTH.JOB_TITLE");
    assert.ok(content.includes("maxLength={MAX_LENGTH.PHONE}"), "MemberModal uses MAX_LENGTH.PHONE");
    assert.ok(content.includes("maxLength={MAX_LENGTH.SOCIAL_URL}"), "MemberModal uses MAX_LENGTH.SOCIAL_URL");
  });

  it("ensures ProfileCard uses MAX_LENGTH.COMPANY for company name", () => {
    const profileCardPath = path.resolve(__dirname, "../src/components/settings/ProfileCard.tsx");
    const content = fs.readFileSync(profileCardPath, "utf-8");

    assert.ok(content.includes("maxLength={MAX_LENGTH.COMPANY}"), "ProfileCard uses MAX_LENGTH.COMPANY");
  });
});
