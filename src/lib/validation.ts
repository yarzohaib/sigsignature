/**
 * Global input validation helpers and maximum character lengths
 */

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates whether an email string matches standard email formatting.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Sanitizes phone input: ensures NO letters (a-z, A-Z) or invalid characters are accepted.
 * Only digits (0-9) and standard phone formatting (+, -, space, (, )) are retained.
 */
export function sanitizePhone(val: string): string {
  if (!val || typeof val !== "string") return "";
  return val.replace(/[^\d+\s\-()]/g, "").replace(/^\s+/, "");
}

/**
 * Validates whether a phone number has a realistic digit count (at least 6 digits, max 15 digits according to ITU-T E.164).
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== "string") return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 6 && digits.length <= 15;
}

/** Accepts a public HTTP(S) URL, adding https:// when the user omits a scheme. */
export function isValidWebUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || /\s/.test(trimmed)) return false;

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    return (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      parsed.hostname.includes(".") &&
      !parsed.hostname.startsWith(".") &&
      !parsed.hostname.endsWith(".")
    );
  } catch {
    return false;
  }
}

/**
 * Validates website URLs for the template customizer:
 * Enforces secure HTTPS (or scheme-less input auto-resolved to https),
 * a valid host with an extension (.com, .io, etc.), and rejects insecure HTTP,
 * unsupported protocols, or invalid domain names.
 */
export function validateWebsiteUrl(value: string | null | undefined): string | null {
  const trimmed = (value || "").trim();
  if (!trimmed) {
    return "Website URL is required.";
  }
  if (/\s/.test(trimmed)) {
    return "Website URL cannot contain spaces.";
  }
  if (/^(javascript:|data:|vbscript:|file:|ftp:)/i.test(trimmed)) {
    return "Please enter a valid website URL.";
  }
  if (/^http:\/\//i.test(trimmed)) {
    return "Please enter a secure https:// website URL.";
  }
  const candidate = /^https:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "https:") {
      return "Please enter a valid https:// website URL.";
    }
    const host = parsed.hostname;
    if (!host.includes(".") || host.startsWith(".") || host.endsWith(".")) {
      return "Please enter a valid domain (e.g. www.company.com).";
    }
    const parts = host.split(".");
    const tld = parts[parts.length - 1];
    if (!tld || tld.length < 2 || !/^[a-zA-Z]{2,}$/.test(tld)) {
      return "Please enter a valid domain with an extension (e.g. .com, .io).";
    }
    return null;
  } catch {
    return "Please enter a valid website URL.";
  }
}

export function isValidWebsiteUrl(value: string | null | undefined): boolean {
  return validateWebsiteUrl(value) === null;
}

/** Standard field min character lengths */
export const MIN_LENGTH = {
  FIRST_NAME: 2,
} as const;

/** Standard field max character lengths */
export const MAX_LENGTH = {
  NAME: 20,
  FIRST_NAME: 20,
  LAST_NAME: 20,
  JOB_TITLE: 24,
  COMPANY: 24,
  EMAIL: 30,
  PHONE: 25,
  WEBSITE: 40,
  TAGLINE: 50,
  ADDRESS: 60,
  DISCLAIMER: 300,
  SOCIAL_URL: 50,
  URL: 40,
  PASSWORD: 128,
  SEARCH: 100,
  MESSAGE: 2000,
} as const;

/**
 * Validates a person's first or last name:
 * - Checks for invalid characters (HTML tags, angle brackets, ASCII/Unicode control characters)
 */
export function isValidPersonName(name: string): boolean {
  if (typeof name !== "string") return false;
  // Strictly reject HTML tags, angle brackets, or control characters
  if (/[<>]/.test(name) || /[\x00-\x1F\x7F-\x9F]/.test(name)) return false;
  return true;
}
