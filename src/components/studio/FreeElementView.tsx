"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  FreeElement,
  FreeTextElement,
  FreeImageElement,
  FreeLogoElement,
  FreeBannerElement,
  FreeDividerElement,
  FreeCtaElement,
  FreeSocialElement,
  StudioSignatureData,
} from "@/types/studio";
import {
  resolveEmailFont,
  getSocialIconSvgDataUrl,
  emailIconUrl,
  SocialNetwork,
} from "@/lib/email-core";
import {
  THEME_PRESETS,
  getShapeBorderRadius,
  getSocialIconSize,
  measureRenderedTextHeight,
} from "@/lib/studio/shared";
import { validateSocialUrl, TeamMemberSocialPlatform } from "@/lib/team/socials";
import {
  isValidEmail,
  sanitizePhone,
  isValidPhone,
  isValidWebUrl,
  MAX_LENGTH,
} from "@/lib/validation";

export type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

interface FreeElementViewProps {
  element: FreeElement;
  data: StudioSignatureData;
  isSelected: boolean;
  isColliding: boolean;
  isDragging: boolean;
  isResizing: boolean;
  onSelect: (id: string, e: React.PointerEvent | React.MouseEvent) => void;
  onStartDrag: (id: string, e: React.PointerEvent) => void;
  onStartResize: (id: string, handle: ResizeHandle, e: React.PointerEvent) => void;
  onTextChange: (id: string, text: string, height?: number) => void;
  onTextGrowth?: (id: string, deltaH: number) => void;
  domRef?: (node: HTMLDivElement | null) => void;
  showEditorOverlays?: boolean;
  hideLabels?: boolean;
  isEditingSavedSignature?: boolean;
  isReadOnly?: boolean;
  onToast?: (msg: string, isError?: boolean) => void;
  onSplitLines?: (id: string, text?: string) => void;
}

const HANDLE_CURSORS: Record<ResizeHandle, string> = {
  nw: "nwse-resize",
  n: "ns-resize",
  ne: "nesw-resize",
  e: "ew-resize",
  se: "nwse-resize",
  s: "ns-resize",
  sw: "nesw-resize",
  w: "ew-resize",
};

const HANDLE_POSITIONS: Record<ResizeHandle, React.CSSProperties> = {
  nw: { left: 0, top: 0, transform: "translate(-50%, -50%)" },
  n: { left: "50%", top: 0, transform: "translate(-50%, -50%)" },
  ne: { left: "100%", top: 0, transform: "translate(-50%, -50%)" },
  e: { left: "100%", top: "50%", transform: "translate(-50%, -50%)" },
  se: { left: "100%", top: "100%", transform: "translate(-50%, -50%)" },
  s: { left: "50%", top: "100%", transform: "translate(-50%, -50%)" },
  sw: { left: 0, top: "100%", transform: "translate(-50%, -50%)" },
  w: { left: 0, top: "50%", transform: "translate(-50%, -50%)" },
};

