"use client";

import { useRef, ChangeEvent } from "react";
import Image from "next/image";

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
}: ProfileCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAvatarUpload(file);
    }
    // Reset file input value so re-selecting same file triggers change
    if (e.target) {
      e.target.value = "";
    }
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
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-2xs">
          <Image
            src={avatarUrl || "/placeholder-avatar.svg"}
            alt={firstName ? `${firstName} avatar` : "Profile avatar"}
            width={56}
            height={56}
            className="h-full w-full object-cover"
          />
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
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingAvatar}
            className="text-left text-sm font-semibold text-[#245FD4] transition hover:underline disabled:opacity-50"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            {isUploadingAvatar ? "Uploading photo..." : "Upload photo"}
          </button>
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
            maxLength={60}
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
            maxLength={60}
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
          <label
            htmlFor="profile-email"
            className="block text-[13px] font-semibold text-[#1E293B] mb-1.5"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            Email address
          </label>
          <input
            id="profile-email"
            type="email"
            value={email}
            disabled
            className="w-full rounded-xl border border-[#E2E8F0] bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed select-none"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          />
          {/* <p
            className="mt-1 text-[11px] text-[#94A3B8]"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            Email changes are not available yet.
          </p> */}
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
    </div>
  );
}
