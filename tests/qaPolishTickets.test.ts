import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

describe("QA Polish Subtasks Verification", () => {
  const rootDir = path.resolve(__dirname, "..");

  describe("z8tvbhx5b5: Design Studio Shapes Pill icon vs Circle", () => {
    it("renders Pill shape selector with elongated capsule geometry instead of 1:1 circle", () => {
      const studioPath = path.join(rootDir, "src/app/design-studio/page.tsx");
      const content = fs.readFileSync(studioPath, "utf-8");

      // Verify shape items include elongated pill iconClass and flex centering wrapper
      assert.ok(
        content.includes('{ id: "pill", label: "Pill", rx: "rounded-full", iconClass: "h-4 w-7.5" }'),
        "Pill shape should have elongated dimensions (h-4 w-7.5)"
      );
      assert.ok(
        content.includes('<div className="flex h-8 w-8 items-center justify-center">'),
        "Shape preview container should center the preview icon inside standard box"
      );
    });
  });

  describe("z8tvbhx58u: Templates Page 'Build From Scratch' vertical alignment", () => {
    it("enforces leading-none and flex centering on Build From Scratch in /templates", () => {
      const templatesPath = path.join(rootDir, "src/app/(app)/templates/page.tsx");
      const content = fs.readFileSync(templatesPath, "utf-8");

      assert.ok(
        content.includes('<span className="leading-none inline-block">Build From Scratch</span>'),
        "/templates page should normalize line-height for Build From Scratch label"
      );
      assert.ok(
        content.includes('className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200'),
        "/templates button should use items-center justify-center"
      );
    });

    it("enforces leading-none and flex centering on Build From Scratch in /template", () => {
      const templatePath = path.join(rootDir, "src/app/template/page.tsx");
      const content = fs.readFileSync(templatePath, "utf-8");

      assert.ok(
        content.includes('<span className="leading-none inline-block">Build From Scratch</span>'),
        "/template page should normalize line-height for Build From Scratch label"
      );
    });
  });

  describe("z8tvbhx57y: Top Bar Long User Name Truncation", () => {
    it("truncates long user names with ellipsis and title attribute in DashboardTopBar", () => {
      const topBarPath = path.join(rootDir, "src/components/dashboard/DashboardTopBar.tsx");
      const content = fs.readFileSync(topBarPath, "utf-8");

      assert.ok(
        content.includes('truncate max-w-[140px] md:max-w-[180px]'),
        "Top bar user name should include truncate and max-width"
      );
      assert.ok(
        content.includes('title={resolvedUserName || undefined}'),
        "Top bar user name should provide full name in title attribute on hover"
      );
    });
  });

  describe("z8tvbhx58m: Dashboard Hero Welcome Banner Long Name Truncation", () => {
    it("prevents long names from sliding behind floating cards on Dashboard Hero", () => {
      const heroPath = path.join(rootDir, "src/components/dashboard/HeroSection.tsx");
      const content = fs.readFileSync(heroPath, "utf-8");

      assert.ok(
        content.includes('truncate max-w-full sm:max-w-md lg:max-w-lg'),
        "Welcome banner greeting must truncate long names"
      );
      assert.ok(
        content.includes('min-w-0 flex-1 max-w-xl'),
        "Welcome banner left column must use min-w-0 flex-1 to allow flex truncation"
      );
    });
  });

  describe("z8tvbhx5a5: Cookie Consent Banner Reject All Option", () => {
    it("provides explicit 'Reject All' button with proper aria-label and essential handling", () => {
      const cookiePath = path.join(rootDir, "src/components/common/CookieConsent.tsx");
      const content = fs.readFileSync(cookiePath, "utf-8");

      assert.ok(
        content.includes('Reject All'),
        "Cookie banner must show explicit Reject All button"
      );
      assert.ok(
        content.includes('aria-label="Reject non-essential cookies"'),
        "Reject All button must have descriptive aria-label"
      );
      assert.ok(
        content.includes('onClick={handleEssentialOnly}'),
        "Reject All button must trigger handleEssentialOnly"
      );
    });
  });

  describe("z8tvbhx55n: Team Signatures Modal Polish", () => {
    it("removes separator divider line and updates warning icon to team users badge", () => {
      const signaturesPath = path.join(rootDir, "src/app/(app)/signatures/page.tsx");
      const content = fs.readFileSync(signaturesPath, "utf-8");

      // Verify no border-t divider before Close / Go to Team Signatures
      assert.ok(
        !content.includes('mt-6 flex items-center justify-end gap-3 pt-3 border-t'),
        "Team signature modal must not have horizontal separator line"
      );
      assert.ok(
        content.includes('mt-6 flex items-center justify-end gap-3'),
        "Modal actions must be right-aligned with gap-3"
      );
      // Verify updated team icon
      assert.ok(
        content.includes('bg-blue-50 text-[#245FD4]'),
        "Modal header icon should use brand blue circle container"
      );
    });
  });

  describe("z8tvbhwh0a: Privacy Policy Email Link Consistent Underline Color", () => {
    it("enforces explicit decoration-[#245FD4] matching the email text color", () => {
      const privacyPath = path.join(rootDir, "src/components/legal/PrivacyPolicyContent.tsx");
      const content = fs.readFileSync(privacyPath, "utf-8");

      assert.ok(
        content.includes('decoration-[#245FD4]'),
        "Privacy policy email link should match underline decoration to brand blue"
      );
      assert.ok(
        content.includes('hover:decoration-[#022977]'),
        "Privacy policy email link should match hover decoration color"
      );
    });
  });

  describe("z8tvbhx59u: Marketing Navbar Logout Toast Notification", () => {
    it("dispatches sig_flash_toast event and updates sessionStorage on marketing navbar logout", () => {
      const navbarPath = path.join(rootDir, "src/components/landing/Navbar.tsx");
      const content = fs.readFileSync(navbarPath, "utf-8");

      assert.ok(
        content.includes('sessionStorage.setItem("sig_flash_toast", "You have been logged out successfully.");'),
        "Navbar logout must persist flash toast in sessionStorage"
      );
      assert.ok(
        content.includes('new CustomEvent("sig_flash_toast"'),
        "Navbar logout must trigger sig_flash_toast CustomEvent for instant UI feedback"
      );
    });
  });

  describe("z8tvbhx5a0: Crop Photo Modal Helper Text & Modernized Zoom Controls", () => {
    it("removes floating badge from image canvas and positions helper line outside", () => {
      const cropPath = path.join(rootDir, "src/components/common/ImageCropModal.tsx");
      const content = fs.readFileSync(cropPath, "utf-8");

      // Verify floating pill inside canvas is gone
      assert.ok(
        !content.includes('absolute top-3 left-3 pointer-events-none rounded-full bg-black/60'),
        "Floating pill badge should be removed from inside the image canvas"
      );
      // Verify helper line outside canvas
      assert.ok(
        content.includes('↔ Drag to pan'),
        "Helper line should be present beneath canvas"
      );
      assert.ok(
        content.includes('🔍 Pinch or scroll to zoom'),
        "Helper line should mention pinch or scroll to zoom"
      );
      // Verify Zoom in / Zoom out icons
      assert.ok(
        content.includes('aria-label="Zoom out"'),
        "Zoom out button must have accessible aria-label"
      );
      assert.ok(
        content.includes('aria-label="Zoom in"'),
        "Zoom in button must have accessible aria-label"
      );
    });
  });
});
