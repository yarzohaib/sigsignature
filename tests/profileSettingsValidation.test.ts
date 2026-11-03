import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { MAX_LENGTH, MIN_LENGTH, isValidPersonName } from "../src/lib/validation";

describe("Settings Page Profile Validation & Whitespace Handling", () => {
  const rootDir = path.resolve(process.cwd());

  it("ProfileCard input has maxLength={50} and minLength={2} attributes", () => {
    const profileCardSource = fs.readFileSync(
      path.join(rootDir, "src/components/settings/ProfileCard.tsx"),
      "utf-8"
    );

    // First name input attributes
    assert.match(
      profileCardSource,
      /id="profile-first-name"[\s\S]*?maxLength=\{50\}/,
      "First name input must have maxLength={50}"
    );
    assert.match(
      profileCardSource,
      /id="profile-first-name"[\s\S]*?minLength=\{2\}/,
      "First name input must have minLength={2}"
    );

    // Last name input attributes
    assert.match(
      profileCardSource,
      /id="profile-last-name"[\s\S]*?maxLength=\{50\}/,
      "Last name input must have maxLength={50}"
    );

    // Auto-trims leading whitespace on change and full trim on blur
    assert.match(
      profileCardSource,
      /\.replace\(\/\^\\s\+\/,\s*""\)/,
      "ProfileCard must automatically strip leading whitespace on input change"
    );
    assert.match(
      profileCardSource,
      /onBlur=\{\(\)\s*=>\s*\{[\s\S]*?\.trim\(\)/,
      "ProfileCard must automatically trim whitespace on blur"
    );
  });

  it("settings page validates required min length, max length, and invalid characters", () => {
    const settingsSource = fs.readFileSync(
      path.join(rootDir, "src/app/(app)/settings/page.tsx"),
      "utf-8"
    );

    // Min length check
    assert.match(
      settingsSource,
      /trimmedFirst\.length\s*<\s*2/,
      "Must check for minimum 2 characters on first name"
    );
    assert.match(
      settingsSource,
      /First name must be at least 2 characters\./,
      "Must show helper text for minimum 2 characters"
    );

    // Max length check
    assert.match(
      settingsSource,
      /trimmedFirst\.length\s*>\s*50/,
      "Must check for max 50 characters on first name"
    );
    assert.match(
      settingsSource,
      /trimmedLast\.length\s*>\s*50/,
      "Must check for max 50 characters on last name"
    );

    // Trims whitespace before constructing payload
    assert.match(
      settingsSource,
      /formState\.firstName\.trim\(\)/,
      "Must trim first name before sending payload"
    );
    assert.match(
      settingsSource,
      /\(formState\.lastName\s*\|\|\s*""\)\.trim\(\)/,
      "Must trim last name before sending payload"
    );
  });

  it("backend Zod updateProfileSchema enforces min 2, max 50 on firstName and max 50 on lastName", () => {
    const backendValidatorSource = fs.readFileSync(
      path.resolve(rootDir, "../ERP-BACKEND/src/validators/account.validator.js"),
      "utf-8"
    );

    assert.match(
      backendValidatorSource,
      /firstName:\s*plainTextString\(\{[\s\S]*?min:\s*2[\s\S]*?max:\s*50[\s\S]*?required:\s*true/
    );
    assert.match(
      backendValidatorSource,
      /lastName:\s*plainTextString\(\{[\s\S]*?max:\s*50/
    );
  });

  it("MIN_LENGTH and MAX_LENGTH enforce 2 min and 50 max for profile names", () => {
    assert.equal(MIN_LENGTH.FIRST_NAME, 2);
    assert.equal(MAX_LENGTH.FIRST_NAME, 50);
    assert.equal(MAX_LENGTH.LAST_NAME, 50);
  });
});
