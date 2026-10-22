import { ICON_GLYPHS, type SocialNetwork } from "./iconGlyphs";

export type IconStyle = "filled" | "outline" | "circle" | "minimal";

/**
 * Normalizes any valid 3 or 6 digit hex color (with or without #) into standard #RRGGBB uppercase.
 */
function normalizeHex(color: string): string {
  const trimmed = color.trim().replace(/^#/, "");
  if (trimmed.length === 3) {
    const [r, g, b] = trimmed.split("");
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return `#${trimmed}`.toUpperCase();
}

/**
 * Builds email-safe 40x40 SVG markup for a social icon with pixel-perfect geometry.
 *
 * Supported styles:
 * - filled: Solid rounded rectangle with white glyph (dark glyph with subtle border for #FFFFFF)
 * - circle: Solid circle in the color with white glyph (dark glyph with subtle border for #FFFFFF)
 * - outline: Rounded rectangle outline in color with matching glyph (dark for #FFFFFF)
 * - minimal: Icon glyph only on transparent background in color (dark for #FFFFFF)
 */
export function buildIconSvg(
  style: IconStyle,
  color: string,
  network: SocialNetwork
): string {
  const glyph = ICON_GLYPHS[network];
  if (!glyph) {
    throw new Error(`Unsupported network: ${network}`);
  }

  const hex = normalizeHex(color);
  const isWhite = hex === "#FFFFFF";

  let glyphColor = "#FFFFFF";
  let backgroundShape = "";

  if (style === "filled") {
    if (isWhite) {
      backgroundShape = `<rect x="0.5" y="0.5" width="39" height="39" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />`;
      glyphColor = "#0F172A";
    } else {
      backgroundShape = `<rect x="0" y="0" width="40" height="40" rx="8" fill="${hex}" />`;
      glyphColor = "#FFFFFF";
    }
  } else if (style === "circle") {
    if (isWhite) {
      backgroundShape = `<circle cx="20" cy="20" r="19.5" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />`;
      glyphColor = "#0F172A";
    } else {
      backgroundShape = `<circle cx="20" cy="20" r="20" fill="${hex}" />`;
      glyphColor = "#FFFFFF";
    }
  } else if (style === "outline") {
    const strokeColor = isWhite ? "#0F172A" : hex;
    glyphColor = isWhite ? "#0F172A" : hex;
    backgroundShape = `<rect x="1.5" y="1.5" width="37" height="37" rx="6.5" stroke="${strokeColor}" stroke-width="3" fill="none" />`;
  } else if (style === "minimal") {
    backgroundShape = "";
    glyphColor = isWhite ? "#0F172A" : hex;
  } else {
    throw new Error(`Unsupported icon style: ${style}`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
  ${backgroundShape}
  <svg x="9" y="9" width="22" height="22" viewBox="0 0 24 24">
    <path fill="${glyphColor}" d="${glyph}" />
  </svg>
</svg>`;
}
