"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  fetchPublicInvite,
  acceptPublicInvite,
  PublicInviteError,
  type PublicInviteData,
} from "@/lib/team/publicInvite";
import { renderTeamMemberHtml, renderTeamMemberPlainText } from "@/lib/team/render";
import { copySignatureRich, copyTextToClipboard } from "@/lib/clipboard";
import SignaturePreviewFrame from "@/components/studio/SignaturePreviewFrame";
import type { Team, TeamMember, TeamData } from "@/types/team";

type PageState =
  | "loading"
  | "ready"
  | "not_found"
  | "revoked"
  | "expired"
  | "network_error";

type EmailClientTab = "gmail" | "outlook" | "apple";

export default function PublicInvitePage() {
  const params = useParams();
  const tokenParam = params?.token;
  const token = typeof tokenParam === "string" ? tokenParam : "";

  const [state, setState] = useState<PageState>(() =>
    !token ? "not_found" : "loading"
  );
  const [inviteData, setInviteData] = useState<PublicInviteData | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);

  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedPlainText, setCopiedPlainText] = useState(false);
  const [activeTab, setActiveTab] = useState<EmailClientTab>("gmail");

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    fetchPublicInvite(token)
      .then((data) => {
        if (!isMounted) return;
        setInviteData(data);
        const isAlreadyAccepted =
          data.status === "accepted" || data.member?.status === "accepted";
        setIsAccepted(isAlreadyAccepted);
        setState("ready");
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        if (err instanceof PublicInviteError) {
          if (err.code === "INVITE_NOT_FOUND") {
            setState("not_found");
          } else if (err.code === "INVITE_REVOKED") {
            setState("revoked");
          } else if (err.code === "INVITE_EXPIRED") {
            setState("expired");
          } else if (err.code === "NETWORK_ERROR") {
            setState("network_error");
          } else {
            setState("not_found");
          }
        } else {
          setState("network_error");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleRetry = useCallback(async () => {
    if (!token) {
      setState("not_found");
      return;
    }

    setState("loading");
    setAcceptError(null);

    try {
      const data = await fetchPublicInvite(token);
      setInviteData(data);
      const isAlreadyAccepted =
        data.status === "accepted" || data.member?.status === "accepted";
      setIsAccepted(isAlreadyAccepted);
      setState("ready");
    } catch (err: unknown) {
      if (err instanceof PublicInviteError) {
        if (err.code === "INVITE_NOT_FOUND") {
          setState("not_found");
        } else if (err.code === "INVITE_REVOKED") {
          setState("revoked");
        } else if (err.code === "INVITE_EXPIRED") {
          setState("expired");
        } else if (err.code === "NETWORK_ERROR") {
          setState("network_error");
        } else {
          setState("not_found");
        }
      } else {
        setState("network_error");
      }
    }
  }, [token]);

  const maskedEmail = useMemo(() => {
    return inviteData?.member?.maskedEmail || inviteData?.maskedEmail || "";
  }, [inviteData]);

  const teamName = useMemo(() => {
    return inviteData?.team?.name || "Your team";
  }, [inviteData]);

  // Construct synthetic Team and TeamMember for rendering
  const { syntheticTeam, syntheticMember } = useMemo(() => {
    if (!inviteData) {
      return { syntheticTeam: null, syntheticMember: null };
    }

    const t: Team = {
      id: "team-public",
      name: inviteData.team.name,
      kind: inviteData.team.kind,
      templateId: inviteData.team.templateId,
      templateVersion: inviteData.team.templateVersion,
      data: inviteData.team.data as TeamData,
      memberLimit: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      members: [],
    };

    const m: TeamMember = {
      id: "member-public",
      name: inviteData.member.name,
      email: maskedEmail,
      jobTitle: inviteData.member.jobTitle || "",
      phone: inviteData.member.phone || "",
      photoUrl: inviteData.member.photoUrl || "",
      socials: inviteData.member.socials || [],
      status: (inviteData.member.status || "sent") as TeamMember["status"],
      sentAt: null,
      acceptedAt: null,
      tokenExpiresAt: inviteData.expiresAt,
      sendCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return { syntheticTeam: t, syntheticMember: m };
  }, [inviteData, maskedEmail]);

  // Render HTML and plain text
  const previewHtml = useMemo(() => {
    if (!syntheticTeam || !syntheticMember) return "";
    return renderTeamMemberHtml(syntheticTeam, syntheticMember, { preview: true });
  }, [syntheticTeam, syntheticMember]);

  const fullHtml = useMemo(() => {
    if (!syntheticTeam || !syntheticMember) return "";
    return renderTeamMemberHtml(syntheticTeam, syntheticMember, { preview: false });
  }, [syntheticTeam, syntheticMember]);

  const plainText = useMemo(() => {
    if (!syntheticTeam || !syntheticMember) return "";
    return renderTeamMemberPlainText(syntheticTeam, syntheticMember);
  }, [syntheticTeam, syntheticMember]);

  // Copy Handlers
  async function handleCopySignature() {
    if (!fullHtml) return;
    try {
      await copySignatureRich(fullHtml, plainText);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2500);
    } catch {
      // Fallback
    }
  }

  async function handleCopyPlainText() {
    if (!plainText) return;
    try {
      await copyTextToClipboard(plainText);
      setCopiedPlainText(true);
      setTimeout(() => setCopiedPlainText(false), 2500);
    } catch {
      // Fallback
    }
  }

  // Accept Handler
  async function handleAccept() {
    if (!token || isAccepted || isAccepting) return;
    setIsAccepting(true);
    setAcceptError(null);

    try {
      await acceptPublicInvite(token);
      setIsAccepted(true);
    } catch (err: unknown) {
      if (err instanceof PublicInviteError) {
        if (err.code === "INVITE_EXPIRED") {
          setState("expired");
        } else if (err.code === "INVITE_REVOKED") {
          setState("revoked");
        } else if (err.code === "INVITE_NOT_FOUND") {
          setState("not_found");
        } else {
          setAcceptError("Unable to confirm right now. Please try again.");
        }
      } else {
        setAcceptError("Unable to confirm right now. Please try again.");
      }
    } finally {
      setIsAccepting(false);
    }
  }

  // Instruction steps renderer (4 short numbered steps per tab)
  function renderStepContent(tab: EmailClientTab, stepIdx: number): React.ReactNode {
    switch (tab) {
      case "gmail":
        switch (stepIdx) {
          case 0:
            return (
              <span>
                Open Gmail, click the gear icon (<strong>Settings</strong>) in the top-right, and choose <strong>See all settings</strong>.
              </span>
            );
          case 1:
            return (
              <span>
                Under the <strong>General</strong> tab, scroll down to the <strong>Signature</strong> section and click <strong>Create new</strong>.
              </span>
            );
          case 2:
            return (
              <span>
                Name your signature, click inside the text box, and <strong>paste</strong> (<kbd className="rounded bg-slate-100 px-1 py-0.5 text-xs text-slate-700">Cmd+V</kbd> or <kbd className="rounded bg-slate-100 px-1 py-0.5 text-xs text-slate-700">Ctrl+V</kbd>).
              </span>
            );
          case 3:
            return (
              <span>
                Scroll to the bottom of the page and click <strong>Save changes</strong>.
              </span>
            );
          default:
            return null;
        }
      case "outlook":
        switch (stepIdx) {
          case 0:
            return (
              <span>
                Open Outlook and click the gear icon (<strong>Settings</strong>) in the top-right.
              </span>
            );
          case 1:
            return (
              <span>
                Navigate to <strong>Accounts</strong> &gt; <strong>Signatures</strong>.
              </span>
            );
          case 2:
            return (
              <span>
                Click <strong>New signature</strong>, enter a name, click inside the editor box, and <strong>paste</strong> (<kbd className="rounded bg-slate-100 px-1 py-0.5 text-xs text-slate-700">Cmd+V</kbd> or <kbd className="rounded bg-slate-100 px-1 py-0.5 text-xs text-slate-700">Ctrl+V</kbd>).
              </span>
            );
          case 3:
            return (
              <span>
                Select your signature for new messages and replies, then click <strong>Save</strong>.
              </span>
            );
          default:
            return null;
        }
      case "apple":
        switch (stepIdx) {
          case 0:
            return (
              <span>
                Open Mail on your Mac and choose <strong>Mail</strong> &gt; <strong>Settings</strong> (or <strong>Preferences</strong>) from the top menu.
              </span>
            );
          case 1:
            return (
              <span>
                Click the <strong>Signatures</strong> tab and choose the account you want to use it with.
              </span>
            );
          case 2:
            return (
              <span>
                Click <strong>+</strong> to add a signature, and uncheck <strong>&quot;Always match my default message font&quot;</strong>.
              </span>
            );
          case 3:
            return (
              <span>
                Click inside the preview area, delete any placeholder text, and <strong>paste</strong> (<kbd className="rounded bg-slate-100 px-1 py-0.5 text-xs text-slate-700">Cmd+V</kbd>).
              </span>
            );
          default:
            return null;
        }
    }
  }

  const stepIndices = [0, 1, 2, 3];

  // Header Component
  const HeaderLogo = (
    <header className="flex items-center justify-center pt-8 pb-6 sm:pb-8">
      <Link href="/" className="inline-flex items-center gap-2.5 group">
        <Image
          src="/logo.svg"
          alt="Sig Signature logo"
          width={36}
          height={36}
          className="h-8 w-auto transition-transform group-hover:scale-105"
          priority
        />
        <span
          className="font-bold text-lg text-[#0B1A3D]"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Sig Signature
        </span>
      </Link>
    </header>
  );

  // 1. Loading Skeleton State
  if (state === "loading") {
    return (
      <div className="min-h-screen pb-16">
        {HeaderLogo}
        <main className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xs p-6 sm:p-10 animate-pulse">
            <div className="text-center space-y-3 mb-8">
              <div className="h-7 w-3/4 bg-slate-200 rounded-lg mx-auto" />
              <div className="h-4 w-1/2 bg-slate-100 rounded-md mx-auto" />
            </div>

            <div className="w-full aspect-[16/9] rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] border border-[#E2E8F0] p-4 flex items-center justify-center">
              <div className="w-full max-w-sm h-36 bg-slate-200/60 rounded-xl" />
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="h-11 w-full sm:w-40 bg-slate-200 rounded-xl" />
              <div className="h-11 w-full sm:w-40 bg-slate-100 rounded-xl" />
            </div>

            <div className="mt-8 pt-8 border-t border-[#F1F5F9] space-y-3">
              <div className="h-5 w-32 bg-slate-200 rounded" />
              <div className="h-8 w-64 bg-slate-100 rounded" />
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full bg-slate-100 rounded" />
                <div className="h-4 w-5/6 bg-slate-100 rounded" />
                <div className="h-4 w-4/6 bg-slate-100 rounded" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 2. Error States (not_found, revoked, expired, network_error)
  if (state !== "ready") {
    let iconColor = "text-slate-400 bg-slate-100";
    let title = "This link is not valid";
    let message =
      "We couldn't find a signature invite matching this link. Please check that you copied the complete URL from your email.";
    let showRetry = false;

    if (state === "not_found") {
      title = "This link is not valid";
      message =
        "We couldn't find a signature invite matching this link. Please check that you copied the complete URL from your email.";
      iconColor = "text-rose-600 bg-rose-50 border border-rose-100";
    } else if (state === "revoked") {
      title = "This link was cancelled by the sender";
      message =
        "This invite link was revoked or cancelled by the team sender. Please ask your administrator for a new invite.";
      iconColor = "text-amber-600 bg-amber-50 border border-amber-100";
    } else if (state === "expired") {
      title = "This link has expired";
      message = "This link has expired. Ask the sender to send a new one.";
      iconColor = "text-amber-600 bg-amber-50 border border-amber-100";
    } else if (state === "network_error") {
      title = "Unable to connect";
      message =
        "We had trouble connecting to the server. Please check your internet connection and try again.";
      iconColor = "text-blue-600 bg-blue-50 border border-blue-100";
      showRetry = true;
    }

    return (
      <div className="min-h-screen pb-16 flex flex-col justify-between">
        {HeaderLogo}
        <main className="max-w-md mx-auto px-4 w-full my-auto">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 text-center">
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl mb-4 ${iconColor}`}
            >
              {state === "not_found" && (
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {state === "revoked" && (
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {state === "expired" && (
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {state === "network_error" && (
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 1l22 22" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16.72 11.06A10.94 10.94 0 0119 12.55" strokeLinecap="round" />
                  <path d="M5 12.55a10.94 10.94 0 015.17-2.39" strokeLinecap="round" />
                  <path d="M10.71 5.05A16 16 0 0122.56 9" strokeLinecap="round" />
                  <path d="M1.42 9a15.91 15.91 0 014.7-2.88" strokeLinecap="round" />
                  <path d="M8.53 16.11a6 6 0 016.95 0" strokeLinecap="round" />
                  <line x1="12" y1="20" x2="12.01" y2="20" strokeLinecap="round" strokeWidth="3" />
                </svg>
              )}
            </div>

            <h1
              className="text-lg sm:text-xl font-bold text-[#0B1A3D]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {title}
            </h1>
            <p
              className="mt-2 text-xs sm:text-sm text-[#64748B] leading-relaxed"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              {message}
            </p>

            {showRetry && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="rounded-xl bg-[#245FD4] hover:bg-[#1D4ED8] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition cursor-pointer shadow-xs"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </main>
        <footer className="text-center text-xs text-[#94A3B8] pb-6">
          &copy; {new Date().getFullYear()} Sig Signature. All rights reserved.
        </footer>
      </div>
    );
  }

  // 3. Ready State
  return (
    <div className="min-h-screen pb-16 flex flex-col justify-between">
      {HeaderLogo}

      <main className="max-w-2xl mx-auto px-4 w-full">
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-5 sm:p-8">
          {/* Heading and subtext */}
          <div className="text-center mb-6">
            <h1
              className="text-2xl sm:text-3xl font-bold text-[#0B1A3D] tracking-tight"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Your new email signature is ready
            </h1>
            <p
              className="mt-2 text-xs sm:text-sm text-[#64748B]"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              <span className="font-semibold text-[#0B1A3D]">{teamName}</span> set this up for you ({maskedEmail})
            </p>
          </div>

          {/* Signature Preview Panel */}
          <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] border border-[#E2E8F0] p-3 sm:p-5 flex items-center justify-center overflow-hidden shadow-2xs">
            <div className="w-full bg-white rounded-xl shadow-xs border border-[#EBF0F7] p-2 overflow-hidden">
              <SignaturePreviewFrame html={previewHtml} />
            </div>
          </div>

          {/* Copy Signature Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleCopySignature}
              className={`w-full sm:w-auto min-w-[170px] inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-xs transition cursor-pointer ${
                copiedHtml
                  ? "bg-[#059669] hover:bg-[#047857]"
                  : "bg-[#245FD4] hover:bg-[#1D4ED8]"
              }`}
            >
              {copiedHtml ? (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Signature copied!</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copy signature</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyPlainText}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-5 py-3 text-xs sm:text-sm font-medium text-[#1E293B] hover:bg-slate-50 transition cursor-pointer shadow-2xs"
            >
              {copiedPlainText ? (
                <>
                  <svg className="h-4 w-4 text-[#059669]" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Copied plain text!</span>
                </>
              ) : (
                <span>Copy as plain text</span>
              )}
            </button>
          </div>

          {/* "How to add it" Section with Tabs */}
          <div className="mt-8 pt-8 border-t border-[#F1F5F9]">
            <h2
              className="text-base sm:text-lg font-bold text-[#0B1A3D] mb-4 text-center sm:text-left"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              How to add it
            </h2>

            {/* Tab navigation */}
            <div className="flex border-b border-[#E2E8F0] gap-4 sm:gap-8">
              <button
                type="button"
                onClick={() => setActiveTab("gmail")}
                className={`pb-2.5 text-xs sm:text-sm transition cursor-pointer border-b-2 -mb-px ${
                  activeTab === "gmail"
                    ? "border-[#245FD4] text-[#245FD4] font-semibold"
                    : "border-transparent text-[#64748B] hover:text-[#0B1A3D] font-medium"
                }`}
              >
                Gmail
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("outlook")}
                className={`pb-2.5 text-xs sm:text-sm transition cursor-pointer border-b-2 -mb-px ${
                  activeTab === "outlook"
                    ? "border-[#245FD4] text-[#245FD4] font-semibold"
                    : "border-transparent text-[#64748B] hover:text-[#0B1A3D] font-medium"
                }`}
              >
                Outlook
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("apple")}
                className={`pb-2.5 text-xs sm:text-sm transition cursor-pointer border-b-2 -mb-px ${
                  activeTab === "apple"
                    ? "border-[#245FD4] text-[#245FD4] font-semibold"
                    : "border-transparent text-[#64748B] hover:text-[#0B1A3D] font-medium"
                }`}
              >
                Apple Mail
              </button>
            </div>

            {/* 4 numbered steps for active tab */}
            <ol className="mt-5 space-y-3">
              {stepIndices.map((idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#245FD4] font-bold text-[11px] mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                    {renderStepContent(activeTab, idx)}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Accept Section */}
          <div className="mt-8 pt-6 border-t border-[#F1F5F9] flex flex-col items-center">
            {acceptError && (
              <div className="w-full mb-3 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 text-center">
                {acceptError}
              </div>
            )}

            {isAccepted ? (
              <div className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] p-4 text-[#065F46] shadow-2xs">
                <svg className="h-5 w-5 text-[#059669] shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs sm:text-sm font-semibold">
                  All set. {teamName} has been notified.
                </span>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={isAccepting}
                  className="w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2 rounded-xl bg-[#059669] hover:bg-[#047857] px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAccepting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Confirming...</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>I have added it</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-[#94A3B8] text-center">
                  Let your team admin know you have installed your signature.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-[#94A3B8] pt-8">
        &copy; {new Date().getFullYear()} Sig Signature. All rights reserved.
      </footer>
    </div>
  );
}
