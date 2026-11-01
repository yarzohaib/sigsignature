"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
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
import { StudioAction, ALLOWED_STUDIO_FONTS } from "@/lib/studio/types";
import { compressImageToBlob, isAllowedJpgOrPng } from "@/lib/imageUtils";
import { uploadSignatureImage } from "@/lib/uploads";
import {
  validateSocialUrl,
  TeamMemberSocialPlatform,
  SOCIAL_PLATFORM_EXAMPLES,
} from "@/lib/team/socials";
import {
  isValidEmail,
  sanitizePhone,
  isValidPhone,
  isValidWebUrl,
  MAX_LENGTH,
} from "@/lib/validation";

interface EditDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId: string | null;
  state: StudioSignatureData;
  dispatch: (action: StudioAction) => void;
  initialSection?: "all" | "socials";
  onToast: (msg: string, isError?: boolean) => void;
  isEditingSavedSignature?: boolean;
}

export default function EditDetailsModal({
  isOpen,
  onClose,
  selectedId,
  state,
  dispatch,
  initialSection = "all",
  onToast,
  isEditingSavedSignature = false,
}: EditDetailsModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

  // Compute social validation errors directly during render without cascading setState effects
  const socialErrors = useMemo<Record<string, string>>(() => {
    if (!isOpen) return {};
    const errs: Record<string, string> = {};
    const mapping: Record<string, TeamMemberSocialPlatform> = {
      linkedin: "linkedin",
      twitter: "x",
      facebook: "facebook",
      instagram: "instagram",
    };
    Object.entries(mapping).forEach(([key, plat]) => {
      const val = state.socials?.[key as keyof typeof state.socials];
      if (val && val.trim()) {
        const err = validateSocialUrl(plat, val);
        if (err) errs[key] = err;
      }
    });
    return errs;
  }, [isOpen, state]);

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

  const isLockedIdentity = Boolean(
    isEditingSavedSignature &&
    selectedElement?.type === "text" &&
    (("bind" in selectedElement && (selectedElement.bind === "name" || selectedElement.bind === "company")) ||
      selectedElement.id === "el-name" ||
      selectedElement.id === "el-company")
  );

  const isBoundEmail =
    selectedElement?.type === "text" &&
    "bind" in selectedElement &&
    selectedElement.bind === "email";
  const isBoundPhone =
    selectedElement?.type === "text" &&
    "bind" in selectedElement &&
    selectedElement.bind === "phone";

  const textFieldError = useMemo(() => {
    if (!selectedElement || selectedElement.type !== "text") return null;
    const textEl = selectedElement as FreeTextElement;
    const trimmed = textEl.text?.trim() || "";
    if (textEl.bind === "email") {
      if (!trimmed) return "Email address is required.";
      if (!isValidEmail(trimmed)) return "Please enter a valid email address.";
    }
    if (textEl.bind === "phone") {
      if (!trimmed) return "Phone number is required.";
      if (!isValidPhone(trimmed))
        return "Please enter a valid phone number (at least 6 digits).";
    }
    if (textEl.bind === "website" || textEl.icon === "website") {
      if (!trimmed) return "Website address is required.";
      if (!isValidWebUrl(trimmed))
        return "Please enter a valid website address (e.g. company.com).";
    }
    return null;
  }, [selectedElement]);

  const isSocialMode =
    initialSection === "socials" || selectedElement?.type === "social";

  // Upload handler for image, logo, banner
  async function handleMediaUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !selectedElement) return;

    if (!isAllowedJpgOrPng(file)) {
      onToast("Please upload a JPG or PNG image.", true);
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
      data-edit-details-modal
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
                    platform: "linkedin" as const,
                    label: "LinkedIn Profile",
                    placeholder: SOCIAL_PLATFORM_EXAMPLES.linkedin,
                  },
                  {
                    key: "twitter" as const,
                    platform: "x" as const,
                    label: "Twitter / X Profile",
                    placeholder: SOCIAL_PLATFORM_EXAMPLES.x,
                  },
                  {
                    key: "facebook" as const,
                    platform: "facebook" as const,
                    label: "Facebook Profile",
                    placeholder: SOCIAL_PLATFORM_EXAMPLES.facebook,
                  },
                  {
                    key: "instagram" as const,
                    platform: "instagram" as const,
                    label: "Instagram Profile",
                    placeholder: SOCIAL_PLATFORM_EXAMPLES.instagram,
                  },
                ].map(({ key, label, placeholder }) => {
                  const error = socialErrors[key];
                  return (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {label}
                      </label>
                      <input
                        type="url"
                        value={state.socials?.[key] || ""}
                        maxLength={250}
                        onChange={(e) => {
                          const val = e.target.value;
                          dispatch({
                            type: "UPDATE_SIGNATURE_FIELD",
                            field: "socials",
                            value: {
                              ...state.socials,
                              [key]: val,
                            },
                          });
                        }}
                        placeholder={placeholder}
                        className={`w-full rounded-xl border px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 transition focus:outline-none focus:ring-1 ${
                          error
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200"
                            : "border-slate-300 focus:border-[#245FD4] focus:ring-[#245FD4]"
                        }`}
                      />
                      {error && (
                        <p className="mt-1 text-[11px] text-rose-500">{error}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TEXT ELEMENT EDITOR */}
          {!isSocialMode && selectedElement?.type === "text" && (
            <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {isBoundEmail
                        ? "Email Address"
                        : isBoundPhone
                        ? "Phone Number"
                        : "Text Content"}
                    </label>
                    {isLockedIdentity && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        <svg className="w-2.5 h-2.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        Locked
                      </span>
                    )}
                  </div>
                  <textarea
                    value={(selectedElement as FreeTextElement).text || ""}
                    onChange={(e) => {
                      if (isLockedIdentity) return;
                      const raw = e.target.value;
                      const text = isBoundPhone
                        ? sanitizePhone(raw).slice(0, MAX_LENGTH.PHONE)
                        : raw.slice(0, isBoundEmail ? MAX_LENGTH.EMAIL : 500);
                      dispatch({
                        type: "UPDATE_ELEMENT",
                        payload: { id: selectedElement.id, updates: { text } },
                      });
                    }}
                    disabled={isLockedIdentity}
                    maxLength={isBoundPhone ? MAX_LENGTH.PHONE : isBoundEmail ? MAX_LENGTH.EMAIL : 500}
                    rows={isBoundEmail || isBoundPhone ? 2 : 4}
                    className={`w-full rounded-xl border px-3.5 py-2 text-xs transition ${
                      isLockedIdentity
                        ? "border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed select-none"
                        : textFieldError
                        ? "border-rose-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-200"
                        : "border-slate-300 text-slate-800 placeholder-slate-400 focus:border-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                    }`}
                    placeholder={
                      isBoundEmail
                        ? "alex@company.com"
                        : isBoundPhone
                        ? "+1 555 123 4567"
                        : "Enter text..."
                    }
                  />
                  {textFieldError && !isLockedIdentity && (
                    <p className="mt-1 text-[11px] text-rose-500">{textFieldError}</p>
                  )}
                  {isLockedIdentity && (
                    <p className="mt-1.5 text-[11px] text-slate-500">
                      Full name and company name are locked to preserve signature identity on the Free plan.
                    </p>
                  )}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Font Family
                  </label>
                  <select
                    value={(selectedElement as FreeTextElement).fontFamily || state.fontFamily || "Inter"}
                    onChange={(e) => {
                      dispatch({
                        type: "UPDATE_ELEMENT",
                        payload: {
                          id: selectedElement.id,
                          updates: { fontFamily: e.target.value },
                        },
                      });
                    }}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-[#245FD4] focus:outline-none"
                  >
                    {ALLOWED_STUDIO_FONTS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Text Color
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="color"
                      value={(selectedElement as FreeTextElement).color || "#1E293B"}
                      onChange={(e) => {
                        dispatch({
                          type: "UPDATE_ELEMENT",
                          payload: {
                            id: selectedElement.id,
                            updates: { color: e.target.value },
                          },
                        });
                      }}
                      className="h-8 w-8 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                    />
                    <span className="text-xs text-slate-600 font-mono">
                      {(selectedElement as FreeTextElement).color || "Default"}
                    </span>
                  </div>
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
                  Bold text (applies to entire box)
                </label>
              </div>

              {(selectedElement as FreeTextElement).text?.includes("\n") && (
                <div className="pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({
                        type: "SPLIT_TEXT_ELEMENT",
                        payload: { id: selectedElement.id },
                      });
                      onToast("Split lines into separate elements");
                      onClose();
                    }}
                    className="w-full py-2 px-3 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/60 text-blue-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12h16" />
                      <path d="M12 4v16" />
                    </svg>
                    <span>Split lines into separate elements</span>
                  </button>
                </div>
              )}
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
                  maxLength={80}
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
                  maxLength={300}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Font Family
                  </label>
                  <select
                    value={(selectedElement as FreeCtaElement).fontFamily || state.fontFamily || "Inter"}
                    onChange={(e) => {
                      dispatch({
                        type: "UPDATE_ELEMENT",
                        payload: {
                          id: selectedElement.id,
                          updates: { fontFamily: e.target.value },
                        },
                      });
                    }}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-[#245FD4] focus:outline-none"
                  >
                    {ALLOWED_STUDIO_FONTS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Button Color
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="color"
                      value={(selectedElement as FreeCtaElement).color || state.themeColor || "#245FD4"}
                      onChange={(e) => {
                        dispatch({
                          type: "UPDATE_ELEMENT",
                          payload: {
                            id: selectedElement.id,
                            updates: { color: e.target.value },
                          },
                        });
                      }}
                      className="h-8 w-8 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                    />
                    <span className="text-xs text-slate-600 font-mono">
                      {(selectedElement as FreeCtaElement).color || "Theme color"}
                    </span>
                  </div>
                </div>
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
                          unoptimized
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
                      accept=".jpg, .png"
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
                    maxLength={300}
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
            onClick={() => {
              if (Object.keys(socialErrors).length > 0) {
                onToast("Please fix the invalid social profile URLs.", true);
                return;
              }
              onClose();
            }}
            className="rounded-xl bg-[#245FD4] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
