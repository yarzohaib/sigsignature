/**
 * Backend API Client & Utilities
 */

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "https://api.sigsignature.com"
).replace(/\/$/, "");

import {
  getStoredToken,
  getStoredRefreshToken,
  getStoredUser,
  setAuthSession,
  clearAuthSession,
} from "./auth";
import type { TemplateSignatureData } from "@/types/template";
import type { StudioSignatureData } from "@/types/studio";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName?: string | null;
  companyName?: string | null;
  isActive?: boolean;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SignupPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data?: {
    user: UserProfile;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: UserProfile;
    tokens: AuthTokens;
  };
}

export interface MeResponse {
  success: boolean;
  data?: {
    user: UserProfile;
  };
}

/**
 * Register a new user with email, password, and name.
 */
export async function signupUser(payload: SignupPayload): Promise<SignupResponse> {
  const url = `${API_BASE_URL}/api/v1/auth/signup`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        firstName: payload.firstName.trim(),
        lastName: payload.lastName ? payload.lastName.trim() : undefined,
        email: payload.email.trim(),
        password: payload.password,
      }),
    });
  } catch (networkErr: unknown) {
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new Error(
      `Unable to reach backend server (${errorDetail}). Please check your network connection or server status.`
    );
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      result?.message ||
      (response.status === 409
        ? "User already exists with this email."
        : response.status === 400
        ? "Please verify your input fields."
        : "Failed to create account. Please try again.");
    throw new Error(message);
  }

  return result as SignupResponse;
}

/**
 * Authenticate existing user with email and password.
 */
export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const url = `${API_BASE_URL}/api/v1/auth/login`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: payload.email.trim(),
        password: payload.password,
      }),
    });
  } catch (networkErr: unknown) {
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new Error(
      `Unable to reach backend server (${errorDetail}). Please check your network connection or server status.`
    );
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      result?.message ||
      (response.status === 401
        ? "Invalid email or password"
        : response.status === 400
        ? "Email and password are required"
        : "Login failed. Please try again.");
    throw new Error(message);
  }

  return result as LoginResponse;
}

export type OAuthProvider = "google" | "github";

/**
 * Initiates OAuth login by redirecting the browser to the backend OAuth provider endpoint.
 */
export function startOAuth(provider: OAuthProvider): void {
  if (typeof window !== "undefined") {
    const targetUrl = `${API_BASE_URL}/api/v1/auth/${provider}`;
    try {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(targetUrl);
    } catch {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = targetUrl;
    }
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = targetUrl;
  }
}

/**
 * Exchange one-time OAuth authorization code for session tokens and user profile.
 */
export async function exchangeOAuthCode(code: string): Promise<LoginResponse> {
  const url = `${API_BASE_URL}/api/v1/auth/oauth/exchange`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        code: code.trim(),
      }),
    });
  } catch (networkErr: unknown) {
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new Error(
      `Unable to reach backend server (${errorDetail}). Please check your network connection or server status.`
    );
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      result?.message ||
      (response.status === 401
        ? "Invalid or expired code"
        : response.status === 400
        ? "Authorization code is required"
        : "Failed to exchange authorization code. Please try again.");
    throw new Error(message);
  }

  return result as LoginResponse;
}

// Mutex / promise deduplicator for concurrent token refresh calls
let refreshPromise: Promise<string | null> | null = null;

/**
 * Refreshes auth tokens using server HttpOnly cookie or stored refresh token.
 * Deduplicates concurrent calls so multiple parallel 401s trigger only one refresh request.
 */
