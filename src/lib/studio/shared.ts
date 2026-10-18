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
  const networks: {
    key: string;
    label: string;
    network: SocialNetwork;
    defaultUrl: string;
  }[] = [
    { key: "linkedin", label: "LinkedIn", network: "linkedin", defaultUrl: "https://www.linkedin.com" },
    { key: "twitter", label: "X", network: "twitter", defaultUrl: "https://twitter.com" },
    { key: "facebook", label: "Facebook", network: "facebook", defaultUrl: "https://www.facebook.com" },
    { key: "instagram", label: "Instagram", network: "instagram", defaultUrl: "https://www.instagram.com" },
    { key: "github", label: "GitHub", network: "github", defaultUrl: "https://github.com" },
    { key: "youtube", label: "YouTube", network: "youtube", defaultUrl: "https://youtube.com" },
    { key: "website", label: "Website", network: "website", defaultUrl: "https://website.com" },
  ];

  const style = data.socialIconsStyle || "filled";

  // Check which networks have URLs configured
  const activeNetworks = networks.filter((n) =>
    Boolean((data.socials as Record<string, string | undefined>)?.[n.key]?.trim())
  );
  // If user placed a social element on canvas but hasn't entered custom URLs yet,
  // show the 4 standard platforms (matching what FreeElementView displays on canvas)
  const targetNetworks = activeNetworks.length > 0 ? activeNetworks : networks.slice(0, 4);

  const cells: string[] = [];

  for (let i = 0; i < targetNetworks.length; i++) {
    const { key, label, network, defaultUrl } = targetNetworks[i];
    const userUrl = (data.socials as Record<string, string | undefined>)?.[key]?.trim();
    const rawUrl = userUrl || (activeNetworks.length === 0 ? defaultUrl : "");
    if (!rawUrl) continue;
    const href = safeUrl(normalizeWebsite(rawUrl));
    if (!href) continue;

    const isLast = i === targetNetworks.length - 1;
    const paddingRight = isLast ? 0 : 6;

    const iconUrl = isPreview
      ? getSocialIconSvgDataUrl(style, themeColor, network)
      : emailIconUrl(style, themeColor, network);

    if (iconUrl) {
      cells.push(`<td style="padding:0 ${paddingRight}px 0 0;vertical-align:middle;line-height:0;font-size:0;mso-line-height-rule:exactly;">
        <a href="${href}" target="_blank" style="display:inline-block;text-decoration:none;line-height:0;font-size:0;">
          <img src="${escapeHtml(
            iconUrl
          )}" alt="${label}" width="20" height="20" style="display:block;border:0;outline:none;text-decoration:none;width:20px;height:20px;" />
        </a>
      </td>`);
    } else {
      cells.push(`<td style="padding:0 ${paddingRight}px 0 0;vertical-align:middle;">
        <a href="${href}" target="_blank" style="display:inline-block;font-family:${fontStack};font-size:11px;color:${themeColor};text-decoration:underline;">${label}</a>
      </td>`);
    }
  }

  if (cells.length === 0) return "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border-spacing:0;margin:0;padding:0;">
    <tr>
      ${cells.join("\n      ")}
    </tr>
  </table>`;
}
