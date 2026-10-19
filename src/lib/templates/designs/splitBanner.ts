import { TemplateSignatureData } from "@/types/template";
import {
  escapeHtml,
  safeUrl,
  normalizeWebsite,
  telHref,
  resolveSafeFontStack,
  validateThemeColor,
  hasSafeImage,
  emailIconUrl,
  SocialNetwork,
} from "./shared";

/**
 * Chooses either a dark (#111827) or white (#FFFFFF) text color based on the
 * ITU-R BT.601 relative luminance of the provided hex color, ensuring WCAG contrast compliance.
 */
function getContrastColor(hexColor: string): "#111827" | "#FFFFFF" {
  const hex = hexColor.replace(/^#/, "");
  let r = 0;
  let g = 0;
  let b = 0;

  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length >= 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }

  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 155 ? "#111827" : "#FFFFFF";
}

/**
 * "Split Banner" Bold Template Renderer.
 * Features a split duo-tone layout: solid accent left column with 80px portrait
 * (or company monogram fallback) and company name/logo, a 3px dark line separator,
 * and a crisp white right column with 22px bold name in #111827, bold grey title,
 * dark-labeled contact rows, and dark filled social icons.
 */
export function render(data: TemplateSignatureData): string {
  const themeColor = validateThemeColor(data.themeColor || "#FACC15");
  const fontStack = resolveSafeFontStack(data.fontFamily || "DM Sans");
  const contrastColor = getContrastColor(themeColor);

  const hasAvatar = hasSafeImage(data.avatarUrl);
  const hasLogo = hasSafeImage(data.companyLogoUrl);

  // Left Cell visual: 80px photo OR monogram if no photo
  let visualBlock = "";
  if (hasAvatar) {
    visualBlock = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;border-collapse:collapse;">
      <tr>
        <td style="padding:0;font-size:0;line-height:0;">
          <img src="${escapeHtml(data.avatarUrl!)}" alt="${escapeHtml(data.fullName || "Photo")}" width="80" height="80" style="display:block;border:0;outline:none;text-decoration:none;border-radius:8px;width:80px;height:80px;object-fit:cover;" />
        </td>
      </tr>
    </table>`;
  } else {
    // Company monogram badge fallback
    const rawMonogram = (data.companyName?.trim() || data.fullName?.trim() || "CO")
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const monogramBg = contrastColor === "#FFFFFF" ? "rgba(255,255,255,0.2)" : "rgba(17,24,39,0.12)";

    visualBlock = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;width:80px;height:80px;border-collapse:collapse;">
      <tr>
        <td align="center" valign="middle" style="padding:0;background-color:${monogramBg};border-radius:8px;font-family:${fontStack};font-size:26px;font-weight:800;color:${contrastColor};line-height:1;text-align:center;">
          ${escapeHtml(rawMonogram)}
        </td>
      </tr>
    </table>`;
  }

  // Company logo or company name in the left column
  const companyLogoHtml = hasLogo
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px auto 0 auto;border-collapse:collapse;">
        <tr>
          <td align="center" style="padding:0;font-size:0;line-height:0;">
            <img src="${escapeHtml(data.companyLogoUrl!)}" alt="${escapeHtml(data.companyName || "Logo")}" width="84" height="28" style="display:block;border:0;outline:none;text-decoration:none;max-width:84px;height:auto;" />
          </td>
        </tr>
      </table>`
    : "";

  const companyNameHtml = data.companyName?.trim()
    ? `<div style="font-family:${fontStack};font-size:12px;font-weight:700;color:${contrastColor};margin-top:6px;line-height:1.2;text-align:center;word-break:break-word;">
        ${escapeHtml(data.companyName.trim())}
      </div>`
    : "";

  // Right column: Name 22px bold in #111827
  const nameHtml = `<div style="font-family:${fontStack};font-size:22px;font-weight:800;color:#111827;line-height:1.2;margin:0 0 3px 0;">${escapeHtml(data.fullName || "")}</div>`;

  // Title in bold grey
  const titleHtml = data.jobTitle?.trim()
    ? `<div style="font-family:${fontStack};font-size:12px;font-weight:600;color:#4B5563;margin-bottom:10px;line-height:1.3;">${escapeHtml(data.jobTitle.trim())}</div>`
    : "";

  // Contact rows with dark labels (#111827) and values in #4B5563
  const contactRows: string[] = [];

  if (data.phone?.trim()) {
    const href = safeUrl(telHref(data.phone));
    contactRows.push(
      `<tr><td style="padding:2px 8px 2px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:#111827;">T</td><td style="padding:2px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;color:#4B5563;"><a href="${href}" style="color:#4B5563;text-decoration:none;">${escapeHtml(data.phone.trim())}</a></td></tr>`
    );
  }

  if (data.email?.trim()) {
    const href = safeUrl(`mailto:${data.email.trim()}`);
    contactRows.push(
      `<tr><td style="padding:2px 8px 2px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:#111827;">E</td><td style="padding:2px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;color:#4B5563;"><a href="${href}" style="color:#4B5563;text-decoration:none;">${escapeHtml(data.email.trim())}</a></td></tr>`
    );
  }

  if (data.website?.trim()) {
    const href = safeUrl(normalizeWebsite(data.website));
    contactRows.push(
      `<tr><td style="padding:2px 8px 2px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:#111827;">W</td><td style="padding:2px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;color:#4B5563;"><a href="${href}" target="_blank" style="color:#4B5563;text-decoration:none;">${escapeHtml(data.website.trim())}</a></td></tr>`
    );
  }

  if (data.optional?.address?.trim()) {
    contactRows.push(
      `<tr><td style="padding:2px 8px 2px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:#111827;">A</td><td style="padding:2px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;color:#4B5563;">${escapeHtml(data.optional.address.trim())}</td></tr>`
    );
  }

  const contactsTable = contactRows.length > 0
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${contactRows.join("")}</table>`
    : "";

  // Socials as filled dark icons (#111827)
  const networks: Array<{ key: string; label: string; network: SocialNetwork }> = [
    { key: "linkedin", label: "LinkedIn", network: "linkedin" },
    { key: "twitter", label: "Twitter", network: "twitter" },
    { key: "facebook", label: "Facebook", network: "facebook" },
    { key: "instagram", label: "Instagram", network: "instagram" },
    { key: "github", label: "GitHub", network: "github" },
    { key: "youtube", label: "YouTube", network: "youtube" },
    { key: "website", label: "Website", network: "website" },
  ];

  const socialLinks = networks
    .map(({ key, label, network }) => {
      const rawUrl = (data.socials as Record<string, string | undefined>)?.[key];
      if (!rawUrl || !rawUrl.trim()) return "";
      const url = safeUrl(normalizeWebsite(rawUrl));
      if (!url) return "";
      const iconUrl = emailIconUrl("filled", "#111827", network);
      if (iconUrl) {
        return `<a href="${url}" target="_blank" style="text-decoration:none;display:inline-block;margin-right:6px;"><img src="${escapeHtml(iconUrl)}" alt="${escapeHtml(label)}" width="18" height="18" style="display:block;border:0;outline:none;text-decoration:none;" /></a>`;
      }
      return `<a href="${url}" target="_blank" style="font-family:${fontStack};font-size:10px;font-weight:bold;color:#111827;text-decoration:none;margin-right:8px;">${escapeHtml(label)}</a>`;
    })
    .filter(Boolean);

  const socialsTable = socialLinks.length > 0
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:8px;"><tr><td style="padding:0;vertical-align:middle;">${socialLinks.join("")}</td></tr></table>`
    : "";

  // Tagline & Disclaimer
  const taglineHtml = data.optional?.tagline?.trim()
    ? `<div style="font-family:${fontStack};font-size:10px;color:#6B7280;font-style:italic;margin-top:8px;line-height:1.3;">${escapeHtml(data.optional.tagline.trim())}</div>`
    : "";

  const disclaimerHtml = data.optional?.disclaimer?.trim()
    ? `<div style="font-family:${fontStack};font-size:9px;color:#9CA3AF;margin-top:6px;line-height:1.3;">${escapeHtml(data.optional.disclaimer.trim())}</div>`
    : "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:${fontStack};">
  <tr>
    <!-- Left Accent Cell with 80px Photo/Monogram and Company -->
    <td bgcolor="${themeColor}" width="140" valign="middle" align="center" style="background-color:${themeColor};width:140px;min-width:140px;padding:18px 12px;vertical-align:middle;text-align:center;">
      ${visualBlock}
      ${companyLogoHtml}
      ${companyNameHtml}
    </td>

    <!-- 3px Dark Line Separator -->
    <td bgcolor="#111827" width="3" style="width:3px;background-color:#111827;font-size:0;line-height:0;padding:0;">&nbsp;</td>

    <!-- Right White Cell with Name, Title, Contacts, Socials -->
    <td bgcolor="#FFFFFF" valign="middle" style="background-color:#FFFFFF;padding:16px 20px;vertical-align:middle;">
      ${nameHtml}
      ${titleHtml}
      ${contactsTable}
      ${socialsTable}
      ${taglineHtml}
      ${disclaimerHtml}
    </td>
  </tr>
</table>`;
}
