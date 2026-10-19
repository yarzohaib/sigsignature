import { TemplateSignatureData } from "@/types/template";
import { SIGNATURE_COLOR_SWATCHES } from "@/lib/signatureConstants";
import {
  escapeHtml,
  safeUrl,
  normalizeWebsite,
  telHref,
  resolveEmailFont,
  emailIconUrl,
  SocialNetwork,
} from "@/lib/email-core";

/**
 * Builds social icons table cell or fallback text links.
 */
function renderSocialLinks(
  data: TemplateSignatureData,
  themeColor: string,
  fontStack: string
): string {
  const networks: Array<{
    key: string;
    label: string;
    network: SocialNetwork;
  }> = [
    { key: "linkedin", label: "LinkedIn", network: "linkedin" },
    { key: "twitter", label: "Twitter", network: "twitter" },
    { key: "facebook", label: "Facebook", network: "facebook" },
    { key: "instagram", label: "Instagram", network: "instagram" },
    { key: "github", label: "GitHub", network: "github" },
    { key: "youtube", label: "YouTube", network: "youtube" },
    { key: "website", label: "Website", network: "website" },
  ];

  const items = networks
    .map(({ key, label, network }) => {
      const rawUrl = (data.socials as Record<string, string | undefined>)?.[key];
      if (!rawUrl || !rawUrl.trim()) return "";
      const url = safeUrl(normalizeWebsite(rawUrl));
      if (!url) return "";

      const iconUrl = emailIconUrl(data.socialIconsStyle || "filled", themeColor, network);
      if (iconUrl) {
        return `<a href="${url}" target="_blank" style="text-decoration:none;display:inline-block;margin-right:6px;"><img src="${escapeHtml(iconUrl)}" alt="${escapeHtml(label)}" width="20" height="20" style="display:block;border:0;outline:none;text-decoration:none;" /></a>`;
      }
      return `<a href="${url}" target="_blank" style="font-family:${fontStack};font-size:11px;font-weight:bold;color:${themeColor};text-decoration:none;margin-right:8px;">${escapeHtml(label)}</a>`;
    })
    .filter(Boolean);

  if (items.length === 0) return "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr><td style="padding:0;vertical-align:middle;">${items.join("")}</td></tr></table>`;
}

/**
 * Builds contact rows (phone, email, website, address) with bold theme-colored letter labels (T, E, W, A).
 */
function renderContactRows(
  data: TemplateSignatureData,
  themeColor: string,
  fontStack: string
): string {
  const rows: string[] = [];

  if (data.phone?.trim()) {
    const href = safeUrl(telHref(data.phone));
    rows.push(
      `<tr><td style="padding:1px 6px 1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:${themeColor};">T</td><td style="padding:1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;"><a href="${href}" style="color:#64748B;text-decoration:none;">${escapeHtml(data.phone.trim())}</a></td></tr>`
    );
  }

  if (data.email?.trim()) {
    const href = safeUrl(`mailto:${data.email.trim()}`);
    rows.push(
      `<tr><td style="padding:1px 6px 1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:${themeColor};">E</td><td style="padding:1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;"><a href="${href}" style="color:#64748B;text-decoration:none;">${escapeHtml(data.email.trim())}</a></td></tr>`
    );
  }

  if (data.website?.trim()) {
    const href = safeUrl(normalizeWebsite(data.website));
    rows.push(
      `<tr><td style="padding:1px 6px 1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:${themeColor};">W</td><td style="padding:1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;"><a href="${href}" target="_blank" style="color:#64748B;text-decoration:none;">${escapeHtml(data.website.trim())}</a></td></tr>`
    );
  }

  if (data.optional?.address?.trim()) {
    rows.push(
      `<tr><td style="padding:1px 6px 1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;font-weight:bold;color:${themeColor};">A</td><td style="padding:1px 0;vertical-align:middle;font-family:${fontStack};font-size:11px;color:#64748B;">${escapeHtml(data.optional.address.trim())}</td></tr>`
    );
  }

  if (rows.length === 0) return "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${rows.join("")}</table>`;
}

/**
 * Builds the compact horizontal contact row.
 */
