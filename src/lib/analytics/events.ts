/**
 * Typed Google Analytics & Tag Manager Custom Events
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Pushes arbitrary event payload to window.dataLayer safely
 */
export function pushDataLayerEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...params,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Update Google Consent Mode v2 state dynamically
 */
export function updateConsentMode(granted: boolean) {
  if (typeof window === "undefined") return;
  const status = granted ? "granted" : "denied";

  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      ad_storage: status,
      ad_user_data: status,
      ad_personalization: status,
      analytics_storage: status,
    });
  }

  pushDataLayerEvent("consent_update", {
    consent_status: status,
  });
}

/**
 * Track when a user generates or exports an email signature
 */
export function trackSignatureExport(method: "copy_html" | "export_png" | "direct_copy", templateId?: string) {
  pushDataLayerEvent("signature_export", {
    export_method: method,
    template_id: templateId || "unknown",
  });
}

/**
 * Track when a user clicks the waitlist CTA
 */
export function trackWaitlistClick(tier: "free" | "premium") {
  pushDataLayerEvent("waitlist_click", {
    tier,
  });
}

/**
 * Track when a user switches between templates or styles
 */
export function trackTemplateSelect(templateId: string) {
  pushDataLayerEvent("template_select", {
    template_id: templateId,
  });
}
