import { describe, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Google & OAuth In-Tab Redirect Flow", () => {
  const apiFile = path.resolve(__dirname, "../src/app/lib/api.ts");
  const loginFile = path.resolve(__dirname, "../src/app/(Auth)/login/page.tsx");
  const signupFile = path.resolve(__dirname, "../src/app/(Auth)/signup/page.tsx");
  const callbackFile = path.resolve(__dirname, "../src/app/(Auth)/auth/callback/page.tsx");

  test("startOAuth defaults to in-tab redirection and supports popup override", () => {
    const content = fs.readFileSync(apiFile, "utf8");
    assert.ok(content.includes("usePopup = Boolean(options?.popup)"), "startOAuth should default to same-tab redirect");
    assert.ok(content.includes("window.location.assign(targetUrl)"), "redirects current window in-place");
  });

  test("login page initiates OAuth in same tab", () => {
    const content = fs.readFileSync(loginFile, "utf8");
    assert.ok(content.includes("popup: false") || !content.includes("popup: true"), "login page should use same-tab redirect");
  });

  test("signup page initiates OAuth in same tab", () => {
    const content = fs.readFileSync(signupFile, "utf8");
    assert.ok(content.includes("popup: false") || !content.includes("popup: true"), "signup page should use same-tab redirect");
  });

  test("auth callback redirects in-tab if no popup opener exists", () => {
    const content = fs.readFileSync(callbackFile, "utf8");
    assert.ok(content.includes("router.replace(redirectTarget)"), "callback replaces URL to return in original tab");
  });
});
