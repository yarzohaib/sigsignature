"use client";

import { useRef, ChangeEvent, useState } from "react";
import Image from "next/image";
import ImageCropModal from "@/components/common/ImageCropModal";
import { isAllowedJpgOrPng } from "@/lib/imageUtils";

interface ProfileCardProps {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  avatarUrl: string | null;
  errors: {
    firstName?: string;
    lastName?: string;
    companyName?: string;
  };
  isUploadingAvatar: boolean;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onCompanyNameChange: (value: string) => void;
  onAvatarUpload: (file: File) => void;
  onAvatarRemove?: () => void;
}

export default function ProfileCard({
  firstName,
  lastName,
  email,
  companyName,
  avatarUrl,
  errors,
  isUploadingAvatar,
  onFirstNameChange,
  onLastNameChange,
  onCompanyNameChange,
  onAvatarUpload,
  onAvatarRemove,
}: ProfileCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropFileName, setCropFileName] = useState<string>("avatar.png");
  const hasValidAvatar = Boolean(avatarUrl && failedUrl !== avatarUrl);

  const userInitials = [firstName, lastName]
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("") || "U";

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isAllowedJpgOrPng(file)) {
      alert("Please select a JPG or PNG image file.");
      if (e.target) e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10 MB.");
      if (e.target) e.target.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setCropImageSrc(objectUrl);
    setCropFileName(file.name);

    // Reset file input value so re-selecting same file triggers change
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleCloseCrop = () => {
    if (cropImageSrc) {
      URL.revokeObjectURL(cropImageSrc);
    }
    setCropImageSrc(null);
  };

  const handleApplyCrop = (croppedFile: File) => {
    onAvatarUpload(croppedFile);
    handleCloseCrop();
  };

  return (
    <div className="rounded-2xl border border-[#E1E6EF] bg-white p-6 shadow-xs">
      {/* Header */}
      <div className="flex items-start gap-3 pb-5 border-b border-[#F1F5F9]">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#245FD4]">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div>
          <h2
            className="text-[18px] font-semibold text-[#172238] leading-tight"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Your profile
          </h2>
          <p
            className="mt-0.5 text-[13px] text-[#6B7280]"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            Manage your personal details and account identity.
          </p>
        </div>
      </div>

      {/* Avatar Section */}
      <div className="py-5 flex items-center gap-4">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-2xs text-base font-bold text-slate-700">
          {hasValidAvatar ? (
            <Image
              src={avatarUrl!}
              alt={firstName ? `${firstName} avatar` : "Profile avatar"}
              width={56}
              height={56}
              unoptimized
              onError={() => avatarUrl && setFailedUrl(avatarUrl)}
              className="h-full w-full object-cover"
            />
          ) : (
            <span aria-hidden="true">{userInitials}</span>
          )}
          {isUploadingAvatar && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-2xs">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg, .png"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="text-left text-sm font-semibold text-[#245FD4] transition hover:underline disabled:opacity-50"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              {isUploadingAvatar
                ? "Uploading photo..."
                : avatarUrl
                ? "Change photo"
                : "Upload photo"}
            </button>
            {avatarUrl && onAvatarRemove && (
              <>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={onAvatarRemove}
                  disabled={isUploadingAvatar}
                  className="text-left text-sm font-semibold text-rose-600 transition hover:underline disabled:opacity-50"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  Remove
                </button>
              </>
            )}
          </div>
          <span
            className="mt-0.5 text-[12px] text-[#94A3B8]"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            JPG or PNG · Max. 2 MB
          </span>
        </div>
      </div>

      {/* Profile Form Fields (Row 1: First / Last Name; Row 2: Email / Company Name) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* First name */}
        <div>
          <label
            htmlFor="profile-first-name"
            className="block text-[13px] font-semibold text-[#1E293B] mb-1.5"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            First name <span className="text-red-500">*</span>
          </label>
          <input
            id="profile-first-name"
            type="text"
            value={firstName}
            maxLength={50}
            minLength={2}
            onChange={(e) => onFirstNameChange(e.target.value)}
            placeholder="John"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#1E293B] placeholder-slate-400 transition focus:outline-none focus:ring-2 ${
              errors.firstName
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-[#E2E8F0] focus:border-[#245FD4] focus:ring-blue-100"
            }`}
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
          )}
        </div>

        {/* Last name */}
        <div>
          <label
            htmlFor="profile-last-name"
            className="block text-[13px] font-semibold text-[#1E293B] mb-1.5"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            Last name
          </label>
          <input
            id="profile-last-name"
            type="text"
            value={lastName}
            maxLength={50}
            onChange={(e) => onLastNameChange(e.target.value)}
            placeholder="Doe"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#1E293B] placeholder-slate-400 transition focus:outline-none focus:ring-2 ${
              errors.lastName
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-[#E2E8F0] focus:border-[#245FD4] focus:ring-blue-100"
            }`}
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          />
          {errors.lastName && (
            <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
          )}
        </div>

        {/* Email address (disabled with notice) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="profile-email"
              className="block text-[13px] font-semibold text-[#1E293B]"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Email address
            </label>
            <span
              className="text-[11px] font-medium text-slate-400"
              title="Primary account login email is locked for account security"
            >
              Locked (Primary Login)
            </span>
          </div>
          <input
            id="profile-email"
            type="email"
            value={email}
            disabled
            className="w-full rounded-xl border border-[#E2E8F0] bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed select-none"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          />
          <p
            className="mt-1.5 text-[11px] text-[#64748B] flex items-center gap-1.5"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <svg className="h-3 w-3 text-slate-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Primary email address is locked for account security. Contact support to update your login email.
          </p>
        </div>

        {/* Company name */}
        <div>
          <label
            htmlFor="profile-company-name"
            className="block text-[13px] font-semibold text-[#1E293B] mb-1.5"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            Company name
          </label>
          <input
            id="profile-company-name"
            type="text"
            value={companyName}
            maxLength={100}
            onChange={(e) => onCompanyNameChange(e.target.value)}
            placeholder="Acme Corp"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#1E293B] placeholder-slate-400 transition focus:outline-none focus:ring-2 ${
              errors.companyName
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-[#E2E8F0] focus:border-[#245FD4] focus:ring-blue-100"
            }`}
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          />
          {errors.companyName && (
            <p className="mt-1 text-xs text-red-600">{errors.companyName}</p>
          )}
        </div>
      </div>

      {/* Interactive Profile Photo Cropper Modal */}
      <ImageCropModal
        isOpen={Boolean(cropImageSrc)}
        imageSrc={cropImageSrc}
        fileName={cropFileName}
        onClose={handleCloseCrop}
        onApply={handleApplyCrop}
      />
    </div>
  );
}
