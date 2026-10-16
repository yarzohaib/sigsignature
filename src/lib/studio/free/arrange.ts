import { FreeElement, FreeTextElement, FreeDividerElement } from "@/types/studio";
import { snap } from "./geometry";

export interface ArrangeResult {
  elements: FreeElement[];
  canvasHeight: number;
}

/**
 * Repositions existing elements into preset layouts without deleting any element.
 * Produces an overlap-free result for Single, Two Column, and Compact.
 */
export function arrangeElements(
  preset: "single" | "two-column" | "compact",
  elements: FreeElement[],
  canvasWidth = 600
): ArrangeResult {
  if (elements.length === 0) {
    return { elements: [], canvasHeight: 200 };
  }

  // Preserve general order: y then x
  const sorted = [...elements].sort((a, b) => {
    if (Math.abs(a.y - b.y) > 4) return a.y - b.y;
    return a.x - b.x;
  });

  if (preset === "single") {
    return arrangeSingle(sorted, canvasWidth);
  } else if (preset === "two-column") {
    return arrangeTwoColumn(sorted, canvasWidth);
  } else {
    return arrangeCompact(sorted, canvasWidth);
  }
}

/**
 * Single: Everything stacked vertically at x: 0 in order, 8px gaps, media keeps size.
 */
function arrangeSingle(elements: FreeElement[], canvasWidth: number): ArrangeResult {
  let currY = 8;
  const result: FreeElement[] = [];

  for (const el of elements) {
    let w = el.w;
    let h = el.h;
    const x = 0;

    if (el.type === "banner") {
      w = canvasWidth;
      h = Math.min(160, Math.max(40, el.h));
    } else if (el.type === "divider") {
      w = canvasWidth;
      h = Math.max(1, el.thickness || 1);
      (el as FreeDividerElement).orientation = "horizontal";
    } else if (el.type === "text") {
      w = Math.min(canvasWidth, Math.max(el.w, 240));
    } else {
      w = Math.min(canvasWidth, el.w);
    }

    result.push({
      ...el,
      x,
      y: currY,
      w,
      h,
    } as FreeElement);

    currY += h + 8;
  }

  const canvasHeight = Math.max(120, Math.min(480, snap(currY + 16, 8)));
  return { elements: result, canvasHeight };
}

/**
 * Two Column:
 * - Banners full width at the top.
 * - Media (image and logo) stacked in a left column at x: 0 (max width 96).
 * - A vertical divider (existing or auto inserted) at the column gap.
 * - All other elements in a right column starting at x = leftWidth + 20 with width = canvas width - x.
 */
function arrangeTwoColumn(elements: FreeElement[], canvasWidth: number): ArrangeResult {
  const result: FreeElement[] = [];

  const banners = elements.filter((el) => el.type === "banner");
  const media = elements.filter((el) => el.type === "image" || el.type === "logo");
  const dividers = elements.filter((el) => el.type === "divider");
  const others = elements.filter(
    (el) => el.type !== "banner" && el.type !== "image" && el.type !== "logo" && el.type !== "divider"
  );

  let topY = 8;

  // 1. Full width banners at top
  for (const banner of banners) {
    const bannerH = Math.min(140, Math.max(40, banner.h));
    result.push({
      ...banner,
      x: 0,
      y: topY,
      w: canvasWidth,
      h: bannerH,
    });
    topY += bannerH + 8;
  }

  const leftColWidth = media.length > 0 ? 88 : 0;
  let leftY = topY;

  // 2. Left column media
  for (const item of media) {
    const scale = item.w > leftColWidth ? leftColWidth / item.w : 1;
    const w = Math.round(item.w * scale);
    const h = Math.round(item.h * scale);
    const x = Math.max(0, Math.round((leftColWidth - w) / 2));

    result.push({
      ...item,
      x,
      y: leftY,
      w,
      h,
    });
    leftY += h + 8;
  }

  // 3. Right column elements
  const rightX = leftColWidth > 0 ? leftColWidth + 20 : 0;
  const rightWidth = canvasWidth - rightX;
  let rightY = topY;

  for (const item of others) {
    let w = item.w;
    let h = item.h;

    if (item.type === "text") {
      w = rightWidth;
      h = Math.max(18, item.h);
    } else if (item.type === "cta" || item.type === "social") {
      w = Math.min(rightWidth, item.w);
    }

    result.push({
      ...item,
      x: rightX,
      y: rightY,
      w,
      h,
    });
    rightY += h + 6;
  }

  // 4. Vertical divider between columns
  const contentHeight = Math.max(leftY - topY, rightY - topY, 48);
  const dividerX = leftColWidth > 0 ? leftColWidth + 10 : 0;

  if (leftColWidth > 0) {
    const dividerEl = dividers[0];
    if (dividerEl) {
      result.push({
        ...dividerEl,
        type: "divider",
        orientation: "vertical",
        thickness: 1,
        x: dividerX,
        y: topY,
        w: 1,
        h: Math.max(36, contentHeight - 8),
      });
    } else {
      // Auto-insert vertical divider
      result.push({
        id: `vdiv_${Date.now()}`,
        type: "divider",
        orientation: "vertical",
        thickness: 1,
        x: dividerX,
        y: topY,
        w: 1,
        h: Math.max(36, contentHeight - 8),
      });
    }
  }

  // Any extra dividers stacked below
  for (let i = leftColWidth > 0 ? 1 : 0; i < dividers.length; i++) {
    const div = dividers[i];
    const y = Math.max(leftY, rightY) + 8;
    result.push({
      ...div,
      type: "divider",
      orientation: "horizontal",
      thickness: 1,
      x: 0,
      y,
      w: canvasWidth,
      h: 1,
    });
  }

  const maxBottom = result.reduce((max, el) => Math.max(max, el.y + el.h), 0);
  const canvasHeight = Math.max(120, Math.min(480, snap(maxBottom + 20, 8)));
  return { elements: result, canvasHeight };
}

