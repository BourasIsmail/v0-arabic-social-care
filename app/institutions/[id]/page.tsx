"use client";

import { use } from "react";
import Link from "next/link";
import { Building2, ArrowRight, Pencil, Calendar, MapPin, Users, FileDown } from "lucide-react";
import { useAuthSWR } from "@/lib/use-auth-swr";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserMenu } from "@/components/auth/user-menu";
import { PDFDownloadButton } from "@/components/pdf/pdf-download-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  institutionTypeLabels,
  milieuLabels,
  legalStatusLabels,
  buildingStatusLabels,
  buildingConditionLabels,
  renovationCapacityLabels,
  ownerTypeLabels,
  selectionBodyLabels,
  tariffTypeLabels,
  mealServiceTypeLabels,
  staffTypeLabels,
  distanceLabels,
} from "@/lib/types";
import type { InstitutionResponse } from "@/lib/types";

export default function InstitutionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, error, isLoading } = useAuthSWR<InstitutionResponse>(
    `/api/api/v1/institutions/${id}`
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-10 w-64" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">خطأ</CardTitle>
            <CardDescription>لم يتم العثور على المؤسسة</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/institutions">
              <Button variant="outline" className="gap-2">
                <ArrowRight className="h-4 w-4" />
                العودة للقائمة
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const InfoRow = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div className="flex justify-between py-2 border-b border-border last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value || "-"}</span>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/institutions" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">تفاصيل المؤسسة</h1>
                  <p className="text-sm text-muted-foreground">{data.institutionName}</p>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <Link href="/institutions">
                  <Button variant="ghost" className="gap-2">
                    <ArrowRight className="h-4 w-4" />
                    العودة
                  </Button>
                </Link>
                <PDFDownloadButton data={data} variant="outline" />
                <Link href={`/institutions/${id}/edit`}>
                  <Button className="gap-2">
                    <Pencil className="h-4 w-4" />
                    تعديل
                  </Button>
                </Link>
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>المعلومات الأساسية</CardTitle>
                  <Badge variant="secondary">
                    {institutionTypeLabels[data.institutionType]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <InfoRow label="اسم الجمعية" value={data.associationName} />
                <InfoRow label="اسم المؤسسة" value={data.institutionName} />
                <InfoRow label="سنة التأسيس" value={data.creationYear} />
                <InfoRow
                  label="الوضعية القانونية"
                  value={data.legalStatus && legalStatusLabels[data.legalStatus]}
                />
                <InfoRow label="رقم الترخيص" value={data.licenseNumber} />
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-accent" />
                  الموقع الجغرافي
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <InfoRow label="العنوان" value={data.address} />
                <InfoRow label="الجهة" value={data.regionName} />
                <InfoRow label="العمالة/الإقليم" value={data.prefectureName} />
                <InfoRow label="الجماعة" value={data.communeName} />
                <InfoRow label="الوسط" value={data.milieu && milieuLabels[data.milieu]} />
              </CardContent>
            </Card>

            {/* Building Card */}
            {data.building && (
              <Card>
                <CardHeader>
                  <CardTitle>معلومات البناية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <InfoRow
                    label="وضعية البناية"
                    value={
                      data.building.buildingStatus &&
                      buildingStatusLabels[data.building.buildingStatus]
                    }
                  />
                  <InfoRow
                    label="حالة البناية"
                    value={
                      data.building.buildingCondition &&
                      buildingConditionLabels[data.building.buildingCondition]
                    }
                  />
                  <InfoRow
                    label="القدرة على التجديد"
                    value={
                      data.building.renovationCapacity &&
                      renovationCapacityLabels[data.building.renovationCapacity]
                    }
                  />
                  <InfoRow
                    label="نوع المالك"
                    value={
                      data.building.ownerType && ownerTypeLabels[data.building.ownerType]
                    }
                  />
                  <InfoRow
                    label="اتفاقية شراكة"
                    value={data.building.hasPartnershipAgreement ? "نعم" : "لا"}
                  />
                </CardContent>
              </Card>
            )}

            {/* Financing Card */}
            {data.financing && (
              <Card>
                <CardHeader>
                  <CardTitle>معلومات التمويل</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <InfoRow
                    label="التكلفة الإجمالية للبناء"
                    value={
                      data.financing.totalConstructionCost &&
                      `${data.financing.totalConstructionCost.toLocaleString()} درهم`
                    }
                  />
                  <InfoRow
                    label="التكلفة السنوية للتسيير"
                    value={
                      data.financing.annualManagementCost &&
                      `${data.financing.annualManagementCost.toLocaleString()} درهم`
                    }
                  />
                  <InfoRow
                    label="التكلفة السنوية للموارد البشرية"
                    value={
                      data.financing.annualHRCost &&
                      `${data.financing.annualHRCost.toLocaleString()} درهم`
                    }
                  />
                  <InfoRow
                    label="التكلفة السنوية للإطعام"
                    value={
                      data.financing.annualMealsCost &&
                      `${data.financing.annualMealsCost.toLocaleString()} درهم`
                    }
                  />
                </CardContent>
              </Card>
            )}

            {/* Targeting Card */}
            {data.targeting && (
              <Card>
                <CardHeader>
                  <CardTitle>الاستهداف والتعرفة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <InfoRow
                    label="جهة الاختيار"
                    value={data.targeting.selectionBody && selectionBodyLabels[data.targeting.selectionBody]}
                  />
                  <InfoRow
                    label="الخدمات مجانية"
                    value={data.targeting.servicesAreFree ? "نعم" : "لا"}
                  />
                  {!data.targeting.servicesAreFree && data.targeting.tariffType && (
                    <InfoRow
                      label="نوع التعرفة"
                      value={tariffTypeLabels[data.targeting.tariffType]}
                    />
                  )}
                  {data.targeting.uniformAmount && (
                    <InfoRow
                      label="مبلغ موحد"
                      value={`${data.targeting.uniformAmount} درهم`}
                    />
                  )}
                </CardContent>
              </Card>
            )}

            {/* Distance Card */}
            <Card>
              <CardHeader>
                <CardTitle>البعد الجغرافي</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <InfoRow
                  label="المسافة إلى أقرب مؤسسة تعليمية"
                  value={data.distanceToSchool && distanceLabels[data.distanceToSchool]}
                />
                <InfoRow
                  label="المسافة إلى أقرب داخلية عمومية"
                  value={data.distanceToNationalBoardingSchool && distanceLabels[data.distanceToNationalBoardingSchool]}
                />
              </CardContent>
            </Card>

            {/* Staff Card */}
            {data.staffMembers && data.staffMembers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    الموارد البشرية
                  </CardTitle>
                  <CardDescription>{data.staffMembers.length} موظف(ين)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {data.staffMembers.map((member, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-border last:border-0"
                      >
                        <span className="font-medium">{staffTypeLabels[member.staffType]}</span>
                        <div className="text-sm text-muted-foreground">
                          {(member.nbAssociation || 0) +
                            (member.nbDeployed || 0) +
                            (member.nbVolunteers || 0)}{" "}
                          موظف
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Capacity Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  الطاقة الاستيعابية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-3xl font-bold text-primary">
                    {data.totalCapacity || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">الطاقة الإجمالية</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-accent/5 rounded-lg">
                    <p className="text-xl font-bold text-accent">
                      {data.maleCapacity || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">ذكور</p>
                  </div>
                  <div className="text-center p-3 bg-accent/5 rounded-lg">
                    <p className="text-xl font-bold text-accent">
                      {data.femaleCapacity || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">إناث</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services Card */}
            <Card>
              <CardHeader>
                <CardTitle>الخدمات المقدمة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.housing && (
                    <Badge variant="secondary">الإيواء</Badge>
                  )}
                  {data.meals && (
                    <Badge variant="secondary">الإطعام</Badge>
                  )}
                  {data.educationalSupport && (
                    <Badge variant="secondary">التتبع التربوي والمواكبة الاجتماعية</Badge>
                  )}
                  {data.culturalActivities && (
                    <Badge variant="secondary">التنشيط الثقافي والرياضي والترفيهي</Badge>
                  )}
                  {data.healthCare && (
                    <Badge variant="secondary">العلاجات الصحية الأولية</Badge>
                  )}
                  {data.psychologicalSupport && (
                    <Badge variant="secondary">الدعم والمواكبة الطبية والنفسية</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Target Levels Card */}
            <Card>
              <CardHeader>
                <CardTitle>المستويات المستهدفة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.primary && (
                    <Badge variant="outline">الابتدائي</Badge>
                  )}
                  {data.middleSchool && (
                    <Badge variant="outline">الإعدادي</Badge>
                  )}
                  {data.highSchool && (
                    <Badge variant="outline">الثانوي</Badge>
                  )}
                  {data.other && (
                    <Badge variant="outline">{data.otherDetail || "أخرى"}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Dates Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  التواريخ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <InfoRow
                  label="تاريخ الإنشاء"
                  value={new Date(data.createdAt).toLocaleDateString("ar-MA")}
                />
                <InfoRow
                  label="آخر تحديث"
                  value={new Date(data.updatedAt).toLocaleDateString("ar-MA")}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      </div>
    </ProtectedRoute>
  );
}
