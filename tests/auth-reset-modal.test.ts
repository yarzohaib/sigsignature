import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Password Reset Success Modal & Direct Login Routing", () => {
  const authFeedbackModalPath = path.resolve(
    __dirname,
    "../src/components/ui/AuthFeedbackModal.tsx"
  );
  const resetPagePath = path.resolve(
    __dirname,
    "../src/app/(Auth)/reset/page.tsx"
  );
  const loginPagePath = path.resolve(
    __dirname,
    "../src/app/(Auth)/login/page.tsx"
  );

  it("AuthFeedbackModal supports showCloseButton prop defaulting to true and suppresses button when false", () => {
    const content = fs.readFileSync(authFeedbackModalPath, "utf-8");
    assert.match(
      content,
      /showCloseButton\?: boolean/,
      "AuthFeedbackModalProps must declare optional showCloseButton boolean"
    );
    assert.match(
      content,
      /showCloseButton = true/,
      "AuthFeedbackModal must default showCloseButton to true"
    );
    assert.match(
      content,
      /onClose && showCloseButton/,
      "Close button should only render when showCloseButton is true"
    );
  });

  it("Reset password page configures modal without close button and routes directly to /login?reset=success", () => {
    const content = fs.readFileSync(resetPagePath, "utf-8");
    assert.match(
      content,
      /showCloseButton=\{false\}/,
      "reset/page.tsx must pass showCloseButton={false} to suppress the unresponsive 'X' button"
    );
    assert.match(
      content,
      /router\.push\("\/login\?reset=success"\)/,
      "reset/page.tsx must route directly to /login?reset=success"
    );
    assert.match(
      content,
      /countdown/,
      "reset/page.tsx must implement a countdown timer"
    );
    assert.doesNotMatch(
      content,
      /router\.push\("\/dashboard"\)/,
      "reset/page.tsx must never route to /dashboard"
    );
  });

  it("Login page displays success banner when navigating after password reset (?reset=success)", () => {
    const content = fs.readFileSync(loginPagePath, "utf-8");
    assert.match(
      content,
      /searchParams\.get\("reset"\) === "success"/,
      "login/page.tsx must check for ?reset=success query parameter"
    );
    assert.match(
      content,
      /Password reset successfully!/,
      "login/page.tsx must display a password reset confirmation banner"
    );
  });
});
