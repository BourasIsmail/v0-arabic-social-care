"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  AuthState,
} from "./auth-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Track mount state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize auth state from localStorage (only on client)
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Use requestAnimationFrame to defer localStorage access
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
        // Invalid stored data, clear it
        clearStorage();
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    // Defer to next frame to avoid hydration issues
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
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
    // Use window.location for navigation to avoid router initialization issues
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, []);

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    const currentRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    
    if (!currentRefreshToken) {
      logout();
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        refreshAccessToken,
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

// Custom hook for authenticated API calls
export function useAuthFetch() {
  const { accessToken, refreshAccessToken, logout } = useAuth();

  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      const headers = new Headers(options.headers);
      
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }

      let response = await fetch(url, {
        ...options,
        headers,
      });

      // If unauthorized, try to refresh token
      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          headers.set("Authorization", `Bearer ${newToken}`);
          response = await fetch(url, {
            ...options,
            headers,
          });
        } else {
          logout();
        }
      }

      return response;
    },
    [accessToken, refreshAccessToken, logout]
  );

  return authFetch;
}
