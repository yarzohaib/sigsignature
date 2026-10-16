import {
  StudioSignatureData,
  SignatureExtraItem,
  ExtraDividerItem,
} from "@/types/studio";
import { STUDIO_SOLID_COLORS } from "@/lib/studio/constants";
import { SIGNATURE_COLOR_SWATCHES } from "@/lib/signatureConstants";
import {
  escapeHtml,
  safeUrl,
  normalizeWebsite,
  telHref,
  resolveEmailFont,
  emailIconUrl,
  getSocialIconSvgDataUrl,
  SocialNetwork,
} from "@/lib/email-core";

/**
 * Theme presets for Design Studio signatures.
 * Outlook ignores gradients, so solid backgrounds with bgcolor attribute are used.
 */
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

/**
 * Renders social icon links using SVG data URIs or pre-generated PNG icons.
 */
function renderSocialLinks(
  data: StudioSignatureData,
  themeColor: string,
  fontStack: string,
  isPreview = false
): string {
  const networks: {
    key: keyof StudioSignatureData["socials"];
    label: string;
    network: SocialNetwork;
    defaultUrl: string;
  }[] = [
    { key: "linkedin", label: "LinkedIn", network: "linkedin", defaultUrl: "https://www.linkedin.com" },
    { key: "twitter", label: "Twitter", network: "twitter", defaultUrl: "https://twitter.com" },
    { key: "facebook", label: "Facebook", network: "facebook", defaultUrl: "https://www.facebook.com" },
    { key: "instagram", label: "Instagram", network: "instagram", defaultUrl: "https://www.instagram.com" },
  ];

  const style = data.socialIconsStyle || "filled";

  const activeNetworks = networks.filter((n) => Boolean(data.socials?.[n.key]?.trim()));
  const targetNetworks = activeNetworks.length > 0 ? activeNetworks : networks;

  const cells: string[] = [];

  for (let i = 0; i < targetNetworks.length; i++) {
    const { key, label, network, defaultUrl } = targetNetworks[i];
    const userUrl = data.socials?.[key]?.trim();
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

/**
 * Builds contact rows with colored letter labels.
 */
function renderContactRows(
  data: StudioSignatureData,
  themeColor: string,
  fontStack: string,
  mutedColor = "#64748B"
): string {
  const rows: string[] = [];

  if (data.phone?.trim()) {
    const href = safeUrl(telHref(data.phone));
    rows.push(
      `<tr><td style="padding:1px 6px 1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:${themeColor};">T</td><td style="padding:1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;"><a href="${href}" style="color:${mutedColor};text-decoration:none;">${escapeHtml(data.phone.trim())}</a></td></tr>`
    );
  }

  if (data.email?.trim()) {
    const href = safeUrl(`mailto:${data.email.trim()}`);
    rows.push(
      `<tr><td style="padding:1px 6px 1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:${themeColor};">E</td><td style="padding:1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;"><a href="${href}" style="color:${mutedColor};text-decoration:none;">${escapeHtml(data.email.trim())}</a></td></tr>`
    );
  }

  if (data.website?.trim()) {
    const href = safeUrl(normalizeWebsite(data.website));
    rows.push(
      `<tr><td style="padding:1px 6px 1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:${themeColor};">W</td><td style="padding:1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;"><a href="${href}" target="_blank" style="color:${mutedColor};text-decoration:none;">${escapeHtml(data.website.trim())}</a></td></tr>`
    );
  }

  if (data.optional?.address?.trim()) {
    rows.push(
      `<tr><td style="padding:1px 6px 1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:${themeColor};">A</td><td style="padding:1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;color:${mutedColor};">${escapeHtml(data.optional.address.trim())}</td></tr>`
    );
  }

  if (rows.length === 0) return "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${rows.join("")}</table>`;
}

/**
 * Builds the compact horizontal contact row.
 */
function renderCompactContactItems(
  data: StudioSignatureData,
  themeColor: string,
  fontStack: string,
  mutedColor = "#64748B"
): string {
  const items: string[] = [];

  if (data.phone?.trim()) {
    const href = safeUrl(telHref(data.phone));
    items.push(
      `<span style="margin-right:12px;display:inline-block;"><strong style="color:${themeColor};font-family:${fontStack};font-size:10px;">T</strong>&nbsp;<a href="${href}" style="color:${mutedColor};text-decoration:none;font-family:${fontStack};font-size:10px;">${escapeHtml(data.phone.trim())}</a></span>`
    );
  }

  if (data.email?.trim()) {
    const href = safeUrl(`mailto:${data.email.trim()}`);
    items.push(
      `<span style="margin-right:12px;display:inline-block;"><strong style="color:${themeColor};font-family:${fontStack};font-size:10px;">E</strong>&nbsp;<a href="${href}" style="color:${mutedColor};text-decoration:none;font-family:${fontStack};font-size:10px;">${escapeHtml(data.email.trim())}</a></span>`
    );
  }

  if (data.website?.trim()) {
    const href = safeUrl(normalizeWebsite(data.website));
    items.push(
      `<span style="margin-right:12px;display:inline-block;"><strong style="color:${themeColor};font-family:${fontStack};font-size:10px;">W</strong>&nbsp;<a href="${href}" target="_blank" style="color:${mutedColor};text-decoration:none;font-family:${fontStack};font-size:10px;">${escapeHtml(data.website.trim())}</a></span>`
    );
  }

  if (data.optional?.address?.trim()) {
    items.push(
      `<span style="display:inline-block;"><strong style="color:${themeColor};font-family:${fontStack};font-size:10px;">A</strong>&nbsp;<span style="color:${mutedColor};font-family:${fontStack};font-size:10px;">${escapeHtml(data.optional.address.trim())}</span></span>`
    );
  }

  return items.join("");
}

/**
 * Renders email-safe table rows for signature extra items (text, image, divider, cta, banner).
 * Supports side-by-side two-column layout (photo left, details right) and closely knitted spacing.
 */
export function renderExtrasHtml(
  extras: SignatureExtraItem[] | undefined,
  themeColor: string,
  fontStack: string,
  theme: { bg: string; text: string; muted: string; border: string },
  shape: string,
  buttonStyle: string,
  layout: string = "two-column"
): string {
  if (!extras || extras.length === 0) return "";

  const isTwoCol = layout === "two-column" || layout === "compact";

  function renderRow(item: SignatureExtraItem, isColumn: boolean): string {
    if (item.type === "text") {
      const fontSize = item.size === "sm" ? 12 : item.size === "lg" ? 16 : 14;
      const lineHeight = item.size === "sm" ? 16 : item.size === "lg" ? 20 : 18;
      const align = item.align || "left";
      const boldStyle = item.bold ? "font-weight:bold;" : "font-weight:normal;";
      const widthVal = item.width ? Math.min(600, Math.max(20, Number(item.width))) : 0;
      const widthStyle =
        widthVal > 0 && widthVal < 600
          ? `width:${widthVal}px;max-width:100%;display:inline-block;`
          : "width:100%;";
      const cellPad = isColumn ? "1px 0" : "3px 0";

      return `<tr>
  <td align="${align}" style="padding:${cellPad};text-align:${align};font-family:${fontStack};font-size:${fontSize}px;line-height:${lineHeight}px;${boldStyle}color:${theme.text};">
    <div style="${widthStyle}text-align:${align};">${escapeHtml(item.text || "")}</div>
  </td>
</tr>`;
    }

    if (item.type === "image") {
      const align = item.align || (isColumn ? "left" : "center");
      const width = Math.min(600, Math.max(20, Number(item.width) || 80));
      const imgSrc = safeUrl(item.url || "");
      if (!imgSrc) return "";
      const linkHref = item.linkUrl?.trim() ? safeUrl(normalizeWebsite(item.linkUrl)) : "";
      const radius = shape === "square" ? "0px" : shape === "pill" ? "999px" : "4px";

      const imgTag = `<img src="${escapeHtml(imgSrc)}" alt="Image" width="${width}" style="display:inline-block;border:0;outline:none;text-decoration:none;border-radius:${radius};max-width:100%;height:auto;" />`;
      const content = linkHref
        ? `<a href="${linkHref}" target="_blank" style="text-decoration:none;display:inline-block;">${imgTag}</a>`
        : imgTag;
      const cellPad = isColumn ? "2px 0" : "4px 0";

      return `<tr>
  <td align="${align}" style="padding:${cellPad};text-align:${align};">
    ${content}
  </td>
</tr>`;
    }

    if (item.type === "divider") {
      const align = item.align || "center";
      const thickness = Math.min(20, Math.max(1, Number(item.thickness) || 1));
      const alignAttr = align;
      const marginStyle =
        align === "left"
          ? "margin-right:auto;margin-left:0;"
          : align === "right"
          ? "margin-left:auto;margin-right:0;"
          : "margin:0 auto;";
      const borderColor =
        theme.border && theme.border !== "transparent"
          ? theme.border
          : theme.muted || "#E2E8F0";

      if (item.orientation === "vertical") {
        const heightVal = item.width ? Math.min(200, Math.max(15, Number(item.width))) : 36;
        return `<tr>
  <td align="${alignAttr}" style="padding:4px 0;text-align:${align};">
    <table role="presentation" align="${alignAttr}" cellpadding="0" cellspacing="0" border="0" style="display:inline-table;border-collapse:collapse;${marginStyle}">
      <tr>
        <td style="border-left:${thickness}px solid ${borderColor};font-size:0;line-height:0;width:${thickness}px;height:${heightVal}px;">&nbsp;</td>
      </tr>
    </table>
  </td>
</tr>`;
      }

      const widthVal = item.width ? Math.min(600, Math.max(20, Number(item.width))) : 600;
      const widthStyle = widthVal >= 600 ? "width:100%;" : `width:${widthVal}px;`;
      return `<tr>
  <td align="${alignAttr}" style="padding:4px 0;text-align:${align};">
    <table role="presentation" align="${alignAttr}" cellpadding="0" cellspacing="0" border="0" style="${widthStyle}max-width:100%;border-collapse:collapse;${marginStyle}">
      <tr>
        <td style="border-top:${thickness}px solid ${borderColor};font-size:0;line-height:0;height:${thickness}px;">&nbsp;</td>
      </tr>
    </table>
  </td>
</tr>`;
    }

    if (item.type === "cta") {
      const align = item.align || (isColumn ? "left" : "center");
      const isSolid = buttonStyle !== "outline";
      const radius = shape === "square" ? "0px" : shape === "pill" ? "999px" : "6px";
      const ctaHref = item.url?.trim() ? safeUrl(normalizeWebsite(item.url)) : "#";
      const label = item.label?.trim() ? escapeHtml(item.label.trim()) : "Book a Call";

      const btnBg = isSolid ? themeColor : "transparent";
      const btnBorder = isSolid
        ? `background-color:${themeColor};`
        : `background-color:transparent;border:2px solid ${themeColor};`;
      const textColor = isSolid ? "#FFFFFF" : themeColor;
      const widthVal = item.width ? Math.min(600, Math.max(40, Number(item.width))) : 0;
      const widthStyle = widthVal > 0 ? `width:${widthVal}px;` : "";
      const cellPad = isColumn ? "4px 0 2px 0" : "6px 0";

      return `<tr>
  <td align="${align}" style="padding:${cellPad};text-align:${align};">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-table;border-collapse:separate;${widthStyle}">
      <tr>
        <td align="center" bgcolor="${btnBg}" style="${btnBorder}border-radius:${radius};padding:6px 16px;${widthStyle}">
          <a href="${ctaHref}" target="_blank" style="display:inline-block;font-family:${fontStack};font-size:12px;font-weight:bold;color:${textColor};text-decoration:none;line-height:1.2;">
            ${label}
          </a>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
    }

    if (item.type === "banner") {
      const bannerSrc = safeUrl(item.imageUrl || "");
      if (!bannerSrc) return "";
      const linkHref = item.linkUrl?.trim() ? safeUrl(normalizeWebsite(item.linkUrl)) : "";

      const bannerTag = `<img src="${escapeHtml(bannerSrc)}" alt="Banner" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;outline:none;text-decoration:none;margin:0 auto;" />`;
      const content = linkHref
        ? `<a href="${linkHref}" target="_blank" style="text-decoration:none;display:block;">${bannerTag}</a>`
        : bannerTag;

      return `<tr>
  <td align="center" style="padding:6px 0;text-align:center;">
    ${content}
  </td>
</tr>`;
    }

    return "";
  }

  // Partition elements into Top Full, Left Column, Right Column, Bottom Full
  const leftItems: SignatureExtraItem[] = [];
  const rightItems: SignatureExtraItem[] = [];
  let verticalDividerItem: ExtraDividerItem | null = null;
  const topFullItems: SignatureExtraItem[] = [];
  const bottomFullItems: SignatureExtraItem[] = [];

  let encounteredColumnItem = false;

  for (const item of extras) {
    if (item.type === "divider" && item.orientation === "vertical") {
      verticalDividerItem = item;
      continue;
    }

    let col = item.column;
    if (!col) {
      if (isTwoCol) {
        if (item.type === "image") col = "left";
        else if (item.type === "banner") col = "full";
        else if (item.type === "divider") col = "full";
        else col = "right";
      } else {
        col = "full";
      }
    }

    if (col === "left") {
      encounteredColumnItem = true;
      leftItems.push(item);
    } else if (col === "right") {
      encounteredColumnItem = true;
      rightItems.push(item);
    } else {
      if (encounteredColumnItem) {
        bottomFullItems.push(item);
      } else {
        topFullItems.push(item);
      }
    }
  }

  const sections: string[] = [];

  // 1. Top full items
  for (const item of topFullItems) {
    const row = renderRow(item, false);
    if (row) sections.push(row);
  }

  // 2. Two-column block (if left or right items exist)
  if (leftItems.length > 0 && rightItems.length > 0) {
    const leftRows = leftItems.map((item) => renderRow(item, true)).filter(Boolean).join("\n");
    const rightRows = rightItems.map((item) => renderRow(item, true)).filter(Boolean).join("\n");

    let vertDividerHtml = "";
    if (verticalDividerItem) {
      const thickness = Math.min(20, Math.max(1, Number(verticalDividerItem.thickness) || 1));
      const heightVal = verticalDividerItem.width
        ? Math.min(200, Math.max(15, Number(verticalDividerItem.width)))
        : 48;
      const borderColor =
        theme.border && theme.border !== "transparent"
          ? theme.border
          : theme.muted || "#E2E8F0";
      vertDividerHtml = `<td valign="top" style="vertical-align:top;padding:0 14px;width:${thickness}px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;height:100%;">
          <tr>
            <td style="border-left:${thickness}px solid ${borderColor};font-size:0;line-height:0;width:${thickness}px;height:${heightVal}px;">&nbsp;</td>
          </tr>
        </table>
      </td>`;
    }

    sections.push(`<tr>
  <td style="padding:2px 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;border-collapse:collapse;">
      <tr>
        <td valign="top" style="vertical-align:top;padding-right:${verticalDividerItem ? "0" : "16px"};width:1%;white-space:nowrap;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
            ${leftRows}
          </table>
        </td>
        ${vertDividerHtml}
        <td valign="top" style="vertical-align:top;width:100%;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
            ${rightRows}
          </table>
        </td>
      </tr>
    </table>
  </td>
</tr>`);
  } else if (leftItems.length > 0) {
    for (const item of leftItems) {
      const row = renderRow(item, false);
      if (row) sections.push(row);
    }
  } else if (rightItems.length > 0) {
    for (const item of rightItems) {
      const row = renderRow(item, false);
      if (row) sections.push(row);
    }
  }

  // 3. Bottom full items
  for (const item of bottomFullItems) {
    const row = renderRow(item, false);
    if (row) sections.push(row);
  }

  if (sections.length === 0) return "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;border-collapse:collapse;margin-top:6px;">
  ${sections.join("\n")}
</table>`;
}

export interface GenerateStudioOptions {
  preview?: boolean;
}

/**
 * Generates an email-safe, table-based HTML string for the Studio signature.
 * Strictly uses nested tables with presentation roles, inline styling, and no CSS variables or SVGs.
 * Output is an HTML fragment without <html>, <head>, <body>, or comments.
 */
export function generateStudioHtml(
  data: StudioSignatureData,
  options?: GenerateStudioOptions
): string {
  const allKnownColors = [
    ...SIGNATURE_COLOR_SWATCHES,
    ...STUDIO_SOLID_COLORS,
  ];

  const isColorValid = allKnownColors.some(
    (s) => s.toLowerCase() === (data.themeColor || "").toLowerCase()
  );
  const themeColor = isColorValid ? data.themeColor : "#245FD4";
  const fontStack = resolveEmailFont(data.fontFamily);

  // Design theme resolution
  const themeKey = (data.design?.theme || "corporate") as ThemePresetName;
  const theme = THEME_PRESETS[themeKey] || THEME_PRESETS.corporate;

  // Shape resolution for avatar
  const shape = data.design?.shape || "rounded";
  const avatarRadius = shape === "square" ? "0" : shape === "pill" ? "50%" : "12px";

  const isPreview = Boolean(options?.preview);

  // Avatar resolution: only show if data.avatarUrl is provided
  // Sample photo and logo placeholders must exist only in the preview renderer (preview: true), never in saved data or in copied output
  let effectiveAvatarUrl = "";
  if (data.avatarUrl && data.avatarUrl.trim()) {
    const trimmed = data.avatarUrl.trim();
    const isSamplePhoto = trimmed === "/daniel-wilson.png" || trimmed.endsWith("/daniel-wilson.png");
    if (!isSamplePhoto || isPreview) {
      if (trimmed.startsWith("https://") || trimmed.startsWith("/")) {
        if (isPreview && trimmed.startsWith("/") && typeof window !== "undefined" && window.location?.origin) {
          effectiveAvatarUrl = `${window.location.origin}${trimmed}`;
        } else {
          effectiveAvatarUrl = trimmed;
        }
      }
    }
  }
  const hasAvatar = Boolean(effectiveAvatarUrl);

  // Company logo resolution: only show if data.companyLogoUrl is provided
  let effectiveLogoUrl = "";
  if (data.companyLogoUrl && data.companyLogoUrl.trim()) {
    const trimmed = data.companyLogoUrl.trim();
    const isSampleLogo = trimmed.includes("sample-logo") || trimmed.includes("placeholder-logo");
    if (!isSampleLogo || isPreview) {
      if (trimmed.startsWith("https://") || trimmed.startsWith("/")) {
        if (isPreview && trimmed.startsWith("/") && typeof window !== "undefined" && window.location?.origin) {
          effectiveLogoUrl = `${window.location.origin}${trimmed}`;
        } else {
          effectiveLogoUrl = trimmed;
        }
      }
    }
  }
  const hasLogo = Boolean(effectiveLogoUrl);

  const socialLinksHtml = renderSocialLinks(data, themeColor, fontStack, isPreview);
  const contactRowsHtml = renderContactRows(data, themeColor, fontStack, theme.muted);

  const layout = data.layout || "two-column";
  let mainHtml = "";

  // Layout 0: Single (Stacked vertically in one column)
  if (layout === "single") {
    const avatarHtml = hasAvatar
      ? `<tr><td style="padding-bottom:12px;vertical-align:top;">
          <img src="${escapeHtml(effectiveAvatarUrl)}" alt="${escapeHtml(data.fullName || "Photo")}" width="72" height="72" style="display:block;border:0;outline:none;text-decoration:none;border-radius:${avatarRadius};" />
        </td></tr>`
      : "";

    const nameTitleHtml = `<tr><td style="padding-bottom:10px;vertical-align:top;">
      <div style="font-family:${fontStack};font-size:16px;font-weight:bold;color:${theme.text};line-height:1.2;">${escapeHtml(data.fullName || "")}</div>
      ${
        data.jobTitle || data.companyName
          ? `<div style="font-family:${fontStack};font-size:12px;font-weight:500;color:${theme.muted};margin-top:2px;line-height:1.3;">
              ${escapeHtml(data.jobTitle || "")}${data.jobTitle && data.companyName ? " &bull; " : ""}${escapeHtml(data.companyName || "")}
            </div>`
          : ""
      }
    </td></tr>`;

    const contactHtml = contactRowsHtml
      ? `<tr><td style="padding-bottom:10px;vertical-align:top;">${contactRowsHtml}</td></tr>`
      : "";

    const socialsHtml = socialLinksHtml
      ? `<tr><td style="padding-bottom:10px;vertical-align:top;">${socialLinksHtml}</td></tr>`
      : "";

    const companyLogoHtml = hasLogo
      ? `<tr><td style="padding-bottom:8px;vertical-align:top;">
          <img src="${escapeHtml(effectiveLogoUrl)}" alt="${escapeHtml(data.companyName || "Logo")}" width="80" height="36" style="display:block;border:0;outline:none;text-decoration:none;max-width:95px;height:auto;" />
        </td></tr>`
      : "";

    const taglineHtml = data.optional?.tagline?.trim()
      ? `<tr><td style="padding-bottom:8px;font-family:${fontStack};font-size:10px;color:${theme.muted};line-height:1.3;">${escapeHtml(data.optional.tagline.trim())}</td></tr>`
      : "";

    const disclaimerHtml = data.optional?.disclaimer?.trim()
      ? `<tr><td style="padding-top:8px;border-top:1px solid ${theme.border};font-family:${fontStack};font-size:9px;color:${theme.muted};line-height:1.3;">${escapeHtml(data.optional.disclaimer.trim())}</td></tr>`
      : "";

    mainHtml = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" bgcolor="${theme.bg}" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:${fontStack};color:${theme.text};background-color:${theme.bg};line-height:1.4;width:100%;max-width:600px;">
  <tr>
    <td style="padding:16px;vertical-align:top;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;">
        ${avatarHtml}
        ${nameTitleHtml}
        ${contactHtml}
        ${socialsHtml}
        ${companyLogoHtml}
        ${taglineHtml}
        ${disclaimerHtml}
      </table>
    </td>
  </tr>
</table>`;
  }

  // Layout 1: Two Column (Figma matching: photo & socials left, details middle, vertical divider, logo & company right)
  if (layout === "two-column") {
    let photoCell = "";
    if (hasAvatar) {
      photoCell = `<td style="vertical-align:top;padding-right:16px;width:76px;text-align:center;">
        <img src="${escapeHtml(effectiveAvatarUrl)}" alt="${escapeHtml(data.fullName || "Photo")}" width="72" height="72" style="display:block;border:0;outline:none;text-decoration:none;border-radius:${avatarRadius};margin:0 auto;" />
        ${socialLinksHtml ? `<div style="margin-top:8px;text-align:center;">${socialLinksHtml}</div>` : ""}
      </td>`;
    }

    const companyLogoHtml = hasLogo
      ? `<img src="${escapeHtml(effectiveLogoUrl)}" alt="${escapeHtml(data.companyName || "Logo")}" width="48" height="38" style="display:block;border:0;outline:none;text-decoration:none;margin:0 auto 8px auto;max-width:95px;height:auto;" />`
      : "";

    const companyTaglineHtml = data.optional?.tagline?.trim()
      ? `<div style="font-family:${fontStack};font-size:9px;color:${theme.muted};margin-top:2px;line-height:1.2;">${escapeHtml(data.optional.tagline.trim())}</div>`
      : "";

    const hasCompany = Boolean(data.companyName?.trim() || hasLogo || data.optional?.tagline?.trim());
    const companyCell = hasCompany
      ? `<td style="vertical-align:middle;padding-left:16px;border-left:1px solid ${theme.border};text-align:center;width:130px;min-width:100px;">
      <div style="display:inline-block;text-align:center;">
        ${companyLogoHtml}
        <div style="font-family:${fontStack};font-size:13px;font-weight:bold;color:${theme.text};line-height:1.2;">${escapeHtml(data.companyName || "")}</div>
        ${companyTaglineHtml}
      </div>
    </td>`
      : "";

    const disclaimerHtml = data.optional?.disclaimer?.trim()
      ? `<tr><td colspan="${hasAvatar ? (hasCompany ? 3 : 2) : (hasCompany ? 2 : 1)}" style="padding-top:10px;border-top:1px solid ${theme.border};font-family:${fontStack};font-size:9px;color:${theme.muted};line-height:1.3;">${escapeHtml(data.optional.disclaimer.trim())}</td></tr>`
      : "";

    mainHtml = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" bgcolor="${theme.bg}" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:${fontStack};color:${theme.text};background-color:${theme.bg};line-height:1.4;width:100%;max-width:600px;">
  <tr>
    <td style="padding:16px;vertical-align:top;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;">
        <tr>
          ${photoCell}
          <td style="vertical-align:top;padding-right:16px;">
            <div style="font-family:${fontStack};font-size:16px;font-weight:bold;color:${theme.text};line-height:1.2;">${escapeHtml(data.fullName || "")}</div>
            <div style="font-family:${fontStack};font-size:12px;font-weight:500;color:${theme.muted};margin-top:2px;margin-bottom:8px;line-height:1.3;">${escapeHtml(data.jobTitle || "")}</div>
            ${contactRowsHtml}
            ${!hasAvatar && socialLinksHtml ? `<div style="margin-top:8px;">${socialLinksHtml}</div>` : ""}
          </td>
          ${companyCell}
        </tr>
        ${disclaimerHtml}
      </table>
    </td>
  </tr>
</table>`;
  }

  // Layout 2: Compact
  if (!mainHtml) {
    const compactItems = renderCompactContactItems(data, themeColor, fontStack, theme.muted);

    const disclaimerHtml = data.optional?.disclaimer?.trim()
      ? `<tr><td style="padding-top:6px;border-top:1px solid ${theme.border};font-family:${fontStack};font-size:9px;color:${theme.muted};line-height:1.3;">${escapeHtml(data.optional.disclaimer.trim())}</td></tr>`
      : "";

    mainHtml = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" bgcolor="${theme.bg}" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:${fontStack};color:${theme.text};background-color:${theme.bg};line-height:1.4;width:100%;max-width:600px;">
  <tr>
    <td style="padding:16px;vertical-align:top;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;">
        <tr>
          ${
            hasAvatar
              ? `<td style="vertical-align:middle;padding-right:12px;width:44px;">
                  <img src="${escapeHtml(effectiveAvatarUrl)}" alt="${escapeHtml(data.fullName || "Photo")}" width="44" height="44" style="display:block;border:0;outline:none;text-decoration:none;border-radius:${avatarRadius};" />
                </td>`
              : ""
          }
          <td style="vertical-align:middle;">
            <div style="font-family:${fontStack};font-size:14px;font-weight:bold;color:${theme.text};line-height:1.2;">${escapeHtml(data.fullName || "")}</div>
            <div style="font-family:${fontStack};font-size:11px;color:${theme.muted};line-height:1.3;margin-top:1px;">
              ${escapeHtml(data.jobTitle || "")}${data.jobTitle && data.companyName ? " &bull; " : ""}${escapeHtml(data.companyName || "")}
            </div>
          </td>
          ${socialLinksHtml ? `<td style="vertical-align:middle;text-align:right;">${socialLinksHtml}</td>` : ""}
        </tr>
      </table>
    </td>
  </tr>
  ${
    compactItems
      ? `<tr>
    <td style="padding:0 12px 6px 12px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:${theme.border === "transparent" ? "#F8FAFC" : theme.bg};border-radius:6px;">
        <tr>
          <td style="padding:4px 8px;font-family:${fontStack};font-size:10px;color:${theme.muted};">
            ${compactItems}
          </td>
        </tr>
      </table>
    </td>
  </tr>`
      : ""
  }
  ${disclaimerHtml ? `<tr><td style="padding:0 12px 12px 12px;">${disclaimerHtml}</td></tr>` : ""}
</table>`;
  }

  // Check if main profile has any user content
  const hasMainContent = Boolean(
    data.fullName?.trim() ||
    data.jobTitle?.trim() ||
    data.companyName?.trim() ||
    data.email?.trim() ||
    data.phone?.trim() ||
    data.website?.trim() ||
    hasAvatar ||
    hasLogo ||
    socialLinksHtml ||
    data.optional?.address?.trim() ||
    data.optional?.tagline?.trim() ||
    data.optional?.disclaimer?.trim()
  );

  // Render Extras Below Main Signature (if any)
  const buttonStyle = data.design?.buttonStyle || "solid";
  const extrasHtml = renderExtrasHtml(
    data.extras,
    themeColor,
    fontStack,
    theme,
    shape,
    buttonStyle,
    layout
  );

  if (!hasMainContent) {
    return extrasHtml || "";
  }

  if (!extrasHtml) {
    return mainHtml;
  }

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:100%;max-width:600px;">
  <tr>
    <td style="padding:0;vertical-align:top;">
      ${mainHtml}
    </td>
  </tr>
  <tr>
    <td style="padding:0;vertical-align:top;">
      ${extrasHtml}
    </td>
  </tr>
</table>`;
}

/**
 * Returns a simple plain-text version of the studio signature data:
 * name, job title, company, phone, email, website, address, tagline, disclaimer (one per line, skipping empty values),
 * followed by any extras.
 */
export function generateStudioPlainText(data: StudioSignatureData): string {
  const lines: string[] = [];

  if (data.fullName?.trim()) {
    lines.push(data.fullName.trim());
  }
  if (data.jobTitle?.trim()) {
    lines.push(data.jobTitle.trim());
  }
  if (data.companyName?.trim()) {
    lines.push(data.companyName.trim());
  }
  if (data.phone?.trim()) {
    lines.push(data.phone.trim());
  }
  if (data.email?.trim()) {
    lines.push(data.email.trim());
  }
  if (data.website?.trim()) {
    lines.push(data.website.trim());
  }
  if (data.optional?.address?.trim()) {
    lines.push(data.optional.address.trim());
  }
  if (data.optional?.tagline?.trim()) {
    lines.push(data.optional.tagline.trim());
  }
  if (data.optional?.disclaimer?.trim()) {
    lines.push(data.optional.disclaimer.trim());
  }

  if (data.extras && data.extras.length > 0) {
    for (const extra of data.extras) {
      if (extra.type === "text" && extra.text?.trim()) {
        lines.push(extra.text.trim());
      } else if (extra.type === "cta" && extra.label?.trim()) {
        lines.push(`${extra.label.trim()}: ${extra.url?.trim() || ""}`);
      } else if (extra.type === "image" && extra.linkUrl?.trim()) {
        lines.push(extra.linkUrl.trim());
      } else if (extra.type === "banner" && extra.linkUrl?.trim()) {
        lines.push(extra.linkUrl.trim());
      } else if (extra.type === "divider") {
        lines.push("---");
      }
    }
  }

  return lines.join("\n");
}
