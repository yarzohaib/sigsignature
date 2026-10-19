import { TemplateSignatureData } from "@/types/template";
import {
  escapeHtml,
  resolveEmailFont,
  validateThemeColor,
  renderSocialLinks,
  renderContactRows,
} from "./shared";

/**
 * Horizontal Template Renderer.
 * Preserved byte-for-byte compatible with existing signatures.
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

  let photoCell = "";
  if (hasAvatar) {
    photoCell = `<td style="vertical-align:middle;padding-right:14px;">
        <img src="${escapeHtml(data.avatarUrl)}" alt="${escapeHtml(data.fullName || "Photo")}" width="56" height="56" style="display:block;border:0;outline:none;text-decoration:none;border-radius:50%;" />
      </td>`;
  }

  const companyLogoHtml = hasLogo
    ? `<img src="${escapeHtml(data.companyLogoUrl!)}" alt="${escapeHtml(data.companyName || "Logo")}" width="60" height="28" style="display:block;border:0;outline:none;text-decoration:none;margin-bottom:4px;max-width:80px;height:auto;" />`
    : "";

  const taglineHtml = data.optional?.tagline?.trim()
    ? `<span style="font-family:${fontStack};font-size:9.5px;color:#94A3B8;font-style:italic;">${escapeHtml(data.optional.tagline.trim())}</span>`
    : "";

  const disclaimerHtml = data.optional?.disclaimer?.trim()
    ? `<tr><td style="padding-top:8px;font-family:${fontStack};font-size:9px;color:#94A3B8;line-height:1.3;">${escapeHtml(data.optional.disclaimer.trim())}</td></tr>`
    : "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:${fontStack};color:#1E293B;line-height:1.4;">
  <tr>
    <td style="padding:0;vertical-align:top;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;">
        <tr>
          ${photoCell}
          <td style="vertical-align:middle;padding-right:16px;">
            ${companyLogoHtml}
            <div style="font-family:${fontStack};font-size:15px;font-weight:bold;color:#1E293B;line-height:1.2;">${escapeHtml(data.fullName || "")}</div>
            <div style="font-family:${fontStack};font-size:11.5px;font-weight:500;color:#64748B;margin-top:2px;">
              ${escapeHtml(data.jobTitle || "")}${data.companyName?.trim() ? ` &bull; <strong style="color:#1E293B;">${escapeHtml(data.companyName.trim())}</strong>` : ""}
            </div>
          </td>
          ${socialLinksHtml ? `<td style="vertical-align:middle;text-align:right;">${socialLinksHtml}</td>` : ""}
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding-top:8px;border-top:1px solid #E2E8F0;margin-top:8px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;">
        <tr>
          <td style="vertical-align:middle;">${contactRowsHtml}</td>
          ${taglineHtml ? `<td style="vertical-align:middle;text-align:right;padding-left:12px;">${taglineHtml}</td>` : ""}
        </tr>
      </table>
    </td>
  </tr>
  ${disclaimerHtml}
</table>`;
}
