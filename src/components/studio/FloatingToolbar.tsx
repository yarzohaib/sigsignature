"use client";

import { useEffect, useRef, useState, ChangeEvent } from "react";

export type AlignmentOption = "left" | "center" | "right";

interface FloatingToolbarProps {
  isMainCard: boolean;
  elementType?: "text" | "image" | "divider" | "cta" | "banner";
  bold?: boolean;
  onToggleBold?: () => void;
  size?: "sm" | "md" | "lg";
  onSizeChange?: (size: "sm" | "md" | "lg") => void;
  url?: string;
  onUrlChange?: (url: string) => void;
  imageWidth?: number;
  width?: number;
  onWidthChange?: (width: number) => void;
  orientation?: "horizontal" | "vertical";
  onOrientationChange?: (orientation: "horizontal" | "vertical") => void;
  thickness?: number;
  onThicknessChange?: (thickness: number) => void;
  onReplaceMedia?: () => void;
  onMove?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onAlign?: (alignment: AlignmentOption) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onEditDetails?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  currentAlign?: AlignmentOption;
  column?: "left" | "right" | "full";
  onColumnChange?: (column: "left" | "right" | "full") => void;
  autoOpenLinkMenu?: boolean;
}

export default function FloatingToolbar({
  isMainCard,
  elementType,
  bold,
  onToggleBold,
  size = "md",
  onSizeChange,
  url,
  onUrlChange,
  imageWidth,
  width,
  onWidthChange,
  orientation = "horizontal",
  onOrientationChange,
  thickness = 1,
  onThicknessChange,
  onReplaceMedia,
  onDuplicate,
  onDelete,
  onAlign,
  onMoveUp,
  onMoveDown,
  onEditDetails,
  canMoveUp = false,
  canMoveDown = false,
  column,
  onColumnChange,
  autoOpenLinkMenu = false,
}: FloatingToolbarProps) {
  const [openMenu, setOpenMenu] = useState<"align" | "layers" | "more" | "link" | "size" | "thickness" | null>(
    autoOpenLinkMenu ? "link" : null
  );

  const toolbarRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click or escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenMenu(null);
      }
    }
    function handleClickOutside(e: MouseEvent) {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const disabledTooltip = "The main signature cannot be changed this way";

  return (
    <div
      ref={toolbarRef}
      role="toolbar"
      aria-label="Selection toolbar"
      className="absolute -top-11 left-1/2 -translate-x-1/2 flex items-center bg-[#1E293B] text-white px-2 py-1 rounded-xl shadow-xl z-30 select-none border border-slate-700/60 max-w-[95vw] overflow-visible"
      onClick={(e) => e.stopPropagation()}
    >
      {/* TEXT SPECIFIC CONTROLS */}
      {elementType === "text" && (
        <>
          {/* Bold Toggle */}
          <button
            type="button"
            aria-label="Toggle bold"
            title="Toggle bold"
            onClick={onToggleBold}
            className={`flex h-7 w-7 items-center justify-center rounded text-xs font-bold transition focus:outline-none focus:ring-1 focus:ring-blue-400 ${
              bold
                ? "bg-[#245FD4] text-white shadow-xs"
                : "text-slate-200 hover:text-white hover:bg-slate-700/60"
            }`}
          >
            B
          </button>

          {/* Size Selector */}
          <div className="relative">
            <button
              type="button"
              aria-label="Change text size"
              title="Change text size"
              onClick={() => setOpenMenu((prev) => (prev === "size" ? null : "size"))}
              className="flex h-7 px-2 items-center gap-1 rounded text-[11px] font-semibold text-slate-200 hover:text-white hover:bg-slate-700/60 transition focus:outline-none focus:ring-1 focus:ring-blue-400 uppercase"
            >
              <span>{size}</span>
              <svg className="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {openMenu === "size" && (
              <div className="absolute top-full mt-2 left-0 z-40 flex flex-col min-w-[90px] rounded-lg bg-[#0F172A] p-1 shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95 duration-100">
                {(["sm", "md", "lg"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      onSizeChange?.(s);
                      setOpenMenu(null);
                    }}
                    className={`flex items-center justify-between rounded px-2.5 py-1.5 text-xs text-left transition ${
                      size === s
                        ? "bg-[#245FD4] text-white font-bold"
                        : "text-slate-200 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span className="uppercase">{s}</span>
                    <span className="text-[10px] text-slate-400">
                      {s === "sm" ? "12px" : s === "md" ? "14px" : "16px"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-3.5 w-[1px] bg-slate-700 mx-1 shrink-0" />
        </>
      )}

      {/* CTA / LINK SPECIFIC CONTROLS */}
      {(elementType === "cta" || elementType === "banner" || elementType === "image") && (
        <>
          <div className="relative">
            <button
              type="button"
              aria-label={url?.trim() ? "Edit redirect URL" : "Add redirect URL"}
              title={url?.trim() ? `Links to: ${url}` : "Add destination link URL"}
              onClick={() => setOpenMenu((prev) => (prev === "link" ? null : "link"))}
              className={`flex h-7 px-2 items-center gap-1.5 rounded text-xs transition focus:outline-none focus:ring-1 focus:ring-blue-400 ${
                url?.trim()
                  ? "bg-blue-600/30 text-blue-200 border border-blue-400/50 hover:bg-blue-600/50 font-semibold shadow-2xs"
                  : "bg-blue-500/15 text-blue-300 border border-blue-500/40 hover:bg-blue-500/25 font-semibold"
              }`}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span className="text-[11px] font-semibold">
                {url?.trim() ? "Link Set" : "Add URL"}
              </span>
            </button>

            {openMenu === "link" && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-40 flex flex-col w-[290px] rounded-xl bg-[#0F172A] p-3 shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-bold tracking-wider text-slate-300 uppercase">
                    Destination URL
                  </label>
                  {url?.trim() && (
                    <button
                      type="button"
                      onClick={() => onUrlChange?.("")}
                      className="text-[10px] text-red-400 hover:text-red-300 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="url"
                    value={url || ""}
                    placeholder="https://example.com"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value.trim();
                        if (val && !/^https?:\/\//i.test(val)) {
                          onUrlChange?.(`https://${val}`);
                        }
                        setOpenMenu(null);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.trim();
                      if (val && !/^https?:\/\//i.test(val)) {
                        onUrlChange?.(`https://${val}`);
                      }
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onUrlChange?.(e.target.value)}
                    className="flex-1 rounded-md bg-slate-900 border border-slate-700 px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = (url || "").trim();
                      if (val && !/^https?:\/\//i.test(val)) {
                        onUrlChange?.(`https://${val}`);
                      }
                      setOpenMenu(null);
                    }}
                    className="rounded-md bg-[#245FD4] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 transition"
                  >
                    Done
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 leading-tight">
                  Anyone who clicks this logo or image in your email will be redirected to this URL.
                </p>
              </div>
            )}
          </div>

          <div className="h-3.5 w-[1px] bg-slate-700 mx-1 shrink-0" />
        </>
      )}

      {/* DIVIDER SPECIFIC CONTROLS */}
      {elementType === "divider" && (
        <>
          {/* Orientation Toggle */}
          <button
            type="button"
            aria-label="Divider Orientation"
            title={`Orientation: ${orientation === "vertical" ? "Vertical" : "Horizontal"}`}
            onClick={() => onOrientationChange?.(orientation === "vertical" ? "horizontal" : "vertical")}
            className="flex h-7 px-2 items-center gap-1.5 rounded text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-700/60 transition focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            {orientation === "vertical" ? (
              <>
                <svg className="h-3.5 w-3.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="3" x2="12" y2="21" />
                </svg>
                <span className="text-[11px] hidden sm:inline">Vertical</span>
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="3" y1="12" x2="21" y2="12" />
                </svg>
                <span className="text-[11px] hidden sm:inline">Horizontal</span>
              </>
            )}
          </button>

          <div className="h-3.5 w-[1px] bg-slate-700 mx-1 shrink-0" />

          {/* Width / Size Stepper */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Decrease divider length"
              title="Decrease width"
              onClick={() => onWidthChange?.(Math.max(40, (width || 600) - 50))}
              className="flex h-6 w-6 items-center justify-center rounded text-slate-300 hover:text-white hover:bg-slate-700/60 text-xs font-bold"
            >
              -
            </button>
            <span className="text-[11px] font-semibold text-slate-300 min-w-[44px] text-center">
              {width && width < 600 ? `${width}px` : "100%"}
            </span>
            <button
              type="button"
              aria-label="Increase divider length"
              title="Increase width"
              onClick={() => onWidthChange?.(Math.min(600, (width || 600) + 50))}
              className="flex h-6 w-6 items-center justify-center rounded text-slate-300 hover:text-white hover:bg-slate-700/60 text-xs font-bold"
            >
              +
            </button>
          </div>

          {/* Width Quick Presets */}
          <div className="hidden sm:flex items-center gap-0.5 ml-1">
            {[
              { label: "25%", val: 150 },
              { label: "50%", val: 300 },
              { label: "75%", val: 450 },
              { label: "100%", val: 600 },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => onWidthChange?.(p.val)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition ${
                  (width || 600) === p.val
                    ? "bg-[#245FD4] text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="h-3.5 w-[1px] bg-slate-700 mx-1 shrink-0" />

          {/* Thickness Selector */}
          <div className="relative">
            <button
              type="button"
              aria-label="Divider thickness"
              title="Divider thickness"
              onClick={() => setOpenMenu((prev) => (prev === "thickness" ? null : "thickness"))}
              className="flex h-7 px-2 items-center gap-1 rounded text-[11px] font-semibold text-slate-200 hover:text-white hover:bg-slate-700/60 transition focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <span>{thickness}px</span>
              <svg className="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {openMenu === "thickness" && (
              <div className="absolute top-full mt-2 left-0 z-40 flex flex-col min-w-[70px] rounded-lg bg-[#0F172A] p-1 shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95 duration-100">
                {[1, 2, 3, 4, 6].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      onThicknessChange?.(t);
                      setOpenMenu(null);
                    }}
                    className={`flex items-center justify-between rounded px-2.5 py-1.5 text-xs text-left transition ${
                      thickness === t
                        ? "bg-[#245FD4] text-white font-bold"
                        : "text-slate-200 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span>{t}px</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-3.5 w-[1px] bg-slate-700 mx-1 shrink-0" />
        </>
      )}

      {/* TEXT / CTA CONTAINER WIDTH ADJUSTER */}
      {(elementType === "text" || elementType === "cta") && onWidthChange && (
        <>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Decrease container width"
              title="Decrease width"
              onClick={() => onWidthChange(Math.max(80, (width || 600) - 50))}
              className="flex h-6 w-6 items-center justify-center rounded text-slate-300 hover:text-white hover:bg-slate-700/60 text-xs font-bold"
            >
              -
            </button>
            <span className="text-[11px] font-semibold text-slate-300 min-w-[42px] text-center">
              {width && width < 600 ? `${width}px` : "Auto"}
            </span>
            <button
              type="button"
              aria-label="Increase container width"
              title="Increase width"
              onClick={() => onWidthChange(Math.min(600, (width || 600) + 50))}
              className="flex h-6 w-6 items-center justify-center rounded text-slate-300 hover:text-white hover:bg-slate-700/60 text-xs font-bold"
            >
              +
            </button>
          </div>

          <div className="h-3.5 w-[1px] bg-slate-700 mx-1 shrink-0" />
        </>
      )}

      {/* IMAGE WIDTH ADJUSTER */}
      {elementType === "image" && (imageWidth !== undefined || width !== undefined) && (
        <>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Decrease image width"
              title="Decrease width"
              onClick={() => onWidthChange?.(Math.max(40, (width ?? imageWidth ?? 200) - 25))}
              className="flex h-6 w-6 items-center justify-center rounded text-slate-300 hover:text-white hover:bg-slate-700/60 text-xs font-bold"
            >
              -
            </button>
            <span className="text-[11px] font-semibold text-slate-300 min-w-[42px] text-center">
              {width ?? imageWidth ?? 200}px
            </span>
            <button
              type="button"
              aria-label="Increase image width"
              title="Increase width"
              onClick={() => onWidthChange?.(Math.min(600, (width ?? imageWidth ?? 200) + 25))}
              className="flex h-6 w-6 items-center justify-center rounded text-slate-300 hover:text-white hover:bg-slate-700/60 text-xs font-bold"
            >
              +
            </button>
          </div>

          <div className="h-3.5 w-[1px] bg-slate-700 mx-1 shrink-0" />
        </>
      )}

      {/* REPLACE MEDIA (for image or banner) */}
      {(elementType === "image" || elementType === "banner") && onReplaceMedia && (
        <>
          <button
            type="button"
            aria-label="Replace file"
            title="Replace with new file"
            onClick={onReplaceMedia}
            className="flex h-7 px-2 items-center gap-1 rounded text-slate-200 hover:text-white hover:bg-slate-700/60 text-[11px] font-medium transition"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>Replace</span>
          </button>

          <div className="h-3.5 w-[1px] bg-slate-700 mx-1 shrink-0" />
        </>
      )}

      {/* MOVE / REORDER */}
      <button
        type="button"
        aria-label="Move / reorder element"
        title={isMainCard ? disabledTooltip : "Move / reorder element"}
        disabled={isMainCard}
        onClick={() => {
          if (!isMainCard) {
            setOpenMenu((prev) => (prev === "layers" ? null : "layers"));
          }
        }}
        className={`flex h-7 w-7 items-center justify-center rounded transition focus:outline-none focus:ring-1 focus:ring-blue-400 ${
          isMainCard
            ? "opacity-40 cursor-not-allowed text-slate-500"
            : "text-slate-200 hover:text-white hover:bg-slate-700/60"
        }`}
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="6" r="1.5" fill="currentColor" />
          <circle cx="15" cy="6" r="1.5" fill="currentColor" />
          <circle cx="9" cy="12" r="1.5" fill="currentColor" />
          <circle cx="15" cy="12" r="1.5" fill="currentColor" />
          <circle cx="9" cy="18" r="1.5" fill="currentColor" />
          <circle cx="15" cy="18" r="1.5" fill="currentColor" />
        </svg>
      </button>

      <div className="h-3.5 w-[1px] bg-slate-700 mx-1 shrink-0" />

      {/* DUPLICATE */}
      <button
        type="button"
        aria-label="Duplicate item"
        title={isMainCard ? disabledTooltip : "Duplicate item"}
        disabled={isMainCard}
        onClick={() => {
          if (!isMainCard && onDuplicate) {
            onDuplicate();
          }
        }}
        className={`flex h-7 w-7 items-center justify-center rounded transition focus:outline-none focus:ring-1 focus:ring-blue-400 ${
          isMainCard
            ? "opacity-40 cursor-not-allowed text-slate-500"
            : "text-slate-200 hover:text-white hover:bg-slate-700/60"
        }`}
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </button>

      {/* COLUMN PLACEMENT (Left / Right / Full) */}
      {!isMainCard && onColumnChange && (
        <>
          <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700/80 gap-0.5">
            <button
              type="button"
              aria-label="Place in left column"
              title="Left Column (side by side)"
              onClick={() => onColumnChange("left")}
              className={`flex items-center gap-1 px-1.5 py-1 rounded text-[10px] font-semibold transition ${
                column === "left"
                  ? "bg-[#245FD4] text-white shadow-xs"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/60"
              }`}
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="12" y1="3" x2="12" y2="21" />
                <rect x="3" y="3" width="9" height="18" fill="currentColor" fillOpacity="0.4" />
              </svg>
              <span>Left</span>
            </button>
            <button
              type="button"
              aria-label="Place on side in right column"
              title="Right Column (on side of image)"
              onClick={() => onColumnChange("right")}
              className={`flex items-center gap-1 px-1.5 py-1 rounded text-[10px] font-semibold transition ${
                column === "right"
                  ? "bg-[#245FD4] text-white shadow-xs"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/60"
              }`}
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="12" y1="3" x2="12" y2="21" />
                <rect x="12" y="3" width="9" height="18" fill="currentColor" fillOpacity="0.4" />
              </svg>
              <span>Right</span>
            </button>
            <button
              type="button"
              aria-label="Place full width"
              title="Full Width"
              onClick={() => onColumnChange("full")}
              className={`flex items-center gap-1 px-1.5 py-1 rounded text-[10px] font-semibold transition ${
                column === "full"
                  ? "bg-[#245FD4] text-white shadow-xs"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/60"
              }`}
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" fillOpacity="0.3" />
              </svg>
              <span>Full</span>
            </button>
          </div>

          <div className="h-3.5 w-[1px] bg-slate-700 mx-1 shrink-0" />
        </>
      )}

      {/* DEL */}
      <button
        type="button"
        aria-label="Delete item"
        title="Delete item"
        onClick={() => {
          if (onDelete) onDelete();
        }}
        className="flex h-7 px-1.5 items-center justify-center rounded text-[11px] font-bold text-[#EF4444] hover:bg-red-500/10 transition focus:outline-none focus:ring-1 focus:ring-red-400"
      >
        DEL
      </button>

      <div className="h-3.5 w-[1px] bg-slate-700 mx-1 shrink-0" />

      {/* ALIGN */}
      <div className="relative">
        <button
          type="button"
          aria-label="Align"
          title="Align element"
          onClick={() => setOpenMenu((prev) => (prev === "align" ? null : "align"))}
          className="flex h-7 w-7 items-center justify-center rounded text-slate-200 hover:text-white hover:bg-slate-700/60 transition focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="21" y1="6" x2="3" y2="6" />
            <line x1="17" y1="12" x2="7" y2="12" />
            <line x1="19" y1="18" x2="5" y2="18" />
          </svg>
        </button>

        {openMenu === "align" && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-40 flex flex-col min-w-[100px] rounded-lg bg-[#0F172A] p-1 shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95 duration-100">
            <button
              type="button"
              onClick={() => {
                onAlign?.("left");
                setOpenMenu(null);
              }}
              className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 hover:text-white text-left transition"
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="21" y1="6" x2="3" y2="6" />
                <line x1="15" y1="12" x2="3" y2="12" />
                <line x1="17" y1="18" x2="3" y2="18" />
              </svg>
              <span>Left</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onAlign?.("center");
                setOpenMenu(null);
              }}
              className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 hover:text-white text-left transition"
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="6" x2="5" y2="6" />
                <line x1="17" y1="12" x2="7" y2="12" />
                <line x1="19" y1="18" x2="5" y2="18" />
              </svg>
              <span>Center</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onAlign?.("right");
                setOpenMenu(null);
              }}
              className="flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 hover:text-white text-left transition"
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="21" y1="6" x2="3" y2="6" />
                <line x1="21" y1="12" x2="9" y2="12" />
                <line x1="21" y1="18" x2="7" y2="18" />
              </svg>
              <span>Right</span>
            </button>
          </div>
        )}
      </div>

      <div className="h-3.5 w-[1px] bg-slate-700 mx-1 shrink-0" />

      {/* LAYERS */}
      <div className="relative">
        <button
          type="button"
          aria-label="Layers"
          title={isMainCard ? disabledTooltip : "Reorder layer"}
          disabled={isMainCard}
          onClick={() => {
            if (!isMainCard) {
              setOpenMenu((prev) => (prev === "layers" ? null : "layers"));
            }
          }}
          className={`flex h-7 w-7 items-center justify-center rounded transition focus:outline-none focus:ring-1 focus:ring-blue-400 ${
            isMainCard
              ? "opacity-40 cursor-not-allowed text-slate-500"
              : "text-slate-200 hover:text-white hover:bg-slate-700/60"
          }`}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </button>

        {openMenu === "layers" && !isMainCard && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-40 flex flex-col min-w-[120px] rounded-lg bg-[#0F172A] p-1 shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95 duration-100">
            <button
              type="button"
              disabled={!canMoveUp}
              onClick={() => {
                onMoveUp?.();
                setOpenMenu(null);
              }}
              className={`flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-left transition ${
                canMoveUp
                  ? "text-slate-200 hover:bg-slate-800 hover:text-white"
                  : "opacity-40 cursor-not-allowed text-slate-500"
              }`}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="18 15 12 9 6 15" />
              </svg>
              <span>Move Up</span>
            </button>
            <button
              type="button"
              disabled={!canMoveDown}
              onClick={() => {
                onMoveDown?.();
                setOpenMenu(null);
              }}
              className={`flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-left transition ${
                canMoveDown
                  ? "text-slate-200 hover:bg-slate-800 hover:text-white"
                  : "opacity-40 cursor-not-allowed text-slate-500"
              }`}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
              <span>Move Down</span>
            </button>
          </div>
        )}
      </div>

      {/* EDIT DETAILS / MORE */}
      {isMainCard && onEditDetails && (
        <>
          <div className="h-3.5 w-[1px] bg-slate-700 mx-1 shrink-0" />
          <button
            type="button"
            aria-label="Edit details"
            title="Edit contact card details"
            onClick={onEditDetails}
            className="flex h-7 px-2 items-center gap-1 rounded text-slate-200 hover:text-white hover:bg-slate-700/60 text-xs font-semibold transition"
          >
            <svg className="h-3.5 w-3.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span className="hidden sm:inline">Edit Details</span>
          </button>
        </>
      )}
    </div>
  );
}
