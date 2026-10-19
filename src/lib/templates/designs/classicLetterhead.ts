import { TemplateSignatureData } from "@/types/template";
import {
  escapeHtml,
  safeUrl,
  normalizeWebsite,
  telHref,
  resolveSafeFontStack,
  validateThemeColor,
  renderSocialLinks,
} from "./shared";

/**
 * "Classic Letterhead" Template Renderer.
 * Traditional letterhead aesthetic with top accent rule, serif typography (Georgia 20px),
 * italic title, small-caps company name, right-aligned logo, dual-column contact details,
 * italic disclaimer, and a thin grey footer line.
 */
export function render(data: TemplateSignatureData): string {
  const themeColor = validateThemeColor(data.themeColor || "#1F3A5F");
  const fontStack = resolveSafeFontStack(data.fontFamily || "Georgia");

  const hasLogo = Boolean(
    data.companyLogoUrl &&
      data.companyLogoUrl.trim().length > 0 &&
      !data.companyLogoUrl.trim().startsWith("javascript:") &&
      !data.companyLogoUrl.trim().startsWith("data:")
  );

  const socialLinksHtml = renderSocialLinks(data, themeColor, fontStack);

  // Logo on the right aligned with name
  const logoCell = hasLogo
    ? `<td align="right" valign="top" style="padding-left:16px;">
        <img src="${escapeHtml(data.companyLogoUrl!)}" alt="${escapeHtml(data.companyName || "Logo")}" width="85" height="32" style="display:block;border:0;outline:none;text-decoration:none;max-width:95px;height:auto;" />
      </td>`
    : "";

  // Contact columns: left (phone, email), right (website, address)
  const leftContactItems: string[] = [];
  if (data.phone?.trim()) {
    const href = safeUrl(telHref(data.phone));
    leftContactItems.push(
      `<div style="font-family:${fontStack};font-size:11px;color:#64748B;line-height:1.5;">
        <span style="color:#94A3B8;font-size:10px;">Phone:</span>&nbsp;<a href="${href}" style="color:#334155;text-decoration:none;">${escapeHtml(data.phone.trim())}</a>
      </div>`
    );
  }
  if (data.email?.trim()) {
    const href = safeUrl(`mailto:${data.email.trim()}`);
    leftContactItems.push(
      `<div style="font-family:${fontStack};font-size:11px;color:#64748B;line-height:1.5;">
        <span style="color:#94A3B8;font-size:10px;">Email:</span>&nbsp;<a href="${href}" style="color:#334155;text-decoration:none;">${escapeHtml(data.email.trim())}</a>
      </div>`
    );
  }

  const rightContactItems: string[] = [];
  if (data.website?.trim()) {
    const href = safeUrl(normalizeWebsite(data.website));
    const label = escapeHtml(data.website.trim().replace(/^https?:\/\//i, ""));
    rightContactItems.push(
      `<div style="font-family:${fontStack};font-size:11px;color:#64748B;line-height:1.5;">
        <span style="color:#94A3B8;font-size:10px;">Web:</span>&nbsp;<a href="${href}" target="_blank" style="color:#334155;text-decoration:none;">${label}</a>
      </div>`
    );
  }
  if (data.optional?.address?.trim()) {
    rightContactItems.push(
      `<div style="font-family:${fontStack};font-size:11px;color:#64748B;line-height:1.5;">
        <span style="color:#94A3B8;font-size:10px;">Addr:</span>&nbsp;${escapeHtml(data.optional.address.trim())}
      </div>`
    );
  }

  let contactTableHtml = "";
  if (leftContactItems.length > 0 && rightContactItems.length > 0) {
    contactTableHtml = `<tr>
      <td colspan="2" style="padding-top:10px;border-top:1px solid #E2E8F0;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;width:100%;">
          <tr>
            <td valign="top" style="padding-right:12px;width:50%;">
              ${leftContactItems.join("")}
            </td>
            <td valign="top" style="padding-left:12px;width:50%;">
              ${rightContactItems.join("")}
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
  } else if (leftContactItems.length > 0 || rightContactItems.length > 0) {
    const allItems = [...leftContactItems, ...rightContactItems];
    contactTableHtml = `<tr>
      <td colspan="2" style="padding-top:10px;border-top:1px solid #E2E8F0;">
        <div style="display:inline-block;">
          ${allItems.join("")}
        </div>
      </td>
    </tr>`;
  }

  // Disclaimer in 9px grey italic
  const disclaimerText = data.optional?.disclaimer?.trim();
  const disclaimerRow = disclaimerText
    ? `<tr>
        <td colspan="2" style="padding-top:8px;font-family:${fontStack};font-size:9px;font-style:italic;color:#94A3B8;line-height:1.35;">
          ${escapeHtml(disclaimerText)}
        </td>
      </tr>`
    : "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:${fontStack};color:#1E293B;line-height:1.4;max-width:600px;width:100%;">
  <!-- Thin accent line on top -->
  <tr>
    <td colspan="2" height="2" bgcolor="${themeColor}" style="height:2px;background-color:${themeColor};font-size:1px;line-height:2px;">&nbsp;</td>
  </tr>
  <tr>
    <td colspan="2" style="padding-top:12px;padding-bottom:4px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;width:100%;">
        <tr>
          <td valign="top" style="padding:0;">
            <!-- Name in Georgia 20px -->
            <div style="font-family:${fontStack};font-size:20px;font-weight:bold;color:#1E293B;line-height:1.2;">
              ${escapeHtml(data.fullName || "")}
            </div>
            <!-- Title in italic -->
            <div style="font-family:${fontStack};font-size:12px;font-style:italic;color:#64748B;margin-top:2px;line-height:1.3;">
              ${escapeHtml(data.jobTitle || "")}
            </div>
            <!-- Company name in small caps -->
            <div style="font-family:${fontStack};font-size:11.5px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:${themeColor};margin-top:2px;">
              ${escapeHtml(data.companyName || "")}
            </div>
          </td>
          ${logoCell}
        </tr>
      </table>
    </td>
  </tr>
  <!-- Contact columns under hairline -->
  ${contactTableHtml}
  <!-- Social links -->
  ${
    socialLinksHtml
      ? `<tr><td colspan="2" style="padding-top:6px;padding-bottom:4px;">${socialLinksHtml}</td></tr>`
      : ""
  }
  ${disclaimerRow}
  <!-- Thin grey line at bottom -->
  <tr>
    <td colspan="2" style="padding-top:10px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;width:100%;">
        <tr>
          <td height="1" bgcolor="#E2E8F0" style="height:1px;background-color:#E2E8F0;font-size:1px;line-height:1px;">&nbsp;</td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}
