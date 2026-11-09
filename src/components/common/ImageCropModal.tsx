"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { getCroppedImageFile } from "@/lib/cropImage";

export interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  fileName?: string;
  onClose: () => void;
  onApply: (croppedFile: File) => void | Promise<void>;
  title?: string;
  description?: string;
  aspect?: number;
  cropShape?: "rect" | "round";
  cropAreaBorderRadius?: string;
}

export default function ImageCropModal({
  isOpen,
  imageSrc,
  fileName = "avatar.png",
  onClose,
  onApply,
  title = "Crop Profile Photo",
  description,
  aspect = 1,
  cropShape = "round",
  cropAreaBorderRadius,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  const defaultDescription =
    cropShape === "round"
      ? "Drag to reposition your photo and use the slider to scale your face into the circle."
      : "Drag to reposition your photo and use the slider to scale your photo into the frame.";
  const modalDescription = description ?? defaultDescription;

  // Custom style for cropArea to support exact template border-radius
  const effectiveCropAreaStyle: React.CSSProperties | undefined =
    cropAreaBorderRadius
      ? { borderRadius: cropAreaBorderRadius }
      : undefined;

  // Reset states whenever modal opens with a new image
  useEffect(() => {
    if (isOpen) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setIsApplying(false);
      setErrorMessage(null);
    }
  }, [isOpen, imageSrc]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !isApplying) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isApplying, onClose]);

  const onCropCompleteCallback = useCallback(
    (_croppedArea: Area, currentCroppedAreaPixels: Area) => {
      setCroppedAreaPixels(currentCroppedAreaPixels);
    },
    []
  );

  const handleApply = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsApplying(true);
    setErrorMessage(null);
    try {
      const croppedFile = await getCroppedImageFile(imageSrc, croppedAreaPixels, fileName);
      await onApply(croppedFile);
      onClose();
    } catch (err: unknown) {
      console.error("Failed to crop image:", err);
      const msg = err instanceof Error ? err.message : "Failed to crop image. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsApplying(false);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(3, Math.round((prev + 0.15) * 100) / 100));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(1, Math.round((prev - 0.15) * 100) / 100));
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isApplying) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl transition flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3
              id="crop-modal-title"
              className="text-lg font-bold text-[#0B1A3D]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {title}
            </h3>
            <p
              className="text-xs text-slate-500 mt-0.5 line-clamp-1"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              {modalDescription}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isApplying}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer disabled:opacity-50"
            aria-label="Close crop modal"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cropper Container */}
        <div className="relative w-full h-[280px] sm:h-[320px] bg-slate-950 select-none overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            cropSize={undefined}
            style={effectiveCropAreaStyle ? { cropAreaStyle: effectiveCropAreaStyle } : undefined}
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteCallback}
          />
        </div>

        {/* Controls & Zoom Slider */}
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex flex-col gap-3">
          {/* Subtle guide hint outside canvas */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 py-0.5 select-none">
            <span>↔ Drag to pan</span>
            <span>•</span>
            <span>🔍 Pinch or scroll to zoom</span>
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {errorMessage}
            </div>
          )}

          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}>
              Zoom &amp; Scale
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-mono text-[11px] font-semibold shadow-2xs">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={handleReset}
                disabled={zoom === 1 && crop.x === 0 && crop.y === 0}
                className="text-[11px] font-medium text-brand hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Zoom Out Button */}
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 1 || isApplying}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 active:scale-95 disabled:opacity-40 cursor-pointer shadow-2xs"
              aria-label="Zoom out"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>

            {/* Zoom Range Slider */}
            <div className="relative flex-1 flex items-center">
              <input
                type="range"
                min={1}
                max={3}
                step={0.02}
                value={zoom}
                aria-label="Zoom profile photo"
                onChange={(e) => setZoom(Number(e.target.value))}
                disabled={isApplying}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#245FD4] focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>

            {/* Zoom In Button */}
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 3 || isApplying}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 active:scale-95 disabled:opacity-40 cursor-pointer shadow-2xs"
              aria-label="Zoom in"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-white">
          <button
            type="button"
            onClick={onClose}
            disabled={isApplying}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={isApplying || !croppedAreaPixels}
            className="bg-brand-gradient flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:opacity-95 disabled:opacity-60 cursor-pointer"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            {isApplying ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Applying...</span>
              </>
            ) : (
              "Save & Apply"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
