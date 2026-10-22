"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import SignaturesHeader from "@/components/signatures/SignaturesHeader";
import SignatureCard from "@/components/signatures/SignatureCard";
import DeleteSignatureModal from "@/components/signatures/DeleteSignatureModal";
import EmptySignaturesState from "@/components/signatures/EmptySignaturesState";
import Link from "next/link";
import {
  isSignatureLimitError,
  getTeam,
  createTeamFromSignature,
  updateTeam,
} from "@/app/lib/api";
import { getStoredSettings } from "@/app/lib/auth";
import { getSignatureRepository } from "@/lib/signatures/repository";
import { SavedSignature } from "@/types/signature";
import type { StudioSignatureData } from "@/types/studio";
import { autoBindStudioData } from "@/lib/team/autoBind";
import { isStudioNameOrEmailUnlinked } from "@/lib/team/boundFields";
import { getEditHref } from "@/lib/signatures/kind";
import {
  renderSavedSignatureHtml,
  renderSavedSignaturePlainText,
} from "@/lib/signatures/render";
import { copySignatureRich, copyTextToClipboard } from "@/lib/clipboard";
import SignatureCopiedAlert from "@/components/signatures/SignatureCopiedAlert";
import SignaturesListSkeleton from "@/components/skeletons/SignaturesListSkeleton";
import { getCachedRouteData, setCachedRouteData } from "@/lib/cache/routeCache";

function MySignaturesContent() {
  const router = useRouter();

  // Initial state from in-memory cache for Stale-While-Revalidate
  const cachedSignatures = getCachedRouteData<SavedSignature[]>("/signatures");
  const [signatures, setSignatures] = useState<SavedSignature[]>(() => cachedSignatures || []);
  const [isLoading, setIsLoading] = useState(!cachedSignatures);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Modals and feedback state
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
      const repo = getSignatureRepository();
      const list = await repo.list();
      setSignatures(list);
      setCachedRouteData("/signatures", list);
      setLoadError(null);
    } catch (err: unknown) {
      console.error("Failed to load signatures:", err);
      const msg = err instanceof Error ? err.message : "Failed to load signatures.";
      setLoadError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;
    async function init() {
      try {
        const repo = getSignatureRepository();
        const list = await repo.list();
        if (!isCancelled) {
          setSignatures(list);
          setCachedRouteData("/signatures", list);
          setLoadError(null);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          console.error("Failed to load signatures:", err);
          const msg = err instanceof Error ? err.message : "Failed to load signatures.";
          setLoadError(msg);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }
    init();
    return () => {
      isCancelled = true;
    };
  }, []);

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
    }, 4000);
  }

  const handleCreateNew = () => {
    router.push("/templates?new=true");
  };

  const handleEdit = (id: string) => {
    const target = signatures.find((s) => s.id === id);
    if (!target) return;
    router.push(getEditHref(target));
  };

  const handleDuplicate = async (id: string) => {
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
  };

  const handleExport = async (id: string) => {
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
  };

  const handleConfirmDelete = async () => {
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
  };

  const handleOpenCopyToTeam = async (signature: SavedSignature) => {
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
  };

  const handleConfirmCopyToTeam = async () => {
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
  };

  // Instant Skeleton Mount matching Templates benchmark
  if (isLoading && signatures.length === 0) {
    return (
      <div className="px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-10 2xl:px-12 w-full">
        <SignaturesListSkeleton title="My Signatures" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-10 2xl:px-12 w-full">
      <main className="flex flex-col gap-6 sm:gap-7 w-full">
        {/* Page Header */}
        <SignaturesHeader onCreateClick={handleCreateNew} />

        {/* Content Area */}
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
              onClick={() => {
                setIsLoading(true);
                loadSignatures();
              }}
              className="mt-4 rounded-xl bg-[#245FD4] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#1E4FB0] transition cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : signatures.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 w-full">
            {signatures.map((sig) => (
              <SignatureCard
                key={sig.id}
                signature={sig}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onExport={handleExport}
                onDelete={setDeletingSignature}
                onCopyToTeam={handleOpenCopyToTeam}
              />
            ))}
          </div>
        ) : (
          <EmptySignaturesState onCreateClick={handleCreateNew} />
        )}
      </main>

      {/* Delete Signature Modal */}
      <DeleteSignatureModal
        isOpen={Boolean(deletingSignature)}
        signatureName={deletingSignature?.name || ""}
        onClose={() => setDeletingSignature(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Copy to Team Confirmation Modal */}
      {copyToTeamSig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150 border border-slate-100">
            {isCheckingTeam ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#245FD4] border-t-transparent" />
                <p className="mt-3 text-xs text-[#64748B]">Checking team status...</p>
              </div>
            ) : hasTeamAlready ? (
              <div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0B1A3D]">Team signature already exists</h3>
                    <p className="mt-1 text-xs sm:text-sm text-[#64748B] leading-relaxed">
                      Your team already has an active signature. You can only have 1 team signature.
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

      {/* Small Copied Alert */}
      <SignatureCopiedAlert
        isOpen={showCopiedAlert}
        onClose={() => setShowCopiedAlert(false)}
        className="fixed bottom-6 right-6 z-50 w-full max-w-[420px] shadow-2xl animate-in slide-in-from-bottom-5 duration-200"
      />
    </div>
  );
}

export default function MySignaturesPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-10 2xl:px-12 w-full">
          <SignaturesListSkeleton title="My Signatures" />
        </div>
      }
    >
      <MySignaturesContent />
    </Suspense>
  );
}
