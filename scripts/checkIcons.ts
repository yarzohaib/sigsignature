import http from "node:http";
import type { AddressInfo } from "node:net";
import { AVAILABLE_TEMPLATES } from "../src/lib/templatesData";
import {
  SIGNATURE_COLOR_SWATCHES,
  ICON_STYLES,
  SOCIAL_NETWORKS,
  type SocialNetwork,
  type IconStyle,
} from "../src/lib/signatureConstants";
import { generateTemplateHtml } from "../src/lib/templates/renderTemplateHtml";
import { emailIconUrl } from "../src/lib/email-core";
import { GET as iconRouteHandler } from "../src/app/api/icons/[style]/[color]/[network]/route";

import type { TemplateSignatureData } from "../src/types/template";

const RANDOM_HEX = "#A855F7"; // Random hex color for testing

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
  passed: boolean;
  error?: string;
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

async function main(): Promise<void> {
  console.log("=== SigSignature Social Icons Verification ===");

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

    try {
      let status: number;
      let contentType: string | null;
      let buffer: ArrayBuffer;

      try {
        const response = await fetch(targetUrl);
        status = response.status;
        contentType = response.headers.get("content-type");
        buffer = await response.arrayBuffer();
      } catch (fetchErr: unknown) {
        const isEperm =
          fetchErr instanceof Error &&
          ((fetchErr as { code?: string }).code === "EPERM" ||
            (fetchErr as { cause?: { code?: string } }).cause?.code === "EPERM");

        if (isEperm) {
          // Sandboxed environment restricts local loopback sockets; route directly to Next.js route handler
          const match = parsed.pathname.match(/^\/api\/icons\/([^/]+)\/([^/]+)\/([^/]+)$/);
          if (!match) throw fetchErr;
          const [, style, color, network] = match;
          const req = new Request(targetUrl);
          const response = await iconRouteHandler(req, {
            params: Promise.resolve({ style, color, network }),
          });
          status = response.status;
          contentType = response.headers.get("content-type");
          buffer = await response.arrayBuffer();
        } else {
          throw fetchErr;
        }
      }

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

  console.log("\nALL ICONS PASSED! Every URL returned HTTP 200 with image/png and valid PNG bytes.");
}

main().catch((err) => {
  console.error("Fatal error running icon check:", err);
  process.exit(1);
});
