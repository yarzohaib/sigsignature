import { TemplateSignatureData } from "@/types/template";
import {
  escapeHtml,
  safeUrl,
  normalizeWebsite,
  telHref,
  resolveSafeFontStack,
  validateThemeColor,
  emailIconUrl,
  SocialNetwork,
} from "./shared";

/**
 * Corporate Elegant Template Renderer (Michael Brown).
 * Standard dimension: 350px width, 140px-174px height.
 * Split design: solid royal blue left column with company branding, white right column with executive info.
 */
export function render(data: TemplateSignatureData): string {
  const themeColor = validateThemeColor(data.themeColor || "#163BA4");
  const fontStack = resolveSafeFontStack(data.fontFamily || "Inter");

  const companyName = data.companyName?.trim() || "ACME CORPORATION";

  const contactRows: string[] = [];

  if (data.phone?.trim()) {
    const href = safeUrl(telHref(data.phone));
    contactRows.push(
      `<tr>
        <td style="padding:1px 6px 1px 0;vertical-align:middle;width:14px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${themeColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </td>
        <td style="padding:1px 0;vertical-align:middle;font-family:${fontStack};font-size:10px;line-height:1.3;">
          <a href="${href}" style="color:#64748B;text-decoration:none;">${escapeHtml(data.phone.trim())}</a>
        </td>
      </tr>`
    );
  }

  if (data.email?.trim()) {
    const href = safeUrl(`mailto:${data.email.trim()}`);
    contactRows.push(
      `<tr>
        <td style="padding:1px 6px 1px 0;vertical-align:middle;width:14px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${themeColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        </td>
        <td style="padding:1px 0;vertical-align:middle;font-family:${fontStack};font-size:10px;line-height:1.3;">
          <a href="${href}" style="color:#64748B;text-decoration:none;">${escapeHtml(data.email.trim())}</a>
        </td>
      </tr>`
    );
  }

  if (data.website?.trim()) {
    const href = safeUrl(normalizeWebsite(data.website));
    contactRows.push(
      `<tr>
        <td style="padding:1px 6px 1px 0;vertical-align:middle;width:14px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${themeColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
        </td>
        <td style="padding:1px 0;vertical-align:middle;font-family:${fontStack};font-size:10px;line-height:1.3;">
          <a href="${href}" target="_blank" style="color:#64748B;text-decoration:none;">${escapeHtml(data.website.trim())}</a>
        </td>
      </tr>`
    );
  }

  const contactsTable = contactRows.length > 0
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:4px;">${contactRows.join("")}</table>`
    : "";

  const networks: Array<{ key: string; label: string; network: SocialNetwork }> = [
    { key: "linkedin", label: "LinkedIn", network: "linkedin" },
    { key: "twitter", label: "Twitter", network: "twitter" },
  ];

  const socialLinks = networks
    .map(({ key, label, network }) => {
      const rawUrl = (data.socials as Record<string, string | undefined>)?.[key];
      if (!rawUrl || !rawUrl.trim()) return "";
      const url = safeUrl(normalizeWebsite(rawUrl));
      if (!url) return "";
      const iconUrl = emailIconUrl("circle", themeColor, network);
      if (iconUrl) {
        return `<a href="${url}" target="_blank" style="text-decoration:none;display:inline-block;margin-right:5px;"><img src="${escapeHtml(iconUrl)}" alt="${escapeHtml(label)}" width="16" height="16" style="display:block;border:0;outline:none;text-decoration:none;" /></a>`;
      }
      return `<a href="${url}" target="_blank" style="font-family:${fontStack};font-size:9px;font-weight:bold;color:${themeColor};text-decoration:none;margin-right:6px;">${escapeHtml(label)}</a>`;
    })
    .filter(Boolean);

  const socialsTable = socialLinks.length > 0
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:6px;"><tr><td style="padding:0;vertical-align:middle;">${socialLinks.join("")}</td></tr></table>`
    : "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:${fontStack};color:#1E293B;width:100%;max-width:350px;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
    <tr>
      <td style="width:115px;background-color:${themeColor};vertical-align:middle;text-align:center;padding:16px 12px;border-top-left-radius:12px;border-bottom-left-radius:12px;">
        <div style="font-family:${fontStack};font-size:10px;font-weight:800;color:#FFFFFF;letter-spacing:1.5px;text-transform:uppercase;line-height:1.3;text-align:center;">
          ${escapeHtml(companyName)}
        </div>
      </td>
      <td style="background-color:#FFFFFF;padding:14px 16px;vertical-align:middle;border-top-right-radius:12px;border-bottom-right-radius:12px;border:1px solid #EEF0F4;border-left:0;">
        <div style="font-family:${fontStack};font-size:14px;font-weight:700;color:#1E293B;line-height:1.2;">
          ${escapeHtml(data.fullName || "Michael Brown")}
        </div>
        <div style="font-family:${fontStack};font-size:11px;font-weight:500;color:#64748B;margin-top:2px;line-height:1.2;">
          ${escapeHtml(data.jobTitle || "CEO")}
        </div>
        ${contactsTable}
        ${socialsTable}
      </td>
    </tr>
  </table>`;
}
