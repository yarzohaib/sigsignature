import {
  StudioSignatureData,
  SignatureExtraItem,
  StudioShape,
  StudioTheme,
  StudioButtonStyle,
  StudioLayout,
  StudioSocialIconsStyle,
} from "@/types/studio";
import { PREMIUM_ENABLED } from "@/lib/premium";

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
  | { type: "SET_EXTRAS"; payload: SignatureExtraItem[] };

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
          item.id === action.payload.id
            ? ({ ...item, ...action.payload.item } as SignatureExtraItem)
            : item
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
      const index = currentExtras.findIndex((item) => item.id === action.payload.id);
      if (index === -1) return state;
      const original = currentExtras[index];
      const newId =
        action.payload.newId ||
        (typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `extra_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
      const duplicated: SignatureExtraItem = {
        ...original,
        id: newId,
      };
      const updated = [...currentExtras];
      updated.splice(index + 1, 0, duplicated);
      return {
        ...state,
        extras: updated,
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

    default:
      return state;
  }
}
