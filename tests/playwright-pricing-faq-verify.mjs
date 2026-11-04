import { chromium } from 'playwright';
import path from 'path';

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 }
  });

  try {
    await page.goto('http://localhost:3009/pricing', { waitUntil: 'networkidle' });
    
    // Check heading
    const heading = page.locator('#pricing-faq-heading');
    await heading.waitFor({ state: 'visible' });
    const headingText = await heading.textContent();
    console.log('Heading text:', headingText);

    // Verify subtext is present
    const subtext = page.locator('text="Helpful details to make choosing your plan feel easy."');
    const subtextCount = await subtext.count();
    console.log('Subtext count (should be 1):', subtextCount);

    // Verify 9 FAQ items
    const faqButtons = page.locator('section[aria-labelledby="pricing-faq-heading"] article button');
    const buttonCount = await faqButtons.count();
    console.log('FAQ item count (should be 9):', buttonCount);

    for (let i = 0; i < buttonCount; i++) {
      const text = await faqButtons.nth(i).textContent();
      console.log(`FAQ [${i+1}]:`, text?.trim());
    }

    // Scroll into view
    await heading.scrollIntoViewIfNeeded();

    // Check first answer is collapsed initially
    const firstAnswer = page.locator('text="Credit card, bank transfer, or invoice."');
    const isFirstVisible = await firstAnswer.isVisible();
    console.log('Q1 answer visible initially (should be false):', isFirstVisible);

    // Click Q1 to expand
    const q1Button = faqButtons.nth(0);
    await q1Button.click();
    await page.waitForTimeout(600);
    const isFirstVisibleAfterClick = await firstAnswer.isVisible();
    console.log('Q1 answer visible after click (should be true):', isFirstVisibleAfterClick);

    // Click Q2
    const q2Button = faqButtons.nth(1);
    await q2Button.scrollIntoViewIfNeeded();
    await q2Button.click();
    await page.waitForTimeout(800);

    const q2Answer = page.locator('#pricing-faq-answer-1');
    const isQ2Visible = await q2Answer.isVisible();
    console.log('Q2 answer visible after click:', isQ2Visible);
    if (isQ2Visible) {
      console.log('Q2 text:', await q2Answer.innerText());
    }

    // Click Q2 again to collapse all (matching user screenshot)
    await q2Button.click();
    await page.waitForTimeout(400);

    // Take screenshot of FAQ section
    const faqSection = page.locator('section:has(#pricing-faq-heading)');
    const screenshotPath = '/Users/zohaib/.gemini/antigravity/brain/43efaccf-ce6f-41ad-ba5a-5201f13ceea4/pricing_faq_verified.png';
    await faqSection.screenshot({ path: screenshotPath });
    console.log('Screenshot saved to:', screenshotPath);

    if (headingText?.trim() === 'Questions, answered.' && subtextCount === 1 && buttonCount === 9) {
      console.log('ALL FAQ VERIFICATIONS PASSED SUCCESSFULLY!');
    } else {
      console.error('VERIFICATION FAILED!');
      process.exit(1);
    }
  } catch (err) {
    console.error('Error during test:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
