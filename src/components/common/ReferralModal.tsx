"use client";

import { useEffect, useState } from "react";
import { getReferralInfo, sendReferralInvite, ReferralInfoResponse } from "@/app/lib/api";
import { isValidEmail } from "@/lib/validation";

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
  const [data, setData] = useState<ReferralInfoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Load referral details when modal opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    getReferralInfo()
      .then((res) => {
        if (isMounted) {
          setData(res);
          setStatusMessage(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setStatusMessage({
            type: "error",
            text: err instanceof Error ? err.message : "Failed to load referral details.",
          });
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSendInvite(e: React.FormEvent) {
    e.preventDefault();
    if (isSending) return;

    const trimmedEmail = emailInput.trim();
    if (!trimmedEmail) {
      setEmailError("Email address is required.");
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError(null);
    setStatusMessage(null);
    setIsSending(true);

    try {
      const res = await sendReferralInvite(trimmedEmail);
      setStatusMessage({ type: "success", text: res.message || "Invite sent successfully!" });
      setEmailInput("");
      setEmailError(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to send invitation. Please try again.";
      setStatusMessage({ type: "error", text: message });
    } finally {
      setIsSending(false);
    }
  }

  async function handleCopyLink() {
    if (!data?.shareUrl) return;
    try {
      await navigator.clipboard.writeText(data.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const input = document.createElement("input");
      input.value = data.shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  function handleShareWhatsapp() {
    if (!data?.shareUrl) return;
    const message = [
      "*Create your professional email signature with Sig Signature.*",
      "",
      "I've been using Sig Signature to build clean, responsive email signatures that look great across Gmail, Outlook, and Apple Mail.",
      "",
      "Use my link to create yours for free:",
      "",
      `Here's my link 👇`,
      data.shareUrl,
    ].join("\n");

    const encodedText = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, "_blank", "noopener,noreferrer");
  }

  // Calculate formatted trial expiration
  const proExpirationText = (() => {
    if (!data?.proTrialUntil) return null;
    try {
      const date = new Date(data.proTrialUntil);
      if (isNaN(date.getTime())) return null;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return null;
    }
  })();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="referral-modal-title"
      onClick={onClose}
    >
      <div
        className="relative isolate w-full max-w-[480px] rounded-[32px] bg-white p-5 sm:p-7 shadow-2xl border border-slate-100 transition-all transform scale-100 animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 25px 60px -15px rgba(2, 41, 119, 0.2)",
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
          aria-label="Close"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header Crown Icon & Title */}
        <div className="relative flex flex-col items-center text-center pt-1">
          <div className="mb-3 flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-blue-100 text-[#245FD4] shadow-xs ring-4 ring-blue-50/80">
            <svg className="h-6 w-6 text-[#245FD4]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
            </svg>
          </div>

          <h3
            id="referral-modal-title"
            className="text-xl sm:text-2xl font-bold text-[#101828] tracking-tight"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Get Premium Plan for Free
          </h3>

          <p
            className="mt-2 text-xs sm:text-[13.5px] text-[#475467] leading-relaxed max-w-sm"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            Invite a colleague to create their email signature with Sig Signature. As soon as they sign up, you unlock a full month of Pro access with zero credit card or billing details required.
          </p>

          {/* Active Pro Status Banner (if user already earned it) */}
          {data?.isProTrialActive && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200/90 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-2xs">
              <svg className="h-4 w-4 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>
                Pro Active through {proExpirationText || "Trial"} ({data.referralCount} colleague{data.referralCount === 1 ? "" : "s"} joined)
              </span>
            </div>
          )}
        </div>

        {/* 1-Click Email Invitation Form */}
        <form onSubmit={handleSendInvite} noValidate className="relative mt-5 flex flex-col gap-1.5">
          <label
            htmlFor="colleague-email"
            className="text-[11px] font-bold uppercase tracking-wider text-slate-500"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            SEND DIRECT INVITE EMAIL
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                id="colleague-email"
                type="email"
                placeholder="colleague@company.com"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                disabled={isSending || isLoading}
                className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition disabled:opacity-60 ${
                  emailError
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 focus:border-[#245FD4] focus:ring-2 focus:ring-[#245FD4]/20"
                }`}
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              />
            </div>
            <button
              type="submit"
              disabled={isSending || isLoading || !emailInput.trim()}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#245FD4] to-[#022977] px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:opacity-95 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {isSending ? (
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Sending...</span>
                </span>
              ) : (
                "Send Invite"
              )}
            </button>
          </div>

          {/* Inline Email Error Message */}
          {emailError && (
            <p
              className="text-[11.5px] font-medium text-red-600 mt-0.5 ml-0.5 flex items-center gap-1 animate-in fade-in duration-150"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              <svg className="h-3.5 w-3.5 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{emailError}</span>
            </p>
          )}

          {/* Feedback status */}
          {statusMessage && (
            <div
              className={`mt-1 text-xs font-medium rounded-xl p-2.5 ${
                statusMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-red-50 text-red-600 border border-red-200"
              }`}
            >
              {statusMessage.text}
            </div>
          )}
        </form>

        {/* Divider */}
        <div className="relative my-4 sm:my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/80" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 font-semibold text-slate-400 uppercase tracking-wider text-[10.5px]">
              Or Share Instantly
            </span>
          </div>
        </div>

        {/* Polished Action Buttons: Copy Link & Share via WhatsApp */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-2.5 pb-1">
          {/* Copy Link Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            disabled={isLoading || !data?.shareUrl}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs sm:text-[13px] font-semibold transition shadow-2xs border cursor-pointer ${
              copied
                ? "bg-[#EFF6FF] border-[#245FD4]/30 text-[#245FD4]"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900"
            }`}
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            {copied ? (
              <>
                <svg className="h-4 w-4 text-[#245FD4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>Copy Link</span>
              </>
            )}
          </button>

          {/* Share via WhatsApp Button */}
          <button
            type="button"
            onClick={handleShareWhatsapp}
            disabled={isLoading || !data?.shareUrl}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366]/18 hover:border-[#25D366]/60 py-2.5 px-3 text-xs sm:text-[13px] font-semibold text-[#0E7A40] transition shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            <svg
              className="h-4.5 w-4.5 shrink-0 text-[#25D366]"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span>Share via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
