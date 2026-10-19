import { TemplateSignatureData } from "@/types/template";
import {
  escapeHtml,
  resolveEmailFont,
  validateThemeColor,
  renderSocialLinks,
  renderContactRows,
} from "./shared";

/**
 * Single Column Template Renderer.
 * Email-safe, table-based stacked layout.
 */
export function render(data: TemplateSignatureData): string {
  const themeColor = validateThemeColor(data.themeColor);
  const fontStack = resolveEmailFont(data.fontFamily);

  const hasAvatar = Boolean(
    data.avatarUrl &&
      data.avatarUrl.trim().length > 0 &&
      !data.avatarUrl.trim().startsWith("javascript:")
  );
  const hasLogo = Boolean(
    data.companyLogoUrl &&
      data.companyLogoUrl.trim().length > 0 &&
      !data.companyLogoUrl.trim().startsWith("javascript:")
  );

  const socialLinksHtml = renderSocialLinks(data, themeColor, fontStack);
  const contactRowsHtml = renderContactRows(data, themeColor, fontStack);

  const photoHtml = hasAvatar
    ? `<tr><td style="padding-bottom:10px;">
        <img src="${escapeHtml(data.avatarUrl)}" alt="${escapeHtml(data.fullName || "Photo")}" width="56" height="56" style="display:block;border:0;outline:none;text-decoration:none;border-radius:50%;" />
      </td></tr>`
    : "";

  const logoHtml = hasLogo
    ? `<tr><td style="padding-bottom:8px;">
        <img src="${escapeHtml(data.companyLogoUrl!)}" alt="${escapeHtml(data.companyName || "Logo")}" width="70" height="28" style="display:block;border:0;outline:none;text-decoration:none;max-width:90px;height:auto;" />
      </td></tr>`
    : "";

  const taglineHtml = data.optional?.tagline?.trim()
    ? `<div style="font-family:${fontStack};font-size:10px;color:#94A3B8;margin-top:2px;font-style:italic;">${escapeHtml(data.optional.tagline.trim())}</div>`
    : "";

  const disclaimerHtml = data.optional?.disclaimer?.trim()
    ? `<tr><td style="padding-top:10px;border-top:1px solid #E2E8F0;font-family:${fontStack};font-size:9px;color:#94A3B8;line-height:1.3;">${escapeHtml(data.optional.disclaimer.trim())}</td></tr>`
    : "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:${fontStack};color:#1E293B;line-height:1.4;max-width:600px;">
  ${photoHtml}
  ${logoHtml}
  <tr>
    <td style="padding:0 0 6px 0;">
      <div style="font-family:${fontStack};font-size:15px;font-weight:bold;color:#1E293B;line-height:1.2;">${escapeHtml(data.fullName || "")}</div>
      <div style="font-family:${fontStack};font-size:12px;font-weight:500;color:${themeColor};margin-top:2px;line-height:1.3;">
        ${escapeHtml(data.jobTitle || "")}${data.companyName?.trim() ? ` &bull; <span style="color:#64748B;">${escapeHtml(data.companyName.trim())}</span>` : ""}
      </div>
      ${taglineHtml}
    </td>
  </tr>
  <tr>
    <td style="padding:4px 0 6px 0;">
      ${contactRowsHtml}
    </td>
  </tr>
  ${socialLinksHtml ? `<tr><td style="padding-top:4px;padding-bottom:4px;">${socialLinksHtml}</td></tr>` : ""}
  ${disclaimerHtml}
</table>`;
}
