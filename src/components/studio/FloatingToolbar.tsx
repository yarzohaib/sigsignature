"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  useSyncExternalStore,
  ChangeEvent,
  RefObject,
} from "react";
import { createPortal } from "react-dom";

export type CanvasAlignment = "left" | "center" | "right" | "top" | "middle" | "bottom";

export type TeamFieldBind = "name" | "jobTitle" | "email" | "phone" | "photo";

interface FloatingToolbarProps {
  elementType?: "text" | "image" | "logo" | "banner" | "divider" | "cta" | "social";
  bold?: boolean;
  onToggleBold?: () => void;
  size?: "sm" | "md" | "lg";
  onSizeChange?: (size: "sm" | "md" | "lg") => void;
  url?: string;
  onUrlChange?: (url: string) => void;
  width?: number;
  onWidthChange?: (width: number) => void;
  orientation?: "horizontal" | "vertical";
  onOrientationChange?: (orientation: "horizontal" | "vertical") => void;
  thickness?: number;
  onThicknessChange?: (thickness: number) => void;
  onReplaceMedia?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onAlignCanvas?: (alignment: CanvasAlignment) => void;
  locked?: boolean;
  onToggleLock?: () => void;
  onEditDetails?: () => void;
  elementId?: string | null;
  x?: number;
  y?: number;
  h?: number;
  zoom?: number;
  anchorRef?: RefObject<HTMLElement | null>;
  anchorEl?: HTMLElement | null;
  bind?: TeamFieldBind;
  onBindChange?: (bind: TeamFieldBind | null) => void;
}

const emptySubscribe = () => () => {};

