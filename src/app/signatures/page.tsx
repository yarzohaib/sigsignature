"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import SignaturesHeader from "@/components/signatures/SignaturesHeader";
import SignatureCard from "@/components/signatures/SignatureCard";
import DeleteSignatureModal from "@/components/signatures/DeleteSignatureModal";
import EmptySignaturesState from "@/components/signatures/EmptySignaturesState";
import Link from "next/link";
import {
  UserProfile,
  getCurrentUser,
  logoutUser,
  isSignatureLimitError,
  getTeam,
  createTeamFromSignature,
  updateTeam,
} from "@/app/lib/api";
import {
  clearAuthSession,
  getStoredRefreshToken,
  getStoredUser,
  getStoredSettings,
} from "@/app/lib/auth";
import { getSignatureRepository } from "@/lib/signatures/repository";
import { SavedSignature } from "@/types/signature";
import type { StudioSignatureData } from "@/types/studio";
import { autoBindStudioData } from "@/lib/team/autoBind";
import { isStudioNameOrEmailUnlinked } from "@/lib/team/boundFields";
import {
  renderSavedSignatureHtml,
  renderSavedSignaturePlainText,
} from "@/lib/signatures/render";
import { getEditHref } from "@/lib/signatures/kind";
import { copySignatureRich, copyTextToClipboard } from "@/lib/clipboard";
import SignatureCopiedAlert from "@/components/signatures/SignatureCopiedAlert";

