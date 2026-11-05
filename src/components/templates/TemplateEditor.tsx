"use client";

import { useState, useRef, ChangeEvent, useMemo, useEffect, useCallback, useDeferredValue } from "react";
import Image from "next/image";
import Select from "@/components/ui/Select";
import { TemplateItem, TemplateSignatureData } from "@/types/template";
import { getSignatureRepository } from "@/lib/signatures/repository";
import { compressImageToBlob, isAllowedJpgOrPng } from "@/lib/imageUtils";
import { uploadSignatureImage } from "@/lib/uploads";
import { isSignatureLimitError } from "@/app/lib/api";
import { isSignatureLimitReached } from "@/lib/signatures/lifetimeTracker";
import {
  getStoredSettings,
  getStoredUser,
  getStoredToken,
  getStoredAvatarUrl,
  setStoredAvatarUrl,
} from "@/app/lib/auth";
import { SIGNATURE_COLOR_SWATCHES } from "@/lib/signatureConstants";
import {
  generateTemplateHtml,
  getTemplateOptionalCapabilities,
} from "@/lib/templates/renderTemplateHtml";
import {
  VALID_TEMPLATE_FONTS,
  mapToValidTemplateFont,
} from "@/lib/templates/designs/shared";
import SaveSuccessModal from "@/components/signatures/SaveSuccessModal";
import LimitOverwriteModal from "@/components/signatures/LimitOverwriteModal";
import TemplateAuthPromptModal from "./TemplateAuthPromptModal";
import ImageCropModal from "@/components/common/ImageCropModal";
import SignaturePreviewFrame from "@/components/studio/SignaturePreviewFrame";
import {
  validateSocialUrl,
  SOCIAL_PLATFORM_EXAMPLES,
  TeamMemberSocialPlatform,
} from "@/lib/team/socials";
import {
  isValidEmail,
  sanitizePhone,
  isValidPhone,
  validateWebsiteUrl,
  isValidWebsiteUrl,
  MAX_LENGTH,
} from "@/lib/validation";

