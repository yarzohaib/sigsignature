"use client";

import { useEffect, useState } from "react";
import { getReferralInfo, sendReferralInvite, ReferralInfoResponse } from "@/app/lib/api";

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
  const [data, setData] = useState<ReferralInfoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailInput, setEmailInput] = useState("");
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
    if (!isOpen) {
      setStatusMessage(null);
      setCopied(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    getReferralInfo()
      .then((res) => {
        if (isMounted) setData(res);
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
    if (!emailInput.trim() || isSending) return;

    setStatusMessage(null);
    setIsSending(true);

    try {
      const res = await sendReferralInvite(emailInput.trim());
      setStatusMessage({ type: "success", text: res.message || "Invite sent successfully!" });
      setEmailInput("");
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
    const text = encodeURIComponent(
      `Hey! I use Sig Signature to create professional email signatures. Check it out here: ${data.shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank", "noopener,noreferrer");
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
        className="relative w-full max-w-[480px] rounded-3xl bg-white p-5 sm:p-7 shadow-2xl border border-slate-100 transition-all transform scale-100 animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 25px 60px -15px rgba(2, 41, 119, 0.2)",
        }}
      >
        {/* Subtle decorative background gradient accents */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-100/40 blur-3xl" />

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
        <form onSubmit={handleSendInvite} className="relative mt-5 flex flex-col gap-1.5">
          <label
            htmlFor="colleague-email"
            className="text-[11px] font-bold uppercase tracking-wider text-slate-500"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            SEND DIRECT INVITE EMAIL
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="colleague-email"
              type="email"
              required
              placeholder="colleague@company.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              disabled={isSending || isLoading}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#245FD4] focus:outline-none focus:ring-2 focus:ring-[#245FD4]/20 transition disabled:opacity-60"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            />
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
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900"
            }`}
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            {copied ? (
              <>
                <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
            className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 py-2.5 px-4 text-xs sm:text-[13px] font-semibold text-[#128C7E] transition shadow-2xs hover:bg-[#25D366]/18 cursor-pointer disabled:opacity-50"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            <svg className="h-4 w-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.585 1.761.88 2.796.88 3.183 0 5.768-2.586 5.768-5.766 0-3.18-2.585-5.767-5.768-5.767zm3.391 8.241c-.144.405-.837.774-1.17.824-.312.045-.634.079-1.801-.409-1.503-.628-2.482-2.148-2.559-2.25-.074-.103-.606-.807-.606-1.538 0-.732.383-1.092.519-1.241.136-.149.297-.186.396-.186.099 0 .198.001.284.006.09.005.212-.034.331.253.123.298.421 1.026.458 1.101.037.075.062.162.012.261-.049.099-.074.161-.148.248-.075.086-.157.192-.224.258-.074.074-.152.155-.065.304.086.149.385.635.827 1.028.568.506 1.047.663 1.196.737.149.074.235.062.322-.037.086-.099.371-.433.47-.582.099-.149.198-.124.334-.074.136.049.864.408 1.013.482.149.074.248.112.284.174.037.062.037.359-.107.764z" />
            </svg>
            <span>Share via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
