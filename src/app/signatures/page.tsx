"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import SignaturesHeader from "@/components/signatures/SignaturesHeader";
import SignatureCard, { SignatureItem } from "@/components/signatures/SignatureCard";
import DeleteSignatureModal from "@/components/signatures/DeleteSignatureModal";
import EmptySignaturesState from "@/components/signatures/EmptySignaturesState";
import { UserProfile, getCurrentUser, logoutUser } from "@/app/lib/api";
import {
  clearAuthSession,
  getStoredRefreshToken,
  getStoredUser,
} from "@/app/lib/auth";

export default function MySignaturesPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Signatures state: empty by default so "No signatures yet" screen displays
  const [signatures, setSignatures] = useState<SignatureItem[]>([]);
  const [deletingSignature, setDeletingSignature] = useState<SignatureItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
        router.replace("/login?redirect=/signatures");
        return;
      } finally {
        setIsLoading(false);
      }
    }

    verifyAuth();
  }, [router]);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }

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

  function handleStartDelete(signature: SignatureItem) {
    setDeletingSignature(signature);
  }

  function handleConfirmDelete() {
    if (!deletingSignature) return;
    const deletedName = deletingSignature.name;
    setSignatures((prev) => prev.filter((s) => s.id !== deletingSignature.id));
    setDeletingSignature(null);
    showToast(`"${deletedName}" was deleted.`);
  }

  function handleDuplicate(id: string) {
    const target = signatures.find((s) => s.id === id);
    if (!target) return;
    const duplicated: SignatureItem = {
      ...target,
      id: `sig-${Date.now()}`,
      name: `${target.name} (Copy)`,
      updatedAt: "Updated just now",
    };
    setSignatures((prev) => [duplicated, ...prev]);
    showToast(`Duplicated "${target.name}".`);
  }

  function handleExport(id: string) {
    const target = signatures.find((s) => s.id === id);
    showToast(`Exported "${target?.name || "signature"}" HTML code.`);
  }

  function handleEdit(id: string) {
    const target = signatures.find((s) => s.id === id);
    showToast(`Opening editor for "${target?.name || "signature"}".`);
  }

  function handleCreateNew() {
    const templates = [
      {
        name: "Sophia Clark",
        role: "HR Manager",
        email: user?.email || "sophia@company.com",
        phone: "+1 (555) 222-3344",
        company: "Company",
        tagline: "Tagline goes here",
        templateType: "sophia" as const,
        avatarUrl: "/sophia-clark.png",
      },
      {
        name: "John Doe",
        role: "Marketing Manager",
        email: user?.email || "john@company.com",
        phone: "+1 (555) 987-6543",
        company: "Company",
        tagline: "Tagline goes here",
        address: "123 Business Ave, New York, NY 10001",
        website: "www.company.com",
        templateType: "john" as const,
        avatarUrl: "/john-doe.png",
      },
      {
        name: "Support Team",
        role: "Customer Support",
        email: user?.email || "support@company.com",
        phone: "+1 (555) 654-3210",
        company: "Company",
        tagline: "Tagline goes here",
        templateType: "support" as const,
      },
    ];

    const template = templates[signatures.length % templates.length];
    const newSig: SignatureItem = {
      ...template,
      id: `sig-${Date.now()}`,
      updatedAt: "Updated just now",
    };
    setSignatures((prev) => [...prev, newSig]);
    showToast(`Created signature "${newSig.name}".`);
  }

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : "Member";

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#245FD4] border-t-transparent" />
          <p
            className="text-base font-bold text-[#1E293B]"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            Loading your signatures...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* 256px Fixed Sidebar */}
      <DashboardSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navigation Bar with Search and Profile */}
        <DashboardTopBar
          userName={displayName}
          userEmail={user?.email}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />

        {/* My Signatures Body Canvas */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-10 2xl:px-12">
          <main className="mx-auto flex flex-col gap-6 sm:gap-7 w-full max-w-[1240px] xl:max-w-[1360px] 2xl:max-w-[1440px]">
            {/* Page Header with Title and Create New Signature Button */}
            <SignaturesHeader onCreateClick={handleCreateNew} />

            {/* Content: 3 per row on large screens OR Empty State */}
            {signatures.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 2xl:gap-6">
                {signatures.map((signature) => (
                  <SignatureCard
                    key={signature.id}
                    signature={signature}
                    onEdit={handleEdit}
                    onDuplicate={handleDuplicate}
                    onExport={handleExport}
                    onDelete={handleStartDelete}
                  />
                ))}
              </div>
            ) : (
              <EmptySignaturesState onCreateClick={handleCreateNew} />
            )}
          </main>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteSignatureModal
        isOpen={deletingSignature !== null}
        signatureName={deletingSignature?.name || ""}
        onClose={() => setDeletingSignature(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#1E293B] px-4 py-3 text-sm text-white shadow-xl animate-in slide-in-from-bottom-5 duration-200">
          <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
