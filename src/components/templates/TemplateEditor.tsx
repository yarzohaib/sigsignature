"use client";

import { useState, useRef, ChangeEvent, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import { TemplateItem, TemplateSignatureData } from "@/types/template";
import { SavedSignature } from "@/types/signature";
import { getSignatureRepository } from "@/lib/signatures/repository";
import { compressImageToBlob } from "@/lib/imageUtils";
import { uploadSignatureImage } from "@/lib/uploads";
import { isSignatureLimitError } from "@/app/lib/api";
import {
  getStoredSettings,
  getStoredUser,
  getStoredAvatarUrl,
  setStoredAvatarUrl,
} from "@/app/lib/auth";
import { SIGNATURE_COLOR_SWATCHES } from "@/lib/signatureConstants";
import { generateTemplateHtml } from "@/lib/templates/renderTemplateHtml";
import {
  VALID_TEMPLATE_FONTS,
  mapToValidTemplateFont,
} from "@/lib/templates/designs/shared";
import SaveSuccessModal from "@/components/signatures/SaveSuccessModal";
import LimitOverwriteModal from "@/components/signatures/LimitOverwriteModal";

interface TemplateEditorProps {
  template: TemplateItem;
  initialData?: TemplateSignatureData;
  editingSignatureId?: string;
  onBack: () => void;
}

export default function TemplateEditor({
  template,
  initialData,
  editingSignatureId,
  onBack,
}: TemplateEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Current signature ID being edited (persisted after first save)
  const [currentSignatureId, setCurrentSignatureId] = useState<string | undefined>(editingSignatureId);

  // Form data state: map legacy/unrecognized fonts to Arial; apply user defaults ONLY for new signatures
  const [formData, setFormData] = useState<TemplateSignatureData>(() => {
    const isNewSignature = !initialData && !editingSignatureId;
    const base = initialData || template.defaultData;
    let font = mapToValidTemplateFont(base.fontFamily);

    let themeColor = base.themeColor;
    let avatarUrl = base.avatarUrl;
    let fullName = base.fullName;
    let companyName = base.companyName;
    let email = base.email;

    if (isNewSignature) {
      const storedSettings = getStoredSettings();
      const storedUser = getStoredUser();
      const storedAvatar = getStoredAvatarUrl();

      if (storedSettings) {
        if (storedSettings.signatureFont) {
          font = mapToValidTemplateFont(storedSettings.signatureFont);
        }
        if (storedSettings.brandColor) {
          themeColor = storedSettings.brandColor;
        }
      }

      if (storedUser) {
        const userFullName = `${storedUser.firstName || ""} ${storedUser.lastName || ""}`.trim();
        if (userFullName) {
          fullName = userFullName;
        }
        if (storedUser.companyName) {
          companyName = storedUser.companyName;
        }
        if (storedUser.email) {
          email = storedUser.email;
        }
      }

      const shouldIncludePhoto = storedSettings?.includePhoto !== false;
      if (!shouldIncludePhoto) {
        avatarUrl = "";
      } else if (storedAvatar) {
        avatarUrl = storedAvatar;
      }
    }

    return {
      ...base,
      templateId: template.id,
      layout: template.defaultData.layout,
      fontFamily: font,
      themeColor,
      avatarUrl,
      fullName,
      companyName,
      email,
    };
  });

  // Collapsible accordion states
  const [openSections, setOpenSections] = useState({
    personal: true,
    branding: false,
    social: false,
    optional: false,
  });

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  // Limit overwrite modal state
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [existingSignaturesForLimit, setExistingSignaturesForLimit] = useState<SavedSignature[]>([]);
  // Photo uploading state
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  // Logo uploading state
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    subtitle: string;
    isError?: boolean;
  } | null>(null);

  // Synchronize user profile defaults on client mount (handles SSR/hydration cases)
  const hasAppliedDefaultsRef = useRef(false);
  useEffect(() => {
    const isNewSignature = !initialData && !editingSignatureId;
    if (!isNewSignature || hasAppliedDefaultsRef.current) return;
    hasAppliedDefaultsRef.current = true;

    const storedSettings = getStoredSettings();
    const storedUser = getStoredUser();
    const storedAvatar = getStoredAvatarUrl();

    setFormData((prev) => {
      let nextAvatar = prev.avatarUrl;
      const shouldIncludePhoto = storedSettings?.includePhoto !== false;
      if (!shouldIncludePhoto) {
        nextAvatar = "";
      } else if (storedAvatar) {
        nextAvatar = storedAvatar;
      }

      let nextFont = prev.fontFamily;
      if (storedSettings?.signatureFont) {
        nextFont = mapToValidTemplateFont(storedSettings.signatureFont);
      }

      let nextThemeColor = prev.themeColor;
      if (storedSettings?.brandColor) {
        nextThemeColor = storedSettings.brandColor;
      }

      let nextFullName = prev.fullName;
      let nextCompanyName = prev.companyName;
      let nextEmail = prev.email;

      if (storedUser) {
        const userFullName = `${storedUser.firstName || ""} ${storedUser.lastName || ""}`.trim();
        if (userFullName) {
          nextFullName = userFullName;
        }
        if (storedUser.companyName) {
          nextCompanyName = storedUser.companyName;
        }
        if (storedUser.email) {
          nextEmail = storedUser.email;
        }
      }

      return {
        ...prev,
        avatarUrl: nextAvatar,
        fontFamily: nextFont,
        themeColor: nextThemeColor,
        fullName: nextFullName,
        companyName: nextCompanyName,
        email: nextEmail,
      };
    });
  }, [initialData, editingSignatureId]);

  function showToast(title: string, subtitle: string, isError = false) {
    setToastMessage({ title, subtitle, isError });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }

  // Toggle accordion section
  function toggleSection(section: keyof typeof openSections) {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }

  // Handle text input changes
  function handleInputChange(field: keyof TemplateSignatureData, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // Handle social link changes
  function handleSocialChange(platform: keyof TemplateSignatureData["socials"], value: string) {
    setFormData((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [platform]: value,
      },
    }));
  }

  // Handle optional fields
  function handleOptionalChange(field: "address" | "tagline" | "disclaimer", value: string) {
    setFormData((prev) => ({
      ...prev,
      optional: {
        ...prev.optional,
        [field]: value,
      },
    }));
  }

  // User Photo Upload Handler with automatic compression and direct S3 presigned upload
  async function handlePhotoUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate the file type (jpeg, png, webp only) and show an error toast otherwise
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showToast("Invalid file", "Please upload a JPEG, PNG, or WebP image.", true);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast("File too large", "Please upload an image smaller than 10MB.", true);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const previousAvatar = formData.avatarUrl;
    // Show an immediate local preview using URL.createObjectURL while uploading, and revoke it afterward
    const objectUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      avatarUrl: objectUrl,
    }));
    setIsUploadingPhoto(true);

    try {
      // Compress to blob (max 400px, quality 0.85, kind: "avatar")
      const compressedBlob = await compressImageToBlob(file, 400, 0.85, "avatar");
      // Upload to S3 via backend presign endpoint
      const publicUrl = await uploadSignatureImage(compressedBlob, "avatar");

      setFormData((prev) => ({
        ...prev,
        avatarUrl: publicUrl,
      }));
      // If user had no stored avatar yet, persist this as their default avatar
      if (!getStoredAvatarUrl()) {
        setStoredAvatarUrl(publicUrl);
      }
      showToast("Photo uploaded!", "Your profile photo was uploaded successfully.");
    } catch (err: unknown) {
      console.error("Image upload error:", err);
      // On failure, restore the previous avatar and show an error toast with the message. Do not lose other form data.
      setFormData((prev) => ({
        ...prev,
        avatarUrl: previousAvatar,
      }));
      const message = err instanceof Error ? err.message : "Failed to upload image. Please try again.";
      showToast("Upload failed", message, true);
    } finally {
      URL.revokeObjectURL(objectUrl);
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  // Reset photo to user default photo or template photo
  function handleResetPhoto() {
    const storedSettings = getStoredSettings();
    const storedAvatar = getStoredAvatarUrl();
    const defaultAvatar =
      storedSettings?.includePhoto === false
        ? ""
        : (storedAvatar || template.defaultData.avatarUrl);

    setFormData((prev) => ({
      ...prev,
      avatarUrl: defaultAvatar,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // Helper to prepare form data for save
  function prepareDataForSave(): TemplateSignatureData {
    const rawInsta = formData.socials.instagram?.trim() || "";
    const normalizedInsta = rawInsta
      ? rawInsta.startsWith("http://") || rawInsta.startsWith("https://")
        ? rawInsta
        : `https://instagram.com/${rawInsta.replace(/^@/, "").replace(/\/.*$/, "")}`
      : "";

    return {
      ...formData,
      socials: {
        ...formData.socials,
        instagram: normalizedInsta,
      },
    };
  }

  // Save the signature to user's signatures list
  async function handleSaveSignature() {
    try {
      setIsSaving(true);
      const dataToSave = prepareDataForSave();
      const saved = await getSignatureRepository().save({
        id: currentSignatureId,
        templateId: template.id,
        name: formData.fullName || template.name || "My Signature",
        data: dataToSave,
      });
      setCurrentSignatureId(saved.id);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("sig_count_update"));
      }
      setIsSavedModalOpen(true);
    } catch (err: unknown) {
      if (isSignatureLimitError(err)) {
        try {
          const list = await getSignatureRepository().list();
          setExistingSignaturesForLimit(list);
          setIsLimitModalOpen(true);
        } catch {
          showToast(
            "Limit reached",
            "You have reached the limit of 3 signatures on the Free plan.",
            true
          );
        }
      } else {
        const message = err instanceof Error ? err.message : "Failed to save signature.";
        showToast("Save failed", message, true);
      }
    } finally {
      setIsSaving(false);
    }
  }

  // Handle overwrite choice when user is at 3-signature limit
  async function handleSelectOverwrite(target: SavedSignature) {
    const dataToSave = prepareDataForSave();
    const saved = await getSignatureRepository().save({
      id: target.id,
      templateId: template.id,
      name: formData.fullName || target.name || template.name || "My Signature",
      data: dataToSave,
    });
    setCurrentSignatureId(saved.id);
    setIsLimitModalOpen(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("sig_count_update"));
    }
    setIsSavedModalOpen(true);
    showToast("Signature updated!", `Replaced "${target.name}" with your new signature.`);
  }

  // User Company Logo Upload Handler
  async function handleLogoUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showToast("Invalid file", "Please upload a JPEG, PNG, or WebP image.", true);
      if (logoInputRef.current) {
        logoInputRef.current.value = "";
      }
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast("File too large", "Please upload an image smaller than 10MB.", true);
      if (logoInputRef.current) {
        logoInputRef.current.value = "";
      }
      return;
    }

    const previousLogo = formData.companyLogoUrl;
    const objectUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      companyLogoUrl: objectUrl,
    }));
    setIsUploadingLogo(true);

    try {
      const compressedBlob = await compressImageToBlob(file, 400, 0.85, "logo");
      const publicUrl = await uploadSignatureImage(compressedBlob, "logo");
      setFormData((prev) => ({
        ...prev,
        companyLogoUrl: publicUrl,
      }));
      showToast("Logo uploaded!", "Your company logo was uploaded successfully.");
    } catch (err: unknown) {
      console.error("Logo upload error:", err);
      setFormData((prev) => ({
        ...prev,
        companyLogoUrl: previousLogo,
      }));
      const message = err instanceof Error ? err.message : "Failed to upload logo. Please try again.";
      showToast("Upload failed", message, true);
    } finally {
      URL.revokeObjectURL(objectUrl);
      setIsUploadingLogo(false);
      if (logoInputRef.current) {
        logoInputRef.current.value = "";
      }
    }
  }

  function handleRemoveLogo() {
    setFormData((prev) => ({
      ...prev,
      companyLogoUrl: "",
    }));
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  }

  // Pre-generate HTML and minimal srcDoc for iframe preview
  const generatedHtml = useMemo(
    () => generateTemplateHtml({ ...formData, templateId: template.id }),
    [formData, template.id]
  );

  const previewSrcDoc = useMemo(() => {
    return `<!DOCTYPE html><html><head><meta charset="utf-8" /><style>html, body { margin: 0; padding: 16px; background-color: #ffffff; box-sizing: border-box; } * { box-sizing: border-box; }</style></head><body>${generatedHtml}</body></html>`;
  }, [generatedHtml]);

  // Auto-size iframe height from content on load and whenever form data changes
  const updateIframeHeight = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const doc = iframe.contentDocument;
      if (doc) {
        const height = Math.max(
          doc.body?.scrollHeight || 0,
          doc.documentElement?.scrollHeight || 0
        );
        if (height > 0) {
          iframe.style.height = `${height}px`;
        }
      }
    } catch {
      // Ignore cross-origin error if any
    }
  }, []);

  useEffect(() => {
    updateIframeHeight();
    const t1 = setTimeout(updateIframeHeight, 50);
    const t2 = setTimeout(updateIframeHeight, 200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [generatedHtml, updateIframeHeight]);

  return (
    <div className="flex flex-col gap-5 sm:gap-6 pb-12">
      {/* Top Header Row matching Figma: Back Button & Template Name */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-6 sm:gap-7">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-start bg-transparent p-0 transition hover:opacity-80 active:scale-98 cursor-pointer"
            style={{
              height: "36px",
              gap: "8px",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              lineHeight: "36px",
              letterSpacing: "0%",
              verticalAlign: "middle",
              color: "#022977",
              opacity: 1,
            }}
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#022977" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span className="whitespace-nowrap">Back to Templates</span>
          </button>

          <div className="flex items-center gap-1.5">
            <span
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "36px",
                letterSpacing: "0%",
                verticalAlign: "middle",
                color: "#1E293B",
              }}
            >
              Editing:
            </span>
            <span
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "36px",
                letterSpacing: "0%",
                verticalAlign: "middle",
                color: "#94A3B8",
              }}
            >
              {template.name}
            </span>
          </div>
        </div>
      </div>

      {/* Customization Toolbar matching Figma */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs">
        {/* Font Picker */}
        <div className="flex items-center gap-2 border-r border-slate-200/80 pr-3.5">
          <span className="text-[12px] font-medium text-[#64748B]">Font</span>
          <select
            value={mapToValidTemplateFont(formData.fontFamily)}
            onChange={(e) => handleInputChange("fontFamily", mapToValidTemplateFont(e.target.value))}
            className="rounded-lg border border-slate-200 bg-[#F8FAFC] px-2.5 py-1 text-xs font-semibold text-[#1E293B] focus:border-[#245FD4] focus:outline-none"
          >
            {VALID_TEMPLATE_FONTS.map((fontName) => (
              <option key={fontName} value={fontName}>
                {fontName}
              </option>
            ))}
          </select>
        </div>

        {/* Colors Swatches */}
        <div className="flex items-center gap-2 border-r border-slate-200/80 pr-3.5">
          <span className="text-[12px] font-medium text-[#64748B]">Colors</span>
          <div className="flex items-center gap-1.5">
            {SIGNATURE_COLOR_SWATCHES.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleInputChange("themeColor", color)}
                className={`h-5 w-5 rounded-full border transition-all ${
                  formData.themeColor === color ? "scale-110 ring-2 ring-blue-400 ring-offset-1" : "border-slate-300 hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>


        {/* Social Icons Style */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-[#64748B]">Social Icons</span>
          <select
            value={formData.socialIconsStyle}
            onChange={(e) => handleInputChange("socialIconsStyle", e.target.value)}
            className="rounded-lg border border-slate-200 bg-[#F8FAFC] px-2.5 py-1 text-xs font-semibold text-[#1E293B] focus:border-[#245FD4] focus:outline-none"
          >
            <option value="filled">Filled</option>
            <option value="outline">Outline</option>
            <option value="circle">Circle</option>
          </select>
        </div>
      </div>

      {/* Main 2-Column Work Area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Form Customization Accordion */}
        <div className="flex flex-col gap-3.5 lg:col-span-6 xl:col-span-6">
          {/* Section 1: Personal Information */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all">
            <button
              type="button"
              onClick={() => toggleSection("personal")}
              className="flex w-full items-center justify-between text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#245FD4]">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <h3
                  className="text-[15px] font-bold text-[#1E293B]"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Personal Information
                </h3>
              </div>
              <svg
                className={`h-4 w-4 text-slate-400 transition-transform ${openSections.personal ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {openSections.personal && (
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-4">
                {/* Photo Upload Row (Requirement: User can upload their own photo) */}
                <div className="rounded-xl border border-dashed border-slate-300 bg-[#F8FAFC] p-3 sm:p-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white border border-slate-200 shadow-xs">
                      <Image
                        src={formData.avatarUrl || "/placeholder-avatar.svg"}
                        alt="Profile photo"
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#1E293B]">Profile Photo</p>
                      <p className="text-[11px] text-[#64748B] mt-0.5">Upload a square photo (PNG, JPG, max 2MB).</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isUploadingPhoto}
                          onClick={() => fileInputRef.current?.click()}
                          className="rounded-lg bg-[#245FD4] px-3 py-1 text-[11px] font-medium text-white shadow-2xs transition hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {isUploadingPhoto ? "Uploading..." : "Upload Custom Photo"}
                        </button>
                        {formData.avatarUrl ? (
                          <button
                            type="button"
                            disabled={isUploadingPhoto}
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, avatarUrl: "" }));
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isUploadingPhoto}
                            onClick={handleResetPhoto}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            Restore Default
                          </button>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* {(!formData.avatarUrl || formData.avatarUrl.startsWith("/")) && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200/90 bg-amber-50/90 p-2.5 text-[11px] text-amber-800 leading-snug">
                      <svg className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span>This is a sample photo. Upload your own photo, otherwise your signature will be exported without a photo.</span>
                    </div>
                  )} */}
                </div>

                {/* Text input fields (2-column grid matching Figma) */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">
                      Full Name <span className="text-blue-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="e.g. Daniel Wilson"
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs transition focus:border-[#245FD4] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">
                      Job Title <span className="text-blue-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                      placeholder="e.g. UX/UI Designer"
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs transition focus:border-[#245FD4] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">
                      Company Name <span className="text-blue-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs transition focus:border-[#245FD4] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">
                      Email Address <span className="text-blue-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="e.g. name@company.com"
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs transition focus:border-[#245FD4] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">
                      Phone Number <span className="text-blue-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="e.g. +1 (555) 345-6789"
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs transition focus:border-[#245FD4] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">
                      Website URL <span className="text-blue-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="e.g. www.company.com"
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs transition focus:border-[#245FD4] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Branding */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all">
            <button
              type="button"
              onClick={() => toggleSection("branding")}
              className="flex w-full items-center justify-between text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </span>
                <h3
                  className="text-[15px] font-bold text-[#1E293B]"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Branding
                </h3>
              </div>
              <svg
                className={`h-4 w-4 text-slate-400 transition-transform ${openSections.branding ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {openSections.branding && (
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-4">
                {/* Company Logo Upload Row */}
                <div className="rounded-xl border border-dashed border-slate-300 bg-[#F8FAFC] p-3 sm:p-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center">
                      {formData.companyLogoUrl ? (
                        <Image
                          src={formData.companyLogoUrl}
                          alt="Company logo"
                          width={56}
                          height={56}
                          className="h-full w-full object-contain p-1"
                          unoptimized
                        />
                      ) : (
                        <svg className="h-6 w-6 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#1E293B]">Company Logo</p>
                      <p className="text-[11px] text-[#64748B] mt-0.5">Upload a square or wide logo (PNG, JPG, max 10MB).</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isUploadingLogo}
                          onClick={() => logoInputRef.current?.click()}
                          className="rounded-lg bg-[#245FD4] px-3 py-1 text-[11px] font-medium text-white shadow-2xs transition hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {isUploadingLogo ? "Uploading..." : formData.companyLogoUrl ? "Change Logo" : "Upload Logo"}
                        </button>
                        {Boolean(formData.companyLogoUrl) && (
                          <button
                            type="button"
                            disabled={isUploadingLogo}
                            onClick={handleRemoveLogo}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-red-600 hover:bg-red-50 hover:border-red-200 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            Remove
                          </button>
                        )}
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#64748B]">Tagline</label>
                  <input
                    type="text"
                    value={formData.optional.tagline || ""}
                    onChange={(e) => handleOptionalChange("tagline", e.target.value)}
                    placeholder="e.g. Elevate your presence"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs focus:border-[#245FD4] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Social Links */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all">
            <button
              type="button"
              onClick={() => toggleSection("social")}
              className="flex w-full items-center justify-between text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </span>
                <h3
                  className="text-[15px] font-bold text-[#1E293B]"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Social Links
                </h3>
              </div>
              <svg
                className={`h-4 w-4 text-slate-400 transition-transform ${openSections.social ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {openSections.social && (
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#64748B]">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={formData.socials.linkedin}
                    onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs focus:border-[#245FD4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#64748B]">X / Twitter Profile</label>
                  <input
                    type="url"
                    value={formData.socials.twitter}
                    onChange={(e) => handleSocialChange("twitter", e.target.value)}
                    placeholder="https://x.com/..."
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs focus:border-[#245FD4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#64748B]">Facebook Profile</label>
                  <input
                    type="url"
                    value={formData.socials.facebook}
                    onChange={(e) => handleSocialChange("facebook", e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs focus:border-[#245FD4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#64748B]">Instagram Profile</label>
                  <input
                    type="text"
                    value={formData.socials.instagram || ""}
                    onChange={(e) => handleSocialChange("instagram", e.target.value)}
                    placeholder="https://instagram.com/... or @handle"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs focus:border-[#245FD4] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Optional Information */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all">
            <button
              type="button"
              onClick={() => toggleSection("optional")}
              className="flex w-full items-center justify-between text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </span>
                <h3
                  className="text-[15px] font-bold text-[#1E293B]"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Optional
                </h3>
              </div>
              <svg
                className={`h-4 w-4 text-slate-400 transition-transform ${openSections.optional ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {openSections.optional && (
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#64748B]">Office Address</label>
                  <input
                    type="text"
                    value={formData.optional.address || ""}
                    onChange={(e) => handleOptionalChange("address", e.target.value)}
                    placeholder="e.g. 123 Business Ave, New York, NY 10001"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs focus:border-[#245FD4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#64748B]">
                    Servicing Region / Disclaimer Notice
                  </label>
                  <input
                    type="text"
                    value={formData.optional.disclaimer || ""}
                    onChange={(e) => handleOptionalChange("disclaimer", e.target.value)}
                    placeholder="e.g. Proudly servicing Metropolitan & Regional Areas"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs focus:border-[#245FD4] focus:outline-none"
                  />
                  <p className="mt-1 text-[10px] text-[#94A3B8]">
                    Displayed in the signature footer bar or disclaimer notice.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Email Live Preview Window matching Figma */}
        <div className="lg:col-span-6 xl:col-span-6 sticky top-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
            {/* macOS Compose Window Header with 3 dots */}
            <div className="flex items-center gap-2 border-b border-slate-100 bg-[#FAFAFA] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#EF4444]" />
              <span className="h-3 w-3 rounded-full bg-[#F59E0B]" />
              <span className="h-3 w-3 rounded-full bg-[#10B981]" />
            </div>

            {/* Email Header Simulation */}
            <div className="border-b border-slate-100 px-5 py-2.5 text-xs text-[#94A3B8] space-y-1">
              <div>To: <span className="text-[#64748B]">recipient@client.com</span></div>
              <div>Subject: <span className="text-[#64748B]">Re: Project Proposal</span></div>
            </div>

            {/* Email Body / Live Signature Canvas */}
            <div className="p-6 sm:p-7 min-h-[220px] flex items-center justify-center bg-white">
              <div className="w-full rounded-xl border border-slate-100 bg-white shadow-xs overflow-hidden transition-all">
                <iframe
                  ref={iframeRef}
                  sandbox="allow-same-origin"
                  srcDoc={previewSrcDoc}
                  onLoad={updateIframeHeight}
                  title="Signature Preview"
                  className="w-full border-0 block"
                  style={{
                    width: "100%",
                    border: "none",
                    minHeight: "140px",
                    overflow: "hidden",
                    backgroundColor: "#ffffff",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer matching Figma */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200/80 pt-5">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-semibold text-[#022977] hover:underline"
        >
          Continue Without Saving
        </button>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            disabled={isSaving || isUploadingPhoto || isUploadingLogo}
            onClick={handleSaveSignature}
            className="inline-flex h-[40px] items-center justify-center gap-1.5 rounded-lg bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-5 text-xs font-semibold text-white shadow-xs transition hover:opacity-95 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving && (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            <span>{isSaving ? "Saving..." : "Save the Signature"}</span>
            {!isSaving && (
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 rounded-xl border bg-white p-4 shadow-xl animate-in slide-in-from-bottom-5 duration-200 ${
            toastMessage.isError ? "border-red-200" : "border-emerald-100"
          }`}
        >
          <div
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
              toastMessage.isError ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
            }`}
          >
            {toastMessage.isError ? (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <div>
            <h5 className="text-xs font-bold text-[#1E293B]">{toastMessage.title}</h5>
            <p className="text-[11px] text-[#64748B] mt-0.5">{toastMessage.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-slate-600"
            aria-label="Close notification"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Save Success Popup Modal */}
      <SaveSuccessModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        signatureData={formData}
        signatureName={formData.fullName || template.name}
      />

      {/* Signature Plan Limit Overwrite Modal */}
      <LimitOverwriteModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        signatures={existingSignaturesForLimit}
        onSelectOverwrite={handleSelectOverwrite}
      />
    </div>
  );
}
