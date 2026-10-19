import { TemplateSignatureData } from "@/types/template";
import {
  escapeHtml,
  safeUrl,
  normalizeWebsite,
  telHref,
  resolveSafeFontStack,
  validateThemeColor,
  hasSafeImage,
  renderSocialLinks,
} from "./shared";

/**
 * "Color Block" Creative Template Renderer.
 * Features a 10px solid accent vertical strip on the left, an 80px rounded square portrait,
 * 20px bold name, title in a filled accent pill with white text, company name in accent color,
 * filled circle contact letter badges, social icons, and an italic grey tagline.
 */
export function render(data: TemplateSignatureData): string {
  const themeColor = validateThemeColor(data.themeColor || "#7C3AED");
  const fontStack = resolveSafeFontStack(data.fontFamily || "Trebuchet MS");

  const hasAvatar = hasSafeImage(data.avatarUrl);
  const hasLogo = hasSafeImage(data.companyLogoUrl);

  // Avatar block: 80px rounded square, collapses cleanly if missing
  const avatarCell = hasAvatar
    ? `<td valign="top" style="vertical-align:top;padding-right:16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
          <tr>
            <td style="padding:0;font-size:0;line-height:0;">
              <img src="${escapeHtml(data.avatarUrl!)}" alt="${escapeHtml(data.fullName || "Photo")}" width="80" height="80" style="display:block;border:0;outline:none;text-decoration:none;border-radius:10px;width:80px;height:80px;" />
            </td>
          </tr>
        </table>
      </td>`
    : "";

  // Title pill with accent background and white text
  const titlePill = data.jobTitle?.trim()
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:4px 0 5px 0;">
        <tr>
          <td bgcolor="${themeColor}" style="background-color:${themeColor};padding:3px 10px;border-radius:12px;font-family:${fontStack};font-size:11px;font-weight:bold;color:#FFFFFF;line-height:1.2;">
            ${escapeHtml(data.jobTitle.trim())}
          </td>
        </tr>
      </table>`
    : "";

  // Company Name in accent color
  const companyRow = data.companyName?.trim()
    ? `<div style="font-family:${fontStack};font-size:12px;font-weight:600;color:${themeColor};margin-bottom:6px;line-height:1.3;">
        ${escapeHtml(data.companyName.trim())}
      </div>`
    : "";

  // Contact items with 18px rounded circle letter badges in accent color
  const contactRows: string[] = [];

  if (data.phone?.trim()) {
    const href = safeUrl(telHref(data.phone));
    contactRows.push(
      `<tr>
        <td width="18" height="18" bgcolor="${themeColor}" align="center" valign="middle" style="width:18px;height:18px;background-color:${themeColor};border-radius:50%;color:#FFFFFF;font-family:${fontStack};font-size:10px;font-weight:bold;line-height:18px;text-align:center;padding:0;">
          T
        </td>
        <td style="padding-left:8px;padding-top:2px;padding-bottom:2px;vertical-align:middle;font-family:${fontStack};font-size:11px;">
          <a href="${href}" style="color:#64748B;text-decoration:none;">${escapeHtml(data.phone.trim())}</a>
        </td>
      </tr>`
    );
  }

  if (data.email?.trim()) {
    const href = safeUrl(`mailto:${data.email.trim()}`);
    contactRows.push(
      `<tr>
        <td width="18" height="18" bgcolor="${themeColor}" align="center" valign="middle" style="width:18px;height:18px;background-color:${themeColor};border-radius:50%;color:#FFFFFF;font-family:${fontStack};font-size:10px;font-weight:bold;line-height:18px;text-align:center;padding:0;">
          E
        </td>
        <td style="padding-left:8px;padding-top:2px;padding-bottom:2px;vertical-align:middle;font-family:${fontStack};font-size:11px;">
          <a href="${href}" style="color:#64748B;text-decoration:none;">${escapeHtml(data.email.trim())}</a>
        </td>
      </tr>`
    );
  }

  if (data.website?.trim()) {
    const href = safeUrl(normalizeWebsite(data.website));
    const label = escapeHtml(data.website.trim().replace(/^https?:\/\//i, ""));
    contactRows.push(
      `<tr>
        <td width="18" height="18" bgcolor="${themeColor}" align="center" valign="middle" style="width:18px;height:18px;background-color:${themeColor};border-radius:50%;color:#FFFFFF;font-family:${fontStack};font-size:10px;font-weight:bold;line-height:18px;text-align:center;padding:0;">
          W
        </td>
        <td style="padding-left:8px;padding-top:2px;padding-bottom:2px;vertical-align:middle;font-family:${fontStack};font-size:11px;">
          <a href="${href}" target="_blank" style="color:#64748B;text-decoration:none;">${label}</a>
        </td>
      </tr>`
    );
  }

  if (data.optional?.address?.trim()) {
    contactRows.push(
      `<tr>
        <td width="18" height="18" bgcolor="${themeColor}" align="center" valign="middle" style="width:18px;height:18px;background-color:${themeColor};border-radius:50%;color:#FFFFFF;font-family:${fontStack};font-size:10px;font-weight:bold;line-height:18px;text-align:center;padding:0;">
          A
        </td>
        <td style="padding-left:8px;padding-top:2px;padding-bottom:2px;vertical-align:middle;font-family:${fontStack};font-size:11px;color:#64748B;">
          ${escapeHtml(data.optional.address.trim())}
        </td>
      </tr>`
    );
  }

  const contactSection = contactRows.length > 0
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:2px;margin-bottom:6px;">
        ${contactRows.join("")}
      </table>`
    : "";

  // Social links (filled circles)
  const socialLinksHtml = renderSocialLinks(
    { ...data, socialIconsStyle: data.socialIconsStyle || "filled" },
    themeColor,
    fontStack
  );

  // Optional tagline in italic grey
  const taglineHtml = data.optional?.tagline?.trim()
    ? `<div style="font-family:${fontStack};font-size:11px;font-style:italic;color:#64748B;margin-top:6px;line-height:1.3;">
        ${escapeHtml(data.optional.tagline.trim())}
      </div>`
    : "";

  // Optional disclaimer
  const disclaimerHtml = data.optional?.disclaimer?.trim()
    ? `<div style="font-family:${fontStack};font-size:9px;color:#94A3B8;line-height:1.3;margin-top:6px;padding-top:4px;border-top:1px solid #E2E8F0;">
        ${escapeHtml(data.optional.disclaimer.trim())}
      </div>`
    : "";

  // Logo row (if provided)
  const logoBlock = hasLogo
    ? `<div style="margin-top:6px;">
        <img src="${escapeHtml(data.companyLogoUrl!)}" alt="${escapeHtml(data.companyName || "Logo")}" width="80" height="28" style="display:block;border:0;outline:none;text-decoration:none;max-width:90px;height:auto;" />
      </div>`
    : "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:${fontStack};color:#1E293B;line-height:1.4;max-width:600px;">
  <tr>
    <!-- 10px Solid Accent Vertical Strip on Left -->
    <td width="10" bgcolor="${themeColor}" style="width:10px;background-color:${themeColor};font-size:1px;line-height:1px;">&nbsp;</td>
    <!-- Spacer -->
    <td width="14" style="width:14px;font-size:1px;line-height:1px;">&nbsp;</td>
    <!-- Main Content Area -->
    <td valign="top" style="vertical-align:top;padding:0;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          ${avatarCell}
          <!-- Details Column -->
          <td valign="top" style="vertical-align:top;padding:0;">
            <!-- Name 20px bold -->
            <div style="font-family:${fontStack};font-size:20px;font-weight:bold;color:#1E293B;line-height:1.2;">
              ${escapeHtml(data.fullName || "")}
            </div>
            ${titlePill}
            ${companyRow}
            ${contactSection}
            ${socialLinksHtml}
            ${taglineHtml}
            ${logoBlock}
            ${disclaimerHtml}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}
