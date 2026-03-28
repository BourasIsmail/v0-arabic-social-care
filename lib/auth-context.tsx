"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  AuthState,
} from "./auth-types";
import { API_BASE_URL, API_ENDPOINTS, buildApiUrl } from "./api-config";

interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Ref to track if refresh is in progress (prevents race conditions)
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);
  const isRefreshingRef = useRef(false);

  // Initialize auth state from localStorage (only on client)
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const initAuth = () => {
      try {
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);

        if (accessToken && refreshToken && userStr) {
          const user = JSON.parse(userStr) as User;
          setState({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch {
        clearStorage();
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    requestAnimationFrame(initAuth);
  }, []);

  const clearStorage = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const saveAuthData = (response: AuthResponse) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));

    setState({
      user: response.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const login = async (data: LoginRequest) => {
    const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.login), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "فشل تسجيل الدخول");
    }

    const authResponse: AuthResponse = await response.json();
    saveAuthData(authResponse);
  };

  const register = async (data: RegisterRequest) => {
    const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.register), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "فشل إنشاء الحساب");
    }

    const authResponse: AuthResponse = await response.json();
    saveAuthData(authResponse);
  };

  const logout = useCallback(() => {
    clearStorage();
    setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, []);

  const updateUser = useCallback((user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    setState((prev) => ({ ...prev, user }));
  }, []);

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    // If already refreshing, wait for that promise
    if (isRefreshingRef.current && refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const currentRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    
    if (!currentRefreshToken) {
      logout();
      return null;
    }

    isRefreshingRef.current = true;

    refreshPromiseRef.current = (async () => {
      try {
        const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.refresh), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: currentRefreshToken }),
        });

        if (!response.ok) {
          logout();
          return null;
        }

        const authResponse: AuthResponse = await response.json();
        saveAuthData(authResponse);
        return authResponse.accessToken;
      } catch {
        logout();
        return null;
      } finally {
        isRefreshingRef.current = false;
        refreshPromiseRef.current = null;
      }
    })();

    return refreshPromiseRef.current;
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        refreshAccessToken,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Custom hook for authenticated API calls with automatic token refresh
export function useAuthFetch() {
  const { accessToken, refreshAccessToken, logout } = useAuth();
  const pendingRequestsRef = useRef<Map<string, Promise<Response>>>(new Map());

  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      const headers = new Headers(options.headers);
      
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      headers.set("Content-Type", "application/json");

      let response = await fetch(url, { ...options, headers });

      // If unauthorized, try to refresh token once
      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          headers.set("Authorization", `Bearer ${newToken}`);
          response = await fetch(url, { ...options, headers });
        } else {
          logout();
        }
      }

      return response;
    },
    [accessToken, refreshAccessToken, logout]
  );

  // Mutation helper that handles JSON responses
  const authMutate = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      return authFetch(url, options);
    },
    [authFetch]
  );

  return { authFetch, authMutate };
}
