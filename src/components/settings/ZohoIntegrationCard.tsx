"use client";

import { useCallback, useEffect, useState } from "react";
import {
  disconnectZoho,
  fetchZohoStatus,
  getZohoErrorMessage,
  startZohoConnect,
  type GmailStatus,
} from "@/app/lib/api";

interface ZohoIntegrationCardProps {
  onShowToast: (message: string, isError?: boolean) => void;
}

const FONT = { fontFamily: "var(--font-commissioner), Commissioner, sans-serif" };

const REASON_MESSAGES: Record<string, string> = {
  denied: "Zoho Mail connection was cancelled.",
  no_refresh_token: "Zoho did not return long term access. Please try connecting again.",
  no_mailbox: "No Zoho Mail mailbox was found on that account.",
  invalid_state: "That connection link expired. Please try again.",
  not_configured: "Zoho Mail integration is not available yet.",
  zoho_error: "Zoho could not complete the connection. Please try again.",
};

function formatDate(value: string | null): string {
  if (!value) return "Not pushed yet";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "Not pushed yet";
  return `Last updated ${d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

export default function ZohoIntegrationCard({ onShowToast }: ZohoIntegrationCardProps) {
  const [status, setStatus] = useState<GmailStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);

  const load = useCallback(async () => {
    try {
      setStatus(await fetchZohoStatus());
    } catch {
      setStatus(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchZohoStatus()
      .then((result) => {
        if (!cancelled) setStatus(result);
      })
      .catch(() => {
        if (!cancelled) setStatus(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Result of the Google redirect: /settings?integration=gmail&status=...&reason=...
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("integration") !== "zoho") return;

    const result = params.get("status");
    const reason = params.get("reason") || "";
    if (result === "connected") onShowToast("Zoho Mail connected.");
    else if (result === "cancelled") onShowToast("Zoho Mail connection was cancelled.", true);
    else onShowToast(REASON_MESSAGES[reason] || "Could not connect Zoho Mail. Please try again.", true);

    params.delete("integration");
    params.delete("status");
    params.delete("reason");
    const qs = params.toString();
    window.history.replaceState({}, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnect = async () => {
    setIsBusy(true);
    try {
      const url = await startZohoConnect();
      window.location.assign(url);
    } catch (err) {
      onShowToast(getZohoErrorMessage(err), true);
      setIsBusy(false);
    }
  };

  const handleDisconnect = async () => {
    setIsBusy(true);
    try {
      await disconnectZoho();
      setConfirmDisconnect(false);
      onShowToast("Zoho Mail disconnected.");
      await load();
    } catch (err) {
      onShowToast(getZohoErrorMessage(err), true);
    } finally {
      setIsBusy(false);
    }
  };

  const connected = Boolean(status?.connected && status.connection);
  const unavailable = !isLoading && status !== null && !status.configured;

  return (
    <div className="rounded-2xl border border-[#E1E6EF] bg-white p-6 shadow-xs">
      <div className="flex items-start gap-3 pb-4 border-b border-[#F1F5F9]">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#EA580C]">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-10 6L2 7" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#1E293B]" style={FONT}>Zoho Mail</h3>
          <p className="mt-0.5 text-xs text-[#64748B]" style={FONT}>
            Update your Zoho Mail signature straight from Sig Signature.
          </p>
        </div>
      </div>

      <div className="pt-4">
        {isLoading ? (
          <div className="h-9 w-full animate-pulse rounded-xl bg-slate-100" />
        ) : unavailable ? (
          <p className="text-xs text-[#64748B]" style={FONT}>Zoho Mail integration is not available yet.</p>
        ) : connected && status?.connection ? (
          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5">
              <p className="text-xs font-semibold text-[#1E293B] break-all" style={FONT}>
                {status.connection.accountEmail}
              </p>
              <p className="mt-0.5 text-[11px] text-[#64748B]" style={FONT}>
                {formatDate(status.connection.lastPushedAt)}
              </p>
            </div>
            <p className="text-[11px] text-[#64748B]" style={FONT}>
              Open My Signatures and choose Push to Zoho Mail from the menu on any signature.
            </p>
            {confirmDisconnect ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDisconnect}
                  disabled={isBusy}
                  className="rounded-xl bg-[#DC2626] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#B91C1C] disabled:opacity-60 cursor-pointer"
                  style={FONT}
                >
                  {isBusy ? "Disconnecting..." : "Yes, disconnect"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDisconnect(false)}
                  disabled={isBusy}
                  className="rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-xs font-semibold text-[#475569] transition hover:bg-slate-50 cursor-pointer"
                  style={FONT}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDisconnect(true)}
                className="self-start text-xs font-semibold text-[#DC2626] transition hover:text-[#B91C1C] cursor-pointer"
                style={FONT}
              >
                Disconnect Zoho Mail
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-[11px] text-[#64748B]" style={FONT}>
              We only ask to read your account address and manage your signatures. We never read your emails.
            </p>
            <button
              type="button"
              onClick={handleConnect}
              disabled={isBusy}
              className="self-start rounded-xl bg-[#245FD4] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1E4FB0] disabled:opacity-60 cursor-pointer"
              style={FONT}
            >
              {isBusy ? "Opening Zoho..." : "Connect Zoho Mail"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
