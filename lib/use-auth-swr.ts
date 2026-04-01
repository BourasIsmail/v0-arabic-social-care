"use client";

import useSWR, { SWRConfiguration, SWRResponse, mutate as globalMutate } from "swr";
import { useAuth } from "./auth-context";
import { useCallback, useRef } from "react";
import { buildApiUrl } from "./api-config";

// Create an authenticated fetcher that includes the JWT token with auto-refresh
export function useAuthFetcher() {
  const { accessToken, refreshAccessToken, logout } = useAuth();
  const isRefreshingRef = useRef(false);

  const fetcher = useCallback(
    async (url: string) => {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      let response = await fetch(url, { headers });
      
      // Handle 401 or 403 - try to refresh token
      if ((response.status === 401 || response.status === 403) && !isRefreshingRef.current) {
        isRefreshingRef.current = true;
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            headers["Authorization"] = `Bearer ${newToken}`;
            response = await fetch(url, { headers });
            // If still 403 after refresh, logout
            if (response.status === 403) {
              logout();
              throw new Error("Access denied. Please login again.");
            }
          } else {
            logout();
            throw new Error("Session expired");
          }
        } finally {
          isRefreshingRef.current = false;
        }
      }
      
      if (!response.ok) {
        const error = new Error("An error occurred while fetching the data.");
        throw error;
      }
      
      // Handle empty responses (204 No Content)
      const text = await response.text();
      if (!text) {
        return null;
      }
      
      return JSON.parse(text);
    },
    [accessToken, refreshAccessToken, logout]
  );

  return fetcher;
}

// Custom hook that wraps useSWR with authentication
export function useAuthSWR<T>(
  url: string | null,
  config?: SWRConfiguration
): SWRResponse<T> {
  const fetcher = useAuthFetcher();
  return useSWR<T>(url, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    ...config,
  });
}

// Authenticated fetch function for mutations (POST, PUT, DELETE) with auto-refresh
export function useAuthMutate() {
  const { accessToken, refreshAccessToken, logout } = useAuth();
  const isRefreshingRef = useRef(false);

  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      const headers = new Headers(options.headers);
      
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      
      // Only set Content-Type for non-FormData bodies
      // FormData needs the browser to set the Content-Type with the boundary
      if (!headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
      }

      let response = await fetch(url, { ...options, headers });

      // Handle 401 or 403 - try to refresh token
      if ((response.status === 401 || response.status === 403) && !isRefreshingRef.current) {
        isRefreshingRef.current = true;
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            headers.set("Authorization", `Bearer ${newToken}`);
            response = await fetch(url, { ...options, headers });
            // If still 403 after refresh, logout
            if (response.status === 403) {
              logout();
            }
          } else {
            logout();
          }
        } finally {
          isRefreshingRef.current = false;
        }
      }

      return response;
    },
    [accessToken, refreshAccessToken, logout]
  );

  return authFetch;
}

// Helper to invalidate SWR cache
export function invalidateCache(key: string | string[]) {
  if (Array.isArray(key)) {
    key.forEach(k => globalMutate(k));
  } else {
    globalMutate(key);
  }
}
