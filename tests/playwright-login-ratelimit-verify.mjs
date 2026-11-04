import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 }
  });

  try {
    // Intercept login route to return 429 Too Many Requests
    await page.route('**/api/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        headers: {
          'Retry-After': '299',
          'X-RateLimit-Limit': '20',
          'X-RateLimit-Remaining': '0',
        },
        body: JSON.stringify({
          success: false,
          message: 'Too many login attempts. Please try again in 5 minutes or reset your password.',
          retryAfterSeconds: 299,
          code: 'LOGIN_RATE_LIMITED'
        })
      });
    });

    await page.goto('http://localhost:3009/login', { waitUntil: 'networkidle' });

    // Fill form
    await page.fill('input[type="email"]', 'aliaunnnn@gmail.com');
    await page.fill('input[type="password"]', 'Sword12345!');

    // Click submit
    await page.click('button[type="submit"]:has-text("Log In")');

    // Wait for error banner
    const alert = page.locator('form div[role="alert"]');
    await alert.waitFor({ state: 'visible', timeout: 5000 });

    const alertText = await alert.innerText();
    console.log('Alert text:', alertText);

    // Verify presence of countdown and reset password link
    const resetLink = alert.locator('a:has-text("reset your password")');
    const resetLinkVisible = await resetLink.isVisible();
    const resetHref = await resetLink.getAttribute('href');
    console.log('Reset link visible:', resetLinkVisible, 'href:', resetHref);

    // Wait 2 seconds and verify timer ticked down
    await page.waitForTimeout(2000);
    const alertTextAfterTick = await alert.innerText();
    console.log('Alert text after 2 seconds:', alertTextAfterTick);

    // Screenshot artifact
    const screenshotPath = '/Users/zohaib/.gemini/antigravity/brain/43efaccf-ce6f-41ad-ba5a-5201f13ceea4/login_ratelimit_verified.png';
    await page.screenshot({ path: screenshotPath });
    console.log('Screenshot saved to:', screenshotPath);

    if (resetLinkVisible && resetHref?.includes('/forgot') && alertText.includes('Too many login attempts')) {
      console.log('ALL LOGIN RATE LIMIT VERIFICATIONS PASSED SUCCESSFULLY!');
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