function renderCompactContactItems(
  data: TemplateSignatureData,
  themeColor: string,
  fontStack: string
): string {
  const items: string[] = [];

  if (data.phone?.trim()) {
    const href = safeUrl(telHref(data.phone));
    items.push(
      `<span style="margin-right:12px;display:inline-block;"><strong style="color:${themeColor};font-family:${fontStack};font-size:10px;">T</strong>&nbsp;<a href="${href}" style="color:#64748B;text-decoration:none;font-family:${fontStack};font-size:10px;">${escapeHtml(data.phone.trim())}</a></span>`
    );
  }

  if (data.email?.trim()) {
    const href = safeUrl(`mailto:${data.email.trim()}`);
    items.push(
      `<span style="margin-right:12px;display:inline-block;"><strong style="color:${themeColor};font-family:${fontStack};font-size:10px;">E</strong>&nbsp;<a href="${href}" style="color:#64748B;text-decoration:none;font-family:${fontStack};font-size:10px;">${escapeHtml(data.email.trim())}</a></span>`
    );
  }

  if (data.website?.trim()) {
    const href = safeUrl(normalizeWebsite(data.website));
    items.push(
      `<span style="margin-right:12px;display:inline-block;"><strong style="color:${themeColor};font-family:${fontStack};font-size:10px;">W</strong>&nbsp;<a href="${href}" target="_blank" style="color:#64748B;text-decoration:none;font-family:${fontStack};font-size:10px;">${escapeHtml(data.website.trim())}</a></span>`
    );
  }

  if (data.optional?.address?.trim()) {
    items.push(
      `<span style="display:inline-block;"><strong style="color:${themeColor};font-family:${fontStack};font-size:10px;">A</strong>&nbsp;<span style="color:#64748B;font-family:${fontStack};font-size:10px;">${escapeHtml(data.optional.address.trim())}</span></span>`
    );
  }

  return items.join("");
}

/**
 * Safely parses an Instagram input (handle, URL, or domain/path) into a normalized handle and URL.
 */
function parseInstagramField(raw?: string): { handle: string; url: string } | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let username = "";
  if (trimmed.startsWith("@")) {
    username = trimmed.slice(1).trim();
  } else if (!trimmed.includes("/") && !trimmed.includes(".")) {
    username = trimmed;
  } else {
    const cleaned = trimmed
      .replace(/^https?:\/\//i, "")
      .replace(/^(?:www\.)?instagram\.com\/?/i, "")
      .replace(/\/.*$/, "");
    username = cleaned.replace(/^@/, "").trim();
  }

  if (!username) return null;

  return {
    handle: `@${username}`,
    url: `https://instagram.com/${username}`,
  };
}

/**
 * Generates an email-safe, table-based HTML string for the template signature.
 * Strictly uses nested tables with presentation roles, inline styling, and no CSS variables or SVGs.
 * Output is an HTML fragment without <html>, <head>, <body>, or comments.
 */
