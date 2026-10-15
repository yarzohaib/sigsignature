import {
  TemplateSignatureData,
  SignatureExtraItem,
  ExtraDividerItem,
} from "@/types/template";
import {
  SIGNATURE_COLOR_SWATCHES,
  STUDIO_SOLID_COLORS,
  emailIconUrl,
  SocialNetwork,
} from "@/lib/signatureConstants";

/**
 * Escapes special HTML characters in user text to prevent XSS and malformed markup.
 */
export function escapeHtml(text: string): string {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sanitizes URLs to allow only safe email schemes: http, https, mailto, and tel.
 * Returns an empty string for javascript:, data:, or invalid protocols.
 */
export function safeUrl(value: string): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
    return escapeHtml(trimmed);
  }
  return "";
}

/**
 * Adds https:// protocol to website URLs when missing.
 */
export function normalizeWebsite(value: string): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Sanitizes phone numbers for tel: links, retaining only digits and a single leading +.
 */
export function telHref(phone: string): string {
  if (!phone) return "";
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";
  return `tel:${hasPlus ? "+" : ""}${digits}`;
}

/**
 * Resolves font names to cross-client, email-safe font stacks.
 */
export function resolveEmailFont(name: string): string {
  const clean = (name || "").toLowerCase().trim();
  switch (clean) {
    case "inter":
      return "var(--font-inter), 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    case "roboto":
      return "var(--font-roboto), 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, Helvetica, sans-serif";
    case "georgia":
      return "Georgia, 'Times New Roman', Times, serif";
    case "dm sans":
      return "var(--font-dmsans), 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif";
    case "verdana":
      return "Verdana, Geneva, sans-serif";
    case "trebuchet ms":
    case "trebuchet":
      return "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', sans-serif";
    case "tahoma":
      return "Tahoma, Geneva, Verdana, sans-serif";
    case "arial":
      return "Arial, Helvetica, sans-serif";
    case "montserrat":
      return "var(--font-montserrat), 'Montserrat', Arial, Helvetica, sans-serif";
    case "commissioner":
      return "var(--font-commissioner), 'Commissioner', Arial, Helvetica, sans-serif";
    default:
      return "Arial, Helvetica, sans-serif";
  }
}

/**
 * High-quality SVG path definitions for social icons to ensure reliable rendering.
 */
const SOCIAL_GLYPHS: Record<SocialNetwork, string> = {
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z",
  twitter:
    "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  facebook:
    "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
};

/**
 * Returns a self-contained SVG Data URI for an email social icon.
 */