const SOCIAL_CONFIG: Array<{
  key: "linkedin" | "twitter" | "facebook" | "instagram" | "github";
  platform: TeamMemberSocialPlatform;
  label: string;
  placeholder: string;
}> = [
  {
    key: "linkedin",
    platform: "linkedin",
    label: "LinkedIn Profile",
    placeholder: SOCIAL_PLATFORM_EXAMPLES.linkedin,
  },
  {
    key: "twitter",
    platform: "x",
    label: "X / Twitter Profile",
    placeholder: "https://x.com/username",
  },
  {
    key: "facebook",
    platform: "facebook",
    label: "Facebook Profile",
    placeholder: SOCIAL_PLATFORM_EXAMPLES.facebook,
  },
  {
    key: "instagram",
    platform: "instagram",
    label: "Instagram Profile",
    placeholder: SOCIAL_PLATFORM_EXAMPLES.instagram,
  },
  {
    key: "github",
    platform: "github",
    label: "GitHub Profile",
    placeholder: SOCIAL_PLATFORM_EXAMPLES.github,
  },
];

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

  // Dynamic template optional capabilities (probes if template supports company name, logo, photo, address, disclaimer, tagline)
  const optionalCapabilities = useMemo(() => {
    return getTemplateOptionalCapabilities(
      template.id,
      initialData?.layout || template.defaultData.layout
    );
  }, [template.id, initialData?.layout, template.defaultData.layout]);

  const supportsProfilePhoto = optionalCapabilities.supportsProfilePhoto;
  const supportsCompanyLogo = optionalCapabilities.supportsCompanyLogo;
  const supportsCompanyName = optionalCapabilities.supportsCompanyName;
  const hasBrandingSection = supportsCompanyLogo || optionalCapabilities.supportsTagline;
  const preferTableBounds = [
    "corporate-elegant",
    "executive-corporate",
    "bold-block",
    "modern-dark",
    "bold-gradient",
  ].includes(template.id);

  // Current signature ID being edited (persisted after first save)
  const [currentSignatureId, setCurrentSignatureId] = useState<string | undefined>(editingSignatureId);
  const isEditing = Boolean(currentSignatureId);

  // Form data state: map legacy/unrecognized fonts to Arial; apply user defaults ONLY for new signatures
  const [formData, setFormData] = useState<TemplateSignatureData>(() => {
    const isNewSignature = !initialData && !editingSignatureId;
    const base = initialData || template.defaultData;
    let font = mapToValidTemplateFont(base.fontFamily);

    let themeColor = base.themeColor;
    let avatarUrl = supportsProfilePhoto ? base.avatarUrl : "";
    let fullName = base.fullName;
    let companyName = base.companyName;
    let email = base.email;
    let pendingData: Partial<TemplateSignatureData> = {};

    if (isNewSignature) {
      const storedSettings = getStoredSettings();
      const storedUser = getStoredUser();
      const storedAvatar = getStoredAvatarUrl();

      // Only override font/themeColor if the user explicitly customized them away from default blue
      if (storedSettings?.signatureFont) {
        font = mapToValidTemplateFont(storedSettings.signatureFont);
      }
      if (storedSettings?.brandColor && storedSettings.brandColor !== "#245FD4") {
        themeColor = storedSettings.brandColor;
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

      if (supportsProfilePhoto) {
        const shouldIncludePhoto = storedSettings?.includePhoto !== false;
        if (!shouldIncludePhoto) {
          avatarUrl = "";
        } else if (storedAvatar) {
          avatarUrl = storedAvatar;
        }
      }

      try {
        const pendingRaw = localStorage.getItem("sig_pending_template_save");
        if (pendingRaw) {
          const pending = JSON.parse(pendingRaw);
          if (pending && pending.templateId === template.id && pending.data) {
            pendingData = pending.data;
          }
        }
      } catch {
        // Ignore parse error
      }
    }

    return {
      ...base,
      templateId: template.id,
      layout: template.defaultData.layout,
      fontFamily: font,
      themeColor: themeColor || template.defaultData.themeColor || "#245FD4",
      avatarUrl,
      fullName,
      companyName,
      email,
      socials: isNewSignature
        ? (template.defaultData.socials || { linkedin: "https://linkedin.com", twitter: "https://twitter.com" })
        : base.socials,
      ...pendingData,
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
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  // Limit modal state
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  // Photo uploading state
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [avatarCropSrc, setAvatarCropSrc] = useState<string | null>(null);
  const [avatarCropFileName, setAvatarCropFileName] = useState<string>("avatar.png");
  // Logo uploading state
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Validate email address matching standard email rules
  const emailError = useMemo(() => {
    const trimmed = formData.email?.trim() || "";
    if (!trimmed) {
      return "Email address is required.";
    }
    if (!isValidEmail(trimmed)) {
      return "Please enter a valid email address.";
    }
    return null;
  }, [formData.email]);

  // Validate phone number format
  const phoneError = useMemo(() => {
    const trimmed = formData.phone?.trim() || "";
    if (!trimmed) {
      return "Phone number is required.";
    }
    if (!isValidPhone(trimmed)) {
      return "Please enter a valid phone number (at least 6 digits).";
    }
    return null;
  }, [formData.phone]);

  // Validate website URL format
  const websiteError = useMemo(() => {
    return validateWebsiteUrl(formData.website);
  }, [formData.website]);

  // Validate social profile links matching platform rules
  const socialErrors = useMemo(() => {
    const errs: Record<string, string> = {};
    const mapping: Record<string, TeamMemberSocialPlatform> = {
      linkedin: "linkedin",
      twitter: "x",
      facebook: "facebook",
      instagram: "instagram",
      github: "github",
    };
    Object.entries(mapping).forEach(([key, plat]) => {
      const val = formData.socials?.[key as keyof typeof formData.socials];
      if (val && val.trim()) {
        const err = validateSocialUrl(plat, val);
        if (err) errs[key] = err;
      }
    });
    return errs;
  }, [formData.socials]);

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
      if (!supportsProfilePhoto || storedSettings?.includePhoto === false) {
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
  }, [initialData, editingSignatureId, supportsProfilePhoto]);

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

    // Validate the file type (JPG and PNG only) and show an error toast otherwise
    if (!isAllowedJpgOrPng(file)) {
      showToast("Invalid file", "Please upload a JPG or PNG image.", true);
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

    const objectUrl = URL.createObjectURL(file);
    setAvatarCropSrc(objectUrl);
    setAvatarCropFileName(file.name);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const handleCloseAvatarCrop = () => {
    if (avatarCropSrc) {
      URL.revokeObjectURL(avatarCropSrc);
    }
    setAvatarCropSrc(null);
  };

  const handleApplyAvatarCrop = async (croppedFile: File) => {
    const previousAvatar = formData.avatarUrl;
    // Show an immediate local preview using URL.createObjectURL while uploading, and revoke it afterward
    const objectUrl = URL.createObjectURL(croppedFile);
    setFormData((prev) => ({
      ...prev,
      avatarUrl: objectUrl,
    }));
    setIsUploadingPhoto(true);

    const user = getStoredUser();
    const token = getStoredToken();
    if (!user || !token) {
      // Guest preview: convert to data URL so it displays in preview without 401 auth upload errors
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setFormData((prev) => ({
          ...prev,
          avatarUrl: dataUrl,
        }));
        showToast("Photo added!", "Sign in or save to upload your photo permanently.");
        setIsUploadingPhoto(false);
      };
      reader.readAsDataURL(croppedFile);
      return;
    }

    try {
      // Compress to blob (max 400px, quality 0.85, kind: "avatar")
      const compressedBlob = await compressImageToBlob(croppedFile, 400, 0.85, "avatar");
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
      handleCloseAvatarCrop();
    }
  };

  // Reset photo to user default photo or template photo
  function handleResetPhoto() {
    const storedSettings = getStoredSettings();
    const storedAvatar = getStoredAvatarUrl();
    const defaultAvatar =
      !supportsProfilePhoto || storedSettings?.includePhoto === false
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
    return {
      ...formData,
      socials: {
        linkedin: formData.socials.linkedin?.trim() || "",
        twitter: formData.socials.twitter?.trim() || "",
        facebook: formData.socials.facebook?.trim() || "",
        instagram: formData.socials.instagram?.trim() || "",
        github: formData.socials.github?.trim() || "",
      },
    };
  }

  // Save the signature to user's signatures list
  async function handleSaveSignature() {
    if (emailError) {
      setOpenSections((prev) => ({ ...prev, personal: true }));
      showToast("Invalid email address", emailError, true);
      return;
    }

    if (phoneError) {
      setOpenSections((prev) => ({ ...prev, personal: true }));
      showToast("Invalid phone number", phoneError, true);
      return;
    }

    if (websiteError) {
      setOpenSections((prev) => ({ ...prev, personal: true }));
      showToast("Invalid website URL", websiteError, true);
      return;
    }

    if (Object.keys(socialErrors).length > 0) {
      setOpenSections((prev) => ({ ...prev, social: true }));
      showToast("Invalid social link", "Please fix the invalid social profile URLs before saving.", true);
      return;
    }

    // Require authentication to save signature to account
    const user = getStoredUser();
    const token = getStoredToken();
    if (!user || !token) {
      try {
        const dataToSave = prepareDataForSave();
        localStorage.setItem(
          "sig_pending_template_save",
          JSON.stringify({
            templateId: template.id,
            name: formData.fullName || template.name || "My Signature",
            data: dataToSave,
          })
        );
      } catch {
        // Continue even if localStorage quota exceeded
      }
      setIsAuthPromptOpen(true);
      return;
    }

    if (!currentSignatureId && isSignatureLimitReached()) {
      setIsLimitModalOpen(true);
      return;
    }

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
        setIsLimitModalOpen(true);
      } else {
        const message = err instanceof Error ? err.message : "Failed to save signature.";
        showToast("Save failed", message, true);
      }
    } finally {
      setIsSaving(false);
    }
  }

  // User Company Logo Upload Handler
  async function handleLogoUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isAllowedJpgOrPng(file)) {
      showToast("Invalid file", "Please upload a JPG or PNG image.", true);
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

    const user = getStoredUser();
    const token = getStoredToken();
    if (!user || !token) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setFormData((prev) => ({
          ...prev,
          companyLogoUrl: dataUrl,
        }));
        showToast("Logo added!", "Sign in or save to upload your logo permanently.");
        setIsUploadingLogo(false);
      };
      reader.readAsDataURL(file);
      return;
    }

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

  // Keep form controls urgent while signature generation runs at deferred priority.
  const deferredFormData = useDeferredValue(formData);

  // Pre-generate HTML for the iframe preview from the deferred form snapshot.
  const generatedHtml = useMemo(() => {
    const validSocials: TemplateSignatureData["socials"] = { ...deferredFormData.socials };
    const mapping: Record<string, TeamMemberSocialPlatform> = {
      linkedin: "linkedin",
      twitter: "x",
      facebook: "facebook",
      instagram: "instagram",
      github: "github",
    };
    Object.entries(mapping).forEach(([key, plat]) => {
      const val = validSocials[key as keyof typeof validSocials];
      if (val && val.trim()) {
        const err = validateSocialUrl(plat, val);
        if (err) {
          validSocials[key as keyof typeof validSocials] = "";
        }
      }
    });
    // Do not accept invalid email into signature preview
    const previewEmail = isValidEmail(deferredFormData.email) ? deferredFormData.email.trim() : "";
    // Do not accept invalid phone into signature preview
    const previewPhone = isValidPhone(deferredFormData.phone) ? deferredFormData.phone.trim() : "";
    // Do not accept invalid website into signature preview
    const previewWebsite = isValidWebsiteUrl(deferredFormData.website) ? deferredFormData.website.trim() : "";

    return generateTemplateHtml(
      {
        ...deferredFormData,
        email: previewEmail,
        phone: previewPhone,
        website: previewWebsite,
        socials: validSocials,
        templateId: template.id,
      },
      { preview: true }
    );
  }, [deferredFormData, template.id]);

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
          <Select
            value={mapToValidTemplateFont(formData.fontFamily)}
            onValueChange={(fontName) => handleInputChange("fontFamily", mapToValidTemplateFont(fontName))}
            options={VALID_TEMPLATE_FONTS.map((fontName) => ({ value: fontName, label: fontName }))}
            className="h-9 rounded-lg bg-[#F8FAFC] px-2.5 text-xs font-semibold"
          />
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
          <Select
            value={formData.socialIconsStyle}
            onValueChange={(value) => handleInputChange("socialIconsStyle", value)}
            options={[
              { value: "filled", label: "Filled (Solid shape)" },
              { value: "outline", label: "Outline (Bordered)" },
              { value: "circle", label: "Circle (Round disc)" },
            ]}
            className="h-9 rounded-lg bg-[#F8FAFC] px-2.5 text-xs font-semibold"
            title="Filled: solid icon badge | Outline: bordered icon | Circle: round disc"
          />
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
                {supportsProfilePhoto && (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-[#F8FAFC] p-3 sm:p-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center shadow-xs">
                      {formData.avatarUrl ? (
                        <Image
                          src={formData.avatarUrl}
                          alt="Profile photo"
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <svg
                          className="h-8 w-8 text-slate-400"
                          viewBox="0 0 40 40"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <circle cx="20" cy="15" r="6.5" fill="currentColor" />
                          <path d="M8.5 34.5C8.5 28.5 13.5 25 20 25C26.5 25 31.5 28.5 31.5 34.5" fill="currentColor" />
                        </svg>
                      )}
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
                          accept=".jpg, .png"
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
                )}

                {/* Text input fields (2-column grid matching Figma) */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <div className="flex h-5 items-center justify-between">
                      <label className="text-[11px] font-semibold text-[#64748B]">
                        Full Name <span className="text-blue-600">*</span>
                      </label>
                      {isEditing && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          <svg className="w-2.5 h-2.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                          Locked
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={formData.fullName}
                      maxLength={MAX_LENGTH.NAME}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      disabled={isEditing}
                      placeholder="e.g. Daniel Wilson"
                      className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs font-medium shadow-2xs transition ${
                        isEditing
                          ? "border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed select-none"
                          : "border-slate-200 text-[#1E293B] focus:border-[#245FD4] focus:outline-none"
                      }`}
                    />
                    {isEditing && (
                      <p className="mt-1 text-[10px] text-slate-400">
                        Locked to preserve signature identity on the Free plan.
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex h-5 items-center justify-between">
                      <label className="text-[11px] font-semibold text-[#64748B]">
                        Job Title <span className="text-blue-600">*</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={formData.jobTitle}
                      maxLength={MAX_LENGTH.JOB_TITLE}
                      onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                      placeholder="e.g. UX/UI Designer"
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs transition focus:border-[#245FD4] focus:outline-none"
                    />
                  </div>

                  {supportsCompanyName && (
                    <div>
                      <div className="flex h-5 items-center justify-between">
                        <label className="text-[11px] font-semibold text-[#64748B]">
                          Company Name <span className="text-blue-600">*</span>
                        </label>
                        {isEditing && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            <svg className="w-2.5 h-2.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            Locked
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={formData.companyName}
                        maxLength={MAX_LENGTH.COMPANY}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        disabled={isEditing}
                        placeholder="e.g. Acme Corp"
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs font-medium shadow-2xs transition ${
                          isEditing
                            ? "border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed select-none"
                            : "border-slate-200 text-[#1E293B] focus:border-[#245FD4] focus:outline-none"
                        }`}
                      />
                      {isEditing && (
                        <p className="mt-1 text-[10px] text-slate-400">
                          Locked to preserve signature identity on the Free plan.
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <div className="flex h-5 items-center justify-between">
                      <label className="text-[11px] font-semibold text-[#64748B]">
                        Email Address <span className="text-blue-600">*</span>
                      </label>
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      maxLength={MAX_LENGTH.EMAIL}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="e.g. name@company.com"
                      className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs transition focus:outline-none ${
                        emailError
                          ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200"
                          : "border-slate-200 focus:border-[#245FD4]"
                      }`}
                    />
                    {emailError && (
                      <p className="mt-1 text-[11px] text-rose-500">{emailError}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex h-5 items-center justify-between">
                      <label className="text-[11px] font-semibold text-[#64748B]">
                        Phone Number <span className="text-blue-600">*</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={formData.phone}
                      maxLength={MAX_LENGTH.PHONE}
                      onChange={(e) => handleInputChange("phone", sanitizePhone(e.target.value))}
                      placeholder="e.g. +1 (555) 345-6789"
                      className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs transition focus:outline-none ${
                        phoneError
                          ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200"
                          : "border-slate-200 focus:border-[#245FD4]"
                      }`}
                    />
                    {phoneError && (
                      <p className="mt-1 text-[11px] text-rose-500">{phoneError}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex h-5 items-center justify-between">
                      <label className="text-[11px] font-semibold text-[#64748B]">
                        Website URL <span className="text-blue-600">*</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={formData.website}
                      maxLength={MAX_LENGTH.WEBSITE}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="e.g. www.company.com"
                      className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs transition focus:outline-none ${
                        websiteError
                          ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200"
                          : "border-slate-200 focus:border-[#245FD4]"
                      }`}
                    />
                    {websiteError && (
                      <p className="mt-1 text-[11px] text-rose-500">{websiteError}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Branding (rendered only if template supports logo or tagline) */}
          {hasBrandingSection && (
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
                  {/* Company Logo Upload Row (rendered only if template supports company logo) */}
                  {supportsCompanyLogo && (
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
                          <p className="text-[11px] text-[#64748B] mt-0.5">Upload a square or wide logo (PNG, JPG, max 10MB). Logo displays alongside your contact details in your signature.</p>
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
                              accept=".jpg, .png"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {optionalCapabilities.supportsTagline && (
                    <div>
                      <label className="text-[11px] font-semibold text-[#64748B]">Tagline</label>
                      <input
                        type="text"
                        value={formData.optional.tagline || ""}
                        maxLength={MAX_LENGTH.TAGLINE}
                        onChange={(e) => handleOptionalChange("tagline", e.target.value)}
                        placeholder="e.g. Elevate your presence"
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs focus:border-[#245FD4] focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

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
                {SOCIAL_CONFIG.map(({ key, label, placeholder }) => {
                  const error = socialErrors[key];
                  return (
                    <div key={key}>
                      <label className="text-[11px] font-semibold text-[#64748B]">{label}</label>
                      <input
                        type="url"
                        value={formData.socials[key] || ""}
                        maxLength={MAX_LENGTH.SOCIAL_URL}
                        onChange={(e) => handleSocialChange(key, e.target.value)}
                        placeholder={placeholder}
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs font-medium text-[#1E293B] placeholder:text-slate-400 shadow-2xs transition focus:outline-none ${
                          error
                            ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200"
                            : "border-slate-200 focus:border-[#245FD4]"
                        }`}
                      />
                      {error && (
                        <p className="mt-1 text-[11px] text-rose-500">{error}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 4: Optional Information (only rendered if template supports address or disclaimer) */}
          {optionalCapabilities.hasAnyOptional && (
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
                  {optionalCapabilities.supportsAddress && (
                    <div>
                      <label className="text-[11px] font-semibold text-[#64748B]">Office Address</label>
                      <input
                        type="text"
                        value={formData.optional.address || ""}
                        maxLength={MAX_LENGTH.ADDRESS}
                        onChange={(e) => handleOptionalChange("address", e.target.value)}
                        placeholder="e.g. 123 Business Ave, New York, NY 10001"
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs focus:border-[#245FD4] focus:outline-none"
                      />
                    </div>
                  )}
                  {optionalCapabilities.supportsDisclaimer && (
                    <div>
                      <label className="text-[11px] font-semibold text-[#64748B]">
                        Servicing Region / Disclaimer Notice
                      </label>
                      <input
                        type="text"
                        value={formData.optional.disclaimer || ""}
                        maxLength={MAX_LENGTH.DISCLAIMER}
                        onChange={(e) => handleOptionalChange("disclaimer", e.target.value)}
                        placeholder="e.g. Proudly servicing Metropolitan & Regional Areas"
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs focus:border-[#245FD4] focus:outline-none"
                      />
                      <p className="mt-1 text-[10px] text-[#94A3B8]">
                        Displayed in the signature footer bar or disclaimer notice.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
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
              <div className="w-full rounded-xl border border-slate-100 bg-white shadow-xs overflow-hidden transition-all p-3 sm:p-5">
                <SignaturePreviewFrame
                  html={generatedHtml}
                  aspectRatio={false}
                  fitPadding={0.96}
                  preferTableBounds={preferTableBounds}
                  minHeight={140}
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
        signatureData={prepareDataForSave()}
        signatureName={formData.fullName || template.name}
      />

      {/* Signature Plan Limit Modal */}
      <LimitOverwriteModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
      />

      {/* Interactive Avatar Crop Modal */}
      <ImageCropModal
        isOpen={Boolean(avatarCropSrc)}
        imageSrc={avatarCropSrc}
        fileName={avatarCropFileName}
        onClose={handleCloseAvatarCrop}
        onApply={handleApplyAvatarCrop}
      />

      {/* Guest Authentication Prompt Modal */}
      <TemplateAuthPromptModal
        isOpen={isAuthPromptOpen}
        onClose={() => setIsAuthPromptOpen(false)}
        templateId={template.id}
      />
    </div>
  );
}
