import { AVAILABLE_TEMPLATES } from "../templatesData";
import { STUDIO_SOLID_COLORS } from "../studio/constants";
import { SIGNATURE_COLOR_SWATCHES } from "../signatureConstants";

/**
 * Normalizes any hex string (e.g. "#FFF", "#245fd4", "245FD4") into a 6-digit lowercase hex without '#'.
 * Returns empty string if the input is not a valid 3- or 6-character hex.
 */
function normalizeHex(hex: string): string {
  if (!hex) return "";
  let clean = hex.trim().replace(/^#/, "").toLowerCase();
  if (clean.length === 3 && /^[0-9a-f]{3}$/.test(clean)) {
    clean = clean
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  return /^[0-9a-f]{6}$/.test(clean) ? clean : "";
}

/**
 * Raw color sources specified:
 * 1. Default and accent colors from AVAILABLE_TEMPLATES (themeColor for each template)
 * 2. Settings brand colors (default #245FD4)
 * 3. Studio color swatches (STUDIO_SOLID_COLORS)
 * 4. Editor color swatches (SIGNATURE_COLOR_SWATCHES)
 * 5. Explicit additions: ffffff and 245fd4
 */
const RAW_PALETTE_SOURCES: readonly string[] = [
  ...AVAILABLE_TEMPLATES.map((t) => t.defaultData.themeColor),
  "#245FD4", // Settings default brand color
  ...STUDIO_SOLID_COLORS,
  ...SIGNATURE_COLOR_SWATCHES,
  "ffffff",
  "245fd4",
];

/**
 * Deduplicated, readonly array of 6-digit lowercase hex strings with no #.
 */
export const ICON_PALETTE: readonly string[] = Object.freeze(
  Array.from(
    new Set(
      RAW_PALETTE_SOURCES.map((c) => normalizeHex(c)).filter(
        (c): c is string => c.length === 6
      )
    )
  )
);

const PALETTE_SET = new Set<string>(ICON_PALETTE);

/**
 * Validates if the given hex color belongs to ICON_PALETTE.
 * Accepts 3- or 6-digit hex strings with or without leading '#'.
 */
export function isPaletteColor(hex: string): boolean {
  if (!hex) return false;
  const clean = normalizeHex(hex);
  return PALETTE_SET.has(clean);
}

/**
 * Converts a 6-digit hex string into RGB numeric components.
 */
function hexToRgb(clean: string): [number, number, number] | null {
  if (!/^[0-9a-f]{6}$/.test(clean)) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return [r, g, b];
}

/**
 * Finds the nearest color in ICON_PALETTE to the given hex color using squared RGB Euclidean distance:
 * dist^2 = (R1 - R2)^2 + (G1 - G2)^2 + (B1 - B2)^2
 *
 * Returns a 6-digit lowercase hex string without '#'.
 */
export function nearestPaletteColor(hex: string): string {
  const clean = normalizeHex(hex);

  // If already in palette, return immediately
  if (clean && PALETTE_SET.has(clean)) {
    return clean;
  }

  const targetRgb = clean ? hexToRgb(clean) : null;
  if (!targetRgb) {
    // Fallback default if invalid hex
    return "245fd4";
  }

  const [tr, tg, tb] = targetRgb;
  let minDistance = Infinity;
  let closestColor = ICON_PALETTE[0] || "245fd4";

  for (const pColor of ICON_PALETTE) {
    const pRgb = hexToRgb(pColor);
    if (!pRgb) continue;
    const [pr, pg, pb] = pRgb;
    const dist = (tr - pr) ** 2 + (tg - pg) ** 2 + (tb - pb) ** 2;
    if (dist < minDistance) {
      minDistance = dist;
      closestColor = pColor;
    }
  }

  return closestColor;
}
