"use client";

import Image from "next/image";
import { SavedSignature } from "@/types/signature";
import {
  StudioSignatureData,
  FreeElement,
  FreeTextElement,
  FreeImageElement,
  FreeLogoElement,
  FreeBannerElement,
  FreeCtaElement,
  StudioShape,
} from "@/types/studio";
import { THEME_PRESETS, getShapeBorderRadius } from "@/lib/studio/shared";
import { resolveEmailFont, getSocialIconSvgDataUrl, SocialNetwork } from "@/lib/email-core";

function MiniStudioElementView({
  element,
  data,
  theme,
  shape,
  themeColor,
  fontStack,
}: {
  element: FreeElement;
  data: StudioSignatureData;
  theme: { bg: string; text: string; muted: string; border: string };
  shape: StudioShape;
  themeColor: string;
  fontStack: string;
}) {
  const imgRadius = getShapeBorderRadius(shape, "image");

  if (element.type === "text") {
    const textEl = element as FreeTextElement;
    const fontSize = textEl.size === "lg" ? 16 : textEl.size === "sm" ? 12 : 14;
    const lineHeight = textEl.size === "lg" ? 22 : textEl.size === "sm" ? 16 : 18;
    const color = textEl.bold ? theme.text : theme.muted;

    return (
      <div
        style={{
          position: "absolute",
          left: `${element.x}px`,
          top: `${element.y}px`,
          width: `${element.w}px`,
          height: `${element.h}px`,
          fontFamily: fontStack,
          fontSize: `${fontSize}px`,
          lineHeight: `${lineHeight}px`,
          fontWeight: textEl.bold ? 700 : 400,
          color,
          textAlign: textEl.align || "left",
          overflow: "hidden",
          wordBreak: "break-word",
        }}
      >
        {textEl.text}
      </div>
    );
  }

  if (element.type === "image" || element.type === "logo" || element.type === "banner") {
    const mediaEl = element as FreeImageElement | FreeLogoElement | FreeBannerElement;
    if (!mediaEl.url) return null;

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={mediaEl.url}
        alt={element.type}
        style={{
          position: "absolute",
          left: `${element.x}px`,
          top: `${element.y}px`,
          width: `${element.w}px`,
          height: `${element.h}px`,
          borderRadius: imgRadius,
          objectFit: element.type === "logo" ? "contain" : "cover",
          display: "block",
        }}
      />
    );
  }

  if (element.type === "divider") {
    const divColor = data.themeColor || theme.border || "#E2E8F0";
    return (
      <div
        style={{
          position: "absolute",
          left: `${element.x}px`,
          top: `${element.y}px`,
          width: `${element.w}px`,
          height: `${element.h}px`,
          backgroundColor: divColor,
        }}
      />
    );
  }

  if (element.type === "cta") {
    const ctaEl = element as FreeCtaElement;
    const isSolid = data.design?.buttonStyle !== "outline";
    const btnRadius = getShapeBorderRadius(shape, "button");

    return (
      <div
        style={{
          position: "absolute",
          left: `${element.x}px`,
          top: `${element.y}px`,
          width: `${element.w}px`,
          height: `${element.h}px`,
          backgroundColor: isSolid ? themeColor : "transparent",
          border: isSolid ? "none" : `2px solid ${themeColor}`,
          borderRadius: btnRadius,
          color: isSolid ? "#FFFFFF" : themeColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fontStack,
          fontSize: "12px",
          fontWeight: "bold",
          overflow: "hidden",
        }}
      >
        {ctaEl.label || "Button"}
      </div>
    );
  }

  if (element.type === "social") {
    const networks: SocialNetwork[] = ["linkedin", "twitter", "facebook", "instagram"];
    const style = data.socialIconsStyle || "filled";
    const activeIcons = networks
      .map((net) => {
        const url = data.socials?.[net]?.trim();
        if (!url) return null;
        return { net, iconUrl: getSocialIconSvgDataUrl(style, themeColor, net) };
      })
      .filter((x): x is { net: SocialNetwork; iconUrl: string } => Boolean(x));

    return (
      <div
        style={{
          position: "absolute",
          left: `${element.x}px`,
          top: `${element.y}px`,
          width: `${element.w}px`,
          height: `${element.h}px`,
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        {activeIcons.map(({ net, iconUrl }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={net}
            src={iconUrl}
            alt={net}
            style={{ width: "20px", height: "20px", display: "block" }}
          />
        ))}
      </div>
    );
  }

  return null;
}

function StudioMiniPreview({ data }: { data: StudioSignatureData }) {
  const canvasWidth = data.canvas?.width || 600;
  const canvasHeight = data.canvas?.height || 200;
  const elements = data.elements || [];

  const themeKey = data.design?.theme || "corporate";
  const theme = THEME_PRESETS[themeKey] || THEME_PRESETS.corporate;
  const shape = data.design?.shape || "rounded";
  const cardRadius = getShapeBorderRadius(shape, "card");
  const themeColor = data.themeColor || "#245FD4";
  const fontStack = resolveEmailFont(data.fontFamily || "Inter");

  // Sized to fit comfortably inside card preview container
  const previewW = 280;
  const scale = previewW / canvasWidth;
  const previewH = Math.max(48, Math.round(canvasHeight * scale));

  return (
    <div className="w-full flex items-center justify-center py-1">
      <div
        style={{
          width: `${previewW}px`,
          height: `${previewH}px`,
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: theme.bg,
            border: theme.border && theme.border !== "transparent" ? `1px solid ${theme.border}` : "none",
            borderRadius: cardRadius,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {elements.map((el) => (
            <MiniStudioElementView
              key={el.id}
              element={el}
              data={data}
              theme={theme}
              shape={shape}
              themeColor={themeColor}
              fontStack={fontStack}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function formatRelativeTime(isoDate: string): string {
  const timestamp = new Date(isoDate).getTime();
  if (isNaN(timestamp)) {
    return "Updated recently";
  }
  const diffInSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));

  if (diffInSeconds < 60) {
    return "Updated just now";
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Updated ${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Updated ${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `Updated ${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `Updated ${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
  }
  const diffInYears = Math.floor(diffInDays / 365);
  return `Updated ${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`;
}

interface SignatureCardProps {
  signature: SavedSignature;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onExport: (id: string) => void;
  onDelete: (signature: SavedSignature) => void;
}

export default function SignatureCard({
  signature,
  onEdit,
  onDuplicate,
  onExport,
  onDelete,
}: SignatureCardProps) {
  const isStudioFree =
    signature.kind === "studio" &&
    Boolean(signature.data.elements && signature.data.elements.length > 0);

  const firstText =
    signature.kind === "studio" && signature.data.elements
      ? (signature.data.elements.find((el) => el.type === "text") as { text?: string } | undefined)?.text
      : undefined;
  const name = signature.name || signature.data.fullName || firstText || "My Signature";
  const role = signature.data.jobTitle || "";
  const email = signature.data.email || "";
  const phone = signature.data.phone || "";
  const company = signature.data.companyName || "";
  const companyLogoUrl = signature.data.companyLogoUrl || "";
  const tagline = signature.data.optional?.tagline || "";
  const website = signature.data.website || "";
  const avatar = signature.data.avatarUrl || "";
  const themeColor = signature.data.themeColor || "#245FD4";
  const relativeTime = formatRelativeTime(signature.updatedAt);

  const hasCompanySection = Boolean(companyLogoUrl || company);

  const socials = signature.data.socials;
  const hasSocials = Boolean(
    socials?.linkedin?.trim() ||
      socials?.twitter?.trim() ||
      socials?.facebook?.trim() ||
      socials?.instagram?.trim()
  );

  return (
    <div className="group flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white shadow-xs transition-all hover:shadow-md hover:border-slate-300">
      {/* Top Preview Section */}
      <div className="relative overflow-hidden rounded-t-xl bg-[#F8FAFC] p-3 sm:p-3.5 min-h-[148px] flex items-center justify-center">
        {isStudioFree ? (
          <StudioMiniPreview data={signature.data} />
        ) : (
          <div className="w-full rounded-lg bg-white p-3 border border-slate-100 shadow-2xs">
            <div className="flex items-center justify-between gap-3">
              {/* Left: Avatar + Socials */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className="relative h-11 w-11 overflow-hidden rounded-lg bg-slate-100 border border-slate-200 shadow-2xs">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={name}
                      width={44}
                      height={44}
                      className="h-full w-full object-cover"
                      unoptimized={avatar.startsWith("data:")}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-blue-50 text-[11px] font-bold text-[#245FD4]">
                      {name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                {/* Social icons if present */}
                {hasSocials && (
                  <div className="flex items-center gap-0.5">
                    {socials?.linkedin && (
                      <span className="flex h-3 w-3 items-center justify-center rounded-xs bg-[#0077B5] text-[6px] font-bold text-white">
                        in
                      </span>
                    )}
                    {socials?.twitter && (
                      <span className="flex h-3 w-3 items-center justify-center rounded-xs bg-[#000000] text-[6px] font-bold text-white">
                        𝕏
                      </span>
                    )}
                    {socials?.facebook && (
                      <span className="flex h-3 w-3 items-center justify-center rounded-xs bg-[#1877F2] text-[6px] font-bold text-white">
                        f
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Middle: Details */}
              <div className="min-w-0 flex-1 space-y-0.5">
                <h5 className="text-[12px] font-bold text-[#1E293B] leading-tight truncate">
                  {name}
                </h5>
                {role && (
                  <p className="text-[10px] font-medium text-[#64748B] leading-tight truncate">
                    {role}
                  </p>
                )}
                <div className="pt-0.5 space-y-0.5 text-[8.5px] text-[#64748B]">
                  {phone && (
                    <div className="flex items-center gap-1 truncate">
                      <span style={{ color: themeColor }} className="font-bold">
                        &#9742;
                      </span>
                      <span className="truncate">{phone}</span>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-center gap-1 truncate">
                      <span style={{ color: themeColor }} className="font-bold">
                        &#9993;
                      </span>
                      <span className="truncate">{email}</span>
                    </div>
                  )}
                  {website && (
                    <div className="flex items-center gap-1 truncate">
                      <span style={{ color: themeColor }} className="font-bold">
                        &#9873;
                      </span>
                      <span className="truncate">{website}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Company - only rendered if companyLogoUrl or company exists */}
              {hasCompanySection && (
                <>
                  <div className="h-12 w-px bg-slate-200 shrink-0" />
                  <div className="flex flex-col items-center justify-center text-center shrink-0 w-[72px]">
                    {companyLogoUrl ? (
                      <Image
                        src={companyLogoUrl}
                        alt={company || "Logo"}
                        width={28}
                        height={28}
                        className="h-7 w-7 object-contain"
                        unoptimized={companyLogoUrl.startsWith("data:")}
                      />
                    ) : null}
                    {company ? (
                      <span className="mt-1 text-[8.5px] font-bold text-[#1E293B] leading-tight truncate max-w-full">
                        {company}
                      </span>
                    ) : null}
                    {tagline && (
                      <span className="text-[7.5px] text-[#94A3B8] leading-tight truncate max-w-full">
                        {tagline}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Middle Info Row */}
      <div className="flex items-center justify-between p-3.5 pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <h4
              className="text-[14px] font-bold text-[#1E293B]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {signature.name}
            </h4>
            <span
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                signature.kind === "studio"
                  ? "bg-[#EFF6FF] text-[#245FD4] border border-[#BFDBFE]"
                  : "bg-slate-100 text-[#475569] border border-slate-200"
              }`}
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              {signature.kind === "studio" ? "Studio" : "Template"}
            </span>
          </div>
          <p
            className="text-[12px] text-[#94A3B8]"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            {relativeTime}
          </p>
        </div>

        {/* More options 3 dots button */}
        <button
          type="button"
          onClick={() => onEdit(signature.id)}
          className="rounded-lg p-1.5 text-[#94A3B8] transition hover:bg-slate-100 hover:text-[#64748B]"
          aria-label="More options"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Bottom Action Buttons Row */}
      <div className="border-t border-[#F1F5F9] px-3.5 py-2.5 flex items-center justify-between text-[13px]">
        {/* Edit */}
        <button
          type="button"
          onClick={() => onEdit(signature.id)}
          className="flex items-center gap-1.5 font-medium text-[#2563EB] transition hover:text-[#1D4ED8]"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <span>Edit</span>
        </button>

        {/* Duplicate */}
        <button
          type="button"
          onClick={() => onDuplicate(signature.id)}
          className="flex items-center gap-1.5 font-medium text-[#64748B] transition hover:text-[#1E293B]"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>Duplicate</span>
        </button>

        {/* Copy */}
        <button
          type="button"
          onClick={() => onExport(signature.id)}
          className="flex items-center gap-1.5 font-medium text-[#64748B] transition hover:text-[#1E293B]"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          </svg>
          <span>Copy</span>
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete(signature)}
          className="flex items-center gap-1.5 font-medium text-[#DC2626] transition hover:text-[#B91C1C]"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