export default function MySignaturesPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Signatures state: initialized from repository so saved templates display
  const [signatures, setSignatures] = useState<SavedSignature[]>([]);
  const [deletingSignature, setDeletingSignature] = useState<SavedSignature | null>(null);
  const [showCopiedAlert, setShowCopiedAlert] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Copy to team state
  const [copyToTeamSig, setCopyToTeamSig] = useState<SavedSignature | null>(null);
  const [hasTeamAlready, setHasTeamAlready] = useState<boolean | null>(null);
  const [isCheckingTeam, setIsCheckingTeam] = useState(false);
  const [isCopyingToTeam, setIsCopyingToTeam] = useState(false);
  const [copyToTeamError, setCopyToTeamError] = useState<string | null>(null);

  const loadSignatures = useCallback(async () => {
    try {
      setLoadError(null);
      const repo = getSignatureRepository();
      const list = await repo.list();
      setSignatures(list);
    } catch (err: unknown) {
      console.error("Failed to load signatures:", err);
      const msg = err instanceof Error ? err.message : "Failed to load signatures.";
      setLoadError(msg);
    }
  }, []);

  useEffect(() => {
    async function verifyAuth() {
      const cachedUser = getStoredUser();
      if (cachedUser) {
        setUser(cachedUser);
      }

      try {
        const freshUser = await getCurrentUser();
        setUser(freshUser);
      } catch (err) {
        console.warn("Session expired or invalid, redirecting to login:", err);
        clearAuthSession();
        router.replace("/login?redirect=/signatures");
        return;
      }

      try {
        await loadSignatures();
      } finally {
        setIsLoading(false);
      }
    }

    verifyAuth();
  }, [router, loadSignatures]);

  useEffect(() => {
    function handleCustomToast(event: Event) {
      const customEvent = event as CustomEvent<string>;
      if (customEvent.detail) {
        showToast(customEvent.detail);
      }
    }

    window.addEventListener("sig_toast", handleCustomToast);
    return () => {
      window.removeEventListener("sig_toast", handleCustomToast);
    };
  }, []);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      const refreshToken = getStoredRefreshToken();
      await logoutUser(refreshToken || undefined);
    } finally {
      clearAuthSession();
      router.replace("/login");
      router.refresh();
    }
  }

  function handleStartDelete(signature: SavedSignature) {
    setDeletingSignature(signature);
  }

  async function handleConfirmDelete() {
    if (!deletingSignature) return;
    const deletedName = deletingSignature.name;
    try {
      const repo = getSignatureRepository();
      await repo.remove(deletingSignature.id);
      await loadSignatures();
      setDeletingSignature(null);
      showToast(`"${deletedName}" was deleted.`);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("sig_count_update"));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete signature.";
      showToast(msg);
    }
  }

  async function handleDuplicate(id: string) {
    try {
      const repo = getSignatureRepository();
      const duplicated = await repo.duplicate(id);
      await loadSignatures();
      showToast(`Duplicated "${duplicated.name}".`);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("sig_count_update"));
      }
    } catch (err: unknown) {
      if (isSignatureLimitError(err)) {
        showToast("You have reached the limit of 3 signatures on the Free plan.");
      } else {
        const msg = err instanceof Error ? err.message : "Failed to duplicate signature.";
        showToast(msg);
      }
    }
  }

  async function handleExport(id: string) {
    const target = signatures.find((s) => s.id === id);
    if (!target) return;

    const html = renderSavedSignatureHtml(target);
    const plainText = renderSavedSignaturePlainText(target);

    try {
      const storedSettings = getStoredSettings();
      if (storedSettings?.defaultExportFormat === "plain") {
        await copyTextToClipboard(plainText);
      } else {
        await copySignatureRich(html, plainText);
      }
      setShowCopiedAlert(true);
    } catch {
      showToast(`Failed to copy "${target.name}". Please try again.`);
    }
  }

  function handleEdit(id: string) {
    const target = signatures.find((s) => s.id === id);
    if (target) {
      router.push(getEditHref(target));
    }
  }

  async function handleStartCopyToTeam(signature: SavedSignature) {
    setCopyToTeamSig(signature);
    setCopyToTeamError(null);
    setIsCheckingTeam(true);
    setHasTeamAlready(null);
    try {
      const existingTeam = await getTeam();
      setHasTeamAlready(existingTeam !== null);
    } catch {
      setHasTeamAlready(false);
    } finally {
      setIsCheckingTeam(false);
    }
  }

  async function handleConfirmCopyToTeam() {
    if (!copyToTeamSig) return;
    setIsCopyingToTeam(true);
    setCopyToTeamError(null);
    try {
      const createdTeam = await createTeamFromSignature({
        signatureId: copyToTeamSig.id,
        name: copyToTeamSig.name,
      });

      let hasUnlinkedImportant = false;
      if (createdTeam.kind === "studio") {
        const boundData = autoBindStudioData(createdTeam.data as StudioSignatureData);
        await updateTeam({ data: boundData });
        hasUnlinkedImportant = isStudioNameOrEmailUnlinked(boundData);
      }

      setCopyToTeamSig(null);
      if (hasUnlinkedImportant) {
        router.push("/team-signatures?unlinked=true");
      } else {
        router.push("/team-signatures");
      }
    } catch (err: unknown) {
      console.error("Failed to copy to team:", err);
      const msg = err instanceof Error ? err.message : "Failed to copy to Team Signatures.";
      setCopyToTeamError(msg);
    } finally {
      setIsCopyingToTeam(false);
    }
  }

  function handleCreateNew() {
    router.push("/templates?new=true");
  }

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : "Member";

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#245FD4] border-t-transparent" />
          <p
            className="text-base font-bold text-[#1E293B]"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Loading your signatures...
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
          userEmail={user?.email}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />

        {/* My Signatures Body Canvas */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-10 2xl:px-12">
          <main className="mx-auto flex flex-col gap-6 sm:gap-7 w-full max-w-[1240px] xl:max-w-[1360px] 2xl:max-w-[1440px]">
            {/* Page Header with Title and Create New Signature Button */}
            <SignaturesHeader onCreateClick={handleCreateNew} />

            {/* Content: Error state with retry OR 3 per row on large screens OR Empty State */}
            {loadError ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 p-10 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h3
                  className="text-base font-bold text-[#1E293B]"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Could not load your signatures
                </h3>
                <p
                  className="mt-1 text-sm text-[#64748B] max-w-md"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  {loadError}
                </p>
                <button
                  type="button"
                  onClick={() => loadSignatures()}
                  className="mt-4 rounded-xl bg-[#245FD4] px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-95"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Try Again
                </button>
              </div>
            ) : signatures.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 2xl:gap-6">
                {signatures.map((signature) => (
                  <SignatureCard
                    key={signature.id}
                    signature={signature}
                    onEdit={handleEdit}
                    onDuplicate={handleDuplicate}
                    onExport={handleExport}
                    onDelete={handleStartDelete}
                    onCopyToTeam={handleStartCopyToTeam}
                  />
                ))}
              </div>
            ) : (
              <EmptySignaturesState onCreateClick={handleCreateNew} />
            )}
          </main>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteSignatureModal
        isOpen={deletingSignature !== null}
        signatureName={deletingSignature?.name || ""}
        onClose={() => setDeletingSignature(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Copy to Team Confirmation / Conflict Modal */}
      {copyToTeamSig && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition">
            {isCheckingTeam ? (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#245FD4] border-t-transparent" />
                <p className="text-xs text-[#64748B]">Checking team status...</p>
              </div>
            ) : hasTeamAlready ? (
              <div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0B1A3D]">
                      Team signature already exists
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-[#64748B] leading-relaxed">
                      You already have a team signature. Delete it first to use a different design.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[#F1F5F9]">
                  <button
                    type="button"
                    onClick={() => setCopyToTeamSig(null)}
                    className="rounded-xl border border-[#CBD5E1] bg-white px-4 py-2 text-xs sm:text-sm font-medium text-[#475569] hover:bg-slate-50 transition cursor-pointer"
                  >
                    Close
                  </button>
                  <Link
                    href="/team-signatures"
                    className="rounded-xl bg-[#245FD4] hover:bg-[#1D4ED8] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition shadow-xs"
                  >
                    Go to Team Signatures
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#245FD4]">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0B1A3D]">
                      Use &quot;{copyToTeamSig.name}&quot; as your team signature?
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-[#64748B] leading-relaxed">
                      This copies the design to Team Signatures. Your original stays in My Signatures.
                    </p>
                  </div>
                </div>

                {copyToTeamError && (
                  <div className="mt-3 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
                    {copyToTeamError}
                  </div>
                )}

                <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[#F1F5F9]">
                  <button
                    type="button"
                    onClick={() => setCopyToTeamSig(null)}
                    disabled={isCopyingToTeam}
                    className="rounded-xl border border-[#CBD5E1] bg-white px-4 py-2 text-xs sm:text-sm font-medium text-[#475569] hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmCopyToTeam}
                    disabled={isCopyingToTeam}
                    className="flex items-center gap-2 rounded-xl bg-[#245FD4] hover:bg-[#1D4ED8] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    {isCopyingToTeam ? (
                      <>
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Copying...</span>
                      </>
                    ) : (
                      <span>Use as team signature</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#1E293B] px-4 py-3 text-sm text-white shadow-xl animate-in slide-in-from-bottom-5 duration-200">
          <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Small Copied Alert matching Image 2 */}
      <SignatureCopiedAlert
        isOpen={showCopiedAlert}
        onClose={() => setShowCopiedAlert(false)}
        className="fixed bottom-6 right-6 z-50 w-full max-w-[420px] shadow-2xl animate-in slide-in-from-bottom-5 duration-200"
      />
    </div>
  );
}
