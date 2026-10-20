import { chromium, type Browser } from "playwright";
import fs from "node:fs";
import path from "node:path";

interface ViewportConfig {
  width: number;
  height: number;
  name: string;
}

const VIEWPORTS: ViewportConfig[] = [
  { width: 320, height: 568, name: "320" },
  { width: 360, height: 640, name: "360" },
  { width: 390, height: 844, name: "390" },
  { width: 430, height: 932, name: "430" },
  { width: 600, height: 960, name: "600" },
  { width: 768, height: 1024, name: "768" },
  { width: 820, height: 1180, name: "820" },
  { width: 1024, height: 768, name: "1024" },
  { width: 1180, height: 820, name: "1180" },
  { width: 1280, height: 800, name: "1280" },
  { width: 1366, height: 768, name: "1366" },
  { width: 1440, height: 900, name: "1440" },
  { width: 1536, height: 864, name: "1536" },
  { width: 1920, height: 1080, name: "1920" },
  { width: 2560, height: 1440, name: "2560" },
  { width: 844, height: 390, name: "844x390-landscape" },
];

const TARGET_URL = process.env.TEST_URL || process.argv[2] || "http://localhost:3000/";
const SCREENSHOT_DIR = path.resolve(process.cwd(), "screenshots/responsive");

async function getBrowser(): Promise<Browser> {
  const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  if (fs.existsSync(chromePath)) {
    try {
      return await chromium.launch({ executablePath: chromePath, headless: true });
    } catch {
      // fallback to standard chromium
    }
  }
  return await chromium.launch({ headless: true });
}

