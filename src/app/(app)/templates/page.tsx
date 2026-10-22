"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import TemplateGalleryCard from "@/components/templates/TemplateGalleryCard";
import TemplateEditor from "@/components/templates/TemplateEditor";
import { AVAILABLE_TEMPLATES } from "@/lib/templatesData";
import { TemplateItem, TemplateSignatureData } from "@/types/template";
import { getSignatureRepository } from "@/lib/signatures/repository";
import { getEditHref } from "@/lib/signatures/kind";
import { getStoredSettings } from "@/app/lib/auth";
import TemplatesGallerySkeleton from "@/components/skeletons/TemplatesGallerySkeleton";

const CATEGORIES = ["All", "Minimal", "Corporate", "Creative", "Bold"] as const;
type CategoryTab = (typeof CATEGORIES)[number];

function TemplatesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isNew = searchParams.get("new") === "true";

  // Category sorting & filtering state
  const [selectedCategory, setSelectedCategory] = useState<CategoryTab>("All");
  const [sortOption, setSortOption] = useState("popular");

  // Active template being customized (null = gallery view)
  const [editingTemplate, setEditingTemplate] = useState<TemplateItem | null>(null);
  const [editingSignatureData, setEditingSignatureData] = useState<TemplateSignatureData | undefined>(undefined);
  const [editingSignatureId, setEditingSignatureId] = useState<string | undefined>(undefined);
  const [templateNotFound, setTemplateNotFound] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(Boolean(editId));

  // Reactive edit query param handler
  useEffect(() => {
    let isCancelled = false;

    async function loadSignatureForEditing() {
      if (!editId) {
        setTemplateNotFound(false);
        setIsLoadingEdit(false);
        if (isNew && !isCancelled) {
          const settings = getStoredSettings();
          const targetId = settings?.defaultTemplateId || "professional-minimal";
          const tpl = AVAILABLE_TEMPLATES.find((t) => t.id === targetId) || AVAILABLE_TEMPLATES[0];
          setEditingSignatureId(undefined);
          setEditingSignatureData(undefined);
          setEditingTemplate(tpl);
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
  }, [editId, isNew, router]);

  // Filter and sort templates by category and sortOption
  const filteredTemplates = useMemo(() => {
    let list = AVAILABLE_TEMPLATES.filter((tpl) => {
      if (selectedCategory === "All") return true;
      return tpl.category === selectedCategory;
    });

    if (sortOption === "popular") {
      list = [...list].sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    } else if (sortOption === "newest") {
      list = [...list].reverse();
    } else if (sortOption === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [selectedCategory, sortOption]);

  const handleSelectTemplate = (template: TemplateItem) => {
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
            {/* Gallery Header Row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
              <div>
                <h1
                  className="text-[28px] sm:text-[34px] font-bold text-[#1E293B] tracking-tight leading-tight"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Template Gallery
                </h1>
                <p
                  className="mt-1 text-[14px] sm:text-[15px] text-[#64748B]"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  Choose a professionally designed layout, customize your info, and export ready-to-use HTML.
                </p>
              </div>

              {/* Design from scratch Link */}
              <Link
                href="/design-studio"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition shrink-0"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                <span>Create From Scratch</span>
                <svg className="h-4 w-4 text-[#245FD4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            {/* Filter & Sort Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-4 mb-8">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition shrink-0 cursor-pointer ${
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

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="text-xs text-slate-500"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  Sort by:
                </span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-xs focus:border-[#245FD4] focus:outline-none"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>
            </div>

            {/* Template Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateGalleryCard
                  key={template.id}
                  template={template}
                  onUseTemplate={handleSelectTemplate}
                />
              ))}
            </div>
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
