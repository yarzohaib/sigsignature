"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FreeElement,
  FreeTextElement,
  FreeImageElement,
  FreeLogoElement,
  FreeBannerElement,
  FreeDividerElement,
  FreeCtaElement,
  StudioSignatureData,
} from "@/types/studio";
import {
  resolveEmailFont,
  getSocialIconSvgDataUrl,
  emailIconUrl,
  SocialNetwork,
} from "@/lib/email-core";
import { THEME_PRESETS, getShapeBorderRadius } from "@/lib/studio/shared";

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
  onTextChange: (id: string, text: string) => void;
  onTextGrowth?: (id: string, deltaH: number) => void;
  domRef?: (node: HTMLDivElement | null) => void;
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
  const shape = data.design?.shape || "rounded";
  const buttonStyle = data.design?.buttonStyle || "solid";
  const fontStack = resolveEmailFont(data.fontFamily || "Inter");

  // Determine handles to show
  let activeHandles: ResizeHandle[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
  if (element.type === "divider") {
    if (element.orientation === "vertical") {
      activeHandles = ["n", "s"];
    } else {
      activeHandles = ["w", "e"];
    }
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (isEditingText) return;
    onSelect(element.id, e);
    if (!element.locked) {
      onStartDrag(element.id, e);
    }
  }

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    onSelect(element.id, e);
  }

  function handleDoubleClick(e: React.MouseEvent) {
    if (element.type === "text" && !element.locked) {
      e.stopPropagation();
      setIsEditingText(true);
    }
  }

  function handleTextBlur() {
    setIsEditingText(false);
    if (element.type === "text" && localText !== element.text) {
      onTextChange(element.id, localText);
    }
  }

  function handleTextKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Escape") {
      setIsEditingText(false);
      setLocalText(element.type === "text" ? element.text : "");
      e.stopPropagation();
    }
  }

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value.slice(0, 500);
    setLocalText(val);

    // Check if height needs to grow
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
    const current = localText;
    const start = e.currentTarget.selectionStart || 0;
    const end = e.currentTarget.selectionEnd || 0;
    const next = (current.slice(0, start) + plain + current.slice(end)).slice(0, 500);
    setLocalText(next);
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
        const color = textEl.bold ? theme.text : theme.muted;

        if (isEditingText) {
          return (
            <textarea
              ref={textareaRef}
              value={localText}
              onChange={handleTextChange}
              onBlur={handleTextBlur}
              onKeyDown={handleTextKeyDown}
              onPaste={handleTextPaste}
              maxLength={500}
              className="w-full h-full p-0 m-0 bg-transparent resize-none border-none outline-none overflow-hidden"
              style={{
                fontFamily: fontStack,
                fontSize: `${fontSize}px`,
                lineHeight: `${lineHeight}px`,
                fontWeight,
                color,
                textAlign: align,
              }}
            />
          );
        }

        return (
          <div
            className="w-full h-full overflow-hidden select-none break-words"
            style={{
              fontFamily: fontStack,
              fontSize: `${fontSize}px`,
              lineHeight: `${lineHeight}px`,
              fontWeight,
              color,
              textAlign: align,
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
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaEl.url}
              alt={element.type}
              className="w-full h-full object-cover select-none pointer-events-none block"
              style={{ borderRadius: imgRadius }}
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
        const dividerColor = themeColor || theme.border || "#E2E8F0";
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
        const isSolid = buttonStyle !== "outline";
        const btnRadius = getShapeBorderRadius(shape, "button");
        const btnBg = isSolid ? themeColor : "transparent";
        const btnBorder = isSolid
          ? "none"
          : `2px solid ${themeColor}`;
        const textColor = isSolid ? "#FFFFFF" : themeColor;

        return (
          <div
            className="w-full h-full flex items-center justify-center px-3 select-none font-bold text-xs"
            style={{
              backgroundColor: btnBg,
              border: btnBorder,
              borderRadius: btnRadius,
              color: textColor,
              fontFamily: fontStack,
            }}
          >
            <span className="truncate">{ctaEl.label || "Button"}</span>
          </div>
        );
      }

      case "social": {
        const networks: { key: keyof StudioSignatureData["socials"]; label: string; network: SocialNetwork }[] = [
          { key: "linkedin", label: "LinkedIn", network: "linkedin" },
          { key: "twitter", label: "Twitter", network: "twitter" },
          { key: "facebook", label: "Facebook", network: "facebook" },
          { key: "instagram", label: "Instagram", network: "instagram" },
        ];

        const activeNetworks = networks.filter((n) => Boolean(data.socials?.[n.key]?.trim()));
        const displayNetworks = activeNetworks.length > 0 ? activeNetworks : networks;
        const style = data.socialIconsStyle || "filled";

        return (
          <div className="w-full h-full flex items-center gap-1.5 select-none overflow-hidden">
            {displayNetworks.map((n) => {
              const iconUrl =
                getSocialIconSvgDataUrl(style, themeColor, n.network) ||
                emailIconUrl(style, themeColor, n.network);
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={n.key}
                  src={iconUrl}
                  alt={n.label}
                  className="w-5 h-5 shrink-0 block"
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
        touchAction: "none",
        cursor: element.locked ? "default" : isEditingText ? "text" : "move",
        outline: showCollision
          ? "2px solid #DC2626"
          : isSelected
          ? "1.5px solid #245FD4"
          : "none",
        outlineOffset: "1px",
        zIndex: isSelected ? 20 : 1,
      }}
      className={`group select-none ${
        !isSelected && !showCollision ? "hover:outline hover:outline-1 hover:outline-blue-300" : ""
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
      {"bind" in element && element.bind && (
        <div
          data-team-field-badge={element.bind}
          className="absolute -top-3.5 left-0 z-30 flex items-center gap-1 rounded bg-[#449AFA] px-1.5 py-0.5 text-[9px] font-bold tracking-tight text-white shadow-xs pointer-events-none leading-none select-none"
        >
          <span>
            {element.bind === "name"
              ? "Name"
              : element.bind === "jobTitle"
              ? "Job title"
              : element.bind === "email"
              ? "Email"
              : element.bind === "phone"
              ? "Phone"
              : element.bind === "photo"
              ? "Photo"
              : element.bind}
          </span>
        </div>
      )}

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

      {/* Resize Handles (8 handles when selected and not locked) */}
      {isSelected && !element.locked && !isEditingText && (
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
