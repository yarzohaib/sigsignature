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
 * "Photo Pop" Creative Template Renderer.
 * Features a 96px round portrait framed with a 4px accent ring, 19px bold name,
 * title in accent color, an italic quote tagline with accent quotation marks,
 * contact info on two compact lines with accent labels, circle social icons,
 * and a right-aligned company badge separated by a dotted accent line.
 */
export function render(data: TemplateSignatureData): string {
  const themeColor = validateThemeColor(data.themeColor || "#F97316");
  const fontStack = resolveSafeFontStack(data.fontFamily || "Verdana");

  const hasAvatar = hasSafeImage(data.avatarUrl);
  const hasLogo = hasSafeImage(data.companyLogoUrl);
  const hasCompany = Boolean(data.companyName?.trim() || hasLogo);

  // 96px Round photo framed with a 4px accent ring
  const avatarCell = hasAvatar
    ? `<td valign="middle" style="vertical-align:middle;padding-right:16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
          <tr>
            <td bgcolor="${themeColor}" align="center" valign="middle" style="padding:4px;background-color:${themeColor};border-radius:50%;font-size:0;line-height:0;text-align:center;">
              <img src="${escapeHtml(data.avatarUrl!)}" alt="${escapeHtml(data.fullName || "Photo")}" width="96" height="96" style="display:block;border:0;outline:none;text-decoration:none;border-radius:50%;width:96px;height:96px;" />
            </td>
          </tr>
        </table>
      </td>`
    : "";

  // Title in accent color
  const titleRow = data.jobTitle?.trim()
    ? `<div style="font-family:${fontStack};font-size:12px;font-weight:600;color:${themeColor};line-height:1.3;margin-top:2px;">
        ${escapeHtml(data.jobTitle.trim())}
      </div>`
    : "";

  // Tagline as short quote in italic with accent quotation mark
  const taglineQuote = data.optional?.tagline?.trim()
    ? `<div style="font-family:${fontStack};font-size:11px;margin-top:3px;margin-bottom:6px;line-height:1.3;">
        <span style="color:${themeColor};font-size:14px;font-weight:bold;line-height:1;">&ldquo;</span><span style="font-style:italic;color:#64748B;">${escapeHtml(data.optional.tagline.trim())}</span><span style="color:${themeColor};font-size:14px;font-weight:bold;line-height:1;">&rdquo;</span>
      </div>`
    : "";

  // Contact on two compact lines with small accent labels
  // Line 1: Phone & Email
  const line1Items: string[] = [];
  if (data.phone?.trim()) {
    const href = safeUrl(telHref(data.phone));
    line1Items.push(
      `<strong style="color:${themeColor};font-size:10px;font-family:${fontStack};">TEL</strong>&nbsp;<a href="${href}" style="color:#64748B;text-decoration:none;font-size:11px;font-family:${fontStack};">${escapeHtml(data.phone.trim())}</a>`
    );
  }
  if (data.email?.trim()) {
    const href = safeUrl(`mailto:${data.email.trim()}`);
    line1Items.push(
      `<strong style="color:${themeColor};font-size:10px;font-family:${fontStack};">EMAIL</strong>&nbsp;<a href="${href}" style="color:#64748B;text-decoration:none;font-size:11px;font-family:${fontStack};">${escapeHtml(data.email.trim())}</a>`
    );
  }

  // Line 2: Website & Address
  const line2Items: string[] = [];
  if (data.website?.trim()) {
    const href = safeUrl(normalizeWebsite(data.website));
    const label = escapeHtml(data.website.trim().replace(/^https?:\/\//i, ""));
    line2Items.push(
      `<strong style="color:${themeColor};font-size:10px;font-family:${fontStack};">WEB</strong>&nbsp;<a href="${href}" target="_blank" style="color:#64748B;text-decoration:none;font-size:11px;font-family:${fontStack};">${label}</a>`
    );
  }
  if (data.optional?.address?.trim()) {
    line2Items.push(
      `<strong style="color:${themeColor};font-size:10px;font-family:${fontStack};">LOC</strong>&nbsp;<span style="color:#64748B;font-size:11px;font-family:${fontStack};">${escapeHtml(data.optional.address.trim())}</span>`
    );
  }

  const separator = `&nbsp;<span style="color:#CBD5E1;">&bull;</span>&nbsp;`;
  const contactLines: string[] = [];
  if (line1Items.length > 0) {
    contactLines.push(
      `<tr><td style="padding:1px 0;font-family:${fontStack};font-size:11px;color:#64748B;line-height:1.4;">${line1Items.join(separator)}</td></tr>`
    );
  }
  if (line2Items.length > 0) {
    contactLines.push(
      `<tr><td style="padding:1px 0;font-family:${fontStack};font-size:11px;color:#64748B;line-height:1.4;">${line2Items.join(separator)}</td></tr>`
    );
  }

  const contactSection = contactLines.length > 0
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:4px;margin-bottom:6px;">
        ${contactLines.join("")}
      </table>`
    : "";

  // Social icons in circle style
  const socialLinksHtml = renderSocialLinks(
    { ...data, socialIconsStyle: data.socialIconsStyle || "circle" },
    themeColor,
    fontStack
  );

  // Company logo/name block at the right with a dotted accent line separating it
  const rightCompanyContent: string[] = [];
  if (hasLogo) {
    rightCompanyContent.push(
      `<img src="${escapeHtml(data.companyLogoUrl!)}" alt="${escapeHtml(data.companyName || "Logo")}" width="70" height="26" style="display:block;border:0;outline:none;text-decoration:none;max-width:85px;height:auto;" />`
    );
  }
  if (data.companyName?.trim()) {
    rightCompanyContent.push(
      `<div style="font-family:${fontStack};font-size:11px;font-weight:bold;color:${themeColor};text-transform:uppercase;letter-spacing:0.8px;line-height:1.2;margin-top:${hasLogo ? "4px" : "0"};">
        ${escapeHtml(data.companyName.trim())}
      </div>`
    );
  }

  const rightCompanyCell = hasCompany && rightCompanyContent.length > 0
    ? `<td valign="middle" style="border-left:2px dotted ${themeColor};padding-left:14px;vertical-align:middle;text-align:left;">
        ${rightCompanyContent.join("")}
      </td>`
    : "";

  // Optional disclaimer at bottom
  const disclaimerRow = data.optional?.disclaimer?.trim()
    ? `<tr>
        <td colspan="3" style="padding-top:8px;">
          <div style="font-family:${fontStack};font-size:9px;color:#94A3B8;line-height:1.3;border-top:1px solid #E2E8F0;padding-top:4px;">
            ${escapeHtml(data.optional.disclaimer.trim())}
          </div>
        </td>
      </tr>`
    : "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:${fontStack};color:#1E293B;line-height:1.4;max-width:600px;">
  <tr>
    <td valign="top" style="vertical-align:top;padding:0;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          ${avatarCell}
          <!-- Details Column -->
          <td valign="middle" style="vertical-align:middle;padding-right:${hasCompany ? "14px" : "0"};">
            <!-- Name 19px bold -->
            <div style="font-family:${fontStack};font-size:19px;font-weight:bold;color:#1E293B;line-height:1.2;">
              ${escapeHtml(data.fullName || "")}
            </div>
            ${titleRow}
            ${taglineQuote}
            ${contactSection}
            ${socialLinksHtml}
          </td>
          ${rightCompanyCell}
        </tr>
        ${disclaimerRow}
      </table>
    </td>
  </tr>
</table>`;
}
