"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  TemplateSignatureData,
  SignatureExtraItem,
  ExtraTextItem,
  ExtraImageItem,
  ExtraCtaItem,
  ExtraBannerItem,
} from "@/types/template";
import { StudioAction } from "@/lib/studio/types";
import { compressImageToBlob } from "@/lib/imageUtils";
import { uploadSignatureImage } from "@/lib/uploads";

interface EditDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId: "main" | string | null;
  state: TemplateSignatureData;
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
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingExtra, setIsUploadingExtra] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const extraImageInputRef = useRef<HTMLInputElement>(null);
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

  // Scroll to socials section if opened via Social Icons button
  useEffect(() => {
    if (isOpen && initialSection === "socials" && socialsRef.current) {
      setTimeout(() => {
        socialsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [isOpen, initialSection]);

  if (!isOpen || !selectedId) return null;

  const isMain = selectedId === "main";
  const selectedExtra: SignatureExtraItem | undefined = !isMain
    ? state.extras?.find((e) => e.id === selectedId)
    : undefined;

  // 1. Photo Upload Handler for Main Card
  async function handleAvatarUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      onToast("Please upload a JPEG, PNG, or WebP image.", true);
      if (photoInputRef.current) photoInputRef.current.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      onToast("Please upload an image smaller than 10MB.", true);
      if (photoInputRef.current) photoInputRef.current.value = "";
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const compressedBlob = await compressImageToBlob(file, 400, 0.85, "avatar");
      const publicUrl = await uploadSignatureImage(compressedBlob, "avatar");
      dispatch({
        type: "UPDATE_SIGNATURE_FIELD",
        field: "avatarUrl",
        value: publicUrl,
      });
      onToast("Profile photo uploaded!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload photo.";
      onToast(message, true);
    } finally {
      setIsUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  }

  // 2. Reset Photo to default sample
  function handleResetPhoto() {
    dispatch({
      type: "UPDATE_SIGNATURE_FIELD",
      field: "avatarUrl",
      value: "/daniel-wilson.png",
    });
    onToast("Photo reset to sample image");
  }

  // 3. Image/Banner Replace Handler
  async function handleReplaceExtraImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !selectedExtra) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      onToast("Please upload a JPEG, PNG, or WebP image.", true);
      if (extraImageInputRef.current) extraImageInputRef.current.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      onToast("Please upload an image smaller than 10MB.", true);
      if (extraImageInputRef.current) extraImageInputRef.current.value = "";
      return;
    }

    setIsUploadingExtra(true);
    try {
      const compressedBlob = await compressImageToBlob(file, 600, 0.85, "logo");
      const publicUrl = await uploadSignatureImage(compressedBlob, "logo");

      if (selectedExtra.type === "image") {
        dispatch({
          type: "UPDATE_EXTRA",
          payload: { id: selectedExtra.id, item: { url: publicUrl } },
        });
      } else if (selectedExtra.type === "banner") {
        dispatch({
          type: "UPDATE_EXTRA",
          payload: { id: selectedExtra.id, item: { imageUrl: publicUrl } },
        });
      }
      onToast("Image updated!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload image.";
      onToast(message, true);
    } finally {
      setIsUploadingExtra(false);
      if (extraImageInputRef.current) extraImageInputRef.current.value = "";
    }
  }

  const isSampleAvatar =
    !state.avatarUrl ||
    state.avatarUrl === "/daniel-wilson.png" ||
    !state.avatarUrl.startsWith("https");

  const modalTitle = isMain
    ? "Edit Signature Details"
    : selectedExtra?.type === "text"
    ? "Edit Text Element"
    : selectedExtra?.type === "image"
    ? "Edit Image Element"
    : selectedExtra?.type === "cta"
    ? "Edit CTA Button"
    : selectedExtra?.type === "banner"
    ? "Edit Banner Element"
    : "Divider Line";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-details-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[540px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 flex flex-col transition-all transform scale-100 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3
              id="edit-details-title"
              className="text-base font-bold text-[#1E293B]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {modalTitle}
            </h3>
            <p
              className="text-xs text-[#64748B] mt-0.5"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Changes are reflected live in the canvas and saved to your draft.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4 space-y-4">
          {/* ======================================================== */}
          {/* 1. MAIN SIGNATURE FIELDS */}
          {/* ======================================================== */}
          {isMain && (
            <div className="space-y-4">
              {/* Profile Photo Section */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <span className="text-xs font-semibold text-[#1E293B] block mb-2">
                  Profile Photo
                </span>
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
                    <Image
                      src={state.avatarUrl || "/daniel-wilson.png"}
                      alt="Profile Avatar"
                      fill
                      sizes="56px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                    <button
                      type="button"
                      disabled={isUploadingPhoto}
                      onClick={() => photoInputRef.current?.click()}
                      className="rounded-lg bg-gradient-to-r from-[#245FD4] to-[#022977] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:opacity-95 transition disabled:opacity-50"
                    >
                      {isUploadingPhoto ? "Uploading..." : "Upload Photo"}
                    </button>

                    <button
                      type="button"
                      onClick={handleResetPhoto}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {isSampleAvatar && (
                  <p className="mt-2.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200/80 rounded-lg p-2 leading-relaxed">
                    This is a sample photo. Upload your own photo, otherwise your signature will be exported without a photo.
                  </p>
                )}
              </div>

              {/* Personal & Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={state.fullName || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_SIGNATURE_FIELD",
                        field: "fullName",
                        value: e.target.value,
                      })
                    }
                    placeholder="Daniel Wilson"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-[#1E293B] focus:border-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={state.jobTitle || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_SIGNATURE_FIELD",
                        field: "jobTitle",
                        value: e.target.value,
                      })
                    }
                    placeholder="UX/UI Designer"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-[#1E293B] focus:border-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={state.companyName || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_SIGNATURE_FIELD",
                        field: "companyName",
                        value: e.target.value,
                      })
                    }
                    placeholder="Company Name"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-[#1E293B] focus:border-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={state.email || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_SIGNATURE_FIELD",
                        field: "email",
                        value: e.target.value,
                      })
                    }
                    placeholder="daniel@company.com"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-[#1E293B] focus:border-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={state.phone || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_SIGNATURE_FIELD",
                        field: "phone",
                        value: e.target.value,
                      })
                    }
                    placeholder="+1 (555) 345-6789"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-[#1E293B] focus:border-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                    Website
                  </label>
                  <input
                    type="text"
                    value={state.website || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_SIGNATURE_FIELD",
                        field: "website",
                        value: e.target.value,
                      })
                    }
                    placeholder="www.company.com"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-[#1E293B] focus:border-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={state.optional?.address || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_SIGNATURE_FIELD",
                      field: "optional",
                      value: { ...state.optional, address: e.target.value },
                    })
                  }
                  placeholder="123 Innovation Way, Suite 400"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-[#1E293B] focus:border-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={state.optional?.tagline || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_SIGNATURE_FIELD",
                      field: "optional",
                      value: { ...state.optional, tagline: e.target.value },
                    })
                  }
                  placeholder="Building intuitive digital experiences"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-[#1E293B] focus:border-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                />
              </div>

              {/* Social Links Section */}
              <div ref={socialsRef} className="pt-2">
                <span className="text-xs font-semibold text-[#1E293B] block mb-2">
                  Social Links
                </span>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">LinkedIn</label>
                    <input
                      type="text"
                      value={state.socials?.linkedin || ""}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_SIGNATURE_FIELD",
                          field: "socials",
                          value: { ...state.socials, linkedin: e.target.value },
                        })
                      }
                      placeholder="https://linkedin.com/in/username"
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-[#1E293B] focus:border-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Twitter / X</label>
                    <input
                      type="text"
                      value={state.socials?.twitter || ""}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_SIGNATURE_FIELD",
                          field: "socials",
                          value: { ...state.socials, twitter: e.target.value },
                        })
                      }
                      placeholder="https://twitter.com/username"
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-[#1E293B] focus:border-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Facebook</label>
                    <input
                      type="text"
                      value={state.socials?.facebook || ""}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_SIGNATURE_FIELD",
                          field: "socials",
                          value: { ...state.socials, facebook: e.target.value },
                        })
                      }
                      placeholder="https://facebook.com/username"
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-[#1E293B] focus:border-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Instagram</label>
                    <input
                      type="text"
                      value={state.socials?.instagram || ""}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_SIGNATURE_FIELD",
                          field: "socials",
                          value: { ...state.socials, instagram: e.target.value },
                        })
                      }
                      placeholder="https://instagram.com/username"
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-[#1E293B] focus:border-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. TEXT EXTRA ELEMENT */}
          {/* ======================================================== */}
          {selectedExtra?.type === "text" && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Text Content
                </label>
                <textarea
                  rows={3}
                  maxLength={300}
                  value={(selectedExtra as ExtraTextItem).text}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_EXTRA",
                      payload: { id: selectedExtra.id, item: { text: e.target.value } },
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-[#1E293B] focus:border-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                />
                <span className="text-[10px] text-slate-400 block text-right mt-0.5">
                  {(selectedExtra as ExtraTextItem).text.length}/300
                </span>
              </div>

              {/* Font Size & Bold */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                    Size
                  </label>
                  <div className="flex rounded-lg bg-slate-100 p-1">
                    {(["sm", "md", "lg"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() =>
                          dispatch({
                            type: "UPDATE_EXTRA",
                            payload: { id: selectedExtra.id, item: { size: s } },
                          })
                        }
                        className={`flex-1 rounded py-1 text-xs font-semibold transition ${
                          (selectedExtra as ExtraTextItem).size === s
                            ? "bg-white text-[#245FD4] shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {s.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                    Weight
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({
                        type: "UPDATE_EXTRA",
                        payload: {
                          id: selectedExtra.id,
                          item: { bold: !(selectedExtra as ExtraTextItem).bold },
                        },
                      })
                    }
                    className={`w-full rounded-lg border py-1.5 px-3 text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                      (selectedExtra as ExtraTextItem).bold
                        ? "border-[#245FD4] bg-[#EFF6FF] text-[#245FD4]"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className="font-bold">B</span>
                    <span>{(selectedExtra as ExtraTextItem).bold ? "Bold" : "Regular"}</span>
                  </button>
                </div>
              </div>

              {/* Alignment */}
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Alignment
                </label>
                <div className="flex rounded-lg bg-slate-100 p-1">
                  {(["left", "center", "right"] as const).map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: "UPDATE_EXTRA",
                          payload: { id: selectedExtra.id, item: { align: a } },
                        })
                      }
                      className={`flex-1 rounded py-1 text-xs font-semibold capitalize transition ${
                        (selectedExtra as ExtraTextItem).align === a
                          ? "bg-white text-[#245FD4] shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. IMAGE EXTRA ELEMENT */}
          {/* ======================================================== */}
          {selectedExtra?.type === "image" && (
            <div className="space-y-3.5">
              <input
                ref={extraImageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleReplaceExtraImage}
              />

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Image Preview & Replace
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <Image
                      src={(selectedExtra as ExtraImageItem).url}
                      alt="Element"
                      fill
                      sizes="80px"
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <button
                    type="button"
                    disabled={isUploadingExtra}
                    onClick={() => extraImageInputRef.current?.click()}
                    className="rounded-lg bg-gradient-to-r from-[#245FD4] to-[#022977] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:opacity-95 transition disabled:opacity-50"
                  >
                    {isUploadingExtra ? "Uploading..." : "Replace Image"}
                  </button>
                </div>
              </div>

              {/* Width Slider / Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#1E293B]">
                    Width (px)
                  </label>
                  <span className="text-xs text-slate-500">
                    {(selectedExtra as ExtraImageItem).width}px
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={600}
                  step={10}
                  value={(selectedExtra as ExtraImageItem).width}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_EXTRA",
                      payload: {
                        id: selectedExtra.id,
                        item: { width: Number(e.target.value) },
                      },
                    })
                  }
                  className="w-full accent-[#245FD4]"
                />
              </div>

              {/* Alignment */}
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Alignment
                </label>
                <div className="flex rounded-lg bg-slate-100 p-1">
                  {(["left", "center", "right"] as const).map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: "UPDATE_EXTRA",
                          payload: { id: selectedExtra.id, item: { align: a } },
                        })
                      }
                      className={`flex-1 rounded py-1 text-xs font-semibold capitalize transition ${
                        (selectedExtra as ExtraImageItem).align === a
                          ? "bg-white text-[#245FD4] shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Link URL */}
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Link URL (Optional)
                </label>
                <input
                  type="text"
                  maxLength={300}
                  value={(selectedExtra as ExtraImageItem).linkUrl || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_EXTRA",
                      payload: { id: selectedExtra.id, item: { linkUrl: e.target.value } },
                    })
                  }
                  placeholder="https://example.com"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-[#1E293B] focus:border-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                />
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 4. BANNER EXTRA ELEMENT */}
          {/* ======================================================== */}
          {selectedExtra?.type === "banner" && (
            <div className="space-y-3.5">
              <input
                ref={extraImageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleReplaceExtraImage}
              />

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Banner Image
                </label>
                <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                  <div className="relative h-20 w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <Image
                      src={(selectedExtra as ExtraBannerItem).imageUrl}
                      alt="Banner"
                      fill
                      sizes="100%"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <button
                    type="button"
                    disabled={isUploadingExtra}
                    onClick={() => extraImageInputRef.current?.click()}
                    className="self-start rounded-lg bg-gradient-to-r from-[#245FD4] to-[#022977] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:opacity-95 transition disabled:opacity-50"
                  >
                    {isUploadingExtra ? "Uploading..." : "Replace Banner"}
                  </button>
                </div>
              </div>

              {/* Link URL */}
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Link URL (Optional)
                </label>
                <input
                  type="text"
                  maxLength={300}
                  value={(selectedExtra as ExtraBannerItem).linkUrl || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_EXTRA",
                      payload: { id: selectedExtra.id, item: { linkUrl: e.target.value } },
                    })
                  }
                  placeholder="https://example.com"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-[#1E293B] focus:border-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                />
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 5. CTA EXTRA ELEMENT */}
          {/* ======================================================== */}
          {selectedExtra?.type === "cta" && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Button Label
                </label>
                <input
                  type="text"
                  maxLength={40}
                  value={(selectedExtra as ExtraCtaItem).label}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_EXTRA",
                      payload: { id: selectedExtra.id, item: { label: e.target.value } },
                    })
                  }
                  placeholder="Book a Call"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-[#1E293B] focus:border-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Target URL
                </label>
                <input
                  type="text"
                  maxLength={300}
                  value={(selectedExtra as ExtraCtaItem).url}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_EXTRA",
                      payload: { id: selectedExtra.id, item: { url: e.target.value } },
                    })
                  }
                  placeholder="https://calendly.com/your-name"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-[#1E293B] focus:border-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                />
              </div>

              {/* Alignment */}
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Alignment
                </label>
                <div className="flex rounded-lg bg-slate-100 p-1">
                  {(["left", "center", "right"] as const).map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: "UPDATE_EXTRA",
                          payload: { id: selectedExtra.id, item: { align: a } },
                        })
                      }
                      className={`flex-1 rounded py-1 text-xs font-semibold capitalize transition ${
                        (selectedExtra as ExtraCtaItem).align === a
                          ? "bg-white text-[#245FD4] shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 6. DIVIDER EXTRA ELEMENT */}
          {/* ======================================================== */}
          {selectedExtra?.type === "divider" && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center">
              <div className="h-0.5 w-24 bg-slate-300 mx-auto mb-3" />
              <p className="text-xs text-slate-600 leading-relaxed">
                This divider separates sections with a subtle 1px line matching your signature&apos;s theme.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-gradient-to-r from-[#245FD4] to-[#022977] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:opacity-95 transition"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
