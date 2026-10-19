"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { downloadAccountExport, getFriendlySecurityErrorMessage } from "@/app/lib/api";
import DeleteAccountModal from "./DeleteAccountModal";

interface DataPrivacyCardProps {
  hasPassword: boolean;
  onShowToast: (message: string, isError?: boolean) => void;
}

export default function DataPrivacyCard({
  hasPassword,
  onShowToast,
}: DataPrivacyCardProps) {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Handle Download Account Data
  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const blob = await downloadAccountExport();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sigsignature-account-export.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onShowToast("Account data exported successfully");
    } catch (err: unknown) {
      const friendlyMessage = getFriendlySecurityErrorMessage(err);
      onShowToast(friendlyMessage, true);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAccountDeleted = (msg: string) => {
    // Show toast and redirect to home page
    if (typeof window !== "undefined") {
      sessionStorage.setItem("sig_flash_toast", msg);
    }
    router.replace("/");
  };

  return (
    <>
      <div className="rounded-2xl border border-[#E1E6EF] bg-white p-6 shadow-xs">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#F1F5F9]">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#245FD4]">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h2
                className="text-[18px] font-semibold text-[#172238] leading-tight"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Data &amp; privacy
              </h2>
              <p
                className="mt-0.5 text-[13px] text-[#6B7280]"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                Stay in control of your information.
              </p>
            </div>
          </div>
        </div>

        {/* Action Links */}
        <div className="pt-3.5 flex flex-col gap-2.5">
          {/* Download account data */}
          <div>
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 text-xs font-semibold text-[#245FD4] hover:underline disabled:opacity-50 transition cursor-pointer"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              {isDownloading ? (
                <>
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#245FD4] border-t-transparent" />
                  <span>Preparing export...</span>
                </>
              ) : (
                <span>Download account data</span>
              )}
            </button>
          </div>

          {/* Read the Privacy Policy */}
          <div>
            <Link
              href="/privacy"
              className="text-xs text-[#6B7280] hover:text-[#1E293B] hover:underline transition"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Read the Privacy Policy
            </Link>
          </div>

          {/* Delete account */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline transition cursor-pointer"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Delete account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Danger Modal */}
      {isDeleteModalOpen && (
        <DeleteAccountModal
          isOpen={isDeleteModalOpen}
          hasPassword={hasPassword}
          onClose={() => setIsDeleteModalOpen(false)}
          onSuccess={handleAccountDeleted}
        />
      )}
    </>
  );
}
