"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import ProfileCard from "@/components/settings/ProfileCard";
import SignatureDefaultsCard from "@/components/settings/SignatureDefaultsCard";
import NotificationsCard from "@/components/settings/NotificationsCard";
import PlanUsageCard from "@/components/settings/PlanUsageCard";
import SecurityCard from "@/components/settings/SecurityCard";
import StartingPointCard from "@/components/settings/StartingPointCard";
import DataPrivacyCard from "@/components/settings/DataPrivacyCard";
import {
  fetchAccount,
  updateAccountProfile,
  updateAccountSettings,
  joinWaitlist,
  logoutUser,
  AccountData,
  UpdateProfilePayload,
  UpdateSettingsPayload,
  UserProfile,
} from "@/app/lib/api";
import {
  getStoredUser,
  setStoredUser,
  getStoredSettings,
  setStoredSettings,
  clearAuthSession,
  getStoredRefreshToken,
  getStoredAvatarUrl,
  setStoredAvatarUrl,
} from "@/app/lib/auth";
import { compressImageToBlob } from "@/lib/imageUtils";
import { uploadSignatureImage } from "@/lib/uploads";

interface FormState {
  firstName: string;
  lastName: string;
  companyName: string;
  avatarUrl: string | null;
  defaultTemplateId: string | null;
  defaultExportFormat: "html" | "plain";
  signatureFont: string;
  brandColor: string;
  includePhoto: boolean;
}

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

