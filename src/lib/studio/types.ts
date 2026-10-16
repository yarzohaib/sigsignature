import {
  StudioSignatureData,
  SignatureExtraItem,
  FreeElement,
  StudioShape,
  StudioTheme,
  StudioButtonStyle,
  StudioLayout,
  StudioSocialIconsStyle,
} from "@/types/studio";
import { PREMIUM_ENABLED } from "@/lib/premium";
import { clampToCanvas, rectsOverlap, findFreeSpot, snap } from "./free/geometry";
import { arrangeElements } from "./free/arrange";

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
  | { type: "ADD_ELEMENT"; payload: FreeElement }
  | { type: "UPDATE_ELEMENT"; payload: { id: string; item?: Partial<FreeElement>; updates?: Partial<FreeElement> } }
  | { type: "MOVE_ELEMENT"; payload: { id: string; x: number; y: number } }
  | { type: "RESIZE_ELEMENT"; payload: { id: string; x: number; y: number; w: number; h: number } }
  | { type: "REMOVE_ELEMENT"; payload: { id: string } }
  | { type: "DUPLICATE_ELEMENT"; payload: { id: string; newId?: string } }
  | { type: "SET_CANVAS_HEIGHT"; payload: { height: number } }
  | { type: "ARRANGE_PRESET"; payload: { preset: "single" | "two-column" | "compact" } };

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
      return {
        ...state,
        design: {
          theme: state.design?.theme || "corporate",
          buttonStyle: state.design?.buttonStyle || "solid",
          shape: action.payload as StudioShape,
        },
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
      return {
        ...action.payload,
      };
    }

    case "UPDATE_SIGNATURE_FIELD": {
      return {
        ...state,
        [action.field]: action.value,
      };
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

    case "ADD_ELEMENT": {
      const currentElements = state.elements || [];
      if (currentElements.length >= 40) return state;

      const canvas = state.canvas || { width: 600, height: 200 };
      const clamped = clampToCanvas(action.payload, canvas);
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
      const patch = action.payload.updates ?? action.payload.item ?? {};
      const updatedCandidate = { ...target, ...patch } as FreeElement;
      const clamped = clampToCanvas(updatedCandidate, canvas);
      const finalEl = { ...updatedCandidate, ...clamped };

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

    case "MOVE_ELEMENT": {
      const currentElements = state.elements || [];
      const target = currentElements.find((el) => el.id === action.payload.id);
      if (!target || target.locked) return state;

      const canvas = state.canvas || { width: 600, height: 200 };
      const candidate = {
        ...target,
        x: snap(action.payload.x, 4),
        y: snap(action.payload.y, 4),
      };
      const clamped = clampToCanvas(candidate, canvas);
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
      const candidate = {
        ...target,
        x: snap(action.payload.x, 4),
        y: snap(action.payload.y, 4),
        w: Math.max(8, snap(action.payload.w, 4)),
        h: Math.max(8, snap(action.payload.h, 4)),
      };
      const clamped = clampToCanvas(candidate, canvas);
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
      const spot = findFreeSpot({ w: target.w, h: target.h }, currentElements, canvas);

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

    default:
      return state;
  }
}
