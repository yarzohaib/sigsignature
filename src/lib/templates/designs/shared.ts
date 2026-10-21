import { TemplateSignatureData } from "@/types/template";
import { SIGNATURE_COLOR_SWATCHES } from "@/lib/signatureConstants";
import {
  escapeHtml,
  safeUrl,
  normalizeWebsite,
  telHref,
  resolveEmailFont,
  emailIconUrl,
  SocialNetwork,
} from "@/lib/email-core";

export { escapeHtml, safeUrl, normalizeWebsite, telHref, resolveEmailFont, emailIconUrl };
export type { SocialNetwork };

/**
 * Valid email-safe font family names permitted by backend validation.
 */
export const VALID_TEMPLATE_FONTS = [
  "Arial",
  "Georgia",
  "Verdana",
  "Trebuchet MS",
  "Tahoma",
  "Inter",
  "Roboto",
  "DM Sans",
  "Montserrat",
  "Commissioner",
] as const;

export type ValidTemplateFont = (typeof VALID_TEMPLATE_FONTS)[number];

/**
 * Maps any font name (such as Arimo from Settings) to an allowed template font name.
 * If not recognized, falls back to Arial.
 */
export function mapToValidTemplateFont(name?: string | null): ValidTemplateFont {
  if (!name) return "Arial";
  const trimmed = name.trim();
  const match = VALID_TEMPLATE_FONTS.find(
    (f) => f.toLowerCase() === trimmed.toLowerCase()
  );
  if (match) return match;

  // Specific common aliases
  const lower = trimmed.toLowerCase();
  if (lower === "arimo" || lower === "helvetica") return "Arial";
  if (lower === "trebuchet") return "Trebuchet MS";

  return "Arial";
}

/**
 * Validates hex or signature swatch color, defaulting to brand blue (#245FD4).
 */
export function validateThemeColor(color?: string | null): string {
  if (!color) return "#245FD4";
  const trimmed = color.trim();
  const isValidHex = /^#[0-9A-Fa-f]{3,8}$/.test(trimmed);
  const isSwatch = SIGNATURE_COLOR_SWATCHES.some(
    (s) => s.toLowerCase() === trimmed.toLowerCase()
  );
  return isValidHex || isSwatch ? trimmed : "#245FD4";
}

/**
 * Verifies if an image URL is safe and not an empty or unsafe protocol (e.g. javascript:, data:, vbscript:).
 * Restricts src values to http, https, relative paths, or safe data:image/ URIs.
 */
export function hasSafeImage(url?: string | null): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (trimmed.length === 0) return false;
  if (/^(javascript:|data:|vbscript:)/i.test(trimmed) || /[<>"']/.test(trimmed)) {
    return false;
  }
  if (/^(https?:\/\/|\/|data:image\/(png|jpeg|jpg|gif|webp|svg\+xml)[;,])/i.test(trimmed)) {
    return true;
  }
  return false;
}

/**
 * Standard email-safe font stack resolution for new designs without CSS variables.
 */
export function resolveSafeFontStack(fontFamily?: string | null): string {
  const font = mapToValidTemplateFont(fontFamily);
  switch (font) {
    case "Georgia":
      return "Georgia, Times, 'Times New Roman', serif";
    case "Verdana":
      return "Verdana, Geneva, sans-serif";
    case "Trebuchet MS":
      return "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', sans-serif";
    case "Tahoma":
      return "Tahoma, Geneva, Verdana, sans-serif";
    case "Inter":
      return "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    case "Roboto":
      return "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, Helvetica, sans-serif";
    case "DM Sans":
      return "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif";
    case "Montserrat":
      return "'Montserrat', Arial, Helvetica, sans-serif";
    case "Commissioner":
      return "'Commissioner', Arial, Helvetica, sans-serif";
    case "Arial":
    default:
      return "Arial, Helvetica, sans-serif";
  }
}

/**
 * Builds social icons table cell using the existing helper.
 */
export function renderSocialLinks(
  data: TemplateSignatureData,
  themeColor: string,
  fontStack: string
): string {
  const networks: Array<{
    key: string;
    label: string;
    network: SocialNetwork;
  }> = [
    { key: "linkedin", label: "LinkedIn", network: "linkedin" },
    { key: "twitter", label: "Twitter", network: "twitter" },
    { key: "facebook", label: "Facebook", network: "facebook" },
    { key: "instagram", label: "Instagram", network: "instagram" },
    { key: "github", label: "GitHub", network: "github" },
    { key: "youtube", label: "YouTube", network: "youtube" },
    { key: "website", label: "Website", network: "website" },
  ];

  const items = networks
    .map(({ key, label, network }) => {
      const rawUrl = (data.socials as Record<string, string | undefined>)?.[key];
      if (!rawUrl || !rawUrl.trim()) return "";
      const url = safeUrl(normalizeWebsite(rawUrl));
      if (!url) return "";

      const iconUrl = emailIconUrl(data.socialIconsStyle || "filled", themeColor, network);
      if (iconUrl) {
        return `<a href="${url}" target="_blank" style="text-decoration:none;display:inline-block;margin-right:6px;"><img src="${escapeHtml(iconUrl)}" alt="${escapeHtml(label)}" width="20" height="20" style="display:block;border:0;outline:none;text-decoration:none;" /></a>`;
      }
      return `<a href="${url}" target="_blank" style="font-family:${fontStack};font-size:11px;font-weight:bold;color:${themeColor};text-decoration:none;margin-right:8px;">${escapeHtml(label)}</a>`;
    })
    .filter(Boolean);

  if (items.length === 0) return "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr><td style="padding:0;vertical-align:middle;">${items.join("")}</td></tr></table>`;
}

