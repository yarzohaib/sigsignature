"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import TemplateGalleryCard from "@/components/templates/TemplateGalleryCard";
import TemplateEditor from "@/components/templates/TemplateEditor";
import { AVAILABLE_TEMPLATES } from "@/lib/templatesData";
import { TemplateItem, TemplateSignatureData } from "@/types/template";
import { UserProfile, getCurrentUser, logoutUser } from "@/app/lib/api";
import {
  clearAuthSession,
  getStoredRefreshToken,
  getStoredUser,
} from "@/app/lib/auth";
import {
  getStoredSignatureById,
  getStoredSignatures,
  deleteStoredSignature,
  duplicateStoredSignature,
} from "@/lib/signatureStorage";
import SignatureCard, { SignatureItem } from "@/components/signatures/SignatureCard";
import { generateSignatureHtml } from "@/lib/generateSignatureHtml";

const CATEGORIES = ["All", "My Saved", "Minimal", "Corporate", "Creative", "Bold"] as const;
type CategoryTab = (typeof CATEGORIES)[number];

export default function TemplatesPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Category sorting & filtering state
  const [selectedCategory, setSelectedCategory] = useState<CategoryTab>("All");
  const [sortOption, setSortOption] = useState("popular");

  // Active template being customized (null = gallery view)
  const [editingTemplate, setEditingTemplate] = useState<TemplateItem | null>(null);
  const [editingSignatureData, setEditingSignatureData] = useState<TemplateSignatureData | undefined>(undefined);
  const [editingSignatureId, setEditingSignatureId] = useState<string | undefined>(undefined);
  const [savedSignatures, setSavedSignatures] = useState<SignatureItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }

  useEffect(() => {
    function syncSaved() {
      setSavedSignatures(getStoredSignatures());
    }

    if (typeof window !== "undefined") {
      window.addEventListener("sig_storage_updated", syncSaved);
      window.addEventListener("storage", syncSaved);
    }

    async function verifyAuth() {
      // Check if an existing signature is requested for editing via ?edit=id
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const editId = params.get("edit");
        if (editId) {
          const stored = getStoredSignatureById(editId);
          if (stored) {
            setEditingSignatureId(stored.id);
            const tpl = AVAILABLE_TEMPLATES.find((t) => t.id === stored.templateId) || AVAILABLE_TEMPLATES[0];
            setEditingTemplate(tpl);
            if (stored.rawTemplateData) {
              setEditingSignatureData(stored.rawTemplateData);
            } else {
              setEditingSignatureData({
                fullName: stored.name,
                jobTitle: stored.role,
                companyName: stored.company,
                email: stored.email,
                phone: stored.phone,
                website: stored.website || "",
                avatarUrl: stored.avatarUrl || tpl.defaultData.avatarUrl,
                themeColor: stored.themeColor || tpl.defaultData.themeColor,
                fontFamily: stored.fontFamily || "Inter",
                layout: "two-column",
                socialIconsStyle: "filled",
                socials: {
                  linkedin: "https://linkedin.com",
                  twitter: "https://twitter.com",
                  facebook: "https://facebook.com",
                },
                optional: {
                  address: stored.address,
                  tagline: stored.tagline,
                },
              });
            }
          }
        }
      }

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
        router.replace("/login?redirect=/templates");
        return;
      } finally {
        setSavedSignatures(getStoredSignatures());
        setIsLoading(false);
      }
    }

    verifyAuth();

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("sig_storage_updated", syncSaved);
        window.removeEventListener("storage", syncSaved);
      }
    };
  }, [router]);

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

  // Filter templates by category
  const filteredTemplates = AVAILABLE_TEMPLATES.filter((tpl) => {
    if (selectedCategory === "All") return true;
    if (selectedCategory === "My Saved") return false;
    return tpl.category === selectedCategory;
  });

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
            Loading templates...
          </p>
        </div>
      </main>
    );
  }

  function handleEditSavedSignature(id: string) {
    const target = savedSignatures.find((s) => s.id === id);
    if (!target) return;
    setEditingSignatureId(target.id);
    const tpl = AVAILABLE_TEMPLATES.find((t) => t.id === target.templateId) || AVAILABLE_TEMPLATES[0];
    setEditingTemplate(tpl);
    setEditingSignatureData(target.rawTemplateData);
  }

  function handleDuplicateSavedSignature(id: string) {
    const dup = duplicateStoredSignature(id);
    if (dup) {
      setSavedSignatures(getStoredSignatures());
      showToast(`Duplicated "${dup.name}".`);
    }
  }

  async function handleExportSavedSignature(id: string) {
    const target = savedSignatures.find((s) => s.id === id);
    if (!target) return;
    const html = target.rawTemplateData
      ? generateSignatureHtml(target.rawTemplateData)
      : generateSignatureHtml({
          fullName: target.name,
          jobTitle: target.role,
          companyName: target.company,
          email: target.email,
          phone: target.phone,
          website: target.website || "",
          avatarUrl: target.avatarUrl || "/daniel-wilson.png",
          themeColor: target.themeColor || "#245FD4",
          fontFamily: target.fontFamily || "Inter",
          layout: "two-column",
          socialIconsStyle: "filled",
          socials: { linkedin: "", twitter: "", facebook: "" },
          optional: { tagline: target.tagline, address: target.address },
        });
    try {
      await navigator.clipboard.writeText(html);
      showToast(`Copied "${target.name}" HTML code to clipboard!`);
    } catch {
      showToast(`Exported "${target.name}" HTML code.`);
    }
  }

  function handleDeleteSavedSignature(sig: SignatureItem) {
    deleteStoredSignature(sig.id);
    setSavedSignatures(getStoredSignatures());
    showToast(`"${sig.name}" was deleted.`);
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

        {/* Templates Body Canvas */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-10 2xl:px-12">
          <main className="mx-auto flex flex-col gap-6 sm:gap-7 w-full max-w-[1240px] xl:max-w-[1360px] 2xl:max-w-[1440px]">
            {/* If a template is currently being edited/customized, show the Editor */}
            {editingTemplate ? (
              <TemplateEditor
                template={editingTemplate}
                initialData={editingSignatureData}
                editingSignatureId={editingSignatureId}
                onBack={() => {
                  setEditingTemplate(null);
                  setEditingSignatureData(undefined);
                  setEditingSignatureId(undefined);
                  if (typeof window !== "undefined" && window.location.search) {
                    window.history.replaceState({}, "", "/templates");
                  }
                }}
              />
            ) : (
              /* Otherwise, show the Template Gallery View matching Figma */
              <>
                {/* Header Row: Choose a Template & Build From Scratch */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
                  <div>
                    <h1
                      className="text-[24px] sm:text-[28px] font-bold text-[#1E293B] leading-tight"
                      style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      Choose a Template.
                    </h1>
                    <p
                      className="mt-1 text-[14px] sm:text-[15px] text-[#64748B]"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      Pick a template to get started. You can customize everything.
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    className="inline-flex h-[40px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-xs font-semibold text-[#022977] shadow-xs transition hover:bg-slate-50 active:scale-95 shrink-0"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    <span>Build From Scratch</span>
                  </Link>
                </div>

                {/* Category Pills & Sorting Bar matching Figma */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {/* Category Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    {CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat;
                      const countBadge = cat === "My Saved" ? savedSignatures.length : null;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                            isSelected
                              ? "bg-[#245FD4] text-white shadow-xs"
                              : "border border-slate-200 bg-white text-[#64748B] hover:border-slate-300 hover:text-[#1E293B]"
                          }`}
                          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                        >
                          <span>{cat}</span>
                          {countBadge !== null && countBadge > 0 && (
                            <span
                              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                                isSelected ? "bg-white text-[#245FD4]" : "bg-blue-100 text-[#245FD4]"
                              }`}
                            >
                              {countBadge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Most Popular Dropdown */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#64748B] shadow-2xs hover:border-slate-300 focus:outline-none"
                        style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                      >
                        <option value="popular">Most Popular</option>
                        <option value="newest">Newest First</option>
                        <option value="name">Alphabetical</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Content Case 1: "My Saved" tab selected */}
                {selectedCategory === "My Saved" && (
                  <div>
                    {savedSignatures.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 2xl:gap-6">
                        {savedSignatures.map((signature) => (
                          <SignatureCard
                            key={signature.id}
                            signature={signature}
                            onEdit={handleEditSavedSignature}
                            onDuplicate={handleDuplicateSavedSignature}
                            onExport={handleExportSavedSignature}
                            onDelete={handleDeleteSavedSignature}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#245FD4]">
                          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-[#1E293B]">No saved signatures yet</p>
                        <p className="mt-1 text-xs text-[#64748B]">Choose a template below, customize it with your details, and click &ldquo;Save the Signature&rdquo;.</p>
                        <button
                          type="button"
                          onClick={() => setSelectedCategory("All")}
                          className="mt-4 rounded-lg bg-[#245FD4] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
                        >
                          Browse Available Templates
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Content Case 2: "All" tab - show Saved Signatures section at top if any exist */}
                {selectedCategory === "All" && savedSignatures.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h2
                          className="text-[16px] sm:text-[18px] font-bold text-[#1E293B]"
                          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                        >
                          Your Saved Signatures
                        </h2>
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-[#245FD4]">
                          {savedSignatures.length}
                        </span>
                      </div>
                      <Link
                        href="/signatures"
                        className="text-xs font-semibold text-[#245FD4] hover:underline"
                        style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                      >
                        Manage in My Signatures &rarr;
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 2xl:gap-6">
                      {savedSignatures.map((signature) => (
                        <SignatureCard
                          key={signature.id}
                          signature={signature}
                          onEdit={handleEditSavedSignature}
                          onDuplicate={handleDuplicateSavedSignature}
                          onExport={handleExportSavedSignature}
                          onDelete={handleDeleteSavedSignature}
                        />
                      ))}
                    </div>

                    <div className="my-2 border-t border-slate-200/80" />
                    <h2
                      className="text-[16px] sm:text-[18px] font-bold text-[#1E293B]"
                      style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      Available Templates
                    </h2>
                  </div>
                )}

                {/* Templates Grid matching 3 per line on large screen (for All, Minimal, Corporate, Creative, Bold) */}
                {selectedCategory !== "My Saved" && (
                  <>
                    {filteredTemplates.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 2xl:gap-6">
                        {filteredTemplates.map((template) => (
                          <TemplateGalleryCard
                            key={template.id}
                            template={template}
                            onUseTemplate={(t) => {
                              setEditingSignatureId(undefined);
                              setEditingSignatureData(undefined);
                              setEditingTemplate(t);
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
                        <p className="text-sm font-semibold text-[#1E293B]">
                          No templates in the &ldquo;{selectedCategory}&rdquo; category yet.
                        </p>
                        <p className="mt-1 text-xs text-[#64748B]">
                          More templates will be added to this category soon.
                        </p>
                        <button
                          type="button"
                          onClick={() => setSelectedCategory("All")}
                          className="mt-4 rounded-lg bg-[#EFF6FF] px-4 py-1.5 text-xs font-semibold text-[#245FD4] hover:bg-blue-100"
                        >
                          View All Templates
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* Bottom Banner matching Figma: "Can't find what you're looking for?" */}
                <div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#EEF0F4] bg-[#F8FAFC] p-5 sm:p-6 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[#245FD4]">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <div>
                      <h4
                        className="text-[15px] font-bold text-[#1E293B]"
                        style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                      >
                        Can&apos;t find what you&apos;re looking for?
                      </h4>
                      <p
                        className="text-[13px] text-[#64748B]"
                        style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                      >
                        Build your own unique signature exactly the way you want.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    className="flex h-[40px] items-center justify-center gap-2 rounded-xl bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-5 text-xs font-semibold text-white shadow-xs transition hover:opacity-95 active:scale-95 shrink-0"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    <span>Build From Scratch</span>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                </div>
              </>
            )}
          </main>
        </div>
      </div>

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
