"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import TeamSignaturesHeader from "@/components/team/TeamSignaturesHeader";
import EmptyTeamState from "@/components/team/EmptyTeamState";
import TeamTemplateBar from "@/components/team/TeamTemplateBar";
import TeamMemberCard from "@/components/team/TeamMemberCard";
import AddMemberCard from "@/components/team/AddMemberCard";
import ChooseSignatureModal from "@/components/team/ChooseSignatureModal";
import MemberModal from "@/components/team/MemberModal";
import SendConfirmModal from "@/components/team/SendConfirmModal";
import DeleteTeamModal from "@/components/team/DeleteTeamModal";
import DeleteMemberModal from "@/components/team/DeleteMemberModal";
import RevokeInviteModal from "@/components/team/RevokeInviteModal";
import DevInviteModal from "@/components/team/DevInviteModal";
import SignatureCopiedAlert from "@/components/signatures/SignatureCopiedAlert";
import {
  UserProfile,
  getCurrentUser,
  logoutUser,
  getTeam,
  deleteTeam,
  removeTeamMember,
  revokeTeamMember,
} from "@/app/lib/api";
import {
  clearAuthSession,
  getStoredRefreshToken,
  getStoredUser,
} from "@/app/lib/auth";
import type { Team, TeamMember } from "@/types/team";
import { parseBackendTeam } from "@/types/team";
import { renderTeamMemberHtml, renderTeamMemberPlainText } from "@/lib/team/render";
import { copySignatureRich } from "@/lib/clipboard";

