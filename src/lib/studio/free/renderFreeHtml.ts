import {
  StudioSignatureData,
  FreeElement,
  FreeTextElement,
  FreeDividerElement,
  FreeCtaElement,
  FreeImageElement,
  FreeLogoElement,
  FreeBannerElement,
} from "@/types/studio";
import {
  escapeHtml,
  safeUrl,
  normalizeWebsite,
  resolveEmailFont,
} from "@/lib/email-core";
import {
  THEME_PRESETS,
  getShapeBorderRadius,
  renderSocialLinksHtml,
} from "../shared";

export interface FreeRenderOptions {
  preview?: boolean;
}

interface RowBand {
  top: number;
  bottom: number;
  elements: FreeElement[];
}

interface ColumnCluster {
  x: number;
  w: number;
  elements: FreeElement[];
}

/**
 * Clusters elements within a horizontal band into non-overlapping vertical columns.
 * Elements whose horizontal spans overlap are grouped into the same column so they
 * can be stacked vertically in a nested table without expanding the outer row.
 */
function partitionIntoColumns(elements: FreeElement[]): ColumnCluster[] {
  if (elements.length === 0) return [];

  // Sort by x ascending, then y ascending
  const sorted = [...elements].sort((a, b) => {
    if (a.x !== b.x) return a.x - b.x;
    return a.y - b.y;
  });

  const columns: ColumnCluster[] = [];

  for (const el of sorted) {
    const lastCol = columns[columns.length - 1];
    if (!lastCol) {
      columns.push({
        x: el.x,
        w: el.w,
        elements: [el],
      });
      continue;
    }

    const lastColRight = lastCol.x + lastCol.w;
    if (el.x < lastColRight) {
      lastCol.elements.push(el);
      const newRight = Math.max(lastColRight, el.x + el.w);
      const newLeft = Math.min(lastCol.x, el.x);
      lastCol.x = newLeft;
      lastCol.w = newRight - newLeft;
    } else {
      columns.push({
        x: el.x,
        w: el.w,
        elements: [el],
      });
    }
  }

  return columns;
}

/**
 * Generates email-safe nested table markup from free canvas elements.
 * Groups elements into horizontal bands and vertical column clusters.
 * Guaranteed to produce row cell widths that sum exactly to canvasWidth.
 */
