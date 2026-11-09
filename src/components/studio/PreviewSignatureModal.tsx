"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import SignaturePreviewFrame from "./SignaturePreviewFrame";
import { StudioSignatureData } from "@/types/studio";
import { THEME_PRESETS, getShapeBorderRadius } from "@/lib/studio/shared";
import FreeElementView from "./FreeElementView";

interface PreviewSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  html: string;
  data?: StudioSignatureData;
  showCanvasTab?: boolean;
}

export default function PreviewSignatureModal({
  isOpen,
  onClose,
  html,
  data,
  showCanvasTab = true,
}: PreviewSignatureModalProps) {
  const [activeTab, setActiveTab] = useState<"email" | "canvas">("email");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const canvasWidth = data?.canvas?.width || 600;
  const canvasHeight = data?.canvas?.height || 200;
  const themeKey = data?.design?.theme || "corporate";
  const theme = THEME_PRESETS[themeKey] || THEME_PRESETS.corporate;
  const shape = data?.design?.shape || "rounded";
  const cardRadius = getShapeBorderRadius(shape, "card", canvasHeight);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="preview-signature-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-modal-title"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            key="preview-signature-dialog"
            className="flex h-[min(520px,90vh)] max-h-[90vh] w-full max-w-[850px] flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
        {/* Header with Title, Tabs, Device Switcher, and Close */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] px-4 sm:px-6 py-3 sm:py-4 bg-slate-50/70 relative">
          <div className="flex min-w-0 items-center gap-2 pr-10 sm:pr-0">
            <h3
              id="preview-modal-title"
              className="whitespace-nowrap text-base font-bold text-[#1E293B]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Preview Signature
            </h3>
            {/* View Mode Tabs */}
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("email")}
                className={`whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  activeTab === "email"
                    ? "bg-[#245FD4] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                As sent in email
              </button>
              {showCanvasTab && (
                <button
                  type="button"
                  onClick={() => setActiveTab("canvas")}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                    activeTab === "canvas"
                      ? "bg-[#245FD4] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  }`}
                >
                  Canvas
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            {/* Device Switcher (only for As sent in email) */}
            {activeTab === "email" && (
              <div className="flex items-center rounded-xl bg-slate-200/70 p-1 flex-1 sm:flex-none justify-center">
                <button
                  type="button"
                  onClick={() => setDevice("desktop")}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition ${
                    device === "desktop"
                      ? "bg-white text-[#245FD4] shadow-xs"
                      : "text-[#64748B] hover:text-[#1E293B]"
                  }`}
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  <span className="whitespace-nowrap">Desktop (600px)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDevice("mobile")}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition ${
                    device === "mobile"
                      ? "bg-white text-[#245FD4] shadow-xs"
                      : "text-[#64748B] hover:text-[#1E293B]"
                  }`}
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                  <span className="whitespace-nowrap">Mobile (360px)</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-lg text-slate-400 transition hover:bg-slate-200/50 hover:text-slate-600 sm:static"
              aria-label="Close preview"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="m18 6-12 12M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 bg-[#F8FAFC] flex justify-center items-start">
          {activeTab === "email" ? (
            <div
              className="my-auto flex h-[420px] w-full flex-col overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-xs transition-all duration-200"
              style={{
                maxWidth: device === "desktop" ? "600px" : "360px",
              }}
            >
              {/* Mock Email Message Header */}
              <div className="border-b border-[#F1F5F9] px-4 py-3 bg-white">
                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                  <span className="font-semibold text-[#1E293B]">To:</span>
                  <span>client@example.com</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#64748B] mt-1.5">
                  <span className="font-semibold text-[#1E293B]">Subject:</span>
                  <span>Project Proposal & Next Steps</span>
                </div>
              </div>

              {/* Email Sample Text */}
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 text-xs leading-relaxed text-[#475569]">
                <p>Hi there,</p>
                <p className="mt-2">
                  Thank you for your time earlier today. Please find the attached details regarding our project timeline.
                </p>
                <p className="mt-2">Let me know if you have any questions!</p>
                <p className="mt-3">Best regards,</p>

                {/* Rendered Signature HTML in iframe */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <SignaturePreviewFrame
                    html={html}
                    aspectRatio={false}
                    targetWidth={device === "mobile" ? 320 : undefined}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Canvas View Tab */
            <div className="w-full flex justify-center py-4 overflow-x-auto">
              {data && data.elements && data.elements.length > 0 ? (
                <div
                  style={{
                    width: `${canvasWidth}px`,
                    height: `${canvasHeight}px`,
                    backgroundColor: theme.bg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: cardRadius,
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                >
                  {data.elements.map((el) => (
                    <FreeElementView
                      key={el.id}
                      element={el}
                      data={data}
                      isSelected={false}
                      isColliding={false}
                      isDragging={false}
                      isResizing={false}
                      showEditorOverlays={false}
                      onSelect={() => {}}
                      onStartDrag={() => {}}
                      onStartResize={() => {}}
                      onTextChange={() => {}}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No elements on the canvas
                </div>
              )}
            </div>
          )}
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
