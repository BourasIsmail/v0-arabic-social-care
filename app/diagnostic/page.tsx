"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, ArrowRight, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiagnosticFormWizard } from "@/components/form/diagnostic-form-wizard";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserMenu } from "@/components/auth/user-menu";
import { useAuth } from "@/lib/auth-context";

export default function DiagnosticPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Redirect VIEW_ONLY users - they cannot create institutions
  useEffect(() => {
    if (!isLoading && user?.role === "VIEW_ONLY") {
      router.push("/institutions");
    }
  }, [user, isLoading, router]);

  // Show loading while checking
  if (isLoading || user?.role === "VIEW_ONLY") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
        {/* Header */}
        <header className="sticky top-0 z-50 glass border-b border-border/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">نظام الرعاية الاجتماعية</h1>
                  <p className="text-sm text-muted-foreground">استمارة تشخيص المؤسسات</p>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <Link href="/">
                  <Button variant="ghost" className="gap-2 rounded-lg">
                    <ArrowRight className="h-4 w-4" />
                    <span className="hidden sm:inline">العودة للرئيسية</span>
                  </Button>
                </Link>
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Title */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">استمارة جديدة</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2">استمارة التشخيص</h2>
              <p className="text-muted-foreground">
                أكمل جميع الخطوات لتسجيل بيانات المؤسسة بشكل كامل ودقيق
              </p>
            </div>

            <DiagnosticFormWizard />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
