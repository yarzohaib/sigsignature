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
  SocialNetwork,
} from "./shared";

/**
 * Pastel Creative Template Renderer (Sophia Clark).
 * Standard dimension: 350px width, 140px-174px height.
 * Clean white background with round portrait, lavender title, and circular pink social icons.
 */
export function render(data: TemplateSignatureData): string {
  const themeColor = validateThemeColor(data.themeColor || "#EC4899");
  const fontStack = resolveSafeFontStack(data.fontFamily || "Inter");

  const hasAvatar = hasSafeImage(data.avatarUrl);

  const photoCell = hasAvatar
    ? `<td style="vertical-align:middle;padding-right:14px;width:52px;">
        <img src="${escapeHtml(data.avatarUrl!)}" alt="${escapeHtml(data.fullName || "Photo")}" width="52" height="52" style="display:block;border:0;outline:none;text-decoration:none;border-radius:50%;width:52px;height:52px;object-fit:cover;" />
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

  if (data.optional?.address?.trim()) {
    const iconUrl = emailIconUrl("minimal", themeColor, "address");
    contactRows.push(
      `<tr>
        <td width="20" style="width:20px;padding:1px 6px 1px 0;vertical-align:middle;">
          <img src="${escapeHtml(iconUrl)}" alt="Address" width="14" height="14" style="display:block;border:0;outline:none;text-decoration:none;" />
        </td>
        <td style="padding:1px 0;vertical-align:middle;font-family:${fontStack};font-size:10px;line-height:1.3;color:#64748B;">
          ${escapeHtml(data.optional.address.trim())}
        </td>
      </tr>`
    );
  }

  const contactsTable = contactRows.length > 0
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${contactRows.join("")}</table>`
    : "";

  const networks: Array<{ key: string; label: string; network: SocialNetwork }> = [
    { key: "linkedin", label: "LinkedIn", network: "linkedin" },
    { key: "twitter", label: "Twitter", network: "twitter" },
    { key: "facebook", label: "Facebook", network: "facebook" },
    { key: "instagram", label: "Instagram", network: "instagram" },
    { key: "github", label: "GitHub", network: "github" },
  ];

  const iconStyle = data.socialIconsStyle || "circle";

  const socialLinks = networks
    .map(({ key, label, network }) => {
      const rawUrl = (data.socials as Record<string, string | undefined>)?.[key];
      if (!rawUrl || !rawUrl.trim()) return "";
      const url = safeUrl(normalizeWebsite(rawUrl));
      if (!url) return "";
      const iconUrl = emailIconUrl(iconStyle, themeColor, network);
      if (iconUrl) {
        return `<a href="${url}" target="_blank" style="text-decoration:none;display:inline-block;margin-left:5px;"><img src="${escapeHtml(iconUrl)}" alt="${escapeHtml(label)}" width="18" height="18" style="display:block;border:0;outline:none;text-decoration:none;" /></a>`;
      }
      return `<a href="${url}" target="_blank" style="font-family:${fontStack};font-size:9px;font-weight:bold;color:${themeColor};text-decoration:none;margin-left:5px;">${escapeHtml(label)}</a>`;
    })
    .filter(Boolean);

  const socialsTable = socialLinks.length > 0
    ? `<div style="text-align:right;">${socialLinks.join("")}</div>`
    : "";

  const hasLogo = hasSafeImage(data.companyLogoUrl);
  const logoCell = hasLogo
    ? `<td style="vertical-align:middle;padding-left:10px;text-align:right;width:60px;">
        <img src="${escapeHtml(data.companyLogoUrl!)}" alt="${escapeHtml(data.companyName || "Logo")}" width="52" height="auto" style="display:block;border:0;outline:none;max-width:52px;max-height:52px;object-fit:contain;margin-left:auto;" />
      </td>`
    : "";

  const taglineRow = data.optional?.tagline?.trim()
    ? `<div style="font-family:${fontStack};font-size:10px;font-style:italic;color:#64748B;margin-top:3px;line-height:1.2;">
        ${escapeHtml(data.optional.tagline.trim())}
      </div>`
    : "";

  const disclaimerRow = data.optional?.disclaimer?.trim()
    ? `<tr>
        <td colspan="4" style="padding-top:8px;">
          <div style="font-family:${fontStack};font-size:9px;color:#94A3B8;line-height:1.3;border-top:1px solid #F1F5F9;padding-top:6px;">
            ${escapeHtml(data.optional.disclaimer.trim())}
          </div>
        </td>
      </tr>`
    : "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:${fontStack};color:#1E293B;width:100%;max-width:420px;">
    <tr>
      ${photoCell}
      <td style="vertical-align:middle;padding-right:10px;">
        <div style="font-family:${fontStack};font-size:14px;font-weight:700;color:#1E293B;line-height:1.2;">
          ${escapeHtml(data.fullName || "")}
        </div>
        <div style="font-family:${fontStack};font-size:11px;font-weight:600;color:#8B5CF6;margin-top:2px;margin-bottom:3px;line-height:1.2;">
          ${escapeHtml(data.jobTitle || "HR Manager")}${data.companyName?.trim() ? ` <span style="color:#64748B;font-weight:400;">| ${escapeHtml(data.companyName.trim())}</span>` : ""}
        </div>
        ${taglineRow}
        ${contactsTable}
      </td>
      ${logoCell}
      <td style="vertical-align:bottom;text-align:right;padding-bottom:2px;min-width:60px;">
        ${socialsTable}
      </td>
    </tr>
    ${disclaimerRow}
  </table>`;
}
