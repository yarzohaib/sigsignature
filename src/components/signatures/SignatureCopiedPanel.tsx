"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SignatureCopiedPanelProps {
  mode: "formatted" | "html";
  onClose: () => void;
}

type AccordionTab = "gmail" | "outlook" | "apple";

export default function SignatureCopiedPanel({
  mode,
  onClose,
}: SignatureCopiedPanelProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [openSection, setOpenSection] = useState<AccordionTab | null>(null);

  // Focus dialog on mount and restore scroll lock on unmount
  useEffect(() => {
    dialogRef.current?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function toggleSection(tab: AccordionTab) {
    setOpenSection((prev) => (prev === tab ? null : tab));
  }

  function handleBackToDashboard() {
    onClose();
    router.push("/dashboard");
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
      role="presentation"
    >
      {/* Dialog Card matching Figma screenshot */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="copied-dialog-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[940px] rounded-[24px] sm:rounded-[32px] bg-white p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto overflow-x-hidden outline-none animate-in zoom-in-95 duration-150"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Close Button ('X') */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 sm:top-6 sm:right-6 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          aria-label="Close dialog"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Two-column layout on large screens, stacked on small */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">
          {/* Left Column: Copied Illustration */}
          <div className="flex items-center justify-center order-1 lg:order-1">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[420px] aspect-[475/347]">
              <Image
                src="/copied-illustration.svg"
                alt="Signature Copied to Clipboard"
                width={475}
                height={347}
                priority
                className="w-full h-auto object-contain select-none"
              />
            </div>
          </div>

          {/* Right Column: Title, Subtitle, and Accordions */}
          <div className="flex flex-col order-2 lg:order-2">
            {/* Title */}
            <h2
              id="copied-dialog-title"
              className="text-[22px] sm:text-[25px] lg:text-[28px] font-bold text-[#1E293B] leading-tight"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {mode === "formatted"
                ? "Signature Copied to Clipboard"
                : "HTML Copied to Clipboard"}
            </h2>

            {/* Subtext */}
            <p
              className="mt-1.5 text-[13px] sm:text-[14px] text-[#64748B] leading-normal"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Now paste it into your email client signature settings.
            </p>

            {/* Extra warning line for HTML mode */}
            {mode === "html" && (
              <p
                className="mt-2 text-[12px] text-amber-800 bg-amber-50/90 rounded-lg px-3 py-2 border border-amber-200/70 leading-relaxed"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                <span className="font-semibold">Tip:</span> Pasting code only works where your email client accepts HTML. For Gmail, use <span className="font-semibold">Copy Signature</span> instead.
              </p>
            )}

            {/* Accordion Group */}
            <div className="mt-5 border-t border-[#C1C1C1]/40">
              {/* Row 1: Gmail */}
              <div className="border-b border-[#C1C1C1]/40">
                <button
                  type="button"
                  id="accordion-tab-gmail"
                  aria-expanded={openSection === "gmail"}
                  aria-controls="accordion-panel-gmail"
                  onClick={() => toggleSection("gmail")}
                  className="w-full flex items-center justify-between py-3.5 sm:py-4 text-left transition hover:opacity-90 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-5 w-5 shrink-0 flex items-center justify-center">
                      <Image
                        src="/icons/gmail.svg"
                        alt="Gmail Icon"
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    </div>
                    <span
                      className="text-xs sm:text-[13.5px] font-semibold text-[#022977] group-hover:text-[#245FD4] transition-colors"
                      style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      How to add to Gmail.
                    </span>
                  </div>

                  <svg
                    className={`h-4 w-4 shrink-0 text-[#245FD4] transition-transform duration-200 ${
                      openSection === "gmail" ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {openSection === "gmail" && (
                  <div
                    id="accordion-panel-gmail"
                    role="region"
                    aria-labelledby="accordion-tab-gmail"
                    className="pb-4 pt-1 animate-in fade-in duration-150"
                  >
                    <ol
                      className="list-decimal pl-5 space-y-1.5 text-xs sm:text-[12.5px] text-[#475569] leading-relaxed"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      <li>Click <strong>Copy Signature</strong> on this page (you just did).</li>
                      <li>In Gmail on the web, click the gear icon, then <strong>See all settings</strong>.</li>
                      <li>On the General tab, scroll to <strong>Signature</strong> and click <strong>Create new</strong>. Give it a name.</li>
                      <li>Click in the signature box and paste (<strong>Cmd + V</strong> on Mac, <strong>Ctrl + V</strong> on Windows).</li>
                      <li>Under <strong>Signature defaults</strong>, choose it for new emails and replies.</li>
                      <li>Scroll down and click <strong>Save Changes</strong>.</li>
                    </ol>
                  </div>
                )}
              </div>

              {/* Row 2: Outlook */}
              <div className="border-b border-[#C1C1C1]/40">
                <button
                  type="button"
                  id="accordion-tab-outlook"
                  aria-expanded={openSection === "outlook"}
                  aria-controls="accordion-panel-outlook"
                  onClick={() => toggleSection("outlook")}
                  className="w-full flex items-center justify-between py-3.5 sm:py-4 text-left transition hover:opacity-90 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-5 w-5 shrink-0 flex items-center justify-center">
                      <Image
                        src="/icons/outlook.svg"
                        alt="Outlook Icon"
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    </div>
                    <span
                      className="text-xs sm:text-[13.5px] font-semibold text-[#022977] group-hover:text-[#245FD4] transition-colors"
                      style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      How to add to Outlook.
                    </span>
                  </div>

                  <svg
                    className={`h-4 w-4 shrink-0 text-[#245FD4] transition-transform duration-200 ${
                      openSection === "outlook" ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {openSection === "outlook" && (
                  <div
                    id="accordion-panel-outlook"
                    role="region"
                    aria-labelledby="accordion-tab-outlook"
                    className="pb-4 pt-1 animate-in fade-in duration-150"
                  >
                    <div
                      className="space-y-2.5 text-xs sm:text-[12.5px] text-[#475569] leading-relaxed"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      <p>
                        <strong className="text-[#1E293B]">New Outlook and Outlook on the web:</strong> click the gear icon, then <em>Accounts</em>, then <em>Signatures</em> (in older web version: <em>Mail</em>, then <em>Compose and reply</em>). Click <strong>New signature</strong>, paste, set it as default, and save.
                      </p>
                      <p>
                        <strong className="text-[#1E293B]">Outlook for Windows (classic):</strong> <em>File</em>, <em>Options</em>, <em>Mail</em>, <em>Signatures</em>, <strong>New</strong>. Name it, paste into the editor, and click <strong>OK</strong>.
                      </p>
                      <p>
                        <strong className="text-[#1E293B]">Outlook for Mac:</strong> the <em>Outlook</em> menu, <em>Settings</em>, <em>Signatures</em>, click the <strong>+</strong> button, then paste.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Row 3: App Mail (Apple Mail) */}
              <div className="border-b border-[#C1C1C1]/40">
                <button
                  type="button"
                  id="accordion-tab-apple"
                  aria-expanded={openSection === "apple"}
                  aria-controls="accordion-panel-apple"
                  onClick={() => toggleSection("apple")}
                  className="w-full flex items-center justify-between py-3.5 sm:py-4 text-left transition hover:opacity-90 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-5 w-5 shrink-0 flex items-center justify-center">
                      <Image
                        src="/icons/apple.svg"
                        alt="Apple Mail Icon"
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    </div>
                    <span
                      className="text-xs sm:text-[13.5px] font-semibold text-[#022977] group-hover:text-[#245FD4] transition-colors"
                      style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      How to add to App Mail.
                    </span>
                  </div>

                  <svg
                    className={`h-4 w-4 shrink-0 text-[#245FD4] transition-transform duration-200 ${
                      openSection === "apple" ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {openSection === "apple" && (
                  <div
                    id="accordion-panel-apple"
                    role="region"
                    aria-labelledby="accordion-tab-apple"
                    className="pb-4 pt-1 animate-in fade-in duration-150"
                  >
                    <ol
                      className="list-decimal pl-5 space-y-1.5 text-xs sm:text-[12.5px] text-[#475569] leading-relaxed"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      <li>Open Mail, then the <strong>Mail</strong> menu, then <strong>Settings</strong>, then <strong>Signatures</strong>.</li>
                      <li>Select your email account on the left and click <strong>+</strong>.</li>
                      <li>Paste into the box on the right.</li>
                      <li>Untick <em>&ldquo;Always match my default message font&rdquo;</em>. If it stays ticked, Apple Mail removes the formatting.</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>

            {/* Note below accordion */}
            <p
              className="mt-3 text-[11px] sm:text-[11.5px] text-[#94A3B8] leading-relaxed"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Tip: send a test email to yourself to check how it looks. Mobile email apps may not show the formatted signature.
            </p>
          </div>
        </div>

        {/* Centered Action Button matching Figma screenshot */}
        <div className="mt-6 sm:mt-8 flex justify-center w-full">
          <button
            type="button"
            onClick={handleBackToDashboard}
            className="inline-flex h-[42px] items-center justify-center rounded-xl bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-8 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:opacity-95 active:scale-95"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            <span>Back to the Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
