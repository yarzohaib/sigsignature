import { TemplateSignatureData } from "@/types/template";
import {
  escapeHtml,
  resolveEmailFont,
  validateThemeColor,
  renderSocialLinks,
  renderCompactContactItems,
} from "./shared";

/**
 * Compact Template Renderer.
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

  const socialLinksHtml = renderSocialLinks(data, themeColor, fontStack);

  let photoCell = "";
  if (hasAvatar) {
    photoCell = `<td style="vertical-align:middle;padding-right:12px;">
      <img src="${escapeHtml(data.avatarUrl)}" alt="${escapeHtml(data.fullName || "Photo")}" width="44" height="44" style="display:block;border:0;outline:none;text-decoration:none;border-radius:8px;" />
    </td>`;
  }

  const compactItems = renderCompactContactItems(data, themeColor, fontStack);
  const disclaimerHtml = data.optional?.disclaimer?.trim()
    ? `<tr><td style="padding-top:6px;font-family:${fontStack};font-size:9px;color:#94A3B8;line-height:1.3;">${escapeHtml(data.optional.disclaimer.trim())}</td></tr>`
    : "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:${fontStack};color:#1E293B;line-height:1.4;">
  <tr>
    <td style="padding:0;vertical-align:top;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;">
        <tr>
          ${photoCell}
          <td style="vertical-align:middle;padding-right:12px;">
            <div style="font-family:${fontStack};font-size:14px;font-weight:bold;color:#1E293B;line-height:1.2;">${escapeHtml(data.fullName || "")}</div>
            <div style="font-family:${fontStack};font-size:11px;color:#64748B;margin-top:1px;">
              ${escapeHtml(data.jobTitle || "")}${data.companyName?.trim() ? ` &bull; ${escapeHtml(data.companyName.trim())}` : ""}
            </div>
          </td>
          ${socialLinksHtml ? `<td style="vertical-align:middle;text-align:right;">${socialLinksHtml}</td>` : ""}
        </tr>
      </table>
    </td>
  </tr>
  ${
    compactItems
      ? `<tr>
    <td style="padding-top:6px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:#F8FAFC;border-radius:6px;">
        <tr>
          <td style="padding:4px 8px;font-family:${fontStack};font-size:10px;color:#64748B;">
            ${compactItems}
          </td>
        </tr>
      </table>
    </td>
  </tr>`
      : ""
  }
  ${disclaimerHtml}
</table>`;
}
