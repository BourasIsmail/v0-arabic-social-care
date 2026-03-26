"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "USER" | "ADMIN";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      setShouldRedirect(true);
    }
  }, [isAuthenticated, isLoading, mounted]);

  useEffect(() => {
    if (mounted && !isLoading && isAuthenticated && requiredRole && user) {
      if (requiredRole === "ADMIN" && user.role !== "ADMIN") {
        setShouldRedirect(true);
      }
    }
  }, [isAuthenticated, isLoading, requiredRole, user, mounted]);

  // Perform redirect in a separate effect to avoid hydration issues
  useEffect(() => {
    if (shouldRedirect && mounted) {
      const redirectUrl = !isAuthenticated ? "/login" : "/";
      // Use setTimeout to ensure this runs after hydration
      const timer = setTimeout(() => {
        window.location.href = redirectUrl;
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [shouldRedirect, mounted, isAuthenticated]);

  // Show loading state during SSR and initial client render
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || shouldRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">جاري التحويل...</p>
        </div>
      </div>
    );
  }

  if (requiredRole === "ADMIN" && user?.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}
