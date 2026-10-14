"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TemplateItem, TemplateSignatureData } from "@/types/template";
import { generateSignatureHtml } from "@/lib/generateSignatureHtml";
import { SignatureItem } from "@/components/signatures/SignatureCard";
import { saveStoredSignature } from "@/lib/signatureStorage";
import { compressImageFile } from "@/lib/imageUtils";

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
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form data state
  const [formData, setFormData] = useState<TemplateSignatureData>(
    initialData || template.defaultData
  );

  // Collapsible accordion states
  const [openSections, setOpenSections] = useState({
    personal: true,
    branding: false,
    social: false,
    optional: false,
  });

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);

  function showToast(title: string, subtitle: string) {
    setToastMessage({ title, subtitle });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
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
  function handleSocialChange(platform: "linkedin" | "twitter" | "facebook" | "instagram", value: string) {
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

  // User Photo Upload Handler with automatic compression to prevent QuotaExceededError
  async function handlePhotoUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Invalid file", "Please upload an image file (PNG, JPG, etc).");
      return;
    }

    try {
      const compressedDataUrl = await compressImageFile(file, 256, 0.82);
      setFormData((prev) => ({
        ...prev,
        avatarUrl: compressedDataUrl,
      }));
      showToast("Photo uploaded!", "Your custom photo was optimized and applied.");
    } catch (err) {
      console.error("Image processing error:", err);
      showToast("Upload failed", "Could not process image file. Please try another image.");
    }
  }

  // Reset photo to default template photo
  function handleResetPhoto() {
    setFormData((prev) => ({
      ...prev,
      avatarUrl: template.defaultData.avatarUrl,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // Copy HTML to clipboard
  async function handleCopyHtml() {
    const html = generateSignatureHtml(formData);
    try {
      await navigator.clipboard.writeText(html);
      showToast("HTML copied!", "Paste it into your email client settings.");
    } catch {
      showToast("Copy error", "Could not copy automatically. Please try again.");
    }
  }

  // Download HTML file
  function handleDownloadHtml() {
    const html = generateSignatureHtml(formData);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.fullName.replace(/\s+/g, "_")}_signature.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Downloaded!", "Your HTML signature file was saved to your downloads.");
  }

  // Save the signature to user's signatures list
  async function handleSaveSignature() {
    const signatureId = editingSignatureId || `sig-${Date.now()}`;
    const newSignature: SignatureItem = {
      id: signatureId,
      name: formData.fullName || "My Signature",
      role: formData.jobTitle || "",
      email: formData.email || "",
      phone: formData.phone || "",
      company: formData.companyName || "",
      tagline: formData.optional?.tagline || "",
      updatedAt: "Updated just now",
      templateType: "custom",
      avatarUrl: formData.avatarUrl,
      address: formData.optional?.address,
      website: formData.website,
      themeColor: formData.themeColor,
      fontFamily: formData.fontFamily,
      templateId: template.id,
      rawTemplateData: formData,
    };

    await saveStoredSignature(newSignature);
    showToast("Saved!", "Signature saved to My Signatures.");
    setTimeout(() => {
      router.push("/signatures");
    }, 600);
  }

  const colorSwatches = ["#0F172A", "#245FD4", "#022977", "#8B5CF6", "#059669"];

  const fontFamilies: Record<string, string> = {
    Inter: "var(--font-inter), Inter, sans-serif",
    Montserrat: "var(--font-montserrat), Montserrat, sans-serif",
    Commissioner: "var(--font-commissioner), Commissioner, sans-serif",
    Roboto: "Roboto, sans-serif",
    Arial: "Arial, Helvetica, sans-serif",
  };

  function renderSocialIcon(platform: "linkedin" | "twitter" | "facebook") {
    const isCircle = formData.socialIconsStyle === "circle";
    const isOutline = formData.socialIconsStyle === "outline";
    const label = platform === "linkedin" ? "in" : platform === "twitter" ? "𝕏" : "f";

    const baseClasses = `flex h-4 w-4 items-center justify-center text-[8px] font-bold transition-all shadow-2xs ${
      isCircle ? "rounded-full" : "rounded-xs"
    }`;

    if (isOutline) {
      return (
        <span
          className={baseClasses}
          style={{
            borderWidth: "1.5px",
            borderStyle: "solid",
            borderColor: formData.themeColor,
            color: formData.themeColor,
            backgroundColor: "transparent",
          }}
        >
          {label}
        </span>
      );
    }

    return (
      <span
        className={baseClasses}
        style={{
          backgroundColor: formData.themeColor,
          color: "#ffffff",
        }}
      >
        {label}
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-6 pb-12">
      {/* Top Header Row matching Figma: Back Button & Template Name */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-start bg-transparent p-0 transition hover:opacity-80 active:scale-98"
            style={{
              width: "156px",
              height: "36px",
              gap: "12px",
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
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "36px",
                letterSpacing: "0%",
                verticalAlign: "middle",
                color: "#94A3B8",
              }}
            >
              Editing:
            </span>
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
            value={formData.fontFamily}
            onChange={(e) => handleInputChange("fontFamily", e.target.value)}
            className="rounded-lg border border-slate-200 bg-[#F8FAFC] px-2.5 py-1 text-xs font-semibold text-[#1E293B] focus:border-[#245FD4] focus:outline-none"
          >
            <option value="Inter">Inter</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Commissioner">Commissioner</option>
            <option value="Roboto">Roboto</option>
            <option value="Arial">Arial</option>
          </select>
        </div>

        {/* Colors Swatches */}
        <div className="flex items-center gap-2 border-r border-slate-200/80 pr-3.5">
          <span className="text-[12px] font-medium text-[#64748B]">Colors</span>
          <div className="flex items-center gap-1.5">
            {colorSwatches.map((color) => (
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

        {/* Layout Selector */}
        <div className="flex items-center gap-2 border-r border-slate-200/80 pr-3.5">
          <span className="text-[12px] font-medium text-[#64748B]">Layout</span>
          <select
            value={formData.layout}
            onChange={(e) => handleInputChange("layout", e.target.value)}
            className="rounded-lg border border-slate-200 bg-[#F8FAFC] px-2.5 py-1 text-xs font-semibold text-[#1E293B] focus:border-[#245FD4] focus:outline-none"
          >
            <option value="two-column">Two Column</option>
            <option value="horizontal">Horizontal</option>
            <option value="compact">Compact</option>
          </select>
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
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#1E293B]">Profile Photo</p>
                      <p className="text-[11px] text-[#64748B] mt-0.5">Upload a square photo (PNG, JPG, max 2MB).</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="rounded-lg bg-[#245FD4] px-3 py-1 text-[11px] font-medium text-white shadow-2xs transition hover:bg-[#1D4ED8]"
                        >
                          Upload Custom Photo
                        </button>
                        {formData.avatarUrl !== template.defaultData.avatarUrl && (
                          <button
                            type="button"
                            onClick={handleResetPhoto}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
                          >
                            Reset
                          </button>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
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
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
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
              <div
                className="w-full rounded-xl border border-slate-100 bg-white p-5 shadow-xs transition-all"
                style={{
                  fontFamily: fontFamilies[formData.fontFamily] || formData.fontFamily,
                }}
              >
                {/* Layout 1: Two Column */}
                {formData.layout === "two-column" && (
                  <div className="flex items-center justify-between gap-5">
                    {/* Avatar + Socials */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div
                        className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-100 shadow-2xs border-2"
                        style={{ borderColor: formData.themeColor }}
                      >
                        <Image
                          src={formData.avatarUrl || "/placeholder-avatar.svg"}
                          alt={formData.fullName}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                          unoptimized={formData.avatarUrl?.startsWith("data:")}
                        />
                      </div>
                      {/* Social links row */}
                      <div className="flex items-center gap-1.5">
                        {formData.socials.linkedin && renderSocialIcon("linkedin")}
                        {formData.socials.twitter && renderSocialIcon("twitter")}
                        {formData.socials.facebook && renderSocialIcon("facebook")}
                      </div>
                    </div>

                    {/* Personal details column */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-[15px] font-bold text-[#1E293B] leading-tight truncate">
                        {formData.fullName || "Your Full Name"}
                      </h4>
                      <p className="text-[12px] font-medium text-[#64748B] leading-tight">
                        {formData.jobTitle || "Your Job Title"}
                      </p>
                      <div className="pt-1.5 space-y-1 text-[11px] text-[#64748B]">
                        {formData.phone && (
                          <div className="flex items-center gap-1.5 truncate">
                            <span style={{ color: formData.themeColor }} className="font-bold">&#9742;</span>
                            <span>{formData.phone}</span>
                          </div>
                        )}
                        {formData.email && (
                          <div className="flex items-center gap-1.5 truncate">
                            <span style={{ color: formData.themeColor }} className="font-bold">&#9993;</span>
                            <span className="truncate">{formData.email}</span>
                          </div>
                        )}
                        {formData.website && (
                          <div className="flex items-center gap-1.5 truncate">
                            <span style={{ color: formData.themeColor }} className="font-bold">&#9873;</span>
                            <span className="truncate">{formData.website}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="h-16 w-px bg-slate-200" />

                    {/* Company Logo and Tagline */}
                    <div className="flex flex-col items-center justify-center text-center shrink-0 w-[95px]">
                      <svg width="34" height="34" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8H26C28.2091 8 30 9.79086 30 12V20C30 22.2091 28.2091 24 26 24H22" stroke={formData.themeColor} strokeWidth="4" strokeLinecap="round" />
                        <path d="M26 30H12C9.79086 30 8 28.2091 8 26V18C8 15.7909 9.79086 14 12 14H16" stroke={formData.themeColor} strokeWidth="4" strokeLinecap="round" />
                      </svg>
                      <span className="mt-1.5 text-[11px] font-bold text-[#1E293B] leading-tight">
                        {formData.companyName || "Company Name"}
                      </span>
                      {formData.optional?.tagline && (
                        <span className="text-[9px] text-[#94A3B8] leading-tight mt-0.5">
                          {formData.optional.tagline}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Layout 2: Horizontal */}
                {formData.layout === "horizontal" && (
                  <div className="flex flex-col gap-3.5">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div
                        className="relative h-14 w-14 overflow-hidden rounded-full bg-slate-100 shadow-2xs border-2 shrink-0"
                        style={{ borderColor: formData.themeColor }}
                      >
                        <Image
                          src={formData.avatarUrl || "/placeholder-avatar.svg"}
                          alt={formData.fullName}
                          width={56}
                          height={56}
                          className="h-full w-full object-cover"
                          unoptimized={formData.avatarUrl?.startsWith("data:")}
                        />
                      </div>
                      {/* Details & Branding */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-[15px] font-bold text-[#1E293B] leading-tight truncate">
                              {formData.fullName || "Your Full Name"}
                            </h4>
                            <p className="text-[11.5px] font-medium text-[#64748B] leading-tight">
                              {formData.jobTitle || "Your Job Title"} &bull; <span className="font-semibold text-[#1E293B]">{formData.companyName || "Company"}</span>
                            </p>
                          </div>
                          {/* Social links row */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {formData.socials.linkedin && renderSocialIcon("linkedin")}
                            {formData.socials.twitter && renderSocialIcon("twitter")}
                            {formData.socials.facebook && renderSocialIcon("facebook")}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom row: contact items & tagline */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 text-[10.5px] text-[#64748B]">
                      <div className="flex flex-wrap items-center gap-3">
                        {formData.phone && (
                          <div className="flex items-center gap-1">
                            <span style={{ color: formData.themeColor }} className="font-bold">&#9742;</span>
                            <span>{formData.phone}</span>
                          </div>
                        )}
                        {formData.email && (
                          <div className="flex items-center gap-1">
                            <span style={{ color: formData.themeColor }} className="font-bold">&#9993;</span>
                            <span>{formData.email}</span>
                          </div>
                        )}
                        {formData.website && (
                          <div className="flex items-center gap-1">
                            <span style={{ color: formData.themeColor }} className="font-bold">&#9873;</span>
                            <span>{formData.website}</span>
                          </div>
                        )}
                      </div>
                      {formData.optional?.tagline && (
                        <span className="text-[9.5px] text-[#94A3B8] italic">{formData.optional.tagline}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Layout 3: Compact */}
                {formData.layout === "compact" && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="relative h-11 w-11 overflow-hidden rounded-lg bg-slate-100 shadow-2xs border shrink-0"
                          style={{ borderColor: formData.themeColor }}
                        >
                          <Image
                            src={formData.avatarUrl || "/placeholder-avatar.svg"}
                            alt={formData.fullName}
                            width={44}
                            height={44}
                            className="h-full w-full object-cover"
                            unoptimized={formData.avatarUrl?.startsWith("data:")}
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[14px] font-bold text-[#1E293B] leading-tight truncate">
                            {formData.fullName || "Your Full Name"}
                          </h4>
                          <p className="text-[11px] text-[#64748B] leading-tight truncate">
                            {formData.jobTitle} &bull; {formData.companyName}
                          </p>
                        </div>
                      </div>

                      {/* Social icons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {formData.socials.linkedin && renderSocialIcon("linkedin")}
                        {formData.socials.twitter && renderSocialIcon("twitter")}
                        {formData.socials.facebook && renderSocialIcon("facebook")}
                      </div>
                    </div>

                    {/* Single inline contact row */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-slate-50 px-3 py-1.5 text-[10px] text-[#64748B]">
                      {formData.phone && (
                        <div className="flex items-center gap-1">
                          <span style={{ color: formData.themeColor }} className="font-bold">&#9742;</span>
                          <span>{formData.phone}</span>
                        </div>
                      )}
                      {formData.email && (
                        <div className="flex items-center gap-1">
                          <span style={{ color: formData.themeColor }} className="font-bold">&#9993;</span>
                          <span>{formData.email}</span>
                        </div>
                      )}
                      {formData.website && (
                        <div className="flex items-center gap-1">
                          <span style={{ color: formData.themeColor }} className="font-bold">&#9873;</span>
                          <span>{formData.website}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyHtml}
            className="inline-flex h-[40px] items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-[#1E293B] shadow-2xs transition hover:bg-slate-50 active:scale-95"
          >
            <span>&lt;/&gt; Copy To HTML Code</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadHtml}
            className="inline-flex h-[40px] items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-[#1E293B] shadow-2xs transition hover:bg-slate-50 active:scale-95"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Download</span>
          </button>

          <button
            type="button"
            onClick={handleSaveSignature}
            className="inline-flex h-[40px] items-center justify-center gap-1.5 rounded-lg bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-5 text-xs font-semibold text-white shadow-xs transition hover:opacity-95 active:scale-95"
          >
            <span>Save the Signature</span>
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Success Toast matching Figma */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 rounded-xl border border-emerald-100 bg-white p-4 shadow-xl animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
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
    </div>
  );
}
