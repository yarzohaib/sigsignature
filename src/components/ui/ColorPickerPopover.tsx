"use client";

import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useId,
  useCallback,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import { createPortal } from "react-dom";
import { HexColorPicker } from "react-colorful";
import { SIGNATURE_COLOR_SWATCHES } from "@/lib/signatureConstants";
import { STUDIO_SOLID_COLORS } from "@/lib/studio/constants";

export interface ColorPickerPopoverProps {
  value: string;
  onChange: (hex: string) => void;
  label?: string;
  swatches?: readonly string[] | string[];
  disabled?: boolean;
  size?: "default" | "compact";
  className?: string;
  triggerClassName?: string;
}

export const DEFAULT_COLOR_SWATCHES: readonly string[] = Array.from(
  new Set<string>([...SIGNATURE_COLOR_SWATCHES, ...STUDIO_SOLID_COLORS])
);

/**
 * Normalizes a hex string (e.g. "abc", "#abc", "aabbcc", "#AABBCC") to a valid uppercase 6-digit hex string with leading #.
 * Returns null if the string is not a valid 3-digit or 6-digit hex color.
 */
export function normalizeHex(raw: string): string | null {
  if (!raw) return null;
  const trimmed = raw.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(trimmed)) {
    return null;
  }
  if (trimmed.length === 3) {
    const expanded = trimmed
      .split("")
      .map((ch) => ch + ch)
      .join("");
    return `#${expanded.toUpperCase()}`;
  }
  return `#${trimmed.toUpperCase()}`;
}

type MenuPosition = {
  left: number;
  top: number;
  openAbove: boolean;
};

