// Centralized API configuration
// Base URL for all API calls - change this single value to update all endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://enfance.entraide.ma";

// API endpoints - all paths are relative to API_BASE_URL
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: "/api/v1/auth/login",
    register: "/api/v1/auth/register",
    refresh: "/api/v1/auth/refresh",
  },
  
  // User endpoints
  users: {
    list: "/api/v1/users",
    byId: (id: number) => `/api/v1/users/${id}`,
  },
  
  // Profile endpoints (current user)
  profile: {
    get: "/api/v1/profile",
    update: "/api/v1/profile",
  },
  
  // Institution endpoints
  institutions: {
    list: "/api/v1/institutions",
    byId: (id: number | string) => `/api/v1/institutions/${id}`,
    create: "/api/v1/institutions",
    update: (id: number | string) => `/api/v1/institutions/${id}`,
    delete: (id: number | string) => `/api/v1/institutions/${id}`,
    exportCsv: "/api/v1/institutions/export/csv",
    exportExcel: "/api/v1/institutions/export/excel",
  },
  
  // Geographic endpoints
  geo: {
    regions: "/api/v1/regions",
    prefecturesByRegion: (regionId: number | string) => `/api/v1/regions/${regionId}/prefectures`,
    communesByPrefecture: (prefectureId: number | string) => `/api/v1/prefectures/${prefectureId}/communes`,
  },
  
  // Region endpoints (alias for geo)
  regions: {
    list: "/api/v1/regions",
  },
  
  // Prefecture endpoints (alias for geo)
  prefectures: {
    byRegion: (regionId: number | string) => `/api/v1/regions/${regionId}/prefectures`,
  },
  
  // Statistics endpoints
  statistics: {
    dashboard: (regionId?: string | number, prefectureId?: string | number) => {
      const params = new URLSearchParams();
      if (regionId && regionId !== "all") params.append("regionId", String(regionId));
      if (prefectureId && prefectureId !== "all") params.append("prefectureId", String(prefectureId));
      const queryString = params.toString();
      return `/api/v1/statistics/dashboard${queryString ? `?${queryString}` : ""}`;
    },
  },
} as const;

// Helper to build full URL
export function buildApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}

// Helper for client-side fetch with auth token
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<Response> {
  const url = buildApiUrl(endpoint);
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  
  return fetch(url, {
    ...options,
    headers,
  });
}

// Storage keys for auth
export const STORAGE_KEYS = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  user: "user",
} as const;

// Get token from storage (client-side only)
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.accessToken);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.refreshToken);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
  localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
  localStorage.removeItem(STORAGE_KEYS.user);
}