export default function FreeElementView({
  element,
  data,
  isSelected,
  isColliding,
  isDragging,
  isResizing,
  onSelect,
  onStartDrag,
  onStartResize,
  onTextChange,
  onTextGrowth,
  domRef,
  showEditorOverlays = true,
  hideLabels = false,
  isEditingSavedSignature = false,
  isReadOnly = false,
  onToast,
  onSplitLines,
}: FreeElementViewProps) {
  const [isEditingText, setIsEditingText] = useState(false);
  const currentElementText = element.type === "text" ? element.text : "";
  const [prevElementText, setPrevElementText] = useState(currentElementText);
  const [localText, setLocalText] = useState(currentElementText);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const localContainerRef = useRef<HTMLDivElement | null>(null);

  if (currentElementText !== prevElementText && !isEditingText) {
    setPrevElementText(currentElementText);
    setLocalText(currentElementText);
  }

  // Auto focus and select text when entering inline edit
  useEffect(() => {
    if (isEditingText && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditingText]);

  const themeKey = data.design?.theme || "corporate";
  const theme = THEME_PRESETS[themeKey] || THEME_PRESETS.corporate;
  const themeColor = data.themeColor || "#245FD4";
  const shape = element.shape || data.design?.shape || "rounded";
  const buttonStyle = data.design?.buttonStyle || "solid";

  // Determine handles to show
  let activeHandles: ResizeHandle[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
  const isIndividualSocial =
    element.type === "social" &&
    "platform" in element &&
    Boolean((element as { platform?: string }).platform);

  if (element.type === "image" || element.type === "logo" || isIndividualSocial) {
    // For images, logos, and individual social icons, lock aspect ratio by exposing only corner anchors
    activeHandles = ["nw", "ne", "se", "sw"];
  } else if (element.type === "divider") {
    if (element.orientation === "vertical") {
      activeHandles = ["n", "s"];
    } else {
      activeHandles = ["w", "e"];
    }
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (isReadOnly) return;
    e.stopPropagation();
    if (isEditingText) return;
    onSelect(element.id, e);
    if (!element.locked) {
      onStartDrag(element.id, e);
    }
  }

  function handleClick(e: React.MouseEvent) {
    if (isReadOnly) return;
    e.stopPropagation();
    onSelect(element.id, e);
  }

  function handleDoubleClick(e: React.MouseEvent) {
    if (isReadOnly) return;
    if (element.type === "text" && !element.locked) {
      if (
        isEditingSavedSignature &&
        (("bind" in element && (element.bind === "name" || element.bind === "company")) ||
          element.id === "el-name" ||
          element.id === "el-company")
      ) {
        e.stopPropagation();
        onToast?.("Full name and company name are locked to preserve signature identity on the Free plan.");
        return;
      }
      e.stopPropagation();
      setIsEditingText(true);
    }
  }

  function handleTextBlur() {
    setIsEditingText(false);
    if (element.type === "text") {
      const textEl = element as FreeTextElement;
      const measuredH = measureRenderedTextHeight({
        text: localText,
        width: element.w,
        size: textEl.size,
        fontFamily: textEl.fontFamily || data.fontFamily,
        bold: textEl.bold,
        hasIcon: Boolean(textEl.icon),
      });
      onTextChange(element.id, localText, measuredH);
    }
  }

  function handleTextKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Escape") {
      setIsEditingText(false);
      setLocalText(element.type === "text" ? element.text : "");
      e.stopPropagation();
      return;
    }

    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Shift + Enter: inserts newline in textarea, checks height expansion
        setTimeout(() => {
          if (textareaRef.current && onTextGrowth) {
            const scrollH = textareaRef.current.scrollHeight;
            if (scrollH > element.h) {
              onTextGrowth(element.id, scrollH - element.h);
            }
          }
        }, 0);
      } else {
        // Enter without Shift: commits and saves the multi-line text edit
        e.preventDefault();
        textareaRef.current?.blur();
      }
    }
  }

  const isPhoneField = "bind" in element && element.bind === "phone";
  const isEmailField = "bind" in element && element.bind === "email";
  const isJobTitleField = "bind" in element && element.bind === "jobTitle";
  const isCompanyField = "bind" in element && element.bind === "company";
  const isNameField = "bind" in element && element.bind === "name";
  const isWebsiteField =
    ("bind" in element && element.bind === "website") ||
    (element.type === "text" && (element as FreeTextElement).icon === "website");

  const elementMaxLength = isPhoneField
    ? MAX_LENGTH.PHONE
    : isEmailField
    ? MAX_LENGTH.EMAIL
    : isJobTitleField
    ? MAX_LENGTH.JOB_TITLE
    : isCompanyField
    ? MAX_LENGTH.COMPANY
    : isNameField
    ? MAX_LENGTH.NAME
    : isWebsiteField
    ? MAX_LENGTH.WEBSITE
    : 500;

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const raw = isPhoneField ? sanitizePhone(e.target.value) : e.target.value;
    const val = raw.slice(0, elementMaxLength);
    setLocalText(val);

    // Dynamic height expansion during typing
    if (textareaRef.current && onTextGrowth) {
      const scrollH = textareaRef.current.scrollHeight;
      if (scrollH > element.h) {
        onTextGrowth(element.id, scrollH - element.h);
      }
    }
  }

  function handleTextPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    const plain = e.clipboardData.getData("text/plain");
    const sanitizedPlain = isPhoneField ? sanitizePhone(plain) : plain;
    const current = localText;
    const start = e.currentTarget.selectionStart || 0;
    const end = e.currentTarget.selectionEnd || 0;
    const next = (current.slice(0, start) + sanitizedPlain + current.slice(end)).slice(0, elementMaxLength);
    setLocalText(next);

    setTimeout(() => {
      if (textareaRef.current && onTextGrowth) {
        const scrollH = textareaRef.current.scrollHeight;
        if (scrollH > element.h) {
          onTextGrowth(element.id, scrollH - element.h);
        }
      }
    }, 0);
  }

  // Render element content
  function renderContent() {
    switch (element.type) {
      case "text": {
        const textEl = element as FreeTextElement;
        const fontSize = textEl.size === "lg" ? 16 : textEl.size === "sm" ? 12 : 14;
        const lineHeight = textEl.size === "lg" ? 22 : textEl.size === "sm" ? 16 : 18;
        const fontWeight = textEl.bold ? 700 : 400;
        const align = textEl.align || "left";
        const elementFontStack = resolveEmailFont(textEl.fontFamily || data.fontFamily || "Inter");
        const color = textEl.color || (themeKey === "dark" || textEl.bold ? theme.text : theme.muted);

        if (textEl.icon) {
          const iconSrc = getSocialIconSvgDataUrl("minimal", themeColor, textEl.icon);
          return (
            <div className="w-full h-full flex items-start">
              <div
                style={{ width: 22, height: lineHeight }}
                className="shrink-0 flex items-center justify-start select-none pointer-events-none mt-[1px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={iconSrc}
                  alt={textEl.icon}
                  width={16}
                  height={16}
                  style={{ display: "block", border: 0, width: 16, height: 16 }}
                  className="select-none pointer-events-none block"
                  draggable={false}
                />
              </div>
              <div className="flex-1 h-full min-w-0 flex items-start">
                {isEditingText ? (
                  <textarea
                    ref={textareaRef}
                    value={localText}
                    onChange={handleTextChange}
                    onBlur={handleTextBlur}
                    onKeyDown={handleTextKeyDown}
                    onPaste={handleTextPaste}
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    maxLength={elementMaxLength}
                    className="w-full h-full p-0 m-0 bg-transparent resize-none border-none outline-none overflow-hidden"
                    style={{
                      fontFamily: elementFontStack,
                      fontSize: `${fontSize}px`,
                      lineHeight: `${lineHeight}px`,
                      fontWeight,
                      color,
                      textAlign: align,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  />
                ) : (
                  <div
                    className="w-full h-full select-none"
                    style={{
                      fontFamily: elementFontStack,
                      fontSize: `${fontSize}px`,
                      lineHeight: `${lineHeight}px`,
                      fontWeight,
                      color,
                      textAlign: align,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {textEl.text || (
                      <span className="text-slate-400 italic">Double-click to edit text</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        }

        if (isEditingText) {
          return (
            <textarea
              ref={textareaRef}
              value={localText}
              onChange={handleTextChange}
              onBlur={handleTextBlur}
              onKeyDown={handleTextKeyDown}
              onPaste={handleTextPaste}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              maxLength={elementMaxLength}
              className="w-full h-full p-0 m-0 bg-transparent resize-none border-none outline-none overflow-hidden"
              style={{
                fontFamily: elementFontStack,
                fontSize: `${fontSize}px`,
                lineHeight: `${lineHeight}px`,
                fontWeight,
                color,
                textAlign: align,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            />
          );
        }

        return (
          <div
            className="w-full h-full select-none"
            style={{
              fontFamily: elementFontStack,
              fontSize: `${fontSize}px`,
              lineHeight: `${lineHeight}px`,
              fontWeight,
              color,
              textAlign: align,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {textEl.text || (
              <span className="text-slate-400 italic">Double-click to edit text</span>
            )}
          </div>
        );
      }

      case "image":
      case "logo":
      case "banner": {
        const mediaEl = element as FreeImageElement | FreeLogoElement | FreeBannerElement;
        const imgRadius = getShapeBorderRadius(shape, "image");
        const hasUrl = Boolean(mediaEl.url && mediaEl.url.trim());

        if (hasUrl) {
          return (
            <Image
              src={mediaEl.url}
              alt={element.type}
              width={element.w || 100}
              height={element.h || 100}
              className="w-full h-full object-cover select-none pointer-events-none block"
              style={{ borderRadius: imgRadius }}
              unoptimized
              draggable={false}
            />
          );
        }

        return (
          <div
            className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 select-none border border-dashed border-slate-300"
            style={{ borderRadius: imgRadius }}
          >
            <span className="text-[11px] font-medium capitalize">{element.type}</span>
          </div>
        );
      }

      case "divider": {
        const divEl = element as FreeDividerElement;
        const dividerColor = divEl.color || themeColor || theme.border || "#E2E8F0";
        const thickness = Math.max(1, divEl.thickness || 1);

        if (divEl.orientation === "vertical") {
          return (
            <div className="w-full h-full flex items-center justify-center">
              <div
                style={{
                  width: `${thickness}px`,
                  height: "100%",
                  backgroundColor: dividerColor,
                }}
              />
            </div>
          );
        }

        return (
          <div className="w-full h-full flex items-center justify-center">
            <div
              style={{
                width: "100%",
                height: `${thickness}px`,
                backgroundColor: dividerColor,
              }}
            />
          </div>
        );
      }

      case "cta": {
        const ctaEl = element as FreeCtaElement;
        const ctaFontStack = resolveEmailFont(ctaEl.fontFamily || data.fontFamily || "Inter");
        const isSolid = buttonStyle !== "outline";
        const btnRadius = getShapeBorderRadius(element.shape || "rounded", "button");
        const ctaThemeColor = ctaEl.color || themeColor;
        const btnBg = isSolid ? ctaThemeColor : "transparent";
        const btnBorder = isSolid
          ? "none"
          : `2px solid ${ctaThemeColor}`;
        const textColor = ctaEl.textColor || (isSolid ? "#FFFFFF" : ctaThemeColor);

        return (
          <div
            className="w-full h-full flex items-center justify-center px-3 select-none font-bold text-xs"
            style={{
              backgroundColor: btnBg,
              border: btnBorder,
              borderRadius: btnRadius,
              color: textColor,
              fontFamily: ctaFontStack,
            }}
          >
            <span className="truncate">{ctaEl.label || "Button"}</span>
          </div>
        );
      }

      case "social": {
        const socialEl = element as FreeSocialElement;

        const allNetworks: { key: keyof StudioSignatureData["socials"]; label: string; network: SocialNetwork; platform?: TeamMemberSocialPlatform }[] = [
          { key: "linkedin", label: "LinkedIn", network: "linkedin", platform: "linkedin" },
          { key: "twitter", label: "Twitter", network: "twitter", platform: "x" },
          { key: "facebook", label: "Facebook", network: "facebook", platform: "facebook" },
          { key: "instagram", label: "Instagram", network: "instagram", platform: "instagram" },
          { key: "github", label: "GitHub", network: "github", platform: "github" },
          { key: "youtube", label: "YouTube", network: "youtube" },
          { key: "website", label: "Website", network: "website" },
        ];

        const socialShape = (element.shape || shape) as "square" | "rounded" | "pill";
        const iconRadius = socialShape === "square" ? "0px" : socialShape === "pill" ? "999px" : "6px";
        const style = data.socialIconsStyle || "filled";

        // If this is an ungrouped individual social icon
        if (socialEl.platform) {
          const match = allNetworks.find((n) => n.key === socialEl.platform) || {
            key: socialEl.platform,
            label: socialEl.platform,
            network: socialEl.platform as SocialNetwork,
            platform: undefined,
          };
          const iconSize = Math.max(12, Math.min(element.w, element.h));
          const iconUrl =
            getSocialIconSvgDataUrl(style, themeColor, match.network, socialShape) ||
            emailIconUrl(style, themeColor, match.network);

          return (
            <div className="w-full h-full flex items-center justify-center select-none overflow-hidden">
              <Image
                src={iconUrl}
                alt={match.label}
                width={iconSize}
                height={iconSize}
                className="shrink-0 block"
                style={{
                  width: `${iconSize}px`,
                  height: `${iconSize}px`,
                  borderRadius: iconRadius,
                }}
                unoptimized
                draggable={false}
              />
            </div>
          );
        }

        const networks = allNetworks.slice(0, 5) as { key: keyof StudioSignatureData["socials"]; label: string; network: SocialNetwork; platform: TeamMemberSocialPlatform }[];
        const hasAnySocial = networks.some((n) => Boolean(data.socials?.[n.key]?.trim()));
        const activeNetworks = networks.filter((n) => {
          const val = data.socials?.[n.key]?.trim();
          if (!val) return false;
          return !validateSocialUrl(n.platform, val);
        });

        // If user has not entered any social handles yet, show defaults. If user entered some but they are all invalid, show none.
        const displayNetworks =
          activeNetworks.length > 0
            ? activeNetworks
            : hasAnySocial
            ? []
            : networks;
        const iconSize = getSocialIconSize(element.w, displayNetworks.length);
        const iconGap = Math.round(iconSize * 0.3);

        if (displayNetworks.length === 0) {
          return (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px] italic border border-dashed border-slate-300 rounded">
              Enter valid social link
            </div>
          );
        }

        return (
          <div className="w-full h-full flex items-center select-none" style={{ gap: `${iconGap}px` }}>
            {displayNetworks.map((n) => {
              const iconUrl =
                getSocialIconSvgDataUrl(style, themeColor, n.network, socialShape) ||
                emailIconUrl(style, themeColor, n.network);
              return (
                <Image
                  key={n.key}
                  src={iconUrl}
                  alt={n.label}
                  width={iconSize}
                  height={iconSize}
                  className="shrink-0 block"
                  style={{
                    width: `${iconSize}px`,
                    height: `${iconSize}px`,
                    borderRadius: iconRadius,
                  }}
                  unoptimized
                  draggable={false}
                />
              );
            })}
          </div>
        );
      }

      default:
        return null;
    }
  }

  // Combine refs
  function setRef(node: HTMLDivElement | null) {
    localContainerRef.current = node;
    if (domRef) domRef(node);
  }

  const showCollision = isColliding && (isDragging || isResizing);

  return (
    <div
      ref={setRef}
      id={`free-el-${element.id}`}
      data-element-id={element.id}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{
        position: "absolute",
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.w}px`,
        height: `${element.h}px`,
        touchAction: isReadOnly ? "auto" : "none",
        cursor: isReadOnly || element.locked ? "default" : isEditingText ? "text" : "move",
        outline: !isReadOnly && showCollision
          ? "2px solid #DC2626"
          : !isReadOnly && isSelected
          ? "1.5px solid #245FD4"
          : "none",
        outlineOffset: "1px",
        zIndex: isSelected ? 20 : element.type === "banner" ? 0 : 1,
      }}
      className={`group select-none ${
        !isReadOnly && !isSelected && !showCollision ? "hover:outline hover:outline-1 hover:outline-blue-300" : ""
      }`}
    >
      {/* Collision Tooltip */}
      {showCollision && (
        <div
          role="alert"
          className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#DC2626] text-white text-[10px] font-medium px-2 py-0.5 rounded shadow whitespace-nowrap z-50 pointer-events-none animate-in fade-in"
        >
          Elements cannot overlap in email signatures
        </div>
      )}

      {/* Linked Team Field Badge */}
      {!hideLabels && showEditorOverlays && "bind" in element && element.bind && (() => {
        const isInvalidEmail =
          element.bind === "email" &&
          Boolean(
            element.type === "text" &&
              (element as FreeTextElement).text?.trim() &&
              !isValidEmail((element as FreeTextElement).text)
          );
        const isInvalidPhone =
          element.bind === "phone" &&
          Boolean(
            element.type === "text" &&
              (element as FreeTextElement).text?.trim() &&
              !isValidPhone((element as FreeTextElement).text)
          );
        const isInvalidWebsite =
          (element.bind === "website" || (element.type === "text" && (element as FreeTextElement).icon === "website")) &&
          Boolean(
            element.type === "text" &&
              (element as FreeTextElement).text?.trim() &&
              !isValidWebUrl((element as FreeTextElement).text)
          );
        const hasFormatError = isInvalidEmail || isInvalidPhone || isInvalidWebsite;

        const isNearTopEdge = element.y < 14;

        return (
          <div
            data-team-field-badge={element.bind || "website"}
            className={`absolute left-0 z-30 flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold tracking-tight text-white shadow-xs pointer-events-none leading-none select-none ${
              isNearTopEdge ? "top-0.5" : "-top-3.5"
            } ${
              hasFormatError ? "bg-rose-600" : "bg-[#449AFA]"
            }`}
          >
            <span>
              {isInvalidEmail
                ? "Invalid Email"
                : isInvalidPhone
                ? "Invalid Phone"
                : isInvalidWebsite
                ? "Invalid Website"
                : element.bind === "name"
                ? "Name"
                : element.bind === "jobTitle"
                ? "Job title"
                : element.bind === "email"
                ? "Email"
                : element.bind === "phone"
                ? "Phone"
                : element.bind === "photo"
                ? "Photo"
                : element.bind === "company"
                ? "Company"
                : element.bind === "website"
                ? "Website"
                : element.bind}
            </span>
          </div>
        );
      })()}

      {/* Lock Indicator */}
      {element.locked && isSelected && (
        <div className="absolute -top-5 right-0 flex items-center gap-1 bg-slate-800 text-slate-200 text-[10px] px-1.5 py-0.5 rounded z-30 pointer-events-none shadow">
          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>Locked</span>
        </div>
      )}

      {/* Main Content */}
      {renderContent()}

      {/* Inline text edit notification & split lines helper */}
      {isEditingText && (
        <div
          className="absolute -bottom-7 left-0 z-40 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded shadow pointer-events-auto whitespace-nowrap animate-in fade-in"
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
        >
          <span className="text-slate-300">Text Box • Styling applies to entire element</span>
          {localText.includes("\n") && (
            <>
              <span className="text-slate-500">•</span>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsEditingText(false);
                  onSplitLines?.(element.id, localText);
                }}
                className="text-blue-400 hover:text-blue-200 font-medium underline cursor-pointer"
                title="Convert each line into its own element so they can be styled individually"
              >
                Split into separate lines
              </button>
            </>
          )}
        </div>
      )}

      {/* Selected multiline indicator */}
      {isSelected && !isEditingText && element.type === "text" && (element as FreeTextElement).text?.includes("\n") && (
        <div
          className="absolute -bottom-6 left-0 z-30 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap animate-in fade-in"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <span className="text-slate-300">Styling applies to entire box</span>
          <span className="text-slate-500">•</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSplitLines?.(element.id, (element as FreeTextElement).text);
            }}
            className="text-blue-400 hover:text-blue-200 font-medium underline cursor-pointer"
            title="Split lines into separate elements so each line can be styled individually"
          >
            Split lines to style individually
          </button>
        </div>
      )}

      {/* Resize Handles (8 handles when selected and not locked) */}
      {!isReadOnly && isSelected && !element.locked && !isEditingText && (
        <>
          {activeHandles.map((h) => (
            <div
              key={h}
              data-handle={h}
              onPointerDown={(e) => {
                e.stopPropagation();
                onStartResize(element.id, h, e);
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{
                position: "absolute",
                ...HANDLE_POSITIONS[h],
                width: "32px",
                height: "32px",
                cursor: HANDLE_CURSORS[h],
                touchAction: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 30,
              }}
            >
              <div className="w-2.5 h-2.5 bg-white border-[1.5px] border-[#245FD4] rounded-xs shadow-xs pointer-events-none" />
            </div>
          ))}
        </>
      )}
    </div>
  );
}