export function generateFreeHtml(
  data: StudioSignatureData,
  options?: FreeRenderOptions
): string {
  const canvasWidth = data.canvas?.width || 600;
  const canvasHeight = data.canvas?.height || 200;
  const elements = data.elements || [];

  const themeKey = data.design?.theme || "corporate";
  const theme = THEME_PRESETS[themeKey] || THEME_PRESETS.corporate;
  const themeColor = data.themeColor || "#245FD4";
  const shape = data.design?.shape || "rounded";
  const buttonStyle = data.design?.buttonStyle || "solid";
  const fontStack = resolveEmailFont(data.fontFamily || "Inter");
  const cardRadius = getShapeBorderRadius(shape, "card");
  const borderCss =
    theme.border && theme.border !== "transparent"
      ? `border:1px solid ${theme.border};`
      : "border:none;";

  if (elements.length === 0) {
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${canvasWidth}" style="width:${canvasWidth}px;max-width:${canvasWidth}px;border-collapse:separate;border-spacing:0;background-color:${theme.bg};${borderCss}border-radius:${cardRadius};">
  <tr>
    <td style="padding:16px;text-align:center;font-family:${fontStack};font-size:13px;color:${theme.muted};">
      Email Signature
    </td>
  </tr>
</table>`;
  }

  // 1. Sort elements by y then x
  const sorted = [...elements].sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });

  // 2. Merge into row bands by vertical intervals
  const bands: RowBand[] = [];
  for (const el of sorted) {
    const lastBand = bands[bands.length - 1];
    if (!lastBand || el.y >= lastBand.bottom) {
      bands.push({
        top: el.y,
        bottom: el.y + el.h,
        elements: [el],
      });
    } else {
      lastBand.elements.push(el);
      lastBand.bottom = Math.max(lastBand.bottom, el.y + el.h);
    }
  }

  function renderElementHtml(el: FreeElement): string {
    if (el.type === "text") {
      const textEl = el as FreeTextElement;
      const fontSize = textEl.size === "lg" ? 16 : textEl.size === "sm" ? 12 : 14;
      const lineHeight = textEl.size === "lg" ? 22 : textEl.size === "sm" ? 16 : 18;
      const color = textEl.bold ? theme.text : theme.muted;
      const fontWeight = textEl.bold ? "bold" : "normal";
      const align = textEl.align || "left";

      return `<div style="font-family:${fontStack};font-size:${fontSize}px;line-height:${lineHeight}px;font-weight:${fontWeight};color:${color};text-align:${align};width:${el.w}px;max-width:${el.w}px;margin:0;padding:0;word-break:break-word;">
  ${escapeHtml(textEl.text || "")}
</div>`;
    }

    if (el.type === "image" || el.type === "logo" || el.type === "banner") {
      const mediaEl = el as FreeImageElement | FreeLogoElement | FreeBannerElement;
      const rawUrl = mediaEl.url?.trim() || "";
      const isSample =
        rawUrl === "/daniel-wilson.png" || rawUrl.endsWith("/daniel-wilson.png");

      let imgSrc = "";
      if (rawUrl && !isSample) {
        imgSrc = safeUrl(rawUrl);
      } else if (isSample && options?.preview) {
        imgSrc = safeUrl(rawUrl);
      }

      if (!imgSrc) {
        if (options?.preview) {
          return `<div style="width:${el.w}px;height:${el.h}px;background-color:#F1F5F9;border-radius:${getShapeBorderRadius(
            shape,
            "image"
          )};display:block;text-align:center;line-height:${el.h}px;font-family:${fontStack};font-size:10px;color:#94A3B8;">${el.type}</div>`;
        }
        return "";
      }

      const imgRadius = getShapeBorderRadius(shape, "image");
      const fitMode = el.type === "logo" ? "contain" : "cover";
      const imgTag = `<img src="${escapeHtml(
        imgSrc
      )}" alt="${el.type}" width="${el.w}" height="${el.h}" style="display:block;border:0;outline:none;text-decoration:none;width:${el.w}px;height:${el.h}px;border-radius:${imgRadius};object-fit:${fitMode};" />`;

      const link = mediaEl.linkUrl?.trim()
        ? safeUrl(normalizeWebsite(mediaEl.linkUrl))
        : "";

      if (link) {
        return `<a href="${link}" target="_blank" style="text-decoration:none;display:block;">${imgTag}</a>`;
      }
      return imgTag;
    }

    if (el.type === "divider") {
      const divEl = el as FreeDividerElement;
      const dividerColor = data.themeColor || theme.border || "#E2E8F0";
      const thickness = Math.max(1, divEl.thickness || 1);

      if (divEl.orientation === "vertical") {
        return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;height:${el.h}px;width:${thickness}px;">
  <tr>
    <td width="${thickness}" height="${el.h}" bgcolor="${dividerColor}" style="width:${thickness}px;height:${el.h}px;background-color:${dividerColor};font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>
  </tr>
</table>`;
      }

      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${el.w}" style="border-collapse:collapse;width:${el.w}px;">
  <tr>
    <td height="${thickness}" bgcolor="${dividerColor}" style="height:${thickness}px;background-color:${dividerColor};font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>
  </tr>
</table>`;
    }

    if (el.type === "cta") {
      const ctaEl = el as FreeCtaElement;
      const isSolid = buttonStyle !== "outline";
      const btnRadius = getShapeBorderRadius(shape, "button");
      const ctaHref = ctaEl.url?.trim() ? safeUrl(normalizeWebsite(ctaEl.url)) : "#";
      const label = ctaEl.label?.trim() ? escapeHtml(ctaEl.label.trim()) : "Button";

      const btnBg = isSolid ? themeColor : "transparent";
      const btnBorder = isSolid
        ? `background-color:${themeColor};`
        : `background-color:transparent;border:2px solid ${themeColor};`;
      const textColor = isSolid ? "#FFFFFF" : themeColor;

      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${el.w}" style="border-collapse:separate;display:inline-table;width:${el.w}px;">
  <tr>
    <td align="center" bgcolor="${btnBg}" style="${btnBorder}border-radius:${btnRadius};height:${el.h}px;text-align:center;vertical-align:middle;padding:0 12px;">
      <a href="${ctaHref}" target="_blank" style="display:inline-block;font-family:${fontStack};font-size:12px;font-weight:bold;color:${textColor};text-decoration:none;line-height:1.2;">
        ${label}
      </a>
    </td>
  </tr>
</table>`;
    }

    if (el.type === "social") {
      return renderSocialLinksHtml(data, themeColor, fontStack, options?.preview);
    }

    return "";
  }

  // 3. Build HTML table bands with column clustering
  const bandRows: string[] = [];

  for (let i = 0; i < bands.length; i++) {
    const band = bands[i];
    const columns = partitionIntoColumns(band.elements);

    let currX = 0;
    const bandCells: string[] = [];

    for (const col of columns) {
      // Horizontal spacer before column
      if (col.x > currX) {
        const spacerW = col.x - currX;
        bandCells.push(`        <td width="${spacerW}" style="width:${spacerW}px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>`);
        currX = col.x;
      }

      // Sort elements within this column by y ascending
      col.elements.sort((a, b) => a.y - b.y);

      if (col.elements.length === 1) {
        const el = col.elements[0];
        const padTop = Math.max(0, el.y - band.top);
        const padLeft = Math.max(0, el.x - col.x);
        const padStyles: string[] = [];
        if (padTop > 0) padStyles.push(`padding-top:${padTop}px`);
        if (padLeft > 0) padStyles.push(`padding-left:${padLeft}px`);
        const padStyleStr = padStyles.length > 0 ? `${padStyles.join(";")};` : "";
        const content = renderElementHtml(el);

        bandCells.push(`        <td width="${col.w}" valign="top" style="width:${col.w}px;vertical-align:top;${padStyleStr}padding-bottom:0;padding-right:0;margin:0;">
          ${content}
        </td>`);
      } else {
        // Multiple vertically stacked elements inside this column
        const firstEl = col.elements[0];
        const colPadTop = Math.max(0, firstEl.y - band.top);
        const colPadTopStr = colPadTop > 0 ? `padding-top:${colPadTop}px;` : "";

        const nestedRows: string[] = [];
        for (let j = 0; j < col.elements.length; j++) {
          const el = col.elements[j];
          if (j > 0) {
            const prevEl = col.elements[j - 1];
            const gapY = Math.max(0, el.y - (prevEl.y + prevEl.h));
            if (gapY > 0) {
              nestedRows.push(`            <tr>
              <td height="${gapY}" style="height:${gapY}px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>
            </tr>`);
            }
          }

          const padLeft = Math.max(0, el.x - col.x);
          const padLeftStr = padLeft > 0 ? `padding-left:${padLeft}px;` : "";
          const content = renderElementHtml(el);

          nestedRows.push(`            <tr>
              <td valign="top" style="vertical-align:top;${padLeftStr}padding-top:0;padding-bottom:0;padding-right:0;margin:0;">
                ${content}
              </td>
            </tr>`);
        }

        bandCells.push(`        <td width="${col.w}" valign="top" style="width:${col.w}px;vertical-align:top;${colPadTopStr}padding-bottom:0;padding-left:0;padding-right:0;margin:0;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${col.w}" style="width:${col.w}px;border-collapse:collapse;">
${nestedRows.join("\n")}
          </table>
        </td>`);
      }

      currX = col.x + col.w;
    }

    // Trailing spacer after last column in band
    if (currX < canvasWidth) {
      const trailW = canvasWidth - currX;
      bandCells.push(`        <td width="${trailW}" style="width:${trailW}px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>`);
    }

    bandRows.push(`  <tr>
    <td align="left" valign="top" style="padding:0;margin:0;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${canvasWidth}" style="width:${canvasWidth}px;border-collapse:collapse;">
        <tr>
${bandCells.join("\n")}
        </tr>
      </table>
    </td>
  </tr>`);
  }

  // 4. Assemble outer table with canvas height spacers and pill/border styling
  const outerRows: string[] = [];

  // Top spacer before first band
  const topGap = Math.max(0, bands[0].top);
  if (topGap > 0) {
    outerRows.push(`  <tr>
    <td height="${topGap}" style="height:${topGap}px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>
  </tr>`);
  }

  for (let i = 0; i < bands.length; i++) {
    // Spacer row between bands
    if (i > 0) {
      const gap = Math.max(0, bands[i].top - bands[i - 1].bottom);
      if (gap > 0) {
        outerRows.push(`  <tr>
    <td height="${gap}" style="height:${gap}px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>
  </tr>`);
      }
    }

    outerRows.push(bandRows[i]);
  }

  // Bottom spacer after last band
  const lastBandBottom = bands[bands.length - 1].bottom;
  const bottomGap = Math.max(0, canvasHeight - lastBandBottom);
  if (bottomGap > 0) {
    outerRows.push(`  <tr>
    <td height="${bottomGap}" style="height:${bottomGap}px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>
  </tr>`);
  }

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${canvasWidth}" style="width:${canvasWidth}px;max-width:${canvasWidth}px;border-collapse:separate;border-spacing:0;background-color:${theme.bg};${borderCss}border-radius:${cardRadius};">
${outerRows.join("\n")}
</table>`;
}

/**
 * Plain text representation of free canvas design.
 * Elements ordered by y then x, one per line, with links in parentheses.
 */
export function generateFreePlainText(data: StudioSignatureData): string {
  const elements = data.elements || [];
  if (elements.length === 0) return "";

  const sorted = [...elements].sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });

  const lines: string[] = [];

  for (const el of sorted) {
    if (el.type === "text") {
      const text = (el as FreeTextElement).text?.trim();
      if (text) lines.push(text);
    } else if (el.type === "cta") {
      const cta = el as FreeCtaElement;
      if (cta.label?.trim() && cta.url?.trim()) {
        lines.push(`${cta.label.trim()} (${cta.url.trim()})`);
      } else if (cta.label?.trim()) {
        lines.push(cta.label.trim());
      }
    } else if (el.type === "image" || el.type === "logo" || el.type === "banner") {
      const media = el as FreeImageElement | FreeLogoElement | FreeBannerElement;
      if (media.linkUrl?.trim()) {
        lines.push(`(${media.linkUrl.trim()})`);
      }
    } else if (el.type === "social") {
      const s = data.socials;
      if (s?.linkedin?.trim()) lines.push(`LinkedIn: ${s.linkedin.trim()}`);
      if (s?.twitter?.trim()) lines.push(`Twitter: ${s.twitter.trim()}`);
      if (s?.facebook?.trim()) lines.push(`Facebook: ${s.facebook.trim()}`);
      if (s?.instagram?.trim()) lines.push(`Instagram: ${s.instagram.trim()}`);
    }
  }

  return lines.join("\n");
}
