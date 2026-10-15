"use client";

import { useEffect, useState, useReducer, useRef, useCallback, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import {
  UserProfile,
  getCurrentUser,
  logoutUser,
  isSignatureLimitError,
} from "@/app/lib/api";
import {
  clearAuthSession,
  getStoredRefreshToken,
  getStoredUser,
} from "@/app/lib/auth";
import { getSignatureRepository } from "@/lib/signatures/repository";
import { SavedSignature } from "@/types/signature";
import {
  TemplateSignatureData,
  ExtraTextItem,
  ExtraImageItem,
  ExtraDividerItem,
  ExtraCtaItem,
  ExtraBannerItem,
  SignatureExtraItem,
} from "@/types/template";
import { compressImageToBlob } from "@/lib/imageUtils";
import { uploadSignatureImage } from "@/lib/uploads";
import {
  generateSignatureHtml,
  resolveEmailFont,
} from "@/lib/generateSignatureHtml";
import { useIsPremium } from "@/lib/premium";
import {
  studioReducer,
  INITIAL_STUDIO_DATA,
  StudioShape,
  StudioSocialStyle,
  StudioTheme,
  StudioLayout,
  StudioButtonStyle,
  ALLOWED_STUDIO_FONTS,
} from "@/lib/studio/types";
import { STUDIO_SOLID_COLORS } from "@/lib/signatureConstants";
import PremiumLockedModal from "@/components/studio/PremiumLockedModal";
import SignaturePreviewFrame, {
  SignaturePreviewFrameHandle,
} from "@/components/studio/SignaturePreviewFrame";
import PreviewSignatureModal from "@/components/studio/PreviewSignatureModal";
import SaveSuccessModal from "@/components/signatures/SaveSuccessModal";
import LimitOverwriteModal from "@/components/signatures/LimitOverwriteModal";
import FloatingToolbar from "@/components/studio/FloatingToolbar";
import EditDetailsModal from "@/components/studio/EditDetailsModal";

export default function DesignStudioPage() {
  const router = useRouter();
  const isPremium = useIsPremium();

  // Auth & Session
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Responsive Segmented Control for < lg screens
  const [mobileTab, setMobileTab] = useState<"canvas" | "tools">("canvas");

  // Studio Store
  const [state, dispatch] = useReducer(studioReducer, INITIAL_STUDIO_DATA);

  // Canvas Zoom State
  const [zoom, setZoom] = useState(100);

  // Autosave Status
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");

  // Modals & Feedback
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save Signature Flow
  const [isSaving, setIsSaving] = useState(false);
  const [savedSignatureRecord, setSavedSignatureRecord] = useState<SavedSignature | null>(null);
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [allSignatures, setAllSignatures] = useState<SavedSignature[]>([]);

  // Canvas Selection & Details Popover
  const [selectedId, setSelectedId] = useState<"main" | string | null>(null);
  const [isEditDetailsOpen, setIsEditDetailsOpen] = useState(false);
  const [editDetailsSection, setEditDetailsSection] = useState<"all" | "socials">("all");
  const [autoOpenLinkId, setAutoOpenLinkId] = useState<string | null>(null);
  const activeNewIdRef = useRef<string | null>(null);

  // Drag-and-drop & Resizing State for Canvas Extras
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{ id: string; position: "before" | "after" } | null>(null);
  const [resizingInfo, setResizingInfo] = useState<{ id: string; width: number } | null>(null);

  // File Upload Refs
  const logoUploadInputRef = useRef<HTMLInputElement>(null);
  const imageUploadInputRef = useRef<HTMLInputElement>(null);
  const bannerUploadInputRef = useRef<HTMLInputElement>(null);

  // Canvas container & Preview Iframe Refs
  const canvasAreaRef = useRef<HTMLDivElement>(null);
  const previewFrameRef = useRef<SignaturePreviewFrameHandle>(null);

  // Collapsible Tool Sections (all open by default)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    fonts: true,
    colors: true,
    elements: true,
    shapes: true,
    socials: true,
    themes: true,
    layout: true,
    buttons: true,
  });

  function toggleSection(key: string) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // Toast Helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Keyboard Navigation: Escape clears selection, Delete removes selected extra
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        document.activeElement &&
        (document.activeElement.tagName === "INPUT" ||
          document.activeElement.tagName === "TEXTAREA" ||
          (document.activeElement as HTMLElement).isContentEditable)
      ) {
        return;
      }

      if (e.key === "Escape") {
        setSelectedId(null);
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedId && selectedId !== "main") {
          e.preventDefault();
          dispatch({ type: "REMOVE_EXTRA", payload: { id: selectedId } });
          setSelectedId("main");
          showToast("Element deleted");
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, showToast]);

  // Verify Auth on Load
  useEffect(() => {
    async function verifyAuth() {
      const cachedUser = getStoredUser();
      if (cachedUser) {
        setUser(cachedUser);
      }

      try {
        const freshUser = await getCurrentUser();
        setUser(freshUser);

        // Restore draft from localStorage if available
        const userId = freshUser.id;
        const draftKey = `sig_studio_draft_${userId}`;
        try {
          const savedDraft = localStorage.getItem(draftKey);
          if (savedDraft) {
            const parsed = JSON.parse(savedDraft);
            if (parsed && typeof parsed === "object") {
              // Clear legacy default Daniel Wilson template so users start with blank canvas
              if (parsed.fullName === "Daniel Wilson" && parsed.email === "daniel@company.com") {
                localStorage.removeItem(draftKey);
              } else {
                dispatch({ type: "SET_FULL_STATE", payload: parsed });
              }
            }
          }
        } catch {
          // ignore localStorage parsing errors
        }
      } catch (err) {
        console.warn("Session expired or invalid, redirecting to login:", err);
        clearAuthSession();
        router.replace("/login?redirect=/design-studio");
        return;
      } finally {
        setIsLoading(false);
      }
    }

    verifyAuth();
  }, [router]);

  // Debounced Autosave to localStorage (600ms)
  useEffect(() => {
    if (!user?.id) return;
    const userId = user.id;
    const draftKey = `sig_studio_draft_${userId}`;

    const savingTimer = setTimeout(() => {
      setSaveStatus("saving");
    }, 0);

    const timer = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify(state));
        setSaveStatus("saved");
      } catch {
        setSaveStatus("saved");
      }
    }, 600);

    return () => {
      clearTimeout(savingTimer);
      clearTimeout(timer);
    };
  }, [state, user?.id]);

  // Logout Handler
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

  // Generate Email HTML for live canvas preview (main card only inside iframe)
  const mainSignatureOnlyHtml = generateSignatureHtml(
    { ...state, extras: [] },
    { preview: true }
  );
  // Full signature HTML for modal preview and exports
  const fullSignatureHtml = generateSignatureHtml(state, { preview: true });

  // Helper to determine column placement (Left / Right / Full)
  function getItemColumn(item: SignatureExtraItem): "left" | "right" | "full" {
    if (item.column) return item.column;
    if (state.layout === "single") return "full";
    if (item.type === "image") return "left";
    if (item.type === "banner") return "full";
    if (item.type === "divider" && item.orientation !== "vertical") return "full";
    return "right";
  }

  // 1. Add Text
  function handleAddText() {
    if ((state.extras?.length || 0) >= 20) {
      showToast("You can add up to 20 elements");
      return;
    }
    const id = `txt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const column: "left" | "right" | "full" = state.layout === "single" ? "full" : "right";
    const newExtra: ExtraTextItem = {
      id,
      type: "text",
      text: "Your text here",
      align: "left",
      size: "md",
      bold: false,
      column,
    };
    activeNewIdRef.current = id;
    dispatch({ type: "ADD_EXTRA", payload: newExtra });
    setSelectedId(id);
    showToast("Text element added");
  }

  // 2. Add Image
  function handleAddImageClick() {
    if ((state.extras?.length || 0) >= 20) {
      showToast("You can add up to 20 elements");
      return;
    }
    imageUploadInputRef.current?.click();
  }

  async function handleImageFileSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showToast("Please upload a JPEG, PNG, or WebP image.");
      if (imageUploadInputRef.current) imageUploadInputRef.current.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast("Please upload an image smaller than 10MB.");
      if (imageUploadInputRef.current) imageUploadInputRef.current.value = "";
      return;
    }

    showToast("Uploading image...");
    try {
      const compressedBlob = await compressImageToBlob(file, 600, 0.85, "logo");
      const publicUrl = await uploadSignatureImage(compressedBlob, "logo");
      const isReplacing = state.extras?.some((item) => item.id === selectedId && item.type === "image");
      if (isReplacing && selectedId) {
        dispatch({
          type: "UPDATE_EXTRA",
          payload: { id: selectedId, item: { url: publicUrl } },
        });
        showToast("Image updated!");
      } else {
        const id = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const column: "left" | "right" | "full" = state.layout === "single" ? "full" : "left";
        const newExtra: ExtraImageItem = {
          id,
          type: "image",
          url: publicUrl,
          width: 80,
          align: "left",
          column,
        };
        dispatch({ type: "ADD_EXTRA", payload: newExtra });
        setSelectedId(id);
        showToast("Image element added!");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload image.";
      showToast(message);
    } finally {
      if (imageUploadInputRef.current) imageUploadInputRef.current.value = "";
    }
  }

  // 3. Add Logo
  function handleAddLogoClick() {
    if ((state.extras?.length || 0) >= 20) {
      showToast("You can add up to 20 elements");
      return;
    }
    logoUploadInputRef.current?.click();
  }

  async function handleLogoFileSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if ((state.extras?.length || 0) >= 20) {
      showToast("You can add up to 20 elements");
      if (logoUploadInputRef.current) logoUploadInputRef.current.value = "";
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      showToast("Please upload a JPEG, PNG, WebP, or SVG image.");
      if (logoUploadInputRef.current) logoUploadInputRef.current.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast("Please upload an image smaller than 10MB.");
      if (logoUploadInputRef.current) logoUploadInputRef.current.value = "";
      return;
    }

    showToast("Uploading logo...");
    try {
      const compressedBlob = await compressImageToBlob(file, 400, 0.85, "logo");
      const publicUrl = await uploadSignatureImage(compressedBlob, "logo");
      const id = `logo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const column: "left" | "right" | "full" = state.layout === "single" ? "full" : "left";
      const defaultUrl = state.website?.trim()
        ? (state.website.startsWith("http") ? state.website : `https://${state.website}`)
        : "";
      const newExtra: ExtraImageItem = {
        id,
        type: "image",
        url: publicUrl,
        width: 100,
        align: "left",
        column,
        linkUrl: defaultUrl,
      };
      // Clear legacy companyLogoUrl on main card to avoid any ghost duplication
      if (state.companyLogoUrl) {
        dispatch({
          type: "UPDATE_SIGNATURE_FIELD",
          field: "companyLogoUrl",
          value: "",
        });
      }
      dispatch({ type: "ADD_EXTRA", payload: newExtra });
      setSelectedId(id);
      setAutoOpenLinkId(id);
      showToast("Logo added! Set redirect URL in the toolbar.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload logo.";
      showToast(message);
    } finally {
      if (logoUploadInputRef.current) logoUploadInputRef.current.value = "";
    }
  }

  // 4. Add Divider
  function handleAddDivider() {
    if ((state.extras?.length || 0) >= 20) {
      showToast("You can add up to 20 elements");
      return;
    }
    const id = `div_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newExtra: ExtraDividerItem = {
      id,
      type: "divider",
      orientation: "horizontal",
      width: 600,
      thickness: 1,
      align: "center",
      column: "full",
    };
    dispatch({ type: "ADD_EXTRA", payload: newExtra });
    setSelectedId(id);
    showToast("Horizontal divider added");
  }

  // 5. Social Icons
  function handleSocialIconsClick() {
    setSelectedId("main");
    setEditDetailsSection("socials");
    setIsEditDetailsOpen(true);
  }

  // 6. Add CTA
  function handleAddCta() {
    if ((state.extras?.length || 0) >= 20) {
      showToast("You can add up to 20 elements");
      return;
    }
    const id = `cta_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const column: "left" | "right" | "full" = state.layout === "single" ? "full" : "right";
    const newExtra: ExtraCtaItem = {
      id,
      type: "cta",
      label: "Book a Call",
      url: "https://",
      align: "left",
      column,
    };
    dispatch({ type: "ADD_EXTRA", payload: newExtra });
    setSelectedId(id);
    showToast("CTA button added");
  }

  // 7. Add Banner
  function handleAddBannerClick() {
    if ((state.extras?.length || 0) >= 20) {
      showToast("You can add up to 20 elements");
      return;
    }
    bannerUploadInputRef.current?.click();
  }

  async function handleBannerFileSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showToast("Please upload a JPEG, PNG, or WebP image.");
      if (bannerUploadInputRef.current) bannerUploadInputRef.current.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast("Please upload an image smaller than 10MB.");
      if (bannerUploadInputRef.current) bannerUploadInputRef.current.value = "";
      return;
    }

    showToast("Uploading banner...");
    try {
      const compressedBlob = await compressImageToBlob(file, 600, 0.85, "logo");
      const publicUrl = await uploadSignatureImage(compressedBlob, "logo");
      const isReplacing = state.extras?.some((item) => item.id === selectedId && item.type === "banner");
      if (isReplacing && selectedId) {
        dispatch({
          type: "UPDATE_EXTRA",
          payload: { id: selectedId, item: { imageUrl: publicUrl } },
        });
        showToast("Banner updated!");
      } else {
        const id = `ban_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const newExtra: ExtraBannerItem = {
          id,
          type: "banner",
          imageUrl: publicUrl,
          column: "full",
        };
        dispatch({ type: "ADD_EXTRA", payload: newExtra });
        setSelectedId(id);
        showToast("Banner added!");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload banner.";
      showToast(message);
    } finally {
      if (bannerUploadInputRef.current) bannerUploadInputRef.current.value = "";
    }
  }

  // Render Extra Item on Live Canvas with Direct Inline Editing
  function renderCanvasExtra(extra: SignatureExtraItem, isSelected: boolean) {
    const shape = state.design?.shape || "rounded";
    const btnRadius = shape === "square" ? "0px" : shape === "pill" ? "999px" : "6px";
    const isSolid = (state.design?.buttonStyle || "solid") !== "outline";
    const fontStack = resolveEmailFont(state.fontFamily);

    if (extra.type === "text") {
      const fontSize = extra.size === "sm" ? 12 : extra.size === "lg" ? 16 : 14;
      const widthVal = extra.width && extra.width < 600 ? `${extra.width}px` : "100%";
      const alignClass =
        extra.align === "left"
          ? "mr-auto ml-0"
          : extra.align === "right"
          ? "ml-auto mr-0"
          : "mx-auto";

      return (
        <div
          className={`transition-all ${alignClass}`}
          style={{ width: widthVal, maxWidth: "100%" }}
        >
          <textarea
            ref={(el) => {
              if (el && isSelected && selectedId === extra.id && activeNewIdRef.current === extra.id) {
                el.focus();
                el.select();
                activeNewIdRef.current = null;
              }
            }}
            value={extra.text}
            placeholder="Type your text here..."
            rows={1}
            onClick={(e) => e.stopPropagation()}
            onFocus={() => setSelectedId(extra.id)}
            onChange={(e) => {
              dispatch({
                type: "UPDATE_EXTRA",
                payload: { id: extra.id, item: { text: e.target.value } },
              });
              // Auto-resize height
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            style={{
              fontFamily: fontStack,
              fontSize: `${fontSize}px`,
              fontWeight: extra.bold ? "bold" : "normal",
              textAlign: extra.align || "left",
              color: state.design?.theme === "dark" ? "#F8FAFC" : "#1E293B",
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              width: "100%",
              display: "block",
              lineHeight: 1.25,
              padding: 0,
              margin: 0,
            }}
          />
        </div>
      );
    }

    if (extra.type === "cta") {
      const widthVal = extra.width ? `${extra.width}px` : "auto";
      return (
        <div style={{ display: "inline-block", textAlign: extra.align || "left" }}>
          <div
            style={{
              backgroundColor: isSolid ? state.themeColor || "#245FD4" : "transparent",
              border: isSolid ? "none" : `2px solid ${state.themeColor || "#245FD4"}`,
              borderRadius: btnRadius,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: widthVal,
              maxWidth: "100%",
            }}
            className="px-4 py-1.5 shadow-xs cursor-text transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              value={extra.label || ""}
              placeholder="Button Label"
              onFocus={() => setSelectedId(extra.id)}
              onChange={(e) => {
                dispatch({
                  type: "UPDATE_EXTRA",
                  payload: { id: extra.id, item: { label: e.target.value } },
                });
              }}
              style={{
                fontFamily: fontStack,
                color: isSolid ? "#FFFFFF" : state.themeColor || "#245FD4",
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "12px",
                fontWeight: "bold",
                textAlign: "center",
                width: extra.width ? "100%" : `${Math.max(8, (extra.label || "Button Label").length + 2)}ch`,
              }}
            />
          </div>
        </div>
      );
    }

    if (extra.type === "image") {
      const radius = shape === "square" ? "0px" : shape === "pill" ? "999px" : "4px";
      return (
        <div
          style={{ display: "inline-block", textAlign: extra.align || "left" }}
          title={extra.linkUrl ? `Clickable redirect in email: ${extra.linkUrl}` : undefined}
          className="relative group/img"
        >
          {extra.url ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={extra.url}
                alt="Logo or graphic"
                style={{
                  width: `${extra.width || 80}px`,
                  maxWidth: "100%",
                  display: "block",
                  borderRadius: radius,
                }}
              />
              {extra.linkUrl && (
                <div
                  className="absolute bottom-1 right-1 bg-slate-900/80 text-white rounded p-0.5 shadow pointer-events-none opacity-80 group-hover/img:opacity-100 transition"
                  title={`Redirects to: ${extra.linkUrl}`}
                >
                  <svg className="h-2.5 w-2.5 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>
              )}
            </>
          ) : (
            <div className="h-16 w-20 bg-slate-100 rounded border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400 mx-auto">
              Image
            </div>
          )}
        </div>
      );
    }

    if (extra.type === "divider") {
      const align = extra.align || "center";
      const thickness = extra.thickness || 1;
      const isVertical = extra.orientation === "vertical";
      const alignClass =
        align === "left" ? "mr-auto ml-0" : align === "right" ? "ml-auto mr-0" : "mx-auto";

      if (isVertical) {
        const heightVal = extra.width ? Math.min(180, Math.max(20, extra.width)) : 48;
        return (
          <div
            className="py-1 flex items-center h-full"
            style={{
              justifyContent:
                align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
            }}
          >
            <div
              style={{
                width: `${thickness}px`,
                height: `${heightVal}px`,
                backgroundColor: state.themeColor || "#94A3B8",
              }}
              className="rounded-full shadow-2xs"
            />
          </div>
        );
      }

      const widthVal = extra.width ? Math.min(600, Math.max(40, extra.width)) : 600;
      const widthStyle = widthVal >= 600 ? "100%" : `${widthVal}px`;

      return (
        <div className="py-1 w-full">
          <div
            style={{
              width: widthStyle,
              height: `${thickness}px`,
              backgroundColor: state.themeColor || "#CBD5E1",
            }}
            className={`${alignClass} rounded-full transition-all`}
          />
        </div>
      );
    }

    if (extra.type === "banner") {
      return (
        <div className="text-center w-full">
          {extra.imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={extra.imageUrl}
              alt="Banner graphic"
              className="w-full max-w-[600px] rounded-lg mx-auto object-cover"
            />
          ) : (
            <div className="h-20 w-full bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400">
              Banner Placeholder
            </div>
          )}
        </div>
      );
    }

    return null;
  }

  // Smooth interactive container resizing for canvas elements
  function handleStartResize(
    e: React.MouseEvent,
    extra: SignatureExtraItem,
    side: "left" | "right"
  ) {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const currentW =
      extra.type === "image"
        ? extra.width || 80
        : (extra as { width?: number }).width || 200;

    setResizingInfo({ id: extra.id, width: currentW });

    function onMouseMove(moveEvent: MouseEvent) {
      const deltaX = moveEvent.clientX - startX;
      const change = side === "right" ? deltaX : -deltaX;
      const minW = extra.type === "image" ? 30 : 50;
      const newWidth = Math.min(600, Math.max(minW, Math.round(currentW + change)));

      setResizingInfo({ id: extra.id, width: newWidth });
      dispatch({
        type: "UPDATE_EXTRA",
        payload: { id: extra.id, item: { width: newWidth } },
      });
    }

    function onMouseUp() {
      setResizingInfo(null);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  // Smooth Drag & Drop Handlers for reordering canvas elements
  function handleDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(id);
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggingId && draggingId !== id) {
      const rect = e.currentTarget.getBoundingClientRect();
      const isTop = e.clientY - rect.top < rect.height / 2;
      setDropIndicator({ id, position: isTop ? "before" : "after" });
    }
  }

  function handleDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) {
      setDraggingId(null);
      setDropIndicator(null);
      return;
    }

    const currentExtras = [...(state.extras || [])];
    const fromIndex = currentExtras.findIndex((item) => item.id === draggingId);
    const toIndex = currentExtras.findIndex((item) => item.id === targetId);

    if (fromIndex !== -1 && toIndex !== -1) {
      const [movedItem] = currentExtras.splice(fromIndex, 1);
      const targetItem = state.extras?.find((item) => item.id === targetId);
      if (targetItem) {
        movedItem.column = getItemColumn(targetItem);
      }
      const isInsertAfter = dropIndicator?.position === "after";
      let insertIndex = toIndex;
      if (fromIndex < toIndex) {
        insertIndex = isInsertAfter ? toIndex : toIndex - 1;
      } else {
        insertIndex = isInsertAfter ? toIndex + 1 : toIndex;
      }
      insertIndex = Math.max(0, Math.min(currentExtras.length, insertIndex));
      currentExtras.splice(insertIndex, 0, movedItem);

      dispatch({ type: "SET_EXTRAS", payload: currentExtras });
      showToast("Element reordered");
    }

    setDraggingId(null);
    setDropIndicator(null);
  }

  function handleDragEnd() {
    setDraggingId(null);
    setDropIndicator(null);
  }

  // Save Signature to API Repository
  async function handleSaveSignature() {
    setIsSaving(true);
    try {
      const repo = getSignatureRepository();
      const sigName = state.fullName?.trim()
        ? `${state.fullName.trim()}'s Signature`
        : "My Signature";
      const payloadData: TemplateSignatureData = {
        ...state,
        avatarUrl: state.avatarUrl?.trim() || "/daniel-wilson.png",
      };
      const saved = await repo.save({
        name: sigName,
        templateId: "design-studio",
        data: payloadData,
      });

      setSavedSignatureRecord(saved);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("sig_count_update"));
      }
    } catch (err: unknown) {
      if (isSignatureLimitError(err)) {
        try {
          const repo = getSignatureRepository();
          const list = await repo.list();
          setAllSignatures(list);
          setLimitModalOpen(true);
        } catch {
          showToast("You have reached the maximum signature limit.");
        }
      } else {
        const msg = err instanceof Error ? err.message : "Failed to save signature.";
        showToast(msg);
      }
    } finally {
      setIsSaving(false);
    }
  }

  // Overwrite Target Signature on Limit
  async function handleSelectOverwrite(target: SavedSignature) {
    try {
      const repo = getSignatureRepository();
      const sigName = state.fullName?.trim()
        ? `${state.fullName.trim()}'s Signature`
        : "My Signature";
      const payloadData: TemplateSignatureData = {
        ...state,
        avatarUrl: state.avatarUrl?.trim() || "/daniel-wilson.png",
      };
      const updated = await repo.save({
        id: target.id,
        name: sigName,
        templateId: "design-studio",
        data: payloadData,
      });

      setLimitModalOpen(false);
      setSavedSignatureRecord(updated);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("sig_count_update"));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to overwrite signature.";
      showToast(msg);
    }
  }

  // Zoom Helpers
  function handleZoomIn() {
    setZoom((z) => Math.min(200, z + 25));
  }

  function handleZoomOut() {
    setZoom((z) => Math.max(50, z - 25));
  }

  const handleZoomFit = useCallback(() => {
    if (canvasAreaRef.current) {
      const containerWidth = canvasAreaRef.current.clientWidth;
      const available = containerWidth - 40;
      const fitZoom = Math.min(100, Math.max(35, Math.round((available / 600) * 100)));
      setZoom(fitZoom);
    } else {
      setZoom(100);
    }
  }, []);

  // Auto-fit on small screens initially & on resize
  useEffect(() => {
    function autoFitOnSmallScreens() {
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        handleZoomFit();
      }
    }
    autoFitOnSmallScreens();
    window.addEventListener("resize", autoFitOnSmallScreens);
    return () => window.removeEventListener("resize", autoFitOnSmallScreens);
  }, [handleZoomFit]);

  // Premium lock click helper
  function handlePremiumClick() {
    if (!isPremium) {
      setPremiumModalOpen(true);
    }
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
            Loading Design Studio...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#FCFCFC]">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="h-2 w-2 rounded-full bg-[#245FD4]" />
          <span
            className="text-xs font-semibold text-[#1E293B]"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            {toastMessage}
          </span>
        </div>
      )}

      {/* Edit Details Modal */}
      <EditDetailsModal
        isOpen={isEditDetailsOpen}
        onClose={() => setIsEditDetailsOpen(false)}
        selectedId={selectedId}
        state={state}
        dispatch={dispatch}
        initialSection={editDetailsSection}
        onToast={showToast}
      />

      {/* Premium Locked Feature Modal */}
      <PremiumLockedModal
        isOpen={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
      />

      {/* Preview Real Width Modal (Desktop 600px / Mobile 360px) */}
      <PreviewSignatureModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        html={fullSignatureHtml}
      />

      {/* Save Success Modal */}
      {savedSignatureRecord && (
        <SaveSuccessModal
          isOpen={Boolean(savedSignatureRecord)}
          onClose={() => setSavedSignatureRecord(null)}
          signatureName={savedSignatureRecord.name}
          signatureData={state}
        />
      )}

      {/* Free Tier Limit Overwrite Modal */}
      <LimitOverwriteModal
        isOpen={limitModalOpen}
        onClose={() => setLimitModalOpen(false)}
        signatures={allSignatures}
        onSelectOverwrite={handleSelectOverwrite}
      />

      {/* 256px Fixed Sidebar */}
      <DashboardSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navigation Bar */}
        <DashboardTopBar
          userName={displayName}
          userEmail={user?.email}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />

        {/* Mobile View Switcher (< lg screens) */}
        <div className="flex lg:hidden items-center justify-center border-b border-[#E2E8F0] bg-white px-4 py-2.5">
          <div className="flex w-full max-w-[360px] items-center rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMobileTab("canvas")}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                mobileTab === "canvas"
                  ? "bg-white text-[#245FD4] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Canvas
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("tools")}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                mobileTab === "tools"
                  ? "bg-white text-[#245FD4] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Tools
            </button>
          </div>
        </div>

        {/* Desktop Split View: Left Tools Panel (340px lg / 418px xl) | Right Canvas Area */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* ======================================================== */}
          {/* LEFT: TOOLS PANEL (340px on lg, 418px on xl, vertical scroll) */}
          {/* ======================================================== */}
          <aside
            className={`w-full lg:w-[340px] xl:w-[418px] shrink-0 border-r border-[#E2E8F0] bg-[#FCFCFC] overflow-y-auto studio-scrollbar p-5 pb-24 lg:pb-5 transition-all ${
              mobileTab === "tools" ? "block" : "hidden lg:block"
            }`}
            style={{
              scrollbarGutter: "stable",
            }}
          >
            {/* 1. FONTS SECTION */}
            <div className="border-b border-[#E2E8F0] pb-5 mb-5">
              <button
                type="button"
                onClick={() => toggleSection("fonts")}
                aria-expanded={openSections.fonts}
                className="flex w-full items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#EFF6FF] text-[#245FD4] text-xs font-bold shadow-2xs">
                    F
                  </div>
                  <span
                    className="text-sm font-bold text-[#1E293B]"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    Fonts
                  </span>
                </div>
                <svg
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    openSections.fonts ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openSections.fonts && (
                <div className="mt-3.5">
                  {/* Free Fonts Responsive Grid */}
                  <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2" role="radiogroup" aria-label="Font Selection">
                    {ALLOWED_STUDIO_FONTS.map((font) => {
                      const isSelected = state.fontFamily === font;
                      const fontFam =
                        font === "Inter"
                          ? "'Inter', sans-serif"
                          : font === "Roboto"
                          ? "'Roboto', sans-serif"
                          : font === "Georgia"
                          ? "Georgia, serif"
                          : "'DM Sans', sans-serif";

                      return (
                        <div
                          key={font}
                          role="radio"
                          aria-checked={isSelected}
                          tabIndex={0}
                          onClick={() => dispatch({ type: "SET_FONT", payload: font })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              dispatch({ type: "SET_FONT", payload: font });
                            }
                          }}
                          className={`flex items-center justify-between rounded-[10px] border p-2.5 cursor-pointer transition select-none ${
                            isSelected
                              ? "border-[1.5px] border-[#245FD4] bg-[#EFF6FF]/40 shadow-xs"
                              : "border-[#E2E8F0] bg-white hover:border-slate-300"
                          }`}
                        >
                          <span
                            className="text-xs font-semibold text-[#1E293B]"
                            style={{ fontFamily: fontFam }}
                          >
                            {font}
                          </span>
                          <span
                            className="text-[11px] text-[#94A3B8]"
                            style={{ fontFamily: fontFam }}
                          >
                            Aa Bb Cc
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* PREMIUM FONTS */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold tracking-wider text-[#94A3B8] uppercase">
                      PREMIUM
                    </span>
                    <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2 mt-1.5">
                      {[
                        { name: "Alata" },
                        { name: "DM Serif" },
                        { name: "Play Fair" },
                        { name: "Duru Sans" },
                      ].map((item) => (
                        <div
                          key={item.name}
                          role="button"
                          aria-disabled="true"
                          tabIndex={0}
                          onClick={handlePremiumClick}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handlePremiumClick();
                            }
                          }}
                          className="flex items-center justify-between rounded-[10px] border border-[#E2E8F0] bg-white p-2.5 cursor-pointer opacity-95 hover:opacity-100 transition select-none shadow-2xs"
                        >
                          <span className="text-xs font-medium text-slate-700">{item.name}</span>
                          <span className="rounded-full bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-[9px] font-semibold text-amber-700">
                            Premium
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fallback Note */}
                  <p
                    className="mt-2 text-[11px] text-[#94A3B8] leading-tight"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    Fonts that are not installed on the reader&apos;s device fall back to Arial.
                  </p>
                </div>
              )}
            </div>

            {/* 2. COLORS SECTION */}
            <div className="border-b border-[#E2E8F0] pb-5 mb-5">
              <button
                type="button"
                onClick={() => toggleSection("colors")}
                aria-expanded={openSections.colors}
                className="flex w-full items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#EFF6FF] text-[#245FD4] shadow-2xs">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.97-4.48-9-10-9z" />
                    </svg>
                  </div>
                  <span
                    className="text-sm font-bold text-[#1E293B]"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    Colors
                  </span>
                </div>
                <svg
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    openSections.colors ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openSections.colors && (
                <div className="mt-3.5">
                  {/* SOLID COLORS */}
                  <span className="text-[10px] font-bold tracking-wider text-[#94A3B8] uppercase">
                    SOLID COLORS
                  </span>
                  <div className="flex flex-wrap items-center gap-2.5 mt-2">
                    {STUDIO_SOLID_COLORS.map((color) => {
                      const isSelected = state.themeColor?.toLowerCase() === color.toLowerCase();
                      const isWhite = color.toUpperCase() === "#FFFFFF";

                      return (
                        <button
                          key={color}
                          type="button"
                          aria-label={`Select color ${color}`}
                          onClick={() => dispatch({ type: "SET_COLOR", payload: color })}
                          className={`h-6 w-6 rounded-full transition transform hover:scale-110 focus:outline-none ${
                            isWhite ? "border border-[#CBD5E1]" : ""
                          } ${
                            isSelected
                              ? "ring-2 ring-offset-2 ring-[#245FD4] scale-110"
                              : "hover:ring-1 hover:ring-slate-300"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      );
                    })}
                  </div>

                  {/* GRADIENT COLORS (PREMIUM) */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-wider text-[#94A3B8] uppercase">
                        GRADIENT COLORS
                      </span>
                      <span className="rounded-full bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-[9px] font-semibold text-amber-700">
                        Premium
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 mt-2">
                      {[
                        "linear-gradient(135deg, #4F46E5, #9333EA)",
                        "linear-gradient(135deg, #F97316, #EF4444)",
                        "linear-gradient(135deg, #14B8A6, #22C55E)",
                        "linear-gradient(135deg, #A855F7, #EC4899)",
                      ].map((grad, idx) => (
                        <button
                          key={idx}
                          type="button"
                          aria-label={`Premium gradient ${idx + 1}`}
                          onClick={handlePremiumClick}
                          className="h-6 w-6 rounded-full opacity-95 hover:opacity-100 transition transform hover:scale-105 cursor-pointer shadow-2xs"
                          style={{ background: grad }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* GLASS THEME (PREMIUM) */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-wider text-[#94A3B8] uppercase">
                        GLASS THEME
                      </span>
                      <span className="rounded-full bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-[9px] font-semibold text-amber-700">
                        Premium
                      </span>
                    </div>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={handlePremiumClick}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handlePremiumClick();
                        }
                      }}
                      className="mt-2 flex w-full items-center justify-center rounded-[10px] border border-[#E2E8F0] bg-white p-3 text-center cursor-pointer transition hover:bg-slate-50 opacity-95 hover:opacity-100 shadow-2xs"
                    >
                      <span
                        className="text-[11px] text-[#64748B]"
                        style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                      >
                        Glass effects available in Premium
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. ADD ELEMENTS SECTION */}
            <div className="border-b border-[#E2E8F0] pb-5 mb-5">
              <button
                type="button"
                onClick={() => toggleSection("elements")}
                aria-expanded={openSections.elements}
                className="flex w-full items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#EFF6FF] text-[#245FD4] shadow-2xs">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </div>
                  <span
                    className="text-sm font-bold text-[#1E293B]"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    Add Elements
                  </span>
                </div>
                <svg
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    openSections.elements ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openSections.elements && (
                <div className="mt-3.5">
                  {/* Hidden File Inputs for Logo, Image, and Banner Uploads */}
                  <input
                    ref={logoUploadInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleLogoFileSelected}
                  />
                  <input
                    ref={imageUploadInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageFileSelected}
                  />
                  <input
                    ref={bannerUploadInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleBannerFileSelected}
                  />

                  <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2">
                    {/* 1. Add Text */}
                    <button
                      type="button"
                      onClick={handleAddText}
                      className="flex items-center gap-2 rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs transition hover:border-[#245FD4] hover:text-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      <svg className="h-3.5 w-3.5 text-[#64748B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="4 7 4 4 20 4 20 7" />
                        <line x1="9" y1="20" x2="15" y2="20" />
                        <line x1="12" y1="4" x2="12" y2="20" />
                      </svg>
                      <span>Add Text</span>
                    </button>

                    {/* 2. Add Image */}
                    <button
                      type="button"
                      onClick={handleAddImageClick}
                      className="flex items-center gap-2 rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs transition hover:border-[#245FD4] hover:text-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      <svg className="h-3.5 w-3.5 text-[#64748B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span>Add Image</span>
                    </button>

                    {/* 3. Add Logo */}
                    <button
                      type="button"
                      onClick={handleAddLogoClick}
                      className="flex items-center gap-2 rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs transition hover:border-[#245FD4] hover:text-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      <svg className="h-3.5 w-3.5 text-[#64748B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                      <span>Add Logo</span>
                    </button>

                    {/* 4. Add Divider */}
                    <button
                      type="button"
                      onClick={handleAddDivider}
                      className="flex items-center gap-2 rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs transition hover:border-[#245FD4] hover:text-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      <svg className="h-3.5 w-3.5 text-[#64748B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="12" x2="21" y2="12" />
                      </svg>
                      <span>Add Divider</span>
                    </button>

                    {/* 5. Social Icons */}
                    <button
                      type="button"
                      onClick={handleSocialIconsClick}
                      className="flex items-center gap-2 rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs transition hover:border-[#245FD4] hover:text-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      <svg className="h-3.5 w-3.5 text-[#64748B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                      <span>Social Icons</span>
                    </button>

                    {/* 6. CTA Button */}
                    <button
                      type="button"
                      onClick={handleAddCta}
                      className="flex items-center gap-2 rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs transition hover:border-[#245FD4] hover:text-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      <svg className="h-3.5 w-3.5 text-[#64748B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="6" width="18" height="12" rx="3" />
                        <circle cx="12" cy="12" r="1" />
                      </svg>
                      <span>CTA Button</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2 mt-2">
                    {/* 7. Add Banner */}
                    <button
                      type="button"
                      onClick={handleAddBannerClick}
                      className="flex items-center gap-2 rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-medium text-[#1E293B] shadow-2xs transition hover:border-[#245FD4] hover:text-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      <svg className="h-3.5 w-3.5 text-[#64748B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="10" rx="2" />
                      </svg>
                      <span>Add Banner</span>
                    </button>

                    {/* 8. Contact Card */}
                    <button
                      type="button"
                      onClick={() => {
                        dispatch({
                          type: "SET_FULL_STATE",
                          payload: {
                            ...state,
                            fullName: "Your Name",
                            jobTitle: "Your Job Title",
                            companyName: "Company Name",
                            email: "email@example.com",
                            phone: "+1 (555) 000-0000",
                            website: "www.example.com",
                          },
                        });
                        setSelectedId("main");
                        showToast("Contact card added!");
                      }}
                      className="flex items-center gap-2 rounded-[10px] border border-blue-200 bg-blue-50/60 px-3 py-2 text-xs font-medium text-[#245FD4] shadow-2xs transition hover:bg-blue-100 hover:border-[#245FD4] focus:outline-none focus:ring-1 focus:ring-[#245FD4]"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      <svg className="h-3.5 w-3.5 text-[#245FD4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span>Contact Card</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. SHAPES SECTION */}
            <div className="border-b border-[#E2E8F0] pb-5 mb-5">
              <button
                type="button"
                onClick={() => toggleSection("shapes")}
                aria-expanded={openSections.shapes}
                className="flex w-full items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#EFF6FF] text-[#245FD4] shadow-2xs">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="4" />
                    </svg>
                  </div>
                  <span
                    className="text-sm font-bold text-[#1E293B]"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    Shapes
                  </span>
                </div>
                <svg
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    openSections.shapes ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openSections.shapes && (
                <div className="mt-3.5">
                  {/* Free Shapes: Rounded, Square, Pill */}
                  <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Shape Selection">
                    {[
                      { id: "rounded", label: "Rounded", rx: "rounded-lg" },
                      { id: "square", label: "Square", rx: "rounded-none" },
                      { id: "pill", label: "Pill", rx: "rounded-full" },
                    ].map((shape) => {
                      const isSelected = (state.design?.shape || "rounded") === shape.id;
                      return (
                        <div
                          key={shape.id}
                          role="radio"
                          aria-checked={isSelected}
                          tabIndex={0}
                          onClick={() => dispatch({ type: "SET_SHAPE", payload: shape.id as StudioShape })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              dispatch({ type: "SET_SHAPE", payload: shape.id as StudioShape });
                            }
                          }}
                          className={`flex flex-col items-center justify-center rounded-[10px] border p-3 cursor-pointer transition select-none ${
                            isSelected
                              ? "border-[1.5px] border-[#245FD4] bg-[#EFF6FF]/40 shadow-xs"
                              : "border-[#E2E8F0] bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className={`h-8 w-8 border border-slate-300 bg-slate-100 ${shape.rx}`} />
                          <span className="mt-2 text-[11px] font-medium text-[#1E293B]">
                            {shape.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* PREMIUM SHAPES */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold tracking-wider text-[#94A3B8] uppercase">
                      PREMIUM
                    </span>
                    <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2 mt-1.5">
                      {[
                        { label: "Glass", color: "bg-indigo-100/60" },
                        { label: "Blob", color: "bg-pink-100/60" },
                      ].map((item) => (
                        <div
                          key={item.label}
                          role="button"
                          aria-disabled="true"
                          tabIndex={0}
                          onClick={handlePremiumClick}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handlePremiumClick();
                            }
                          }}
                          className="flex flex-col items-center justify-center rounded-[10px] border border-[#E2E8F0] bg-white p-3 cursor-pointer opacity-95 hover:opacity-100 transition select-none relative shadow-2xs"
                        >
                          <div className={`h-8 w-8 rounded-lg border border-slate-200 ${item.color}`} />
                          <div className="mt-2 flex items-center gap-1">
                            <span className="text-[11px] font-medium text-slate-700">{item.label}</span>
                            <span className="h-2 w-2 rounded-full bg-amber-400" title="Premium" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. SOCIAL ICONS SECTION */}
            <div className="border-b border-[#E2E8F0] pb-5 mb-5">
              <button
                type="button"
                onClick={() => toggleSection("socials")}
                aria-expanded={openSections.socials}
                className="flex w-full items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#EFF6FF] text-[#245FD4] shadow-2xs">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </div>
                  <span
                    className="text-sm font-bold text-[#1E293B]"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    Social Icons
                  </span>
                </div>
                <svg
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    openSections.socials ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openSections.socials && (
                <div className="mt-3.5">
                  {/* 3 Wide Option Rows */}
                  <div className="flex flex-col gap-2" role="radiogroup" aria-label="Social Icon Styles">
                    {[
                      { id: "filled", label: "Filled" },
                      { id: "outline", label: "Outlined" },
                      { id: "minimal", label: "Minimal" },
                    ].map((styleItem) => {
                      const isSelected = (state.socialIconsStyle || "filled") === styleItem.id;
                      return (
                        <div
                          key={styleItem.id}
                          role="radio"
                          aria-checked={isSelected}
                          tabIndex={0}
                          onClick={() =>
                            dispatch({
                              type: "SET_SOCIAL_STYLE",
                              payload: styleItem.id as StudioSocialStyle,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              dispatch({
                                type: "SET_SOCIAL_STYLE",
                                payload: styleItem.id as StudioSocialStyle,
                              });
                            }
                          }}
                          className={`flex items-center justify-between rounded-[10px] border px-3.5 py-2.5 cursor-pointer transition select-none ${
                            isSelected
                              ? "border-[1.5px] border-[#245FD4] bg-[#EFF6FF]/40 shadow-xs"
                              : "border-[#E2E8F0] bg-white hover:border-slate-300"
                          }`}
                        >
                          {/* Sample 4 icons preview */}
                          <div className="flex items-center gap-1.5">
                            {["in", "X", "ig", "f"].map((glyph) => (
                              <div
                                key={glyph}
                                className={`flex h-5 w-5 items-center justify-center text-[9px] font-bold ${
                                  styleItem.id === "filled"
                                    ? "rounded bg-[#245FD4] text-white"
                                    : styleItem.id === "outline"
                                    ? "rounded border border-[#245FD4] text-[#245FD4]"
                                    : "text-[#245FD4]"
                                }`}
                              >
                                {glyph}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs font-medium text-[#64748B]">{styleItem.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* PREMIUM SOCIALS */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold tracking-wider text-[#94A3B8] uppercase">
                      PREMIUM
                    </span>
                    <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2 mt-1.5">
                      {["Gradient", "Animated"].map((label) => (
                        <div
                          key={label}
                          role="button"
                          aria-disabled="true"
                          tabIndex={0}
                          onClick={handlePremiumClick}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handlePremiumClick();
                            }
                          }}
                          className="flex items-center justify-between rounded-[10px] border border-[#E2E8F0] bg-white p-2.5 cursor-pointer opacity-95 hover:opacity-100 transition select-none shadow-2xs"
                        >
                          <span className="text-xs font-medium text-slate-700">{label}</span>
                          <span className="rounded-full bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-[9px] font-semibold text-amber-700">
                            Premium
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 6. THEMES SECTION */}
            <div className="border-b border-[#E2E8F0] pb-5 mb-5">
              <button
                type="button"
                onClick={() => toggleSection("themes")}
                aria-expanded={openSections.themes}
                className="flex w-full items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#EFF6FF] text-[#245FD4] shadow-2xs">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                  </div>
                  <span
                    className="text-sm font-bold text-[#1E293B]"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    Themes
                  </span>
                </div>
                <svg
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    openSections.themes ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openSections.themes && (
                <div className="mt-3.5">
                  {/* Free Themes Grid */}
                  <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2" role="radiogroup" aria-label="Theme Selection">
                    {[
                      { id: "corporate", label: "Corporate", bg: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200" },
                      { id: "minimal", label: "Minimal", bg: "bg-slate-100 border-slate-200" },
                      { id: "modern", label: "Modern", bg: "bg-purple-50 border-purple-200" },
                      { id: "dark", label: "Dark", bg: "bg-[#0F172A] border-[#1E293B] text-white" },
                    ].map((th) => {
                      const isSelected = (state.design?.theme || "corporate") === th.id;
                      return (
                        <div
                          key={th.id}
                          role="radio"
                          aria-checked={isSelected}
                          tabIndex={0}
                          onClick={() => dispatch({ type: "SET_THEME", payload: th.id as StudioTheme })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              dispatch({ type: "SET_THEME", payload: th.id as StudioTheme });
                            }
                          }}
                          className={`flex flex-col items-center justify-center rounded-[10px] border p-3 cursor-pointer transition select-none ${
                            isSelected
                              ? "border-[1.5px] border-[#245FD4] bg-[#EFF6FF]/40 shadow-xs"
                              : "border-[#E2E8F0] bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className={`h-7 w-full rounded-md border ${th.bg}`} />
                          <span className="mt-1.5 text-[11px] font-medium text-[#1E293B]">
                            {th.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* PREMIUM THEMES */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold tracking-wider text-[#94A3B8] uppercase">
                      PREMIUM
                    </span>
                    <div className="grid grid-cols-1 min-[380px]:grid-cols-3 gap-2 mt-1.5">
                      {[
                        { label: "Luxury", bg: "bg-[#78350F]" },
                        { label: "Glass", bg: "bg-gradient-to-r from-indigo-500 to-purple-500" },
                        { label: "Neon", bg: "bg-black border border-emerald-400" },
                      ].map((item) => (
                        <div
                          key={item.label}
                          role="button"
                          aria-disabled="true"
                          tabIndex={0}
                          onClick={handlePremiumClick}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handlePremiumClick();
                            }
                          }}
                          className="flex flex-col items-center justify-center rounded-[10px] border border-[#E2E8F0] bg-white p-2 cursor-pointer opacity-95 hover:opacity-100 transition select-none shadow-2xs"
                        >
                          <div className={`h-6 w-full rounded ${item.bg}`} />
                          <span className="mt-1.5 text-[10px] font-medium text-slate-700">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 7. LAYOUT SECTION */}
            <div className="border-b border-[#E2E8F0] pb-5 mb-5">
              <button
                type="button"
                onClick={() => toggleSection("layout")}
                aria-expanded={openSections.layout}
                className="flex w-full items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#EFF6FF] text-[#245FD4] shadow-2xs">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <line x1="12" y1="3" x2="12" y2="21" />
                    </svg>
                  </div>
                  <span
                    className="text-sm font-bold text-[#1E293B]"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    Layout
                  </span>
                </div>
                <svg
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    openSections.layout ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openSections.layout && (
                <div className="mt-3.5">
                  {/* Free Layouts: Single, Two Column, Compact */}
                  <div className="grid grid-cols-1 min-[380px]:grid-cols-3 gap-2" role="radiogroup" aria-label="Layout Selection">
                    {[
                      {
                        id: "single",
                        label: "Single",
                        thumb: (
                          <div className="flex flex-col gap-0.5 items-center justify-center h-full w-full">
                            <div className="h-2 w-2 rounded-full bg-slate-400" />
                            <div className="h-1 w-6 bg-slate-300 rounded" />
                            <div className="h-1 w-4 bg-slate-300 rounded" />
                          </div>
                        ),
                      },
                      {
                        id: "two-column",
                        label: "Two Column",
                        thumb: (
                          <div className="flex items-center justify-center gap-1 h-full w-full">
                            <div className="h-4 w-3 bg-slate-300 rounded-xs" />
                            <div className="flex flex-col gap-0.5">
                              <div className="h-1 w-4 bg-slate-400 rounded" />
                              <div className="h-1 w-3 bg-slate-300 rounded" />
                            </div>
                          </div>
                        ),
                      },
                      {
                        id: "compact",
                        label: "Compact",
                        thumb: (
                          <div className="flex items-center justify-between w-full h-full px-1">
                            <div className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                            <div className="h-1 w-5 bg-slate-300 rounded" />
                          </div>
                        ),
                      },
                    ].map((lay) => {
                      const isSelected = (state.layout || "two-column") === lay.id;
                      return (
                        <div
                          key={lay.id}
                          role="radio"
                          aria-checked={isSelected}
                          tabIndex={0}
                          onClick={() => dispatch({ type: "SET_LAYOUT", payload: lay.id as StudioLayout })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              dispatch({ type: "SET_LAYOUT", payload: lay.id as StudioLayout });
                            }
                          }}
                          className={`flex flex-col items-center justify-center rounded-[10px] border p-2.5 cursor-pointer transition select-none ${
                            isSelected
                              ? "border-[1.5px] border-[#245FD4] bg-[#EFF6FF]/40 shadow-xs"
                              : "border-[#E2E8F0] bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="h-7 w-full rounded border border-slate-200 bg-slate-50 flex items-center justify-center">
                            {lay.thumb}
                          </div>
                          <span className="mt-1.5 text-[11px] font-medium text-[#1E293B]">
                            {lay.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* PREMIUM LAYOUTS */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold tracking-wider text-[#94A3B8] uppercase">
                      PREMIUM
                    </span>
                    <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2 mt-1.5">
                      {["Glass", "Floating"].map((label) => (
                        <div
                          key={label}
                          role="button"
                          aria-disabled="true"
                          tabIndex={0}
                          onClick={handlePremiumClick}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handlePremiumClick();
                            }
                          }}
                          className="flex items-center justify-between rounded-[10px] border border-[#E2E8F0] bg-white p-2.5 cursor-pointer opacity-95 hover:opacity-100 transition select-none shadow-2xs"
                        >
                          <span className="text-xs font-medium text-slate-700">{label}</span>
                          <span className="rounded-full bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-[9px] font-semibold text-amber-700">
                            Premium
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 8. BUTTON STYLES SECTION */}
            <div className="pb-2">
              <button
                type="button"
                onClick={() => toggleSection("buttons")}
                aria-expanded={openSections.buttons}
                className="flex w-full items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#EFF6FF] text-[#245FD4] shadow-2xs">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="7" width="18" height="10" rx="3" />
                    </svg>
                  </div>
                  <span
                    className="text-sm font-bold text-[#1E293B]"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    Button Styles
                  </span>
                </div>
                <svg
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    openSections.buttons ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openSections.buttons && (
                <div className="mt-3.5">
                  {/* Free Options: Solid, Outline */}
                  <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2" role="radiogroup" aria-label="Button Styles Selection">
                    {[
                      { id: "solid", label: "Solid", isSolid: true },
                      { id: "outline", label: "Outline", isSolid: false },
                    ].map((btn) => {
                      const isSelected = (state.design?.buttonStyle || "solid") === btn.id;
                      return (
                        <div
                          key={btn.id}
                          role="radio"
                          aria-checked={isSelected}
                          tabIndex={0}
                          onClick={() => dispatch({ type: "SET_BUTTON_STYLE", payload: btn.id as StudioButtonStyle })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              dispatch({ type: "SET_BUTTON_STYLE", payload: btn.id as StudioButtonStyle });
                            }
                          }}
                          className={`flex flex-col items-center justify-center rounded-[10px] border p-3 cursor-pointer transition select-none ${
                            isSelected
                              ? "border-[1.5px] border-[#245FD4] bg-[#EFF6FF]/40 shadow-xs"
                              : "border-[#E2E8F0] bg-white hover:border-slate-300"
                          }`}
                        >
                          <div
                            className={`rounded-md px-3 py-1 text-[11px] font-semibold ${
                              btn.isSolid
                                ? "bg-[#245FD4] text-white"
                                : "border border-[#245FD4] text-[#245FD4] bg-white"
                            }`}
                          >
                            Book a Call
                          </div>
                          <span className="mt-2 text-[11px] font-medium text-[#1E293B]">
                            {btn.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* PREMIUM BUTTONS */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold tracking-wider text-[#94A3B8] uppercase">
                      PREMIUM
                    </span>
                    <div className="grid grid-cols-1 min-[380px]:grid-cols-3 gap-2 mt-1.5">
                      {[
                        { label: "Gradient", style: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" },
                        { label: "Glass", style: "bg-slate-100 border border-slate-300 text-slate-800" },
                        { label: "Shadow", style: "bg-blue-600 text-white shadow-md" },
                      ].map((item) => (
                        <div
                          key={item.label}
                          role="button"
                          aria-disabled="true"
                          tabIndex={0}
                          onClick={handlePremiumClick}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handlePremiumClick();
                            }
                          }}
                          className="flex flex-col items-center justify-center rounded-[10px] border border-[#E2E8F0] bg-white p-2 cursor-pointer opacity-95 hover:opacity-100 transition select-none shadow-2xs"
                        >
                          <div className={`rounded px-2.5 py-0.5 text-[9px] font-semibold ${item.style}`}>
                            CTA
                          </div>
                          <span className="mt-1.5 text-[10px] font-medium text-slate-700">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* ======================================================== */}
          {/* RIGHT: CANVAS AREA */}
          {/* ======================================================== */}
          <main
            className={`flex-1 flex flex-col min-w-0 bg-[#FCFCFC] overflow-y-auto pb-24 lg:pb-0 ${
              mobileTab === "canvas" ? "flex" : "hidden lg:flex"
            }`}
          >
            {/* Top Toolbar Row 1: Action Buttons (Preview Signature + Save & Continue) */}
            <div className="hidden lg:flex items-center justify-end px-6 pt-4 pb-1 shrink-0">
              <div className="flex items-center gap-2">
                {/* Preview Signature (outlined, eye icon) */}
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(true)}
                  className="flex h-[36px] items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-[14px] text-xs font-semibold text-[#1E293B] shadow-2xs transition hover:border-[#245FD4] hover:text-[#245FD4] whitespace-nowrap shrink-0"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  <svg className="h-3.5 w-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span>Preview Signature</span>
                </button>

                {/* Save & Continue (primary gradient, check icon) */}
                <button
                  type="button"
                  onClick={handleSaveSignature}
                  disabled={isSaving}
                  className="flex h-[36px] items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#245FD4] to-[#022977] px-[14px] text-xs font-semibold text-white shadow-xs transition hover:opacity-95 disabled:opacity-50 whitespace-nowrap shrink-0"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{isSaving ? "Saving..." : "Save & Continue"}</span>
                </button>
              </div>
            </div>

            {/* Row 2: Canvas Info on Left, 4 Separate Outlined Controls on Right */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-2 shrink-0">
              {/* Canvas Info */}
              <div className="flex items-center gap-2">
                <span
                  className="text-[13px] font-bold text-[#1E293B]"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Canvas
                </span>
                <span className="text-xs text-[#94A3B8]">&bull;</span>
                <span
                  className="text-[13px] text-[#94A3B8]"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  Email Signature &mdash; 600px wide
                </span>
              </div>

              {/* 4 Separate Small Outlined Controls */}
              <div className="flex items-center gap-1.5">
                {/* 1. Zoom Out */}
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E2E8F0] bg-white text-xs font-semibold text-slate-600 shadow-2xs hover:border-slate-300 transition"
                  title="Zoom Out"
                  aria-label="Zoom out"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>

                {/* 2. Current Zoom (100%) */}
                <button
                  type="button"
                  onClick={() => setZoom(100)}
                  className="flex h-7 min-w-[48px] px-2 items-center justify-center rounded-md border border-[#E2E8F0] bg-white text-[11px] font-semibold text-[#1E293B] shadow-2xs hover:border-slate-300 transition"
                  title="Reset zoom to 100%"
                  aria-label="Reset zoom to 100%"
                >
                  {Math.round(zoom)}%
                </button>

                {/* 3. Zoom In */}
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E2E8F0] bg-white text-xs font-semibold text-slate-600 shadow-2xs hover:border-slate-300 transition"
                  title="Zoom In"
                  aria-label="Zoom in"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>

                {/* 4. Fit */}
                <button
                  type="button"
                  onClick={handleZoomFit}
                  className="flex h-7 items-center gap-1 px-2.5 rounded-md border border-[#E2E8F0] bg-white text-[11px] font-semibold text-slate-600 shadow-2xs hover:border-slate-300 transition"
                  title="Fit to Screen"
                  aria-label="Fit to screen"
                >
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                  <span>Fit</span>
                </button>
              </div>
            </div>

            {/* Canvas Body: Mock Email Window Container */}
            <div
              ref={canvasAreaRef}
              className="flex-1 overflow-auto p-3 sm:p-6 lg:p-8 flex items-start justify-center"
            >
              <div
                className="w-full max-w-[680px] bg-white rounded-[12px] border border-[#E5E7EB] shadow-xs transition-transform duration-150 origin-top flex flex-col"
                style={{
                  transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
                }}
              >
                {/* Window Chrome Header (soft red, yellow, green dots) */}
                <div className="flex items-center gap-1.5 border-b border-[#F1F5F9] px-4 py-3 bg-white rounded-t-[12px]">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
                </div>

                {/* Email Header Rows: To: and Subject: (empty values) */}
                <div className="border-b border-[#F1F5F9] px-5 py-2.5 text-xs text-[#94A3B8]">
                  <span className="text-[#94A3B8]">To:</span>
                </div>
                <div className="border-b border-[#F1F5F9] px-5 py-2.5 text-xs text-[#94A3B8]">
                  <span className="text-[#94A3B8]">Subject:</span>
                </div>

                {/* Compose Email Body (Clicking empty space clears selection) */}
                <div
                  className="p-4 sm:p-6 lg:p-8 flex flex-col min-h-[340px] cursor-default"
                  onClick={() => setSelectedId(null)}
                >
                  {(() => {
                    const hasMain = Boolean(
                      state.fullName?.trim() ||
                      state.jobTitle?.trim() ||
                      state.companyName?.trim() ||
                      state.email?.trim() ||
                      state.phone?.trim() ||
                      state.website?.trim() ||
                      state.avatarUrl?.trim()
                    );
                    const hasExtras = Boolean(state.extras && state.extras.length > 0);
                    const isBlankCanvas = !hasMain && !hasExtras;

                    if (isBlankCanvas) {
                      return (
                        <div className="w-full max-w-[600px] mx-auto border-2 border-dashed border-slate-200 rounded-2xl p-8 sm:p-12 text-center bg-slate-50/50 hover:bg-slate-50/80 hover:border-[#245FD4]/50 transition duration-150">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#245FD4] shadow-2xs mb-3">
                            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <line x1="12" y1="8" x2="12" y2="16" />
                              <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                          </div>
                          <h3
                            className="text-sm font-bold text-[#1E293B]"
                            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                          >
                            Your signature canvas is blank
                          </h3>
                          <p
                            className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto"
                            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                          >
                            Start building your signature by adding elements below. Write and customize elements directly on the canvas without popups.
                          </p>
                          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                            <button
                              type="button"
                              onClick={handleAddText}
                              className="flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E293B] shadow-2xs hover:border-[#245FD4] hover:text-[#245FD4] transition"
                            >
                              <svg className="h-3.5 w-3.5 text-[#245FD4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="4 7 4 4 20 4 20 7" />
                                <line x1="9" y1="20" x2="15" y2="20" />
                                <line x1="12" y1="4" x2="12" y2="20" />
                              </svg>
                              <span>Add Text</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleAddImageClick}
                              className="flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E293B] shadow-2xs hover:border-[#245FD4] hover:text-[#245FD4] transition"
                            >
                              <svg className="h-3.5 w-3.5 text-[#245FD4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                              </svg>
                              <span>Add Image</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleAddLogoClick}
                              className="flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E293B] shadow-2xs hover:border-[#245FD4] hover:text-[#245FD4] transition"
                            >
                              <svg className="h-3.5 w-3.5 text-[#245FD4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                              </svg>
                              <span>Add Logo</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleAddDivider}
                              className="flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E293B] shadow-2xs hover:border-[#245FD4] hover:text-[#245FD4] transition"
                            >
                              <svg className="h-3.5 w-3.5 text-[#245FD4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="3" y1="12" x2="21" y2="12" />
                              </svg>
                              <span>Add Divider</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleAddCta}
                              className="flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E293B] shadow-2xs hover:border-[#245FD4] hover:text-[#245FD4] transition"
                            >
                              <svg className="h-3.5 w-3.5 text-[#245FD4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="7" width="18" height="10" rx="3" />
                              </svg>
                              <span>Add CTA Button</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleAddBannerClick}
                              className="flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E293B] shadow-2xs hover:border-[#245FD4] hover:text-[#245FD4] transition"
                            >
                              <svg className="h-3.5 w-3.5 text-[#245FD4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="5" width="20" height="14" rx="2" />
                                <line x1="2" y1="10" x2="22" y2="10" />
                              </svg>
                              <span>Add Banner</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                dispatch({
                                  type: "SET_FULL_STATE",
                                  payload: {
                                    ...state,
                                    fullName: "Your Name",
                                    jobTitle: "Your Job Title",
                                    companyName: "Company Name",
                                    email: "email@example.com",
                                    phone: "+1 (555) 000-0000",
                                    website: "www.example.com",
                                  },
                                });
                                setSelectedId("main");
                                showToast("Contact card added!");
                              }}
                              className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#245FD4] shadow-2xs hover:bg-blue-100 transition"
                            >
                              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                              <span>Add Contact Card</span>
                            </button>
                          </div>
                        </div>
                      );
                    }

                    function renderExtraWrapper(extra: SignatureExtraItem, isColumnContext = false) {
                      const isSelected = selectedId === extra.id;
                      const allExtras = state.extras || [];
                      const index = allExtras.findIndex((item) => item.id === extra.id);
                      const canMoveUp = index > 0;
                      const canMoveDown = index < allExtras.length - 1;
                      const currentColumn = getItemColumn(extra);

                      // Dynamic width & container styling for snug content-fitting
                      let widthStyle: React.CSSProperties = {};
                      let containerClass = "relative transition-all cursor-pointer ";

                      if (extra.type === "image") {
                        widthStyle = {
                          width: `${extra.width || 80}px`,
                          maxWidth: "100%",
                        };
                        containerClass += "p-1 rounded-[10px] w-fit ";
                        if (!isColumnContext) {
                          containerClass +=
                            extra.align === "center"
                              ? "mx-auto "
                              : extra.align === "right"
                              ? "ml-auto mr-0 "
                              : "mr-auto ml-0 ";
                        }
                      } else if (extra.type === "cta") {
                        widthStyle = extra.width ? { width: `${extra.width}px` } : { width: "fit-content" };
                        containerClass += "p-1 rounded-[10px] w-fit ";
                        if (!isColumnContext) {
                          containerClass +=
                            extra.align === "center"
                              ? "mx-auto "
                              : extra.align === "right"
                              ? "ml-auto mr-0 "
                              : "mr-auto ml-0 ";
                        }
                      } else if (extra.type === "text") {
                        widthStyle =
                          extra.width && extra.width < 600
                            ? { width: `${extra.width}px` }
                            : { width: "100%" };
                        containerClass += "py-0.5 px-1.5 rounded-md w-full ";
                        if (!isColumnContext && extra.width && extra.width < 600) {
                          containerClass +=
                            extra.align === "center"
                              ? "mx-auto "
                              : extra.align === "right"
                              ? "ml-auto mr-0 "
                              : "mr-auto ml-0 ";
                        }
                      } else if (extra.type === "divider" && extra.orientation === "vertical") {
                        widthStyle = { width: "fit-content" };
                        containerClass += "px-1.5 py-1 rounded-md w-fit h-full flex items-center ";
                      } else if (extra.type === "divider") {
                        widthStyle = { width: "100%" };
                        containerClass += "py-1 px-1 rounded-md w-full ";
                      } else {
                        // banner
                        widthStyle = { width: "100%", maxWidth: "600px" };
                        containerClass += "p-1 rounded-[10px] w-full mx-auto ";
                      }

                      if (isSelected) {
                        containerClass += "border-[1.5px] border-[#245FD4] bg-blue-50/15 shadow-xs ";
                      } else {
                        containerClass += "border border-dashed border-transparent hover:border-slate-300 ";
                      }

                      if (draggingId === extra.id) {
                        containerClass += "opacity-35 scale-[0.98] border-dashed border-blue-400 bg-blue-50/20 ";
                      }

                      return (
                        <div key={extra.id} className="relative group/wrapper">
                          {/* Drop Target Indicator (Before) */}
                          {dropIndicator?.id === extra.id && dropIndicator.position === "before" && (
                            <div className="h-1.5 w-full bg-[#245FD4] rounded-full my-1 shadow-sm transition-all duration-150 animate-in fade-in" />
                          )}

                          <div
                            draggable
                            onDragStart={(e) => {
                              if (
                                document.activeElement &&
                                (document.activeElement.tagName === "INPUT" ||
                                  document.activeElement.tagName === "TEXTAREA" ||
                                  (document.activeElement as HTMLElement).isContentEditable)
                              ) {
                                e.preventDefault();
                                return;
                              }
                              handleDragStart(e, extra.id);
                            }}
                            onDragOver={(e) => handleDragOver(e, extra.id)}
                            onDrop={(e) => handleDrop(e, extra.id)}
                            onDragEnd={handleDragEnd}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId(extra.id);
                            }}
                            style={widthStyle}
                            className={containerClass}
                          >
                            {/* Drag Grip Handle */}
                            <div
                              title="Drag to reorder or move between columns"
                              className={`absolute -left-3 top-1/2 -translate-y-1/2 z-20 flex h-6 w-5 items-center justify-center rounded bg-white border border-slate-200 text-slate-400 shadow-xs cursor-grab active:cursor-grabbing hover:text-[#245FD4] hover:border-[#245FD4] hover:bg-blue-50 transition-all ${
                                isSelected ? "opacity-100" : "opacity-0 group-hover/wrapper:opacity-100"
                              }`}
                            >
                              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="9" cy="6" r="1.5" />
                                <circle cx="15" cy="6" r="1.5" />
                                <circle cx="9" cy="12" r="1.5" />
                                <circle cx="15" cy="12" r="1.5" />
                                <circle cx="9" cy="18" r="1.5" />
                                <circle cx="15" cy="18" r="1.5" />
                              </svg>
                            </div>

                            {/* Edge Resize Handles (Left and Right) */}
                            {isSelected && (
                              <>
                                <div
                                  onMouseDown={(e) => handleStartResize(e, extra, "left")}
                                  className="absolute -left-1.5 top-1/2 -translate-y-1/2 z-25 flex h-7 w-2.5 items-center justify-center rounded-full bg-white border border-[#245FD4] shadow-md hover:scale-125 cursor-ew-resize transition group/handle"
                                  title="Drag to resize width"
                                >
                                  <div className="h-3 w-0.5 bg-[#245FD4] rounded-full group-hover/handle:bg-blue-700" />
                                </div>

                                <div
                                  onMouseDown={(e) => handleStartResize(e, extra, "right")}
                                  className="absolute -right-1.5 top-1/2 -translate-y-1/2 z-25 flex h-7 w-2.5 items-center justify-center rounded-full bg-white border border-[#245FD4] shadow-md hover:scale-125 cursor-ew-resize transition group/handle"
                                  title="Drag to resize width"
                                >
                                  <div className="h-3 w-0.5 bg-[#245FD4] rounded-full group-hover/handle:bg-blue-700" />
                                </div>

                                {resizingInfo && resizingInfo.id === extra.id && (
                                  <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 z-30 px-2 py-0.5 bg-[#0F172A] text-white text-[11px] font-bold rounded-md shadow-lg pointer-events-none animate-in fade-in">
                                    {resizingInfo.width}px
                                  </div>
                                )}
                              </>
                            )}

                            {/* Floating Toolbar when this extra is selected */}
                            {isSelected && (
                              <FloatingToolbar
                                isMainCard={false}
                                elementType={extra.type}
                                autoOpenLinkMenu={autoOpenLinkId === extra.id && extra.type === "image" && !extra.linkUrl}
                                column={currentColumn}
                                onColumnChange={(newCol) => {
                                  dispatch({
                                    type: "UPDATE_EXTRA",
                                    payload: { id: extra.id, item: { column: newCol } },
                                  });
                                  showToast(`Moved to ${newCol === "left" ? "Left Column" : newCol === "right" ? "Right Column" : "Full Width"}`);
                                }}
                                bold={extra.type === "text" ? extra.bold : undefined}
                                onToggleBold={
                                  extra.type === "text"
                                    ? () => {
                                        dispatch({
                                          type: "UPDATE_EXTRA",
                                          payload: { id: extra.id, item: { bold: !extra.bold } },
                                        });
                                      }
                                    : undefined
                                }
                                size={extra.type === "text" ? extra.size : undefined}
                                onSizeChange={
                                  extra.type === "text"
                                    ? (newSize) => {
                                        dispatch({
                                          type: "UPDATE_EXTRA",
                                          payload: { id: extra.id, item: { size: newSize } },
                                        });
                                      }
                                    : undefined
                                }
                                url={
                                  extra.type === "cta"
                                    ? extra.url
                                    : extra.type === "image" || extra.type === "banner"
                                    ? extra.linkUrl
                                    : undefined
                                }
                                onUrlChange={
                                  extra.type === "cta"
                                    ? (newUrl) => {
                                        dispatch({
                                          type: "UPDATE_EXTRA",
                                          payload: { id: extra.id, item: { url: newUrl } },
                                        });
                                      }
                                    : extra.type === "image" || extra.type === "banner"
                                    ? (newUrl) => {
                                        setAutoOpenLinkId(null);
                                        dispatch({
                                          type: "UPDATE_EXTRA",
                                          payload: { id: extra.id, item: { linkUrl: newUrl } },
                                        });
                                      }
                                    : undefined
                                }
                                width={
                                  extra.type === "image"
                                    ? extra.width
                                    : extra.type === "divider"
                                    ? extra.width
                                    : extra.type === "text"
                                    ? extra.width
                                    : extra.type === "cta"
                                    ? extra.width
                                    : undefined
                                }
                                onWidthChange={(newWidth) => {
                                  dispatch({
                                    type: "UPDATE_EXTRA",
                                    payload: { id: extra.id, item: { width: newWidth } },
                                  });
                                }}
                                orientation={extra.type === "divider" ? extra.orientation || "horizontal" : undefined}
                                onOrientationChange={
                                  extra.type === "divider"
                                    ? (newOri) => {
                                        dispatch({
                                          type: "UPDATE_EXTRA",
                                          payload: { id: extra.id, item: { orientation: newOri } },
                                        });
                                      }
                                    : undefined
                                }
                                thickness={extra.type === "divider" ? extra.thickness || 1 : undefined}
                                onThicknessChange={
                                  extra.type === "divider"
                                    ? (newThickness) => {
                                        dispatch({
                                          type: "UPDATE_EXTRA",
                                          payload: { id: extra.id, item: { thickness: newThickness } },
                                        });
                                      }
                                    : undefined
                                }
                                imageWidth={extra.type === "image" ? extra.width : undefined}
                                onReplaceMedia={
                                  extra.type === "image"
                                    ? () => imageUploadInputRef.current?.click()
                                    : extra.type === "banner"
                                    ? () => bannerUploadInputRef.current?.click()
                                    : undefined
                                }
                                canMoveUp={canMoveUp}
                                canMoveDown={canMoveDown}
                                onDuplicate={() => {
                                  dispatch({
                                    type: "DUPLICATE_EXTRA",
                                    payload: { id: extra.id },
                                  });
                                  showToast("Element duplicated");
                                }}
                                onDelete={() => {
                                  dispatch({
                                    type: "REMOVE_EXTRA",
                                    payload: { id: extra.id },
                                  });
                                  setSelectedId(null);
                                  showToast("Element deleted");
                                }}
                                onAlign={(alignment) => {
                                  dispatch({
                                    type: "UPDATE_EXTRA",
                                    payload: { id: extra.id, item: { align: alignment } },
                                  });
                                }}
                                onMoveUp={() => {
                                  dispatch({
                                    type: "MOVE_EXTRA_UP",
                                    payload: { id: extra.id },
                                  });
                                }}
                                onMoveDown={() => {
                                  dispatch({
                                    type: "MOVE_EXTRA_DOWN",
                                    payload: { id: extra.id },
                                  });
                                }}
                              />
                            )}

                            {/* Render Extra Item Content */}
                            {renderCanvasExtra(extra, isSelected)}
                          </div>

                          {/* Drop Target Indicator (After) */}
                          {dropIndicator?.id === extra.id && dropIndicator.position === "after" && (
                            <div className="h-1.5 w-full bg-[#245FD4] rounded-full my-1 shadow-sm transition-all duration-150 animate-in fade-in" />
                          )}
                        </div>
                      );
                    }

                    return (
                      <div className="mx-auto w-full max-w-[600px] min-w-[300px] space-y-3">
                        {/* 1. Main Signature Card (only if hasMain is true) */}
                        {hasMain && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId("main");
                            }}
                            className={`relative rounded-[12px] p-4 bg-white shadow-xs transition-all cursor-pointer ${
                              selectedId === "main"
                                ? "border-[1.5px] border-[#245FD4]"
                                : "border border-transparent hover:border-slate-300"
                            }`}
                          >
                            {/* Floating Tool Action Pill over Main Card */}
                            {selectedId === "main" && (
                              <FloatingToolbar
                                isMainCard={true}
                                onAlign={(alignment) => {
                                  if (alignment === "left") {
                                    dispatch({ type: "SET_LAYOUT", payload: "single" });
                                  } else if (alignment === "center") {
                                    dispatch({ type: "SET_LAYOUT", payload: "two-column" });
                                  } else {
                                    dispatch({ type: "SET_LAYOUT", payload: "compact" });
                                  }
                                }}
                                onDelete={() => {
                                  dispatch({
                                    type: "SET_FULL_STATE",
                                    payload: {
                                      ...state,
                                      fullName: "",
                                      jobTitle: "",
                                      companyName: "",
                                      email: "",
                                      phone: "",
                                      website: "",
                                      avatarUrl: "",
                                      companyLogoUrl: "",
                                      socials: { linkedin: "", twitter: "", facebook: "", instagram: "" },
                                    },
                                  });
                                  setSelectedId(null);
                                  showToast("Contact card removed");
                                }}
                                onEditDetails={() => {
                                  setEditDetailsSection("all");
                                  setIsEditDetailsOpen(true);
                                }}
                              />
                            )}

                            {/* Sandboxed Iframe Preview (Main signature only) */}
                            <div className="relative w-full">
                              <SignaturePreviewFrame
                                ref={previewFrameRef}
                                html={mainSignatureOnlyHtml}
                                minHeight={140}
                              />
                              {/* Transparent overlay over iframe so click/selection are captured */}
                              <div
                                className="absolute inset-0 cursor-pointer z-10"
                                aria-label="Select signature"
                              />
                            </div>
                          </div>
                        )}

                        {/* 2. Extra Elements List */}
                        {state.extras && state.extras.length > 0 && (() => {
                          const isTwoCol = state.layout === "two-column" || state.layout === "compact";

                          if (!isTwoCol) {
                            return (
                              <div className="space-y-1.5 w-full">
                                {state.extras.map((extra) => renderExtraWrapper(extra, false))}
                              </div>
                            );
                          }

                          // Partition elements into Top Full, Left Column, Right Column, Bottom Full
                          const leftColumnItems: SignatureExtraItem[] = [];
                          const rightColumnItems: SignatureExtraItem[] = [];
                          let verticalDividerItem: ExtraDividerItem | null = null;
                          const topFullItems: SignatureExtraItem[] = [];
                          const bottomFullItems: SignatureExtraItem[] = [];

                          let encounteredColumnItem = false;

                          for (const item of state.extras) {
                            if (item.type === "divider" && item.orientation === "vertical") {
                              verticalDividerItem = item;
                              continue;
                            }

                            const col = getItemColumn(item);
                            if (col === "left") {
                              encounteredColumnItem = true;
                              leftColumnItems.push(item);
                            } else if (col === "right") {
                              encounteredColumnItem = true;
                              rightColumnItems.push(item);
                            } else {
                              if (encounteredColumnItem) {
                                bottomFullItems.push(item);
                              } else {
                                topFullItems.push(item);
                              }
                            }
                          }

                          return (
                            <div className="space-y-2 w-full">
                              {/* Top Full Elements (e.g. Banner, full divider) */}
                              {topFullItems.length > 0 && (
                                <div className="space-y-1.5 w-full">
                                  {topFullItems.map((extra) => renderExtraWrapper(extra, false))}
                                </div>
                              )}

                              {/* Side-by-Side Two Column Block */}
                              <div className="flex flex-row items-start gap-4 sm:gap-5 w-full">
                                {/* Left Column: Headshot / Logo / Left items (Snug fit) */}
                                <div
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    e.dataTransfer.dropEffect = "move";
                                  }}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    if (draggingId) {
                                      dispatch({
                                        type: "UPDATE_EXTRA",
                                        payload: { id: draggingId, item: { column: "left" } },
                                      });
                                      setDraggingId(null);
                                      setDropIndicator(null);
                                      showToast("Moved to Left Column");
                                    }
                                  }}
                                  className="w-fit shrink-0 min-w-[76px] flex flex-col gap-1.5 items-start"
                                >
                                  {leftColumnItems.length === 0 ? (
                                    <div
                                      onClick={handleAddImageClick}
                                      className="h-20 w-20 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#245FD4] bg-slate-50 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition group"
                                      title="Click to add photo to left column"
                                    >
                                      <svg className="h-5 w-5 text-slate-400 group-hover:text-[#245FD4] transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                      </svg>
                                      <span className="text-[10px] text-slate-400 group-hover:text-[#245FD4] font-medium mt-1">
                                        Add Photo
                                      </span>
                                    </div>
                                  ) : (
                                    leftColumnItems.map((extra) => renderExtraWrapper(extra, true))
                                  )}
                                </div>

                                {/* Optional Vertical Divider */}
                                {verticalDividerItem ? (
                                  <div className="shrink-0 self-stretch flex items-center px-1">
                                    {renderExtraWrapper(verticalDividerItem, true)}
                                  </div>
                                ) : (
                                  <div className="w-[1px] self-stretch bg-slate-200/80 my-1 shrink-0" />
                                )}

                                {/* Right Column: Name, Title, Company, Button (Closely Knitted!) */}
                                <div
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    e.dataTransfer.dropEffect = "move";
                                  }}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    if (draggingId) {
                                      dispatch({
                                        type: "UPDATE_EXTRA",
                                        payload: { id: draggingId, item: { column: "right" } },
                                      });
                                      setDraggingId(null);
                                      setDropIndicator(null);
                                      showToast("Moved to Right Column");
                                    }
                                  }}
                                  className="flex-1 min-w-0 flex flex-col gap-1 items-start"
                                >
                                  {rightColumnItems.length === 0 ? (
                                    <div
                                      onClick={handleAddText}
                                      className="w-full h-20 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#245FD4] bg-slate-50 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition group"
                                      title="Click to add text next to image"
                                    >
                                      <svg className="h-5 w-5 text-slate-400 group-hover:text-[#245FD4] transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="4 7 4 4 20 4 20 7" />
                                        <line x1="9" y1="20" x2="15" y2="20" />
                                        <line x1="12" y1="4" x2="12" y2="20" />
                                      </svg>
                                      <span className="text-[11px] text-slate-400 group-hover:text-[#245FD4] font-medium mt-1">
                                        Add text on side of image
                                      </span>
                                    </div>
                                  ) : (
                                    rightColumnItems.map((extra) => renderExtraWrapper(extra, true))
                                  )}
                                </div>
                              </div>

                              {/* Bottom Full Elements (e.g. Disclaimer, bottom banner) */}
                              {bottomFullItems.length > 0 && (
                                <div className="space-y-1.5 w-full">
                                  {bottomFullItems.map((extra) => renderExtraWrapper(extra, false))}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })()}

                  {/* Autosave Status Footnote */}
                  <div className="mt-auto pt-6 flex justify-end">
                    <span
                      className="text-[11px] text-[#94A3B8]"
                      style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                    >
                      {saveStatus === "saving"
                        ? "Saving..."
                        : `All changes saved \u00B7 ${state.fullName?.trim() ? `${state.fullName.trim()}'s Signature` : "My Signature"}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Sticky Bottom Bar on Small Screens (< lg) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center gap-3 border-t border-[#E2E8F0] bg-white p-3 shadow-lg pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => setPreviewModalOpen(true)}
            className="flex h-[38px] flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs font-semibold text-[#1E293B] shadow-2xs whitespace-nowrap hover:border-[#245FD4] transition"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            <svg className="h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>Preview Signature</span>
          </button>

          <button
            type="button"
            onClick={handleSaveSignature}
            disabled={isSaving}
            className="flex h-[38px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#245FD4] to-[#022977] px-3 text-xs font-semibold text-white shadow-xs whitespace-nowrap disabled:opacity-50 transition hover:opacity-95"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{isSaving ? "Saving..." : "Save & Continue"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
