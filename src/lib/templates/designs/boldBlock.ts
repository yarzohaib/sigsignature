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
 * "Bold Block" Bold Template Renderer.
 * High-contrast dark panel design (#111827) with bold uppercase typography,
 * vibrant accent colors (#38BDF8 default), an 84px square portrait on the right,
 * and Gmail dark-mode-safe explicit coloring throughout.
 */
export function render(data: TemplateSignatureData): string {
  const themeColor = validateThemeColor(data.themeColor || "#38BDF8");
  const fontStack = resolveSafeFontStack(data.fontFamily || "Montserrat");

  const hasAvatar = hasSafeImage(data.avatarUrl);
  const hasLogo = hasSafeImage(data.companyLogoUrl);

  // Name: uppercase 22px extra bold with letter spacing
  const nameHtml = `<div style="font-family:${fontStack};font-size:22px;font-weight:800;color:#FFFFFF;text-transform:uppercase;letter-spacing:1.2px;line-height:1.2;margin:0 0 4px 0;">${escapeHtml(data.fullName || "")}</div>`;

  // Title: uppercase 11px in accent color
  const titleHtml = data.jobTitle?.trim()
    ? `<div style="font-family:${fontStack};font-size:11px;font-weight:700;color:${themeColor};text-transform:uppercase;letter-spacing:1px;line-height:1.3;margin:0 0 6px 0;">${escapeHtml(data.jobTitle.trim())}</div>`
    : "";

  // Company: uppercase bold light grey
  const companyHtml = data.companyName?.trim()
    ? `<div style="font-family:${fontStack};font-size:12px;font-weight:700;color:#E5E7EB;text-transform:uppercase;letter-spacing:0.8px;line-height:1.3;margin:0 0 12px 0;">${escapeHtml(data.companyName.trim())}</div>`
    : "";

  // Contact rows with accent colored letter labels (T, E, W, A) and light grey text (#D1D5DB)
  const contactRows: string[] = [];

  if (data.phone?.trim()) {
    const href = safeUrl(telHref(data.phone));
    contactRows.push(
      `<tr><td style="padding:2px 8px 2px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:${themeColor};">T</td><td style="padding:2px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;color:#D1D5DB;"><a href="${href}" style="color:#D1D5DB;text-decoration:none;">${escapeHtml(data.phone.trim())}</a></td></tr>`
    );
  }

  if (data.email?.trim()) {
    const href = safeUrl(`mailto:${data.email.trim()}`);
    contactRows.push(
      `<tr><td style="padding:2px 8px 2px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:${themeColor};">E</td><td style="padding:2px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;color:#D1D5DB;"><a href="${href}" style="color:#D1D5DB;text-decoration:none;">${escapeHtml(data.email.trim())}</a></td></tr>`
    );
  }

  if (data.website?.trim()) {
    const href = safeUrl(normalizeWebsite(data.website));
    contactRows.push(
      `<tr><td style="padding:2px 8px 2px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:${themeColor};">W</td><td style="padding:2px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;color:#D1D5DB;"><a href="${href}" target="_blank" style="color:#D1D5DB;text-decoration:none;">${escapeHtml(data.website.trim())}</a></td></tr>`
    );
  }

  if (data.optional?.address?.trim()) {
    contactRows.push(
      `<tr><td style="padding:2px 8px 2px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:${themeColor};">A</td><td style="padding:2px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;color:#D1D5DB;">${escapeHtml(data.optional.address.trim())}</td></tr>`
    );
  }

  const contactsTable = contactRows.length > 0
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-bottom:10px;">${contactRows.join("")}</table>`
    : "";

  // Social icons in filled style
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
      const iconUrl = emailIconUrl(data.socialIconsStyle || "filled", themeColor, network);
      if (iconUrl) {
        return `<a href="${url}" target="_blank" style="text-decoration:none;display:inline-block;margin-right:6px;"><img src="${escapeHtml(iconUrl)}" alt="${escapeHtml(label)}" width="18" height="18" style="display:block;border:0;outline:none;text-decoration:none;" /></a>`;
      }
      return `<a href="${url}" target="_blank" style="font-family:${fontStack};font-size:10px;font-weight:bold;color:${themeColor};text-decoration:none;margin-right:8px;">${escapeHtml(label)}</a>`;
    })
    .filter(Boolean);

  const socialsTable = socialLinks.length > 0
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:6px;"><tr><td style="padding:0;vertical-align:middle;">${socialLinks.join("")}</td></tr></table>`
    : "";

  // Right column: square photo 84px (collapses if missing) + optional logo
  let rightColumn = "";
  if (hasAvatar || hasLogo) {
    const photoImg = hasAvatar
      ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
          <tr>
            <td style="padding:0;font-size:0;line-height:0;">
              <img src="${escapeHtml(data.avatarUrl!)}" alt="${escapeHtml(data.fullName || "Photo")}" width="84" height="84" style="display:block;border:0;outline:none;text-decoration:none;border-radius:6px;width:84px;height:84px;object-fit:cover;" />
            </td>
          </tr>
        </table>`
      : "";

    const logoImg = hasLogo
      ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:${hasAvatar ? "10px" : "0"};">
          <tr>
            <td align="center" style="padding:0;font-size:0;line-height:0;">
              <img src="${escapeHtml(data.companyLogoUrl!)}" alt="${escapeHtml(data.companyName || "Logo")}" width="84" height="30" style="display:block;border:0;outline:none;text-decoration:none;max-width:84px;height:auto;" />
            </td>
          </tr>
        </table>`
      : "";

    rightColumn = `<td valign="top" align="center" style="vertical-align:top;padding-left:18px;width:84px;text-align:center;">
        ${photoImg}
        ${logoImg}
      </td>`;
  }

  // Tagline and Disclaimer at the bottom
  const taglineHtml = data.optional?.tagline?.trim()
    ? `<div style="font-family:${fontStack};font-size:10px;color:#9CA3AF;font-style:italic;margin-top:12px;padding-top:10px;border-top:1px solid #1F2937;line-height:1.4;">${escapeHtml(data.optional.tagline.trim())}</div>`
    : "";

  const disclaimerHtml = data.optional?.disclaimer?.trim()
    ? `<div style="font-family:${fontStack};font-size:9px;color:#6B7280;margin-top:6px;line-height:1.3;">${escapeHtml(data.optional.disclaimer.trim())}</div>`
    : "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#111827" style="max-width:600px;background-color:#111827;border-collapse:collapse;border-radius:12px;overflow:hidden;color:#FFFFFF;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:${fontStack};">
  <tr>
    <td bgcolor="#111827" style="background-color:#111827;padding:20px;vertical-align:top;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
        <tr>
          <td valign="top" style="vertical-align:top;padding:0;">
            ${nameHtml}
            ${titleHtml}
            ${companyHtml}
            ${contactsTable}
            ${socialsTable}
          </td>
          ${rightColumn}
        </tr>
      </table>
      ${taglineHtml}
      ${disclaimerHtml}
    </td>
  </tr>
</table>`;
}
