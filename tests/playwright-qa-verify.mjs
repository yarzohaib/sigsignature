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
    await page.goto(`${baseUrl}/`);
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
    await page.goto(`${baseUrl}/templates`);
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
    await page.goto(`${baseUrl}/design-studio`);
    await page.locator("aside[data-studio-tools]").waitFor({ state: "visible", timeout: 8000 });

    const pillRadio = page.locator('[role="radio"]:has-text("Pill")');
    await pillRadio.waitFor({ state: "visible", timeout: 5000 });

    // Check inner capsule preview
    const pillShapePreview = pillRadio.locator(".rounded-full");
    await pillShapePreview.waitFor({ state: "visible", timeout: 5000 });
    const pillBox = await pillShapePreview.boundingBox();
    assert.ok(pillBox, "Pill shape preview must be rendered");
    console.log(`  Pill preview width: ${pillBox.width.toFixed(1)}px, height: ${pillBox.height.toFixed(1)}px`);
    assert.ok(pillBox.width > pillBox.height * 1.4, "Pill preview must be elongated capsule (width > 1.4 * height), not 1:1 circle");
    console.log("  ✔ Design Studio Pill capsule preview verified!");

    // ----------------------------------------------------
    // Test 4: Privacy Policy Email Link Consistent Underline (z8tvbhwh0a)
    // ----------------------------------------------------
    console.log("Testing [z8tvbhwh0a] Privacy Policy email link underline decoration...");
    await page.goto(`${baseUrl}/privacy`);
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

    await page.goto(`${baseUrl}/dashboard`);
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
    await page.goto(`${baseUrl}/`);
    
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
    await page.goto(`${baseUrl}/templates?template=executive-corporate`);
    await page.waitForLoadState("domcontentloaded");

    // Wait for the preview iframe to appear
    const previewIframe = page.locator('iframe[title="Email Signature Preview"]');
    await previewIframe.waitFor({ state: "visible", timeout: 8000 });

    // Ensure the iframe has loaded content
    const frame = page.frameLocator('iframe[title="Email Signature Preview"]');
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

    console.log("\n🎉 ALL PLAYWRIGHT E2E TESTS PASSED SUCCESSFULLY!");
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error("\n❌ Playwright E2E verification failed:", err);
  process.exit(1);
});