/**
 * Compact:
 * - First image becomes 44x44 at the left, vertically centered to the text stack.
 * - Texts stack to its right with 2px gaps (first text md bold, rest sm).
 * - Social, CTA and divider elements placed in one tidy row below.
 * - Margins reduced. Visibly differs from Two Column.
 */
function arrangeCompact(elements: FreeElement[], canvasWidth: number): ArrangeResult {
  const result: FreeElement[] = [];

  const banners = elements.filter((el) => el.type === "banner");
  const images = elements.filter((el) => el.type === "image" || el.type === "logo");
  const texts = elements.filter((el) => el.type === "text") as FreeTextElement[];
  const ctas = elements.filter((el) => el.type === "cta");
  const socials = elements.filter((el) => el.type === "social");
  const dividers = elements.filter((el) => el.type === "divider");

  let startY = 8;

  // Banners at top if any
  for (const banner of banners) {
    const bannerH = Math.min(100, Math.max(30, banner.h));
    result.push({
      ...banner,
      x: 0,
      y: startY,
      w: canvasWidth,
      h: bannerH,
    });
    startY += bannerH + 6;
  }

  const firstImg = images[0];
  const otherImgs = images.slice(1);

  const textStartX = firstImg ? 54 : 0;
  const textWidth = canvasWidth - textStartX;
  let textStackY = startY;

  // Format texts: first text md bold, rest sm
  const formattedTexts: FreeElement[] = [];
  texts.forEach((txt, idx) => {
    const isFirst = idx === 0;
    const h = isFirst ? 18 : 15;
    formattedTexts.push({
      ...txt,
      size: isFirst ? "md" : "sm",
      bold: isFirst ? true : txt.bold,
      x: textStartX,
      y: textStackY,
      w: textWidth,
      h,
    });
    textStackY += h + 2;
  });

  const textStackHeight = textStackY - startY;

  // First image: 44x44 vertically centered with text stack
  if (firstImg) {
    const imgSize = 44;
    const imgY = Math.max(startY, startY + Math.round((Math.max(imgSize, textStackHeight) - imgSize) / 2));
    result.push({
      ...firstImg,
      x: 0,
      y: imgY,
      w: imgSize,
      h: imgSize,
    });
  }

  result.push(...formattedTexts);

  // Position for bottom row (ctas, socials, dividers, other images)
  let bottomRowY = Math.max(startY + 44, textStackY) + 6;

  // Horizontal divider if available
  if (dividers.length > 0) {
    result.push({
      ...dividers[0],
      type: "divider",
      orientation: "horizontal",
      thickness: 1,
      x: 0,
      y: bottomRowY,
      w: canvasWidth,
      h: 1,
    });
    bottomRowY += 6;
  }

  // Bottom row items in one tidy horizontal line
  let rowX = 0;

  for (const soc of socials) {
    const w = 120;
    const h = 20;
    if (rowX + w <= canvasWidth) {
      result.push({
        ...soc,
        x: rowX,
        y: bottomRowY,
        w,
        h,
      });
      rowX += w + 12;
    }
  }

  for (const cta of ctas) {
    const w = Math.min(120, cta.w);
    const h = 28;
    if (rowX + w <= canvasWidth) {
      result.push({
        ...cta,
        x: rowX,
        y: bottomRowY,
        w,
        h,
      });
      rowX += w + 12;
    }
  }

  for (const img of otherImgs) {
    const w = Math.min(36, img.w);
    const h = Math.min(36, img.h);
    if (rowX + w <= canvasWidth) {
      result.push({
        ...img,
        x: rowX,
        y: bottomRowY,
        w,
        h,
      });
      rowX += w + 8;
    }
  }

  const maxBottom = result.reduce((max, el) => Math.max(max, el.y + el.h), 0);
  const canvasHeight = Math.max(120, Math.min(480, snap(maxBottom + 16, 8)));
  return { elements: result, canvasHeight };
}
