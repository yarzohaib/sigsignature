/**
 * Backend API Client & Utilities
 */

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://13.55.213.189"
).replace(/\/$/, "");

import {
  getStoredToken,
  getStoredRefreshToken,
  getStoredUser,
  setAuthSession,
  clearAuthSession,
} from "./auth";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName?: string | null;
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

