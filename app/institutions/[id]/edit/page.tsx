"use client";

import { use, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Building2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InstitutionEditForm } from "@/components/form/institution-edit-form";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserMenu } from "@/components/auth/user-menu";
import { useAuthFetcher } from "@/lib/use-auth-swr";
import type { InstitutionResponse } from "@/lib/types";

export default function EditInstitutionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const fetcher = useAuthFetcher();
  const [institution, setInstitution] = useState<InstitutionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;

    async function loadInstitution() {
      try {
        loadedRef.current = true;
        const data = await fetcher(`/api/api/v1/institutions/${id}`);
        console.log("[v0] Loaded institution data:", data);
        console.log("[v0] staffMembers in response:", data?.staffMembers);
        setInstitution(data);
      } catch (err) {
        console.error("Error loading institution:", err);
        setError("حدث خطأ أثناء تحميل بيانات المؤسسة");
      }
    }

    loadInstitution();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!institution && !error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">جاري تحميل بيانات المؤسسة...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <p className="text-destructive">{error}</p>
            <Link href="/institutions">
              <Button>العودة للقائمة</Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">نظام الرعاية الاجتماعية</h1>
                  <p className="text-sm text-muted-foreground">تعديل بيانات المؤسسة</p>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <Link href={`/institutions/${id}`}>
                  <Button variant="ghost" className="gap-2">
                    <ArrowRight className="h-4 w-4" />
                    العودة للتفاصيل
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
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">تعديل بيانات المؤسسة</h2>
              <p className="text-muted-foreground mt-2">
                قم بتحديث البيانات المطلوبة ثم احفظ التغييرات
              </p>
            </div>

            <InstitutionEditForm institution={institution!} />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
