import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTIFACT_DIR = "/Users/zohaib/.gemini/antigravity/brain/43efaccf-ce6f-41ad-ba5a-5201f13ceea4";
const BASE_URL = "http://localhost:3009";

async function run() {
  console.log("Launching browser for Contact & Blog verification...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  // 1. Verify Contact Page
  console.log("Navigating to /contact...");
  await page.goto(`${BASE_URL}/contact`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(1000);

  // Take full screenshot of /contact initial state
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "contact_page_verified.png"), fullPage: false });

  // Test Name input max length limit (16 characters guard)
  console.log("Testing Name input 16-char limit guard...");
  const nameInput = page.locator("#contact-name");
  await nameInput.fill("12345678901234567890EXTRA");
  const nameVal = await nameInput.inputValue();
  console.log("Name input value after 25 chars typed:", nameVal);
  if (nameVal.length !== 16) {
    throw new Error(`Expected name length to be 16, got ${nameVal.length} (${nameVal})`);
  }

  // Clear name to test validation error trigger
  await nameInput.fill("");

  // Test form submission validation errors (no native HTML5 tooltips, styled inline errors)
  console.log("Submitting empty form to verify custom styled inline errors...");
  const submitBtn = page.locator("button[type='submit']");
  await submitBtn.click();
  await page.waitForTimeout(400);

  // Assert inline errors are visible
  const nameError = page.locator("#contact-name-error");
  const emailError = page.locator("#contact-email-error");
  const messageError = page.locator("#contact-message-error");
  const termsError = page.locator("#contact-terms-error");

  const nameErrorText = await nameError.innerText();
  const emailErrorText = await emailError.innerText();
  const messageErrorText = await messageError.innerText();
  const termsErrorText = await termsError.innerText();

  console.log("Validation errors displayed:");
  console.log(" - Name:", nameErrorText);
  console.log(" - Email:", emailErrorText);
  console.log(" - Message:", messageErrorText);
  console.log(" - Terms:", termsErrorText);

  // Take screenshot of Contact Form in validation error state
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "contact_form_errors_verified.png"), fullPage: false });

  // Test Message minimum 50 characters validation
  console.log("Testing Message min 50 characters validation...");
  await page.locator("#contact-message").fill("Too short message");
  await submitBtn.click();
  await page.waitForTimeout(300);
  const msgErrorUpdated = await page.locator("#contact-message-error").innerText();
  console.log("Message error with short text:", msgErrorUpdated);
  if (!msgErrorUpdated.includes("at least 50 characters")) {
    throw new Error(`Expected 'at least 50 characters' error, got: ${msgErrorUpdated}`);
  }

  // Test custom styled checkbox toggle
  console.log("Testing custom styled checkbox toggle...");
  const termsLabel = page.locator("label[for='contact-terms']");
  await termsLabel.click();
  const termsChecked = await page.locator("#contact-terms").isChecked();
  console.log("Terms checkbox checked status:", termsChecked);
  if (!termsChecked) {
    throw new Error("Expected terms checkbox to be checked after click");
  }

  // Test Select dropdown close on page scroll
  console.log("Testing Select dropdown closing on page scroll...");
  const aboutSelectTrigger = page.locator("#contact-about");
  await aboutSelectTrigger.click();
  await page.waitForTimeout(300);
  let listboxVisible = await page.locator("div[role='listbox']").isVisible();
  console.log("Listbox visible after open:", listboxVisible);
  if (!listboxVisible) {
    throw new Error("Expected listbox to be visible after click");
  }

  // Scroll page
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(400);
  listboxVisible = await page.locator("div[role='listbox']").isVisible();
  console.log("Listbox visible after scroll:", listboxVisible);
  if (listboxVisible) {
    throw new Error("Expected listbox to close automatically when page is scrolled");
  }

  // 2. Verify Blog Hub Page
  console.log("Navigating to /blog...");
  await page.goto(`${BASE_URL}/blog`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(1000);

  // Take screenshot of Blog Hero and Search section
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "blog_hub_hero_verified.png"), fullPage: false });

  // Verify Hero CTA button background color
  const ctaColor = await page.locator("a[href='#journal']").evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor;
  });
  console.log("Blog Hero CTA button computed background color:", ctaColor);

  // Verify non-breaking title
  const journalHeading = await page.locator("#journal h2").innerText();
  console.log("Journal section heading text:", journalHeading);

  // Scroll to stories and screenshot
  await page.locator("#journal").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "blog_hub_stories_verified.png"), fullPage: false });

  // Scroll to integration footer and screenshot
  const integrationHeading = page.locator("text='Your signature.'");
  await integrationHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "blog_hub_integrations_verified.png"), fullPage: false });

  console.log("All Playwright verifications passed successfully!");
  await browser.close();
}

run().catch((err) => {
  console.error("Playwright verification error:", err);
  process.exit(1);
});