export function generateTemplateHtml(data: TemplateSignatureData): string {
  const isColorValid =
    Boolean(data.themeColor) &&
    (/^#[0-9A-Fa-f]{3,8}$/.test(data.themeColor) ||
      SIGNATURE_COLOR_SWATCHES.some(
        (s) => s.toLowerCase() === (data.themeColor || "").toLowerCase()
      ));
  const themeColor = isColorValid ? data.themeColor : "#245FD4";
  const fontStack = resolveEmailFont(data.fontFamily);

  const hasAvatar = Boolean(data.avatarUrl && data.avatarUrl.trim().length > 0 && !data.avatarUrl.trim().startsWith("javascript:"));
  const hasLogo = Boolean(data.companyLogoUrl && data.companyLogoUrl.trim().length > 0 && !data.companyLogoUrl.trim().startsWith("javascript:"));

  const socialLinksHtml = renderSocialLinks(data, themeColor, fontStack);
  const contactRowsHtml = renderContactRows(data, themeColor, fontStack);

  const layout = data.layout || "two-column";
  const isCorporateCard =
    layout === "corporate-card" ||
    data.templateId === "executive-corporate" ||
    data.templateId === "preston-corporate";

  // Layout 4: Corporate Card
  if (isCorporateCard) {
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
      <a href="${telHref(data.phone)}" style="color:#353A3D;text-decoration:none;font-family:${fontStack};font-size:13px;font-weight:400;">${escapeHtml(data.phone.trim())}</a>
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

  // Layout 1: Two Column
  if (layout === "two-column") {
    let photoCell = "";
    if (hasAvatar) {
      photoCell = `<td style="vertical-align:top;padding-right:16px;text-align:center;">
        <img src="${escapeHtml(data.avatarUrl)}" alt="${escapeHtml(data.fullName || "Photo")}" width="64" height="64" style="display:block;border:0;outline:none;text-decoration:none;border-radius:12px;" />
        ${socialLinksHtml ? `<div style="margin-top:8px;">${socialLinksHtml}</div>` : ""}
      </td>`;
    }

    const companyLogoHtml = hasLogo
      ? `<img src="${escapeHtml(data.companyLogoUrl!)}" alt="${escapeHtml(data.companyName || "Logo")}" width="80" height="36" style="display:block;border:0;outline:none;text-decoration:none;margin:0 auto 6px auto;max-width:95px;height:auto;" />`
      : "";

    const companyTaglineHtml = data.optional?.tagline?.trim()
      ? `<div style="font-family:${fontStack};font-size:9px;color:#94A3B8;margin-top:2px;line-height:1.2;">${escapeHtml(data.optional.tagline.trim())}</div>`
      : "";

    const companyCell = `<td style="vertical-align:middle;padding-left:16px;border-left:1px solid #E2E8F0;text-align:center;">
      <div style="display:inline-block;text-align:center;">
        ${companyLogoHtml}
        <div style="font-family:${fontStack};font-size:11px;font-weight:bold;color:#1E293B;line-height:1.2;">${escapeHtml(data.companyName || "")}</div>
        ${companyTaglineHtml}
      </div>
    </td>`;

    const disclaimerHtml = data.optional?.disclaimer?.trim()
      ? `<tr><td colspan="${hasAvatar ? 3 : 2}" style="padding-top:10px;border-top:1px solid #E2E8F0;font-family:${fontStack};font-size:9px;color:#94A3B8;line-height:1.3;">${escapeHtml(data.optional.disclaimer.trim())}</td></tr>`
      : "";

    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:${fontStack};color:#1E293B;line-height:1.4;">
  <tr>
    <td style="padding:0;vertical-align:top;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          ${photoCell}
          <td style="vertical-align:top;padding-right:16px;">
            <div style="font-family:${fontStack};font-size:15px;font-weight:bold;color:#1E293B;line-height:1.2;">${escapeHtml(data.fullName || "")}</div>
            <div style="font-family:${fontStack};font-size:12px;font-weight:500;color:#64748B;margin-top:2px;margin-bottom:6px;line-height:1.3;">${escapeHtml(data.jobTitle || "")}</div>
            ${contactRowsHtml}
            ${!hasAvatar && socialLinksHtml ? `<div style="margin-top:8px;">${socialLinksHtml}</div>` : ""}
          </td>
          ${companyCell}
        </tr>
        ${disclaimerHtml}
      </table>
    </td>
  </tr>
</table>`;
  }

  // Layout 2: Horizontal
  if (layout === "horizontal") {
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

  // Layout 3: Compact
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

/**
 * Returns a simple plain-text version of the signature data:
 * name, job title, company, phone, email, website, address, tagline, disclaimer (one per line, skipping empty values).
 */
export function generateTemplatePlainText(data: TemplateSignatureData): string {
  const lines: string[] = [];

  if (data.fullName?.trim()) {
    lines.push(data.fullName.trim());
  }
  if (data.jobTitle?.trim()) {
    lines.push(data.jobTitle.trim());
  }
  if (data.companyName?.trim()) {
    lines.push(data.companyName.trim());
  }
  if (data.phone?.trim()) {
    lines.push(data.phone.trim());
  }
  if (data.email?.trim()) {
    lines.push(data.email.trim());
  }
  if (data.website?.trim()) {
    lines.push(data.website.trim());
  }
  if (data.optional?.address?.trim()) {
    lines.push(data.optional.address.trim());
  }
  if (data.optional?.tagline?.trim()) {
    lines.push(data.optional.tagline.trim());
  }
  if (data.optional?.disclaimer?.trim()) {
    lines.push(data.optional.disclaimer.trim());
  }

  return lines.join("\n");
}
