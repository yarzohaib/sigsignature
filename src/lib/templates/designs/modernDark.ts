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
 * Modern Dark Template Renderer (Olivia Rhye).
 * Standard dimension: 350px width, 140px-174px height.
 * High-contrast dark navy card (#0B132B) with glowing purple ring around avatar.
 */
export function render(data: TemplateSignatureData): string {
  const themeColor = validateThemeColor(data.themeColor || "#8B5CF6");
  const fontStack = resolveSafeFontStack(data.fontFamily || "Inter");

  const hasAvatar = hasSafeImage(data.avatarUrl);
  const avatarSrc = hasAvatar ? data.avatarUrl : "/sophia-reynolds.png";

  const photoCell = `<td style="vertical-align:middle;padding-right:16px;width:56px;">
    <div style="width:52px;height:52px;border-radius:50%;border:2px solid ${themeColor};box-shadow:0 0 10px rgba(139,92,246,0.6);display:inline-block;overflow:hidden;background-color:#1E293B;">
      <img src="${escapeHtml(avatarSrc)}" alt="${escapeHtml(data.fullName || "Photo")}" width="52" height="52" style="display:block;border:0;outline:none;text-decoration:none;border-radius:50%;width:52px;height:52px;object-fit:cover;" />
    </div>
  </td>`;

  const contactRows: string[] = [];

  if (data.phone?.trim()) {
    const href = safeUrl(telHref(data.phone));
    const iconUrl = emailIconUrl("minimal", "94A3B8", "phone");
    contactRows.push(
      `<tr>
        <td width="20" style="width:20px;padding:1px 6px 1px 0;vertical-align:middle;">
          <img src="${escapeHtml(iconUrl)}" alt="Phone" width="14" height="14" style="display:block;border:0;outline:none;text-decoration:none;" />
        </td>
        <td style="padding:1px 0;vertical-align:middle;font-family:${fontStack};font-size:10px;line-height:1.3;">
          <a href="${href}" style="color:#94A3B8;text-decoration:none;">${escapeHtml(data.phone.trim())}</a>
        </td>
      </tr>`
    );
  }

  if (data.email?.trim()) {
    const href = safeUrl(`mailto:${data.email.trim()}`);
    const iconUrl = emailIconUrl("minimal", "94A3B8", "email");
    contactRows.push(
      `<tr>
        <td width="20" style="width:20px;padding:1px 6px 1px 0;vertical-align:middle;">
          <img src="${escapeHtml(iconUrl)}" alt="Email" width="14" height="14" style="display:block;border:0;outline:none;text-decoration:none;" />
        </td>
        <td style="padding:1px 0;vertical-align:middle;font-family:${fontStack};font-size:10px;line-height:1.3;">
          <a href="${href}" style="color:#94A3B8;text-decoration:none;">${escapeHtml(data.email.trim())}</a>
        </td>
      </tr>`
    );
  }

  if (data.website?.trim()) {
    const href = safeUrl(normalizeWebsite(data.website));
    const iconUrl = emailIconUrl("minimal", "94A3B8", "website");
    contactRows.push(
      `<tr>
        <td width="20" style="width:20px;padding:1px 6px 1px 0;vertical-align:middle;">
          <img src="${escapeHtml(iconUrl)}" alt="Website" width="14" height="14" style="display:block;border:0;outline:none;text-decoration:none;" />
        </td>
        <td style="padding:1px 0;vertical-align:middle;font-family:${fontStack};font-size:10px;line-height:1.3;">
          <a href="${href}" target="_blank" style="color:#94A3B8;text-decoration:none;">${escapeHtml(data.website.trim())}</a>
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

  const iconStyle = data.socialIconsStyle || "filled";

  const socialLinks = networks
    .map(({ key, label, network }) => {
      const rawUrl = (data.socials as Record<string, string | undefined>)?.[key];
      if (!rawUrl || !rawUrl.trim()) return "";
      const url = safeUrl(normalizeWebsite(rawUrl));
      if (!url) return "";
      const iconUrl = emailIconUrl(iconStyle, "#FFFFFF", network);
      if (iconUrl) {
        return `<a href="${url}" target="_blank" style="text-decoration:none;display:inline-block;margin-right:6px;"><img src="${escapeHtml(iconUrl)}" alt="${escapeHtml(label)}" width="16" height="16" style="display:block;border:0;outline:none;text-decoration:none;" /></a>`;
      }
      return `<a href="${url}" target="_blank" style="font-family:${fontStack};font-size:9px;font-weight:bold;color:#FFFFFF;text-decoration:none;margin-right:6px;">${escapeHtml(label)}</a>`;
    })
    .filter(Boolean);

  const socialsTable = socialLinks.length > 0
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:6px;"><tr><td style="padding:0;vertical-align:middle;">${socialLinks.join("")}</td></tr></table>`
    : "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:${fontStack};color:#FFFFFF;background-color:#0B132B;border-radius:14px;width:100%;max-width:350px;">
    <tr>
      <td style="padding:18px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;">
          <tr>
            ${photoCell}
            <td style="vertical-align:middle;">
              <div style="font-family:${fontStack};font-size:14px;font-weight:700;color:#FFFFFF;line-height:1.2;">
                ${escapeHtml(data.fullName || "Olivia Rhye")}
              </div>
              <div style="font-family:${fontStack};font-size:11px;font-weight:500;color:#94A3B8;margin-top:2px;margin-bottom:4px;line-height:1.2;">
                ${escapeHtml(data.jobTitle || "Product Designer")}
              </div>
              ${contactsTable}
              ${socialsTable}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}
