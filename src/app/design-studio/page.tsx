"use client";

import {
  Suspense,
  useEffect,
  useState,
  useReducer,
  useRef,
  useCallback,
  ChangeEvent,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  getStoredSettings,
  getStoredAvatarUrl,
} from "@/app/lib/auth";
import { mapToValidTemplateFont } from "@/lib/templates/designs/shared";
import { getSignatureRepository } from "@/lib/signatures/repository";
import { getEditHref } from "@/lib/signatures/kind";
import { SavedSignature, StudioSavedSignature } from "@/types/signature";
import {
  StudioSignatureData,
  FreeElement,
  FreeTextElement,
  FreeImageElement,
  FreeLogoElement,
} from "@/types/studio";
import { compressImageToBlob } from "@/lib/imageUtils";
import { uploadSignatureImage } from "@/lib/uploads";
import { generateFreeHtml } from "@/lib/studio/free/renderFreeHtml";
import { useIsPremium } from "@/lib/premium";
import { studioHistoryReducer } from "@/lib/studio/free/history";
import { migrateFlowToFree } from "@/lib/studio/free/migrate";
import {
  findFreeSpot,
  rectsOverlap,
  resolveOverlap,
  snap,
} from "@/lib/studio/free/geometry";
import {
  INITIAL_STUDIO_DATA,
  StudioShape,
  StudioSocialStyle,
  StudioTheme,
  StudioButtonStyle,
  ALLOWED_STUDIO_FONTS,
} from "@/lib/studio/types";
import { STUDIO_SOLID_COLORS } from "@/lib/studio/constants";
import PremiumLockedModal from "@/components/studio/PremiumLockedModal";
import PreviewSignatureModal from "@/components/studio/PreviewSignatureModal";
import SaveSuccessModal from "@/components/signatures/SaveSuccessModal";
import LimitOverwriteModal from "@/components/signatures/LimitOverwriteModal";
import FloatingToolbar, { CanvasAlignment, TeamFieldBind } from "@/components/studio/FloatingToolbar";
import EditDetailsModal from "@/components/studio/EditDetailsModal";
import FreeCanvas from "@/components/studio/FreeCanvas";

function DesignStudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isPremium = useIsPremium();

  // Auth & Session
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Edit Signature tracking
  const [editingSignatureId, setEditingSignatureId] = useState<string | null>(null);
  const currentEditingIdRef = useRef<string | null>(null);

  // Responsive Segmented Control for < lg screens
  const [mobileTab, setMobileTab] = useState<"canvas" | "tools">("canvas");

  // History Store (Undo / Redo 50 steps)
  const [historyState, dispatch] = useReducer(studioHistoryReducer, {
    past: [],
    present: INITIAL_STUDIO_DATA,
    future: [],
  });
  const state = historyState.present;

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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditDetailsOpen, setIsEditDetailsOpen] = useState(false);
  const [editDetailsSection, setEditDetailsSection] = useState<"all" | "socials">("all");

  // File Upload Refs
  const logoUploadInputRef = useRef<HTMLInputElement>(null);
  const imageUploadInputRef = useRef<HTMLInputElement>(null);
  const bannerUploadInputRef = useRef<HTMLInputElement>(null);

  // Canvas container ref
  const canvasAreaRef = useRef<HTMLDivElement>(null);

  // Collapsible Tool Sections (all open by default)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    fonts: true,
    colors: true,
    elements: true,
    shapes: true,
    socials: true,
    themes: true,
    layout: true,
    teamFields: true,
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

  // Global Undo / Redo Shortcuts (Cmd/Ctrl + Z, Cmd/Ctrl + Shift + Z)
  useEffect(() => {
    function handleHistoryShortcuts(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        if (e.shiftKey) {
          dispatch({ type: "REDO" });
        } else {
          dispatch({ type: "UNDO" });
        }
      } else if ((e.metaKey || e.ctrlKey) && (e.key === "y" || e.key === "Y")) {
        e.preventDefault();
        dispatch({ type: "REDO" });
      }
    }

    window.addEventListener("keydown", handleHistoryShortcuts);
    return () => window.removeEventListener("keydown", handleHistoryShortcuts);
  }, []);

  // Load Signature for Edit or Restore Draft
  useEffect(() => {
    let isCancelled = false;

    async function initPage() {
      const cachedUser = getStoredUser();
      if (cachedUser && !isCancelled) {
        setUser(cachedUser);
      }

      let activeUser: UserProfile | null = cachedUser;
      try {
        activeUser = await getCurrentUser();
        if (!isCancelled) {
          setUser(activeUser);
        }
      } catch (err) {
        console.warn("Session expired or invalid, redirecting to login:", err);
        clearAuthSession();
        router.replace("/login?redirect=/design-studio");
        return;
      }

      const userId = activeUser.id;

      if (editId) {
        if (currentEditingIdRef.current === editId) {
          if (!isCancelled) setIsLoading(false);
          return;
        }

        try {
          const repo = getSignatureRepository();
          const stored = await repo.get(editId);
          if (isCancelled) return;

          if (!stored) {
            showToast("Signature not found");
            router.replace("/design-studio");
            return;
          }

          if (stored.kind !== "studio") {
            router.replace(getEditHref(stored));
            return;
          }

          setEditingSignatureId(stored.id);
          currentEditingIdRef.current = stored.id;

          // Check if there is an existing edit-session draft for this signature
          const editDraftKey = `sig_studio_draft_${userId}_${stored.id}`;
          let loadedData = stored.data as StudioSignatureData;
          try {
            const savedDraft = localStorage.getItem(editDraftKey);
            if (savedDraft) {
              const parsed = JSON.parse(savedDraft);
              if (parsed && typeof parsed === "object") {
                loadedData = { ...INITIAL_STUDIO_DATA, ...parsed };
              }
            }
          } catch {
            // ignore
          }

          // Migrate legacy flow designs if elements is missing
          if (!loadedData.elements) {
            loadedData = migrateFlowToFree(loadedData);
          }

          dispatch({ type: "SET_FULL_STATE", payload: loadedData });
        } catch (loadErr) {
          console.error("Failed to load signature for editing:", loadErr);
          if (!isCancelled) {
            showToast("Failed to load signature");
            router.replace("/design-studio");
          }
          return;
        }
      } else {
        // No edit ID: start with blank canvas and restore draft if present
        setEditingSignatureId(null);
        currentEditingIdRef.current = null;

        const draftKey = `sig_studio_draft_${userId}`;
        let loadedData: StudioSignatureData = INITIAL_STUDIO_DATA;
        let hasSavedDraft = false;
        try {
          const savedDraft = localStorage.getItem(draftKey);
          if (savedDraft) {
            let parsed = JSON.parse(savedDraft);
            if (parsed && typeof parsed === "object") {
              if (!parsed.elements) {
                parsed = migrateFlowToFree(parsed);
              }
              loadedData = { ...INITIAL_STUDIO_DATA, ...parsed };
              hasSavedDraft = true;
            }
          }
        } catch {
          // ignore localStorage parsing errors
        }

        if (!hasSavedDraft) {
          const storedSettings = getStoredSettings();
          const storedAvatar = getStoredAvatarUrl();
          const userFullName = `${activeUser.firstName || ""} ${activeUser.lastName || ""}`.trim();
          const shouldIncludePhoto = storedSettings?.includePhoto !== false;
          const userAvatar = shouldIncludePhoto && storedAvatar ? storedAvatar : "";

          loadedData = {
            ...INITIAL_STUDIO_DATA,
            fullName: userFullName || INITIAL_STUDIO_DATA.fullName,
            companyName: activeUser.companyName || INITIAL_STUDIO_DATA.companyName,
            email: activeUser.email || INITIAL_STUDIO_DATA.email,
            themeColor: storedSettings?.brandColor || INITIAL_STUDIO_DATA.themeColor,
            fontFamily: storedSettings?.signatureFont
              ? mapToValidTemplateFont(storedSettings.signatureFont)
              : INITIAL_STUDIO_DATA.fontFamily,
            avatarUrl: userAvatar,
          };
          loadedData = migrateFlowToFree(loadedData);
        }

        dispatch({ type: "SET_FULL_STATE", payload: loadedData });
      }

      if (!isCancelled) {
        setIsLoading(false);
      }
    }

    initPage();

    return () => {
      isCancelled = true;
    };
  }, [editId, router, showToast]);

  // Debounced Autosave to localStorage (600ms)
  useEffect(() => {
    if (!user?.id || isLoading) return;
    const userId = user.id;
    const draftKey = editingSignatureId
      ? `sig_studio_draft_${userId}_${editingSignatureId}`
      : `sig_studio_draft_${userId}`;

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
  }, [state, user?.id, editingSignatureId, isLoading]);

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

  // 1. Add Text
  function handleAddText() {
    if ((state.elements?.length || 0) >= 40) {
      showToast("Maximum of 40 elements reached.");
      return;
    }
    const canvas = state.canvas || { width: 600, height: 200 };
    const spot = findFreeSpot({ w: 240, h: 24 }, state.elements || [], canvas);
    const id = `txt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newEl: FreeElement = {
      id,
      type: "text",
      text: "Your text here",
      size: "md",
      bold: false,
      align: "left",
      x: spot.x,
      y: spot.y,
      w: 240,
      h: 24,
    };
    dispatch({ type: "ADD_ELEMENT", payload: newEl });
    setSelectedId(id);
    showToast("Text added");
  }

  // 2. Add Image
  function handleAddImageClick() {
    if ((state.elements?.length || 0) >= 40) {
      showToast("Maximum of 40 elements reached.");
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

      // Measure natural aspect ratio
      const img = new Image();
      img.src = publicUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
      const aspect = (img.naturalWidth || 72) / Math.max(1, img.naturalHeight || 72);
      const w = Math.min(200, Math.max(40, Math.round(72 * Math.max(1, aspect))));
      const h = Math.round(w / aspect);

      const isReplacing = state.elements?.some(
        (item) => item.id === selectedId && item.type === "image"
      );
      if (isReplacing && selectedId) {
        dispatch({
          type: "UPDATE_ELEMENT",
          payload: { id: selectedId, updates: { url: publicUrl } },
        });
        showToast("Image updated!");
      } else {
        const canvas = state.canvas || { width: 600, height: 200 };
        const spot = findFreeSpot({ w, h }, state.elements || [], canvas);
        const id = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const newEl: FreeElement = {
          id,
          type: "image",
          url: publicUrl,
          x: spot.x,
          y: spot.y,
          w,
          h,
        };
        dispatch({ type: "ADD_ELEMENT", payload: newEl });
        setSelectedId(id);
        showToast("Image added!");
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
    if ((state.elements?.length || 0) >= 40) {
      showToast("Maximum of 40 elements reached.");
      return;
    }
    logoUploadInputRef.current?.click();
  }

  async function handleLogoFileSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

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

      const img = new Image();
      img.src = publicUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
      const aspect = (img.naturalWidth || 100) / Math.max(1, img.naturalHeight || 60);
      const w = Math.min(120, Math.max(40, Math.round(60 * Math.max(1, aspect))));
      const h = Math.round(w / aspect);

      const isReplacing = state.elements?.some(
        (item) => item.id === selectedId && item.type === "logo"
      );
      if (isReplacing && selectedId) {
        dispatch({
          type: "UPDATE_ELEMENT",
          payload: { id: selectedId, updates: { url: publicUrl } },
        });
        showToast("Logo updated!");
      } else {
        const canvas = state.canvas || { width: 600, height: 200 };
        const spot = findFreeSpot({ w, h }, state.elements || [], canvas);
        const id = `logo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const newEl: FreeElement = {
          id,
          type: "logo",
          url: publicUrl,
          x: spot.x,
          y: spot.y,
          w,
          h,
        };
        dispatch({ type: "ADD_ELEMENT", payload: newEl });
        setSelectedId(id);
        showToast("Logo added!");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload logo.";
      showToast(message);
    } finally {
      if (logoUploadInputRef.current) logoUploadInputRef.current.value = "";
    }
  }

  // 4. Add Divider
  function handleAddDivider() {
    if ((state.elements?.length || 0) >= 40) {
      showToast("Maximum of 40 elements reached.");
      return;
    }
    const canvas = state.canvas || { width: 600, height: 200 };
    const spot = findFreeSpot({ w: 240, h: 1 }, state.elements || [], canvas);
    const id = `div_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newEl: FreeElement = {
      id,
      type: "divider",
      orientation: "horizontal",
      thickness: 1,
      x: spot.x,
      y: spot.y,
      w: 240,
      h: 1,
    };
    dispatch({ type: "ADD_ELEMENT", payload: newEl });
    setSelectedId(id);
    showToast("Horizontal divider added");
  }

  // 5. Social Icons
  function handleSocialIconsClick() {
    const existingSocial = state.elements?.find((el) => el.type === "social");
    if (existingSocial) {
      setSelectedId(existingSocial.id);
      setEditDetailsSection("socials");
      setIsEditDetailsOpen(true);
      return;
    }

    if ((state.elements?.length || 0) >= 40) {
      showToast("Maximum of 40 elements reached.");
      return;
    }

    const canvas = state.canvas || { width: 600, height: 200 };
    const spot = findFreeSpot({ w: 140, h: 24 }, state.elements || [], canvas);
    const id = `soc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newEl: FreeElement = {
      id,
      type: "social",
      x: spot.x,
      y: spot.y,
      w: 140,
      h: 24,
    };
    dispatch({ type: "ADD_ELEMENT", payload: newEl });
    setSelectedId(id);
    setEditDetailsSection("socials");
    setIsEditDetailsOpen(true);
  }

  // 6. Add CTA
  function handleAddCta() {
    if ((state.elements?.length || 0) >= 40) {
      showToast("Maximum of 40 elements reached.");
      return;
    }
    const canvas = state.canvas || { width: 600, height: 200 };
    const spot = findFreeSpot({ w: 140, h: 36 }, state.elements || [], canvas);
    const id = `cta_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newEl: FreeElement = {
      id,
      type: "cta",
      label: "Book a Call",
      url: "",
      x: spot.x,
      y: spot.y,
      w: 140,
      h: 36,
    };
    dispatch({ type: "ADD_ELEMENT", payload: newEl });
    setSelectedId(id);
    showToast("CTA button added");
  }

  // 7. Add Banner
  function handleAddBannerClick() {
    if ((state.elements?.length || 0) >= 40) {
      showToast("Maximum of 40 elements reached.");
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

      const canvasWidth = state.canvas?.width || 600;
      const img = new Image();
      img.src = publicUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
      const aspect = (img.naturalWidth || 600) / Math.max(1, img.naturalHeight || 100);
      const h = Math.min(160, Math.max(40, Math.round(canvasWidth / aspect)));

      const isReplacing = state.elements?.some(
        (item) => item.id === selectedId && item.type === "banner"
      );
      if (isReplacing && selectedId) {
        dispatch({
          type: "UPDATE_ELEMENT",
          payload: { id: selectedId, updates: { url: publicUrl } },
        });
        showToast("Banner updated!");
      } else {
        const canvas = state.canvas || { width: 600, height: 200 };
        const spot = findFreeSpot({ w: canvasWidth, h }, state.elements || [], canvas);
        const id = `ban_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const newEl: FreeElement = {
          id,
          type: "banner",
          url: publicUrl,
          x: spot.x,
          y: spot.y,
          w: canvasWidth,
          h,
        };
        dispatch({ type: "ADD_ELEMENT", payload: newEl });
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

  // Canvas Alignment Handler
  function handleCanvasAlignment(id: string, alignment: CanvasAlignment) {
    const el = state.elements?.find((item) => item.id === id);
    if (!el || el.locked) return;
    const canvasW = state.canvas?.width || 600;
    const canvasH = state.canvas?.height || 200;

    let newX = el.x;
    let newY = el.y;

    if (alignment === "left") newX = 0;
    if (alignment === "center") newX = Math.round((canvasW - el.w) / 2);
    if (alignment === "right") newX = canvasW - el.w;
    if (alignment === "top") newY = 0;
    if (alignment === "middle") newY = Math.round((canvasH - el.h) / 2);
    if (alignment === "bottom") newY = canvasH - el.h;

    const candidate = { ...el, x: snap(newX, 4), y: snap(newY, 4) };
    const others = (state.elements || []).filter((item) => item.id !== id);

    const hasOverlap = others.some((other) => rectsOverlap(candidate, other));
    if (hasOverlap) {
      const resolved = resolveOverlap(
        candidate,
        others,
        { width: canvasW, height: canvasH },
        { x: el.x, y: el.y }
      );
      if (resolved.x === el.x && resolved.y === el.y) {
        showToast("Elements cannot overlap in email signatures");
        return;
      }
      dispatch({ type: "MOVE_ELEMENT", payload: { id, x: resolved.x, y: resolved.y } });
    } else {
      dispatch({ type: "MOVE_ELEMENT", payload: { id, x: candidate.x, y: candidate.y } });
    }
  }

  // Save Signature to API Repository
  async function handleSaveSignature() {
    setIsSaving(true);
    try {
      const repo = getSignatureRepository();
      const firstTextEl = state.elements?.find(
        (el): el is FreeTextElement => el.type === "text" && Boolean(el.text.trim())
      );
      const firstText = firstTextEl?.text;
      const sigName = state.fullName?.trim()
        ? `${state.fullName.trim()}'s Signature`
        : firstText?.trim()
        ? `${firstText.trim()}'s Signature`
        : "My Signature";

      const firstImageEl = state.elements?.find(
        (el): el is FreeImageElement => el.type === "image" && Boolean(el.url?.trim())
      );
      const firstLogoEl = state.elements?.find(
        (el): el is FreeLogoElement => el.type === "logo" && Boolean(el.url?.trim())
      );
      const trimmedAvatar = state.avatarUrl?.trim() || firstImageEl?.url?.trim() || "";
      const avatarUrl =
        trimmedAvatar === "/daniel-wilson.png" || trimmedAvatar.endsWith("/daniel-wilson.png")
          ? ""
          : trimmedAvatar;
      const companyLogoUrl = state.companyLogoUrl?.trim() || firstLogoEl?.url?.trim() || "";

      const payloadData: StudioSignatureData = {
        ...state,
        fullName: state.fullName?.trim() || firstText?.trim() || "",
        avatarUrl,
        companyLogoUrl,
        extras: [],
      };

      const saved = await repo.save({
        ...(editingSignatureId ? { id: editingSignatureId } : {}),
        name: sigName,
        templateId: "design-studio",
        data: payloadData,
      });

      // Clear active draft after successful save
      if (user?.id) {
        const activeDraftKey = editingSignatureId
          ? `sig_studio_draft_${user.id}_${editingSignatureId}`
          : `sig_studio_draft_${user.id}`;
        try {
          localStorage.removeItem(activeDraftKey);
        } catch {
          // ignore
        }
      }

      setEditingSignatureId(saved.id);
      currentEditingIdRef.current = saved.id;
      const fullSavedRecord: StudioSavedSignature = {
        id: saved.id,
        kind: "studio",
        templateId: "design-studio",
        templateVersion: saved.templateVersion ?? 1,
        name: saved.name || sigName,
        createdAt: saved.createdAt,
        updatedAt: saved.updatedAt,
        data: {
          ...payloadData,
          ...(saved.kind === "studio" ? saved.data : {}),
          canvas: payloadData.canvas,
          elements: payloadData.elements,
          design: payloadData.design,
        },
      };
      setSavedSignatureRecord(fullSavedRecord);
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
      const firstTextEl = state.elements?.find(
        (el): el is FreeTextElement => el.type === "text" && Boolean(el.text.trim())
      );
      const firstText = firstTextEl?.text;
      const sigName = state.fullName?.trim()
        ? `${state.fullName.trim()}'s Signature`
        : firstText?.trim()
        ? `${firstText.trim()}'s Signature`
        : "My Signature";

      const firstImageEl = state.elements?.find(
        (el): el is FreeImageElement => el.type === "image" && Boolean(el.url?.trim())
      );
      const firstLogoEl = state.elements?.find(
        (el): el is FreeLogoElement => el.type === "logo" && Boolean(el.url?.trim())
      );
      const trimmedAvatar = state.avatarUrl?.trim() || firstImageEl?.url?.trim() || "";
      const avatarUrl =
        trimmedAvatar === "/daniel-wilson.png" || trimmedAvatar.endsWith("/daniel-wilson.png")
          ? ""
          : trimmedAvatar;
      const companyLogoUrl = state.companyLogoUrl?.trim() || firstLogoEl?.url?.trim() || "";

      const payloadData: StudioSignatureData = {
        ...state,
        fullName: state.fullName?.trim() || firstText?.trim() || "",
        avatarUrl,
        companyLogoUrl,
        extras: [],
      };

      const updated = await repo.save({
        id: target.id,
        name: sigName,
        templateId: "design-studio",
        data: payloadData,
      });

      if (user?.id) {
        const activeDraftKey = editingSignatureId
          ? `sig_studio_draft_${user.id}_${editingSignatureId}`
          : `sig_studio_draft_${user.id}`;
        try {
          localStorage.removeItem(activeDraftKey);
        } catch {
          // ignore
        }
      }

      setLimitModalOpen(false);
      setEditingSignatureId(updated.id);
      currentEditingIdRef.current = updated.id;
      const fullUpdatedRecord: StudioSavedSignature = {
        id: updated.id,
        kind: "studio",
        templateId: "design-studio",
        templateVersion: updated.templateVersion ?? 1,
        name: updated.name || sigName,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
        data: {
          ...payloadData,
          ...(updated.kind === "studio" ? updated.data : {}),
          canvas: payloadData.canvas,
          elements: payloadData.elements,
          design: payloadData.design,
        },
      };
      setSavedSignatureRecord(fullUpdatedRecord);
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

  const selectedElement = state.elements?.find((el) => el.id === selectedId);
  const fullSignatureHtml = generateFreeHtml(state, { preview: true });

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

      {/* Sidebar */}
      <DashboardSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardTopBar
          userName={displayName}
          userEmail={user?.email || ""}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />

        {/* Mobile Segmented Control (< lg) */}
        <div className="flex lg:hidden items-center justify-center border-b border-[#E2E8F0] bg-white px-4 py-2 shrink-0">
          <div className="flex w-full max-w-xs rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMobileTab("canvas")}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                mobileTab === "canvas"
                  ? "bg-white text-[#245FD4] shadow-xs"
                  : "text-[#64748B] hover:text-[#1E293B]"
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
                  : "text-[#64748B] hover:text-[#1E293B]"
              }`}
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              Tools
            </button>
          </div>
        </div>

        {/* Studio Workspace: Split Left (Tools) and Right (Canvas) */}
        <div className="flex flex-1 min-h-0 overflow-hidden relative">
          {/* ======================================================== */}
          {/* LEFT: TOOLS PANEL */}
          {/* ======================================================== */}
          <aside
            aria-label="Studio customization tools"
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
                    {/* Add Text */}
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

                    {/* Add Image */}
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

                    {/* Add Logo */}
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

                    {/* Add Divider */}
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

                    {/* Social Icons */}
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

                    {/* CTA Button */}
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

                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {/* Add Banner */}
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
                </div>
              )}
            </div>

            {/* 7. QUICK ARRANGE (Previously Layout) */}
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
                  <div>
                    <span
                      className="text-sm font-bold text-[#1E293B] block leading-tight"
                      style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                    >
                      Quick Arrange
                    </span>
                    <span className="text-[10px] text-slate-400">Auto-align canvas elements</span>
                  </div>
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
                  <div className="grid grid-cols-1 min-[380px]:grid-cols-3 gap-2" role="radiogroup" aria-label="Quick Arrange">
                    {[
                      {
                        id: "single",
                        label: "Single",
                        desc: "Stacked vertically",
                        thumb: (
                          <div className="flex flex-col gap-1 items-center justify-center h-full w-full">
                            <div className="h-2 w-2 rounded-full bg-slate-400" />
                            <div className="h-1 w-6 bg-slate-300 rounded" />
                            <div className="h-1 w-4 bg-slate-300 rounded" />
                          </div>
                        ),
                      },
                      {
                        id: "two-column",
                        label: "Two Column",
                        desc: "Media left, details right",
                        thumb: (
                          <div className="flex items-center justify-center gap-1.5 h-full w-full">
                            <div className="h-4 w-3 bg-slate-300 rounded-xs" />
                            <div className="w-[1px] h-5 bg-slate-200" />
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
                        desc: "Tidy tight layout",
                        thumb: (
                          <div className="flex items-center justify-between w-full h-full px-1">
                            <div className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                            <div className="flex flex-col gap-0.5">
                              <div className="h-1 w-5 bg-slate-300 rounded" />
                              <div className="h-0.5 w-4 bg-slate-200 rounded" />
                            </div>
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
                          onClick={() => {
                            dispatch({
                              type: "ARRANGE_PRESET",
                              payload: {
                                preset: lay.id as "single" | "two-column" | "compact",
                              },
                            });
                            showToast(`Arranged as ${lay.label} (Ctrl+Z to undo)`);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              dispatch({
                                type: "ARRANGE_PRESET",
                                payload: {
                                  preset: lay.id as "single" | "two-column" | "compact",
                                },
                              });
                              showToast(`Arranged as ${lay.label} (Ctrl+Z to undo)`);
                            }
                          }}
                          className={`flex flex-col items-center justify-center rounded-[10px] border p-2 cursor-pointer transition select-none ${
                            isSelected
                              ? "border-[1.5px] border-[#245FD4] bg-[#EFF6FF]/40 shadow-xs"
                              : "border-[#E2E8F0] bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="h-7 w-full rounded border border-slate-200 bg-slate-50 flex items-center justify-center">
                            {lay.thumb}
                          </div>
                          <span className="mt-1 text-[11px] font-medium text-[#1E293B]">
                            {lay.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* TEAM FIELDS SECTION */}
            <div className="pb-2">
              <button
                type="button"
                onClick={() => toggleSection("teamFields")}
                aria-expanded={openSections.teamFields}
                className="flex w-full items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#EFF6FF] text-[#245FD4] shadow-2xs">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <span
                    className="text-sm font-bold text-[#1E293B]"
                    style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                  >
                    Team fields
                  </span>
                </div>
                <svg
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    openSections.teamFields ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openSections.teamFields && (
                <div className="mt-3.5">
                  <p
                    className="text-xs text-slate-500 mb-2.5 leading-relaxed"
                    style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                  >
                    Linked fields are replaced with each team member&apos;s own details.
                  </p>
                  <div className="space-y-1.5" role="list" aria-label="Team fields">
                    {(
                      [
                        { key: "name", label: "Name" },
                        { key: "jobTitle", label: "Job title" },
                        { key: "email", label: "Email" },
                        { key: "phone", label: "Phone" },
                        { key: "photo", label: "Photo" },
                      ] as const
                    ).map((field) => {
                      const linked = (state.elements || []).find(
                        (el) => "bind" in el && (el as { bind?: string }).bind === field.key
                      );
                      const isLinked = Boolean(linked);
                      const isSelected = linked && selectedId === linked.id;

                      return (
                        <button
                          key={field.key}
                          type="button"
                          onClick={() => {
                            if (!state.elements || state.elements.length === 0) {
                              dispatch({ type: "MIGRATE_FLOW_TO_FREE" });
                            }
                            if (linked) {
                              setSelectedId(linked.id);
                            } else {
                              showToast("Select an element and use Link to team field");
                            }
                          }}
                          className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition cursor-pointer border ${
                            isSelected
                              ? "bg-[#EFF6FF] text-[#245FD4] border-[#245FD4]/40 shadow-2xs font-semibold"
                              : "bg-white text-[#1E293B] border-slate-200/80 hover:bg-slate-50 hover:border-slate-300"
                          }`}
                          aria-label={`Team field ${field.label}: ${isLinked ? "linked" : "unlinked"}`}
                        >
                          <span className="text-[12px]">{field.label}</span>
                          <div className="flex items-center gap-1.5">
                            {isLinked ? (
                              <svg
                                className="h-4 w-4 text-emerald-600 shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-label="Linked"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <span
                                className="h-2 w-2 rounded-full bg-slate-300 shrink-0"
                                title="Not linked"
                                aria-label="Not linked"
                              />
                            )}
                          </div>
                        </button>
                      );
                    })}
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
                      <rect x="3" y="6" width="18" height="12" rx="3" />
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
                  <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2" role="radiogroup" aria-label="Button Styles">
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
                          onClick={() =>
                            dispatch({
                              type: "SET_BUTTON_STYLE",
                              payload: btn.id as StudioButtonStyle,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              dispatch({
                                type: "SET_BUTTON_STYLE",
                                payload: btn.id as StudioButtonStyle,
                              });
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

            {/* Row 2: Canvas Info on Left, Undo/Redo & Zoom Controls on Right */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-2 shrink-0 border-b border-slate-100">
              {/* Canvas Info */}
              <div className="flex items-center gap-2">
                <span
                  className="text-[13px] font-bold text-[#1E293B]"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  Design Canvas
                </span>
                <span className="text-xs text-[#94A3B8]">&bull;</span>
                <span
                  className="text-[13px] text-[#94A3B8]"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  {state.canvas?.width || 600}px &times; {state.canvas?.height || 200}px
                </span>
              </div>

              {/* Controls: Undo, Redo, Zoom Out, Reset, Zoom In, Fit */}
              <div className="flex items-center gap-1.5">
                {/* Undo Button */}
                <button
                  type="button"
                  disabled={historyState.past.length === 0}
                  onClick={() => dispatch({ type: "UNDO" })}
                  className={`flex h-7 w-7 items-center justify-center rounded-md border border-[#E2E8F0] bg-white text-xs font-semibold shadow-2xs transition ${
                    historyState.past.length > 0
                      ? "text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      : "text-slate-300 cursor-not-allowed opacity-50"
                  }`}
                  title="Undo (Ctrl/Cmd+Z)"
                  aria-label="Undo"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 7v6h6" />
                    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                  </svg>
                </button>

                {/* Redo Button */}
                <button
                  type="button"
                  disabled={historyState.future.length === 0}
                  onClick={() => dispatch({ type: "REDO" })}
                  className={`flex h-7 w-7 items-center justify-center rounded-md border border-[#E2E8F0] bg-white text-xs font-semibold shadow-2xs transition ${
                    historyState.future.length > 0
                      ? "text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      : "text-slate-300 cursor-not-allowed opacity-50"
                  }`}
                  title="Redo (Ctrl/Cmd+Shift+Z)"
                  aria-label="Redo"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 7v6h-6" />
                    <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
                  </svg>
                </button>

                <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

                {/* Zoom Out */}
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

                {/* Current Zoom (100%) */}
                <button
                  type="button"
                  onClick={() => setZoom(100)}
                  className="flex h-7 min-w-[48px] px-2 items-center justify-center rounded-md border border-[#E2E8F0] bg-white text-[11px] font-semibold text-[#1E293B] shadow-2xs hover:border-slate-300 transition"
                  title="Reset zoom to 100%"
                  aria-label="Reset zoom to 100%"
                >
                  {Math.round(zoom)}%
                </button>

                {/* Zoom In */}
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

                {/* Fit */}
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

            {/* Canvas Body: Free Interactive Canvas */}
            <div
              ref={canvasAreaRef}
              className="flex-1 overflow-auto flex flex-col items-center justify-start p-4 sm:p-8"
            >
              <FreeCanvas
                data={state}
                selectedId={selectedId}
                onSelect={setSelectedId}
                dispatch={dispatch}
                zoom={zoom}
                onToast={showToast}
              />

              {/* Portaled FloatingToolbar when an element is selected */}
              {selectedElement && (
                <FloatingToolbar
                  elementType={selectedElement.type}
                  bold={selectedElement.type === "text" ? selectedElement.bold : false}
                  onToggleBold={() =>
                    selectedElement.type === "text" &&
                    dispatch({
                      type: "UPDATE_ELEMENT",
                      payload: { id: selectedId!, updates: { bold: !selectedElement.bold } },
                    })
                  }
                  size={selectedElement.type === "text" ? selectedElement.size : "md"}
                  onSizeChange={(size) =>
                    selectedElement.type === "text" &&
                    dispatch({
                      type: "UPDATE_ELEMENT",
                      payload: { id: selectedId!, updates: { size } },
                    })
                  }
                  url={
                    selectedElement.type === "cta"
                      ? selectedElement.url
                      : (selectedElement as FreeImageElement).linkUrl || ""
                  }
                  onUrlChange={(newUrl) => {
                    if (selectedElement.type === "cta") {
                      dispatch({
                        type: "UPDATE_ELEMENT",
                        payload: { id: selectedId!, updates: { url: newUrl } },
                      });
                    } else {
                      dispatch({
                        type: "UPDATE_ELEMENT",
                        payload: { id: selectedId!, updates: { linkUrl: newUrl } },
                      });
                    }
                  }}
                  width={selectedElement.w}
                  onWidthChange={(w) =>
                    dispatch({
                      type: "RESIZE_ELEMENT",
                      payload: {
                        id: selectedId!,
                        x: selectedElement.x,
                        y: selectedElement.y,
                        w,
                        h: selectedElement.h,
                      },
                    })
                  }
                  orientation={
                    selectedElement.type === "divider"
                      ? selectedElement.orientation
                      : "horizontal"
                  }
                  onOrientationChange={(orientation) =>
                    selectedElement.type === "divider" &&
                    dispatch({
                      type: "UPDATE_ELEMENT",
                      payload: {
                        id: selectedId!,
                        updates: {
                          orientation,
                          w: orientation === "vertical" ? 1 : Math.max(40, selectedElement.w),
                          h: orientation === "vertical" ? Math.max(48, selectedElement.h) : 1,
                        },
                      },
                    })
                  }
                  thickness={
                    selectedElement.type === "divider" ? selectedElement.thickness : 1
                  }
                  onThicknessChange={(thickness) =>
                    selectedElement.type === "divider" &&
                    dispatch({
                      type: "UPDATE_ELEMENT",
                      payload: { id: selectedId!, updates: { thickness } },
                    })
                  }
                  onReplaceMedia={() => {
                    if (selectedElement.type === "logo") {
                      logoUploadInputRef.current?.click();
                    } else if (selectedElement.type === "banner") {
                      bannerUploadInputRef.current?.click();
                    } else {
                      imageUploadInputRef.current?.click();
                    }
                  }}
                  onDuplicate={() =>
                    dispatch({ type: "DUPLICATE_ELEMENT", payload: { id: selectedId! } })
                  }
                  onDelete={() => {
                    dispatch({ type: "REMOVE_ELEMENT", payload: { id: selectedId! } });
                    setSelectedId(null);
                    showToast("Element deleted");
                  }}
                  onAlignCanvas={(alignment) =>
                    selectedId && handleCanvasAlignment(selectedId, alignment)
                  }
                  locked={selectedElement.locked || false}
                  onToggleLock={() =>
                    dispatch({
                      type: "UPDATE_ELEMENT",
                      payload: { id: selectedId!, updates: { locked: !selectedElement.locked } },
                    })
                  }
                  onEditDetails={() => {
                    if (selectedElement.type === "social") {
                      setEditDetailsSection("socials");
                    } else {
                      setEditDetailsSection("all");
                    }
                    setIsEditDetailsOpen(true);
                  }}
                  elementId={selectedId}
                  x={selectedElement.x}
                  y={selectedElement.y}
                  h={selectedElement.h}
                  zoom={zoom}
                  bind={
                    selectedElement.type === "text" || selectedElement.type === "image"
                      ? (selectedElement as { bind?: TeamFieldBind }).bind
                      : undefined
                  }
                  onBindChange={(newBind) => {
                    if (selectedId) {
                      dispatch({
                        type: "LINK_TEAM_FIELD",
                        payload: {
                          id: selectedId,
                          field: newBind || undefined,
                        },
                      });
                    }
                  }}
                />
              )}

              {/* Autosave Status Footnote */}
              <div className="mt-8 mb-4 flex justify-center">
                <span
                  className="text-[11px] text-[#94A3B8]"
                  style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
                >
                  {saveStatus === "saving"
                    ? "Saving..."
                    : `All changes saved \u00B7 ${state.elements?.length || 0} elements`}
                </span>
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

      {/* Modals */}
      <PreviewSignatureModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        html={fullSignatureHtml}
        data={state}
      />

      <EditDetailsModal
        isOpen={isEditDetailsOpen}
        onClose={() => setIsEditDetailsOpen(false)}
        selectedId={selectedId}
        state={state}
        dispatch={dispatch}
        initialSection={editDetailsSection}
        onToast={showToast}
      />

      {savedSignatureRecord && (
        <SaveSuccessModal
          isOpen={Boolean(savedSignatureRecord)}
          onClose={() => setSavedSignatureRecord(null)}
          signature={savedSignatureRecord}
        />
      )}

      <LimitOverwriteModal
        isOpen={limitModalOpen}
        onClose={() => setLimitModalOpen(false)}
        signatures={allSignatures}
        onSelectOverwrite={handleSelectOverwrite}
      />

      <PremiumLockedModal
        isOpen={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
      />
    </div>
  );
}

export default function DesignStudioPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#FCFCFC] p-6">
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
      }
    >
      <DesignStudioContent />
    </Suspense>
  );
}
