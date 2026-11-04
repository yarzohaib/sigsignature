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
} from "./shared";

/**
 * Professional Minimal Template Renderer (Daniel Wilson).
 * Standard dimension: 350px width, 140px-174px height.
 * Clean white background with square rounded avatar on left and contact info with blue icons.
 */
export function render(data: TemplateSignatureData): string {
  const themeColor = validateThemeColor(data.themeColor || "#245FD4");
  const fontStack = resolveSafeFontStack(data.fontFamily || "Inter");

  const hasAvatar = hasSafeImage(data.avatarUrl);

  const photoCell = hasAvatar
    ? `<td style="vertical-align:top;padding-right:14px;width:52px;">
        <img src="${escapeHtml(data.avatarUrl!)}" alt="${escapeHtml(data.fullName || "Photo")}" width="52" height="52" style="display:block;border:0;outline:none;text-decoration:none;border-radius:10px;width:52px;height:52px;object-fit:cover;" />
      </td>`
    : "";

  const contactRows: string[] = [];

  if (data.phone?.trim()) {
    const href = safeUrl(telHref(data.phone));
    const iconUrl = emailIconUrl("minimal", themeColor, "phone");
    contactRows.push(
      `<tr>
        <td width="20" style="width:20px;padding:1px 6px 1px 0;vertical-align:middle;">
          <img src="${escapeHtml(iconUrl)}" alt="Phone" width="14" height="14" style="display:block;border:0;outline:none;text-decoration:none;" />
        </td>
        <td style="padding:1px 0;vertical-align:middle;font-family:${fontStack};font-size:10px;line-height:1.3;">
          <a href="${href}" style="color:#64748B;text-decoration:none;">${escapeHtml(data.phone.trim())}</a>
        </td>
      </tr>`
    );
  }

  if (data.email?.trim()) {
    const href = safeUrl(`mailto:${data.email.trim()}`);
    const iconUrl = emailIconUrl("minimal", themeColor, "email");
    contactRows.push(
      `<tr>
        <td width="20" style="width:20px;padding:1px 6px 1px 0;vertical-align:middle;">
          <img src="${escapeHtml(iconUrl)}" alt="Email" width="14" height="14" style="display:block;border:0;outline:none;text-decoration:none;" />
        </td>
        <td style="padding:1px 0;vertical-align:middle;font-family:${fontStack};font-size:10px;line-height:1.3;">
          <a href="${href}" style="color:#64748B;text-decoration:none;">${escapeHtml(data.email.trim())}</a>
        </td>
      </tr>`
    );
  }

  if (data.website?.trim()) {
    const href = safeUrl(normalizeWebsite(data.website));
    const iconUrl = emailIconUrl("minimal", themeColor, "website");
    contactRows.push(
      `<tr>
        <td width="20" style="width:20px;padding:1px 6px 1px 0;vertical-align:middle;">
          <img src="${escapeHtml(iconUrl)}" alt="Website" width="14" height="14" style="display:block;border:0;outline:none;text-decoration:none;" />
        </td>
        <td style="padding:1px 0;vertical-align:middle;font-family:${fontStack};font-size:10px;line-height:1.3;">
          <a href="${href}" target="_blank" style="color:#64748B;text-decoration:none;">${escapeHtml(data.website.trim())}</a>
        </td>
      </tr>`
    );
  }

  const contactsTable = contactRows.length > 0
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${contactRows.join("")}</table>`
    : "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:${fontStack};color:#1E293B;width:100%;max-width:350px;">
    <tr>
      ${photoCell}
      <td style="vertical-align:top;padding-right:8px;">
        <div style="font-family:${fontStack};font-size:14px;font-weight:700;color:#1E293B;line-height:1.2;">
          ${escapeHtml(data.fullName || "")}
        </div>
        <div style="font-family:${fontStack};font-size:11px;font-weight:500;color:#64748B;margin-top:2px;margin-bottom:4px;line-height:1.2;">
          ${escapeHtml(data.jobTitle || "UX/UI Designer")}
        </div>
        ${contactsTable}
      </td>
    </tr>
  </table>`;
}
