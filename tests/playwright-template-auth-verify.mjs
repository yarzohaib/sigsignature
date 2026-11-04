import { chromium } from "playwright";
import assert from "node:assert";

async function run() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  const baseUrl = "http://localhost:3009";

  // Track 401 responses and console errors
  const unauthorizedRequests = [];
  page.on("response", (res) => {
    if (res.status() === 401) {
      unauthorizedRequests.push(res.url());
    }
  });

  console.log("1. Verifying /template redirects to /templates...");
  await page.goto(`${baseUrl}/template`, { waitUntil: "domcontentloaded" });
  await page.waitForURL("**/templates", { timeout: 8000 });
  assert.ok(page.url().includes("/templates"), "Must redirect from /template to /templates");
  console.log("  ✔ /template redirect verified!");

  console.log("2. Verifying unauthenticated /templates view...");
  await page.waitForSelector("main", { timeout: 10000 });

  // Verify dashboard sidebar is NOT present
  const sidebar = page.locator('[data-dashboard-sidebar="true"]');
  const sidebarCount = await sidebar.count();
  assert.strictEqual(sidebarCount, 0, "Unauthenticated guest must NOT see the dashboard sidebar");
  console.log("  ✔ Confirmed dashboard sidebar is hidden!");
  console.log("  ✔ Confirmed dashboard sidebar is hidden!");

  // Verify marketing navbar is present
  const navbar = page.locator("header nav");
  assert.ok(await navbar.isVisible(), "Marketing navbar should be visible");
  console.log("  ✔ Marketing navbar is visible!");

  // Verify no 401s occurred
  assert.strictEqual(
    unauthorizedRequests.length,
    0,
    `Zero 401 errors allowed on public /templates browsing, but got: ${unauthorizedRequests.join(", ")}`
  );
  console.log("  ✔ Confirmed 0 unauthorized (401) network errors!");

  console.log("3. Verifying template selection & inline editor...");
  const firstCard = page.locator('.group').first();
  await firstCard.scrollIntoViewIfNeeded();
  await firstCard.hover();

  const firstUseBtn = page.locator('button:has-text("Use This Template")').first();
  await firstUseBtn.click({ force: true });

  // Wait for editor to appear
  const fullNameInput = page.locator('input[placeholder="e.g. Daniel Wilson"]');
  await fullNameInput.waitFor({ state: "visible", timeout: 8000 });
  console.log("  ✔ Template editor opened successfully without login redirect!");

  // Verify sidebar is still hidden in editor
  assert.strictEqual(
    await page.locator('[data-dashboard-sidebar="true"]').count(),
    0,
    "Sidebar must remain hidden in template editor"
  );

  console.log("4. Modifying details in template editor...");
  await fullNameInput.fill("Alexander Hamilton");

  console.log("5. Testing 'Save the Signature' guest auth prompt...");
  const saveBtn = page.locator('button:has-text("Save the Signature")');
  await saveBtn.scrollIntoViewIfNeeded();
  await saveBtn.click();

  // Wait for auth modal to appear
  const modalTitle = page.locator("#auth-modal-title");
  await modalTitle.waitFor({ state: "visible", timeout: 5000 });
  const titleText = await modalTitle.textContent();
  assert.ok(titleText?.includes("Sign in to save your signature"), "Modal title must match expected prompt");
  console.log("  ✔ Auth prompt modal appeared: ", titleText);

  // Verify Signup and Login buttons exist in modal
  const modal = page.locator('[role="dialog"]');
  const signupLink = modal.locator('a:has-text("Create Free Account")');
  const loginLink = modal.locator('a:has-text("Log In")');
  assert.ok(await signupLink.isVisible(), "Create Free Account button must be visible");
  assert.ok(await loginLink.isVisible(), "Log In button must be visible");
  console.log("  ✔ Signup and Login buttons are present in modal!");

  // Save screenshot of the auth prompt modal
  const screenshotPath = "/Users/zohaib/.gemini/antigravity/brain/43efaccf-ce6f-41ad-ba5a-5201f13ceea4/template_auth_modal_verified.png";
  await page.screenshot({ path: screenshotPath });
  console.log(`  ✔ Screenshot saved to ${screenshotPath}`);

  console.log("6. Testing modal dismissal options...");
  // Test Close button (cross icon)
  const closeBtn = modal.locator('button[aria-label="Close modal"]');
  assert.ok(await closeBtn.isVisible(), "Cross icon must be visible on top right");
  await closeBtn.click();
  await modalTitle.waitFor({ state: "hidden", timeout: 3000 });
  console.log("  ✔ Cross icon closed the modal!");

  // Open modal again
  await saveBtn.click();
  await modalTitle.waitFor({ state: "visible", timeout: 3000 });

  // Click outside (backdrop click) to dismiss
  // Click near the top edge of the backdrop (outside the 440px wide modal)
  await page.mouse.click(50, 50);
  await modalTitle.waitFor({ state: "hidden", timeout: 3000 });
  console.log("  ✔ Tapping outside the modal closed the popup!");

  // Open modal again
  await saveBtn.click();
  await modalTitle.waitFor({ state: "visible", timeout: 3000 });

  // Press Escape to dismiss
  await page.keyboard.press("Escape");
  await modalTitle.waitFor({ state: "hidden", timeout: 3000 });
  console.log("  ✔ Pressing Escape closed the popup!");

  // Final check: confirm still zero 401s across the entire user journey!
  assert.strictEqual(
    unauthorizedRequests.length,
    0,
    `Zero 401 errors allowed throughout session, but got: ${unauthorizedRequests.join(", ")}`
  );
  console.log("  ✔ Confirmed 0 unauthorized (401) requests throughout complete journey!");

  await browser.close();
  console.log("ALL TEMPLATE AUTH & REDIRECT TESTS PASSED CLEANLY!");
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
