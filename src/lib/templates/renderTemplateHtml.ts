import { TemplateSignatureData } from "@/types/template";
import { SIGNATURE_COLOR_SWATCHES } from "@/lib/signatureConstants";
import {
  escapeHtml,
  safeUrl,
  normalizeWebsite,
  telHref,
  resolveEmailFont,
  emailIconUrl,
} from "@/lib/email-core";

/**
 * Builds social icons table cell or fallback text links.
 */
function renderSocialLinks(
  data: TemplateSignatureData,
  themeColor: string,
  fontStack: string
): string {
  const networks: Array<{
    key: keyof TemplateSignatureData["socials"];
    label: string;
    network: "linkedin" | "twitter" | "facebook" | "instagram";
  }> = [
    { key: "linkedin", label: "LinkedIn", network: "linkedin" },
    { key: "twitter", label: "Twitter", network: "twitter" },
    { key: "facebook", label: "Facebook", network: "facebook" },
    { key: "instagram", label: "Instagram", network: "instagram" },
  ];

  const items = networks
    .map(({ key, label, network }) => {
      const rawUrl = data.socials[key];
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
function renderContactRows(
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
function renderCompactContactItems(
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
 * Generates an email-safe, table-based HTML string for the template signature.
 * Strictly uses nested tables with presentation roles, inline styling, and no CSS variables or SVGs.
 * Output is an HTML fragment without <html>, <head>, <body>, or comments.
 */
export function generateTemplateHtml(data: TemplateSignatureData): string {
  const isColorValid = SIGNATURE_COLOR_SWATCHES.some(
    (s) => s.toLowerCase() === (data.themeColor || "").toLowerCase()
  );
  const themeColor = isColorValid ? data.themeColor : "#245FD4";
  const fontStack = resolveEmailFont(data.fontFamily);

  const hasAvatar = Boolean(data.avatarUrl && data.avatarUrl.trim().startsWith("https"));
  const hasLogo = Boolean(data.companyLogoUrl && data.companyLogoUrl.trim().startsWith("https"));

  const socialLinksHtml = renderSocialLinks(data, themeColor, fontStack);
  const contactRowsHtml = renderContactRows(data, themeColor, fontStack);

  const layout = data.layout || "two-column";

  // Layout 1: Two Column
  if (layout === "two-column") {
    let photoCell = "";
    if (hasAvatar) {
      photoCell = `<td style="vertical-align:top;padding-right:16px;text-align:center;">
        <img src="${escapeHtml(data.avatarUrl)}" alt="${escapeHtml(data.fullName || "Photo")}" width="64" height="64" style="display:block;border:0;outline:none;text-decoration:none;border-radius:12px;" />
        ${socialLinksHtml ? `<div style="margin-top:8px;">${socialLinksHtml}</div>` : ""}
      </td>`;
    }

    const companyLogoHtml = hasLogo
      ? `<img src="${escapeHtml(data.companyLogoUrl!)}" alt="${escapeHtml(data.companyName || "Logo")}" width="80" height="36" style="display:block;border:0;outline:none;text-decoration:none;margin:0 auto 6px auto;max-width:95px;height:auto;" />`
      : "";

    const companyTaglineHtml = data.optional?.tagline?.trim()
      ? `<div style="font-family:${fontStack};font-size:9px;color:#94A3B8;margin-top:2px;line-height:1.2;">${escapeHtml(data.optional.tagline.trim())}</div>`
      : "";

    const companyCell = `<td style="vertical-align:middle;padding-left:16px;border-left:1px solid #E2E8F0;text-align:center;">
      <div style="display:inline-block;text-align:center;">
        ${companyLogoHtml}
        <div style="font-family:${fontStack};font-size:11px;font-weight:bold;color:#1E293B;line-height:1.2;">${escapeHtml(data.companyName || "")}</div>
        ${companyTaglineHtml}
      </div>
    </td>`;

    const disclaimerHtml = data.optional?.disclaimer?.trim()
      ? `<tr><td colspan="${hasAvatar ? 3 : 2}" style="padding-top:10px;border-top:1px solid #E2E8F0;font-family:${fontStack};font-size:9px;color:#94A3B8;line-height:1.3;">${escapeHtml(data.optional.disclaimer.trim())}</td></tr>`
      : "";

    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:${fontStack};color:#1E293B;line-height:1.4;">
  <tr>
    <td style="padding:0;vertical-align:top;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          ${photoCell}
          <td style="vertical-align:top;padding-right:16px;">
            <div style="font-family:${fontStack};font-size:15px;font-weight:bold;color:#1E293B;line-height:1.2;">${escapeHtml(data.fullName || "")}</div>
            <div style="font-family:${fontStack};font-size:12px;font-weight:500;color:#64748B;margin-top:2px;margin-bottom:6px;line-height:1.3;">${escapeHtml(data.jobTitle || "")}</div>
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
    let photoCell = "";
    if (hasAvatar) {
      photoCell = `<td style="vertical-align:middle;padding-right:14px;">
        <img src="${escapeHtml(data.avatarUrl)}" alt="${escapeHtml(data.fullName || "Photo")}" width="56" height="56" style="display:block;border:0;outline:none;text-decoration:none;border-radius:50%;" />
      </td>`;
    }

    const companyLogoHtml = hasLogo
      ? `<img src="${escapeHtml(data.companyLogoUrl!)}" alt="${escapeHtml(data.companyName || "Logo")}" width="60" height="28" style="display:block;border:0;outline:none;text-decoration:none;margin-bottom:4px;max-width:80px;height:auto;" />`
      : "";

    const taglineHtml = data.optional?.tagline?.trim()
      ? `<span style="font-family:${fontStack};font-size:9.5px;color:#94A3B8;font-style:italic;">${escapeHtml(data.optional.tagline.trim())}</span>`
      : "";

    const disclaimerHtml = data.optional?.disclaimer?.trim()
      ? `<tr><td style="padding-top:8px;font-family:${fontStack};font-size:9px;color:#94A3B8;line-height:1.3;">${escapeHtml(data.optional.disclaimer.trim())}</td></tr>`
      : "";

    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:${fontStack};color:#1E293B;line-height:1.4;">
  <tr>
    <td style="padding:0;vertical-align:top;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;">
        <tr>
          ${photoCell}
          <td style="vertical-align:middle;padding-right:16px;">
            ${companyLogoHtml}
            <div style="font-family:${fontStack};font-size:15px;font-weight:bold;color:#1E293B;line-height:1.2;">${escapeHtml(data.fullName || "")}</div>
            <div style="font-family:${fontStack};font-size:11.5px;font-weight:500;color:#64748B;margin-top:2px;">
              ${escapeHtml(data.jobTitle || "")}${data.companyName?.trim() ? ` &bull; <strong style="color:#1E293B;">${escapeHtml(data.companyName.trim())}</strong>` : ""}
            </div>
          </td>
          ${socialLinksHtml ? `<td style="vertical-align:middle;text-align:right;">${socialLinksHtml}</td>` : ""}
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding-top:8px;border-top:1px solid #E2E8F0;margin-top:8px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;">
        <tr>
          <td style="vertical-align:middle;">${contactRowsHtml}</td>
          ${taglineHtml ? `<td style="vertical-align:middle;text-align:right;padding-left:12px;">${taglineHtml}</td>` : ""}
        </tr>
      </table>
    </td>
  </tr>
  ${disclaimerHtml}
</table>`;
  }

  // Layout 3: Compact
  let photoCell = "";
  if (hasAvatar) {
    photoCell = `<td style="vertical-align:middle;padding-right:12px;">
      <img src="${escapeHtml(data.avatarUrl)}" alt="${escapeHtml(data.fullName || "Photo")}" width="44" height="44" style="display:block;border:0;outline:none;text-decoration:none;border-radius:8px;" />
    </td>`;
  }

  const compactItems = renderCompactContactItems(data, themeColor, fontStack);
  const disclaimerHtml = data.optional?.disclaimer?.trim()
    ? `<tr><td style="padding-top:6px;font-family:${fontStack};font-size:9px;color:#94A3B8;line-height:1.3;">${escapeHtml(data.optional.disclaimer.trim())}</td></tr>`
    : "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:${fontStack};color:#1E293B;line-height:1.4;">
  <tr>
    <td style="padding:0;vertical-align:top;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;">
        <tr>
          ${photoCell}
          <td style="vertical-align:middle;padding-right:12px;">
            <div style="font-family:${fontStack};font-size:14px;font-weight:bold;color:#1E293B;line-height:1.2;">${escapeHtml(data.fullName || "")}</div>
            <div style="font-family:${fontStack};font-size:11px;color:#64748B;margin-top:1px;">
              ${escapeHtml(data.jobTitle || "")}${data.companyName?.trim() ? ` &bull; ${escapeHtml(data.companyName.trim())}` : ""}
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
    <td style="padding-top:6px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:#F8FAFC;border-radius:6px;">
        <tr>
          <td style="padding:4px 8px;font-family:${fontStack};font-size:10px;color:#64748B;">
            ${compactItems}
          </td>
        </tr>
      </table>
    </td>
  </tr>`
      : ""
  }
  ${disclaimerHtml}
</table>`;
}

/**
 * Returns a simple plain-text version of the signature data:
 * name, job title, company, phone, email, website, address, tagline, disclaimer (one per line, skipping empty values).
 */
export function generateTemplatePlainText(data: TemplateSignatureData): string {
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

  return lines.join("\n");
}
