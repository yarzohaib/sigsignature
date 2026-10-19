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
 * "Big Name" Bold Template Renderer.
 * High-impact headline-driven design with a 6px top accent bar, 28px uppercase bold name,
 * solid accent title badge, inline contact row with accent bullet separators,
 * an optional collapsible right circular portrait, and an uppercase company name
 * anchored with a thick 3px accent underline.
 */
export function render(data: TemplateSignatureData): string {
  const themeColor = validateThemeColor(data.themeColor || "#E11D48");
  const fontStack = resolveSafeFontStack(data.fontFamily || "Arial");

  const hasAvatar = hasSafeImage(data.avatarUrl);
  const hasLogo = hasSafeImage(data.companyLogoUrl);

  // Large Name: uppercase 28px bold with tight line-height
  const nameHtml = `<div style="font-family:${fontStack};font-size:28px;font-weight:800;color:#111827;text-transform:uppercase;line-height:1.05;letter-spacing:-0.5px;margin:10px 0 6px 0;">${escapeHtml(data.fullName || "")}</div>`;

  // Title on solid accent highlight pill
  const titlePill = data.jobTitle?.trim()
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-bottom:10px;">
        <tr>
          <td bgcolor="${themeColor}" style="background-color:${themeColor};padding:3px 8px;font-family:${fontStack};font-size:11px;font-weight:bold;color:#FFFFFF;text-transform:uppercase;letter-spacing:0.6px;line-height:1.2;border-radius:2px;">
            ${escapeHtml(data.jobTitle.trim())}
          </td>
        </tr>
      </table>`
    : "";

  // Contact items in bold uppercase small line style with accent separators
  const contactParts: string[] = [];

  if (data.phone?.trim()) {
    const href = safeUrl(telHref(data.phone));
    contactParts.push(
      `<span style="display:inline-block;"><strong style="color:${themeColor};font-family:${fontStack};font-size:10px;text-transform:uppercase;">TEL</strong>&nbsp;<a href="${href}" style="color:#475569;text-decoration:none;font-family:${fontStack};font-size:10px;font-weight:bold;">${escapeHtml(data.phone.trim())}</a></span>`
    );
  }

  if (data.email?.trim()) {
    const href = safeUrl(`mailto:${data.email.trim()}`);
    contactParts.push(
      `<span style="display:inline-block;"><strong style="color:${themeColor};font-family:${fontStack};font-size:10px;text-transform:uppercase;">EMAIL</strong>&nbsp;<a href="${href}" style="color:#475569;text-decoration:none;font-family:${fontStack};font-size:10px;font-weight:bold;">${escapeHtml(data.email.trim())}</a></span>`
    );
  }

  if (data.website?.trim()) {
    const href = safeUrl(normalizeWebsite(data.website));
    contactParts.push(
      `<span style="display:inline-block;"><strong style="color:${themeColor};font-family:${fontStack};font-size:10px;text-transform:uppercase;">WEB</strong>&nbsp;<a href="${href}" target="_blank" style="color:#475569;text-decoration:none;font-family:${fontStack};font-size:10px;font-weight:bold;">${escapeHtml(data.website.trim())}</a></span>`
    );
  }

  if (data.optional?.address?.trim()) {
    contactParts.push(
      `<span style="display:inline-block;"><strong style="color:${themeColor};font-family:${fontStack};font-size:10px;text-transform:uppercase;">LOC</strong>&nbsp;<span style="color:#475569;font-family:${fontStack};font-size:10px;font-weight:bold;">${escapeHtml(data.optional.address.trim())}</span></span>`
    );
  }

  const separatorHtml = `<span style="color:${themeColor};padding:0 6px;font-size:10px;font-weight:bold;">&bull;</span>`;
  const contactRowHtml = contactParts.length > 0
    ? `<div style="font-family:${fontStack};margin-bottom:10px;line-height:1.5;">${contactParts.join(separatorHtml)}</div>`
    : "";

  // Company Name with thick 3px underline in accent color
  const companyBlock = data.companyName?.trim()
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:4px;">
        <tr>
          <td style="border-bottom:3px solid ${themeColor};padding-bottom:3px;font-family:${fontStack};font-size:13px;font-weight:800;color:#111827;text-transform:uppercase;letter-spacing:0.8px;line-height:1.2;">
            ${escapeHtml(data.companyName.trim())}
          </td>
        </tr>
      </table>`
    : "";

  // Social icons
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
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:8px;"><tr><td style="padding:0;vertical-align:middle;">${socialLinks.join("")}</td></tr></table>`
    : "";

  // Optional small round photo on the right (64px) - collapses cleanly if missing
  let rightCell = "";
  if (hasAvatar || hasLogo) {
    const photoImg = hasAvatar
      ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
          <tr>
            <td style="padding:0;font-size:0;line-height:0;">
              <img src="${escapeHtml(data.avatarUrl!)}" alt="${escapeHtml(data.fullName || "Photo")}" width="64" height="64" style="display:block;border:0;outline:none;text-decoration:none;border-radius:50%;width:64px;height:64px;object-fit:cover;" />
            </td>
          </tr>
        </table>`
      : "";

    const logoImg = hasLogo
      ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:${hasAvatar ? "8px" : "0"};">
          <tr>
            <td align="right" style="padding:0;font-size:0;line-height:0;">
              <img src="${escapeHtml(data.companyLogoUrl!)}" alt="${escapeHtml(data.companyName || "Logo")}" width="72" height="26" style="display:block;border:0;outline:none;text-decoration:none;max-width:72px;height:auto;" />
            </td>
          </tr>
        </table>`
      : "";

    rightCell = `<td valign="middle" align="right" style="vertical-align:middle;padding-left:20px;padding-top:10px;width:72px;text-align:right;">
        ${photoImg}
        ${logoImg}
      </td>`;
  }

  // Tagline & Disclaimer
  const taglineHtml = data.optional?.tagline?.trim()
    ? `<div style="font-family:${fontStack};font-size:10px;color:#64748B;font-style:italic;margin-top:8px;line-height:1.3;">${escapeHtml(data.optional.tagline.trim())}</div>`
    : "";

  const disclaimerHtml = data.optional?.disclaimer?.trim()
    ? `<div style="font-family:${fontStack};font-size:9px;color:#94A3B8;margin-top:6px;line-height:1.3;">${escapeHtml(data.optional.disclaimer.trim())}</div>`
    : "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:${fontStack};">
  <!-- 6px Accent Bar Across the Top -->
  <tr>
    <td ${rightCell ? 'colspan="2"' : ""} bgcolor="${themeColor}" height="6" style="background-color:${themeColor};height:6px;font-size:0;line-height:0;padding:0;">&nbsp;</td>
  </tr>
  <tr>
    <td valign="top" style="vertical-align:top;padding:4px 0 0 0;">
      ${nameHtml}
      ${titlePill}
      ${contactRowHtml}
      ${companyBlock}
      ${socialsTable}
      ${taglineHtml}
      ${disclaimerHtml}
    </td>
    ${rightCell}
  </tr>
</table>`;
}
