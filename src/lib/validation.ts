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

/** Standard field max character lengths */
export const MAX_LENGTH = {
  NAME: 80,
  JOB_TITLE: 80,
  COMPANY: 80,
  EMAIL: 100,
  PHONE: 25,
  WEBSITE: 120,
  TAGLINE: 120,
  ADDRESS: 150,
  DISCLAIMER: 500,
  SOCIAL_URL: 250,
  URL: 300,
  PASSWORD: 128,
  SEARCH: 100,
  MESSAGE: 2000,
} as const;
