"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchUserSessions,
  revokeUserSession,
  revokeOtherUserSessions,
  UserSession,
  getFriendlySecurityErrorMessage,
} from "@/app/lib/api";
import ChangePasswordModal from "./ChangePasswordModal";

interface SecurityCardProps {
  hasPassword: boolean;
  providers: string[];
  onShowToast: (message: string, isError?: boolean) => void;
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently active";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Active just now";
    if (diffMinutes < 60) return `Active ${diffMinutes}m ago`;
    if (diffHours < 24) return `Active ${diffHours}h ago`;
    if (diffDays < 7) return `Active ${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "Recently active";
  }
}

function formatProviderName(provider: string): string {
  if (!provider) return "Social Provider";
  const lower = provider.toLowerCase();
  if (lower === "google") return "Google";
  if (lower === "github") return "GitHub";
  if (lower === "apple") return "Apple";
  return provider.charAt(0).toUpperCase() + provider.slice(1);
}

export default function SecurityCard({
  hasPassword,
  providers,
  onShowToast,
}: SecurityCardProps) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isRevokingOthers, setIsRevokingOthers] = useState(false);
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);
  const [isOtherSessionsExpanded, setIsOtherSessionsExpanded] = useState(false);
  const [showRevokeOthersConfirm, setShowRevokeOthersConfirm] = useState(false);

  // Refresh active sessions
  const refreshSessions = useCallback(async () => {
    setIsLoadingSessions(true);
    try {
      const list = await fetchUserSessions();
      setSessions(list);
    } catch (err: unknown) {
      console.warn("Could not load sessions:", err);
    } finally {
      setIsLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;
    fetchUserSessions()
      .then((list) => {
        if (!isCancelled) {
          setSessions(list);
          setIsLoadingSessions(false);
        }
      })
      .catch((err: unknown) => {
        console.warn("Could not load sessions:", err);
        if (!isCancelled) {
          setIsLoadingSessions(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const currentSession = sessions.find((s) => s.isCurrent) || sessions[0];
  const otherSessions = sessions.filter((s) => s.id !== currentSession?.id && !s.revokedAt);

  const handlePasswordChanged = (msg: string) => {
    onShowToast(msg);
    refreshSessions();
  };

  // Revoke single session
  const handleRevokeSingle = async (sessionId: string) => {
    setRevokingSessionId(sessionId);
    try {
      await revokeUserSession(sessionId);
      onShowToast("Session signed out successfully");
      await refreshSessions();
    } catch (err: unknown) {
      const msg = getFriendlySecurityErrorMessage(err);
      onShowToast(msg, true);
    } finally {
      setRevokingSessionId(null);
    }
  };

  // Revoke all other sessions
  const handleRevokeOthersConfirm = async () => {
    setIsRevokingOthers(true);
    setShowRevokeOthersConfirm(false);
    try {
      const res = await revokeOtherUserSessions();
      const count = res.count;
      onShowToast(
        count > 0
          ? `Signed out of ${count} other session${count === 1 ? "" : "s"}.`
          : "All other sessions were already signed out."
      );
      await refreshSessions();
    } catch (err: unknown) {
      const msg = getFriendlySecurityErrorMessage(err);
      onShowToast(msg, true);
    } finally {
      setIsRevokingOthers(false);
    }
  };

  const primaryProvider =
    providers.length > 0 ? formatProviderName(providers[0]) : "Google";

  return (
    <>
      <div className="rounded-2xl border border-[#E1E6EF] bg-white p-6 shadow-xs">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#F1F5F9]">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#245FD4]">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h2
                className="text-[18px] font-semibold text-[#172238] leading-tight"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Security
              </h2>
              <p
                className="mt-0.5 text-[13px] text-[#6B7280]"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                Keep your account protected.
              </p>
            </div>
          </div>
        </div>

        {/* Password Row */}
        <div className="flex items-center justify-between py-3.5 border-b border-[#F1F5F9]">
          <span
            className="text-xs sm:text-sm font-medium text-[#1E293B]"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            Password
          </span>
          {hasPassword ? (
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="text-xs font-semibold text-[#245FD4] hover:underline cursor-pointer"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Change
            </button>
          ) : (
            <span
              className="text-xs text-[#6B7280]"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              You sign in with {primaryProvider}
            </span>
          )}
        </div>

        {/* Two-step verification Row */}
        <div className="flex items-center justify-between py-3.5 border-b border-[#F1F5F9]">
          <div>
            <div className="flex items-center gap-2">
              <h4
                className="text-xs sm:text-sm font-medium text-[#1E293B]"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Two-step verification
              </h4>
              <span
                className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 border border-slate-200"
                title="Two-factor authentication will be available in a future update."
              >
                Coming soon
              </span>
            </div>
            <p
              className="mt-0.5 text-[11px] text-[#6B7280]"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              Add an extra layer of security.
            </p>
          </div>

          {/* Disabled toggle switch */}
          <div
            role="switch"
            aria-checked={false}
            title="Two-factor authentication will be available in a future update."
            className="relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent bg-slate-200 opacity-60 cursor-not-allowed"
          >
            <span className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 translate-x-0" />
          </div>
        </div>

        {/* Current session device */}
        <div className="pt-3.5">
          {isLoadingSessions && !currentSession ? (
            <div className="flex items-center gap-2 py-2 text-xs text-slate-400">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
              <span>Loading session details...</span>
            </div>
          ) : (
            <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <svg className="h-4 w-4 shrink-0 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  <span
                    className="truncate text-xs font-medium text-[#1E293B]"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    {currentSession?.device || "Chrome · macOS"}
                  </span>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                  Current session
                </span>
              </div>
              {currentSession?.ipAddress && (
                <p className="mt-1 pl-6 text-[11px] text-slate-400">
                  IP: {currentSession.ipAddress}
                </p>
              )}
            </div>
          )}

          {/* Other sessions count & expandable list */}
          {otherSessions.length > 0 && (
            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setIsOtherSessionsExpanded(!isOtherSessionsExpanded)}
                className="flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 transition py-1"
                style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
              >
                <span>
                  {otherSessions.length} other active session{otherSessions.length === 1 ? "" : "s"}
                </span>
                <svg
                  className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                    isOtherSessionsExpanded ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isOtherSessionsExpanded && (
                <div className="flex flex-col gap-2 pt-1">
                  {otherSessions.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 p-2 text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="truncate font-medium text-[#1E293B]">{s.device}</p>
                        <p className="text-[11px] text-slate-400">
                          {formatRelativeTime(s.lastUsedAt)}
                          {s.ipAddress ? ` · ${s.ipAddress}` : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRevokeSingle(s.id)}
                        disabled={revokingSessionId === s.id}
                        className="shrink-0 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition"
                      >
                        {revokingSessionId === s.id ? "Signing out..." : "Sign out"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Revoke other sessions button & confirmation dialog */}
          {otherSessions.length > 0 && (
            <div className="mt-3">
              {showRevokeOthersConfirm ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900">
                  <p className="font-semibold">Sign out all other sessions?</p>
                  <p className="mt-0.5 text-[11px] text-amber-800">
                    This will log out all other devices and require them to sign in again.
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRevokeOthersConfirm}
                      disabled={isRevokingOthers}
                      className="rounded-lg bg-red-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition"
                    >
                      {isRevokingOthers ? "Signing out..." : "Yes, sign out all"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRevokeOthersConfirm(false)}
                      disabled={isRevokingOthers}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowRevokeOthersConfirm(true)}
                  disabled={isRevokingOthers}
                  className="text-xs font-semibold text-[#245FD4] hover:underline disabled:opacity-50 transition"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  {isRevokingOthers ? "Signing out..." : "Sign out other sessions"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onSuccess={handlePasswordChanged}
        />
      )}
    </>
  );
}