export default function SettingsPage() {
  const router = useRouter();

  // Navigation shell state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Loading & data states
  const [isLoading, setIsLoading] = useState(true);
  const [accountData, setAccountData] = useState<AccountData | null>(null);

  // Form initial state for dirty checking & reset
  const [initialFormState, setInitialFormState] = useState<FormState>(() => {
    const cachedUser = typeof window !== "undefined" ? getStoredUser() : null;
    const cachedSettings = typeof window !== "undefined" ? getStoredSettings() : null;
    const cachedAvatar = typeof window !== "undefined" ? getStoredAvatarUrl() : null;
    return {
      firstName: cachedUser?.firstName || "",
      lastName: cachedUser?.lastName || "",
      companyName: cachedUser?.companyName || "",
      avatarUrl: cachedUser?.avatarUrl || cachedAvatar || null,
      defaultTemplateId: cachedSettings?.defaultTemplateId || "professional-minimal",
      defaultExportFormat: cachedSettings?.defaultExportFormat || "html",
      signatureFont: cachedSettings?.signatureFont || "Arimo",
      brandColor: cachedSettings?.brandColor || "#245FD4",
      includePhoto: cachedSettings?.includePhoto ?? true,
    };
  });

  // Active editable form state
  const [formState, setFormState] = useState<FormState>(() => {
    const cachedUser = typeof window !== "undefined" ? getStoredUser() : null;
    const cachedSettings = typeof window !== "undefined" ? getStoredSettings() : null;
    const cachedAvatar = typeof window !== "undefined" ? getStoredAvatarUrl() : null;
    return {
      firstName: cachedUser?.firstName || "",
      lastName: cachedUser?.lastName || "",
      companyName: cachedUser?.companyName || "",
      avatarUrl: cachedUser?.avatarUrl || cachedAvatar || null,
      defaultTemplateId: cachedSettings?.defaultTemplateId || "professional-minimal",
      defaultExportFormat: cachedSettings?.defaultExportFormat || "html",
      signatureFont: cachedSettings?.signatureFont || "Arimo",
      brandColor: cachedSettings?.brandColor || "#245FD4",
      includePhoto: cachedSettings?.includePhoto ?? true,
    };
  });

  // Avatar preview url derived directly from active form state
  const avatarPreviewUrl = formState.avatarUrl;
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Notifications toggles state (separate from main save changes button as they save optimistically)
  const [notifyProductUpdates, setNotifyProductUpdates] = useState(() => {
    const cachedSettings = typeof window !== "undefined" ? getStoredSettings() : null;
    return cachedSettings?.notifyProductUpdates ?? true;
  });
  const [notifyTips, setNotifyTips] = useState(() => {
    const cachedSettings = typeof window !== "undefined" ? getStoredSettings() : null;
    return cachedSettings?.notifyTips ?? false;
  });

  // Waitlist state
  const [isJoiningWaitlist, setIsJoiningWaitlist] = useState(false);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);

  // Toast feedback state
  const [toast, setToast] = useState<{
    message: string;
    isError?: boolean;
  } | null>(null);

  const showToast = useCallback((message: string, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  // Initialize and load account details from backend with cached fallbacks
  useEffect(() => {
    let isMounted = true;
    const cachedUser = getStoredUser();

    async function loadAccount() {
      try {
        const data = await fetchAccount();
        if (!isMounted) return;

        setAccountData(data);
        const serverAvatar = data.user.avatarUrl || null;
        const serverForm: FormState = {
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          companyName: data.user.companyName || "",
          avatarUrl: serverAvatar,
          defaultTemplateId: data.settings.defaultTemplateId || "professional-minimal",
          defaultExportFormat: data.settings.defaultExportFormat || "html",
          signatureFont: data.settings.signatureFont || "Arimo",
          brandColor: data.settings.brandColor || "#245FD4",
          includePhoto: data.settings.includePhoto ?? true,
        };

        setFormState(serverForm);
        setInitialFormState(serverForm);
        setNotifyProductUpdates(data.settings.notifyProductUpdates);
        setNotifyTips(data.settings.notifyTips);

        // Synchronize local caches
        setStoredUser(data.user);
        setStoredSettings(data.settings);
        setStoredAvatarUrl(serverAvatar);
      } catch (err: unknown) {
        console.error("Failed to load account:", err);
        // If unauthenticated, redirect to login
        if (typeof window !== "undefined" && !cachedUser) {
          clearAuthSession();
          router.replace("/login?redirect=/settings");
          return;
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAccount();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // Track field validation errors
  const errors = useMemo(() => {
    const errs: {
      firstName?: string;
      lastName?: string;
      companyName?: string;
      brandColor?: string;
    } = {};

    const trimmedFirst = formState.firstName.trim();
    if (!trimmedFirst) {
      errs.firstName = "First name is required.";
    } else if (trimmedFirst.length > 60) {
      errs.firstName = "First name cannot exceed 60 characters.";
    }

    if (formState.lastName && formState.lastName.length > 60) {
      errs.lastName = "Last name cannot exceed 60 characters.";
    }

    if (formState.companyName && formState.companyName.length > 100) {
      errs.companyName = "Company name cannot exceed 100 characters.";
    }

    if (!HEX_COLOR_REGEX.test(formState.brandColor)) {
      errs.brandColor = "Please enter a valid 6-character hex color (e.g. #245FD4).";
    }

    return errs;
  }, [formState]);

  const isValid = Object.keys(errors).length === 0;

  // Track whether any fields have changed compared to initialFormState
  const isDirty = useMemo(() => {
    return (
      formState.firstName.trim() !== initialFormState.firstName.trim() ||
      (formState.lastName || "").trim() !== (initialFormState.lastName || "").trim() ||
      (formState.companyName || "").trim() !== (initialFormState.companyName || "").trim() ||
      (formState.avatarUrl || null) !== (initialFormState.avatarUrl || null) ||
      formState.defaultTemplateId !== initialFormState.defaultTemplateId ||
      formState.defaultExportFormat !== initialFormState.defaultExportFormat ||
      formState.signatureFont !== initialFormState.signatureFont ||
      formState.brandColor.toUpperCase() !== initialFormState.brandColor.toUpperCase() ||
      formState.includePhoto !== initialFormState.includePhoto
    );
  }, [formState, initialFormState]);

  // Warn user on leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  // Handle Cancel: resets form to initial state
  const handleCancel = () => {
    setFormState(initialFormState);
    setStoredAvatarUrl(initialFormState.avatarUrl);
  };

  // Handle Save Changes: sends PATCH account and PATCH settings only for changed fields
  const handleSaveChanges = async () => {
    if (!isDirty || !isValid || isSaving) return;

    setIsSaving(true);
    try {
      const profilePayload: UpdateProfilePayload = {};
      let hasProfileChange = false;

      if (formState.firstName.trim() !== initialFormState.firstName.trim()) {
        profilePayload.firstName = formState.firstName.trim();
        hasProfileChange = true;
      }
      if ((formState.lastName || "").trim() !== (initialFormState.lastName || "").trim()) {
        profilePayload.lastName = formState.lastName.trim() || null;
        hasProfileChange = true;
      }
      if ((formState.companyName || "").trim() !== (initialFormState.companyName || "").trim()) {
        profilePayload.companyName = formState.companyName.trim() || null;
        hasProfileChange = true;
      }
      if ((formState.avatarUrl || null) !== (initialFormState.avatarUrl || null)) {
        profilePayload.avatarUrl = formState.avatarUrl || null;
        hasProfileChange = true;
      }

      const settingsPayload: UpdateSettingsPayload = {};
      let hasSettingsChange = false;

      if (formState.defaultTemplateId !== initialFormState.defaultTemplateId) {
        settingsPayload.defaultTemplateId = formState.defaultTemplateId;
        hasSettingsChange = true;
      }
      if (formState.defaultExportFormat !== initialFormState.defaultExportFormat) {
        settingsPayload.defaultExportFormat = formState.defaultExportFormat;
        hasSettingsChange = true;
      }
      if (formState.signatureFont !== initialFormState.signatureFont) {
        settingsPayload.signatureFont = formState.signatureFont;
        hasSettingsChange = true;
      }
      if (formState.brandColor.toUpperCase() !== initialFormState.brandColor.toUpperCase()) {
        settingsPayload.brandColor = formState.brandColor.toUpperCase();
        hasSettingsChange = true;
      }
      if (formState.includePhoto !== initialFormState.includePhoto) {
        settingsPayload.includePhoto = formState.includePhoto;
        hasSettingsChange = true;
      }

      let updatedUser: UserProfile | null = null;

      // 1. Send profile updates if any changed
      if (hasProfileChange) {
        updatedUser = await updateAccountProfile(profilePayload);
        setStoredUser(updatedUser);
        setStoredAvatarUrl(updatedUser.avatarUrl || null);
      }

      // 2. Send settings updates if any changed
      if (hasSettingsChange) {
        const updatedSettings = await updateAccountSettings(settingsPayload);
        setStoredSettings(updatedSettings);
      }

      // Update local state to reflect fresh saved values
      const newSavedState: FormState = {
        ...formState,
        brandColor: formState.brandColor.toUpperCase(),
      };
      setInitialFormState(newSavedState);
      setFormState(newSavedState);

      if (accountData) {
        setAccountData({
          ...accountData,
          user: updatedUser || accountData.user,
        });
      }

      showToast("Settings saved");
    } catch (err: unknown) {
      console.error("Failed to save settings:", err);
      const msg = err instanceof Error ? err.message : "Failed to save settings.";
      showToast(msg, true);
    } finally {
      setIsSaving(false);
    }
  };

  // Avatar upload handler
  const handleAvatarUpload = async (file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/i)) {
      showToast("Please select a JPG or PNG image file.", true);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast("Image size must be less than 2 MB.", true);
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const compressedBlob = await compressImageToBlob(file, 400, 0.85, "avatar");

      const publicUrl = await uploadSignatureImage(compressedBlob, "avatar");
      setFormState((prev) => ({ ...prev, avatarUrl: publicUrl }));
      setStoredAvatarUrl(publicUrl);
      showToast("Photo uploaded. Click Save Changes to save your profile picture.");
    } catch (err: unknown) {
      console.error("Avatar upload failed:", err);
      const msg = err instanceof Error ? err.message : "Failed to upload avatar.";
      showToast(msg, true);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Avatar remove handler
  const handleAvatarRemove = () => {
    setFormState((prev) => ({ ...prev, avatarUrl: null }));
    setStoredAvatarUrl(null);
    showToast("Photo removed. Click Save Changes to save your changes.");
  };

  // Optimistic Toggle: Product Updates
  const handleToggleProductUpdates = async () => {
    const nextVal = !notifyProductUpdates;
    setNotifyProductUpdates(nextVal);

    try {
      const updated = await updateAccountSettings({ notifyProductUpdates: nextVal });
      setStoredSettings(updated);
    } catch (err: unknown) {
      // Rollback on error
      setNotifyProductUpdates(!nextVal);
      const msg = err instanceof Error ? err.message : "Failed to update notification setting.";
      showToast(msg, true);
    }
  };

  // Optimistic Toggle: Tips & Inspiration
  const handleToggleTips = async () => {
    const nextVal = !notifyTips;
    setNotifyTips(nextVal);

    try {
      const updated = await updateAccountSettings({ notifyTips: nextVal });
      setStoredSettings(updated);
    } catch (err: unknown) {
      // Rollback on error
      setNotifyTips(!nextVal);
      const msg = err instanceof Error ? err.message : "Failed to update notification setting.";
      showToast(msg, true);
    }
  };

  // Join Premium Waitlist
  const handleJoinWaitlist = async () => {
    setIsJoiningWaitlist(true);
    try {
      const updated = await joinWaitlist();
      setStoredSettings(updated);
      if (accountData) {
        setAccountData({
          ...accountData,
          settings: updated,
        });
      }
      showToast("You've been added to the premium waitlist!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to join waitlist.";
      showToast(msg, true);
    } finally {
      setIsJoiningWaitlist(false);
    }
  };

  // Logout handler for DashboardTopBar
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const refreshToken = getStoredRefreshToken();
      await logoutUser(refreshToken || undefined);
    } finally {
      clearAuthSession();
      router.replace("/login");
    }
  };

  // Display user name in TopBar
  const displayName = accountData?.user?.firstName
    ? `${accountData.user.firstName} ${accountData.user.lastName || ""}`.trim()
    : formState.firstName
    ? `${formState.firstName} ${formState.lastName || ""}`.trim()
    : "Member";

  const displayEmail = accountData?.user?.email || "";
  const isWaitlisted = Boolean(accountData?.settings?.premiumWaitlistAt);

  if (isLoading && !accountData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#245FD4] border-t-transparent" />
          <p
            className="text-base font-bold text-[#1E293B]"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Loading account settings...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* 256px Fixed Sidebar */}
      <DashboardSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navigation Bar with Search and Profile */}
        <DashboardTopBar
          userName={displayName}
          userEmail={displayEmail}
          avatarUrl={avatarPreviewUrl}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />

        {/* Settings Body Canvas */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-10 2xl:px-12">
          <main className="mx-auto flex flex-col gap-6 sm:gap-7 w-full max-w-[1140px]">
            {/* Header with Title, Subtitle, and Action Buttons matching Figma */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1
                  className="text-[32px] sm:text-[40px] lg:text-[48px] font-semibold text-[#161E2E] leading-tight tracking-[-0.85px]"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Setting
                </h1>
                <p
                  className="mt-1 text-[13px] sm:text-[14px] text-[#6B7280]"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  Manage your account profile, security credentials, plan and billing preferences.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 sm:px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-50 active:scale-95 cursor-pointer"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  title="Log out of your account"
                >
                  <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={!isDirty || isSaving}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={!isDirty || !isValid || isSaving}
                  className="flex items-center gap-2 rounded-xl bg-[#022977] px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:bg-opacity-95 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  {isSaving ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save changes</span>
                  )}
                </button>
              </div>
            </div>

            {/* Desktop Two-Column Layout (Left 780px, Right 340px, Gap 20px) */}
            <div className="flex flex-col lg:flex-row items-start gap-5 w-full">
              {/* Left Column (780px max-w, w-full) */}
              <div className="flex-1 w-full flex flex-col gap-5 max-w-full lg:max-w-[780px]">
                {/* 1. Your profile card */}
                <ProfileCard
                  firstName={formState.firstName}
                  lastName={formState.lastName}
                  email={displayEmail}
                  companyName={formState.companyName}
                  avatarUrl={avatarPreviewUrl}
                  errors={errors}
                  isUploadingAvatar={isUploadingAvatar}
                  onFirstNameChange={(val) =>
                    setFormState((prev) => ({ ...prev, firstName: val }))
                  }
                  onLastNameChange={(val) =>
                    setFormState((prev) => ({ ...prev, lastName: val }))
                  }
                  onCompanyNameChange={(val) =>
                    setFormState((prev) => ({ ...prev, companyName: val }))
                  }
                  onAvatarUpload={handleAvatarUpload}
                  onAvatarRemove={handleAvatarRemove}
                />

                {/* 2. Signature defaults card */}
                <SignatureDefaultsCard
                  defaultTemplateId={formState.defaultTemplateId}
                  defaultExportFormat={formState.defaultExportFormat}
                  signatureFont={formState.signatureFont}
                  brandColor={formState.brandColor}
                  includePhoto={formState.includePhoto}
                  brandColorError={errors.brandColor}
                  onTemplateChange={(val) =>
                    setFormState((prev) => ({ ...prev, defaultTemplateId: val }))
                  }
                  onExportFormatChange={(val) =>
                    setFormState((prev) => ({ ...prev, defaultExportFormat: val }))
                  }
                  onFontChange={(val) =>
                    setFormState((prev) => ({ ...prev, signatureFont: val }))
                  }
                  onBrandColorChange={(val) =>
                    setFormState((prev) => ({ ...prev, brandColor: val }))
                  }
                  onIncludePhotoChange={(val) =>
                    setFormState((prev) => ({ ...prev, includePhoto: val }))
                  }
                />

                {/* 3. Notifications card */}
                <NotificationsCard
                  notifyProductUpdates={notifyProductUpdates}
                  notifyTips={notifyTips}
                  onToggleProductUpdates={handleToggleProductUpdates}
                  onToggleTips={handleToggleTips}
                />

                {/* Workspace footer label */}
                <p
                  className="text-[12px] text-[#94A3B8] px-1"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  Changes apply to your personal workspace.
                </p>
              </div>

              {/* Right Column (340px width, shrink-0) */}
              <div className="w-full lg:w-[340px] shrink-0 flex flex-col gap-5">
                {/* 4. Plan & usage card */}
                <PlanUsageCard
                  signatures={accountData?.usage?.signatures ?? 0}
                  signatureLimit={accountData?.usage?.signatureLimit ?? 3}
                  isWaitlisted={isWaitlisted}
                  isJoiningWaitlist={isJoiningWaitlist}
                  onJoinWaitlist={handleJoinWaitlist}
                />

                {/* 5. Security card */}
                <SecurityCard
                  hasPassword={accountData?.hasPassword ?? true}
                  providers={accountData?.providers ?? []}
                  onShowToast={showToast}
                />

                {/* 6. Your starting point live mini-signature preview */}
                <StartingPointCard
                  firstName={formState.firstName}
                  lastName={formState.lastName}
                  email={displayEmail}
                  companyName={formState.companyName}
                  avatarUrl={avatarPreviewUrl}
                  defaultTemplateId={formState.defaultTemplateId}
                  defaultExportFormat={formState.defaultExportFormat}
                  signatureFont={formState.signatureFont}
                  brandColor={formState.brandColor}
                  includePhoto={formState.includePhoto}
                />

                {/* 7. Data & privacy card */}
                <DataPrivacyCard
                  hasPassword={accountData?.hasPassword ?? true}
                  onShowToast={showToast}
                />

                {/* 8. Log out card */}
                <div className="rounded-2xl border border-[#E1E6EF] bg-white p-6 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <div>
                        <h2
                          className="text-[18px] font-semibold text-[#172238] leading-tight"
                          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                        >
                          Log out
                        </h2>
                        <p
                          className="mt-0.5 text-[13px] text-[#6B7280]"
                          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                        >
                          End your current session on this device.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                    <div className="flex flex-col min-w-0 pr-2">
                      <span
                        className="text-xs font-semibold text-[#1E293B] truncate"
                        style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                      >
                        {displayName}
                      </span>
                      {displayEmail && (
                        <span
                          className="text-[11px] text-[#64748B] truncate"
                          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                        >
                          {displayEmail}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center gap-2 shrink-0 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 shadow-2xs transition hover:bg-red-100 disabled:opacity-50 active:scale-95 cursor-pointer"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-xl animate-in slide-in-from-bottom-3 duration-200"
          style={{
            borderColor: toast.isError ? "#FECACA" : "#BFDBFE",
          }}
        >
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
              toast.isError ? "bg-red-50 text-red-600" : "bg-blue-50 text-[#245FD4]"
            }`}
          >
            {toast.isError ? (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          <span
            className="text-xs font-semibold text-[#1E293B]"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            {toast.message}
          </span>
        </div>
      )}
    </div>
  );
}