export default function FloatingToolbar({
  elementType,
  bold,
  onToggleBold,
  size = "md",
  onSizeChange,
  url,
  onUrlChange,
  width,
  onWidthChange,
  orientation = "horizontal",
  onOrientationChange,
  thickness = 1,
  onThicknessChange,
  onReplaceMedia,
  onDuplicate,
  onDelete,
  onAlignCanvas,
  locked = false,
  onToggleLock,
  onEditDetails,
  elementId,
  x,
  y,
  h,
  zoom,
  anchorRef,
  anchorEl,
  bind,
  onBindChange,
}: FloatingToolbarProps) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [openMenu, setOpenMenu] = useState<
    "align" | "link" | "size" | "thickness" | "teamField" | null
  >(null);

  const sentinelRef = useRef<HTMLSpanElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const linkButtonRef = useRef<HTMLButtonElement>(null);
  const linkPopoverRef = useRef<HTMLDivElement>(null);

  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    isVisible: boolean;
  }>({
    top: -9999,
    left: -9999,
    isVisible: false,
  });

  const [popoverCoords, setPopoverCoords] = useState<{
    top: number;
    left: number;
  }>({
    top: -9999,
    left: -9999,
  });

  // Compute Toolbar fixed coordinates
  const updatePosition = useCallback(() => {
    const targetEl =
      anchorRef?.current ||
      anchorEl ||
      (elementId ? document.getElementById(`free-el-${elementId}`) : null) ||
      sentinelRef.current?.parentElement;
    if (!targetEl || !toolbarRef.current) {
      setCoords((prev) => (prev.isVisible ? { ...prev, isVisible: false } : prev));
      return;
    }

    const rect = targetEl.getBoundingClientRect();
    const toolbarEl = toolbarRef.current;
    const toolbarWidth = toolbarEl.offsetWidth || 340;
    const toolbarHeight = toolbarEl.offsetHeight || 38;

    const topbar = document.querySelector("header");
    const topbarHeight = topbar ? topbar.getBoundingClientRect().bottom : 66;

    const toolsPanel = document.querySelector("aside");
    const toolsPanelRight = toolsPanel ? toolsPanel.getBoundingClientRect().right : 0;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Hide toolbar when the selected element is scrolled completely out of the canvas view
    const isOutOfView =
      rect.bottom <= topbarHeight ||
      rect.top >= viewportHeight ||
      rect.right <= toolsPanelRight ||
      rect.left >= viewportWidth;

    if (isOutOfView) {
      setCoords((prev) => (prev.isVisible ? { ...prev, isVisible: false } : prev));
      return;
    }

    // Top: Centered above element with 8px gap.
    // If not enough room above (top < topbar height + 8), place below element instead.
    const roomAbove = rect.top - toolbarHeight - 8;
    const minTopAllowed = topbarHeight + 8;

    let top: number;
    if (roomAbove < minTopAllowed) {
      top = rect.bottom + 8;
    } else {
      top = roomAbove;
    }

    // Clamp so it does not overflow bottom
    if (top + toolbarHeight > viewportHeight - 8) {
      top = Math.max(minTopAllowed, viewportHeight - toolbarHeight - 8);
    }

    // Left: Centered horizontally with element
    let left = rect.left + rect.width / 2 - toolbarWidth / 2;

    const minViewportLeft = 8;
    const maxViewportLeft = Math.max(8, viewportWidth - toolbarWidth - 8);

    const effectiveMinLeft =
      rect.left < toolsPanelRight ? toolsPanelRight + 8 : minViewportLeft;

    left = Math.max(effectiveMinLeft, Math.min(left, maxViewportLeft));

    setCoords({
      top: Math.round(top),
      left: Math.round(left),
      isVisible: true,
    });
  }, [anchorRef, anchorEl, elementId]);

  // Compute Link Popover fixed coordinates
  const updatePopoverPosition = useCallback(() => {
    if (!linkButtonRef.current) return;
    const btnRect = linkButtonRef.current.getBoundingClientRect();
    const popoverWidth = 290;
    const popoverHeight = 135;

    let popoverLeft = btnRect.left + btnRect.width / 2 - popoverWidth / 2;
    popoverLeft = Math.max(8, Math.min(popoverLeft, window.innerWidth - popoverWidth - 8));

    let popoverTop = btnRect.bottom + 8;
    if (popoverTop + popoverHeight > window.innerHeight - 8) {
      popoverTop = Math.max(8, btnRect.top - popoverHeight - 8);
    }

    setPopoverCoords({
      top: Math.round(popoverTop),
      left: Math.round(popoverLeft),
    });
  }, []);

  // Update popover position when opened
  useEffect(() => {
    if (openMenu === "link") {
      updatePopoverPosition();
    }
  }, [openMenu, updatePopoverPosition, coords]);

  // Close menus on outside click or escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenMenu(null);
      }
    }

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(target) &&
        linkPopoverRef.current &&
        !linkPopoverRef.current.contains(target)
      ) {
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

  // Recalculate on scroll, resize, element changes with requestAnimationFrame
  useEffect(() => {
    let animFrame: number;

    const handleThrottledUpdate = () => {
      cancelAnimationFrame(animFrame);
      animFrame = requestAnimationFrame(() => {
        updatePosition();
      });
    };

    handleThrottledUpdate();

    window.addEventListener("scroll", handleThrottledUpdate, true);
    window.addEventListener("resize", handleThrottledUpdate);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("scroll", handleThrottledUpdate, true);
      window.removeEventListener("resize", handleThrottledUpdate);
    };
  }, [updatePosition, x, y, width, h, zoom]);

  const [prevUrl, setPrevUrl] = useState(url);
  const [inputUrl, setInputUrl] = useState(url || "");

  if (url !== prevUrl) {
    setPrevUrl(url);
    setInputUrl(url || "");
  }

  const hasLinkSupport =
    elementType === "text" ||
    elementType === "image" ||
    elementType === "logo" ||
    elementType === "banner" ||
    elementType === "cta";

  const isTeamFieldSupported = elementType === "text" || elementType === "image";

  const teamFieldOptions = useMemo(() => {
    if (elementType === "text") {
      return [
        { label: "None", value: null },
        { label: "Name", value: "name" as const },
        { label: "Job title", value: "jobTitle" as const },
        { label: "Email", value: "email" as const },
        { label: "Phone", value: "phone" as const },
      ];
    }
    if (elementType === "image") {
      return [
        { label: "None", value: null },
        { label: "Photo", value: "photo" as const },
      ];
    }
    return [];
  }, [elementType]);

  const currentBindLabel = useMemo(() => {
    if (!bind) return null;
    switch (bind) {
      case "name":
        return "Name";
      case "jobTitle":
        return "Job title";
      case "email":
        return "Email";
      case "phone":
        return "Phone";
      case "photo":
        return "Photo";
      default:
        return null;
    }
  }, [bind]);

  return (
    <>
      <span ref={sentinelRef} className="hidden" aria-hidden="true" />

      {mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={toolbarRef}
            data-floating-toolbar
            role="toolbar"
            aria-label="Selection toolbar"
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 60,
              visibility: coords.isVisible ? "visible" : "hidden",
              opacity: coords.isVisible ? 1 : 0,
              pointerEvents: coords.isVisible ? "auto" : "none",
            }}
            className="flex items-center bg-[#1E293B] text-white px-2 py-1 rounded-xl shadow-xl select-none border border-slate-700/60 max-w-[95vw] overflow-visible transition-opacity duration-75"
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {/* TEXT SPECIFIC: BOLD & SIZE */}
            {elementType === "text" && (
              <>
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

            {/* DIVIDER SPECIFIC: ORIENTATION & THICKNESS */}
            {elementType === "divider" && (
              <>
                <button
                  type="button"
                  aria-label="Divider Orientation"
                  title={`Orientation: ${orientation === "vertical" ? "Vertical" : "Horizontal"}`}
                  onClick={() =>
                    onOrientationChange?.(orientation === "vertical" ? "horizontal" : "vertical")
                  }
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

            {/* WIDTH CONTROLS (minus and plus in px) */}
            {onWidthChange && (
              <>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Decrease width"
                    title="Decrease width"
                    onClick={() => onWidthChange(Math.max(16, (width || 200) - 20))}
                    className="flex h-6 w-6 items-center justify-center rounded text-slate-300 hover:text-white hover:bg-slate-700/60 text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="text-[11px] font-semibold text-slate-300 min-w-[38px] text-center">
                    {width ? `${width}px` : "auto"}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase width"
                    title="Increase width"
                    onClick={() => onWidthChange(Math.min(600, (width || 200) + 20))}
                    className="flex h-6 w-6 items-center justify-center rounded text-slate-300 hover:text-white hover:bg-slate-700/60 text-xs font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="h-3.5 w-[1px] bg-slate-700 mx-1 shrink-0" />
              </>
            )}

            {/* TEAM FIELD (Text & Image elements) */}
            {isTeamFieldSupported && (
              <>
                <div className="relative">
                  <button
                    type="button"
                    aria-label="Link to team field"
                    title={currentBindLabel ? `Linked to: ${currentBindLabel}` : "Link to team field"}
                    onClick={() =>
                      setOpenMenu((prev) => (prev === "teamField" ? null : "teamField"))
                    }
                    className={`flex h-7 px-2 items-center gap-1.5 rounded text-xs font-semibold transition focus:outline-none focus:ring-1 focus:ring-blue-400 ${
                      currentBindLabel
                        ? "bg-[#245FD4]/30 text-blue-200 border border-[#245FD4]/50"
                        : "text-slate-200 hover:text-white hover:bg-slate-700/60"
                    }`}
                  >
                    <svg
                      className="h-3.5 w-3.5 text-blue-400 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-[11px] font-medium whitespace-nowrap">
                      {currentBindLabel ? currentBindLabel : "Team field"}
                    </span>
                    <svg
                      className="h-3 w-3 text-slate-400 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {openMenu === "teamField" && (
                    <div className="absolute top-full mt-2 left-0 z-50 flex flex-col min-w-[130px] rounded-lg bg-[#0F172A] p-1 shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1">
                        Team field
                      </div>
                      {teamFieldOptions.map((opt) => {
                        const isCurrent = (bind || null) === opt.value;
                        return (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() => {
                              onBindChange?.(opt.value);
                              setOpenMenu(null);
                            }}
                            className={`flex items-center justify-between rounded px-2.5 py-1.5 text-xs text-left transition ${
                              isCurrent
                                ? "bg-[#245FD4] text-white font-bold"
                                : "text-slate-200 hover:bg-slate-800 hover:text-white"
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isCurrent && (
                              <svg
                                className="h-3 w-3 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="h-3.5 w-[1px] bg-slate-700 mx-1 shrink-0" />
              </>
            )}

            {/* ADD LINK (Optional: images, logo, banner, cta, text) */}
            {hasLinkSupport && (
              <>
                <div className="relative">
                  <button
                    ref={linkButtonRef}
                    type="button"
                    aria-label={url?.trim() ? "Edit link" : "Add link (optional)"}
                    title={url?.trim() ? `Links to: ${url}` : "Add link (optional)"}
                    onClick={() => setOpenMenu((prev) => (prev === "link" ? null : "link"))}
                    className="flex h-7 px-2 items-center gap-1.5 rounded text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-700/60 transition focus:outline-none focus:ring-1 focus:ring-blue-400"
                  >
                    {url?.trim() ? (
                      <>
                        <svg className="h-3 w-3 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="text-[11px] font-semibold text-slate-200">Link set</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-3.5 w-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        <span className="text-[11px] font-semibold text-slate-300">Add link (optional)</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="h-3.5 w-[1px] bg-slate-700 mx-1 shrink-0" />
              </>
            )}

            {/* REPLACE MEDIA (for image, logo, banner) */}
            {(elementType === "image" || elementType === "logo" || elementType === "banner") && onReplaceMedia && (
              <>
                <button
                  type="button"
                  aria-label="Replace file"
                  title="Replace media file"
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

            {/* EDIT DETAILS (for text or social) */}
            {onEditDetails && (elementType === "text" || elementType === "social") && (
              <>
                <button
                  type="button"
                  aria-label="Edit details"
                  title="Edit details"
                  onClick={onEditDetails}
                  className="flex h-7 px-2 items-center gap-1 rounded text-slate-200 hover:text-white hover:bg-slate-700/60 text-[11px] font-medium transition"
                >
                  <svg className="h-3.5 w-3.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  <span>Edit</span>
                </button>

                <div className="h-3.5 w-[1px] bg-slate-700 mx-1 shrink-0" />
              </>
            )}

            {/* ALIGN TO CANVAS (Dropdown: Left, Center, Right, Top, Middle, Bottom) */}
            {onAlignCanvas && (
              <>
                <div className="relative">
                  <button
                    type="button"
                    aria-label="Align to canvas"
                    title="Align to canvas"
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
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-40 grid grid-cols-2 gap-1 min-w-[170px] rounded-lg bg-[#0F172A] p-1.5 shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95 duration-100">
                      {[
                        { id: "left", label: "Left" },
                        { id: "center", label: "Center" },
                        { id: "right", label: "Right" },
                        { id: "top", label: "Top" },
                        { id: "middle", label: "Middle" },
                        { id: "bottom", label: "Bottom" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            onAlignCanvas(item.id as CanvasAlignment);
                            setOpenMenu(null);
                          }}
                          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-slate-200 hover:bg-slate-800 hover:text-white transition"
                        >
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="h-3.5 w-[1px] bg-slate-700 mx-1 shrink-0" />
              </>
            )}

            {/* LOCK TOGGLE (Replaces layers icon; note in summary this is the only visual deviation from Figma) */}
            {onToggleLock && (
              <>
                <button
                  type="button"
                  aria-label={locked ? "Unlock element" : "Lock element"}
                  title={locked ? "Unlock element" : "Lock element"}
                  onClick={onToggleLock}
                  className={`flex h-7 w-7 items-center justify-center rounded transition focus:outline-none focus:ring-1 focus:ring-blue-400 ${
                    locked
                      ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                      : "text-slate-200 hover:text-white hover:bg-slate-700/60"
                  }`}
                >
                  {locked ? (
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  ) : (
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                    </svg>
                  )}
                </button>

                <div className="h-3.5 w-[1px] bg-slate-700 mx-1 shrink-0" />
              </>
            )}

            {/* DUPLICATE */}
            {onDuplicate && (
              <>
                <button
                  type="button"
                  aria-label="Duplicate item"
                  title="Duplicate item"
                  onClick={onDuplicate}
                  className="flex h-7 w-7 items-center justify-center rounded text-slate-200 hover:text-white hover:bg-slate-700/60 transition focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>

                <div className="h-3.5 w-[1px] bg-slate-700 mx-1 shrink-0" />
              </>
            )}

            {/* DELETE (DEL in red) */}
            {onDelete && (
              <button
                type="button"
                aria-label="Delete item"
                title="Delete item"
                onClick={onDelete}
                className="flex h-7 px-2 items-center justify-center rounded text-[11px] font-bold text-[#EF4444] hover:bg-red-500/10 transition focus:outline-none focus:ring-1 focus:ring-red-400"
              >
                DEL
              </button>
            )}
          </div>,
          document.body
        )}

      {/* PORTALED LINK POPOVER */}
      {mounted &&
        openMenu === "link" &&
        hasLinkSupport &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={linkPopoverRef}
            role="dialog"
            aria-label="Set link URL"
            style={{
              position: "fixed",
              top: `${popoverCoords.top}px`,
              left: `${popoverCoords.left}px`,
              zIndex: 65,
            }}
            className="w-[290px] rounded-xl bg-[#0F172A] p-3 shadow-2xl border border-slate-700 text-white animate-in fade-in zoom-in-95 duration-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-200">Element Link URL</span>
              <button
                type="button"
                onClick={() => setOpenMenu(null)}
                className="text-slate-400 hover:text-white text-xs px-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mt-2.5">
              <input
                type="text"
                value={inputUrl}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setInputUrl(e.target.value)}
                placeholder="https://example.com (optional)"
                className="w-full rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-blue-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onUrlChange?.(inputUrl);
                    setOpenMenu(null);
                  }
                }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setInputUrl("");
                  onUrlChange?.("");
                  setOpenMenu(null);
                }}
                className="text-[11px] text-slate-400 hover:text-red-400 transition"
              >
                Remove link
              </button>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setOpenMenu(null)}
                  className="rounded-lg px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUrlChange?.(inputUrl);
                    setOpenMenu(null);
                  }}
                  className="rounded-lg bg-[#245FD4] px-3 py-1 text-xs font-semibold text-white hover:bg-blue-600 transition"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
