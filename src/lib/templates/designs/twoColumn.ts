import { TemplateSignatureData } from "@/types/template";
import {
  escapeHtml,
  resolveEmailFont,
  validateThemeColor,
  renderSocialLinks,
  renderContactRows,
  hasSafeImage,
} from "./shared";

/**
 * Two-Column Template Renderer ("Professional Minimal").
 * Preserved byte-for-byte compatible with existing signatures.
 */
export function render(data: TemplateSignatureData): string {
  const themeColor = validateThemeColor(data.themeColor);
  const fontStack = resolveEmailFont(data.fontFamily);

  const hasAvatar = hasSafeImage(data.avatarUrl);
  const hasLogo = hasSafeImage(data.companyLogoUrl);

  const socialLinksHtml = renderSocialLinks(data, themeColor, fontStack);
  const contactRowsHtml = renderContactRows(data, themeColor, fontStack);

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
