import { TemplateSignatureData } from "@/types/template";
import {
  escapeHtml,
  safeUrl,
  normalizeWebsite,
  telHref,
  resolveSafeFontStack,
  validateThemeColor,
} from "./shared";

/**
 * "Clean Line" Template Renderer.
 * Minimalist design with a 3px accent bar, inline contacts with pipe separators,
 * accent text socials, and hairline footer. No photo.
 */
export function render(data: TemplateSignatureData): string {
  const themeColor = validateThemeColor(data.themeColor);
  const fontStack = resolveSafeFontStack(data.fontFamily || "Arial");

  // Contact items on ONE line separated by a thin grey vertical bar: phone | email | website
  const contactParts: string[] = [];

  if (data.phone?.trim()) {
    const href = safeUrl(telHref(data.phone));
    contactParts.push(
      `<a href="${href}" style="color:#64748B;text-decoration:none;font-family:${fontStack};font-size:11px;">${escapeHtml(data.phone.trim())}</a>`
    );
  }

  if (data.email?.trim()) {
    const href = safeUrl(`mailto:${data.email.trim()}`);
    contactParts.push(
      `<a href="${href}" style="color:#64748B;text-decoration:none;font-family:${fontStack};font-size:11px;">${escapeHtml(data.email.trim())}</a>`
    );
  }

  if (data.website?.trim()) {
    const href = safeUrl(normalizeWebsite(data.website));
    const label = escapeHtml(data.website.trim().replace(/^https?:\/\//i, ""));
    contactParts.push(
      `<a href="${href}" target="_blank" style="color:#64748B;text-decoration:none;font-family:${fontStack};font-size:11px;">${label}</a>`
    );
  }

  const contactLine = contactParts.length > 0
    ? contactParts.join(`<span style="color:#CBD5E1;padding:0 7px;font-size:11px;">|</span>`)
    : "";

  // Socials as plain text links in the accent color
  const socialNetworks: Array<{ key: string; label: string }> = [
    { key: "linkedin", label: "LinkedIn" },
    { key: "twitter", label: "X" },
    { key: "facebook", label: "Facebook" },
    { key: "instagram", label: "Instagram" },
    { key: "github", label: "GitHub" },
    { key: "youtube", label: "YouTube" },
    { key: "website", label: "Web" },
  ];

  const socialParts: string[] = [];
  for (const { key, label } of socialNetworks) {
    const raw = (data.socials as Record<string, string | undefined>)?.[key];
    if (raw?.trim()) {
      const url = safeUrl(normalizeWebsite(raw));
      if (url) {
        socialParts.push(
          `<a href="${url}" target="_blank" style="color:${themeColor};font-family:${fontStack};font-size:11px;font-weight:bold;text-decoration:none;">${escapeHtml(label)}</a>`
        );
      }
    }
  }

  const socialLine = socialParts.length > 0
    ? socialParts.join(`<span style="color:#CBD5E1;padding:0 6px;font-size:10px;">&bull;</span>`)
    : "";

  // Optional footer items (tagline, address, disclaimer)
  const footerItems: string[] = [];
  if (data.optional?.tagline?.trim()) {
    footerItems.push(
      `<div style="font-family:${fontStack};font-size:10px;font-style:italic;color:#64748B;margin-bottom:2px;">${escapeHtml(data.optional.tagline.trim())}</div>`
    );
  }
  if (data.optional?.address?.trim()) {
    footerItems.push(
      `<div style="font-family:${fontStack};font-size:10px;color:#94A3B8;margin-bottom:2px;">${escapeHtml(data.optional.address.trim())}</div>`
    );
  }
  if (data.optional?.disclaimer?.trim()) {
    footerItems.push(
      `<div style="font-family:${fontStack};font-size:9px;color:#94A3B8;line-height:1.3;">${escapeHtml(data.optional.disclaimer.trim())}</div>`
    );
  }

  const footerSection = footerItems.length > 0
    ? `<tr>
        <td style="padding-top:8px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;width:100%;">
            <tr>
              <td style="border-top:1px solid #E2E8F0;padding-top:6px;">
                ${footerItems.join("")}
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    : "";

  // Logo (optional)
  const hasLogo = Boolean(
    data.companyLogoUrl &&
      data.companyLogoUrl.trim().length > 0 &&
      !data.companyLogoUrl.trim().startsWith("javascript:") &&
      !data.companyLogoUrl.trim().startsWith("data:")
  );

  const logoRow = hasLogo
    ? `<tr><td style="padding-bottom:6px;"><img src="${escapeHtml(data.companyLogoUrl!)}" alt="${escapeHtml(data.companyName || "Logo")}" width="75" height="26" style="display:block;border:0;outline:none;text-decoration:none;max-width:90px;height:auto;" /></td></tr>`
    : "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:${fontStack};color:#1E293B;line-height:1.4;max-width:600px;">
  <tr>
    <!-- 3px Accent Bar on the Left -->
    <td width="3" bgcolor="${themeColor}" style="width:3px;background-color:${themeColor};font-size:1px;line-height:1px;">&nbsp;</td>
    <!-- Spacer -->
    <td width="14" style="width:14px;font-size:1px;line-height:1px;">&nbsp;</td>
    <!-- Main Content Area -->
    <td style="vertical-align:top;padding:0;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;">
        ${logoRow}
        <!-- Name bold 16px -->
        <tr>
          <td style="padding:0;font-family:${fontStack};font-size:16px;font-weight:bold;color:#1E293B;line-height:1.2;">
            ${escapeHtml(data.fullName || "")}
          </td>
        </tr>
        <!-- Job title in accent color -->
        <tr>
          <td style="padding-top:2px;font-family:${fontStack};font-size:12px;font-weight:600;color:${themeColor};line-height:1.3;">
            ${escapeHtml(data.jobTitle || "")}
          </td>
        </tr>
        <!-- Company name small caps grey -->
        <tr>
          <td style="padding-top:2px;padding-bottom:6px;font-family:${fontStack};font-size:11px;font-weight:600;color:#64748B;letter-spacing:1px;text-transform:uppercase;">
            ${escapeHtml(data.companyName || "")}
          </td>
        </tr>
        <!-- Contact line: phone | email | website -->
        ${
          contactLine
            ? `<tr>
          <td style="padding-bottom:5px;font-family:${fontStack};font-size:11px;color:#64748B;">
            ${contactLine}
          </td>
        </tr>`
            : ""
        }
        <!-- Socials plain text links -->
        ${
          socialLine
            ? `<tr>
          <td style="padding-bottom:4px;font-family:${fontStack};font-size:11px;">
            ${socialLine}
          </td>
        </tr>`
            : ""
        }
        <!-- Tagline, address and disclaimer separated by a hairline -->
        ${footerSection}
      </table>
    </td>
  </tr>
</table>`;
}
