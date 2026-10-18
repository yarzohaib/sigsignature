"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Team, TeamMember } from "@/types/team";
import { addTeamMember, updateTeamMember, ApiError } from "@/app/lib/api";
import { compressImageToBlob } from "@/lib/imageUtils";
import { uploadSignatureImage } from "@/lib/uploads";
import { renderTeamMemberHtml } from "@/lib/team/render";
import SignaturePreviewFrame from "@/components/studio/SignaturePreviewFrame";

import {
  TEAM_SOCIAL_PLATFORMS,
  TeamMemberSocial,
  TeamMemberSocialPlatform,
  SOCIAL_PLATFORM_LABELS,
  teamHasSocialElement,
} from "@/lib/team/socials";

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
  member: TeamMember | null; // null when adding new member
  onSuccess: () => void;
  showToast: (msg: string) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function MemberModal({
  isOpen,
  onClose,
  team,
  member,
  onSuccess,
  showToast,
}: MemberModalProps) {
  const isEditing = Boolean(member);

  const [name, setName] = useState(member?.name || "");
  const [email, setEmail] = useState(member?.email || "");
  const [jobTitle, setJobTitle] = useState(member?.jobTitle || "");
  const [phone, setPhone] = useState(member?.phone || "");
  const [photoUrl, setPhotoUrl] = useState(member?.photoUrl || "");

  // Per-member social links state (Do NOT prefill with owner links)
  const [socials, setSocials] = useState<TeamMemberSocial[]>(() => {
    if (member?.socials && Array.isArray(member.socials)) {
      return member.socials.map((s) => ({ ...s }));
    }
    return [];
  });
  const [socialErrors, setSocialErrors] = useState<Record<number, string>>({});

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isLimitError, setIsLimitError] = useState(false);

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const hasSocialTemplate = useMemo(() => teamHasSocialElement(team), [team]);

  // Handle ESC key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isSubmitting && !isUploadingPhoto) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, isUploadingPhoto, onClose]);

  // Live preview mockup
  const previewHtml = useMemo(() => {
    const mockMember: TeamMember = {
      id: member?.id || "temp-preview",
      teamId: team.id,
      name: name.trim() || "Full Name",
      email: email.trim() || "email@company.com",
      jobTitle: jobTitle.trim(),
      phone: phone.trim(),
      photoUrl: photoUrl.trim(),
      socials: socials.filter((s) => s.url.trim().length > 0),
      status: member?.status || "draft",
      sentAt: member?.sentAt || null,
      acceptedAt: member?.acceptedAt || null,
      tokenExpiresAt: member?.tokenExpiresAt || null,
      sendCount: member?.sendCount || 0,
      createdAt: member?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      return renderTeamMemberHtml(team, mockMember, { preview: true });
    } catch (e) {
      console.error("Preview render failed:", e);
      return `<div style="padding:16px;color:#94a3b8;font-size:12px;">Preview generating...</div>`;
    }
  }, [team, member, name, email, jobTitle, phone, photoUrl, socials]);

  if (!isOpen) return null;

  async function handlePhotoFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setPhotoError("Please select a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setPhotoError("Photo must be less than 2MB.");
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const compressedBlob = await compressImageToBlob(file, 400, 0.85, "avatar");
      const uploadedUrl = await uploadSignatureImage(compressedBlob, "avatar");
      setPhotoUrl(uploadedUrl);
    } catch (err: unknown) {
      console.error("Failed to upload photo:", err);
      const msg = err instanceof Error ? err.message : "Failed to upload photo.";
      setPhotoError(msg);
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleRemovePhoto() {
    setPhotoUrl("");
    setPhotoError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleAddSocialLink() {
    if (socials.length >= 6) return;
    const used = new Set(socials.map((s) => s.platform));
    const available = TEAM_SOCIAL_PLATFORMS.find((p) => !used.has(p));
    if (!available) return;
    setSocials((prev) => [...prev, { platform: available, url: "" }]);
  }

  function handlePlatformChange(index: number, newPlatform: TeamMemberSocialPlatform) {
    setSocials((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], platform: newPlatform };
      return copy;
    });
  }

  function handleUrlChange(index: number, newUrl: string) {
    setSocials((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], url: newUrl };
      return copy;
    });

    // Inline validation: must start with https://
    const trimmed = newUrl.trim();
    if (trimmed && !trimmed.startsWith("https://")) {
      setSocialErrors((prev) => ({
        ...prev,
        [index]: "URL must start with https://",
      }));
    } else {
      setSocialErrors((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }
  }

  function handleRemoveSocialLink(index: number) {
    setSocials((prev) => prev.filter((_, i) => i !== index));
    setSocialErrors((prev) => {
      const next: Record<number, string> = {};
      Object.entries(prev).forEach(([k, v]) => {
        const num = Number(k);
        if (num < index) next[num] = v;
        else if (num > index) next[num - 1] = v;
      });
      return next;
    });
  }

  function validateForm(): boolean {
    let isValid = true;
    setNameError(null);
    setEmailError(null);
    setGlobalError(null);
    setIsLimitError(false);

    if (!name.trim()) {
      setNameError("Full name is required.");
      isValid = false;
    } else if (name.trim().length > 100) {
      setNameError("Name cannot exceed 100 characters.");
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError("Email address is required.");
      isValid = false;
    } else if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else if (email.trim().length > 254) {
      setEmailError("Email cannot exceed 254 characters.");
      isValid = false;
    }

    // Validate social links: must start with https://
    let hasSocialErr = false;
    const newSocialErrors: Record<number, string> = {};
    socials.forEach((item, idx) => {
      const trimmed = item.url.trim();
      if (!trimmed) {
        newSocialErrors[idx] = "URL cannot be empty";
        hasSocialErr = true;
      } else if (!trimmed.startsWith("https://")) {
        newSocialErrors[idx] = "URL must start with https://";
        hasSocialErr = true;
      }
    });
    setSocialErrors(newSocialErrors);
    if (hasSocialErr) {
      isValid = false;
    }

    return isValid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setGlobalError(null);
    setIsLimitError(false);

    // Clean socials payload
    const cleanSocials = socials.map((s) => ({
      platform: s.platform,
      url: s.url.trim(),
    }));

    try {
      if (isEditing && member) {
        await updateTeamMember(member.id, {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          jobTitle: jobTitle.trim(),
          phone: phone.trim(),
          photoUrl: photoUrl.trim(),
          socials: cleanSocials,
        });
        showToast(`Updated "${name.trim()}".`);
      } else {
        await addTeamMember({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          jobTitle: jobTitle.trim(),
          phone: phone.trim(),
          photoUrl: photoUrl.trim(),
          socials: cleanSocials,
        });
        showToast(`Added "${name.trim()}" to team signatures.`);
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("Failed to save team member:", err);
      if (err instanceof ApiError) {
        if (err.code === "TEAM_MEMBER_LIMIT_REACHED") {
          setIsLimitError(true);
          setGlobalError(
            err.message ||
              `You have reached the maximum limit of ${team.memberLimit} team members allowed on your plan.`
          );
        } else if (err.code === "TEAM_MEMBER_EXISTS") {
          setEmailError("This email is already on your team.");
        } else {
          setGlobalError(err.message || "Failed to save team member.");
        }
      } else if (err instanceof Error) {
        setGlobalError(err.message);
      } else {
        setGlobalError("Failed to save team member. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl transition max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <h3
            id="member-modal-title"
            className="text-lg font-bold text-[#0B1A3D]"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            {isEditing ? "Edit Team Member" : "Add Team Member"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting || isUploadingPhoto}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Global Error Banner */}
        {globalError && (
          <div className="mx-6 mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-center justify-between">
            <span>{globalError}</span>
            {isLimitError && (
              <Link
                href="/pricing"
                className="ml-3 font-semibold text-[#245FD4] underline hover:text-[#1D4ED8] whitespace-nowrap"
              >
                Upgrade Plan &rarr;
              </Link>
            )}
          </div>
        )}

        {/* Main Body: split screen on desktop */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Form */}
          <form
            id="member-form"
            onSubmit={handleSubmit}
            className="lg:col-span-7 space-y-4"
          >
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#0B1A3D] mb-1">
                Full name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError(null);
                }}
                placeholder="e.g. Sara Ahmed"
                maxLength={100}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#0B1A3D] placeholder-[#94A3B8] transition focus:outline-none focus:ring-2 ${
                  nameError
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-200"
                    : "border-[#E2E8F0] focus:border-[#245FD4] focus:ring-[#245FD4]/20"
                }`}
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              />
              {nameError && (
                <p className="mt-1 text-xs text-rose-500">{nameError}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#0B1A3D] mb-1">
                Email address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                placeholder="e.g. sara@company.com"
                maxLength={254}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#0B1A3D] placeholder-[#94A3B8] transition focus:outline-none focus:ring-2 ${
                  emailError
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-200"
                    : "border-[#E2E8F0] focus:border-[#245FD4] focus:ring-[#245FD4]/20"
                }`}
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              />
              {emailError && (
                <p className="mt-1 text-xs text-rose-500">{emailError}</p>
              )}
            </div>

            {/* Job Title & Phone in grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0B1A3D] mb-1">
                  Job title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Head of Operations"
                  maxLength={100}
                  className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm text-[#0B1A3D] placeholder-[#94A3B8] transition focus:border-[#245FD4] focus:outline-none focus:ring-2 focus:ring-[#245FD4]/20"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1A3D] mb-1">
                  Phone number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 555 234 8890"
                  maxLength={40}
                  className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm text-[#0B1A3D] placeholder-[#94A3B8] transition focus:border-[#245FD4] focus:outline-none focus:ring-2 focus:ring-[#245FD4]/20"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                />
              </div>
            </div>

            {/* Social links (optional) */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#0B1A3D]">
                  Social links <span className="font-normal text-[#64748B]">(optional)</span>
                </label>
                {socials.length < 6 && (
                  <button
                    type="button"
                    onClick={handleAddSocialLink}
                    className="text-xs font-semibold text-[#245FD4] hover:text-[#1D4ED8] transition cursor-pointer"
                  >
                    + Add link
                  </button>
                )}
              </div>

              {hasSocialTemplate && (
                <p className="text-[11px] text-[#64748B] mb-2.5">
                  Leave empty to hide the social icons on this signature.
                </p>
              )}

              {socials.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-slate-50/50 p-3 text-center">
                  <p className="text-xs text-[#94A3B8]">
                    No social links added. Click &ldquo;+ Add link&rdquo; to add per-member profiles.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {socials.map((item, index) => {
                    const error = socialErrors[index];
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center gap-2">
                          {/* Platform select */}
                          <select
                            value={item.platform}
                            onChange={(e) =>
                              handlePlatformChange(
                                index,
                                e.target.value as TeamMemberSocialPlatform
                              )
                            }
                            className="w-[130px] sm:w-[145px] shrink-0 rounded-xl border border-[#E2E8F0] bg-white px-2.5 py-2 text-xs font-medium text-[#0B1A3D] transition focus:border-[#245FD4] focus:outline-none focus:ring-2 focus:ring-[#245FD4]/20 cursor-pointer"
                          >
                            {TEAM_SOCIAL_PLATFORMS.map((plat) => {
                              const isSelectedElsewhere = socials.some(
                                (s, i) => i !== index && s.platform === plat
                              );
                              return (
                                <option
                                  key={plat}
                                  value={plat}
                                  disabled={isSelectedElsewhere}
                                >
                                  {SOCIAL_PLATFORM_LABELS[plat]}
                                  {isSelectedElsewhere ? " (Used)" : ""}
                                </option>
                              );
                            })}
                          </select>

                          {/* URL input */}
                          <input
                            type="url"
                            value={item.url}
                            onChange={(e) => handleUrlChange(index, e.target.value)}
                            placeholder="https://"
                            maxLength={300}
                            className={`flex-1 min-w-0 rounded-xl border px-3 py-2 text-xs text-[#0B1A3D] placeholder-[#94A3B8] transition focus:outline-none focus:ring-2 ${
                              error
                                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200"
                                : "border-[#E2E8F0] focus:border-[#245FD4] focus:ring-[#245FD4]/20"
                            }`}
                          />

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveSocialLink(index)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer shrink-0"
                            title="Remove link"
                            aria-label="Remove social link"
                          >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        {error && (
                          <p className="text-[11px] text-rose-500 pl-1">{error}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Photo Upload */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-[#0B1A3D] mb-1.5">
                Member photo
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoFileChange}
                className="hidden"
              />

              <div className="flex items-center gap-4">
                {photoUrl ? (
                  <div className="relative h-14 w-14 shrink-0 rounded-full overflow-hidden border border-[#CBD5E1] bg-slate-100">
                    <Image
                      src={photoUrl}
                      alt={name || "Photo"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-dashed border-[#CBD5E1] bg-slate-50 text-[#94A3B8]">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                      className="rounded-lg border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E293B] hover:bg-slate-50 transition cursor-pointer"
                    >
                      {isUploadingPhoto
                        ? "Uploading..."
                        : photoUrl
                        ? "Change photo"
                        : "Upload photo"}
                    </button>

                    {photoUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <span className="text-[11px] text-[#94A3B8]">
                    JPEG, PNG or WebP up to 2MB
                  </span>
                </div>
              </div>
              {photoError && (
                <p className="mt-1.5 text-xs text-rose-500">{photoError}</p>
              )}
            </div>
          </form>

          {/* Right: Live Preview Panel */}
          <div className="lg:col-span-5 flex flex-col">
            <label className="block text-xs font-semibold text-[#0B1A3D] mb-1.5">
              Live Preview
            </label>
            <div className="flex-1 rounded-2xl border border-[#E2E8F0] bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] p-4 flex flex-col justify-center items-center overflow-hidden min-h-[220px]">
              <div className="w-full max-w-[480px] bg-white rounded-xl shadow-xs border border-[#EBF0F7] p-2 overflow-hidden">
                <SignaturePreviewFrame html={previewHtml} />
              </div>
              <p className="mt-3 text-[11px] text-[#94A3B8] text-center">
                Updates automatically as you type
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F1F5F9] bg-[#FAFAFA]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting || isUploadingPhoto}
            className="rounded-xl border border-[#CBD5E1] bg-white px-4 py-2 text-xs sm:text-sm font-medium text-[#475569] hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="member-form"
            disabled={isSubmitting || isUploadingPhoto}
            className="flex items-center gap-2 rounded-xl bg-[#245FD4] hover:bg-[#1D4ED8] px-5 py-2 text-xs sm:text-sm font-semibold text-white transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{isEditing ? "Save changes" : "Add member"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
