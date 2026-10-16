"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  StudioSignatureData,
  FreeElement,
  FreeTextElement,
  FreeCtaElement,
  FreeImageElement,
  FreeLogoElement,
  FreeBannerElement,
} from "@/types/studio";
import { StudioAction } from "@/lib/studio/types";
import { compressImageToBlob } from "@/lib/imageUtils";
import { uploadSignatureImage } from "@/lib/uploads";

interface EditDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId: string | null;
  state: StudioSignatureData;
  dispatch: (action: StudioAction) => void;
  initialSection?: "all" | "socials";
  onToast: (msg: string, isError?: boolean) => void;
}

export default function EditDetailsModal({
  isOpen,
  onClose,
  selectedId,
  state,
  dispatch,
  initialSection = "all",
  onToast,
}: EditDetailsModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Find selected free element
  const selectedElement: FreeElement | undefined = state.elements?.find(
    (el) => el.id === selectedId
  );

  const isSocialMode =
    initialSection === "socials" || selectedElement?.type === "social";

  // Upload handler for image, logo, banner
  async function handleMediaUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !selectedElement) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      onToast("Please upload a JPEG, PNG, or WebP image.", true);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      onToast("Please upload an image smaller than 10MB.", true);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);
    try {
      const compressedBlob = await compressImageToBlob(file, 800, 0.85, "logo");
      const publicUrl = await uploadSignatureImage(compressedBlob, "logo");

      dispatch({
        type: "UPDATE_ELEMENT",
        payload: {
          id: selectedElement.id,
          updates: { url: publicUrl },
        },
      });
      onToast(`${selectedElement.type} replaced successfully!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image.";
      onToast(msg, true);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-details-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-[540px] flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 transition-all transform scale-100 animate-in zoom-in-95 duration-150 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4 bg-slate-50/70">
          <div>
            <h3
              id="edit-details-title"
              className="text-base font-bold text-[#1E293B]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {isSocialMode
                ? "Social Profile Links"
                : selectedElement
                ? `Edit ${selectedElement.type.toUpperCase()}`
                : "Edit Details"}
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              {isSocialMode
                ? "Manage your social network handles and links"
                : "Customize text, styling, links, or media"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200/50 hover:text-slate-600 transition"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* SOCIAL MEDIA SECTION */}
          {isSocialMode && (
            <div ref={socialsRef} className="space-y-4">
              <div className="space-y-3">
                {[
                  {
                    key: "linkedin" as const,
                    label: "LinkedIn Profile",
                    placeholder: "https://linkedin.com/in/username (optional)",
                  },
                  {
                    key: "twitter" as const,
                    label: "Twitter / X Profile",
                    placeholder: "https://x.com/username (optional)",
                  },
                  {
                    key: "facebook" as const,
                    label: "Facebook Profile",
                    placeholder: "https://facebook.com/username (optional)",
                  },
                  {
                    key: "instagram" as const,
                    label: "Instagram Profile",
                    placeholder: "https://instagram.com/username (optional)",
                  },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {label}
                    </label>
                    <input
                      type="url"
                      value={state.socials?.[key] || ""}
                      onChange={(e) => {
                        dispatch({
                          type: "UPDATE_SIGNATURE_FIELD",
                          field: "socials",
                          value: {
                            ...state.socials,
                            [key]: e.target.value,
                          },
                        });
                      }}
                      placeholder={placeholder}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4] transition"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEXT ELEMENT EDITOR */}
          {!isSocialMode && selectedElement?.type === "text" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Text Content
                </label>
                <textarea
                  value={(selectedElement as FreeTextElement).text || ""}
                  onChange={(e) => {
                    const text = e.target.value.slice(0, 500);
                    dispatch({
                      type: "UPDATE_ELEMENT",
                      payload: { id: selectedElement.id, updates: { text } },
                    });
                  }}
                  maxLength={500}
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4] transition"
                  placeholder="Enter text..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Font Size
                  </label>
                  <select
                    value={(selectedElement as FreeTextElement).size}
                    onChange={(e) => {
                      dispatch({
                        type: "UPDATE_ELEMENT",
                        payload: {
                          id: selectedElement.id,
                          updates: { size: e.target.value as "sm" | "md" | "lg" },
                        },
                      });
                    }}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-[#245FD4] focus:outline-none"
                  >
                    <option value="sm">Small (12px)</option>
                    <option value="md">Medium (14px)</option>
                    <option value="lg">Large (16px)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Text Alignment
                  </label>
                  <select
                    value={(selectedElement as FreeTextElement).align || "left"}
                    onChange={(e) => {
                      dispatch({
                        type: "UPDATE_ELEMENT",
                        payload: {
                          id: selectedElement.id,
                          updates: { align: e.target.value as "left" | "center" | "right" },
                        },
                      });
                    }}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-[#245FD4] focus:outline-none"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="boldToggle"
                  checked={(selectedElement as FreeTextElement).bold}
                  onChange={(e) => {
                    dispatch({
                      type: "UPDATE_ELEMENT",
                      payload: {
                        id: selectedElement.id,
                        updates: { bold: e.target.checked },
                      },
                    });
                  }}
                  className="rounded border-slate-300 text-[#245FD4] focus:ring-[#245FD4]"
                />
                <label htmlFor="boldToggle" className="text-xs font-medium text-slate-700">
                  Bold text
                </label>
              </div>
            </div>
          )}

          {/* CTA ELEMENT EDITOR */}
          {!isSocialMode && selectedElement?.type === "cta" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Button Label
                </label>
                <input
                  type="text"
                  value={(selectedElement as FreeCtaElement).label || ""}
                  onChange={(e) => {
                    dispatch({
                      type: "UPDATE_ELEMENT",
                      payload: {
                        id: selectedElement.id,
                        updates: { label: e.target.value },
                      },
                    });
                  }}
                  placeholder="e.g. Schedule a Call"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-800 focus:border-[#245FD4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target URL (optional)
                </label>
                <input
                  type="url"
                  value={(selectedElement as FreeCtaElement).url || ""}
                  onChange={(e) => {
                    dispatch({
                      type: "UPDATE_ELEMENT",
                      payload: {
                        id: selectedElement.id,
                        updates: { url: e.target.value },
                      },
                    });
                  }}
                  placeholder="https://cal.com/example (optional)"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-800 focus:border-[#245FD4] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* MEDIA ELEMENT EDITOR (image, logo, banner) */}
          {!isSocialMode &&
            (selectedElement?.type === "image" ||
              selectedElement?.type === "logo" ||
              selectedElement?.type === "banner") && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Image File
                  </label>
                  <div className="flex items-center gap-3">
                    {(selectedElement as FreeImageElement | FreeLogoElement | FreeBannerElement)
                      .url && (
                      <div className="w-14 h-14 relative rounded-lg border border-slate-200 overflow-hidden shrink-0 bg-slate-50">
                        <Image
                          src={
                            (selectedElement as FreeImageElement | FreeLogoElement | FreeBannerElement)
                              .url
                          }
                          alt="preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                      {isUploading ? "Uploading..." : "Replace Image"}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleMediaUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Click Link URL (optional)
                  </label>
                  <input
                    type="url"
                    value={
                      (selectedElement as FreeImageElement | FreeLogoElement | FreeBannerElement)
                        .linkUrl || ""
                    }
                    onChange={(e) => {
                      const linkUrl = e.target.value;
                      dispatch({
                        type: "UPDATE_ELEMENT",
                        payload: {
                          id: selectedElement.id,
                          updates: { linkUrl },
                        },
                      });
                    }}
                    placeholder="https://example.com (optional)"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-800 focus:border-[#245FD4] focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    When someone clicks this image in your email, they will be redirected to this URL.
                  </p>
                </div>
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-[#E2E8F0] px-6 py-3 bg-slate-50/70">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#245FD4] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
