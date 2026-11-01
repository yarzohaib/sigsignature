"use client";

import { useEffect, useState, useMemo, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import TemplateGalleryCard from "@/components/templates/TemplateGalleryCard";
import TemplateEditor from "@/components/templates/TemplateEditor";
import { AVAILABLE_TEMPLATES } from "@/lib/templatesData";
import { TemplateItem, TemplateSignatureData } from "@/types/template";
import { getSignatureRepository } from "@/lib/signatures/repository";
import { getEditHref } from "@/lib/signatures/kind";
import { getStoredSettings, getStoredUser } from "@/app/lib/auth";
import TemplatesGallerySkeleton from "@/components/skeletons/TemplatesGallerySkeleton";
import PreviewSignatureModal from "@/components/studio/PreviewSignatureModal";
import LimitOverwriteModal from "@/components/signatures/LimitOverwriteModal";
import { generateTemplateHtml } from "@/lib/templates/renderTemplateHtml";
import { isSignatureLimitReached } from "@/lib/signatures/lifetimeTracker";
import { TemplatesPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/StructuredData";
import type { SavedSignature } from "@/types/signature";

const CATEGORIES = ["All", "Minimal", "Corporate", "Creative", "Bold"] as const;
type CategoryTab = (typeof CATEGORIES)[number];

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "alphabetical", label: "Alphabetical (A-Z)" },
  { value: "rated", label: "Highest Rated" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

function TemplatesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isNew = searchParams.get("new") === "true";
  const templateParam = searchParams.get("template");
  const modeParam = searchParams.get("mode");
  const isTeamMode = modeParam === "team";

  // Category filtering & sorting state
  const [selectedCategory, setSelectedCategory] = useState<CategoryTab>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSort, setCurrentSort] = useState<SortValue>("popular");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Active template being customized (null = gallery view)
  const [editingTemplate, setEditingTemplate] = useState<TemplateItem | null>(null);
  const [editingSignatureData, setEditingSignatureData] = useState<TemplateSignatureData | undefined>(undefined);
  const [editingSignatureId, setEditingSignatureId] = useState<string | undefined>(undefined);
  const [templateNotFound, setTemplateNotFound] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(Boolean(editId));

  // Preview modal state
  const [previewingTemplate, setPreviewingTemplate] = useState<TemplateItem | null>(null);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

  // Reactive edit query param handler
  useEffect(() => {
    let isCancelled = false;

    async function loadSignatureForEditing() {
      if (!editId) {
        setTemplateNotFound(false);
        setIsLoadingEdit(Boolean(isNew));
        if (isNew && !isCancelled) {
          if (!isTeamMode && isSignatureLimitReached()) {
            setIsLimitModalOpen(true);
            setIsLoadingEdit(false);
            return;
          }
          const settings = getStoredSettings();
          const targetId = settings?.defaultTemplateId || "photo-pop";
          let savedDefault: SavedSignature | null = null;
          if (!AVAILABLE_TEMPLATES.some((template) => template.id === targetId)) {
            try {
              savedDefault = await getSignatureRepository().get(targetId);
            } catch {
              // Fall back to Photo Pop if the saved default is unavailable.
            }
          }
          if (isCancelled) return;

          if (savedDefault?.kind === "template") {
            const sourceTemplate = AVAILABLE_TEMPLATES.find(
              (template) => template.id === savedDefault.templateId
            );
            const fallbackTemplate = AVAILABLE_TEMPLATES.find(
              (template) => template.id === "photo-pop"
            ) || AVAILABLE_TEMPLATES[0];
            setEditingSignatureId(undefined);
            setEditingSignatureData(savedDefault.data as TemplateSignatureData);
            setEditingTemplate(sourceTemplate || fallbackTemplate);
            setIsLoadingEdit(false);
            return;
          }

          if (savedDefault?.kind === "studio") {
            router.replace(`/design-studio?duplicate=${encodeURIComponent(savedDefault.id)}`);
            return;
          }

          const tpl = AVAILABLE_TEMPLATES.find((t) => t.id === targetId) ||
            AVAILABLE_TEMPLATES.find((t) => t.id === "photo-pop") ||
            AVAILABLE_TEMPLATES[0];
          setEditingSignatureId(undefined);
          setEditingSignatureData(undefined);
          setEditingTemplate(tpl);
          setIsLoadingEdit(false);
          return;
        }

        if (templateParam && !isCancelled) {
          const matched = AVAILABLE_TEMPLATES.find((t) => t.id === templateParam);
          if (matched) {
            setEditingSignatureId(undefined);
            setEditingSignatureData(undefined);
            setEditingTemplate(matched);
            setIsLoadingEdit(false);
            return;
          }
        }
        return;
      }

      try {
        setIsLoadingEdit(true);
        const repo = getSignatureRepository();
        const stored = await repo.get(editId);
        if (!stored) {
          if (!isCancelled) setTemplateNotFound(true);
          return;
        }

        if (stored.kind !== "template") {
          router.replace(getEditHref(stored));
          return;
        }

        if (!isCancelled) {
          const tpl = AVAILABLE_TEMPLATES.find((t) => t.id === stored.templateId);
          if (!tpl) {
            setTemplateNotFound(true);
            return;
          }
          setEditingSignatureId(stored.id);
          setEditingSignatureData(stored.data as TemplateSignatureData);
          setEditingTemplate(tpl);
        }
      } catch (err) {
        console.error("Failed to load signature for edit:", err);
        if (!isCancelled) setTemplateNotFound(true);
      } finally {
        if (!isCancelled) setIsLoadingEdit(false);
      }
    }

    loadSignatureForEditing();

    return () => {
      isCancelled = true;
    };
  }, [editId, isNew, templateParam, router]);

  // Click outside to dismiss sorting menu
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSortDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Filter templates by category and name, then sort
  const filteredTemplates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let list = AVAILABLE_TEMPLATES.filter((tpl) => {
      const matchesCategory = selectedCategory === "All" || tpl.category === selectedCategory;
      const matchesName = !query || tpl.name.toLowerCase().includes(query);
      return matchesCategory && matchesName;
    });

    if (currentSort === "alphabetical") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSort === "newest") {
      list = [...list].reverse();
    } else if (currentSort === "rated") {
      list = [...list].sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    } else {
      // "popular": popular first, then natural order
      list = [...list].sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }

    return list;
  }, [selectedCategory, searchQuery, currentSort]);

  const handleSelectTemplate = (template: TemplateItem) => {
    const user = getStoredUser();
    if (!user) {
      router.push(`/signup?redirect=/templates&template=${encodeURIComponent(template.id)}`);
      return;
    }
    if (!isTeamMode && isSignatureLimitReached()) {
      setIsLimitModalOpen(true);
      return;
    }
    setEditingSignatureId(undefined);
    setEditingSignatureData(undefined);
    setEditingTemplate(template);
  };

  if (isLoadingEdit) {
    return (
      <div className="px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-10 2xl:px-12 w-full">
        <TemplatesGallerySkeleton />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-10 2xl:px-12 w-full">
      <TemplatesPageJsonLd templates={AVAILABLE_TEMPLATES} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.sigsignature.com" },
          { name: "Templates", url: "https://www.sigsignature.com/templates" },
        ]}
      />
      <main className="flex flex-col gap-6 sm:gap-7 w-full">
        {/* If template not found, show friendly message */}
        {templateNotFound ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white p-12 text-center shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 mb-4">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2
              className="text-lg font-bold text-[#1E293B] mb-1"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Template not found
            </h2>
            <p
              className="text-sm text-[#64748B] max-w-md mb-6"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              The template associated with this signature could not be found or may have been updated.
            </p>
            <button
              type="button"
              onClick={() => router.push("/signatures")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#022977] to-[#245FD4] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:opacity-95 transition"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Back to My Signatures
            </button>
          </div>
        ) : editingTemplate ? (
          <TemplateEditor
            key={editingSignatureId || editingTemplate.id}
            template={editingTemplate}
            initialData={editingSignatureData}
            editingSignatureId={editingSignatureId}
            onBack={() => {
              setEditingTemplate(null);
              setEditingSignatureData(undefined);
              setEditingSignatureId(undefined);
              router.replace("/templates");
            }}
          />
        ) : (
          <div>
            {/* Gallery Header Row matching Figma: vertically center 'Build From Scratch' relative to Title & Subtitle block */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1
                  className="page-heading text-[#1E293B]"
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

              {/* Build From Scratch Link matching Figma */}
              <Link
                href="/design-studio"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition shrink-0"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                <svg className="h-4 w-4 text-[#245FD4] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                <span>Build From Scratch</span>
              </Link>
            </div>

            {/* Category Filter & Sorting Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-4 mb-8">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition shrink-0 cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-[#245FD4] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                    }`}
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Right: Search Bar and Sorting Dropdown */}
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-[clamp(16rem,22vw,28rem)]">
                  <svg
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search templates by name"
                    aria-label="Search templates by name"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs outline-none transition focus:border-[#245FD4] focus:ring-2 focus:ring-[#245FD4]/15"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear template search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 transition hover:text-slate-700"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="relative shrink-0" ref={sortDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setSortDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    aria-expanded={sortDropdownOpen}
                    aria-haspopup="true"
                    aria-label="Sort templates"
                  >
                    <span>{SORT_OPTIONS.find((s) => s.value === currentSort)?.label || "Most Popular"}</span>
                    <svg
                      className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                        sortDropdownOpen ? "rotate-180 text-[#245FD4]" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {sortDropdownOpen && (
                    <div className="absolute right-0 mt-1.5 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-20 animate-in fade-in zoom-in-95">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setCurrentSort(opt.value);
                            setSortDropdownOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs sm:text-sm transition cursor-pointer text-left ${
                            currentSort === opt.value
                              ? "bg-blue-50/80 font-bold text-[#245FD4]"
                              : "text-slate-700 hover:bg-slate-100 font-medium"
                          }`}
                          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                        >
                          <span>{opt.label}</span>
                          {currentSort === opt.value && (
                            <svg className="h-4 w-4 text-[#245FD4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Template Cards Grid: 3 columns up to 80% zoom (1850px), 4 columns below 80% */}
            {filteredTemplates.length > 0 ? (
              <div className="grid w-full grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 col4:grid-cols-4">
                {filteredTemplates.map((template) => (
                  <TemplateGalleryCard
                    key={template.id}
                    template={template}
                    onUseTemplate={handleSelectTemplate}
                    onPreview={setPreviewingTemplate}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-2xs">
                <h2
                  className="text-lg font-semibold text-[#1E293B]"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  No templates found
                </h2>
                <p
                  className="mt-1 text-sm text-[#64748B]"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  Try another name or clear your filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="mt-4 text-sm font-semibold text-[#245FD4] transition hover:text-[#1243A3] hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Bottom "Can't find what you're looking for?" Banner matching Figma */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#245FD4]">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
                <div>
                  <h3
                    className="text-base sm:text-lg font-bold text-[#1E293B]"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    Can&apos;t find what you&apos;re looking for?
                  </h3>
                  <p
                    className="mt-0.5 text-xs sm:text-sm text-[#64748B]"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    Build your own unique signature exactly the way you want.
                  </p>
                </div>
              </div>

              <Link
                href="/design-studio"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#245FD4] to-[#022977] px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-xs hover:opacity-95 transition shrink-0"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                <span>Build From Scratch</span>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>

            {/* Signature Preview Modal */}
            {previewingTemplate && (
              <PreviewSignatureModal
                isOpen={Boolean(previewingTemplate)}
                onClose={() => setPreviewingTemplate(null)}
                html={generateTemplateHtml(previewingTemplate.defaultData, { preview: true })}
                showCanvasTab={false}
              />
            )}

            {/* Signature Limit Modal */}
            <LimitOverwriteModal
              isOpen={isLimitModalOpen}
              onClose={() => setIsLimitModalOpen(false)}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-10 2xl:px-12 w-full">
          <TemplatesGallerySkeleton />
        </div>
      }
    >
      <TemplatesContent />
    </Suspense>
  );
}
