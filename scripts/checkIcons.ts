import http from "node:http";
import type { AddressInfo } from "node:net";
import { AVAILABLE_TEMPLATES } from "../src/lib/templatesData";
import {
  SIGNATURE_COLOR_SWATCHES,
  ICON_STYLES,
  SOCIAL_NETWORKS,
} from "../src/lib/signatureConstants";
import { ICON_PALETTE, isPaletteColor } from "../src/lib/email-core/iconPalette";
import { generateTemplateHtml } from "../src/lib/templates/renderTemplateHtml";
import { emailIconUrl } from "../src/lib/email-core";
import { GET as iconRouteHandler } from "../src/app/api/icons/[style]/[color]/[network]/route";

import type { TemplateSignatureData } from "../src/types/template";

const RANDOM_HEX = "#A855F7"; // Random non-palette hex color for testing

const ALL_SOCIAL_HANDLES: TemplateSignatureData["socials"] = {
  linkedin: "https://linkedin.com/in/testuser",
  twitter: "https://twitter.com/testuser",
  facebook: "https://facebook.com/testuser",
  instagram: "https://instagram.com/testuser",
  github: "https://github.com/testuser",
  youtube: "https://youtube.com/testuser",
  website: "https://example.com",
};

interface TestResult {
  url: string;
  status: number;
  contentType: string | null;
  size: number;
  sourceHeader?: string | null;
  passed: boolean;
  error?: string;
}

interface FetchOutput {
  status: number;
  contentType: string | null;
  sourceHeader: string | null;
  buffer: ArrayBuffer;
}

async function probeUrl(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1000);
    const res = await fetch(url, { method: "HEAD", signal: controller.signal });
    clearTimeout(timer);
    return res.status < 500;
  } catch {
    return false;
  }
}

async function startLocalServer(): Promise<{ server: http.Server; baseUrl: string }> {
  const server = http.createServer(async (req, res) => {
    try {
      const host = req.headers.host || "127.0.0.1";
      const fullUrl = new URL(req.url || "/", `http://${host}`);
      const match = fullUrl.pathname.match(/^\/api\/icons\/([^/]+)\/([^/]+)\/([^/]+)$/);

      if (match) {
        const [, style, color, network] = match;
        const request = new Request(fullUrl.toString(), {
          method: req.method || "GET",
          headers: req.headers as HeadersInit,
        });

        const response = await iconRouteHandler(request, {
          params: Promise.resolve({ style, color, network }),
        });

        res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
        const buf = await response.arrayBuffer();
        res.end(Buffer.from(buf));
        return;
      }

      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end(err instanceof Error ? err.message : String(err));
    }
  });

  return new Promise((resolve, reject) => {
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address() as AddressInfo;
      const baseUrl = `http://127.0.0.1:${addr.port}`;
      resolve({ server, baseUrl });
    });
    server.on("error", reject);
  });
}

async function executeIconRequest(
  targetUrl: string,
  style: string,
  color: string,
  network: string
): Promise<FetchOutput> {
  try {
    const response = await fetch(targetUrl);
    const status = response.status;
    const contentType = response.headers.get("content-type");
    const sourceHeader = response.headers.get("x-icon-source");
    const buffer = await response.arrayBuffer();
    return { status, contentType, sourceHeader, buffer };
  } catch (fetchErr: unknown) {
    const isEperm =
      fetchErr instanceof Error &&
      ((fetchErr as { code?: string }).code === "EPERM" ||
        (fetchErr as { cause?: { code?: string } }).cause?.code === "EPERM");

    if (isEperm) {
      // Sandboxed environment restricts local loopback sockets; route directly to Next.js route handler
      const req = new Request(targetUrl);
      const response = await iconRouteHandler(req, {
        params: Promise.resolve({ style, color, network }),
      });
      const status = response.status;
      const contentType = response.headers.get("content-type");
      const sourceHeader = response.headers.get("x-icon-source");
      const buffer = await response.arrayBuffer();
      return { status, contentType, sourceHeader, buffer };
    }
    throw fetchErr;
  }
}

