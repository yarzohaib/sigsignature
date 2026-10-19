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
 * "Boardroom" Template Renderer.
 * Corporate signature featuring a full-width dark navy top row with logo / company name and tagline,
 * an 80px square photo, structured T/E/W/A contact rows, social icons, navy separator, and legal footer.
 */
export function render(data: TemplateSignatureData): string {
  const themeColor = validateThemeColor(data.themeColor || "#022977");
  const fontStack = resolveSafeFontStack(data.fontFamily || "Verdana");

  const hasAvatar = Boolean(
    data.avatarUrl &&
      data.avatarUrl.trim().length > 0 &&
      !data.avatarUrl.trim().startsWith("javascript:") &&
      !data.avatarUrl.trim().startsWith("data:")
  );

  const hasLogo = Boolean(
    data.companyLogoUrl &&
      data.companyLogoUrl.trim().length > 0 &&
      !data.companyLogoUrl.trim().startsWith("javascript:") &&
      !data.companyLogoUrl.trim().startsWith("data:")
  );

  const socialLinksHtml = renderSocialLinks(data, themeColor, fontStack);

  // Top navy header bar with logo/company on left and tagline on right
  const companyLogoOrText = hasLogo
    ? `<img src="${escapeHtml(data.companyLogoUrl!)}" alt="${escapeHtml(data.companyName || "Logo")}" width="75" height="24" style="display:block;border:0;outline:none;text-decoration:none;max-width:100px;height:auto;" />`
    : `<span style="font-family:${fontStack};font-size:12px;font-weight:bold;color:#FFFFFF;letter-spacing:1.5px;text-transform:uppercase;">${escapeHtml(data.companyName || "COMPANY NAME")}</span>`;

  const taglineText = data.optional?.tagline?.trim();
  const taglineHtml = taglineText
    ? `<span style="font-family:${fontStack};font-size:10px;color:#BFDBFE;letter-spacing:0.5px;">${escapeHtml(taglineText)}</span>`
    : "";

  const headerBar = `<tr>
    <td bgcolor="#022977" style="background-color:#022977;padding:10px 16px;border-radius:6px 6px 0 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;width:100%;">
        <tr>
          <td align="left" valign="middle" style="padding:0;">
            ${companyLogoOrText}
          </td>
          ${
            taglineHtml
              ? `<td align="right" valign="middle" style="padding:0;padding-left:12px;">
            ${taglineHtml}
          </td>`
              : ""
          }
        </tr>
      </table>
    </td>
  </tr>`;

  // Photo 80px square on left
  const photoCell = hasAvatar
    ? `<td width="80" valign="top" style="width:80px;padding-right:16px;">
        <img src="${escapeHtml(data.avatarUrl)}" alt="${escapeHtml(data.fullName || "Photo")}" width="80" height="80" style="display:block;border:0;outline:none;text-decoration:none;border-radius:4px;" />
      </td>`
    : "";

  // Contact rows with navy letter labels T E W A
  const contactRows: string[] = [];
  if (data.phone?.trim()) {
    const href = safeUrl(telHref(data.phone));
    contactRows.push(
      `<tr><td style="padding:1.5px 6px 1.5px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:#022977;">T</td><td style="padding:1.5px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;"><a href="${href}" style="color:#334155;text-decoration:none;">${escapeHtml(data.phone.trim())}</a></td></tr>`
    );
  }
  if (data.email?.trim()) {
    const href = safeUrl(`mailto:${data.email.trim()}`);
    contactRows.push(
      `<tr><td style="padding:1.5px 6px 1.5px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:#022977;">E</td><td style="padding:1.5px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;"><a href="${href}" style="color:#334155;text-decoration:none;">${escapeHtml(data.email.trim())}</a></td></tr>`
    );
  }
  if (data.website?.trim()) {
    const href = safeUrl(normalizeWebsite(data.website));
    const label = escapeHtml(data.website.trim().replace(/^https?:\/\//i, ""));
    contactRows.push(
      `<tr><td style="padding:1.5px 6px 1.5px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:#022977;">W</td><td style="padding:1.5px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;"><a href="${href}" target="_blank" style="color:#334155;text-decoration:none;">${label}</a></td></tr>`
    );
  }
  if (data.optional?.address?.trim()) {
    contactRows.push(
      `<tr><td style="padding:1.5px 6px 1.5px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:#022977;">A</td><td style="padding:1.5px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;color:#64748B;">${escapeHtml(data.optional.address.trim())}</td></tr>`
    );
  }

  const contactTableHtml = contactRows.length > 0
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:6px;">${contactRows.join("")}</table>`
    : "";

  // Disclaimer and address footer
  const disclaimerText = data.optional?.disclaimer?.trim();
  const disclaimerRow = disclaimerText
    ? `<tr>
        <td style="padding-top:8px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;width:100%;">
            <!-- Thin navy line -->
            <tr>
              <td height="1" bgcolor="${themeColor}" style="height:1px;background-color:${themeColor};font-size:1px;line-height:1px;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding-top:6px;font-family:${fontStack};font-size:9.5px;color:#64748B;line-height:1.4;">
                ${escapeHtml(disclaimerText)}
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    : "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:${fontStack};color:#1E293B;line-height:1.4;max-width:600px;width:100%;">
  ${headerBar}
  <tr>
    <td bgcolor="#FFFFFF" style="background-color:#FFFFFF;border:1px solid #E2E8F0;border-top:0;border-radius:0 0 6px 6px;padding:14px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;width:100%;">
        <tr>
          ${photoCell}
          <td valign="top" style="padding:0;">
            <!-- Name bold 17px -->
            <div style="font-family:${fontStack};font-size:17px;font-weight:bold;color:#1E293B;line-height:1.2;">
              ${escapeHtml(data.fullName || "")}
            </div>
            <!-- Title grey -->
            <div style="font-family:${fontStack};font-size:12px;color:#64748B;margin-top:2px;">
              ${escapeHtml(data.jobTitle || "")}
            </div>
            <!-- Contact rows -->
            ${contactTableHtml}
            <!-- Social icons -->
            ${socialLinksHtml ? `<div style="margin-top:8px;">${socialLinksHtml}</div>` : ""}
          </td>
        </tr>
        ${disclaimerRow}
      </table>
    </td>
  </tr>
</table>`;
}
