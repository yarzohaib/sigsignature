import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import * as simpleIcons from "simple-icons";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 8 solid colors from Design Studio & signatureConstants.ts
const COLORS = [
  "#245FD4",
  "#64748B",
  "#FFFFFF",
  "#F59E0B",
  "#22A869",
  "#8B5CF6",
  "#EC4899",
  "#449AFA",
];

// 3 styles for Design Studio icons
const STYLES = ["filled", "outline", "minimal"];

// 4 social networks
const SOCIAL_NETWORKS = ["linkedin", "twitter", "facebook", "instagram"];

// Official LinkedIn glyph path fallback (simple-icons v13 brand SVG path without outer frame)
const LINKEDIN_GLYPH_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z";

// Map networks to their Simple Icons glyph paths
const NETWORK_GLYPHS = {
  linkedin: simpleIcons.siLinkedin?.path || LINKEDIN_GLYPH_PATH,
  twitter: simpleIcons.siX.path,
  facebook: simpleIcons.siFacebook.path,
  instagram: simpleIcons.siInstagram.path,
};

function generateSvg(style, color, network) {
  const glyph = NETWORK_GLYPHS[network];
  const isWhite = color.toUpperCase() === "#FFFFFF";

  let glyphColor = "#FFFFFF";
  let backgroundShape = "";

  if (style === "filled") {
    if (isWhite) {
      // White square with dark glyph and thin gray border
      backgroundShape = `<rect x="0.5" y="0.5" width="39" height="39" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />`;
      glyphColor = "#0F172A";
    } else {
      backgroundShape = `<rect x="0" y="0" width="40" height="40" rx="8" fill="${color}" />`;
      glyphColor = "#FFFFFF";
    }
  } else if (style === "outline") {
    const strokeColor = isWhite ? "#0F172A" : color;
    glyphColor = isWhite ? "#0F172A" : color;
    backgroundShape = `<rect x="1.5" y="1.5" width="37" height="37" rx="6.5" stroke="${strokeColor}" stroke-width="3" fill="none" />`;
  } else if (style === "minimal") {
    // Minimal: icon glyph only, transparent background
    backgroundShape = "";
    glyphColor = isWhite ? "#0F172A" : color;
  }

  // 55% of 40 is 22px; centered at (40 - 22) / 2 = 9px offset
  return `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
  ${backgroundShape}
  <svg x="9" y="9" width="22" height="22" viewBox="0 0 24 24">
    <path fill="${glyphColor}" d="${glyph}" />
  </svg>
</svg>`;
}

async function main() {
  const outputDir = path.resolve(__dirname, "../generated-email-icons");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let generatedCount = 0;

  for (const style of STYLES) {
    for (const color of COLORS) {
      const hex = color.replace(/^#/, "").toLowerCase();
      for (const network of SOCIAL_NETWORKS) {
        const fileName = `${style}-${hex}-${network}.png`;
        const filePath = path.join(outputDir, fileName);
        const svg = generateSvg(style, color, network);

        await sharp(Buffer.from(svg))
          .png({ compressionLevel: 9 })
          .toFile(filePath);

        generatedCount++;
      }
    }
  }

  console.log(`Successfully generated ${generatedCount} icons in ${outputDir}`);
}

main().catch((err) => {
  console.error("Error generating icons:", err);
  process.exit(1);
});
