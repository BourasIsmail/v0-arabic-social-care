"use client";

import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/sonner";

// Dynamically import AuthProvider with SSR disabled to avoid router initialization issues
const AuthProvider = dynamic(
  () => import("@/lib/auth-context").then((mod) => mod.AuthProvider),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">جاري التحميل...</div>
      </div>
    ),
  }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster position="top-center" richColors />
    </AuthProvider>
  );
}