export default function ColorPickerPopover({
  value,
  onChange,
  label = "Choose color",
  swatches = DEFAULT_COLOR_SWATCHES,
  disabled = false,
  size = "default",
  className = "",
  triggerClassName = "",
}: ColorPickerPopoverProps) {
  const generatedId = useId();
  const dialogId = `${generatedId}-dialog`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const hexInputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);

  // Current normalized color or fallback to standard blue
  const activeHex = normalizeHex(value) || "#245FD4";

  // Local draft text for the manual hex input field
  const [draftHexState, setDraftHexState] = useState<{
    color: string;
    draft: string;
    hasError: boolean;
  }>({
    color: activeHex,
    draft: activeHex,
    hasError: false,
  });

  // Derive draft hex: when not editing or external value changes, track activeHex
  const draftHex =
    !isOpen || draftHexState.color !== activeHex
      ? activeHex
      : draftHexState.draft;
  const inputError =
    isOpen && draftHexState.color === activeHex ? draftHexState.hasError : false;

  const setDraftHex = (draft: string, hasError = false) => {
    setDraftHexState({
      color: activeHex,
      draft,
      hasError,
    });
  };

  // Keep popover positioned relative to trigger
  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const margin = 12;
    const popoverWidth = 248; // Width of the popover card
    const popoverHeight = 310; // Approximate height of the popover card

    // Horizontal positioning: keep fully within viewport
    let left = rect.left;
    if (left + popoverWidth > window.innerWidth - margin) {
      left = Math.max(margin, window.innerWidth - popoverWidth - margin);
    }
    left = Math.max(margin, left);

    // Vertical positioning: flip above if not enough space below
    const spaceBelow = window.innerHeight - rect.bottom - margin;
    const spaceAbove = rect.top - margin;
    const openAbove = spaceBelow < popoverHeight && spaceAbove > spaceBelow;

    const top = openAbove
      ? rect.top + window.scrollY - popoverHeight - 8
      : rect.bottom + window.scrollY + 8;

    setPosition({
      left: left + window.scrollX,
      top,
      openAbove,
    });
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePosition();
    const handleScrollOrResize = () => updatePosition();
    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);
    return () => {
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
    };
  }, [isOpen, updatePosition]);

  // Click outside handling
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (
        triggerRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  // Handle color change from saturation/hue slider
  const handlePickerChange = (newHex: string) => {
    const normalized = normalizeHex(newHex);
    if (normalized) {
      setDraftHex(normalized, false);
      onChange(normalized);
    }
  };

  // Handle manual typing in hex input
  const handleHexInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const normalized = normalizeHex(raw);
    if (normalized) {
      setDraftHex(raw, false);
      onChange(normalized);
    } else {
      setDraftHex(raw, true);
    }
  };

  // Commit and format on blur
  const handleHexInputBlur = () => {
    const normalized = normalizeHex(draftHex);
    if (normalized) {
      setDraftHex(normalized, false);
      onChange(normalized);
    } else {
      // Revert to current valid color
      setDraftHex(activeHex, false);
    }
  };

  // Commit on Enter inside hex input
  const handleHexInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleHexInputBlur();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  // Keyboard controls on trigger & popover
  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === "Escape" && isOpen) {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  const handlePopoverKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "Tab") {
      // Check if tabbing out of the popover
      const focusable = popoverRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable && focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          setIsOpen(false);
        } else if (!e.shiftKey && document.activeElement === last) {
          setIsOpen(false);
        }
      }
    }
  };

  const isTriggerCompact = size === "compact";

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* TRIGGER BUTTON (in-page swatch button) */}
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? dialogId : undefined}
        title={`${label}: ${activeHex}`}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className={`relative flex shrink-0 items-center justify-center overflow-hidden border transition-all select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#245FD4] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          isTriggerCompact
            ? "h-8 w-8 rounded-lg border-slate-300 hover:scale-105"
            : "h-10 w-10 rounded-xl border-slate-200 shadow-2xs hover:scale-105"
        } ${triggerClassName}`}
        style={{ backgroundColor: activeHex }}
      >
        <span className="sr-only">
          {label}: {activeHex}
        </span>
      </button>

      {/* PORTALED POPOVER */}
      {isOpen &&
        position &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={popoverRef}
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            onKeyDown={handlePopoverKeyDown}
            style={{
              position: "absolute",
              left: `${position.left}px`,
              top: `${position.top}px`,
              width: "248px",
            }}
            className="z-[9999] rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xl ring-1 ring-slate-900/5 transition-all animate-in fade-in zoom-in-95 duration-100 select-none"
          >
            {/* Custom styling override for react-colorful */}
            <div className="color-picker-wrapper mb-3 w-full">
              <HexColorPicker
                color={activeHex}
                onChange={handlePickerChange}
              />
            </div>

            {/* HEX INPUT & ACTIVE SWATCH PREVIEW */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="h-8 w-8 shrink-0 rounded-lg border border-slate-200 shadow-2xs"
                style={{ backgroundColor: activeHex }}
                title={`Active: ${activeHex}`}
              />
              <div className="relative flex-1">
                <input
                  ref={hexInputRef}
                  type="text"
                  value={draftHex}
                  maxLength={7}
                  onChange={handleHexInputChange}
                  onBlur={handleHexInputBlur}
                  onKeyDown={handleHexInputKeyDown}
                  placeholder="#000000"
                  aria-label="Hex color value"
                  className={`w-full h-8 rounded-lg border px-2.5 text-xs font-mono font-medium uppercase text-slate-800 transition focus:outline-none focus:ring-2 ${
                    inputError
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                      : "border-slate-200 focus:border-[#245FD4] focus:ring-blue-100"
                  }`}
                  style={{ fontFamily: "ui-monospace, monospace" }}
                />
              </div>
            </div>

            {/* SWATCHES ROW */}
            {swatches && swatches.length > 0 && (
              <div>
                <div
                  className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  Swatches
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {swatches.map((swatchHex) => {
                    const normalizedSwatch = normalizeHex(swatchHex) || swatchHex;
                    const isSelected =
                      activeHex.toLowerCase() === normalizedSwatch.toLowerCase();
                    return (
                      <button
                        key={swatchHex}
                        type="button"
                        onClick={() => {
                          onChange(normalizedSwatch);
                          setDraftHex(normalizedSwatch);
                          setInputError(false);
                        }}
                        title={normalizedSwatch}
                        aria-label={`Select ${normalizedSwatch}`}
                        className={`h-5 w-5 rounded-md border transition-transform hover:scale-110 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                          isSelected
                            ? "ring-2 ring-[#245FD4] ring-offset-1 border-white scale-110"
                            : "border-slate-200 hover:border-slate-400"
                        }`}
                        style={{ backgroundColor: normalizedSwatch }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
