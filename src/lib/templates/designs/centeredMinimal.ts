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
 * "Centered Minimal" Template Renderer.
 * Everything centered: 64px round photo, bold name, grey title, 40px accent divider,
 * centered contact lines with accent labels, social icons row, and small grey caps company name/logo at bottom.
 */
export function render(data: TemplateSignatureData): string {
  const themeColor = validateThemeColor(data.themeColor);
  const fontStack = resolveSafeFontStack(data.fontFamily || "Inter");

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

  // Photo 64px round (collapses if missing)
  const photoHtml = hasAvatar
    ? `<tr>
        <td align="center" style="padding-bottom:10px;text-align:center;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
            <tr>
              <td align="center" style="padding:0;text-align:center;">
                <img src="${escapeHtml(data.avatarUrl)}" alt="${escapeHtml(data.fullName || "Photo")}" width="64" height="64" style="display:block;border:0;outline:none;text-decoration:none;border-radius:50%;margin:0 auto;" />
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    : "";

  // Contact items centered with small accent labels
  const contactParts: string[] = [];

  if (data.phone?.trim()) {
    const href = safeUrl(telHref(data.phone));
    contactParts.push(
      `<span style="display:inline-block;white-space:nowrap;"><strong style="color:${themeColor};font-family:${fontStack};font-size:10.5px;">T</strong>&nbsp;<a href="${href}" style="color:#64748B;text-decoration:none;font-family:${fontStack};font-size:11px;">${escapeHtml(data.phone.trim())}</a></span>`
    );
  }

  if (data.email?.trim()) {
    const href = safeUrl(`mailto:${data.email.trim()}`);
    contactParts.push(
      `<span style="display:inline-block;white-space:nowrap;"><strong style="color:${themeColor};font-family:${fontStack};font-size:10.5px;">E</strong>&nbsp;<a href="${href}" style="color:#64748B;text-decoration:none;font-family:${fontStack};font-size:11px;">${escapeHtml(data.email.trim())}</a></span>`
    );
  }

  if (data.website?.trim()) {
    const href = safeUrl(normalizeWebsite(data.website));
    const label = escapeHtml(data.website.trim().replace(/^https?:\/\//i, ""));
    contactParts.push(
      `<span style="display:inline-block;white-space:nowrap;"><strong style="color:${themeColor};font-family:${fontStack};font-size:10.5px;">W</strong>&nbsp;<a href="${href}" target="_blank" style="color:#64748B;text-decoration:none;font-family:${fontStack};font-size:11px;">${label}</a></span>`
    );
  }

  const contactHtml = contactParts.length > 0
    ? `<tr>
        <td align="center" style="padding-bottom:6px;text-align:center;">
          <div style="font-family:${fontStack};font-size:11px;color:#64748B;line-height:1.5;">
            ${contactParts.join(`<span style="color:#CBD5E1;padding:0 6px;">&bull;</span>`)}
          </div>
        </td>
      </tr>`
    : "";

  const addressHtml = data.optional?.address?.trim()
    ? `<tr>
        <td align="center" style="padding-bottom:6px;text-align:center;">
          <div style="font-family:${fontStack};font-size:10.5px;color:#94A3B8;line-height:1.4;">
            <strong style="color:${themeColor};font-size:10px;">A</strong>&nbsp;${escapeHtml(data.optional.address.trim())}
          </div>
        </td>
      </tr>`
    : "";

  // Social icon row centered
  const rawSocials = renderSocialLinks(data, themeColor, fontStack);
  const socialRowHtml = rawSocials
    ? `<tr>
        <td align="center" style="padding-top:2px;padding-bottom:8px;text-align:center;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
            <tr>
              <td align="center" style="text-align:center;">
                ${rawSocials}
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    : "";

  // Company name or logo at the bottom in small grey caps
  let companyOrLogoHtml = "";
  if (hasLogo) {
    companyOrLogoHtml = `<tr>
      <td align="center" style="padding-top:4px;padding-bottom:4px;text-align:center;">
        <img src="${escapeHtml(data.companyLogoUrl!)}" alt="${escapeHtml(data.companyName || "Logo")}" width="75" height="26" style="display:block;border:0;outline:none;text-decoration:none;margin:0 auto;max-width:90px;height:auto;" />
      </td>
    </tr>`;
  } else if (data.companyName?.trim()) {
    companyOrLogoHtml = `<tr>
      <td align="center" style="padding-top:4px;padding-bottom:4px;text-align:center;">
        <div style="font-family:${fontStack};font-size:10.5px;font-weight:600;color:#94A3B8;letter-spacing:1.5px;text-transform:uppercase;">
          ${escapeHtml(data.companyName.trim())}
        </div>
      </td>
    </tr>`;
  }

  // Optional tagline
  const taglineHtml = data.optional?.tagline?.trim()
    ? `<tr>
        <td align="center" style="padding-top:2px;text-align:center;">
          <div style="font-family:${fontStack};font-size:10px;font-style:italic;color:#94A3B8;">
            ${escapeHtml(data.optional.tagline.trim())}
          </div>
        </td>
      </tr>`
    : "";

  // Optional disclaimer
  const disclaimerHtml = data.optional?.disclaimer?.trim()
    ? `<tr>
        <td align="center" style="padding-top:8px;text-align:center;">
          <div style="font-family:${fontStack};font-size:9px;color:#94A3B8;line-height:1.3;max-width:440px;margin:0 auto;">
            ${escapeHtml(data.optional.disclaimer.trim())}
          </div>
        </td>
      </tr>`
    : "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:${fontStack};color:#1E293B;line-height:1.4;max-width:600px;margin:0 auto;width:100%;">
  <tr>
    <td align="center" style="padding:4px 0;text-align:center;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;text-align:center;">
        <!-- Round photo 64px -->
        ${photoHtml}
        <!-- Name bold 16px -->
        <tr>
          <td align="center" style="padding:0;text-align:center;font-family:${fontStack};font-size:16px;font-weight:bold;color:#1E293B;line-height:1.2;">
            ${escapeHtml(data.fullName || "")}
          </td>
        </tr>
        <!-- Title grey -->
        <tr>
          <td align="center" style="padding-top:2px;padding-bottom:2px;text-align:center;font-family:${fontStack};font-size:12px;font-weight:500;color:#64748B;line-height:1.3;">
            ${escapeHtml(data.jobTitle || "")}
          </td>
        </tr>
        <!-- Short 40px accent divider -->
        <tr>
          <td align="center" style="padding-top:6px;padding-bottom:8px;text-align:center;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="40" style="margin:0 auto;width:40px;">
              <tr>
                <td height="2" bgcolor="${themeColor}" style="height:2px;background-color:${themeColor};font-size:1px;line-height:2px;">&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Contact lines centered -->
        ${contactHtml}
        ${addressHtml}
        <!-- Social icon row centered -->
        ${socialRowHtml}
        <!-- Company name or logo at bottom in small grey caps -->
        ${companyOrLogoHtml}
        ${taglineHtml}
        ${disclaimerHtml}
      </table>
    </td>
  </tr>
</table>`;
}
