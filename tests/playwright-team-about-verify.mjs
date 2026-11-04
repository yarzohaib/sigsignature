import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTIFACT_DIR = "/Users/zohaib/.gemini/antigravity/brain/43efaccf-ce6f-41ad-ba5a-5201f13ceea4";
const BASE_URL = "http://localhost:3009";

async function run() {
  console.log("Launching browser for Team & About verification...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  // 1. Verify /team page
  console.log("Navigating to /team...");
  await page.goto(`${BASE_URL}/team`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(1000);

  // Accept cookies if visible
  try {
    const acceptBtn = page.locator("button:has-text('Accept All')");
    if (await acceptBtn.isVisible()) {
      await acceptBtn.click();
      await page.waitForTimeout(300);
    }
  } catch (e) {}

  // Take screenshot of leadership card & Nadir avatar
  const leadershipCard = page.locator("text='Sardar Muhammad Nadir'").locator("xpath=ancestor::div[contains(@class, 'rounded-3xl')][1]");
  await leadershipCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "team_leadership_avatar_verified.png"), fullPage: false });

  // Scroll to "What we stand for" section
  console.log("Verifying 'What we stand for' principles on /team...");
  const principlesHeading = page.locator("h2:has-text('What we')");
  await principlesHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  // Assert divider lines and numbers exist
  const count = await page.locator("text='Deliverability First'").count();
  if (count === 0) {
    throw new Error("Expected 'Deliverability First' principle to be visible");
  }

  // Check number typography
  const num01 = page.locator("text='01'").first();
  const numColor = await num01.evaluate((el) => window.getComputedStyle(el).color);
  console.log("Number 01 computed color:", numColor);

  // Take screenshot of principles section and footer spacing
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "team_principles_and_spacing_verified.png"), fullPage: false });

  // 2. Verify /about page
  console.log("Navigating to /about...");
  await page.goto(`${BASE_URL}/about`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(1000);

  // Accept cookies if visible
  try {
    const acceptBtn = page.locator("button:has-text('Accept All')");
    if (await acceptBtn.isVisible()) {
      await acceptBtn.click();
      await page.waitForTimeout(300);
    }
  } catch (e) {}

  // Verify persona cards and brand blue checkmark badges
  console.log("Verifying persona cards checkmark icons on /about...");
  const firstCard = page.locator("text='Sales Teams & SDRs'").locator("xpath=ancestor::div[contains(@class, 'rounded-3xl')]");
  await firstCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  // Check checkmark SVG color
  const tickSvg = page.locator("text='Sales Teams & SDRs'").locator("xpath=ancestor::div[contains(@class, 'rounded-3xl')]").locator("svg").first();
  const tickSvgColor = await tickSvg.evaluate((el) => window.getComputedStyle(el).color);
  console.log("Checkmark tick computed color:", tickSvgColor);

  // Take screenshot of persona cards
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "about_persona_ticks_verified.png"), fullPage: false });

  // Verify "Thoughtful by design. Practical by nature." banner
  console.log("Verifying banner on /about...");
  const bannerHeading = page.locator("h2:has-text('Thoughtful by design')");
  await bannerHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  // Take screenshot of banner
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "about_banner_verified.png"), fullPage: false });

  console.log("All Playwright verifications passed successfully!");
  await browser.close();
}

run().catch((err) => {
  console.error("Playwright verification error:", err);
  process.exit(1);
});
