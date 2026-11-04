"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectProps = {
  value: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  id?: string;
  name?: string;
  title?: string;
  disabled?: boolean;
  size?: "default" | "compact";
  appearance?: "light" | "dark";
  className?: string;
  menuClassName?: string;
  style?: CSSProperties;
  "aria-label"?: string;
};

type MenuPosition = { left: number; top: number; width: number; maxHeight: number };

export default function Select({
  value,
  options,
  onValueChange,
  id,
  name,
  title,
  disabled = false,
  size = "default",
  appearance = "light",
  className = "",
  menuClassName = "",
  style,
  "aria-label": ariaLabel,
}: SelectProps) {
  const generatedId = useId();
  const listboxId = `${generatedId}-listbox`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const selectedOption = options.find((option) => option.value === value);

  const getEnabledIndex = (start: number, direction: 1 | -1) => {
    if (!options.length) return -1;
    let index = start;
    for (let count = 0; count < options.length; count += 1) {
      if (index >= options.length) index = 0;
      if (index < 0) index = options.length - 1;
      if (!options[index].disabled) return index;
      index += direction;
    }
    return -1;
  };

  const updatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const margin = 12;
    const width = Math.min(Math.max(rect.width, 180), window.innerWidth - margin * 2);
    const viewportLeft = Math.min(Math.max(margin, rect.left), window.innerWidth - width - margin);
    const belowSpace = window.innerHeight - rect.bottom - margin;
    const aboveSpace = rect.top - margin;
    const openAbove = belowSpace < 240 && aboveSpace > belowSpace;
    const maxHeight = Math.max(96, Math.min(288, openAbove ? aboveSpace : belowSpace));
    // Use document coordinates so the portaled menu travels with the page
    // instead of staying fixed to the viewport while its trigger scrolls.
    const top = openAbove
      ? rect.top + window.scrollY - maxHeight - 8
      : rect.bottom + window.scrollY + 8;
    setPosition({ left: viewportLeft + window.scrollX, top, width, maxHeight });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    const handleResize = () => updatePosition();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    document.getElementById(`${listboxId}-option-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, listboxId, open]);

  const openMenu = (initialIndex = selectedIndex) => {
    setActiveIndex(getEnabledIndex(initialIndex, 1));
    setOpen(true);
  };

  const selectOption = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    onValueChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      if (!open) {
        openMenu(direction === 1 ? selectedIndex : getEnabledIndex(selectedIndex - 1, -1));
      } else {
        setActiveIndex((current) => getEnabledIndex(current + direction, direction));
      }
      return;
    }
    if ((event.key === "Enter" || event.key === " ") && !open) {
      event.preventDefault();
      openMenu();
      return;
    }
    if (event.key === "Home" && open) {
      event.preventDefault();
      setActiveIndex(getEnabledIndex(0, 1));
    } else if (event.key === "End" && open) {
      event.preventDefault();
      setActiveIndex(getEnabledIndex(options.length - 1, -1));
    } else if ((event.key === "Enter" || event.key === " ") && open) {
      event.preventDefault();
      selectOption(activeIndex);
    }
  };

  return (
    <>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={open && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
        title={title}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
        className={`flex min-w-0 items-center justify-between gap-3 border text-left shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
          size === "compact" ? "h-7 rounded-lg px-2 text-[11px]" : "h-10 rounded-xl px-3.5 text-sm"
        } ${
          appearance === "dark"
            ? "border-slate-700 bg-[#0F172A] text-slate-100 hover:border-slate-500 focus-visible:border-blue-400 focus-visible:ring-blue-400/30"
            : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 focus-visible:border-[#245FD4] focus-visible:ring-[#245FD4]/20"
        } ${className}`}
        style={style}
      >
        <span className="min-w-0 flex-1 truncate">{selectedOption?.label ?? value}</span>
        <svg
          className={`h-4 w-4 shrink-0 text-slate-500 opacity-70 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && position && typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            id={listboxId}
            role="listbox"
            aria-label={ariaLabel}
          className={`z-[45] overflow-y-auto rounded-xl border p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100 ${
            appearance === "dark"
              ? "border-slate-700 bg-[#0F172A] ring-1 ring-slate-950/30"
              : "border-slate-200 bg-white ring-1 ring-slate-950/5"
          } ${menuClassName}`}
            style={{
              position: "absolute",
              left: position.left,
              top: position.top,
              width: position.width,
              maxHeight: position.maxHeight,
            }}
          >
            {options.map((option, index) => {
              const selected = option.value === value;
              const active = index === activeIndex;
              return (
                <div
                  key={option.value}
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={selected}
                  aria-disabled={option.disabled || undefined}
                  onMouseMove={() => !option.disabled && setActiveIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectOption(index)}
                  className={`flex min-h-9 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    option.disabled
                      ? "cursor-not-allowed text-slate-400"
                      : appearance === "dark"
                      ? active
                        ? "bg-[#245FD4] font-semibold text-white"
                        : "text-slate-200 hover:bg-slate-800"
                      : active
                        ? "bg-blue-50 text-[#1243A3]"
                        : "text-slate-700 hover:bg-blue-50/80"
                  }`}
                >
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {selected && (
                    <svg className={`h-4 w-4 shrink-0 ${appearance === "dark" ? "text-white" : "text-[#245FD4]"}`} viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
