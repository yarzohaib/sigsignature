/**
 * Backend API Client & Utilities
 */

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://13.55.213.189"
).replace(/\/$/, "");

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

/**
 * Fetch current authenticated user's profile using access token.
 */
export async function getCurrentUser(accessToken: string): Promise<UserProfile> {
  const url = `${API_BASE_URL}/api/v1/auth/me`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
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
  if (!refreshToken) return;
  const url = `${API_BASE_URL}/api/v1/auth/logout`;

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ refreshToken }),
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

