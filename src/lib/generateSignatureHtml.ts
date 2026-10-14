import { TemplateSignatureData } from "@/types/template";

/**
 * Generates an email-safe, table-based HTML string for the signature.
 * Compatible with Gmail, Outlook (Windows & Mac), Apple Mail, and mobile email clients.
 */
export function generateSignatureHtml(data: TemplateSignatureData): string {
  const primaryColor = data.themeColor || "#245FD4";
  const fontFamily = data.fontFamily || "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  const avatarUrl = data.avatarUrl || "https://sigsignature.com/placeholder-avatar.svg";

  return `<!-- Start SigSignature HTML -->
<table cellpadding="0" cellspacing="0" border="0" style="font-family: ${fontFamily}; color: #1E293B; line-height: 1.4; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
  <tr>
    <td style="padding: 0; vertical-align: top;">
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
        <tr>
          <!-- Column 1: Profile Photo & Socials -->
          <td style="vertical-align: top; padding-right: 16px; text-align: center;">
            <img src="${avatarUrl}" alt="${data.fullName}" width="70" height="70" style="display: block; width: 70px; height: 70px; border-radius: 12px; object-fit: cover; border: 0;" />
            <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 8px; width: 100%;">
              <tr>
                <td style="text-align: center; vertical-align: middle;">
                  ${
                    data.socials.linkedin
                      ? `<a href="${data.socials.linkedin}" target="_blank" style="display: inline-block; margin-right: 4px; text-decoration: none;">
                          <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="16" height="16" style="display: inline-block; vertical-align: middle; border: 0;" />
                        </a>`
                      : ""
                  }
                  ${
                    data.socials.twitter
                      ? `<a href="${data.socials.twitter}" target="_blank" style="display: inline-block; margin-right: 4px; text-decoration: none;">
                          <img src="https://cdn-icons-png.flaticon.com/512/5969/5969020.png" alt="X/Twitter" width="16" height="16" style="display: inline-block; vertical-align: middle; border: 0;" />
                        </a>`
                      : ""
                  }
                  ${
                    data.socials.facebook
                      ? `<a href="${data.socials.facebook}" target="_blank" style="display: inline-block; text-decoration: none;">
                          <img src="https://cdn-icons-png.flaticon.com/512/174/174848.png" alt="Facebook" width="16" height="16" style="display: inline-block; vertical-align: middle; border: 0;" />
                        </a>`
                      : ""
                  }
                </td>
              </tr>
            </table>
          </td>

          <!-- Column 2: Personal Details -->
          <td style="vertical-align: top; padding-right: 20px;">
            <div style="font-size: 15px; font-weight: 700; color: #1E293B; letter-spacing: -0.2px;">${data.fullName}</div>
            <div style="font-size: 12px; font-weight: 500; color: #64748B; margin-top: 1px; margin-bottom: 6px;">${data.jobTitle}</div>
            
            <table cellpadding="0" cellspacing="0" border="0" style="font-size: 11px; color: #64748B;">
              ${
                data.phone
                  ? `<tr>
                      <td style="padding-bottom: 3px; color: ${primaryColor}; font-weight: 600; padding-right: 6px;">&#9742;</td>
                      <td style="padding-bottom: 3px;"><a href="tel:${data.phone}" style="color: #64748B; text-decoration: none;">${data.phone}</a></td>
                    </tr>`
                  : ""
              }
              ${
                data.email
                  ? `<tr>
                      <td style="padding-bottom: 3px; color: ${primaryColor}; font-weight: 600; padding-right: 6px;">&#9993;</td>
                      <td style="padding-bottom: 3px;"><a href="mailto:${data.email}" style="color: #64748B; text-decoration: none;">${data.email}</a></td>
                    </tr>`
                  : ""
              }
              ${
                data.website
                  ? `<tr>
                      <td style="padding-bottom: 3px; color: ${primaryColor}; font-weight: 600; padding-right: 6px;">&#9873;</td>
                      <td style="padding-bottom: 3px;"><a href="https://${data.website.replace(/^https?:\/\//, "")}" target="_blank" style="color: #64748B; text-decoration: none;">${data.website}</a></td>
                    </tr>`
                  : ""
              }
            </table>
          </td>

          <!-- Divider -->
          <td style="vertical-align: middle; padding: 0 16px; border-left: 1px solid #E2E8F0;"></td>

          <!-- Column 3: Company Logo & Branding -->
          <td style="vertical-align: middle; padding-left: 4px; text-align: center;">
            <div style="display: inline-block;">
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 0 auto;">
                <path d="M12 8H26C28.2091 8 30 9.79086 30 12V20C30 22.2091 28.2091 24 26 24H22" stroke="${primaryColor}" stroke-width="4" stroke-linecap="round"/>
                <path d="M26 30H12C9.79086 30 8 28.2091 8 26V18C8 15.7909 9.79086 14 12 14H16" stroke="${primaryColor}" stroke-width="4" stroke-linecap="round"/>
              </svg>
              <div style="font-size: 11px; font-weight: 700; color: #1E293B; margin-top: 6px;">${data.companyName}</div>
              ${data.optional?.tagline ? `<div style="font-size: 9px; color: #94A3B8;">${data.optional.tagline}</div>` : ""}
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<!-- End SigSignature HTML -->`;
}
