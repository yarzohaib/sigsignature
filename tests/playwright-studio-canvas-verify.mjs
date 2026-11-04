import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1600, height: 900 }
  });

  try {
    // Intercept APIs for design studio
    await page.route('**/api/v1/**', async (route) => {
      const url = route.request().url();
      if (url.includes('/api/v1/auth/me')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              user: { id: 'usr_test', email: 'test@example.com', name: 'Test User' }
            }
          })
        });
      }
      if (url.includes('/api/v1/signatures')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: [] })
        });
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    // Go to homepage first to inject localStorage & cookies
    await page.goto('http://localhost:3009/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      const mockUser = {
        id: "usr_test",
        email: "test@example.com",
        name: "Test User",
        firstName: "Test",
        lastName: "User"
      };
      localStorage.setItem("sig_access_token", "test_valid_token");
      localStorage.setItem("sig_user", JSON.stringify(mockUser));
      document.cookie = "sig_token=test_valid_token; path=/;";
    });

    // Navigate to design studio
    await page.goto('http://localhost:3009/design-studio', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const canvas = page.locator('[data-signature-canvas]');
    await canvas.waitFor({ state: 'visible', timeout: 10000 });

    // Measure bounding boxes
    const canvasBox = await canvas.boundingBox();
    const stage = page.locator('.flex-1.overflow-auto.flex.flex-col.items-center');
    const stageBox = await stage.boundingBox();

    console.log('Canvas Box:', canvasBox);
    console.log('Stage Box:', stageBox);

    if (canvasBox && stageBox) {
      const topSpace = canvasBox.y - stageBox.y;
      const bottomSpace = (stageBox.y + stageBox.height) - (canvasBox.y + canvasBox.height);
      console.log(`Top space: ${topSpace.toFixed(1)}px, Bottom space: ${bottomSpace.toFixed(1)}px`);
      const diff = Math.abs(topSpace - bottomSpace);
      console.log(`Centering delta: ${diff.toFixed(1)}px`);

      if (diff < 60) {
        console.log('CANVAS IS BEAUTIFULLY CENTERED VERTICALLY!');
      } else {
        console.warn('Canvas centering difference:', diff);
      }
    }

    const screenshotPath = '/Users/zohaib/.gemini/antigravity/brain/43efaccf-ce6f-41ad-ba5a-5201f13ceea4/design_studio_canvas_centered.png';
    await page.screenshot({ path: screenshotPath });
    console.log('Screenshot saved to:', screenshotPath);
  } catch (err) {
    console.error('Error during test:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
