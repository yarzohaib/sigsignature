import {
  StudioSignatureData,
  SignatureExtraItem,
  FreeElement,
  FreeTextElement,
  FreeImageElement,
  StudioShape,
  StudioTheme,
  StudioButtonStyle,
  StudioLayout,
  StudioSocialIconsStyle,
} from "@/types/studio";
import { PREMIUM_ENABLED } from "@/lib/premium";
import { clampToCanvas, rectsOverlap, findFreeSpot, snap } from "./free/geometry";
import { arrangeElements } from "./free/arrange";
import { migrateFlowToFree } from "./free/migrate";
import { getSocialIconSize } from "./shared";
import { validateSocialUrl, TeamMemberSocialPlatform } from "@/lib/team/socials";

export type {
  StudioShape,
  StudioTheme,
  StudioButtonStyle,
  StudioLayout,
  StudioSocialIconsStyle,
};
export type StudioFont = "Inter" | "Roboto" | "Georgia" | "DM Sans";
export type StudioSocialStyle = StudioSocialIconsStyle;

export const ALLOWED_STUDIO_FONTS: StudioFont[] = [
  "Inter",
  "Roboto",
  "Georgia",
  "DM Sans",
];

export const ALLOWED_STUDIO_SHAPES: StudioShape[] = [
  "rounded",
  "square",
  "pill",
];

export const ALLOWED_STUDIO_THEMES: StudioTheme[] = [
  "corporate",
  "minimal",
  "modern",
  "dark",
];

export const ALLOWED_STUDIO_BUTTON_STYLES: StudioButtonStyle[] = [
  "solid",
  "outline",
];

export const ALLOWED_STUDIO_LAYOUTS: StudioLayout[] = [
  "single",
  "two-column",
  "compact",
];

export const ALLOWED_STUDIO_SOCIAL_STYLES: StudioSocialStyle[] = [
  "filled",
  "outline",
  "minimal",
];

export const INITIAL_STUDIO_DATA: StudioSignatureData = {
  fullName: "",
  jobTitle: "",
  companyName: "",
  email: "",
  phone: "",
  website: "",
  avatarUrl: "",
  companyLogoUrl: "",
  themeColor: "#245FD4",
  fontFamily: "Inter",
  layout: "two-column",
  socialIconsStyle: "filled",
  design: {
    theme: "corporate",
    shape: "rounded",
    buttonStyle: "solid",
  },
  socials: {
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
  },
  optional: {
    address: "",
    tagline: "",
    disclaimer: "",
  },
  extras: [],
  canvas: { width: 600, height: 200 },
  elements: [],
};

export type StudioAction =
  | { type: "SET_FONT"; payload: string; isPremium?: boolean }
  | { type: "SET_COLOR"; payload: string; isPremium?: boolean }
  | { type: "SET_SHAPE"; payload: string; isPremium?: boolean }
  | { type: "SET_SOCIAL_STYLE"; payload: string; isPremium?: boolean }
  | { type: "SET_THEME"; payload: string; isPremium?: boolean }
  | { type: "SET_LAYOUT"; payload: string; isPremium?: boolean }
  | { type: "SET_BUTTON_STYLE"; payload: string; isPremium?: boolean }
  | { type: "SET_FULL_STATE"; payload: StudioSignatureData }
  | {
      type: "UPDATE_SIGNATURE_FIELD";
      field: keyof StudioSignatureData;
      value: unknown;
    }
  | { type: "ADD_EXTRA"; payload: SignatureExtraItem }
  | {
      type: "UPDATE_EXTRA";
      payload: { id: string; item: Partial<SignatureExtraItem> };
    }
  | { type: "REMOVE_EXTRA"; payload: { id: string } }
  | { type: "DUPLICATE_EXTRA"; payload: { id: string; newId?: string } }
  | { type: "MOVE_EXTRA_UP"; payload: { id: string } }
  | { type: "MOVE_EXTRA_DOWN"; payload: { id: string } }
  | { type: "SET_EXTRAS"; payload: SignatureExtraItem[] }
  | { type: "CLEAR_ELEMENTS" }
  | { type: "ADD_ELEMENT"; payload: FreeElement }
  | { type: "UPDATE_ELEMENT"; payload: { id: string; item?: Partial<FreeElement>; updates?: Partial<FreeElement> } }
  | { type: "MOVE_ELEMENT"; payload: { id: string; x: number; y: number } }
  | { type: "RESIZE_ELEMENT"; payload: { id: string; x: number; y: number; w: number; h: number } }
  | { type: "REMOVE_ELEMENT"; payload: { id: string } }
  | { type: "DUPLICATE_ELEMENT"; payload: { id: string; newId?: string } }
  | { type: "SET_CANVAS_HEIGHT"; payload: { height: number } }
  | { type: "ARRANGE_PRESET"; payload: { preset: "single" | "two-column" | "compact" } }
  | {
      type: "LINK_TEAM_FIELD";
      payload: {
        id: string;
        field?: "name" | "jobTitle" | "email" | "phone" | "photo" | "company" | "website";
      };
    }
  | { type: "SPLIT_TEXT_ELEMENT"; payload: { id: string; text?: string } }
  | { type: "UNGROUP_SOCIAL_ELEMENT"; payload: { id: string } }
  | { type: "COMMIT_TEXT_EDIT"; payload: { id: string; text: string; height: number } }
  | { type: "MIGRATE_FLOW_TO_FREE" };

