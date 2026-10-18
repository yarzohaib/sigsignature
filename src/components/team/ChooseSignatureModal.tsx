"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { getSignatureRepository } from "@/lib/signatures/repository";
import type { SavedSignature } from "@/types/signature";
import { createTeamFromSignature, updateTeam, ApiError } from "@/app/lib/api";
import { autoBindStudioData } from "@/lib/team/autoBind";
import type { StudioSignatureData } from "@/types/studio";
import SignaturePreviewFrame from "@/components/studio/SignaturePreviewFrame";
import { renderSavedSignatureHtml } from "@/lib/signatures/render";
import { isStudioNameOrEmailUnlinked } from "@/lib/team/boundFields";

interface ChooseSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamCreated: () => void;
  showToast: (msg: string, action?: { label: string; href: string }) => void;
}

export default function ChooseSignatureModal({
  isOpen,
  onClose,
  onTeamCreated,
  showToast,
}: ChooseSignatureModalProps) {
  const [signatures, setSignatures] = useState<SavedSignature[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function loadUserSignatures() {
      setIsLoading(true);
      setError(null);
      try {
        const repo = getSignatureRepository();
        const list = await repo.list();
        if (isMounted) {
          setSignatures(list);
          if (list.length > 0) {
            setSelectedId(list[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load signatures:", err);
        if (isMounted) {
          setError("Failed to load your signatures. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadUserSignatures();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  const selectedSig = signatures.find((s) => s.id === selectedId);
  const selectedPreviewHtml = useMemo(() => {
    if (!selectedSig) return "";
    try {
      return renderSavedSignatureHtml(selectedSig, { preview: true });
    } catch {
      return "";
    }
  }, [selectedSig]);

  if (!isOpen) return null;

  async function handleConfirm() {
    if (!selectedId) return;
    const chosenSig = signatures.find((s) => s.id === selectedId);
    if (!chosenSig) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Create team from signature
      const createdTeam = await createTeamFromSignature({
        signatureId: selectedId,
        name: chosenSig.name,
      });

      // 2. If it is a studio design, auto-bind elements and update
      let hasUnlinkedImportant = false;
      if (createdTeam.kind === "studio") {
        const boundData = autoBindStudioData(
          createdTeam.data as StudioSignatureData
        );
        await updateTeam({ data: boundData });
        hasUnlinkedImportant = isStudioNameOrEmailUnlinked(boundData);
      }

      if (hasUnlinkedImportant) {
        showToast(
          `Team signature created. Name or Email is not linked.`,
          {
            label: "Open Studio",
            href: chosenSig.kind === "studio" ? `/design-studio?edit=${chosenSig.id}` : "/design-studio",
          }
        );
      } else {
        showToast(`Team signature created from "${chosenSig.name}".`);
      }
      onTeamCreated();
      onClose();
    } catch (err: unknown) {
      console.error("Failed to create team:", err);
      if (err instanceof ApiError && err.code === "TEAM_EXISTS") {
        setError(
          "You already have a team signature. Delete it first to create a new one."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create team signature. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="choose-sig-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
          <div>
            <h3
              id="choose-sig-title"
              className="text-lg font-bold text-[#0B1A3D]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Choose a signature for your team
            </h3>
            <p
              className="mt-1 text-xs text-[#64748B]"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Select an existing signature to copy as your team template. Your original signature will stay in My Signatures.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mt-3 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* Content body */}
        <div className="flex-1 overflow-y-auto py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#245FD4] border-t-transparent" />
              <p className="text-xs text-[#64748B]">Loading your signatures...</p>
            </div>
          ) : signatures.length === 0 ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#245FD4] mb-3">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <h4 className="text-sm font-semibold text-[#0B1A3D]">No signatures found</h4>
              <p className="mt-1 text-xs text-[#64748B] max-w-xs mx-auto">
                You haven&apos;t created any signatures yet. Create one in Templates or Design Studio first.
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <Link
                  href="/templates"
                  className="rounded-xl bg-[#245FD4] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition"
                >
                  Browse Templates
                </Link>
                <Link
                  href="/design-studio"
                  className="rounded-xl border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold text-[#1E293B] hover:bg-slate-50 transition"
                >
                  Design Studio
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {signatures.map((sig) => {
                  const isSelected = selectedId === sig.id;
                  const kindBadge = sig.kind === "studio" ? "Studio" : "Template";
                  return (
                    <div
                      key={sig.id}
                      onClick={() => setSelectedId(sig.id)}
                      className={`flex items-center justify-between rounded-xl border p-3 transition cursor-pointer ${
                        isSelected
                          ? "border-[#245FD4] bg-[#EFF6FF]/60 shadow-2xs"
                          : "border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            isSelected
                              ? "border-[#245FD4] bg-[#245FD4]"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && (
                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-[#0B1A3D] truncate">
                              {sig.name}
                            </span>
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                              {kindBadge}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#64748B] truncate">
                            {sig.data.fullName || sig.data.companyName || "Email Signature"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedSig && selectedPreviewHtml && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-2.5">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#0B1A3D]">Signature preview</span>
                    <span className="text-[10px] text-[#64748B]">{selectedSig.name}</span>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <SignaturePreviewFrame html={selectedPreviewHtml} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1F5F9]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-[#CBD5E1] bg-white px-4 py-2 text-xs sm:text-sm font-medium text-[#475569] hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedId || isSubmitting || signatures.length === 0}
            className="flex items-center gap-2 rounded-xl bg-[#245FD4] hover:bg-[#1D4ED8] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Creating...</span>
              </>
            ) : (
              <span>Create team signature</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
