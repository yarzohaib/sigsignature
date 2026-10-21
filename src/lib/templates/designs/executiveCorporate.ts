import { TemplateSignatureData } from "@/types/template";
import {
  escapeHtml,
  safeUrl,
  normalizeWebsite,
  telHref,
  resolveEmailFont,
  validateThemeColor,
  parseInstagramField,
  hasSafeImage,
} from "./shared";

/**
 * Executive Corporate / Corporate Card Template Renderer.
 * Preserved byte-for-byte compatible with existing signatures.
 */
export function render(data: TemplateSignatureData): string {
  const themeColor = validateThemeColor(data.themeColor);
  const fontStack = resolveEmailFont(data.fontFamily);

  const hasAvatar = hasSafeImage(data.avatarUrl);
  const hasLogo = hasSafeImage(data.companyLogoUrl);

    const compWords = (data.companyName || "Sterling & Co.").trim().split(/\s+/).filter(Boolean);
    const monogram = compWords.length > 1
      ? (compWords[0][0] + (compWords[1] === "&" && compWords[2] ? `&${compWords[2][0]}` : compWords[1][0])).toUpperCase()
      : (compWords[0] ? compWords[0].slice(0, 2).toUpperCase() : "SC");

    const leftLogoContent = hasLogo
      ? `<img src="${escapeHtml(data.companyLogoUrl!)}" width="220" style="display:block;width:220px;max-width:220px;height:auto;border-radius:6px;" alt="${escapeHtml(data.companyName || "Logo")}" border="0" />`
      : `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" height="205" style="width:100%;height:205px;text-align:center;">
          <tr>
            <td align="center" valign="middle" style="padding:16px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 12px auto;">
                <tr>
                  <td align="center" valign="middle" width="56" height="56" style="width:56px;height:56px;border:1.5px solid ${themeColor};border-radius:12px;text-align:center;background-color:#2B3033;">
                    <span style="font-family:${fontStack};font-size:20px;font-weight:700;color:${themeColor};line-height:56px;display:block;letter-spacing:1px;">${escapeHtml(monogram)}</span>
                  </td>
                </tr>
              </table>
              <div style="font-family:${fontStack};font-size:15px;font-weight:700;letter-spacing:2.5px;color:#FFFFFF;text-transform:uppercase;line-height:1.3;text-align:center;">
                ${escapeHtml(data.companyName || "STERLING & CO.")}
              </div>
              <div style="font-family:${fontStack};font-size:9px;font-weight:500;letter-spacing:2px;color:${themeColor};text-transform:uppercase;margin-top:5px;text-align:center;">
                EXECUTIVE
              </div>
            </td>
          </tr>
        </table>`;

    const nameContent = hasAvatar
      ? `<img src="${escapeHtml(data.avatarUrl)}" alt="${escapeHtml(data.fullName || "Name")}" width="220" class="name-image" style="display:block;border:0;width:220px;max-width:220px;height:auto;" />`
      : `<div style="font-family:${fontStack};font-size:22px;font-weight:700;color:#353A3D;letter-spacing:0.5px;line-height:1.2;padding-bottom:2px;">${escapeHtml(data.fullName || "")}</div>`;

    const contactItems: string[] = [];
    if (data.phone?.trim()) {
      contactItems.push(`<tr>
  <td align="center" valign="middle" width="24" height="24" style="width:24px;height:24px;line-height:0;font-size:1px;">
    <img src="https://res.cloudinary.com/df80crgrw/image/upload/v1782294741/Frame_1984078845_qh5qcj.png" width="24" height="24" alt="" role="presentation" style="display:block;border:0;outline:none;" />
  </td>
  <td width="12" style="width:12px;font-size:1px;line-height:1px;">&nbsp;</td>
  <td valign="middle" class="contact-text" style="font-family:${fontStack};font-size:13px;color:#353A3D;font-weight:400;">
    <strong style="color:#353A3D;font-family:${fontStack};font-size:13px;font-weight:400;text-decoration:none;">
      <a href="${safeUrl(telHref(data.phone))}" style="color:#353A3D;text-decoration:none;font-family:${fontStack};font-size:13px;font-weight:400;">${escapeHtml(data.phone.trim())}</a>
    </strong>
  </td>
</tr>`);
    }

    if (data.email?.trim()) {
      contactItems.push(`<tr>
  <td align="center" valign="middle" width="24" height="24" style="width:24px;height:24px;line-height:0;font-size:1px;">
    <img src="https://res.cloudinary.com/df80crgrw/image/upload/v1782294740/Frame_1984078844_ylgqyt.png" width="24" height="24" alt="" role="presentation" style="display:block;border:0;outline:none;" />
  </td>
  <td width="12" style="width:12px;font-size:1px;line-height:1px;">&nbsp;</td>
  <td valign="middle" class="contact-text" style="font-family:${fontStack};font-size:13px;color:#353A3D;font-weight:400;">
    <strong style="color:#353A3D;font-family:${fontStack};font-size:13px;font-weight:400;text-decoration:none;">
      <a href="${safeUrl(`mailto:${data.email.trim()}`)}" style="color:#353A3D;text-decoration:none;font-family:${fontStack};font-size:13px;font-weight:400;">${escapeHtml(data.email.trim())}</a>
    </strong>
  </td>
</tr>`);
    }

    if (data.website?.trim()) {
      contactItems.push(`<tr>
  <td align="center" valign="middle" width="24" height="24" style="width:24px;height:24px;line-height:0;font-size:1px;">
    <img src="https://res.cloudinary.com/df80crgrw/image/upload/v1782294740/Frame_1984078843_levghf.png" width="24" height="24" alt="" role="presentation" style="display:block;border:0;outline:none;" />
  </td>
  <td width="12" style="width:12px;font-size:1px;line-height:1px;">&nbsp;</td>
  <td valign="middle" class="contact-text" style="font-family:${fontStack};font-size:13px;color:#353A3D;font-weight:400;">
    <strong style="color:#353A3D;font-family:${fontStack};font-size:13px;font-weight:400;text-decoration:none;">
      <a href="${safeUrl(normalizeWebsite(data.website))}" target="_blank" style="color:#353A3D;text-decoration:none;font-family:${fontStack};font-size:13px;font-weight:400;">${escapeHtml(data.website.trim().replace(/^https?:\/\//i, ""))}</a>
    </strong>
  </td>
</tr>`);
    }

    if (data.optional?.address?.trim()) {
      contactItems.push(`<tr>
  <td align="center" valign="middle" width="24" height="24" style="width:24px;height:24px;line-height:0;font-size:1px;background-color:#353A3D;border-radius:50%;">
    <span style="font-family:${fontStack};font-size:10px;font-weight:bold;color:${themeColor};line-height:24px;display:block;text-align:center;">A</span>
  </td>
  <td width="12" style="width:12px;font-size:1px;line-height:1px;">&nbsp;</td>
  <td valign="middle" class="contact-text" style="font-family:${fontStack};font-size:13px;color:#353A3D;font-weight:400;">
    ${escapeHtml(data.optional.address.trim())}
  </td>
</tr>`);
    }

    const contactRowsCombined = contactItems.join(
      '\n<tr><td colspan="3" height="8" style="height:8px;font-size:1px;line-height:1px;">&nbsp;</td></tr>\n'
    );

    const taglineText = data.optional?.tagline?.trim();
    const taglineRow = taglineText
      ? `<tr>
  <td colspan="3" width="317" align="left" class="tagline-text tagline-wrapper" style="width:317px;font-family:${fontStack};font-size:11px;font-weight:500;color:#686C6E;letter-spacing:1px;text-transform:uppercase;padding-top:14px;padding-bottom:2px;padding-left:22px;line-height:1.2;text-align:left;">
    ${escapeHtml(taglineText)}
  </td>
</tr>`
      : "";

    const disclaimerText = data.optional?.disclaimer?.trim();
    const parsedInstagram = parseInstagramField(data.socials?.instagram);

    const socialLinks: string[] = [];
    if (parsedInstagram) {
      socialLinks.push(
        `<strong style="color:#FFFFFF;font-family:${fontStack};font-size:11px;font-weight:400;text-decoration:none;"><a href="${safeUrl(parsedInstagram.url)}" target="_blank" style="color:#E1E3E4;text-decoration:none;font-weight:400;">${escapeHtml(parsedInstagram.handle)}</a></strong>`
      );
    }
    if (data.socials?.linkedin?.trim() && !parsedInstagram) {
      socialLinks.push(
        `<strong style="color:#FFFFFF;font-family:${fontStack};font-size:11px;font-weight:400;text-decoration:none;"><a href="${safeUrl(normalizeWebsite(data.socials.linkedin))}" target="_blank" style="color:#E1E3E4;text-decoration:none;font-weight:400;">LinkedIn</a></strong>`
      );
    }

    const socialsCombined = socialLinks.join(" &nbsp;&bull;&nbsp; ");
    let footerContent = "";
    if (disclaimerText && socialsCombined) {
      footerContent = `${escapeHtml(disclaimerText)} &nbsp;&nbsp;<span style="color:${themeColor};font-weight:400;">|</span>&nbsp;&nbsp; ${socialsCombined}`;
    } else if (disclaimerText) {
      footerContent = escapeHtml(disclaimerText);
    } else if (socialsCombined) {
      footerContent = socialsCombined;
    }

    const footerBarRow = footerContent
      ? `<tr>
  <td style="padding:0 16px 16px 16px;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#353A3D" style="width:100%;background-image:linear-gradient(#353A3D,#353A3D);border-radius:6px;border-collapse:collapse;background-clip:padding-box;background-color:#353A3D;">
      <tr>
        <td align="center" valign="middle" class="footer-cell" style="font-family:${fontStack};font-size:11px;color:#E1E3E4;padding:10px 16px;line-height:1.4;letter-spacing:0.5px;text-transform:none;font-weight:400;">
          ${footerContent}
        </td>
      </tr>
    </table>
  </td>
</tr>`
      : "";

    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#F6F5F4;margin:0 auto;width:100%;border-collapse:collapse;border-radius:12px;overflow:hidden;font-family:${fontStack};mso-table-lspace:0pt;mso-table-rspace:0pt;">
  <tr>
    <td style="padding:16px 20px 4px 20px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border-collapse:collapse;">
        <tr>
          <!-- Left Logo Card -->
          <td rowspan="4" align="center" valign="top" width="220" height="205" bgcolor="#353A3D" class="logo-card-cell" style="width:220px;height:205px;background-color:#353A3D;background-image:linear-gradient(#353A3D,#353A3D);border-radius:8px;padding:3px;box-sizing:border-box;">
            ${leftLogoContent}
          </td>
          <!-- Spacer 1 -->
          <td rowspan="4" width="16" class="spacer-cell" style="width:16px;font-size:1px;line-height:1px;">&nbsp;</td>
          <!-- Vertical Divider -->
          <td valign="top" width="2" class="divider-cell" style="width:1.5px;padding-top:2px;">
            <table cellpadding="0" cellspacing="0" border="0" width="2" style="width:1.5px;height:205px;">
              <tr>
                <td height="205" bgcolor="${themeColor}" style="font-size:1px;line-height:1px;height:205px;background-color:${themeColor};">&nbsp;</td>
              </tr>
            </table>
          </td>
          <!-- Spacer 2 -->
          <td width="16" class="spacer-cell" style="width:16px;font-size:1px;line-height:1px;">&nbsp;</td>
          <!-- Right Content Area -->
          <td valign="top" width="299" class="content-cell" style="width:299px;padding-top:4px;box-sizing:border-box;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border-collapse:collapse;">
              <!-- Name script / Name text -->
              <tr>
                <td style="padding:0;margin:0;">
                  ${nameContent}
                </td>
              </tr>
              <!-- Role / Job Title -->
              <tr>
                <td class="role-text" style="font-family:${fontStack};font-size:12px;font-weight:500;color:#353A3D;letter-spacing:2px;text-transform:uppercase;padding-bottom:0;line-height:1.2;white-space:nowrap;padding-top:6px;">
                  ${escapeHtml(data.jobTitle || "")}
                </td>
              </tr>
              <!-- Short Gold Divider -->
              <tr>
                <td style="padding-top:10px;padding-bottom:12px;">
                  <table cellpadding="0" cellspacing="0" border="0" width="60" style="width:60px;">
                    <tr>
                      <td height="1" bgcolor="${themeColor}" style="font-size:1px;line-height:1.5px;height:1.5px;background-color:${themeColor};"></td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Contact Methods -->
              <tr>
                <td style="padding-bottom:6px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                    ${contactRowsCombined}
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td colspan="3" height="12" style="height:12px;font-size:1px;line-height:1px;">&nbsp;</td>
        </tr>
        <tr>
          <td colspan="3" width="317" height="1" bgcolor="${themeColor}" class="full-divider" style="width:317px;font-size:1px;line-height:1.5px;height:1.5px;background-color:${themeColor};"></td>
        </tr>
        ${taglineRow}
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:0 24px;height:12px;font-size:1px;line-height:1px;">&nbsp;</td>
  </tr>
  ${footerBarRow}
</table>`;
  }
