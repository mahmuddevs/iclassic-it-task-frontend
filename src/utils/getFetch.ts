import { backendUrl } from "./env";
import { globalNavigate } from "./navigation";

export type FetchOptions<TBody = unknown, TFallback = unknown> = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: TBody;
  private?: boolean;
  headers?: Record<string, string>;
  fallback?: TFallback;
};

export type ApiError = {
  message: string;
  status?: number;
};

const baseUrl = backendUrl as string;

let refreshPromise: Promise<void> | null = null;
let isGuest = false;
let onSessionExpired: (() => void) | null = null;

export const setIsGuest = (value: boolean) => {
  isGuest = value;
};

export const setSessionExpiredCallback = (callback: () => void) => {
  onSessionExpired = callback;
};

const redirectToLogin = () => {
  if (onSessionExpired) {
    onSessionExpired();
  }
  const currentPath = window.location.pathname + window.location.search;
  const isLoginPage = window.location.pathname.startsWith("/auth");

  if (!isLoginPage) {
    globalNavigate("/auth/login", {
      state: { from: currentPath },
    });
  }
};

/**
 * Safely reads the response body as JSON or text.
 */
async function readResponseBody<T>(response: Response): Promise<T | undefined> {
  const responseText = await response.text();

  if (!responseText.trim()) {
    return undefined;
  }

  try {
    return JSON.parse(responseText) as T;
  } catch {
    return responseText as unknown as T;
  }
}

/**
 * Checks if the endpoint is auth-related to prevent token refresh loops.
 */
const isAuthEndpoint = (endpoint: string): boolean => {
  return (
    endpoint.includes("/auth/login") ||
    endpoint.includes("/auth/refresh-access-token") ||
    endpoint.includes("/auth/google-login")
  );
};

/**
 * Helper to build and dispatch standard HTTP fetch requests.
 */
const makeRequest = async (
  endpoint: string,
  method: string,
  headers: Record<string, string>,
  isPrivate: boolean,
  body?: unknown
): Promise<Response> => {
  const isFormData = body instanceof FormData;
  const requestHeaders: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...headers,
  };

  return fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: requestHeaders,
    credentials: isPrivate ? "include" : "same-origin",
    body: isFormData ? (body as FormData) : (body ? JSON.stringify(body) : null),
  });
};

/**
 * Resolves standard success response data or formats and throws structured ApiErrors.
 */
const processResponse = async <TResponse>(response: Response): Promise<TResponse> => {
  const data = await readResponseBody<TResponse & { message?: string }>(response);

  if (!response.ok) {
    throw {
      message: data?.message || "Something went wrong",
      status: response.status,
    } as ApiError;
  }

  return data as TResponse;
};

/**
 * Handles refreshing access tokens synchronously across parallel requests.
 */
const executeTokenRefresh = async (): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const refreshResponse = await makeRequest("/auth/refresh-access-token", "POST", {}, true);
        if (!refreshResponse.ok) {
          throw new Error("Failed to refresh token");
        }
      } finally {
        refreshPromise = null;
      }
    })();
  }
  await refreshPromise;
};

/**
 * High-performance fetch utility with integrated automatic token refresh.
 */
export const getFetch = async <TResponse = unknown, TBody = unknown, TFallback = TResponse>(
  endpoint: string,
  options: FetchOptions<TBody, TFallback> = {},
): Promise<TResponse | TFallback> => {
  const {
    method = "GET",
    body,
    private: isPrivate = false,
    headers = {},
  } = options;

  try {
    const response = await makeRequest(endpoint, method, headers, isPrivate, body);

    // 403 Forbidden - Not allowed, redirect directly
    if (response.status === 403) {
      redirectToLogin();
      throw {
        message: "Unauthorized access",
        status: response.status,
      } as ApiError;
    }

    // 401 Unauthorized - Access Token might be expired
    if (response.status === 401) {
      if (isAuthEndpoint(endpoint)) {
        redirectToLogin();
        throw {
          message: "Unauthorized access",
          status: response.status,
        } as ApiError;
      }
      // If the user is a guest, skip the refresh-access-token entirely and redirect
      if (isGuest) {
        redirectToLogin();
        throw {
          message: "No active session. Please login.",
        } as ApiError;
      }

      try {
        await executeTokenRefresh();

        // Retry the original request
        const retryResponse = await makeRequest(endpoint, method, headers, isPrivate, body);

        if (retryResponse.status === 401 || retryResponse.status === 403) {
          redirectToLogin();
          throw {
            message: "Unauthorized access",
            status: retryResponse.status,
          } as ApiError;
        }

        return await processResponse<TResponse>(retryResponse);
      } catch {
        redirectToLogin();
        throw {
          message: "Session expired. Please login again.",
          status: 401,
        } as ApiError;
      }
    }

    return await processResponse<TResponse>(response);
  } catch (error) {
    if (options.fallback !== undefined) {
      return options.fallback;
    }
    if (error && (error as ApiError).status !== 401 && (error as ApiError).status !== 403) {
      console.error("Fetch error:", error);
    }
    throw error as ApiError;
  }
};