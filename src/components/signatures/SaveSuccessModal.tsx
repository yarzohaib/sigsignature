"use client";

import { useState } from "react";
import Image from "next/image";
import { TemplateSignatureData } from "@/types/template";
import { generateSignatureHtml, generateSignaturePlainText } from "@/lib/generateSignatureHtml";
import { copySignatureRich } from "@/lib/clipboard";
import SignatureCopiedAlert from "@/components/signatures/SignatureCopiedAlert";

interface SaveSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  signatureData: TemplateSignatureData;
  signatureName?: string;
}

export default function SaveSuccessModal({
  isOpen,
  onClose,
  signatureData,
  signatureName,
}: SaveSuccessModalProps) {
  const [copiedSignature, setCopiedSignature] = useState(false);
  const [showCopiedAlert, setShowCopiedAlert] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  if (!isOpen) return null;

  function showToast(msg: string) {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3000);
  }

  // 1. Copy Signature as formatted rich text
  async function handleCopySignature() {
    const html = generateSignatureHtml(signatureData);
    const plainText = generateSignaturePlainText(signatureData);
    try {
      await copySignatureRich(html, plainText);
      setCopiedSignature(true);
      setShowCopiedAlert(true);
      setTimeout(() => setCopiedSignature(false), 2500);
    } catch {
      showToast("Failed to copy signature. Please try again.");
    }
  }

  // 2. Download as Image (PNG via Canvas)
  async function handleDownloadImage() {
    setIsDownloadingImage(true);
    const fileName = (signatureName || signatureData.fullName || "my_signature")
      .trim()
      .replace(/\s+/g, "_");

    try {
      const scale = 2;
      const w = 540;
      const h = 200;
      const canvas = document.createElement("canvas");
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas rendering context unavailable");
      }

      ctx.scale(scale, scale);

      // Card Background
      ctx.fillStyle = "#FFFFFF";
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(0, 0, w, h, 16);
      } else {
        ctx.rect(0, 0, w, h);
      }
      ctx.fill();

      // Border
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 1;
      ctx.stroke();

      const themeColor = signatureData.themeColor || "#245FD4";

      // Render Avatar or Fallback
      const avatarSrc = signatureData.avatarUrl || "/templates/avatars/avatar-1.png";
      const img = new window.Image();
      img.crossOrigin = "anonymous";

      const renderCardDetails = () => {
        // Name
        ctx.fillStyle = "#1E293B";
        ctx.font = "bold 16px Montserrat, Arial, sans-serif";
        ctx.fillText(signatureData.fullName || "Your Full Name", 98, 42);

        // Job Title & Company
        ctx.fillStyle = "#64748B";
        ctx.font = "500 12px Commissioner, Arial, sans-serif";
        const titleStr = signatureData.companyName
          ? `${signatureData.jobTitle || "Job Title"} • ${signatureData.companyName}`
          : signatureData.jobTitle || "Job Title";
        ctx.fillText(titleStr, 98, 62);

        // Contact info
        ctx.font = "11px Commissioner, Arial, sans-serif";
        let contactY = 86;
        if (signatureData.phone) {
          ctx.fillStyle = themeColor;
          ctx.fillText("☎", 98, contactY);
          ctx.fillStyle = "#64748B";
          ctx.fillText(signatureData.phone, 116, contactY);
          contactY += 20;
        }
        if (signatureData.email) {
          ctx.fillStyle = themeColor;
          ctx.fillText("✉", 98, contactY);
          ctx.fillStyle = "#64748B";
          ctx.fillText(signatureData.email, 116, contactY);
          contactY += 20;
        }
        if (signatureData.website) {
          ctx.fillStyle = themeColor;
          ctx.fillText("⚲", 98, contactY);
          ctx.fillStyle = "#64748B";
          ctx.fillText(signatureData.website, 116, contactY);
        }

        // Vertical divider
        ctx.strokeStyle = "#E2E8F0";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(350, 30);
        ctx.lineTo(350, 160);
        ctx.stroke();

        // Company Logo placeholder / Name
        ctx.fillStyle = themeColor;
        ctx.font = "bold 13px Montserrat, Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(signatureData.companyName || "Company Name", 440, 100);

        if (signatureData.optional?.tagline) {
          ctx.font = "italic 10.5px Commissioner, Arial, sans-serif";
          ctx.fillStyle = "#94A3B8";
          ctx.fillText(signatureData.optional.tagline, 440, 122);
        }

        // Export to PNG blob
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${fileName}_signature.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast("Signature image downloaded!");
          } else {
            fallbackHtmlDownload();
          }
          setIsDownloadingImage(false);
        }, "image/png");
      };

      img.onload = () => {
        ctx.save();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(22, 26, 62, 62, 12);
        } else {
          ctx.rect(22, 26, 62, 62);
        }
        ctx.clip();
        ctx.drawImage(img, 22, 26, 62, 62);
        ctx.restore();
        renderCardDetails();
      };

      img.onerror = () => {
        // Fallback placeholder avatar circle
        ctx.fillStyle = "#EFF6FF";
        ctx.beginPath();
        ctx.arc(53, 57, 31, 0, Math.PI * 2);
        ctx.fill();
        renderCardDetails();
      };

      img.src = avatarSrc;
    } catch {
      fallbackHtmlDownload();
      setIsDownloadingImage(false);
    }
  }

  function fallbackHtmlDownload() {
    const html = generateSignatureHtml(signatureData);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const fileName = (signatureName || signatureData.fullName || "my_signature")
      .trim()
      .replace(/\s+/g, "_");
    a.href = url;
    a.download = `${fileName}_signature.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Downloaded signature HTML file!");
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[760px] rounded-3xl bg-white p-6 sm:p-9 shadow-2xl border border-slate-100 flex flex-col items-center text-center overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close 'X' Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Heading & Subtitle */}
        <h2
          className="text-2xl sm:text-[28px] font-bold text-[#1E293B] leading-tight"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Your Signature Is Ready
        </h2>
        <p
          className="mt-1.5 text-xs sm:text-[14px] text-[#64748B] max-w-md"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          Attach it to your emails, or add it anywhere that accepts image based signatures.
        </p>

        {/* Central Graphic Container with Dashed Trajectory, Envelope Icon, and Center Preview */}
        <div className="relative w-full max-w-[640px] my-4 sm:my-6 min-h-[240px] sm:min-h-[270px] flex items-center justify-center">
          {/* Background SVG Dashed Curve Line */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 640 270"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Dashed line connecting left envelope icon, curving around center, and looping to top-right paper airplane */}
            <path
              d="M 52 188 C 85 160, 115 140, 160 170 C 210 205, 300 230, 420 200 C 490 180, 520 120, 545 75 C 558 52, 575 55, 570 78 C 564 100, 540 96, 548 70 C 555 48, 575 42, 600 32"
              stroke="#245FD4"
              strokeWidth="1.8"
              strokeDasharray="4 4"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
          </svg>

          {/* Left End: Envelope Icon Badge */}
          <div className="absolute left-2 sm:left-4 bottom-8 sm:bottom-12 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#EBF3FF] border border-[#BFDBFE] shadow-xs">
            <svg
              className="w-5 h-5 text-[#245FD4]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>

          {/* Right End: Paper Airplane / Arrow Head */}
          <div className="absolute right-3 sm:right-6 top-3 sm:top-5 z-20">
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 text-[#245FD4] rotate-[-10deg] drop-shadow-xs"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </div>

          {/* Centered Blue Envelope & Signature Card Preview */}
          <div className="relative w-[340px] sm:w-[420px] max-w-[88vw] flex flex-col items-center">
            {/* Signature Card (Emerging out of the envelope) */}
            <div className="relative z-10 w-[315px] sm:w-[380px] rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 text-left shadow-lg">
              {/* Green Checkmark Circle Badge (Top-Right) */}
              <div className="absolute -top-3.5 -right-3.5 z-30 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#22C55E] text-white shadow-md border-2 border-white">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              {/* Signature Card Content */}
              <div className="flex items-center justify-between gap-2.5 sm:gap-3">
                {/* Left: Avatar + Socials */}
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div
                    className="relative h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-xl bg-slate-100 border shadow-2xs"
                    style={{ borderColor: signatureData.themeColor || "#245FD4" }}
                  >
                    <Image
                      src={signatureData.avatarUrl || "/templates/avatars/avatar-1.png"}
                      alt={signatureData.fullName || "Signature avatar"}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                      unoptimized={Boolean(
                        signatureData.avatarUrl?.startsWith("data:") ||
                          signatureData.avatarUrl?.startsWith("blob:")
                      )}
                    />
                  </div>
                  {/* Social badges row */}
                  <div className="flex items-center gap-1">
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-sm bg-[#0077B5] text-[7px] font-bold text-white">
                      in
                    </span>
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-sm bg-[#000000] text-[7px] font-bold text-white">
                      𝕏
                    </span>
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-sm bg-[#1877F2] text-[7px] font-bold text-white">
                      f
                    </span>
                  </div>
                </div>

                {/* Middle: Details */}
                <div className="min-w-0 flex-1 space-y-0.5">
                  <h4 className="text-[12px] sm:text-[13px] font-bold text-[#1E293B] leading-tight truncate">
                    {signatureData.fullName || "Your Full Name"}
                  </h4>
                  <p className="text-[10px] sm:text-[10.5px] font-medium text-[#64748B] leading-tight truncate">
                    {signatureData.jobTitle || "UX/UI Designer"}
                  </p>
                  <div className="pt-0.5 space-y-0.5 text-[8.5px] sm:text-[9px] text-[#64748B]">
                    {signatureData.phone && (
                      <div className="flex items-center gap-1 truncate">
                        <span
                          style={{ color: signatureData.themeColor || "#245FD4" }}
                          className="font-bold"
                        >
                          &#9742;
                        </span>
                        <span>{signatureData.phone}</span>
                      </div>
                    )}
                    {signatureData.email && (
                      <div className="flex items-center gap-1 truncate">
                        <span
                          style={{ color: signatureData.themeColor || "#245FD4" }}
                          className="font-bold"
                        >
                          &#9993;
                        </span>
                        <span className="truncate">{signatureData.email}</span>
                      </div>
                    )}
                    {signatureData.website && (
                      <div className="flex items-center gap-1 truncate">
                        <span
                          style={{ color: signatureData.themeColor || "#245FD4" }}
                          className="font-bold"
                        >
                          &#9873;
                        </span>
                        <span className="truncate">{signatureData.website}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="h-12 sm:h-14 w-px bg-slate-200 shrink-0" />

                {/* Right: Company Logo & Name */}
                <div className="flex flex-col items-center justify-center text-center shrink-0 w-[70px] sm:w-[85px]">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 38 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 8H26C28.2091 8 30 9.79086 30 12V20C30 22.2091 28.2091 24 26 24H22"
                      stroke={signatureData.themeColor || "#245FD4"}
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M26 30H12C9.79086 30 8 28.2091 8 26V18C8 15.7909 9.79086 14 12 14H16"
                      stroke={signatureData.themeColor || "#245FD4"}
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="mt-1 text-[8.5px] sm:text-[9.5px] font-bold text-[#1E293B] leading-tight truncate max-w-full">
                    {signatureData.companyName || "Company Name"}
                  </span>
                </div>
              </div>
            </div>

            {/* Front Envelope Pocket (Overlapping lower portion of card) */}
            <div className="relative -mt-10 sm:-mt-12 w-full z-20 pointer-events-none">
              <svg
                viewBox="0 0 420 125"
                className="w-full h-auto drop-shadow-md"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="envelopeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E5BD8" />
                    <stop offset="100%" stopColor="#1748AE" />
                  </linearGradient>
                </defs>
                {/* Envelope Front Body with V-Opening */}
                <path
                  d="M0,0 L210,72 L420,0 L420,115 Q420,125 410,125 L10,125 Q0,125 0,115 Z"
                  fill="url(#envelopeGrad)"
                />
                {/* Left diagonal crease */}
                <path d="M0,125 L210,58" stroke="#0E3382" strokeWidth="1.2" strokeOpacity="0.4" />
                {/* Right diagonal crease */}
                <path d="M420,125 L210,58" stroke="#0E3382" strokeWidth="1.2" strokeOpacity="0.4" />
                {/* Top V-notch stroke */}
                <path
                  d="M0,0 L210,72 L420,0"
                  stroke="#3B82F6"
                  strokeWidth="1.5"
                  fill="none"
                  strokeOpacity="0.4"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* "What's Next?" Section Divider */}
        <div className="flex items-center justify-center gap-4 my-4 sm:my-5 w-full max-w-[560px]">
          <div className="h-px flex-1 bg-slate-200" />
          <span
            className="text-[13px] sm:text-[14px] font-bold text-[#1E293B]"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            What&apos;s Next?
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Bottom Three Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5 w-full max-w-[580px]">
          {/* Button 1: Copy Signature */}
          <button
            type="button"
            onClick={handleCopySignature}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-[13px] font-semibold text-[#1E293B] shadow-2xs transition hover:bg-slate-50 hover:border-slate-300 active:scale-95"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            {copiedSignature ? (
              <svg
                className="w-4 h-4 shrink-0 text-emerald-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
            <span>{copiedSignature ? "Copied!" : "Copy Signature"}</span>
          </button>

          {/* Button 2: Download Image */}
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isDownloadingImage}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-[13px] font-semibold text-[#1E293B] shadow-2xs transition hover:bg-slate-50 hover:border-slate-300 active:scale-95 disabled:opacity-60"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{isDownloadingImage ? "Downloading..." : "Download Image"}</span>
          </button>

          {/* Button 3: Edit Signature */}
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-[13px] font-semibold text-[#1E293B] shadow-2xs transition hover:bg-slate-50 hover:border-slate-300 active:scale-95"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span>Edit Signature</span>
          </button>
        </div>

        {/* Small Copied Alert matching Image 2 */}
        <SignatureCopiedAlert
          isOpen={showCopiedAlert}
          onClose={() => setShowCopiedAlert(false)}
          className="mt-4 w-full max-w-[440px] animate-in fade-in slide-in-from-top-2 duration-200"
        />

        {/* Inline Feedback Toast */}
        {feedbackToast && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-xl bg-[#1E293B] px-4 py-2 text-xs sm:text-sm text-white shadow-xl animate-in slide-in-from-bottom-2 duration-150">
            <svg
              className="w-4 h-4 text-emerald-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{feedbackToast}</span>
          </div>
        )}
      </div>
    </div>
  );
}