async function main(): Promise<void> {
  console.log("=== SigSignature Social Icons & Hybrid Serving Verification ===");

  // Determine target server URL
  const existingServer =
    process.env.CHECK_SERVER_URL ||
    (await probeUrl("http://127.0.0.1:3000") ? "http://127.0.0.1:3000" : null);

  let targetBaseUrl = existingServer;
  let activeServer: http.Server | null = null;

  if (targetBaseUrl) {
    console.log(`Using existing running server at: ${targetBaseUrl}`);
  } else {
    try {
      const { server, baseUrl } = await startLocalServer();
      activeServer = server;
      targetBaseUrl = baseUrl;
      console.log(`Local verification HTTP server running at: ${targetBaseUrl}`);
    } catch {
      targetBaseUrl = "http://127.0.0.1:3000";
    }
  }

  // Ensure emailIconUrl produces URLs targeting targetBaseUrl for verification
  process.env.NEXT_PUBLIC_SITE_URL = targetBaseUrl;

  const collectedUrls = new Set<string>();

  console.log(`\nCollecting icon URLs from ${AVAILABLE_TEMPLATES.length} templates...`);

  // 1. Collect from every template with every color, style, and network
  for (const template of AVAILABLE_TEMPLATES) {
    const testColors = [
      ...SIGNATURE_COLOR_SWATCHES,
      template.defaultData.themeColor,
      RANDOM_HEX,
    ];

    for (const color of testColors) {
      for (const style of ICON_STYLES) {
        // Render signature HTML with all social channels populated
        const renderData = {
          ...template.defaultData,
          themeColor: color,
          socialIconsStyle: style,
          socials: ALL_SOCIAL_HANDLES,
        };

        const html = generateTemplateHtml(renderData);

        // Extract any icon URLs from the rendered HTML img tags
        const urlMatches = html.match(/https?:\/\/[^\s"'<>]+?\/api\/icons\/[^\s"'<>]+/g);
        if (urlMatches) {
          for (const u of urlMatches) {
            collectedUrls.add(u);
          }
        }

        // Also explicitly ensure every network URL for this combination is tested
        for (const network of SOCIAL_NETWORKS) {
          collectedUrls.add(emailIconUrl(style, color, network));
        }
      }
    }
  }

  console.log(`Collected ${collectedUrls.size} unique icon URLs to test.`);
  console.log(`\nDispatching verification requests...`);

  const results: TestResult[] = [];
  let failures = 0;

  for (const rawUrl of collectedUrls) {
    const parsed = new URL(rawUrl);
    const targetUrl = new URL(parsed.pathname, targetBaseUrl).toString();

    const match = parsed.pathname.match(/^\/api\/icons\/([^/]+)\/([^/]+)\/([^/]+)$/);
    const style = match ? match[1] : "filled";
    const color = match ? match[2] : "245fd4";
    const network = match ? match[3] : "website";

    try {
      const { status, contentType, sourceHeader, buffer } = await executeIconRequest(
        targetUrl,
        style,
        color,
        network
      );

      const is200 = status === 200;
      const isPng = Boolean(contentType && contentType.includes("image/png"));
      const hasBytes = buffer.byteLength > 0;

      // Check PNG magic header bytes: 0x89, 0x50, 0x4E, 0x47
      const bytes = new Uint8Array(buffer);
      const isPngMagic =
        bytes.length >= 8 &&
        bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4e &&
        bytes[3] === 0x47;

      const passed = is200 && isPng && hasBytes && isPngMagic;

      if (!passed) {
        failures++;
      }

      results.push({
        url: targetUrl,
        status,
        contentType,
        sourceHeader,
        size: buffer.byteLength,
        passed,
        error: !is200
          ? `HTTP ${status}`
          : !isPng
          ? `Invalid content-type: ${contentType}`
          : !hasBytes
          ? "Empty response body"
          : !isPngMagic
          ? "Invalid PNG header"
          : undefined,
      });
    } catch (err) {
      failures++;
      results.push({
        url: targetUrl,
        status: 0,
        contentType: null,
        size: 0,
        passed: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // 2. Specific Assertions for X-Icon-Source header:
  console.log(`\n=== Asserting X-Icon-Source Header Behavior ===`);

  // 2a. Palette color assertion (e.g. 245fd4)
  const paletteColor = ICON_PALETTE[0] || "245fd4";
  const paletteTestUrl = new URL(`/api/icons/filled/${paletteColor}/linkedin.png`, targetBaseUrl).toString();
  const paletteOutput = await executeIconRequest(paletteTestUrl, "filled", paletteColor, "linkedin");

  console.log(`Palette color (${paletteColor}) status: ${paletteOutput.status}`);
  console.log(`Palette color (${paletteColor}) X-Icon-Source: ${paletteOutput.sourceHeader}`);

  if (paletteOutput.sourceHeader === "s3") {
    console.log(`[PASS] X-Icon-Source header for palette color (${paletteColor}) is 's3'.`);
  } else if (paletteOutput.sourceHeader === "generated") {
    console.warn(
      `[WARN] S3 bucket has no files or NEXT_PUBLIC_ASSET_BASE_URL is not configured yet; palette color (${paletteColor}) served dynamically with X-Icon-Source: 'generated'.`
    );
  } else {
    console.error(
      `[FAIL] Unexpected X-Icon-Source for palette color: '${paletteOutput.sourceHeader}'`
    );
    failures++;
  }

  // 2b. Random non-palette hex assertion (e.g. a855f7)
  const nonPaletteHex = "a855f7";
  if (isPaletteColor(nonPaletteHex)) {
    throw new Error(`Test setup error: ${nonPaletteHex} unexpectedly recognized as a palette color.`);
  }

  const nonPaletteTestUrl = new URL(`/api/icons/filled/${nonPaletteHex}/linkedin.png`, targetBaseUrl).toString();
  const nonPaletteOutput = await executeIconRequest(nonPaletteTestUrl, "filled", nonPaletteHex, "linkedin");

  console.log(`Non-palette color (${nonPaletteHex}) status: ${nonPaletteOutput.status}`);
  console.log(`Non-palette color (${nonPaletteHex}) X-Icon-Source: ${nonPaletteOutput.sourceHeader}`);

  if (nonPaletteOutput.sourceHeader === "generated") {
    console.log(`[PASS] X-Icon-Source header for non-palette color (${nonPaletteHex}) is correctly 'generated'.`);
  } else {
    console.error(
      `[FAIL] Expected X-Icon-Source 'generated' for non-palette color (${nonPaletteHex}), but received: '${nonPaletteOutput.sourceHeader}'`
    );
    failures++;
  }

  // Close active server if spawned
  if (activeServer) {
    await new Promise<void>((resolve) => (activeServer as http.Server).close(() => resolve()));
  }

  // Print summary
  const passedCount = results.filter((r) => r.passed).length;
  console.log(`\n=== Verification Results ===`);
  console.log(`Total checked: ${results.length}`);
  console.log(`Passed:        ${passedCount}`);
  console.log(`Failed:        ${failures}`);

  if (failures > 0) {
    console.error("\nFAILURES DETECTED:");
    for (const res of results.filter((r) => !r.passed)) {
      console.error(`- ${res.url} -> Error: ${res.error}`);
    }
    process.exit(1);
  }

  console.log("\nALL ICONS AND HEADERS PASSED!");
}

main().catch((err: unknown) => {
  console.error("Fatal error running icon check:", err);
  process.exit(1);
});