export function getSocialIconSvgDataUrl(
  style: string,
  color: string,
  network: SocialNetwork
): string {
  const glyph = SOCIAL_GLYPHS[network] || "";
  const isWhite = color.toUpperCase() === "#FFFFFF";
  let glyphColor = "#FFFFFF";
  let backgroundShape = "";

  if (style === "outline") {
    const strokeColor = isWhite ? "#0F172A" : color;
    glyphColor = isWhite ? "#0F172A" : color;
    backgroundShape = `<rect x="1.5" y="1.5" width="37" height="37" rx="6.5" stroke="${strokeColor}" stroke-width="3" fill="none" />`;
  } else if (style === "minimal") {
    glyphColor = isWhite ? "#0F172A" : color;
  } else {
    // filled
    if (isWhite) {
      backgroundShape = `<rect x="0.5" y="0.5" width="39" height="39" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />`;
      glyphColor = "#0F172A";
    } else {
      backgroundShape = `<rect x="0" y="0" width="40" height="40" rx="8" fill="${color}" />`;
      glyphColor = "#FFFFFF";
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">${backgroundShape}<svg x="9" y="9" width="22" height="22" viewBox="0 0 24 24"><path fill="${glyphColor}" d="${glyph}"/></svg></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

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
  data: TemplateSignatureData,
  themeColor: string,
  fontStack: string,
  isPreview = false
): string {
  const networks: { key: keyof TemplateSignatureData["socials"]; label: string; network: SocialNetwork }[] = [
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

      // In preview mode or when asset URL is missing, use self-contained SVG Data URI
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

/**
 * Builds contact rows with colored letter labels.
 */
function renderContactRows(
  data: TemplateSignatureData,
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
  data: TemplateSignatureData,
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

export interface GenerateSignatureOptions {
  preview?: boolean;
}

/**
 * Generates an email-safe, table-based HTML string for the signature.
 * Strictly uses nested tables with presentation roles, inline styling, and no CSS variables or SVGs.
 * Output is an HTML fragment without <html>, <head>, <body>, or comments.
 */
export function generateSignatureHtml(
  data: TemplateSignatureData,
  options?: GenerateSignatureOptions
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
  let effectiveAvatarUrl = "";
  if (data.avatarUrl && data.avatarUrl.trim()) {
    const trimmed = data.avatarUrl.trim();
    if (trimmed.startsWith("https://") || trimmed.startsWith("/")) {
      if (isPreview && trimmed.startsWith("/") && typeof window !== "undefined" && window.location?.origin) {
        effectiveAvatarUrl = `${window.location.origin}${trimmed}`;
      } else {
        effectiveAvatarUrl = trimmed;
      }
    }
  }
  const hasAvatar = Boolean(effectiveAvatarUrl);

  // Company logo resolution: only show if data.companyLogoUrl is provided
  let effectiveLogoUrl = "";
  if (data.companyLogoUrl && data.companyLogoUrl.trim()) {
    const trimmed = data.companyLogoUrl.trim();
    if (trimmed.startsWith("https://") || trimmed.startsWith("/")) {
      if (isPreview && trimmed.startsWith("/") && typeof window !== "undefined" && window.location?.origin) {
        effectiveLogoUrl = `${window.location.origin}${trimmed}`;
      } else {
        effectiveLogoUrl = trimmed;
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
          <img src="${escapeHtml(effectiveAvatarUrl)}" alt="${escapeHtml(data.fullName || 'Photo')}" width="72" height="72" style="display:block;border:0;outline:none;text-decoration:none;border-radius:${avatarRadius};" />
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
          <img src="${escapeHtml(effectiveLogoUrl)}" alt="${escapeHtml(data.companyName || 'Logo')}" width="80" height="36" style="display:block;border:0;outline:none;text-decoration:none;max-width:95px;height:auto;" />
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
        <img src="${escapeHtml(effectiveAvatarUrl)}" alt="${escapeHtml(data.fullName || 'Photo')}" width="72" height="72" style="display:block;border:0;outline:none;text-decoration:none;border-radius:${avatarRadius};margin:0 auto;" />
        ${socialLinksHtml ? `<div style="margin-top:8px;text-align:center;">${socialLinksHtml}</div>` : ""}
      </td>`;
    }

    const companyLogoHtml = hasLogo
      ? `<img src="${escapeHtml(effectiveLogoUrl)}" alt="${escapeHtml(data.companyName || 'Logo')}" width="48" height="38" style="display:block;border:0;outline:none;text-decoration:none;margin:0 auto 8px auto;max-width:95px;height:auto;" />`
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

  // Layout 2: Horizontal
  if (layout === "horizontal") {
    let photoHtml = "";
    if (hasAvatar) {
      photoHtml = `<img src="${escapeHtml(effectiveAvatarUrl)}" alt="${escapeHtml(data.fullName || 'Photo')}" width="56" height="56" style="display:block;border:0;outline:none;text-decoration:none;border-radius:${avatarRadius};margin-bottom:6px;" />`;
    }

    const companyLogoHtml = hasLogo
      ? `<img src="${escapeHtml(effectiveLogoUrl)}" alt="${escapeHtml(data.companyName || 'Logo')}" width="80" height="36" style="display:block;border:0;outline:none;text-decoration:none;margin-bottom:4px;max-width:95px;height:auto;" />`
      : "";

    const disclaimerHtml = data.optional?.disclaimer?.trim()
      ? `<tr><td colspan="${hasAvatar || hasLogo ? 2 : 1}" style="padding-top:10px;border-top:1px solid ${theme.border};font-family:${fontStack};font-size:9px;color:${theme.muted};line-height:1.3;">${escapeHtml(data.optional.disclaimer.trim())}</td></tr>`
      : "";

    mainHtml = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" bgcolor="${theme.bg}" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:${fontStack};color:${theme.text};background-color:${theme.bg};line-height:1.4;width:100%;max-width:600px;">
  <tr>
    <td style="padding:16px;vertical-align:top;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;">
        <tr>
          ${
            hasAvatar || hasLogo
              ? `<td style="vertical-align:top;padding-right:16px;">
                  ${photoHtml}
                  ${companyLogoHtml}
                  ${socialLinksHtml ? `<div style="margin-top:6px;">${socialLinksHtml}</div>` : ""}
                </td>`
              : ""
          }
          <td style="vertical-align:top;">
            <div style="font-family:${fontStack};font-size:16px;font-weight:bold;color:${theme.text};line-height:1.2;">${escapeHtml(data.fullName || "")}</div>
            <div style="font-family:${fontStack};font-size:12px;font-weight:500;color:${theme.muted};margin-top:2px;line-height:1.3;">${escapeHtml(data.jobTitle || "")}</div>
            ${
              data.companyName
                ? `<div style="font-family:${fontStack};font-size:12px;font-weight:600;color:${themeColor};margin-top:1px;line-height:1.3;">${escapeHtml(data.companyName)}</div>`
                : ""
            }
            ${
              data.optional?.tagline?.trim()
                ? `<div style="font-family:${fontStack};font-size:10px;color:${theme.muted};margin-top:2px;line-height:1.2;">${escapeHtml(data.optional.tagline.trim())}</div>`
                : ""
            }
            <div style="margin-top:8px;">
              ${contactRowsHtml}
            </div>
            ${!hasAvatar && !hasLogo && socialLinksHtml ? `<div style="margin-top:8px;">${socialLinksHtml}</div>` : ""}
          </td>
        </tr>
        ${disclaimerHtml}
      </table>
    </td>
  </tr>
</table>`;
  }

  // Layout 3: Compact
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
                  <img src="${escapeHtml(effectiveAvatarUrl)}" alt="${escapeHtml(data.fullName || 'Photo')}" width="44" height="44" style="display:block;border:0;outline:none;text-decoration:none;border-radius:${avatarRadius};" />
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
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:${theme.border === 'transparent' ? '#F8FAFC' : theme.bg};border-radius:6px;">
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
 * Returns a simple plain-text version of the signature data:
 * name, job title, company, phone, email, website, address, tagline, disclaimer (one per line, skipping empty values).
 */
export function generateSignaturePlainText(data: TemplateSignatureData): string {
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
