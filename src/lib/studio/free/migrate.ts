import {
  StudioSignatureData,
  FreeElement,
  SignatureExtraItem,
} from "@/types/studio";
import { snap, rectsOverlap, findFreeSpot } from "./geometry";

/**
 * Converts a legacy flow-based studio design (with main card and extras) into
 * a free canvas layout with independent, non-overlapping FreeElements.
 *
 * Only converts when data.elements is not defined or empty.
 */
export function migrateFlowToFree(data: StudioSignatureData): StudioSignatureData {
  if (data.elements && data.elements.length > 0) {
    return data;
  }

  const canvasWidth = 600;
  const elements: FreeElement[] = [];

  const hasAvatar =
    data.avatarUrl?.trim() &&
    data.avatarUrl.trim() !== "/daniel-wilson.png" &&
    !data.avatarUrl.trim().endsWith("/daniel-wilson.png");

  const contentStartX = hasAvatar ? 92 : 0;
  const contentWidth = canvasWidth - contentStartX;

  const currentY = 8;

  // 1. Avatar
  if (hasAvatar) {
    elements.push({
      id: `el_avatar_${Date.now()}`,
      type: "image",
      url: data.avatarUrl.trim(),
      x: 0,
      y: currentY,
      w: 72,
      h: 72,
    });
  }

  let textY = currentY;

  // 2. Full Name
  if (data.fullName?.trim()) {
    elements.push({
      id: `el_name_${Date.now()}`,
      type: "text",
      text: data.fullName.trim(),
      size: "lg",
      bold: true,
      align: "left",
      x: contentStartX,
      y: textY,
      w: contentWidth,
      h: 22,
    });
    textY += 24;
  }

  // 3. Job Title and Company
  const titleAndCompany = [data.jobTitle?.trim(), data.companyName?.trim()]
    .filter(Boolean)
    .join(" · ");
  if (titleAndCompany) {
    elements.push({
      id: `el_title_${Date.now()}`,
      type: "text",
      text: titleAndCompany,
      size: "md",
      bold: false,
      align: "left",
      x: contentStartX,
      y: textY,
      w: contentWidth,
      h: 18,
    });
    textY += 20;
  }

  // 4. Phone
  if (data.phone?.trim()) {
    elements.push({
      id: `el_phone_${Date.now()}`,
      type: "text",
      text: data.phone.trim(),
      size: "sm",
      bold: false,
      align: "left",
      x: contentStartX,
      y: textY,
      w: contentWidth,
      h: 16,
    });
    textY += 18;
  }

  // 5. Email
  if (data.email?.trim()) {
    elements.push({
      id: `el_email_${Date.now()}`,
      type: "text",
      text: data.email.trim(),
      size: "sm",
      bold: false,
      align: "left",
      x: contentStartX,
      y: textY,
      w: contentWidth,
      h: 16,
    });
    textY += 18;
  }

  // 6. Website
  if (data.website?.trim()) {
    elements.push({
      id: `el_website_${Date.now()}`,
      type: "text",
      text: data.website.trim(),
      size: "sm",
      bold: false,
      align: "left",
      x: contentStartX,
      y: textY,
      w: contentWidth,
      h: 16,
    });
    textY += 18;
  }

  // 7. Social Links
  const hasSocials = Boolean(
    data.socials?.linkedin?.trim() ||
      data.socials?.twitter?.trim() ||
      data.socials?.facebook?.trim() ||
      data.socials?.instagram?.trim()
  );
  if (hasSocials) {
    elements.push({
      id: `el_social_${Date.now()}`,
      type: "social",
      x: contentStartX,
      y: textY,
      w: 140,
      h: 24,
    });
    textY += 26;
  }

  // 8. Company Logo
  if (data.companyLogoUrl?.trim()) {
    const logoY = Math.max(hasAvatar ? 80 : 0, textY);
    elements.push({
      id: `el_logo_${Date.now()}`,
      type: "logo",
      url: data.companyLogoUrl.trim(),
      x: 0,
      y: logoY,
      w: 90,
      h: 40,
    });
  }

  // Calculate current baseline before extras
  let baselineY = elements.reduce((max, el) => Math.max(max, el.y + el.h), 0);
  if (baselineY > 0) baselineY += 12;

  // 9. Legacy Extras Migration
  const extras = data.extras || [];
  if (extras.length > 0) {
    // Partition into Top Full, Left Column, Right Column, Bottom Full
    const topFull: SignatureExtraItem[] = [];
    const leftCol: SignatureExtraItem[] = [];
    const rightCol: SignatureExtraItem[] = [];
    const bottomFull: SignatureExtraItem[] = [];

    for (const extra of extras) {
      if (extra.type === "banner") {
        if (elements.length === 0) topFull.push(extra);
        else bottomFull.push(extra);
      } else if (extra.column === "left") {
        leftCol.push(extra);
      } else if (extra.column === "right") {
        rightCol.push(extra);
      } else {
        bottomFull.push(extra);
      }
    }

    let extraY = baselineY;

    function convertExtra(item: SignatureExtraItem, x: number, y: number, maxW: number): FreeElement {
      if (item.type === "text") {
        return {
          id: item.id || `el_text_${Date.now()}_${Math.random()}`,
          type: "text",
          text: item.text,
          size: item.size || "md",
          bold: Boolean(item.bold),
          align: item.align || "left",
          x,
          y,
          w: Math.min(maxW, item.width || 240),
          h: item.size === "lg" ? 22 : item.size === "sm" ? 16 : 18,
        };
      }
      if (item.type === "image") {
        return {
          id: item.id || `el_img_${Date.now()}_${Math.random()}`,
          type: "image",
          url: item.url,
          linkUrl: item.linkUrl,
          x,
          y,
          w: Math.min(maxW, item.width || 72),
          h: Math.min(maxW, item.width || 72),
        };
      }
      if (item.type === "divider") {
        const isVert = item.orientation === "vertical";
        return {
          id: item.id || `el_div_${Date.now()}_${Math.random()}`,
          type: "divider",
          orientation: isVert ? "vertical" : "horizontal",
          thickness: item.thickness || 1,
          x,
          y,
          w: isVert ? 1 : Math.min(maxW, item.width || canvasWidth),
          h: isVert ? Math.min(180, item.width || 48) : (item.thickness || 1),
        };
      }
      if (item.type === "cta") {
        return {
          id: item.id || `el_cta_${Date.now()}_${Math.random()}`,
          type: "cta",
          label: item.label,
          url: item.url,
          x,
          y,
          w: Math.min(maxW, item.width || 140),
          h: 36,
        };
      }
      // Banner
      return {
        id: item.id || `el_ban_${Date.now()}_${Math.random()}`,
        type: "banner",
        url: item.imageUrl,
        linkUrl: item.linkUrl,
        x: 0,
        y,
        w: canvasWidth,
        h: 120,
      };
    }

    // Top full items
    for (const item of topFull) {
      const el = convertExtra(item, 0, extraY, canvasWidth);
      elements.push(el);
      extraY += el.h + 12;
    }

    // Left and Right column items
    let leftY = extraY;
    for (const item of leftCol) {
      const el = convertExtra(item, 0, leftY, 96);
      elements.push(el);
      leftY += el.h + 8;
    }

    let rightY = extraY;
    const rX = leftCol.length > 0 ? 116 : 0;
    const rW = canvasWidth - rX;
    for (const item of rightCol) {
      const el = convertExtra(item, rX, rightY, rW);
      elements.push(el);
      rightY += el.h + 8;
    }

    extraY = Math.max(leftY, rightY);

    // Bottom full items
    for (const item of bottomFull) {
      const el = convertExtra(item, 0, extraY, canvasWidth);
      elements.push(el);
      extraY += el.h + 12;
    }
  }

  // Ensure no overlap between any elements
  const nonOverlapping: FreeElement[] = [];
  const currentCanvas = { width: canvasWidth, height: 480 };

  for (const el of elements) {
    let candidate = el;
    let attempts = 0;
    while (nonOverlapping.some((other) => rectsOverlap(candidate, other)) && attempts < 20) {
      const spot = findFreeSpot({ w: candidate.w, h: candidate.h }, nonOverlapping, currentCanvas);
      candidate = { ...candidate, x: spot.x, y: spot.y };
      attempts++;
    }
    nonOverlapping.push(candidate);
  }

  const maxBottom = nonOverlapping.reduce((max, el) => Math.max(max, el.y + el.h), 0);
  const canvasHeight = Math.max(120, Math.min(480, snap(maxBottom + 24, 8)));

  return {
    ...data,
    canvas: {
      width: canvasWidth,
      height: canvasHeight,
    },
    elements: nonOverlapping,
    extras: [],
  };
}
