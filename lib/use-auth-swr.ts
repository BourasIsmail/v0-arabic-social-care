"use client";

import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import { useAuth } from "./auth-context";
import { useCallback } from "react";

// Create an authenticated fetcher that includes the JWT token
export function useAuthFetcher() {
  const { accessToken } = useAuth();

  const fetcher = useCallback(
    async (url: string) => {
      const headers: HeadersInit = {};
      
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        const error = new Error("An error occurred while fetching the data.");
        throw error;
      }
      
      return response.json();
    },
    [accessToken]
  );

  return fetcher;
}

// Custom hook that wraps useSWR with authentication
export function useAuthSWR<T>(
  url: string | null,
  config?: SWRConfiguration
): SWRResponse<T> {
  const fetcher = useAuthFetcher();
  return useSWR<T>(url, fetcher, config);
}

// Authenticated fetch function for mutations (POST, PUT, DELETE)
export function useAuthMutate() {
  const { accessToken } = useAuth();

  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers);
      
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      
      if (!headers.has("Content-Type") && options.body) {
        headers.set("Content-Type", "application/json");
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      return response;
    },
    [accessToken]
  );

  return authFetch;
}
