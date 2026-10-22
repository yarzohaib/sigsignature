import sharp from "sharp";
import { buildIconSvg, type IconStyle } from "@/lib/email-core/iconSvg";
import { type SocialNetwork } from "@/lib/email-core/iconGlyphs";
import { isPaletteColor, nearestPaletteColor } from "@/lib/email-core/iconPalette";

export const runtime = "nodejs";

const VALID_STYLES = new Set<IconStyle>(["filled", "outline", "minimal", "circle"]);

const VALID_NETWORKS = new Set<SocialNetwork>([
  "linkedin",
  "twitter",
  "facebook",
  "instagram",
  "github",
  "youtube",
  "website",
]);

const HEX_COLOR_REGEX = /^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/;

type RouteContext = {
  params: Promise<{
    style: string;
    color: string;
    network: string;
  }>;
};

/**
 * Attempts to fetch a pre-rendered static icon from S3 with a 3-second timeout.
 * Returns the fetch Response if status is 200 and content-type is image/png, or null otherwise.
 */
async function fetchFromS3(
  style: string,
  colorHex: string,
  network: string
): Promise<Response | null> {
  const assetBaseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL?.trim();
  if (!assetBaseUrl) {
    return null;
  }

  const cleanBase = assetBaseUrl.replace(/\/$/, "");
  const s3Url = `${cleanBase}/static/${style}-${colorHex}-${network}.png`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(s3Url, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const contentType = res.headers.get("content-type") || "";
    if (res.status === 200 && contentType.includes("image/png")) {
      return res;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Renders the icon dynamically to an 80x80 PNG using sharp.
 */
async function renderWithSharp(
  style: IconStyle,
  colorHex: string,
  network: SocialNetwork
): Promise<ArrayBuffer> {
  const svg = buildIconSvg(style, colorHex, network);
  const pngBuffer = await sharp(Buffer.from(svg))
    .resize(80, 80)
    .png({ compressionLevel: 9 })
    .toBuffer();
  return pngBuffer.buffer.slice(
    pngBuffer.byteOffset,
    pngBuffer.byteOffset + pngBuffer.byteLength
  ) as ArrayBuffer;
}

export async function GET(
  _request: Request,
  context: RouteContext
): Promise<Response> {
  const { style, color, network } = await context.params;

  // 1. Validate Style
  if (!VALID_STYLES.has(style as IconStyle)) {
    return new Response("Invalid style. Must be filled, outline, minimal, or circle.", {
      status: 400,
      headers: { "Cache-Control": "no-store" },
    });
  }

  // 2. Validate Color (3 or 6 hex digits without #)
  if (!HEX_COLOR_REGEX.test(color)) {
    return new Response("Invalid color. Must be a 3 or 6 digit hex string without #.", {
      status: 400,
      headers: { "Cache-Control": "no-store" },
    });
  }

  // Expand 3-digit hex to 6-digit hex and convert to lowercase
  const normalizedColor = (
    color.length === 3
      ? color
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : color
  ).toLowerCase();

  // 3. Validate Network (strip optional .png suffix)
  const cleanNetwork = network.endsWith(".png") ? network.slice(0, -4) : network;
  if (!VALID_NETWORKS.has(cleanNetwork as SocialNetwork)) {
    return new Response(
      "Invalid network. Must be linkedin, twitter, facebook, instagram, github, youtube, or website.",
      {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  try {
    // 2a. If isPaletteColor(color) and NEXT_PUBLIC_ASSET_BASE_URL is set, fetch from S3
    if (isPaletteColor(normalizedColor) && process.env.NEXT_PUBLIC_ASSET_BASE_URL) {
      const s3Res = await fetchFromS3(style, normalizedColor, cleanNetwork);
      if (s3Res) {
        const bodyStream = s3Res.body ?? (await s3Res.arrayBuffer());
        return new Response(bodyStream, {
          status: 200,
          headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=31536000, immutable",
            "X-Icon-Source": "s3",
          },
        });
      }
    }

    // 2b. Otherwise render with sharp as it does now and return with the same headers
    const pngBytes = await renderWithSharp(
      style as IconStyle,
      normalizedColor,
      cleanNetwork as SocialNetwork
    );

    return new Response(pngBytes, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Icon-Source": "generated",
      },
    });
  } catch {
    // 2c. If the sharp render throws, try the S3 file for nearestPaletteColor(color).
    // If that also fails, return 404 with Cache-Control no-store.
    try {
      const fallbackColor = nearestPaletteColor(normalizedColor);
      const fallbackS3Res = await fetchFromS3(style, fallbackColor, cleanNetwork);
      if (fallbackS3Res) {
        const bodyStream =
          fallbackS3Res.body ?? (await fallbackS3Res.arrayBuffer());
        return new Response(bodyStream, {
          status: 200,
          headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=31536000, immutable",
            "X-Icon-Source": "s3",
          },
        });
      }
    } catch {
      // Fall through to 404
    }

    return new Response("Not Found", {
      status: 404,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }
}