export function studioReducer(
  state: StudioSignatureData,
  action: StudioAction
): StudioSignatureData {
  const isPremiumUser =
    ("isPremium" in action && Boolean(action.isPremium)) || PREMIUM_ENABLED;

  switch (action.type) {
    case "SET_FONT": {
      if (!isPremiumUser && !ALLOWED_STUDIO_FONTS.includes(action.payload as StudioFont)) {
        return state;
      }
      return {
        ...state,
        fontFamily: action.payload,
      };
    }

    case "SET_COLOR": {
      return {
        ...state,
        themeColor: action.payload,
      };
    }

    case "SET_SHAPE": {
      if (!isPremiumUser && !ALLOWED_STUDIO_SHAPES.includes(action.payload as StudioShape)) {
        return state;
      }
      const newShape = action.payload as StudioShape;
      const canvas = state.canvas || { width: 600, height: 200 };

      // Clamping elements to keep within active shape bounds (e.g. pill curves)
      const adjustedElements = (state.elements || []).map((el) => {
        const clamped = clampToCanvas(el, canvas, newShape);
        return { ...el, ...clamped };
      });

      return {
        ...state,
        design: {
          theme: state.design?.theme || "corporate",
          buttonStyle: state.design?.buttonStyle || "solid",
          shape: newShape,
        },
        elements: adjustedElements,
      };
    }

    case "SET_SOCIAL_STYLE": {
      if (!isPremiumUser && !ALLOWED_STUDIO_SOCIAL_STYLES.includes(action.payload as StudioSocialStyle)) {
        return state;
      }
      return {
        ...state,
        socialIconsStyle: action.payload as StudioSocialStyle,
      };
    }

    case "SET_THEME": {
      if (!isPremiumUser && !ALLOWED_STUDIO_THEMES.includes(action.payload as StudioTheme)) {
        return state;
      }
      return {
        ...state,
        design: {
          shape: state.design?.shape || "rounded",
          buttonStyle: state.design?.buttonStyle || "solid",
          theme: action.payload as StudioTheme,
        },
      };
    }

    case "SET_LAYOUT": {
      if (!isPremiumUser && !ALLOWED_STUDIO_LAYOUTS.includes(action.payload as StudioLayout)) {
        return state;
      }
      return {
        ...state,
        layout: action.payload as StudioLayout,
      };
    }

    case "SET_BUTTON_STYLE": {
      if (!isPremiumUser && !ALLOWED_STUDIO_BUTTON_STYLES.includes(action.payload as StudioButtonStyle)) {
        return state;
      }
      return {
        ...state,
        design: {
          theme: state.design?.theme || "corporate",
          shape: state.design?.shape || "rounded",
          buttonStyle: action.payload as StudioButtonStyle,
        },
      };
    }

    case "SET_FULL_STATE": {
      const nextState = { ...action.payload };
      const canvas = nextState.canvas || { width: 600, height: 200 };
      return {
        ...nextState,
        elements: (nextState.elements || []).map((element) => ({
          ...element,
          ...clampToCanvas(element, canvas),
        })),
      };
    }

    case "UPDATE_SIGNATURE_FIELD": {
      const nextState = {
        ...state,
        [action.field]: action.value,
      };
      if (action.field === "socials" && typeof action.value === "object" && action.value !== null) {
        const socials = action.value as Record<string, string | undefined>;
        const activeCount = Object.values(socials).filter((v) => typeof v === "string" && v.trim()).length;
        if (activeCount > 0) {
          const targetW = Math.max(36, Math.min(280, activeCount * 36 + (activeCount - 1) * 10));
          nextState.elements = (nextState.elements || []).map((el) => {
            if (el.type === "social") {
              return { ...el, w: targetW };
            }
            return el;
          });
        }
      }
      return nextState;
    }

    case "ADD_EXTRA": {
      const currentExtras = state.extras || [];
      if (currentExtras.length >= 20) return state;
      return {
        ...state,
        extras: [...currentExtras, action.payload],
      };
    }

    case "UPDATE_EXTRA": {
      const currentExtras = state.extras || [];
      return {
        ...state,
        extras: currentExtras.map((item) =>
          item.id === action.payload.id ? ({ ...item, ...action.payload.item } as SignatureExtraItem) : item
        ),
      };
    }

    case "REMOVE_EXTRA": {
      const currentExtras = state.extras || [];
      return {
        ...state,
        extras: currentExtras.filter((item) => item.id !== action.payload.id),
      };
    }

    case "DUPLICATE_EXTRA": {
      const currentExtras = state.extras || [];
      if (currentExtras.length >= 20) return state;
      const target = currentExtras.find((item) => item.id === action.payload.id);
      if (!target) return state;
      const duplicatedItem = {
        ...target,
        id: action.payload.newId || `extra_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      };
      const index = currentExtras.findIndex((item) => item.id === action.payload.id);
      const nextExtras = [...currentExtras];
      nextExtras.splice(index + 1, 0, duplicatedItem);
      return {
        ...state,
        extras: nextExtras,
      };
    }

    case "MOVE_EXTRA_UP": {
      const currentExtras = state.extras || [];
      const index = currentExtras.findIndex((item) => item.id === action.payload.id);
      if (index <= 0) return state;
      const updated = [...currentExtras];
      const [item] = updated.splice(index, 1);
      updated.splice(index - 1, 0, item);
      return {
        ...state,
        extras: updated,
      };
    }

    case "MOVE_EXTRA_DOWN": {
      const currentExtras = state.extras || [];
      const index = currentExtras.findIndex((item) => item.id === action.payload.id);
      if (index === -1 || index >= currentExtras.length - 1) return state;
      const updated = [...currentExtras];
      const [item] = updated.splice(index, 1);
      updated.splice(index + 1, 0, item);
      return {
        ...state,
        extras: updated,
      };
    }

    case "SET_EXTRAS": {
      return {
        ...state,
        extras: action.payload.slice(0, 20),
      };
    }

    // ==========================================
    // FREE CANVAS ACTIONS
    // ==========================================

    case "CLEAR_ELEMENTS": {
      if (!state.elements?.length) return state;
      return {
        ...state,
        elements: [],
      };
    }

    case "ADD_ELEMENT": {
      const currentElements = state.elements || [];
      if (currentElements.length >= 40) return state;

      const canvas = state.canvas || { width: 600, height: 200 };
      const currentShape = state.design?.shape || "rounded";
      const effectiveCanvas = { ...canvas, height: Math.max(canvas.height, 480) };
      const clamped = clampToCanvas(action.payload, effectiveCanvas, currentShape);
      const newEl = { ...action.payload, ...clamped };

      if (currentElements.some((other) => rectsOverlap(newEl, other))) {
        return state;
      }

      const nextElements = [...currentElements, newEl];
      const maxBottom = nextElements.reduce((max, el) => Math.max(max, el.y + el.h), 0);
      const nextHeight = Math.max(canvas.height, Math.min(480, snap(maxBottom + 24, 8)));

      return {
        ...state,
        canvas: { width: 600, height: nextHeight },
        elements: nextElements,
      };
    }

    case "UPDATE_ELEMENT": {
      const currentElements = state.elements || [];
      const target = currentElements.find((el) => el.id === action.payload.id);
      if (!target) return state;

      const canvas = state.canvas || { width: 600, height: 200 };
      const currentShape = state.design?.shape || "rounded";
      const patch = action.payload.updates ?? action.payload.item ?? {};
      const updatedCandidate = { ...target, ...patch } as FreeElement;
      const clamped = clampToCanvas(updatedCandidate, canvas, currentShape);
      const finalEl = { ...updatedCandidate, ...clamped };

      const isGeometryChange =
        patch.x !== undefined ||
        patch.y !== undefined ||
        patch.w !== undefined ||
        patch.h !== undefined;

      if (isGeometryChange) {
        const others = currentElements.filter((el) => el.id !== action.payload.id);
        if (others.some((other) => rectsOverlap(finalEl, other))) {
          return state;
        }
      }

      const nextElements = currentElements.map((el) =>
        el.id === action.payload.id ? finalEl : el
      );
      const maxBottom = nextElements.reduce((max, el) => Math.max(max, el.y + el.h), 0);
      const nextHeight = Math.max(canvas.height, Math.min(480, snap(maxBottom + 24, 8)));

      return {
        ...state,
        canvas: { width: 600, height: nextHeight },
        elements: nextElements,
      };
    }

    case "MOVE_ELEMENT": {
      const currentElements = state.elements || [];
      const target = currentElements.find((el) => el.id === action.payload.id);
      if (!target || target.locked) return state;

      const canvas = state.canvas || { width: 600, height: 200 };
      const currentShape = state.design?.shape || "rounded";
      const candidate = {
        ...target,
        x: snap(action.payload.x, 4),
        y: snap(action.payload.y, 4),
      };
      const clamped = clampToCanvas(candidate, canvas, currentShape);
      const finalEl = { ...candidate, ...clamped };

      const others = currentElements.filter((el) => el.id !== action.payload.id);
      if (others.some((other) => rectsOverlap(finalEl, other))) {
        return state;
      }

      const nextElements = currentElements.map((el) =>
        el.id === action.payload.id ? finalEl : el
      );
      const maxBottom = nextElements.reduce((max, el) => Math.max(max, el.y + el.h), 0);
      const nextHeight = Math.max(canvas.height, Math.min(480, snap(maxBottom + 24, 8)));

      return {
        ...state,
        canvas: { width: 600, height: nextHeight },
        elements: nextElements,
      };
    }

    case "RESIZE_ELEMENT": {
      const currentElements = state.elements || [];
      const target = currentElements.find((el) => el.id === action.payload.id);
      if (!target || target.locked) return state;

      const canvas = state.canvas || { width: 600, height: 200 };
      const currentShape = state.design?.shape || "rounded";
      const candidate = {
        ...target,
        x: snap(action.payload.x, 4),
        y: snap(action.payload.y, 4),
        w: Math.max(8, snap(action.payload.w, 4)),
        h: Math.max(8, snap(action.payload.h, 4)),
      };
      const clamped = clampToCanvas(candidate, canvas, currentShape);
      const finalEl = { ...candidate, ...clamped };

      const others = currentElements.filter((el) => el.id !== action.payload.id);
      if (others.some((other) => rectsOverlap(finalEl, other))) {
        return state;
      }

      const nextElements = currentElements.map((el) =>
        el.id === action.payload.id ? finalEl : el
      );
      const maxBottom = nextElements.reduce((max, el) => Math.max(max, el.y + el.h), 0);
      const nextHeight = Math.max(canvas.height, Math.min(480, snap(maxBottom + 24, 8)));

      return {
        ...state,
        canvas: { width: 600, height: nextHeight },
        elements: nextElements,
      };
    }

    case "REMOVE_ELEMENT": {
      const currentElements = state.elements || [];
      return {
        ...state,
        elements: currentElements.filter((el) => el.id !== action.payload.id),
      };
    }

    case "DUPLICATE_ELEMENT": {
      const currentElements = state.elements || [];
      if (currentElements.length >= 40) return state;

      const target = currentElements.find((el) => el.id === action.payload.id);
      if (!target) return state;

      const canvas = state.canvas || { width: 600, height: 200 };
      const currentShape = state.design?.shape || "rounded";
      const spot = findFreeSpot({ w: target.w, h: target.h }, currentElements, canvas, currentShape);

      const newEl: FreeElement = {
        ...target,
        id:
          action.payload.newId ||
          `el_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        x: spot.x,
        y: spot.y,
        locked: false,
      };

      const nextElements = [...currentElements, newEl];
      const maxBottom = nextElements.reduce((max, el) => Math.max(max, el.y + el.h), 0);
      const nextHeight = Math.max(canvas.height, Math.min(480, snap(maxBottom + 24, 8)));

      return {
        ...state,
        canvas: { width: 600, height: nextHeight },
        elements: nextElements,
      };
    }

    case "SET_CANVAS_HEIGHT": {
      const currentElements = state.elements || [];
      const minFromElements = currentElements.reduce(
        (max, el) => Math.max(max, el.y + el.h),
        120
      );
      const height = Math.max(
        120,
        Math.min(480, Math.max(minFromElements, snap(action.payload.height, 8)))
      );

      return {
        ...state,
        canvas: { width: 600, height },
      };
    }

    case "ARRANGE_PRESET": {
      const currentElements = state.elements || [];
      const canvas = state.canvas || { width: 600, height: 200 };
      const result = arrangeElements(action.payload.preset, currentElements, canvas.width);

      return {
        ...state,
        layout: action.payload.preset,
        canvas: { width: 600, height: result.canvasHeight },
        elements: result.elements,
      };
    }

    case "MIGRATE_FLOW_TO_FREE": {
      if (state.elements && state.elements.length > 0) return state;
      return migrateFlowToFree(state);
    }

    case "LINK_TEAM_FIELD": {
      const currentElements = state.elements || [];
      const { id, field } = action.payload;
      const target = currentElements.find((el) => el.id === id);
      if (!target) return state;

      const nextElements: FreeElement[] = currentElements.map((el) => {
        if (el.id === id) {
          if (!field) {
            const copy = { ...el };
            delete (copy as { bind?: string }).bind;
            return copy as FreeElement;
          }
          if (el.type === "text" && field !== "photo") {
            const updated: FreeTextElement = { ...el, bind: field };
            if (field === "phone" || field === "email" || field === "website") {
              updated.icon = field;
            } else {
              delete updated.icon;
            }
            return updated;
          }
          if (el.type === "image" && field === "photo") {
            const updated: FreeImageElement = { ...el, bind: "photo" };
            return updated;
          }
          return el;
        }
        if (field && "bind" in el && (el as { bind?: string }).bind === field) {
          const copy = { ...el };
          delete (copy as { bind?: string }).bind;
          return copy as FreeElement;
        }
        return el;
      });

      return {
        ...state,
        elements: nextElements,
      };
    }

    case "SPLIT_TEXT_ELEMENT": {
      const currentElements = state.elements || [];
      const target = currentElements.find((el) => el.id === action.payload.id);
      if (!target || target.type !== "text") return state;
      const textEl = target as FreeTextElement;
      const textToSplit = action.payload.text !== undefined ? action.payload.text : (textEl.text || "");
      const lines = textToSplit.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length <= 1) return state;

      const baseH = textEl.size === "lg" ? 24 : textEl.size === "sm" ? 18 : 20;
      let currY = textEl.y;

      const firstEl: FreeTextElement = {
        ...textEl,
        text: lines[0],
        h: baseH,
      };

      const newElements: FreeElement[] = [firstEl];
      currY += baseH + 4;

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const isEmail = line.includes("@") && !line.includes(" ");
        const isPhone = /^[\d+\-\s()]{6,}$/.test(line);
        const subH = 18;

        const subEl: FreeTextElement = {
          id: `split_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
          type: "text",
          x: textEl.x,
          y: currY,
          w: textEl.w,
          h: subH,
          text: line,
          size: "sm",
          bold: false,
          align: textEl.align || "left",
          fontFamily: textEl.fontFamily,
          color: textEl.color,
          ...(isEmail
            ? { bind: "email" as const, icon: "email" as const }
            : isPhone
            ? { bind: "phone" as const, icon: "phone" as const }
            : {}),
        };
        newElements.push(subEl);
        currY += subH + 4;
      }

      const resultElements: FreeElement[] = [];
      for (const el of currentElements) {
        if (el.id === action.payload.id) {
          resultElements.push(...newElements);
        } else {
          resultElements.push(el);
        }
      }

      return {
        ...state,
        elements: resultElements,
      };
    }

    case "UNGROUP_SOCIAL_ELEMENT": {
      const currentElements = state.elements || [];
      const target = currentElements.find((el) => el.id === action.payload.id);
      if (!target || target.type !== "social") return state;
      const socialEl = target as FreeSocialElement;
      // If already a single icon element, do nothing
      if (socialEl.platform) return state;

      const allNetworks: Array<{
        key: "linkedin" | "twitter" | "facebook" | "instagram" | "github";
        platform: TeamMemberSocialPlatform;
      }> = [
        { key: "linkedin", platform: "linkedin" },
        { key: "twitter", platform: "x" },
        { key: "facebook", platform: "facebook" },
        { key: "instagram", platform: "instagram" },
        { key: "github", platform: "github" },
      ];

      const hasAnySocial = allNetworks.some((n) => Boolean(state.socials?.[n.key]?.trim()));
      const activeNetworks = allNetworks.filter((n) => {
        const val = state.socials?.[n.key]?.trim();
        if (!val) return false;
        return !validateSocialUrl(n.platform, val);
      });

      const displayNetworks =
        activeNetworks.length > 0
          ? activeNetworks
          : hasAnySocial
          ? []
          : allNetworks;

      if (displayNetworks.length <= 1) return state;

      const iconSize = getSocialIconSize(target.w, displayNetworks.length);
      const iconGap = Math.round(iconSize * 0.3);

      const newElements: FreeSocialElement[] = [];
      let currX = target.x;

      for (let i = 0; i < displayNetworks.length; i++) {
        const net = displayNetworks[i];
        const newEl: FreeSocialElement = {
          id: i === 0 ? target.id : `social_${net.key}_${Date.now()}_${i}`,
          type: "social",
          platform: net.key,
          x: currX,
          y: target.y,
          w: iconSize,
          h: iconSize,
          locked: false,
        };
        newElements.push(newEl);
        currX += iconSize + iconGap;
      }

      const resultElements: FreeElement[] = [];
      for (const el of currentElements) {
        if (el.id === action.payload.id) {
          resultElements.push(...newElements);
        } else {
          resultElements.push(el);
        }
      }

      return {
        ...state,
        elements: resultElements,
      };
    }

    case "COMMIT_TEXT_EDIT": {
      const currentElements = state.elements || [];
      const target = currentElements.find((el) => el.id === action.payload.id);
      if (!target || target.type !== "text") return state;

      const newText = action.payload.text;
      const minHeight = target.size === "lg" ? 28 : target.size === "sm" ? 20 : 24;
      const targetHeight = Math.max(minHeight, snap(action.payload.height, 4));
      const deltaH = targetHeight - target.h;

      let nextElements: FreeElement[];

      if (deltaH > 0) {
        // Elements horizontally intersecting and positioned below target
        const pushIds = new Set(
          currentElements
            .filter(
              (other) =>
                other.id !== target.id &&
                other.x < target.x + target.w &&
                other.x + other.w > target.x &&
                other.y >= target.y + target.h - 4
            )
            .map((el) => el.id)
        );

        nextElements = currentElements.map((el) => {
          if (el.id === target.id) {
            return { ...el, text: newText, h: targetHeight };
          }
          if (pushIds.has(el.id)) {
            return { ...el, y: el.y + deltaH };
          }
          return el;
        });
      } else {
        nextElements = currentElements.map((el) =>
          el.id === target.id ? { ...el, text: newText, h: targetHeight } : el
        );
      }

      const canvas = state.canvas || { width: 600, height: 200 };
      const maxBottom = nextElements.reduce((max, el) => Math.max(max, el.y + el.h), 0);
      const nextHeight = Math.max(canvas.height, Math.min(480, snap(maxBottom + 24, 8)));

      return {
        ...state,
        canvas: { width: 600, height: nextHeight },
        elements: nextElements,
      };
    }

    default:
      return state;
  }
}
