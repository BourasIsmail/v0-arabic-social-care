"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Building2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiagnosticFormWizard } from "@/components/form/diagnostic-form-wizard";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserMenu } from "@/components/auth/user-menu";
import { useFormContext } from "@/lib/form-context";
import { useAuthFetcher } from "@/lib/use-auth-swr";
import type { InstitutionResponse } from "@/lib/types";

export default function EditInstitutionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { initializeForm, setEditMode, resetForm } = useFormContext();
  const fetcher = useAuthFetcher();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInstitution() {
      try {
        setIsLoading(true);
        const data: InstitutionResponse = await fetcher(`/api/institutions/${id}`);
        
        // Transform response data to form data structure
        initializeForm({
          institutionType: data.institutionType,
          associationName: data.associationName,
          institutionName: data.institutionName,
          address: data.address,
          regionId: data.regionId,
          prefectureId: data.prefectureId,
          communeId: data.communeId,
          milieu: data.milieu,
          creationYear: data.creationYear,
          legalStatus: data.legalStatus,
          licenseNumber: data.licenseNumber,
          serviceStartDate: data.serviceStartDate,
          housing: data.housing,
          meals: data.meals,
          educationalSupport: data.educationalSupport,
          culturalActivities: data.culturalActivities,
          healthCare: data.healthCare,
          insurance: data.insurance,
          psychologicalSupport: data.psychologicalSupport,
          totalCapacity: data.totalCapacity,
          maleCapacity: data.maleCapacity,
          femaleCapacity: data.femaleCapacity,
          primary: data.primary,
          middleSchool: data.middleSchool,
          highSchool: data.highSchool,
          other: data.other,
          distanceToSchool: data.distanceToSchool,
          distanceToNationalBoardingSchool: data.distanceToNationalBoardingSchool,
          building: data.building || {},
          financing: data.financing || {},
          targeting: data.targeting || {},
          housingMeals: data.housingMeals || {
            season2324: {},
            season2425: {},
            season2526: {},
          },
          staffMembers: data.staffMembers || [],
        });
        setEditMode(parseInt(id));
        setError(null);
      } catch (err) {
        console.error("Error loading institution:", err);
        setError("حدث خطأ أثناء تحميل بيانات المؤسسة");
      } finally {
        setIsLoading(false);
      }
    }

    loadInstitution();

    // Cleanup on unmount
    return () => {
      resetForm();
    };
  }, [id, fetcher, initializeForm, setEditMode, resetForm]);

  if (isLoading) {
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

            <DiagnosticFormWizard />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
