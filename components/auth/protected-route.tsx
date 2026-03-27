"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "USER" | "ADMIN";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const redirectingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle redirect after everything is settled
  useEffect(() => {
    if (!mounted || isLoading || redirectingRef.current) return;

    // Check if we need to redirect
    const needsAuthRedirect = !isAuthenticated;
    const needsRoleRedirect = requiredRole === "ADMIN" && user?.role !== "ADMIN";

    if (needsAuthRedirect || needsRoleRedirect) {
      redirectingRef.current = true;
      const redirectUrl = needsAuthRedirect ? "/login" : "/";
      
      // Use requestAnimationFrame to ensure we're past hydration
      requestAnimationFrame(() => {
        window.location.href = redirectUrl;
      });
    }
  }, [mounted, isLoading, isAuthenticated, requiredRole, user]);

  // Show loading state during SSR, initial mount, and auth check
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

  // Show loading while redirecting
  if (!isAuthenticated || (requiredRole === "ADMIN" && user?.role !== "ADMIN")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">جاري التحويل...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
