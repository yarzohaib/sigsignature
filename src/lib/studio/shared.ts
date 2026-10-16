import { StudioSignatureData, StudioShape } from "@/types/studio";
import {
  escapeHtml,
  safeUrl,
  normalizeWebsite,
  emailIconUrl,
  getSocialIconSvgDataUrl,
  SocialNetwork,
} from "@/lib/email-core";

export const THEME_PRESETS = {
  corporate: {
    bg: "#FFFFFF",
    text: "#1E293B",
    muted: "#64748B",
    border: "#E2E8F0",
  },
  minimal: {
    bg: "#FFFFFF",
    text: "#111827",
    muted: "#6B7280",
    border: "transparent",
  },
  modern: {
    bg: "#F5F3FF",
    text: "#1E1B4B",
    muted: "#6D6A8A",
    border: "#DDD6FE",
  },
  dark: {
    bg: "#0F172A",
    text: "#F8FAFC",
    muted: "#94A3B8",
    border: "#334155",
  },
} as const;

export type ThemePresetName = keyof typeof THEME_PRESETS;

export function getShapeBorderRadius(
  shape: StudioShape = "rounded",
  type: "card" | "button" | "image" = "button"
): string {
  if (shape === "square") return "0px";
  if (shape === "pill") return "999px";
  if (type === "card") return "12px";
  if (type === "image") return "4px";
  return "6px";
}

export function renderSocialLinksHtml(
  data: StudioSignatureData,
  themeColor: string,
  fontStack: string,
  isPreview = false
): string {
  const networks: { key: keyof StudioSignatureData["socials"]; label: string; network: SocialNetwork }[] = [
    { key: "linkedin", label: "LinkedIn", network: "linkedin" },
    { key: "twitter", label: "Twitter", network: "twitter" },
    { key: "facebook", label: "Facebook", network: "facebook" },
    { key: "instagram", label: "Instagram", network: "instagram" },
  ];

  const style = data.socialIconsStyle || "filled";

  const items = networks
    .map(({ key, label, network }) => {
      const url = data.socials?.[key]?.trim();
      if (!url) return null;
      const href = safeUrl(normalizeWebsite(url));
      if (!href) return null;

      const iconUrl = isPreview
        ? getSocialIconSvgDataUrl(style, themeColor, network)
        : emailIconUrl(style, themeColor, network) || getSocialIconSvgDataUrl(style, themeColor, network);

      if (iconUrl) {
        return `<a href="${href}" target="_blank" style="display:inline-block;text-decoration:none;margin-right:6px;"><img src="${escapeHtml(
          iconUrl
        )}" alt="${label}" width="20" height="20" style="display:block;border:0;outline:none;text-decoration:none;" /></a>`;
      }

      return `<a href="${href}" target="_blank" style="display:inline-block;font-family:${fontStack};font-size:11px;color:${themeColor};text-decoration:underline;margin-right:6px;">${label}</a>`;
    })
    .filter(Boolean);

  if (items.length === 0) return "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;display:inline-table;">
    <tr>
      <td style="padding:0;vertical-align:middle;">
        ${items.join("")}
      </td>
    </tr>
  </table>`;
}
