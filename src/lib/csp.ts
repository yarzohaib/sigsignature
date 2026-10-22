/**
 * Content Security Policy (CSP) & HTTP Security Headers Configuration
 *
 * Directives are built from a structured, readable array for straightforward auditing
 * and maintenance.
 */

export interface CspDirective {
  name: string;
  values: string[];
}

function getOrigin(urlString: string | undefined, fallback: string): string {
  if (!urlString) return fallback;
  try {
    const url = new URL(urlString.startsWith("http") ? urlString : `https://${urlString}`);
    return url.origin;
  } catch {
    return fallback;
  }
}

/**
 * Builds the array of CSP directives based on environment.
 */
export function buildCspDirectives(
  isDev: boolean = process.env.NODE_ENV !== "production",
  isEnforced: boolean = process.env.CSP_ENFORCE === "true"
): CspDirective[] {
  // Derive API and S3 upload hosts from environment variables (never hardcoded IPs)
  const apiOrigin = getOrigin(
    process.env.NEXT_PUBLIC_API_URL || process.env.API_URL,
    "https://api.sigsignature.com"
  );

  const s3UploadOrigin = getOrigin(
    process.env.NEXT_PUBLIC_ASSET_BASE_URL || process.env.S3_PUBLIC_BASE_URL,
    "https://sigsignature-prod-assets-2026.s3.ap-southeast-2.amazonaws.com"
  );

  return [
    // 1. default-src: Fallback for all resource types
    {
      name: "default-src",
      values: ["'self'"],
    },

    // 2. script-src: self + unsafe-inline (needed for Next.js hydration).
    //    'unsafe-eval' is ONLY enabled in development for HMR / hot-reload.
    //    TODO: Move to strict nonces (via Next.js middleware) once dynamic nonces are supported without de-optimizing static page prerendering.
    {
      name: "script-src",
      values: [
        "'self'",
        "'unsafe-inline'",
        ...(isDev ? ["'unsafe-eval'"] : []),
      ],
    },

    // 3. style-src: self + unsafe-inline for Tailwind and CSS-in-JS style tags, plus Google Fonts stylesheets
    {
      name: "style-src",
      values: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
      ],
    },

    // 4. img-src: self, data:, blob:, S3 uploads host, OAuth avatar providers (Google, GitHub), and Cloudinary
    {
      name: "img-src",
      values: [
        "'self'",
        "data:",
        "blob:",
        s3UploadOrigin,
        "https://*.googleusercontent.com",
        "https://*.githubusercontent.com",
        "https://res.cloudinary.com",
      ],
    },

    // 5. font-src: self, data:, and Google Fonts gstatic (used by live email signature preview iframe)
    {
      name: "font-src",
      values: [
        "'self'",
        "data:",
        "https://fonts.gstatic.com",
      ],
    },

    // 6. connect-src: self, API base URL, S3 upload host (PUT presigned uploads), font stylesheets, and dev servers
    {
      name: "connect-src",
      values: [
        "'self'",
        apiOrigin,
        s3UploadOrigin,
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com",
        ...(isDev
          ? [
              "http://localhost:*",
              "http://127.0.0.1:*",
              "ws://localhost:*",
              "ws://127.0.0.1:*",
              "wss://localhost:*",
            ]
          : []),
      ],
    },

    // 7. frame-src: Cloudflare Turnstile host (challenges.cloudflare.com) only if used on login/signup; otherwise 'none'
    {
      name: "frame-src",
      values: ["'none'"],
    },

    // 8. object-src: Restrict plugins like Flash or Java
    {
      name: "object-src",
      values: ["'none'"],
    },

    // 9. base-uri: Restricts URLs that can appear in a document's <base> element
    {
      name: "base-uri",
      values: ["'self'"],
    },

    // 10. form-action: Restricts targets for form submissions
    {
      name: "form-action",
      values: ["'self'"],
    },

    // 11. frame-ancestors: Prevents clickjacking by embedding (only allowed in enforced policy; browsers reject in report-only)
    ...(isEnforced
      ? [
          {
            name: "frame-ancestors",
            values: ["'self'"],
          },
        ]
      : []),

    // 12. upgrade-insecure-requests: Enforce HTTPS in production (only allowed in enforced policy; browsers reject in report-only)
    ...(isEnforced && !isDev ? [{ name: "upgrade-insecure-requests", values: [] }] : []),
  ];
}

/**
 * Serializes the CSP directive array into a single standard header string.
 */
export function generateCsp(
  isDev: boolean = process.env.NODE_ENV !== "production",
  isEnforced: boolean = process.env.CSP_ENFORCE === "true"
): string {
  const directives = buildCspDirectives(isDev, isEnforced);
  return directives
    .map((d) => (d.values.length > 0 ? `${d.name} ${d.values.join(" ")}` : d.name))
    .join("; ");
}

/**
 * Returns the CSP header key and value.
 * Controlled by CSP_ENFORCE env flag (false by default -> Content-Security-Policy-Report-Only).
 */
export function getCspHeader(isDev: boolean = process.env.NODE_ENV !== "production"): {
  key: string;
  value: string;
} {
  const isEnforced = process.env.CSP_ENFORCE === "true";
  const key = isEnforced ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only";
  const value = generateCsp(isDev, isEnforced);
  return { key, value };
}

/**
 * Returns all HTTP security headers for next.config.ts headers() function.
 */
export function getSecurityHeaders(isDev: boolean = process.env.NODE_ENV !== "production") {
  const csp = getCspHeader(isDev);

  return [
    {
      key: "X-Content-Type-Options",
      value: "nosniff",
    },
    {
      key: "X-Frame-Options",
      value: "SAMEORIGIN",
    },
    {
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
    },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=(), clipboard-write=(self)",
    },
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains",
    },
    {
      key: "Cross-Origin-Opener-Policy",
      value: "same-origin",
    },
    {
      key: csp.key,
      value: csp.value,
    },
  ];
}
