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
 * "Ribbon" Creative Template Renderer.
 * Features a full-width accent-colored top ribbon row displaying the name (18px white bold)
 * and job title (12px white) on the left, and company logo/name in white on the right.
 * Beneath the ribbon on white: contact rows on the left, a 72px photo on the right,
 * outline social icons row, and small grey address/disclaimer at the bottom.
 */
export function render(data: TemplateSignatureData): string {
  const themeColor = validateThemeColor(data.themeColor || "#0D9488");
  const fontStack = resolveSafeFontStack(data.fontFamily || "Tahoma");

  const hasAvatar = hasSafeImage(data.avatarUrl);
  const hasLogo = hasSafeImage(data.companyLogoUrl);

  // Top ribbon right side: Company Logo or Company Name in white
  let rightRibbonCell = "";
  if (hasLogo) {
    rightRibbonCell = `<td valign="middle" align="right" style="vertical-align:middle;text-align:right;padding-left:12px;">
      <img src="${escapeHtml(data.companyLogoUrl!)}" alt="${escapeHtml(data.companyName || "Logo")}" width="75" height="24" style="display:block;border:0;outline:none;text-decoration:none;max-width:85px;height:auto;" />
    </td>`;
  } else if (data.companyName?.trim()) {
    rightRibbonCell = `<td valign="middle" align="right" style="vertical-align:middle;text-align:right;font-family:${fontStack};font-size:12px;font-weight:bold;color:#FFFFFF;letter-spacing:0.5px;padding-left:12px;">
      ${escapeHtml(data.companyName.trim())}
    </td>`;
  }

  // Title in ribbon
  const jobTitleSpan = data.jobTitle?.trim()
    ? `<span style="color:#CCFBF1;font-size:12px;padding:0 6px;">&bull;</span><span style="font-family:${fontStack};font-size:12px;color:#FFFFFF;line-height:1.2;">${escapeHtml(data.jobTitle.trim())}</span>`
    : "";

  // Contact items for the lower left column
  const contactRows: string[] = [];
  if (data.phone?.trim()) {
    const href = safeUrl(telHref(data.phone));
    contactRows.push(
      `<tr>
        <td width="14" style="width:14px;font-family:${fontStack};font-size:11px;font-weight:bold;color:${themeColor};vertical-align:middle;padding:1px 0;">T</td>
        <td style="padding-left:4px;padding-top:1px;padding-bottom:1px;font-family:${fontStack};font-size:11px;vertical-align:middle;">
          <a href="${href}" style="color:#334155;text-decoration:none;">${escapeHtml(data.phone.trim())}</a>
        </td>
      </tr>`
    );
  }
  if (data.email?.trim()) {
    const href = safeUrl(`mailto:${data.email.trim()}`);
    contactRows.push(
      `<tr>
        <td width="14" style="width:14px;font-family:${fontStack};font-size:11px;font-weight:bold;color:${themeColor};vertical-align:middle;padding:1px 0;">E</td>
        <td style="padding-left:4px;padding-top:1px;padding-bottom:1px;font-family:${fontStack};font-size:11px;vertical-align:middle;">
          <a href="${href}" style="color:#334155;text-decoration:none;">${escapeHtml(data.email.trim())}</a>
        </td>
      </tr>`
    );
  }
  if (data.website?.trim()) {
    const href = safeUrl(normalizeWebsite(data.website));
    const label = escapeHtml(data.website.trim().replace(/^https?:\/\//i, ""));
    contactRows.push(
      `<tr>
        <td width="14" style="width:14px;font-family:${fontStack};font-size:11px;font-weight:bold;color:${themeColor};vertical-align:middle;padding:1px 0;">W</td>
        <td style="padding-left:4px;padding-top:1px;padding-bottom:1px;font-family:${fontStack};font-size:11px;vertical-align:middle;">
          <a href="${href}" target="_blank" style="color:#334155;text-decoration:none;">${label}</a>
        </td>
      </tr>`
    );
  }

  const contactTable = contactRows.length > 0
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-bottom:6px;">
        ${contactRows.join("")}
      </table>`
    : "";

  // Outline style social icons
  const socialLinksHtml = renderSocialLinks(
    { ...data, socialIconsStyle: data.socialIconsStyle || "outline" },
    themeColor,
    fontStack
  );

  // 72px Photo on the right, collapses cleanly if missing
  const photoCell = hasAvatar
    ? `<td valign="top" align="right" style="vertical-align:top;text-align:right;padding-left:14px;">
        <img src="${escapeHtml(data.avatarUrl!)}" alt="${escapeHtml(data.fullName || "Photo")}" width="72" height="72" style="display:block;border:0;outline:none;text-decoration:none;border-radius:8px;width:72px;height:72px;" />
      </td>`
    : "";

  // Optional tagline
  const taglineHtml = data.optional?.tagline?.trim()
    ? `<div style="font-family:${fontStack};font-size:11px;font-style:italic;color:#64748B;margin-top:4px;line-height:1.3;">
        ${escapeHtml(data.optional.tagline.trim())}
      </div>`
    : "";

  // Address and disclaimer at bottom
  const footerItems: string[] = [];
  if (data.optional?.address?.trim()) {
    footerItems.push(
      `<div style="font-family:${fontStack};font-size:10px;color:#94A3B8;margin-bottom:2px;">
        ${escapeHtml(data.optional.address.trim())}
      </div>`
    );
  }
  if (data.optional?.disclaimer?.trim()) {
    footerItems.push(
      `<div style="font-family:${fontStack};font-size:9px;color:#94A3B8;line-height:1.3;">
        ${escapeHtml(data.optional.disclaimer.trim())}
      </div>`
    );
  }

  const bottomFooter = footerItems.length > 0
    ? `<tr>
        <td colspan="2" style="padding-top:6px;">
          <div style="border-top:1px solid #E2E8F0;padding-top:4px;">
            ${footerItems.join("")}
          </div>
        </td>
      </tr>`
    : "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:${fontStack};color:#1E293B;line-height:1.4;max-width:600px;">
  <!-- Full-Width Accent Ribbon Header -->
  <tr>
    <td bgcolor="${themeColor}" style="background-color:${themeColor};padding:8px 12px;border-radius:6px 6px 0 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;width:100%;">
        <tr>
          <td valign="middle" align="left" style="vertical-align:middle;text-align:left;">
            <span style="font-family:${fontStack};font-size:18px;font-weight:bold;color:#FFFFFF;line-height:1.2;">
              ${escapeHtml(data.fullName || "")}
            </span>
            ${jobTitleSpan}
          </td>
          ${rightRibbonCell}
        </tr>
      </table>
    </td>
  </tr>
  <!-- Lower Body Area on White -->
  <tr>
    <td style="padding:10px 12px 6px 12px;background-color:#FFFFFF;" bgcolor="#FFFFFF">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;width:100%;">
        <tr>
          <!-- Contact and Socials on Left -->
          <td valign="top" style="vertical-align:top;text-align:left;">
            ${contactTable}
            ${socialLinksHtml}
            ${taglineHtml}
          </td>
          ${photoCell}
        </tr>
        ${bottomFooter}
      </table>
    </td>
  </tr>
</table>`;
}
