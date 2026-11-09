import { describe, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Google & OAuth Centered Popup Flow", () => {
  const apiFile = path.resolve(__dirname, "../src/app/lib/api.ts");
  const loginFile = path.resolve(__dirname, "../src/app/(Auth)/login/page.tsx");
  const signupFile = path.resolve(__dirname, "../src/app/(Auth)/signup/page.tsx");
  const callbackFile = path.resolve(__dirname, "../src/app/(Auth)/auth/callback/page.tsx");

  test("startOAuth defaults to popup window with centered 500x650 coordinates", () => {
    const content = fs.readFileSync(apiFile, "utf8");
    assert.ok(content.includes("usePopup = options?.popup !== false"), "startOAuth should default to popup");
    assert.ok(content.includes("width = 500"), "popup width should be 500");
    assert.ok(content.includes("height = 650"), "popup height should be 650");
    assert.ok(content.includes("GOOGLE_AUTH_SUCCESS"), "handles GOOGLE_AUTH_SUCCESS postMessage");
    assert.ok(content.includes("SIG_OAUTH_SUCCESS"), "handles SIG_OAUTH_SUCCESS postMessage");
  });

  test("login page initiates OAuth with popup: true", () => {
    const content = fs.readFileSync(loginFile, "utf8");
    assert.ok(content.includes("popup: true"), "login page should explicitly pass popup: true");
  });

  test("signup page initiates OAuth with popup: true", () => {
    const content = fs.readFileSync(signupFile, "utf8");
    assert.ok(content.includes("popup: true"), "signup page should explicitly pass popup: true");
  });

  test("auth callback posts success message to opener and closes popup window", () => {
    const content = fs.readFileSync(callbackFile, "utf8");
    assert.ok(content.includes("window.opener.postMessage"), "callback should post message to window.opener");
    assert.ok(content.includes("window.close()"), "callback should close popup upon exchange");
  });
});
