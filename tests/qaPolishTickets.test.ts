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
        content.includes('{ id: "pill", label: "Pill", rx: "rounded-full", iconClass: "h-6 w-12" }') ||
        content.includes('{ id: "pill", label: "Pill", rx: "rounded-full", iconClass: "h-4 w-7.5" }'),
        "Pill shape should have elongated dimensions"
      );
      assert.ok(
        content.includes('<div className="flex h-8 w-8 items-center justify-center">'),
        "Shape preview container should center the preview icon inside standard box"
      );
    });
  });

  describe("z8tvbhx58u: Templates Page 'Build From Scratch' vertical alignment", () => {
    it("enforces leading-none and flex centering on Build From Scratch in /templates", () => {
      const templatesPath = path.join(rootDir, "src/app/templates/page.tsx");
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

    it("verifies /template redirects to /templates", () => {
      const templatePath = path.join(rootDir, "src/app/template/page.tsx");
      const content = fs.readFileSync(templatePath, "utf-8");

      assert.ok(
        content.includes('redirect("/templates")'),
        "/template page should redirect to /templates"
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

  describe("z8tvbhwzg9: [Templates] Sterling & Co. template preview scaling & responsive fit", () => {
    it("renders SignaturePreviewFrame with aspectRatio={false} and preferTableBounds in TemplateEditor", () => {
      const editorPath = path.join(rootDir, "src/components/templates/TemplateEditor.tsx");
      const content = fs.readFileSync(editorPath, "utf-8");

      assert.ok(
        content.includes("SignaturePreviewFrame"),
        "TemplateEditor must use SignaturePreviewFrame for dynamic scaling"
      );
      assert.ok(
        content.includes("aspectRatio={false}"),
        "SignaturePreviewFrame in editor must use non-fixed aspectRatio to dynamically fit container"
      );
      assert.ok(
        content.includes("preferTableBounds={preferTableBounds}"),
        "SignaturePreviewFrame in editor must pass preferTableBounds for executive-corporate"
      );
      assert.ok(
        content.includes('"executive-corporate"'),
        "preferTableBounds must include executive-corporate"
      );
    });

    it("SignaturePreviewFrame dynamically measures container width and scales content when aspectRatio is false", () => {
      const framePath = path.join(rootDir, "src/components/studio/SignaturePreviewFrame.tsx");
      const content = fs.readFileSync(framePath, "utf-8");

      assert.ok(
        content.includes("availableWidth ="),
        "SignaturePreviewFrame should calculate availableWidth from panelSize and fitPadding"
      );
      assert.ok(
        content.includes("shouldScale = availableWidth > 0 && rawContentWidth > availableWidth"),
        "SignaturePreviewFrame should auto-scale down when rawContentWidth exceeds availableWidth"
      );
      assert.ok(
        content.includes("transform: `scale(${scale})`"),
        "SignaturePreviewFrame should apply standard transform scale"
      );
      assert.ok(
        content.includes("overflow: \"hidden\""),
        "Scaled wrapper must have overflow hidden to prevent horizontal scrollbars"
      );
    });
  });

  describe("GmailComposerMockup Static Controls", () => {
    it("ensures window title bar controls and bottom action bar are static without hover or pointer cursor", () => {
      const mockupPath = path.join(rootDir, "src/components/seo-landing/GmailComposerMockup.tsx");
      const content = fs.readFileSync(mockupPath, "utf-8");

      const titleBarSection = content.match(
        /\{\/\* Gmail Window Title Bar \*\/\}[\s\S]*?\{\/\* Email Header Fields \*\/\}/
      );
      assert.ok(titleBarSection, "Must find title bar section");
      const titleBarText = titleBarSection[0];

      assert.ok(!titleBarText.includes("cursor-pointer"), "Window action icons must not have cursor-pointer");
      assert.ok(!titleBarText.includes("hover:text-slate-700"), "Window action icons must not have hover:text-slate-700");
      assert.ok(titleBarText.includes("pointer-events-none"), "Window action container must have pointer-events-none");
      assert.ok(titleBarText.includes("cursor-default"), "Window action container must have cursor-default");

      const bottomBarSection = content.match(
        /\{\/\* Gmail Bottom Action Bar \*\/\}[\s\S]*?100% Gmail Validated/
      );
      assert.ok(bottomBarSection, "Must find bottom action bar section");
      const bottomBarText = bottomBarSection[0];

      assert.ok(!bottomBarText.includes("cursor-pointer"), "Bottom formatting icons must not have cursor-pointer");
      assert.ok(!bottomBarText.includes("hover:bg-[#0842A0]"), "Send button must not have hover:bg-[#0842A0]");
      assert.ok(!bottomBarText.includes("hover:text-slate-600"), "Formatting icons must not have hover:text-slate-600");
      assert.ok(bottomBarText.includes("pointer-events-none"), "Bottom action controls must include pointer-events-none");
      assert.ok(bottomBarText.includes("cursor-default"), "Bottom action controls must include cursor-default");
    });
  });

  describe("GmailSignatureGenerator 102KB Truncation Card Icon", () => {
    it("ensures 'No 102KB Truncation' card renders an SVG vector icon and no raw text badge", () => {
      const pagePath = path.join(rootDir, "src/app/gmail-signature-generator/page.tsx");
      const content = fs.readFileSync(pagePath, "utf-8");

      const card1Section = content.match(
        /\{\/\* Card 1: 102KB Clipping \*\/\}[\s\S]*?\{\/\* Card 2: Rogue Blue Underlines \*\/\}/
      );
      assert.ok(card1Section, "Must find Card 1 section");
      const card1Text = card1Section[0];

      assert.ok(!card1Text.includes("102k\n"), "Must not contain raw 102k text badge");
      assert.ok(!card1Text.includes("font-bold mb-4"), "Container must not have font-bold text styling");
      assert.ok(card1Text.includes("<svg className=\"h-5 w-5\""), "Must contain standard h-5 w-5 SVG icon");
      assert.ok(card1Text.includes("viewBox=\"0 0 24 24\""), "Must contain SVG viewBox 0 0 24 24");
    });
  });

  describe("GmailSignatureGenerator 'View all 20+ templates' Button Redesign", () => {
    it("ensures link is redesigned into a secondary outlined button with icon", () => {
      const pagePath = path.join(rootDir, "src/app/gmail-signature-generator/page.tsx");
      const content = fs.readFileSync(pagePath, "utf-8");

      const showcaseSection = content.match(
        /\{\/\* 4\. CURATED GMAIL TEMPLATES SHOWCASE \*\/\}[\s\S]*?<CuratedTemplatesGrid/
      );
      assert.ok(showcaseSection, "Must find Curated Templates Showcase section");
      const showcaseText = showcaseSection[0];

      assert.ok(
        !showcaseText.includes("text-sm font-semibold text-[#245FD4] hover:text-[#00359F] transition\n"),
        "Must not use weak inline text link"
      );
      assert.ok(
        showcaseText.includes("rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700"),
        "Must use polished pill button component styling"
      );
      assert.ok(
        showcaseText.includes("hover:border-[#245FD4]/30 hover:bg-[#EFF6FF] hover:text-[#245FD4]"),
        "Must use hover interaction styles"
      );
      assert.ok(
        showcaseText.includes("<svg") && showcaseText.includes("h-3.5 w-3.5"),
        "Must include arrow SVG vector icon"
      );
    });
  });

  describe("GmailSignatureGenerator Technical Comparison Table Overhaul", () => {
    it("ensures comparison table includes elevated SigSignature column, RECOMMENDED badge, and vector status icons", () => {
      const pagePath = path.join(rootDir, "src/app/gmail-signature-generator/page.tsx");
      const content = fs.readFileSync(pagePath, "utf-8");

      const compSection = content.match(
        /\{\/\* 5\. TECHNICAL COMPARISON TABLE \*\/\}[\s\S]*?\{\/\* 6\. FAQ SECTION \*\/\}/
      );
      assert.ok(compSection, "Must find technical comparison section");
      const compText = compSection[0];

      assert.ok(compText.includes("Recommended"), "Must have Recommended badge on SigSignature column");
      assert.ok(compText.includes("bg-[#EFF6FF]/60"), "Must elevate SigSignature column with tinted background");
      assert.ok(compText.includes("border-l border-blue-100"), "Must separate SigSignature column with border accent");
      assert.ok(compText.includes("overflow-x-auto"), "Must support horizontal scroll for responsiveness");
      assert.ok(compText.includes("shadow-md"), "Must use elevated shadow on comparison card container");
      assert.ok(compText.includes("polyline points=\"20 6 9 17 4 12\""), "Must use vector checkmark icons for SigSignature");
      assert.ok(compText.includes("line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\""), "Must use vector cross icons for competitors");
    });
  });
});