/**
 * Builds contact rows (phone, email, website, address) with bold theme-colored letter labels (T, E, W, A).
 */
export function renderContactRows(
  data: TemplateSignatureData,
  themeColor: string,
  fontStack: string
): string {
  const rows: string[] = [];

  if (data.phone?.trim()) {
    const href = safeUrl(telHref(data.phone));
    rows.push(
      `<tr><td style="padding:1px 6px 1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:${themeColor};">T</td><td style="padding:1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;"><a href="${href}" style="color:#64748B;text-decoration:none;">${escapeHtml(data.phone.trim())}</a></td></tr>`
    );
  }

  if (data.email?.trim()) {
    const href = safeUrl(`mailto:${data.email.trim()}`);
    rows.push(
      `<tr><td style="padding:1px 6px 1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:${themeColor};">E</td><td style="padding:1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;"><a href="${href}" style="color:#64748B;text-decoration:none;">${escapeHtml(data.email.trim())}</a></td></tr>`
    );
  }

  if (data.website?.trim()) {
    const href = safeUrl(normalizeWebsite(data.website));
    rows.push(
      `<tr><td style="padding:1px 6px 1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:${themeColor};">W</td><td style="padding:1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;"><a href="${href}" target="_blank" style="color:#64748B;text-decoration:none;">${escapeHtml(data.website.trim())}</a></td></tr>`
    );
  }

  if (data.optional?.address?.trim()) {
    rows.push(
      `<tr><td style="padding:1px 6px 1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:${themeColor};">A</td><td style="padding:1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;color:#64748B;">${escapeHtml(data.optional.address.trim())}</td></tr>`
    );
  }

  if (rows.length === 0) return "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${rows.join("")}</table>`;
}

/**
 * Builds the compact horizontal contact row.
 */
export function renderCompactContactItems(
  data: TemplateSignatureData,
  themeColor: string,
  fontStack: string
): string {
  const items: string[] = [];

  if (data.phone?.trim()) {
    const href = safeUrl(telHref(data.phone));
    items.push(
      `<span style="margin-right:12px;display:inline-block;"><strong style="color:${themeColor};font-family:${fontStack};font-size:10px;">T</strong>&nbsp;<a href="${href}" style="color:#64748B;text-decoration:none;font-family:${fontStack};font-size:10px;">${escapeHtml(data.phone.trim())}</a></span>`
    );
  }

  if (data.email?.trim()) {
    const href = safeUrl(`mailto:${data.email.trim()}`);
    items.push(
      `<span style="margin-right:12px;display:inline-block;"><strong style="color:${themeColor};font-family:${fontStack};font-size:10px;">E</strong>&nbsp;<a href="${href}" style="color:#64748B;text-decoration:none;font-family:${fontStack};font-size:10px;">${escapeHtml(data.email.trim())}</a></span>`
    );
  }

  if (data.website?.trim()) {
    const href = safeUrl(normalizeWebsite(data.website));
    items.push(
      `<span style="margin-right:12px;display:inline-block;"><strong style="color:${themeColor};font-family:${fontStack};font-size:10px;">W</strong>&nbsp;<a href="${href}" target="_blank" style="color:#64748B;text-decoration:none;font-family:${fontStack};font-size:10px;">${escapeHtml(data.website.trim())}</a></span>`
    );
  }

  if (data.optional?.address?.trim()) {
    items.push(
      `<span style="display:inline-block;"><strong style="color:${themeColor};font-family:${fontStack};font-size:10px;">A</strong>&nbsp;<span style="color:#64748B;font-family:${fontStack};font-size:10px;">${escapeHtml(data.optional.address.trim())}</span></span>`
    );
  }

  return items.join("");
}

/**
 * Safely parses an Instagram input into a normalized handle and URL.
 */
export function parseInstagramField(raw?: string): { handle: string; url: string } | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let username = "";
  if (trimmed.startsWith("@")) {
    username = trimmed.slice(1).trim();
  } else if (!trimmed.includes("/") && !trimmed.includes(".")) {
    username = trimmed;
  } else {
    const cleaned = trimmed
      .replace(/^https?:\/\//i, "")
      .replace(/^(?:www\.)?instagram\.com\/?/i, "")
      .replace(/\/.*$/, "");
    username = cleaned.replace(/^@/, "").trim();
  }

  if (!username) return null;

  return {
    handle: `@${username}`,
    url: `https://instagram.com/${username}`,
  };
}