export default function TeamSignaturesPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Team state
  const [team, setTeam] = useState<Team | null>(null);
  const [toastInfo, setToastInfo] = useState<{
    message: string;
    action?: { label: string; href: string };
  } | null>(null);
  const [showCopiedAlert, setShowCopiedAlert] = useState(false);

  // Modals state
  const [isChooseModalOpen, setIsChooseModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [sendingMember, setSendingMember] = useState<TeamMember | null>(null);
  const [revokingMember, setRevokingMember] = useState<TeamMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);
  const [isDeleteTeamModalOpen, setIsDeleteTeamModalOpen] = useState(false);
  const [isDeletingTeam, setIsDeletingTeam] = useState(false);
  const [isDeletingMember, setIsDeletingMember] = useState(false);
  const [isRevokingMember, setIsRevokingMember] = useState(false);
  const [devInviteInfo, setDevInviteInfo] = useState<{ url: string; email: string } | null>(null);

  const showToast = useCallback((msg: string, action?: { label: string; href: string }) => {
    setToastInfo({ message: msg, action });
    setTimeout(() => {
      setToastInfo(null);
    }, 5000);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("unlinked") === "true") {
        const url = new URL(window.location.href);
        url.searchParams.delete("unlinked");
        window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
        const timer = setTimeout(() => {
          showToast("Name or Email is not linked to your signature design.", {
            label: "Open Studio",
            href: "/design-studio",
          });
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [showToast]);

  const loadTeamData = useCallback(async () => {
    try {
      setLoadError(null);
      const backendTeam = await getTeam();
      if (backendTeam) {
        setTeam(parseBackendTeam(backendTeam));
      } else {
        setTeam(null);
      }
    } catch (err: unknown) {
      console.error("Failed to load team data:", err);
      const msg = err instanceof Error ? err.message : "Failed to load team signatures.";
      setLoadError(msg);
    }
  }, []);

  useEffect(() => {
    async function verifyAuth() {
      const cachedUser = getStoredUser();
      if (cachedUser) {
        setUser(cachedUser);
      }

      try {
        const freshUser = await getCurrentUser();
        setUser(freshUser);
      } catch (err) {
        console.warn("Session expired or invalid, redirecting to login:", err);
        clearAuthSession();
        router.replace("/login?redirect=/team-signatures");
        return;
      }

      try {
        await loadTeamData();
      } finally {
        setIsLoading(false);
      }
    }

    verifyAuth();
  }, [router, loadTeamData]);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      const refreshToken = getStoredRefreshToken();
      await logoutUser(refreshToken || undefined);
    } finally {
      clearAuthSession();
      router.replace("/login");
      router.refresh();
    }
  }

  function handleNewSignatureClick() {
    if (!team) {
      setIsChooseModalOpen(true);
    } else {
      setEditingMember(null);
      setIsMemberModalOpen(true);
    }
  }

  async function handleCopyMember(member: TeamMember) {
    if (!team) return;
    try {
      const html = renderTeamMemberHtml(team, member);
      const plainText = renderTeamMemberPlainText(team, member);
      await copySignatureRich(html, plainText);
      setShowCopiedAlert(true);
    } catch {
      showToast(`Failed to copy "${member.name}" signature.`);
    }
  }

  async function handleConfirmDeleteTeam() {
    if (!team) return;
    setIsDeletingTeam(true);
    try {
      await deleteTeam();
      showToast("Team signature deleted.");
      setIsDeleteTeamModalOpen(false);
      await loadTeamData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete team signature.";
      showToast(msg);
    } finally {
      setIsDeletingTeam(false);
    }
  }

  async function handleConfirmDeleteMember() {
    if (!deletingMember) return;
    setIsDeletingMember(true);
    try {
      await removeTeamMember(deletingMember.id);
      showToast(`Removed "${deletingMember.name}" from team signatures.`);
      setDeletingMember(null);
      await loadTeamData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to remove team member.";
      showToast(msg);
    } finally {
      setIsDeletingMember(false);
    }
  }

  async function handleConfirmRevokeMember() {
    if (!revokingMember) return;
    setIsRevokingMember(true);
    try {
      await revokeTeamMember(revokingMember.id);
      showToast(`Invite revoked for "${revokingMember.name}".`);
      setRevokingMember(null);
      await loadTeamData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to revoke invite.";
      showToast(msg);
    } finally {
      setIsRevokingMember(false);
    }
  }

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : "Member";

  const memberCount = team ? team.members.length : 0;
  const memberLimit = team ? team.memberLimit : 3;
  const isLimitReached = memberCount >= memberLimit;

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#245FD4] border-t-transparent" />
          <p
            className="text-base font-bold text-[#1E293B]"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Loading team signatures...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Toast Notification */}
      {toastInfo && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl animate-fade-in max-w-md">
          {toastInfo.action ? (
            <svg className="h-4 w-4 text-[#449AFA] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          <span className="flex-1">{toastInfo.message}</span>
          {toastInfo.action && (
            <Link
              href={toastInfo.action.href}
              className="ml-1 inline-flex items-center rounded-lg bg-[#245FD4] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#1E4FB0] transition shrink-0"
            >
              {toastInfo.action.label}
            </Link>
          )}
        </div>
      )}

      {/* Signature Copied Alert Banner */}
      <SignatureCopiedAlert
        isOpen={showCopiedAlert}
        onClose={() => setShowCopiedAlert(false)}
        className="fixed bottom-6 right-6 z-50 w-full max-w-[420px] shadow-2xl animate-in slide-in-from-bottom-5 duration-200"
      />

      {/* Sidebar Navigation */}
      <DashboardSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardTopBar
          userName={displayName}
          userEmail={user?.email}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:px-10 2xl:px-12 w-full">
          {/* Header */}
          <TeamSignaturesHeader
            memberCount={memberCount}
            memberLimit={memberLimit}
            onNewSignature={handleNewSignatureClick}
            isLimitReached={Boolean(team && isLimitReached)}
          />

          {loadError && (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 flex items-center justify-between">
              <span>{loadError}</span>
              <button
                type="button"
                onClick={() => loadTeamData()}
                className="font-semibold underline hover:text-rose-900 ml-3"
              >
                Retry
              </button>
            </div>
          )}

          {/* Conditional View: Empty State vs Filled Member Grid */}
          {!team ? (
            <EmptyTeamState onCreateSignature={() => setIsChooseModalOpen(true)} />
          ) : (
            <div>
              {/* Template summary bar */}
              <TeamTemplateBar
                team={team}
                onDeleteTeam={() => setIsDeleteTeamModalOpen(true)}
              />

              {/* Grid: 3 cols on xl, 4-5 cols on 2xl/3xl, 2 cols on md, 1 col on mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-5 2xl:gap-6">
                {team.members.map((member) => (
                  <TeamMemberCard
                    key={member.id}
                    team={team}
                    member={member}
                    onEdit={(m) => {
                      setEditingMember(m);
                      setIsMemberModalOpen(true);
                    }}
                    onCopy={handleCopyMember}
                    onSend={(m) => setSendingMember(m)}
                    onRevoke={(m) => setRevokingMember(m)}
                    onDelete={(m) => setDeletingMember(m)}
                  />
                ))}

                {/* Trailing Dashed New Signature Card */}
                <AddMemberCard
                  memberCount={memberCount}
                  memberLimit={memberLimit}
                  onAddMember={() => {
                    setEditingMember(null);
                    setIsMemberModalOpen(true);
                  }}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Choose Signature Modal */}
      <ChooseSignatureModal
        isOpen={isChooseModalOpen}
        onClose={() => setIsChooseModalOpen(false)}
        onTeamCreated={loadTeamData}
        showToast={showToast}
      />

      {/* Add / Edit Member Modal */}
      {team && isMemberModalOpen && (
        <MemberModal
          key={editingMember?.id || "new-member"}
          isOpen={isMemberModalOpen}
          onClose={() => {
            setIsMemberModalOpen(false);
            setEditingMember(null);
          }}
          team={team}
          member={editingMember}
          onSuccess={loadTeamData}
          showToast={showToast}
        />
      )}

      {/* Send Confirmation Modal */}
      {sendingMember && (
        <SendConfirmModal
          key={sendingMember.id}
          isOpen={Boolean(sendingMember)}
          onClose={() => setSendingMember(null)}
          member={sendingMember}
          onSuccess={loadTeamData}
          showToast={showToast}
          onDevInviteGenerated={(url, email) => setDevInviteInfo({ url, email })}
        />
      )}

      {/* Dev Invite Modal */}
      {devInviteInfo && (
        <DevInviteModal
          isOpen={Boolean(devInviteInfo)}
          onClose={() => setDevInviteInfo(null)}
          devInviteUrl={devInviteInfo.url}
          memberEmail={devInviteInfo.email}
        />
      )}

      {/* Delete Team Modal */}
      <DeleteTeamModal
        isOpen={isDeleteTeamModalOpen}
        onClose={() => setIsDeleteTeamModalOpen(false)}
        team={team}
        onConfirm={handleConfirmDeleteTeam}
        isDeleting={isDeletingTeam}
      />

      {/* Delete Member Modal */}
      <DeleteMemberModal
        isOpen={Boolean(deletingMember)}
        onClose={() => setDeletingMember(null)}
        member={deletingMember}
        onConfirm={handleConfirmDeleteMember}
        isDeleting={isDeletingMember}
      />

      {/* Revoke Invite Modal */}
      <RevokeInviteModal
        isOpen={Boolean(revokingMember)}
        onClose={() => setRevokingMember(null)}
        member={revokingMember}
        onConfirm={handleConfirmRevokeMember}
        isRevoking={isRevokingMember}
      />
    </div>
  );
}