export async function refreshAuthTokens(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const storedRefreshToken = getStoredRefreshToken();
      const url = `${API_BASE_URL}/api/v1/auth/refresh`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include", // Sends HttpOnly refresh_token cookie
        body: JSON.stringify(storedRefreshToken ? { refreshToken: storedRefreshToken } : {}),
      });

      if (!response.ok) {
        clearAuthSession();
        return null;
      }

      const result = await response.json();
      const tokens: AuthTokens = result.data;
      const user = result.data?.user || getStoredUser();

      if (tokens?.accessToken && user) {
        setAuthSession(tokens, user);
        return tokens.accessToken;
      }

      return null;
    } catch (err) {
      console.warn("[API] Automatic token refresh failed:", err);
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Fetch wrapper that automatically handles 401 Unauthorized by refreshing tokens and retrying.
 */
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers || {});
  const token = getStoredToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  let response = await fetch(url, fetchOptions);

  if (response.status === 401) {
    const freshToken = await refreshAuthTokens();
    if (freshToken) {
      headers.set("Authorization", `Bearer ${freshToken}`);
      response = await fetch(url, {
        ...fetchOptions,
        headers,
      });
    }
  }

  return response;
}

/**
 * Fetch current authenticated user's profile using access token.
 * Automatically refreshes the session if the token has expired.
 */
export async function getCurrentUser(accessToken?: string): Promise<UserProfile> {
  const url = `${API_BASE_URL}/api/v1/auth/me`;
  const token = accessToken || getStoredToken();

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers,
      credentials: "include",
    });

    // If access token expired (401), automatically refresh and retry!
    if (response.status === 401) {
      const freshToken = await refreshAuthTokens();
      if (freshToken) {
        headers["Authorization"] = `Bearer ${freshToken}`;
        response = await fetch(url, {
          method: "GET",
          headers,
          credentials: "include",
        });
      }
    }
  } catch (networkErr: unknown) {
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new Error(`Failed to contact server (${errorDetail})`);
  }

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.data?.user) {
    const message = result?.message || "Failed to retrieve authenticated user.";
    throw new Error(message);
  }

  return result.data.user as UserProfile;
}

/**
 * Revoke session on backend logout.
 */
export async function logoutUser(refreshToken?: string): Promise<void> {
  const token = refreshToken || getStoredRefreshToken();
  const url = `${API_BASE_URL}/api/v1/auth/logout`;

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(token ? { refreshToken: token } : {}),
    });
  } catch {
    // Ignore network error on logout cleanup
  }
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  resetToken?: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

/**
 * Request password reset link for user email.
 */
export async function requestForgotPassword(email: string): Promise<ForgotPasswordResponse> {
  const url = `${API_BASE_URL}/api/v1/auth/forgot-password`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email: email.trim() }),
    });
  } catch (networkErr: unknown) {
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new Error(`Unable to reach backend server (${errorDetail}).`);
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message = result?.message || "Failed to process forgot password request.";
    throw new Error(message);
  }

  return result as ForgotPasswordResponse;
}

/**
 * Reset password using reset token.
 */
export async function resetPassword(payload: ResetPasswordPayload): Promise<ResetPasswordResponse> {
  const url = `${API_BASE_URL}/api/v1/auth/reset-password`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        token: payload.token.trim(),
        newPassword: payload.newPassword,
      }),
    });
  } catch (networkErr: unknown) {
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new Error(`Unable to reach backend server (${errorDetail}).`);
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      result?.message ||
      "Failed to reset password. The reset link or token may be invalid or expired.";
    throw new Error(message);
  }

  return result as ResetPasswordResponse;
}

/**
 * Request email verification link for an account.
 */
export async function requestEmailVerification(email: string): Promise<VerifyEmailResponse> {
  const url = `${API_BASE_URL}/api/v1/auth/request-verification`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
  } catch (networkErr: unknown) {
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new Error(`Unable to reach backend server (${errorDetail}).`);
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message = result?.message || "Failed to process email verification request.";
    throw new Error(message);
  }

  return result as VerifyEmailResponse;
}

/**
 * Verify user's email address using a secure, unexpired token.
 */
