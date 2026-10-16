"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  StudioSignatureData,
  FreeElement,
} from "@/types/studio";
import { StudioAction } from "@/lib/studio/types";
import { THEME_PRESETS, getShapeBorderRadius } from "@/lib/studio/shared";
import {
  rectsOverlap,
  clampToCanvas,
  snap,
  resolveOverlap,
  Rect,
} from "@/lib/studio/free/geometry";
import FreeElementView, { ResizeHandle } from "./FreeElementView";

interface FreeCanvasProps {
  data: StudioSignatureData;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  dispatch: (action: StudioAction) => void;
  zoom: number;
  onToast: (msg: string, isError?: boolean) => void;
}

interface DragState {
  elementId: string;
  pointerId: number;
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  currentX: number;
  currentY: number;
  w: number;
  h: number;
}

interface ResizeState {
  elementId: string;
  handle: ResizeHandle;
  pointerId: number;
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  origW: number;
  origH: number;
  aspectRatio: number;
  currentRect: Rect;
}

interface BottomDragState {
  pointerId: number;
  startY: number;
  startH: number;
}

interface GuideLine {
  type: "vertical" | "horizontal";
  position: number;
}

export default function FreeCanvas({
  data,
  selectedId,
  onSelect,
  dispatch,
  zoom,
  onToast,
}: FreeCanvasProps) {
  const canvasWidth = data.canvas?.width || 600;
  const canvasHeight = data.canvas?.height || 200;
  const elements = useMemo(() => data.elements || [], [data.elements]);

  const [dragState, setDragState] = useState<DragState | null>(null);
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);
  const [bottomDragState, setBottomDragState] = useState<BottomDragState | null>(null);
  const [guides, setGuides] = useState<GuideLine[]>([]);
  const [isColliding, setIsColliding] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const scale = zoom / 100;

  const themeKey = data.design?.theme || "corporate";
  const theme = THEME_PRESETS[themeKey] || THEME_PRESETS.corporate;
  const shape = data.design?.shape || "rounded";
  const cardRadius = getShapeBorderRadius(shape, "card");

  // Auto-grow canvas height if elements exceed bottom + 24
  useEffect(() => {
    if (elements.length === 0) return;
    const lowestBottom = elements.reduce((max, el) => Math.max(max, el.y + el.h), 0);
    const requiredMin = Math.max(120, Math.min(480, lowestBottom + 24));
    if (canvasHeight < requiredMin) {
      dispatch({ type: "SET_CANVAS_HEIGHT", payload: { height: requiredMin } });
    }
  }, [elements, canvasHeight, dispatch]);

  // Keyboard navigation & shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (!selectedId) return;
      const selectedEl = elements.find((el) => el.id === selectedId);
      if (!selectedEl) return;

      if (e.key === "Escape") {
        onSelect(null);
        return;
      }

      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        dispatch({ type: "REMOVE_ELEMENT", payload: { id: selectedId } });
        onSelect(null);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && (e.key === "d" || e.key === "D")) {
        e.preventDefault();
        dispatch({ type: "DUPLICATE_ELEMENT", payload: { id: selectedId } });
        return;
      }

      // Arrow keys nudge
      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      ) {
        e.preventDefault();
        if (selectedEl.locked) return;
        const step = e.shiftKey ? 10 : 1;
        let dx = 0;
        let dy = 0;
        if (e.key === "ArrowLeft") dx = -step;
        if (e.key === "ArrowRight") dx = step;
        if (e.key === "ArrowUp") dy = -step;
        if (e.key === "ArrowDown") dy = step;

        const newX = selectedEl.x + dx;
        const newY = selectedEl.y + dy;
        const candidate: Rect = {
          x: newX,
          y: newY,
          w: selectedEl.w,
          h: selectedEl.h,
        };
        const others = elements.filter((el) => el.id !== selectedId);

        if (
          candidate.x < 0 ||
          candidate.x + candidate.w > canvasWidth ||
          candidate.y < 0 ||
          candidate.y + candidate.h > canvasHeight
        ) {
          return;
        }

        const hasOverlap = others.some((other) => rectsOverlap(candidate, other));
        if (!hasOverlap) {
          dispatch({
            type: "MOVE_ELEMENT",
            payload: { id: selectedId, x: newX, y: newY },
          });
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, elements, canvasWidth, canvasHeight, dispatch, onSelect]);

  // Handle Drag Start
  const handleStartDrag = useCallback(
    (id: string, e: React.PointerEvent) => {
      const el = elements.find((item) => item.id === id);
      if (!el || el.locked) return;

      e.stopPropagation();
      try {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      setDragState({
        elementId: id,
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        origX: el.x,
        origY: el.y,
        currentX: el.x,
        currentY: el.y,
        w: el.w,
        h: el.h,
      });
      setIsColliding(false);
      setGuides([]);
    },
    [elements]
  );

  // Handle Resize Start
  const handleStartResize = useCallback(
    (id: string, handle: ResizeHandle, e: React.PointerEvent) => {
      const el = elements.find((item) => item.id === id);
      if (!el || el.locked) return;

      e.stopPropagation();
      try {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      setResizeState({
        elementId: id,
        handle,
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        origX: el.x,
        origY: el.y,
        origW: el.w,
        origH: el.h,
        aspectRatio: el.w / Math.max(1, el.h),
        currentRect: { x: el.x, y: el.y, w: el.w, h: el.h },
      });
      setIsColliding(false);
    },
    [elements]
  );

  // Pointer Move (Drag or Resize)
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      // 1. Dragging
      if (dragState && dragState.pointerId === e.pointerId) {
        const deltaX = (e.clientX - dragState.startX) / scale;
        const deltaY = (e.clientY - dragState.startY) / scale;

        let candX = dragState.origX + deltaX;
        let candY = dragState.origY + deltaY;

        if (!e.altKey) {
          candX = snap(candX, 4);
          candY = snap(candY, 4);
        }

        // Clamp to canvas boundaries
        candX = Math.max(0, Math.min(canvasWidth - dragState.w, candX));
        candY = Math.max(0, Math.min(canvasHeight - dragState.h, candY));

        // Alignment guides calculation
        const newGuides: GuideLine[] = [];
        const others = elements.filter((el) => el.id !== dragState.elementId);
        const candCenter = candX + dragState.w / 2;
        const candMiddle = candY + dragState.h / 2;
        const candRight = candX + dragState.w;
        const candBottom = candY + dragState.h;

        // Snap to canvas center
        const canvasCenterX = canvasWidth / 2;
        if (Math.abs(candCenter - canvasCenterX) <= 4 && !e.altKey) {
          candX = canvasCenterX - dragState.w / 2;
          newGuides.push({ type: "vertical", position: canvasCenterX });
        }

        // Check neighbor alignment lines
        for (const o of others) {
          const oCenter = o.x + o.w / 2;
          const oMiddle = o.y + o.h / 2;
          const oRight = o.x + o.w;
          const oBottom = o.y + o.h;

          // X alignments
          if (Math.abs(candX - o.x) <= 3) {
            newGuides.push({ type: "vertical", position: o.x });
          } else if (Math.abs(candRight - oRight) <= 3) {
            newGuides.push({ type: "vertical", position: oRight });
          } else if (Math.abs(candCenter - oCenter) <= 3) {
            newGuides.push({ type: "vertical", position: oCenter });
          }

          // Y alignments
          if (Math.abs(candY - o.y) <= 3) {
            newGuides.push({ type: "horizontal", position: o.y });
          } else if (Math.abs(candBottom - oBottom) <= 3) {
            newGuides.push({ type: "horizontal", position: oBottom });
          } else if (Math.abs(candMiddle - oMiddle) <= 3) {
            newGuides.push({ type: "horizontal", position: oMiddle });
          }
        }

        // Collision check
        const candidateRect: Rect = {
          x: candX,
          y: candY,
          w: dragState.w,
          h: dragState.h,
        };
        const colliding = others.some((other) => rectsOverlap(candidateRect, other));

        setDragState((prev) => (prev ? { ...prev, currentX: candX, currentY: candY } : null));
        setIsColliding(colliding);
        setGuides(newGuides);
        return;
      }

      // 2. Resizing
      if (resizeState && resizeState.pointerId === e.pointerId) {
        const deltaX = (e.clientX - resizeState.startX) / scale;
        const deltaY = (e.clientY - resizeState.startY) / scale;
        const el = elements.find((item) => item.id === resizeState.elementId);
        if (!el) return;

        let nextX = resizeState.origX;
        let nextY = resizeState.origY;
        let nextW = resizeState.origW;
        let nextH = resizeState.origH;

        const isMedia = el.type === "image" || el.type === "logo" || el.type === "banner";
        const h = resizeState.handle;

        if (h.includes("e")) {
          nextW = Math.max(8, resizeState.origW + deltaX);
        }
        if (h.includes("s")) {
          nextH = Math.max(8, resizeState.origH + deltaY);
        }
        if (h.includes("w")) {
          const wCandidate = Math.max(8, resizeState.origW - deltaX);
          nextX = resizeState.origX + (resizeState.origW - wCandidate);
          nextW = wCandidate;
        }
        if (h.includes("n")) {
          const hCandidate = Math.max(8, resizeState.origH - deltaY);
          nextY = resizeState.origY + (resizeState.origH - hCandidate);
          nextH = hCandidate;
        }

        // Maintain aspect ratio for corner media handles
        if (isMedia && (h === "nw" || h === "ne" || h === "se" || h === "sw")) {
          nextH = Math.max(8, Math.round(nextW / resizeState.aspectRatio));
        }

        if (!e.altKey) {
          nextW = snap(nextW, 4);
          nextH = snap(nextH, 4);
          nextX = snap(nextX, 4);
          nextY = snap(nextY, 4);
        }

        // Clamp to canvas bounds
        const clamped = clampToCanvas(
          { x: nextX, y: nextY, w: nextW, h: nextH },
          { width: canvasWidth, height: canvasHeight }
        );

        const others = elements.filter((item) => item.id !== resizeState.elementId);
        const colliding = others.some((other) => rectsOverlap(clamped, other));

        setResizeState((prev) => (prev ? { ...prev, currentRect: clamped } : null));
        setIsColliding(colliding);
        return;
      }

      // 3. Bottom canvas height drag
      if (bottomDragState && bottomDragState.pointerId === e.pointerId) {
        const deltaY = (e.clientY - bottomDragState.startY) / scale;
        const lowestBottom = elements.reduce((max, item) => Math.max(max, item.y + item.h), 0);
        const minH = Math.max(120, lowestBottom + 24);
        const newH = Math.max(minH, Math.min(480, Math.round(bottomDragState.startH + deltaY)));
        dispatch({ type: "SET_CANVAS_HEIGHT", payload: { height: newH } });
      }
    },
    [
      dragState,
      resizeState,
      bottomDragState,
      scale,
      canvasWidth,
      canvasHeight,
      elements,
      dispatch,
    ]
  );

  // Pointer Up (Release Drag or Resize)
  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      // 1. Release Drag
      if (dragState && dragState.pointerId === e.pointerId) {
        const movedEl = elements.find((item) => item.id === dragState.elementId);
        if (movedEl) {
          const others = elements.filter((item) => item.id !== dragState.elementId);
          const candidate: FreeElement = {
            ...movedEl,
            x: dragState.currentX,
            y: dragState.currentY,
          };

          const hasOverlap = others.some((other) => rectsOverlap(candidate, other));

          if (hasOverlap) {
            // Attempt resolveOverlap
            const resolved = resolveOverlap(
              candidate,
              others,
              { width: canvasWidth, height: canvasHeight },
              { x: dragState.origX, y: dragState.origY }
            );

            if (resolved.x === dragState.origX && resolved.y === dragState.origY) {
              onToast("Elements cannot overlap in email signatures", true);
            } else {
              dispatch({
                type: "MOVE_ELEMENT",
                payload: { id: movedEl.id, x: resolved.x, y: resolved.y },
              });
            }
          } else {
            dispatch({
              type: "MOVE_ELEMENT",
              payload: { id: movedEl.id, x: candidate.x, y: candidate.y },
            });
          }
        }

        setDragState(null);
        setIsColliding(false);
        setGuides([]);
        return;
      }

      // 2. Release Resize
      if (resizeState && resizeState.pointerId === e.pointerId) {
        const resizedEl = elements.find((item) => item.id === resizeState.elementId);
        if (resizedEl) {
          const others = elements.filter((item) => item.id !== resizeState.elementId);
          const candidate: FreeElement = {
            ...resizedEl,
            ...resizeState.currentRect,
          };

          const hasOverlap = others.some((other) => rectsOverlap(candidate, other));

          if (hasOverlap) {
            onToast("Elements cannot overlap in email signatures", true);
          } else {
            dispatch({
              type: "RESIZE_ELEMENT",
              payload: {
                id: resizedEl.id,
                x: candidate.x,
                y: candidate.y,
                w: candidate.w,
                h: candidate.h,
              },
            });
          }
        }

        setResizeState(null);
        setIsColliding(false);
        return;
      }

      // 3. Release Bottom Height Drag
      if (bottomDragState && bottomDragState.pointerId === e.pointerId) {
        setBottomDragState(null);
      }
    },
    [
      dragState,
      resizeState,
      bottomDragState,
      elements,
      canvasWidth,
      canvasHeight,
      dispatch,
      onToast,
    ]
  );

  // Start Bottom Drag
  function handleBottomDragStart(e: React.PointerEvent) {
    e.stopPropagation();
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setBottomDragState({
      pointerId: e.pointerId,
      startY: e.clientY,
      startH: canvasHeight,
    });
  }

  // Handle Text Growth (push down intersecting elements below)
  function handleTextGrowth(textId: string, deltaH: number) {
    if (deltaH <= 0) return;
    const textEl = elements.find((el) => el.id === textId);
    if (!textEl || textEl.type !== "text") return;

    // Elements horizontally intersecting and below the text box
    const elementsToPush = elements.filter(
      (other) =>
        other.id !== textId &&
        other.x < textEl.x + textEl.w &&
        other.x + other.w > textEl.x &&
        other.y >= textEl.y + textEl.h
    );

    // Update text element height
    dispatch({
      type: "RESIZE_ELEMENT",
      payload: {
        id: textId,
        x: textEl.x,
        y: textEl.y,
        w: textEl.w,
        h: textEl.h + deltaH,
      },
    });

    // Push each intersecting element down
    for (const pushEl of elementsToPush) {
      dispatch({
        type: "MOVE_ELEMENT",
        payload: {
          id: pushEl.id,
          x: pushEl.x,
          y: Math.min(480 - pushEl.h, pushEl.y + deltaH),
        },
      });
    }
  }

  const isInteracting = Boolean(dragState || resizeState);

  return (
    <div
      className="relative flex flex-col items-center justify-center p-6 sm:p-12"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Zoomed Container */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          transition: "transform 150ms ease",
        }}
        className="relative"
      >
        {/* Canvas Card */}
        <div
          ref={canvasRef}
          role="region"
          aria-label="Email signature canvas"
          onClick={() => onSelect(null)}
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            backgroundColor: theme.bg,
            border: `1px solid ${theme.border}`,
            borderRadius: cardRadius,
            position: "relative",
            overflow: "visible",
            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
            backgroundImage: isInteracting
              ? "radial-gradient(#CBD5E1 1.5px, transparent 1.5px)"
              : undefined,
            backgroundSize: isInteracting ? "8px 8px" : undefined,
          }}
        >
          {/* Alignment Guide Lines */}
          {guides.map((g, idx) =>
            g.type === "vertical" ? (
              <div
                key={`v-${idx}`}
                style={{
                  position: "absolute",
                  left: `${g.position}px`,
                  top: 0,
                  bottom: 0,
                  width: "1px",
                  backgroundColor: "#38BDF8",
                  zIndex: 25,
                  pointerEvents: "none",
                }}
              />
            ) : (
              <div
                key={`h-${idx}`}
                style={{
                  position: "absolute",
                  top: `${g.position}px`,
                  left: 0,
                  right: 0,
                  height: "1px",
                  backgroundColor: "#38BDF8",
                  zIndex: 25,
                  pointerEvents: "none",
                }}
              />
            )
          )}

          {/* Empty State */}
          {elements.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 select-none p-6 text-center pointer-events-none">
              <svg className="w-8 h-8 text-slate-300 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
              </svg>
              <p className="text-sm font-medium text-slate-500">
                Add elements from the left panel to start designing
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Everything can be freely positioned and resized without overlapping
              </p>
            </div>
          )}

          {/* Elements */}
          {elements.map((el) => {
            const isTarget = selectedId === el.id;
            const isDraggingThis = dragState?.elementId === el.id;
            const isResizingThis = resizeState?.elementId === el.id;

            // Compute display rect (live during drag or resize)
            const displayEl: FreeElement = isDraggingThis && dragState
              ? { ...el, x: dragState.currentX, y: dragState.currentY }
              : isResizingThis && resizeState
              ? { ...el, ...resizeState.currentRect }
              : el;

            return (
              <FreeElementView
                key={el.id}
                element={displayEl}
                data={data}
                isSelected={isTarget}
                isColliding={isTarget && isColliding}
                isDragging={isDraggingThis}
                isResizing={isResizingThis}
                onSelect={(id, e) => {
                  e.stopPropagation();
                  onSelect(id);
                }}
                onStartDrag={handleStartDrag}
                onStartResize={handleStartResize}
                onTextChange={(id, text) => {
                  dispatch({
                    type: "UPDATE_ELEMENT",
                    payload: { id, updates: { text } },
                  });
                }}
                onTextGrowth={handleTextGrowth}
              />
            );
          })}

          {/* Canvas Height Drag Handle on Bottom Edge */}
          <div
            onPointerDown={handleBottomDragStart}
            role="slider"
            aria-label="Canvas height"
            aria-valuemin={120}
            aria-valuemax={480}
            aria-valuenow={canvasHeight}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center cursor-row-resize z-40 group py-1 px-4"
            style={{ touchAction: "none" }}
            title="Drag to adjust canvas height"
          >
            <div className="w-12 h-2 rounded-full bg-slate-300 group-hover:bg-[#245FD4] transition-colors shadow-xs flex items-center justify-center">
              <div className="w-4 h-0.5 bg-white rounded-full opacity-70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
