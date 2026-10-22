import sharp from "sharp";
import { buildIconSvg, type IconStyle } from "@/lib/email-core/iconSvg";
import { type SocialNetwork } from "@/lib/email-core/iconGlyphs";

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

export async function GET(
  _request: Request,
  context: RouteContext
): Promise<Response> {
  const { style, color, network } = await context.params;

  // 1. Validate Style
  if (!VALID_STYLES.has(style as IconStyle)) {
    return new Response("Invalid style. Must be filled, outline, minimal, or circle.", {
      status: 400,
    });
  }

  // 2. Validate Color (3 or 6 hex digits without #)
  if (!HEX_COLOR_REGEX.test(color)) {
    return new Response("Invalid color. Must be a 3 or 6 digit hex string without #.", {
      status: 400,
    });
  }

  // Expand 3-digit hex to 6-digit hex
  const fullHexColor =
    color.length === 3
      ? color
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : color;

  // 3. Validate Network (strip optional .png suffix)
  const cleanNetwork = network.endsWith(".png") ? network.slice(0, -4) : network;
  if (!VALID_NETWORKS.has(cleanNetwork as SocialNetwork)) {
    return new Response(
      "Invalid network. Must be linkedin, twitter, facebook, instagram, github, youtube, or website.",
      { status: 400 }
    );
  }

  try {
    const svg = buildIconSvg(
      style as IconStyle,
      fullHexColor,
      cleanNetwork as SocialNetwork
    );

    const pngBuffer = await sharp(Buffer.from(svg))
      .resize(80, 80)
      .png({ compressionLevel: 9 })
      .toBuffer();

    return new Response(new Uint8Array(pngBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate icon";
    return new Response(message, { status: 500 });
  }
}