export async function verifyEmailWithToken(token: string): Promise<VerifyEmailResponse> {
  const url = `${API_BASE_URL}/api/v1/auth/verify-email`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ token: token.trim() }),
    });
  } catch (networkErr: unknown) {
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new Error(`Unable to reach backend server (${errorDetail}).`);
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      result?.message ||
      "Failed to verify email. The verification link or token may be invalid or expired.";
    throw new Error(message);
  }

  return result as VerifyEmailResponse;
}

// Backward-compatible alias
export async function verifyEmail(email: string, token?: string): Promise<VerifyEmailResponse> {
  if (token) {
    return verifyEmailWithToken(token);
  }
  return requestEmailVerification(email);
}

export type UploadKind = "avatar" | "logo";
export type UploadContentType = "image/jpeg" | "image/png" | "image/webp";

export interface PresignUploadPayload {
  kind: UploadKind;
  contentType: UploadContentType;
  size: number;
}

export interface PresignUploadData {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

export interface PresignUploadResponse {
  success: boolean;
  message?: string;
  data?: PresignUploadData;
}

/**
 * Request a presigned S3 upload URL for avatar or logo image uploads.
 * Uses authenticated apiFetch with automatic token refresh on 401.
 */
export async function requestUploadUrl(payload: PresignUploadPayload): Promise<PresignUploadData> {
  const url = `${API_BASE_URL}/api/v1/uploads/presign`;

  let response: Response;
  try {
    response = await apiFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        kind: payload.kind,
        contentType: payload.contentType,
        size: payload.size,
      }),
    });
  } catch (networkErr: unknown) {
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new Error(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`
    );
  }

  const result: PresignUploadResponse | null = await response.json().catch(() => null);

  if (!response.ok || !result?.success || !result?.data) {
    const message =
      result?.message ||
      (response.status === 401
        ? "Please log in to upload images."
        : `Failed to request upload URL (HTTP ${response.status}).`);
    throw new Error(message);
  }

  return result.data;
}

/**
 * Custom API Error carrying HTTP status code and backend error code (e.g. SIGNATURE_LIMIT_REACHED).
 */
export class ApiError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

/**
 * Helper to identify whether an error indicates the signature plan limit has been reached.
 */
export function isSignatureLimitError(err: unknown): boolean {
  if (err instanceof ApiError && err.code === "SIGNATURE_LIMIT_REACHED") {
    return true;
  }
  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: unknown }).code === "SIGNATURE_LIMIT_REACHED"
  ) {
    return true;
  }
  return false;
}

export interface BackendSavedSignature {
  id: string;
  templateId: string;
  templateVersion: number;
  name: string;
  data: TemplateSignatureData | StudioSignatureData;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSignaturePayload {
  name: string;
  templateId: string;
  templateVersion?: number;
  data: TemplateSignatureData | StudioSignatureData;
}

export interface UpdateSignaturePayload {
  name?: string;
  templateId?: string;
  templateVersion?: number;
  data?: TemplateSignatureData | StudioSignatureData;
}

interface GenericApiResponse<T> {
  success: boolean;
  message?: string;
  code?: string;
  data?: T;
}

async function handleSignatureApiResponse<T>(
  response: Response,
  defaultErrorMessage: string
): Promise<T> {
  const result: GenericApiResponse<T> | null = await response.json().catch(() => null);

  if (!response.ok) {
    const message = result?.message || `${defaultErrorMessage} (HTTP ${response.status})`;
    const code = result?.code;
    throw new ApiError(message, response.status, code);
  }

  return (result?.data ?? null) as T;
}

/**
 * Fetch all saved signatures for the authenticated user.
 */
export async function fetchSignatures(): Promise<BackendSavedSignature[]> {
  const url = `${API_BASE_URL}/api/v1/signatures`;

  try {
    const response = await apiFetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    return await handleSignatureApiResponse<BackendSavedSignature[]>(
      response,
      "Failed to load signatures"
    );
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

/**
 * Fetch a single saved signature by ID.
 */
export async function fetchSignatureById(id: string): Promise<BackendSavedSignature> {
  const url = `${API_BASE_URL}/api/v1/signatures/${encodeURIComponent(id)}`;

  try {
    const response = await apiFetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    return await handleSignatureApiResponse<BackendSavedSignature>(
      response,
      "Failed to load signature"
    );
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

/**
 * Create a new signature record in the backend.
 */
export async function createSignature(
  payload: CreateSignaturePayload
): Promise<BackendSavedSignature> {
  const url = `${API_BASE_URL}/api/v1/signatures`;

  try {
    const response = await apiFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: payload.name.trim(),
        templateId: payload.templateId,
        templateVersion: payload.templateVersion ?? 1,
        data: payload.data,
      }),
    });

    return await handleSignatureApiResponse<BackendSavedSignature>(
      response,
      "Failed to save signature"
    );
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

/**
 * Update an existing signature record.
 */
export async function updateSignature(
  id: string,
  payload: UpdateSignaturePayload
): Promise<BackendSavedSignature> {
  const url = `${API_BASE_URL}/api/v1/signatures/${encodeURIComponent(id)}`;

  try {
    const response = await apiFetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...(payload.name !== undefined ? { name: payload.name.trim() } : {}),
        ...(payload.templateId !== undefined ? { templateId: payload.templateId } : {}),
        ...(payload.templateVersion !== undefined
          ? { templateVersion: payload.templateVersion }
          : {}),
        ...(payload.data !== undefined ? { data: payload.data } : {}),
      }),
    });

    return await handleSignatureApiResponse<BackendSavedSignature>(
      response,
      "Failed to update signature"
    );
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

/**
 * Delete a signature record by ID.
 */
export async function deleteSignature(id: string): Promise<void> {
  const url = `${API_BASE_URL}/api/v1/signatures/${encodeURIComponent(id)}`;

  try {
    const response = await apiFetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    await handleSignatureApiResponse<void>(response, "Failed to delete signature");
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

/**
 * Duplicate an existing signature by ID.
 */
export async function duplicateSignature(id: string): Promise<BackendSavedSignature> {
  const url = `${API_BASE_URL}/api/v1/signatures/${encodeURIComponent(id)}/duplicate`;

  try {
    const response = await apiFetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });

    return await handleSignatureApiResponse<BackendSavedSignature>(
      response,
      "Failed to duplicate signature"
    );
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

// ---------------------------------------------------------------------------
// Team Signatures API
// ---------------------------------------------------------------------------

export type TeamMemberStatus = "draft" | "sent" | "accepted" | "expired" | "revoked";

export type BackendSocialPlatform =
  | "linkedin"
  | "x"
  | "facebook"
  | "instagram"
  | "github"
  | "youtube"
  | "website";

export interface BackendTeamMemberSocial {
  platform: BackendSocialPlatform | string;
  url: string;
}

export interface BackendTeamMember {
  id: string;
  teamId?: string;
  name: string;
  email: string;
  jobTitle: string;
  phone: string;
  photoUrl: string;
  socials?: BackendTeamMemberSocial[];
  status: TeamMemberStatus;
  sentAt: string | null;
  acceptedAt: string | null;
  tokenExpiresAt: string | null;
  sendCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BackendTeam {
  id: string;
  ownerId?: string;
  name: string;
  kind: "template" | "studio";
  templateId: string;
  templateVersion: number;
  data: unknown;
  memberLimit: number;
  createdAt: string;
  updatedAt: string;
  members: BackendTeamMember[];
}

export interface CreateTeamPayload {
  signatureId: string;
  name?: string;
}

export interface UpdateTeamPayload {
  name?: string;
  data?: unknown;
}

export interface AddTeamMemberPayload {
  name: string;
  email: string;
  jobTitle?: string;
  phone?: string;
  photoUrl?: string;
  socials?: BackendTeamMemberSocial[];
}

export interface UpdateTeamMemberPayload {
  name?: string;
  email?: string;
  jobTitle?: string;
  phone?: string;
  photoUrl?: string;
  socials?: BackendTeamMemberSocial[];
}

export interface SendTeamMemberResult extends BackendTeamMember {
  devInviteUrl?: string;
  suppressed?: boolean;
  delivered?: boolean;
}

/**
 * Fetch the authenticated user's team signature and members.
 * Returns null if the user does not have a team.
 */
export async function getTeam(): Promise<BackendTeam | null> {
  const url = `${API_BASE_URL}/api/v1/team`;

  try {
    const response = await apiFetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    return await handleSignatureApiResponse<BackendTeam | null>(
      response,
      "Failed to load team signature"
    );
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

/**
 * Create a new team signature snapshot from an existing signature.
 */
export async function createTeamFromSignature(
  payload: CreateTeamPayload
): Promise<BackendTeam> {
  const url = `${API_BASE_URL}/api/v1/team`;

  try {
    const response = await apiFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        signatureId: payload.signatureId,
        ...(payload.name ? { name: payload.name.trim() } : {}),
      }),
    });

    return await handleSignatureApiResponse<BackendTeam>(
      response,
      "Failed to create team signature"
    );
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

/**
 * Update the team's name and/or signature design data.
 */
export async function updateTeam(
  patch: UpdateTeamPayload
): Promise<BackendTeam> {
  const url = `${API_BASE_URL}/api/v1/team`;

  try {
    const response = await apiFetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
        ...(patch.data !== undefined ? { data: patch.data } : {}),
      }),
    });

    return await handleSignatureApiResponse<BackendTeam>(
      response,
      "Failed to update team signature"
    );
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

/**
 * Delete the team signature and all its members.
 */
export async function deleteTeam(): Promise<void> {
  const url = `${API_BASE_URL}/api/v1/team`;

  try {
    const response = await apiFetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    await handleSignatureApiResponse<void>(
      response,
      "Failed to delete team signature"
    );
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

/**
 * Add a new team member.
 */
export async function addTeamMember(
  input: AddTeamMemberPayload
): Promise<BackendTeamMember> {
  const url = `${API_BASE_URL}/api/v1/team/members`;

  try {
    const response = await apiFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        jobTitle: input.jobTitle !== undefined ? input.jobTitle.trim() : "",
        phone: input.phone !== undefined ? input.phone.trim() : "",
        photoUrl: input.photoUrl !== undefined ? input.photoUrl.trim() : "",
        ...(input.socials !== undefined ? { socials: input.socials } : {}),
      }),
    });

    return await handleSignatureApiResponse<BackendTeamMember>(
      response,
      "Failed to add team member"
    );
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

/**
 * Update an existing team member's details.
 */
export async function updateTeamMember(
  id: string,
  patch: UpdateTeamMemberPayload
): Promise<BackendTeamMember> {
  const url = `${API_BASE_URL}/api/v1/team/members/${encodeURIComponent(id)}`;

  try {
    const response = await apiFetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
        ...(patch.email !== undefined ? { email: patch.email.trim().toLowerCase() } : {}),
        ...(patch.jobTitle !== undefined ? { jobTitle: patch.jobTitle.trim() } : {}),
        ...(patch.phone !== undefined ? { phone: patch.phone.trim() } : {}),
        ...(patch.photoUrl !== undefined ? { photoUrl: patch.photoUrl.trim() } : {}),
        ...(patch.socials !== undefined ? { socials: patch.socials } : {}),
      }),
    });

    return await handleSignatureApiResponse<BackendTeamMember>(
      response,
      "Failed to update team member"
    );
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

/**
 * Remove a member from the team.
 */
export async function removeTeamMember(id: string): Promise<void> {
  const url = `${API_BASE_URL}/api/v1/team/members/${encodeURIComponent(id)}`;

  try {
    const response = await apiFetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    await handleSignatureApiResponse<void>(
      response,
      "Failed to remove team member"
    );
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

/**
 * Send or resend an email invite to a team member.
 * Returns the member plus optional devInviteUrl and suppressed flags.
 */
export async function sendTeamMember(id: string): Promise<SendTeamMemberResult> {
  const url = `${API_BASE_URL}/api/v1/team/members/${encodeURIComponent(id)}/send`;

  try {
    const response = await apiFetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const message = result?.message || `Failed to send invite email (HTTP ${response.status})`;
      throw new ApiError(message, response.status, result?.code);
    }

    const member = (result?.data ?? {}) as BackendTeamMember;
    return {
      ...member,
      devInviteUrl: result?.devInviteUrl || (result?.data?.devInviteUrl as string | undefined),
      suppressed: Boolean(result?.suppressed),
      delivered: Boolean(result?.delivered),
    };
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

/**
 * Revoke an active invite link for a team member.
 */
export async function revokeTeamMember(id: string): Promise<BackendTeamMember> {
  const url = `${API_BASE_URL}/api/v1/team/members/${encodeURIComponent(id)}/revoke`;

  try {
    const response = await apiFetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });

    return await handleSignatureApiResponse<BackendTeamMember>(
      response,
      "Failed to revoke invite"
    );
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

export interface AccountSettings {
  defaultTemplateId: string | null;
  defaultExportFormat: "html" | "plain";
  signatureFont: string;
  brandColor: string;
  includePhoto: boolean;
  notifyProductUpdates: boolean;
  notifyTips: boolean;
  premiumWaitlistAt: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AccountUsage {
  signatures: number;
  signatureLimit: number;
}

export interface AccountData {
  user: UserProfile;
  hasPassword: boolean;
  providers: string[];
  settings: AccountSettings;
  usage: AccountUsage;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string | null;
  companyName?: string | null;
}

export interface UpdateSettingsPayload {
  defaultTemplateId?: string | null;
  defaultExportFormat?: "html" | "plain";
  signatureFont?: string;
  brandColor?: string;
  includePhoto?: boolean;
  notifyProductUpdates?: boolean;
  notifyTips?: boolean;
}

/**
 * Fetch full account profile, settings, providers, and usage limits.
 */
export async function fetchAccount(): Promise<AccountData> {
  const url = `${API_BASE_URL}/api/v1/account`;

  try {
    const response = await apiFetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const message = result?.message || `Failed to load account (HTTP ${response.status})`;
      throw new ApiError(message, response.status, result?.code);
    }

    return (result?.data ?? {}) as AccountData;
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

/**
 * Update personal profile details (firstName, lastName, companyName).
 */
export async function updateAccountProfile(
  payload: UpdateProfilePayload
): Promise<UserProfile> {
  const url = `${API_BASE_URL}/api/v1/account`;

  try {
    const response = await apiFetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const message = result?.message || `Failed to update profile (HTTP ${response.status})`;
      throw new ApiError(message, response.status, result?.code);
    }

    return (result?.data?.user ?? {}) as UserProfile;
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

/**
 * Update signature defaults and notifications settings.
 */
export async function updateAccountSettings(
  payload: UpdateSettingsPayload
): Promise<AccountSettings> {
  const url = `${API_BASE_URL}/api/v1/account/settings`;

  try {
    const response = await apiFetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const message = result?.message || `Failed to update settings (HTTP ${response.status})`;
      throw new ApiError(message, response.status, result?.code);
    }

    return (result?.data?.settings ?? {}) as AccountSettings;
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

/**
 * Join premium waitlist (idempotent).
 */
export async function joinWaitlist(): Promise<AccountSettings> {
  const url = `${API_BASE_URL}/api/v1/account/waitlist`;

  try {
    const response = await apiFetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const message = result?.message || `Failed to join waitlist (HTTP ${response.status})`;
      throw new ApiError(message, response.status, result?.code);
    }

    return (result?.data?.settings ?? {}) as AccountSettings;
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

export interface UserSession {
  id: string;
  userId: string;
  isCurrent: boolean;
  device: string;
  deviceName?: string | null;
  userAgent?: string | null;
  ipAddress?: string | null;
  lastUsedAt: string;
  expiresAt?: string;
  revokedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountPayload {
  password?: string;
  confirm?: string;
}

/**
 * Maps error codes from account security endpoints to user-friendly messages.
 */
export function getFriendlySecurityErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    switch (err.code) {
      case "INVALID_CURRENT_PASSWORD":
        return "The current password you entered is incorrect.";
      case "NO_PASSWORD_SET":
        return "No password is set on this account. You sign in using a social provider.";
      case "CONFIRMATION_REQUIRED":
        return "Confirmation required. Please type DELETE to confirm.";
      case "INVALID_PASSWORD":
        return "Incorrect password. Please try again.";
      case "PASSWORD_UNCHANGED":
        return "Your new password must be different from your current password.";
      case "RATE_LIMIT_EXCEEDED":
        return "Too many attempts. Please wait a little while before trying again.";
      default:
        if (err.statusCode === 429) {
          return "Rate limit reached. Please wait a little while before trying again.";
        }
        return err.message;
    }
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "An unexpected error occurred. Please try again.";
}

/**
 * Change account password (revokes other active sessions).
 */
export async function changeAccountPassword(
  payload: ChangePasswordPayload
): Promise<{ message: string }> {
  const url = `${API_BASE_URL}/api/v1/account/password`;

  try {
    const response = await apiFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const message = result?.message || `Failed to change password (HTTP ${response.status})`;
      throw new ApiError(message, response.status, result?.code);
    }

    return { message: result?.message || "Password changed successfully" };
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

/**
 * Fetch all active sessions for the authenticated user.
 */
export async function fetchUserSessions(): Promise<UserSession[]> {
  const url = `${API_BASE_URL}/api/v1/auth/sessions`;

  try {
    const response = await apiFetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const message = result?.message || `Failed to fetch sessions (HTTP ${response.status})`;
      throw new ApiError(message, response.status, result?.code);
    }

    const sessions = (result?.data?.sessions ?? []) as UserSession[];
    return sessions;
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

/**
 * Revoke a specific session by ID.
 */
export async function revokeUserSession(sessionId: string): Promise<void> {
  const url = `${API_BASE_URL}/api/v1/auth/sessions/${encodeURIComponent(sessionId)}`;

  try {
    const response = await apiFetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const message = result?.message || `Failed to revoke session (HTTP ${response.status})`;
      throw new ApiError(message, response.status, result?.code);
    }
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

/**
 * Revoke all active sessions except the current one.
 */
export async function revokeOtherUserSessions(): Promise<{ count: number }> {
  const url = `${API_BASE_URL}/api/v1/auth/sessions/revoke-others`;

  try {
    const response = await apiFetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        result?.message || `Failed to revoke other sessions (HTTP ${response.status})`;
      throw new ApiError(message, response.status, result?.code);
    }

    const count = Number(result?.count ?? result?.revokedCount ?? 0);
    return { count };
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

/**
 * Download account data as a JSON blob attachment.
 */
export async function downloadAccountExport(): Promise<Blob> {
  const url = `${API_BASE_URL}/api/v1/account/export`;

  try {
    const response = await apiFetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      const message =
        result?.message || `Failed to export account data (HTTP ${response.status})`;
      throw new ApiError(message, response.status, result?.code);
    }

    return await response.blob();
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}

/**
 * Permanently delete user account and all owned resources.
 */
export async function deleteUserAccount(payload: DeleteAccountPayload): Promise<void> {
  const url = `${API_BASE_URL}/api/v1/account`;

  try {
    const response = await apiFetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      const message =
        result?.message || `Failed to delete account (HTTP ${response.status})`;
      throw new ApiError(message, response.status, result?.code);
    }
  } catch (networkErr: unknown) {
    if (networkErr instanceof ApiError) throw networkErr;
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network request failed";
    throw new ApiError(
      `Unable to reach backend server (${errorDetail}). Please check your connection.`,
      0
    );
  }
}