async function runAudit() {
  console.log(`\n======================================================`);
  console.log(`Starting Responsive Check against: ${TARGET_URL}`);
  console.log(`======================================================\n`);

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser = await getBrowser();
  let hasFatalError = false;

  for (const vp of VIEWPORTS) {
    console.log(`\n🔍 Checking viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    try {
      await page.goto(TARGET_URL, { waitUntil: "networkidle", timeout: 30000 });
    } catch {
      await page.goto(TARGET_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
    }

    // Scroll through the entire page to trigger in-view reveals
    await page.evaluate(async () => {
      const scrollStep = 350;
      const scrollDelay = 60;
      for (let y = 0; y < document.body.scrollHeight; y += scrollStep) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, scrollDelay));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });

    // Capture full-page screenshot
    const screenshotPath = path.join(SCREENSHOT_DIR, `responsive-${vp.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`  📸 Full page screenshot saved: ${path.relative(process.cwd(), screenshotPath)}`);

    // Run audit evaluations
    const report = await page.evaluate(
      ({ width }) => {
        const docEl = document.documentElement;
        const body = document.body;

        // (a) Horizontal overflow
        const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
        const clientWidth = Math.max(docEl.clientWidth, body.clientWidth);
        const hasHorizontalOverflow = scrollWidth > clientWidth;

        // (b) Elements wider than the viewport
        const widerElements: Array<{ tag: string; id: string; className: string; elementWidth: number }> = [];
        const allElements = document.querySelectorAll<HTMLElement>("*");
        allElements.forEach((el) => {
          if (["HTML", "BODY", "MAIN", "SECTION"].includes(el.tagName)) return;
          const rect = el.getBoundingClientRect();
          // Check if element's visible bounding width exceeds viewport
          if (rect.width > width + 1) {
            const style = window.getComputedStyle(el);
            if (style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0") {
              // Check if clipped by an ancestor with overflow hidden/clip that fits in the viewport
              let isClipped = false;
              let parent = el.parentElement;
              while (parent && !["HTML", "BODY", "MAIN"].includes(parent.tagName)) {
                const pStyle = window.getComputedStyle(parent);
                if (
                  pStyle.overflowX === "hidden" ||
                  pStyle.overflowX === "clip" ||
                  pStyle.overflow === "hidden" ||
                  pStyle.overflow === "clip"
                ) {
                  const pRect = parent.getBoundingClientRect();
                  if (pRect.width <= width + 1) {
                    isClipped = true;
                    break;
                  }
                }
                parent = parent.parentElement;
              }

              const isDecorative =
                el.getAttribute("aria-hidden") === "true" ||
                Boolean(el.closest('[aria-hidden="true"]')) ||
                style.pointerEvents === "none";

              if (isClipped && (isDecorative || style.position === "absolute")) {
                return;
              }

              widerElements.push({
                tag: el.tagName.toLowerCase(),
                id: el.id,
                className: el.className ? el.className.toString().slice(0, 60) : "",
                elementWidth: Math.round(rect.width),
              });
            }
          }
        });

        // (c) Elements with overflow hidden that clip text
        const clippedTextElements: Array<{ tag: string; className: string; scrollW: number; clientW: number; text: string }> = [];
        allElements.forEach((el) => {
          const style = window.getComputedStyle(el);
          if (
            (style.overflowX === "hidden" || style.overflow === "hidden") &&
            el.scrollWidth > el.clientWidth + 2
          ) {
            // Check if element has meaningful text content that might be clipped
            const directText = Array.from(el.childNodes)
              .filter((n) => n.nodeType === Node.TEXT_NODE)
              .map((n) => n.textContent?.trim())
              .filter(Boolean)
              .join(" ");

            if (directText && directText.length > 5) {
              clippedTextElements.push({
                tag: el.tagName.toLowerCase(),
                className: el.className ? el.className.toString().slice(0, 60) : "",
                scrollW: el.scrollWidth,
                clientW: el.clientWidth,
                text: directText.slice(0, 40),
              });
            }
          }
        });

        // (d) Links and buttons smaller than 44x44 below 1024
        const smallTapTargets: Array<{ tag: string; text: string; w: number; h: number }> = [];
        if (width < 1024) {
          const interactives = document.querySelectorAll<HTMLElement>("a, button");
          interactives.forEach((el) => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            if (
              style.display !== "none" &&
              style.visibility !== "hidden" &&
              style.opacity !== "0" &&
              rect.width > 0 &&
              rect.height > 0
            ) {
              // Ignore elements inside hidden desktop wrappers or background overlays
              if (rect.width < 43.5 || rect.height < 43.5) {
                smallTapTargets.push({
                  tag: el.tagName.toLowerCase(),
                  text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30),
                  w: Math.round(rect.width),
                  h: Math.round(rect.height),
                });
              }
            }
          });
        }

        // (e) Text smaller than 14px on phones (< 600px)
        const smallTextElements: Array<{ tag: string; fontSize: string; text: string }> = [];
        if (width < 600) {
          allElements.forEach((el) => {
            if (el.children.length === 0) {
              const text = el.textContent?.trim();
              if (text && text.length > 2) {
                const style = window.getComputedStyle(el);
                if (style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0") {
                  const size = parseFloat(style.fontSize);
                  if (size < 13.5) {
                    smallTextElements.push({
                      tag: el.tagName.toLowerCase(),
                      fontSize: `${size}px`,
                      text: text.slice(0, 40),
                    });
                  }
                }
              }
            }
          });
        }

        return {
          scrollWidth,
          clientWidth,
          hasHorizontalOverflow,
          widerElements: widerElements.slice(0, 5),
          clippedTextElements: clippedTextElements.slice(0, 5),
          smallTapTargets: smallTapTargets.slice(0, 8),
          smallTextElements: smallTextElements.slice(0, 8),
        };
      },
      { width: vp.width, height: vp.height }
    );

    // Results output
    if (report.hasHorizontalOverflow) {
      console.error(`  ❌ (a) Horizontal Overflow detected! scrollWidth=${report.scrollWidth} > clientWidth=${report.clientWidth}`);
      hasFatalError = true;
    } else {
      console.log(`  ✅ (a) No horizontal overflow (scrollWidth: ${report.scrollWidth}px, clientWidth: ${report.clientWidth}px)`);
    }

    if (report.widerElements.length > 0) {
      console.error(`  ❌ (b) Elements wider than viewport (${vp.width}px):`);
      report.widerElements.forEach((el) => {
        console.error(`     - <${el.tag}> (width: ${el.elementWidth}px): ${el.className || el.id || "no class"}`);
      });
      hasFatalError = true;
    } else {
      console.log(`  ✅ (b) No elements wider than viewport`);
    }

    if (report.clippedTextElements.length > 0) {
      console.warn(`  ⚠️ (c) Elements with overflow:hidden clipping text:`);
      report.clippedTextElements.forEach((el) => {
        console.warn(`     - <${el.tag}> (scrollW: ${el.scrollW} > clientW: ${el.clientW}): "${el.text}"`);
      });
    } else {
      console.log(`  ✅ (c) No text clipped by overflow:hidden`);
    }

    if (vp.width < 1024) {
      if (report.smallTapTargets.length > 0) {
        console.warn(`  ⚠️ (d) Tap targets under 44x44px:`);
        report.smallTapTargets.forEach((t) => {
          console.warn(`     - <${t.tag}> "${t.text}" is ${t.w}x${t.h}px`);
        });
      } else {
        console.log(`  ✅ (d) All interactive targets are ≥ 44x44px`);
      }
    }

    if (vp.width < 600) {
      if (report.smallTextElements.length > 0) {
        console.warn(`  ℹ️ (e) Text smaller than 14px on phone (${report.smallTextElements.length} instances):`);
        report.smallTextElements.forEach((t) => {
          console.warn(`     - <${t.tag}> (${t.fontSize}): "${t.text}"`);
        });
      } else {
        console.log(`  ✅ (e) No body text smaller than 14px on phone`);
      }
    }

    await context.close();
  }

  await browser.close();

  console.log(`\n======================================================`);
  if (hasFatalError) {
    console.error(`❌ Check failed with fatal horizontal overflow or wider elements!`);
    process.exit(1);
  } else {
    console.log(`🎉 Check passed! All viewports have 0 horizontal overflow and no elements exceeding viewport width.`);
  }
}

runAudit().catch((err) => {
  console.error("Fatal error running responsive audit:", err);
  process.exit(1);
});
