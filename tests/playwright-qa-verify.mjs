import { chromium } from "playwright";
import assert from "node:assert";

async function run() {
  console.log("🚀 Starting Playwright E2E verification of QA Polish tickets...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });

  const baseUrl = "http://127.0.0.1:3009";

  // Provide session cookie so Next.js middleware grants access to protected routes
  await context.addCookies([
    {
      name: "sig_token",
      value: "valid_test_session_token",
      url: baseUrl,
    },
    {
      name: "access_token",
      value: "valid_test_session_token",
      url: baseUrl,
    },
    {
      name: "refresh_token",
      value: "valid_test_session_token",
      url: baseUrl,
    },
  ]);

  const page = await context.newPage();
  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
  page.on("pageerror", (err) => console.log("PAGE ERROR:", err));

  // Mock /api/v1/auth/me to return valid user across authenticated routes
  await page.route("**/api/v1/auth/me", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {
          user: {
            id: "usr_studio_test",
            email: "longname@example.com",
            firstName: "Aiafassafsafsafsafsfafsafsafsaaaaaaaaaaaaaaaaaaaaa a",
            lastName: "",
            companyName: "Acme",
            isActive: true,
            isVerified: true,
          },
          settings: {
            defaultTemplateId: null,
            defaultExportFormat: "html",
          },
        },
      }),
    });
  });

  try {
    // ----------------------------------------------------
    // Test 1: Cookie Consent Banner (z8tvbhx5a5)
    // ----------------------------------------------------
    console.log("Testing [z8tvbhx5a5] Cookie Consent Banner 'Reject All'...");
    await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForTimeout(2000);
    const cookieBanner = page.locator('aside[aria-label="Cookie consent banner"]');
    await cookieBanner.waitFor({ state: "visible", timeout: 5000 });

    const rejectAllBtn = cookieBanner.locator('button:has-text("Reject All")');
    const acceptAllBtn = cookieBanner.locator('button:has-text("Accept All")');

    assert.ok(await rejectAllBtn.isVisible(), "Reject All button should be visible");
    assert.ok(await acceptAllBtn.isVisible(), "Accept All button should be visible");

    await rejectAllBtn.click();
    await cookieBanner.waitFor({ state: "hidden", timeout: 3000 });

    const consentVal = await page.evaluate(() => localStorage.getItem("sig_cookie_consent_v1"));
    assert.strictEqual(consentVal, "essential", "Reject All should store 'essential' consent");
    console.log("  ✔ Cookie banner Reject All passed!");

    // ----------------------------------------------------
    // Test 2: Templates Page 'Build From Scratch' Alignment (z8tvbhx58u)
    // ----------------------------------------------------
    console.log("Testing [z8tvbhx58u] Templates Page 'Build From Scratch' alignment...");
    await page.goto(`${baseUrl}/templates`, { waitUntil: "domcontentloaded" });
    const buildBtn = page.locator('a[href="/design-studio"]:has-text("Build From Scratch")').first();
    await buildBtn.waitFor({ state: "visible", timeout: 5000 });

    const iconBox = await buildBtn.locator("svg").boundingBox();
    const textBox = await buildBtn.locator("span").boundingBox();

    assert.ok(iconBox && textBox, "Icon and text must have bounding boxes");
    const iconCenterY = iconBox.y + iconBox.height / 2;
    const textCenterY = textBox.y + textBox.height / 2;
    const diff = Math.abs(iconCenterY - textCenterY);
    console.log(`  Icon Center Y: ${iconCenterY.toFixed(2)}, Text Center Y: ${textCenterY.toFixed(2)}, Diff: ${diff.toFixed(2)}px`);
    assert.ok(diff <= 2, `Vertical misalignment too large: ${diff}px`);
    console.log("  ✔ Build From Scratch vertical alignment verified!");

    // ----------------------------------------------------
    // Test 3: Design Studio Shapes Pill Selector (z8tvbhx5b5)
    // ----------------------------------------------------
    console.log("Testing [z8tvbhx5b5] Design Studio Shapes 'Pill' capsule preview...");
    await page.goto(`${baseUrl}/design-studio`, { waitUntil: "domcontentloaded" });
    await page.locator("aside[data-studio-tools]").waitFor({ state: "visible", timeout: 8000 });

    const pillRadio = page.locator('[role="radio"]:has-text("Pill")');
    await pillRadio.waitFor({ state: "visible", timeout: 5000 });

    // Check inner capsule preview
    const pillShapePreview = pillRadio.locator(".rounded-full");
    await pillShapePreview.waitFor({ state: "visible", timeout: 5000 });
    const pillBox = await pillShapePreview.boundingBox();
    assert.ok(pillBox, "Pill shape preview must be rendered");
    console.log(`  Pill preview width: ${pillBox.width.toFixed(1)}px, height: ${pillBox.height.toFixed(1)}px`);
    assert.ok(pillBox.width >= pillBox.height * 1.3, "Pill preview must be elongated capsule (width > height), not 1:1 circle");
    console.log("  ✔ Design Studio Pill capsule preview verified!");

    // ----------------------------------------------------
    // Test 4: Privacy Policy Email Link Consistent Underline (z8tvbhwh0a)
    // ----------------------------------------------------
    console.log("Testing [z8tvbhwh0a] Privacy Policy email link underline decoration...");
    await page.goto(`${baseUrl}/privacy`, { waitUntil: "domcontentloaded" });
    const emailLink = page.locator('a[href="mailto:thenevon@sigsignature.com"]');
    await emailLink.waitFor({ state: "visible", timeout: 5000 });

    const styles = await emailLink.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        textDecorationColor: computed.textDecorationColor,
        textDecorationLine: computed.textDecorationLine,
      };
    });
    console.log("  Email link styles:", styles);
    assert.ok(styles.textDecorationLine.includes("underline"), "Email link must have underline");
    assert.strictEqual(
      styles.color,
      styles.textDecorationColor,
      "Email link color and underline decoration color must match identically"
    );
    console.log("  ✔ Privacy policy email link decoration matches text color!");

    // ----------------------------------------------------
    // Test 5: Header Navigation & Dashboard Long Name Truncation (z8tvbhx57y, z8tvbhx58m)
    // ----------------------------------------------------
    console.log("Testing [z8tvbhx57y & z8tvbhx58m] Long user name truncation...");
    const longName = "Aiafassafsafsafsafsfafsafsafsaaaaaaaaaaaaaaaaaaaaa a";
    await page.evaluate((name) => {
      const mockUser = {
        id: "usr_long_name_test",
        email: "longname@example.com",
        firstName: name,
        lastName: "",
        name: name,
      };
      localStorage.setItem("sig_user", JSON.stringify(mockUser));
      localStorage.setItem("sig_token", "valid_test_session_token");
      sessionStorage.setItem("sig_cached_user", JSON.stringify(mockUser));
    }, longName);

    await page.goto(`${baseUrl}/dashboard`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("domcontentloaded");

    // Check Header username truncation
    const headerUserName = page.locator("button[title='User menu'] span.hidden.sm\\:inline-block");
    if (await headerUserName.isVisible()) {
      const headerBox = await headerUserName.boundingBox();
      const textOverflow = await headerUserName.evaluate((el) => window.getComputedStyle(el).textOverflow);
      console.log(`  Header username box width: ${headerBox?.width.toFixed(1)}px, textOverflow: ${textOverflow}`);
      assert.ok(headerBox && headerBox.width <= 200, "Header username width must be constrained <= 200px");
      assert.strictEqual(textOverflow, "ellipsis", "Header username must have text-overflow: ellipsis");
    }

    // Check Dashboard Hero greeting truncation
    const greetingSpan = page.locator("section h1 span.block.truncate");
    await greetingSpan.waitFor({ state: "visible", timeout: 5000 });
    const greetingText = await greetingSpan.innerText();
    const greetingOverflow = await greetingSpan.evaluate((el) => window.getComputedStyle(el).textOverflow);
    console.log(`  Dashboard hero greeting text: "${greetingText}", textOverflow: ${greetingOverflow}`);
    assert.strictEqual(greetingOverflow, "ellipsis", "Dashboard greeting must have text-overflow: ellipsis");
    console.log("  ✔ Long user name truncation verified!");

    // ----------------------------------------------------
    // Test 6: Marketing Navbar Logout Toast Notification (z8tvbhx59u)
    // ----------------------------------------------------
    console.log("Testing [z8tvbhx59u] Marketing Navbar Logout Toast Notification...");
    await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);
    
    // Trigger logout toast event from landing page
    await page.evaluate(() => {
      sessionStorage.setItem("sig_flash_toast", "You have been logged out successfully.");
      window.dispatchEvent(
        new CustomEvent("sig_flash_toast", {
          detail: "You have been logged out successfully.",
        })
      );
    });

    const toastCard = page.locator('text="You have been logged out successfully."');
    await toastCard.waitFor({ state: "visible", timeout: 4000 });
    assert.ok(await toastCard.isVisible(), "Logout toast must be displayed on screen");
    console.log("  ✔ Logout toast notification verified!");

    // ----------------------------------------------------
    // Test 7: Sterling & Co. Template Preview Scaling & No Scrollbars (z8tvbhwzg9)
    // ----------------------------------------------------
    console.log("Testing [z8tvbhwzg9] Sterling & Co. Preview Frame scaling & overflow...");
    await page.goto(`${baseUrl}/templates?template=executive-corporate`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("domcontentloaded");

    // Wait for the preview iframe to appear
    const previewIframe = page.locator('iframe[title="Email Signature Preview"]').first();
    await previewIframe.waitFor({ state: "visible", timeout: 8000 });

    // Ensure the iframe has loaded content
    const frame = page.frameLocator('iframe[title="Email Signature Preview"]').first();
    const tableEl = frame.locator('table').first();
    await tableEl.waitFor({ state: "visible", timeout: 5000 });

    // Verify preview card container has NO horizontal scrollbar
    const previewCard = page.locator('.sticky div.border-slate-100.bg-white.shadow-xs');
    await previewCard.waitFor({ state: "visible", timeout: 3000 });

    const scrollInfo = await previewCard.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
    }));

    console.log(`  Preview card dimensions: clientWidth=${scrollInfo.clientWidth}px, scrollWidth=${scrollInfo.scrollWidth}px`);
    assert.ok(
      scrollInfo.scrollWidth <= scrollInfo.clientWidth + 1,
      `Preview card has horizontal overflow! scrollWidth (${scrollInfo.scrollWidth}) > clientWidth (${scrollInfo.clientWidth})`
    );

    // Verify critical content is present and visible inside the iframe
    const jobTitle = frame.locator('text="Managing Director & Partner"').first();
    assert.ok(await jobTitle.isVisible(), "Job title 'Managing Director & Partner' must be visible in preview");

    // Verify at laptop screen width (1024px)
    console.log("  Checking responsive scaling at 1024px viewport...");
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(600);

    const scrollInfo1024 = await previewCard.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }));
    console.log(`  At 1024px: clientWidth=${scrollInfo1024.clientWidth}px, scrollWidth=${scrollInfo1024.scrollWidth}px`);
    assert.ok(
      scrollInfo1024.scrollWidth <= scrollInfo1024.clientWidth + 1,
      `At 1024px, preview card has horizontal overflow! scrollWidth (${scrollInfo1024.scrollWidth}) > clientWidth (${scrollInfo1024.clientWidth})`
    );

    // Take screenshot of preview for artifact
    await previewCard.screenshot({ path: "/Users/zohaib/.gemini/antigravity/brain/43efaccf-ce6f-41ad-ba5a-5201f13ceea4/sterling_preview_scaled.png" });
    console.log("  ✔ Saved screenshot to sterling_preview_scaled.png");
    console.log("  ✔ Sterling & Co. template preview scaling verified!");

    // ----------------------------------------------------
    // Test 8: Template Editor GitHub Social Link & Validation
    // ----------------------------------------------------
    console.log("Testing GitHub Social Link field, validation & live preview in Template Editor...");
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${baseUrl}/templates?template=bold-gradient`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("domcontentloaded");

    // Open Social Links accordion if not already open
    const socialAccordionBtn = page.locator('button:has-text("Social Links")');
    await socialAccordionBtn.waitFor({ state: "visible", timeout: 10000 });
    const githubLabel = page.locator('label:has-text("GitHub Profile")');
    if (!await githubLabel.isVisible()) {
      await socialAccordionBtn.click();
    }
    await githubLabel.waitFor({ state: "visible", timeout: 3000 });
    assert.ok(await githubLabel.isVisible(), "GitHub Profile label must be rendered in Social Links form");

    // Find GitHub input field
    const githubInput = page.locator('input[placeholder="https://github.com/username"]');
    await githubInput.waitFor({ state: "visible", timeout: 3000 });

    // Test invalid URL validation
    await githubInput.fill("invalid-github-link");
    const ghError = page.locator('p.text-rose-500:has-text("URL must start with https://")');
    await ghError.waitFor({ state: "visible", timeout: 3000 });
    assert.ok(await ghError.isVisible(), "Validation error must show for non-https GitHub link");

    // Test non-github domain validation
    await githubInput.fill("https://gitlab.com/username");
    const ghDomainError = page.locator('p.text-rose-500:has-text("Must be a valid GitHub URL")');
    await ghDomainError.waitFor({ state: "visible", timeout: 3000 });
    assert.ok(await ghDomainError.isVisible(), "Validation error must show for non-github domain");

    // Test valid GitHub URL
    await githubInput.fill("https://github.com/antigravity-dev");
    await page.waitForTimeout(500);
    assert.strictEqual(await ghDomainError.isVisible(), false, "Validation error must disappear for valid GitHub URL");

    // Verify preview iframe contains GitHub link
    const boldGradientFrame = page.frameLocator('iframe[title="Email Signature Preview"]').first();
    const githubLinkInPreview = boldGradientFrame.locator('a[href*="github.com/antigravity-dev"]');
    await githubLinkInPreview.waitFor({ state: "visible", timeout: 4000 });
    assert.ok(await githubLinkInPreview.isVisible(), "Preview iframe must render GitHub icon link");

    // Take screenshot showing the GitHub field and preview
    await page.screenshot({ path: "/Users/zohaib/.gemini/antigravity/brain/43efaccf-ce6f-41ad-ba5a-5201f13ceea4/github_social_verified.png" });
    console.log("  ✔ Saved screenshot to github_social_verified.png");
    console.log("  ✔ GitHub social link and validation fully verified in Template Editor!");

    // ==========================================
    // TEST 9: Landing Page Issues Verification
    // ==========================================
    console.log("Testing [z8tvbhx8ry, z8tvbhx933, z8tvbhx8qc] Landing Page Spacing, CTA, & Category Pills...");
    await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    // 1. Verify CTA Banner Microcopy & Button
    const ctaSection = page.locator("section:has-text('Your Email Signature Is the Last Thing People See')");
    await ctaSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    const ctaMicrocopy = page.locator("text=No credit card. No designer. No developer. Just you.");
    assert.ok(await ctaMicrocopy.isVisible(), "CTA banner must display canonical microcopy");
    await ctaSection.screenshot({ path: "/Users/zohaib/.gemini/antigravity/brain/43efaccf-ce6f-41ad-ba5a-5201f13ceea4/landing_cta_verified.png" });
    console.log("  ✔ Saved screenshot to landing_cta_verified.png");

    // 2. Verify Templates section & How It Works section spacing
    const howItWorksSection = page.locator("#how-it-works");
    assert.ok(await howItWorksSection.isVisible(), "How It Works section must be visible");
    const templatesSection = page.locator("#templates");
    assert.ok(await templatesSection.isVisible(), "Templates section must be visible");

    // Test mobile category pills
    await page.setViewportSize({ width: 375, height: 812 });
    await templatesSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const allPill = page.locator('#templates button:has-text("All")');
    assert.ok(await allPill.isVisible(), "'All' category pill must be visible on mobile viewport");
    const allPillBox = await allPill.boundingBox();
    assert.ok(allPillBox && allPillBox.x >= 0, "'All' pill must not overflow into negative coordinates");
    await page.screenshot({ path: "/Users/zohaib/.gemini/antigravity/brain/43efaccf-ce6f-41ad-ba5a-5201f13ceea4/landing_mobile_templates_verified.png" });
    console.log("  ✔ Saved screenshot to landing_mobile_templates_verified.png");

    // Reset viewport for desktop tests
    await page.setViewportSize({ width: 1280, height: 900 });

    // ==========================================
    // TEST 10: Use Cases Stepper & Preview Cards
    // ==========================================
    console.log("Testing [z8tvbhx93u, z8tvbhx93t, z8tvbhx93f] Use Cases Stepper & Preview Cards...");
    await page.goto(`${baseUrl}/use-cases`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    const executeButton = page.locator('button:has-text("Execute")').first();
    await executeButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    assert.ok(await executeButton.isVisible(), "'Execute' tab button must be present (not 'Executive')");
    await page.screenshot({ path: "/Users/zohaib/.gemini/antigravity/brain/43efaccf-ce6f-41ad-ba5a-5201f13ceea4/use_cases_preview_verified.png" });
    console.log("  ✔ Saved screenshot to use_cases_preview_verified.png");

    const stepperStep1 = page.locator("text=Start with your identity.");
    await stepperStep1.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    assert.ok(await stepperStep1.isVisible(), "Workflow step 1 must be present");
    await page.screenshot({ path: "/Users/zohaib/.gemini/antigravity/brain/43efaccf-ce6f-41ad-ba5a-5201f13ceea4/use_cases_stepper_verified.png" });
    console.log("  ✔ Saved screenshot to use_cases_stepper_verified.png");

    // ==========================================
    // TEST 11: Pricing Page Header, Toggle & Trust Icons
    // ==========================================
    console.log("Testing [z8tvbhx93r] Pricing Page 'Choose Your Package' Header, Toggle & Trust Bar...");
    await page.goto(`${baseUrl}/pricing`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    const pricingHeading = page.locator('h1:has-text("Choose Your Package.")');
    assert.ok(await pricingHeading.isVisible(), "'Choose Your Package.' heading must be visible");

    const teamToggle = page.locator('button:has-text("Businesses & Team")');
    assert.ok(await teamToggle.isVisible(), "'Businesses & Team' toggle must be visible");

    const bestValueBadge = page.locator('span:has-text("Best Value Price")');
    assert.ok(await bestValueBadge.isVisible(), "'Best Value Price' badge must be visible");

    const moneyBackBadge = page.locator('span:has-text("Money back guarantee")');
    await moneyBackBadge.scrollIntoViewIfNeeded();
    assert.ok(await moneyBackBadge.isVisible(), "'Money back guarantee' trust icon must be visible");

    const supportBadge = page.locator('span:has-text("24/7 Live support")');
    assert.ok(await supportBadge.isVisible(), "'24/7 Live support' trust icon must be visible");

    const usersBadge = page.locator('span:has-text("10k+ users globally")');
    assert.ok(await usersBadge.isVisible(), "'10k+ users globally' trust icon must be visible");

    await page.screenshot({ path: "/Users/zohaib/.gemini/antigravity/brain/43efaccf-ce6f-41ad-ba5a-5201f13ceea4/pricing_package_verified.png" });
    console.log("  ✔ Saved screenshot to pricing_package_verified.png");

    console.log("\n🎉 ALL PLAYWRIGHT E2E TESTS PASSED SUCCESSFULLY!");
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error("\n❌ Playwright E2E verification failed:", err);
  process.exit(1);
});
