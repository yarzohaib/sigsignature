export type ToastType = "copied" | "dark" | "info" | "error" | "success";

export interface ToastAction {
  label: string;
  href: string;
}

export interface ToastOptions {
  id?: string;
  type?: ToastType;
  title?: string;
  message?: string;
  subtitle?: string;
  action?: ToastAction;
  duration?: number; // ms, default 4000ms (or 4500ms for copied)
}

export interface ToastItem extends ToastOptions {
  id: string;
  type: ToastType;
  createdAt: number;
}

export function showToast(options: ToastOptions | string): string {
  if (typeof window === "undefined") return "";

  const id =
    typeof options === "string"
      ? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      : options.id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const item: ToastItem =
    typeof options === "string"
      ? {
          id,
          type: "dark",
          message: options,
          duration: 4000,
          createdAt: Date.now(),
        }
      : {
          id,
          type: options.type || "dark",
          title: options.title,
          message: options.message,
          subtitle: options.subtitle,
          action: options.action,
          duration: options.duration ?? (options.type === "copied" ? 4500 : 4000),
          createdAt: Date.now(),
        };

  window.dispatchEvent(
    new CustomEvent("sig_global_toast", {
      detail: item,
    })
  );

  return id;
}

export function dismissToast(id: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("sig_global_toast_dismiss", {
      detail: id,
    })
  );
}

export const toast = {
  show: showToast,
  dismiss: dismissToast,
  dark: (message: string, duration?: number) =>
    showToast({ type: "dark", message, duration }),
  success: (message: string, duration?: number) =>
    showToast({ type: "success", message, duration }),
  error: (message: string, duration?: number) =>
    showToast({ type: "error", message, duration }),
  info: (message: string, duration?: number) =>
    showToast({ type: "info", message, duration }),
  copied: (
    title = "Signature copied!",
    subtitle = "Paste it into your email client settings.",
    duration = 4500
  ) => showToast({ type: "copied", title, subtitle, duration }),
};
