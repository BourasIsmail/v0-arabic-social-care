"use client";

import { useState, useEffect, useRef } from "react";
import { useFormContext } from "@/lib/form-context";
import { useAuthMutate, useAuthFetcher } from "@/lib/use-auth-swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { GeoDTO } from "@/lib/types";
import {
  institutionTypeLabels,
  milieuLabels,
  legalStatusLabels,
  distanceLabels,
  buildingStatusLabels,
  buildingConditionLabels,
  renovationCapacityLabels,
  ownerTypeLabels,
  selectionBodyLabels,
  tariffTypeLabels,
  tariffBracketLabels,
  mealServiceTypeLabels,
  staffTypeLabels,
} from "@/lib/types";
import type { InstitutionRequest } from "@/lib/types";
import { ArrowRight, Check, Loader2, Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";

export function ReviewStep() {
  const { formData, setCurrentStep, resetForm, isEditMode, editId, updateFormData } = useFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const authFetch = useAuthMutate();
  const fetcher = useAuthFetcher();
  const [geoNames, setGeoNames] = useState<{
    region?: string;
    prefecture?: string;
    commune?: string;
  }>({});

  // PDF upload handler
  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("يرجى اختيار ملف PDF فقط");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error("حجم الملف يجب أن لا يتجاوز 10 ميغابايت");
      return;
    }

    setIsUploading(true);
    try {
      // Create FormData for file upload
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      // Upload to API
      const response = await authFetch("/api/api/v1/files/upload", {
        method: "POST",
        body: uploadFormData,
        headers: {}, // Let browser set content-type for FormData
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      updateFormData({ signedPdfUrl: result.url || result.fileUrl });
      toast.success("تم تحميل الملف بنجاح");
    } catch (error) {
      toast.error("فشل تحميل الملف");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemovePdf = () => {
    updateFormData({ signedPdfUrl: undefined });
    toast.success("تم حذف الملف");
  };

  // Fetch geo names for display
  useEffect(() => {
    async function fetchGeoNames() {
      const names: typeof geoNames = {};

      if (formData.regionId) {
        try {
          const regions: GeoDTO[] = await fetcher("/api/api/v1/regions");
          const region = regions.find((r) => r.id === formData.regionId);
          if (region) names.region = region.name;
        } catch (e) {
          console.error("Failed to fetch region name", e);
        }
      }

      if (formData.regionId && formData.prefectureId) {
        try {
          const prefectures: GeoDTO[] = await fetcher(`/api/api/v1/regions/${formData.regionId}/prefectures`);
          const prefecture = prefectures.find((p) => p.id === formData.prefectureId);
          if (prefecture) names.prefecture = prefecture.name;
        } catch (e) {
          console.error("Failed to fetch prefecture name", e);
        }
      }

      if (formData.prefectureId && formData.communeId) {
        try {
          const communes: GeoDTO[] = await fetcher(`/api/api/v1/prefectures/${formData.prefectureId}/communes`);
          const commune = communes.find((c) => c.id === formData.communeId);
          if (commune) names.commune = commune.name;
        } catch (e) {
          console.error("Failed to fetch commune name", e);
        }
      }

      setGeoNames(names);
    }

    fetchGeoNames();
  }, [formData.regionId, formData.prefectureId, formData.communeId, fetcher]);

  const goBack = () => {
    setCurrentStep("staff");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const url = isEditMode ? `/api/api/v1/institutions/${editId}` : "/api/api/v1/institutions";
      const method = isEditMode ? "PUT" : "POST";
      
      const response = await authFetch(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      toast.success(isEditMode ? "تم تحديث البيانات بنجاح" : "تم حفظ البيانات بنجاح");
      resetForm();
      
      // Redirect after successful save
      if (isEditMode) {
        window.location.href = `/institutions/${editId}`;
      } else {
        window.location.href = "/institutions";
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ البيانات");
    } finally {
      setIsSubmitting(false);
    }
  };

  const InfoRow = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div className="flex justify-between py-2 border-b border-border last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value || "-"}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>مراجعة البيانات</CardTitle>
          <CardDescription>راجع جميع البيانات قبل الإرسال</CardDescription>
        </CardHeader>
      </Card>

      {/* Institution Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">معطيات حول المؤسسة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <InfoRow
            label="نوعية المؤسسة"
            value={formData.institutionType && institutionTypeLabels[formData.institutionType]}
          />
          <InfoRow label="اسم الجمعية المشرفة" value={formData.associationName} />
          <InfoRow label="اسم المؤسسة" value={formData.institutionName} />
          <InfoRow label="العنوان" value={formData.address} />
          <InfoRow label="الجهة" value={geoNames.region} />
          <InfoRow label="العمالة أو الإقليم" value={geoNames.prefecture} />
          <InfoRow label="الجماعة" value={geoNames.commune} />
          <InfoRow label="المجال" value={formData.milieu && milieuLabels[formData.milieu]} />
          <InfoRow label="سنة إحداث المؤسسة" value={formData.creationYear} />
          <InfoRow
            label="الوضعية القانونية للمؤسسة"
            value={formData.legalStatus && legalStatusLabels[formData.legalStatus]}
          />
          <InfoRow label="الطاقة الاستيعابية الإجمالية" value={formData.totalCapacity} />
          <InfoRow label="الطاقة الاستيعابية المرخصة ذكور" value={formData.maleCapacity} />
          <InfoRow label="الطاقة الاستيعابية المرخصة إناث" value={formData.femaleCapacity} />
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">الخدمات المقدمة بالمؤسسة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {formData.housing && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                الإيواء
              </span>
            )}
            {formData.meals && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                الإطعام
              </span>
            )}
            {formData.educationalSupport && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                التتبع التربوي والمواكبة الاجتماعية
              </span>
            )}
            {formData.culturalActivities && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                التنشيط الثقافي والرياضي والترفيهي
              </span>
            )}
            {formData.healthCare && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                العلاجات الصحية الأولية
              </span>
            )}
            {formData.psychologicalSupport && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                الدعم والمواكبة الطبية والنفسي��
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Building Info */}
      {formData.building && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">معطيات حول البناية المخصصة للمؤسسة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow
              label="وضعية البناية"
              value={
                formData.building.buildingStatus &&
                buildingStatusLabels[formData.building.buildingStatus]
              }
            />
            <InfoRow
              label="الحالة العامة للبناية"
              value={
                formData.building.buildingCondition &&
                buildingConditionLabels[formData.building.buildingCondition]
              }
            />
            <InfoRow
              label="قابلية البناية للترميم والإصلاح"
              value={
                formData.building.renovationCapacity &&
                renovationCapacityLabels[formData.building.renovationCapacity]
              }
            />
            <InfoRow
              label="تحديد مالك الوعاء العقاري"
              value={
                formData.building.ownerType && ownerTypeLabels[formData.building.ownerType]
              }
            />
            <InfoRow
              label="وضع البناية رهن إشارة المؤسسة بموجب اتفاقية شراكة"
              value={formData.building.hasPartnershipAgreement ? "نعم" : "لا"}
            />
          </CardContent>
        </Card>
      )}

      {/* Financing Info */}
      {formData.financing && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">معطيات حول تمويل المؤسسة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow
              label="الكلفة الإجمالية لبناء المؤسسة"
              value={
                formData.financing.totalConstructionCost &&
                `${formData.financing.totalConstructionCost.toLocaleString()} درهم`
              }
            />
            <InfoRow
              label="الكلفة السنوية لتسيير المؤسسة"
              value={
                formData.financing.annualManagementCost &&
                `${formData.financing.annualManagementCost.toLocaleString()} درهم`
              }
            />
            <InfoRow
              label="الكلفة السنوية المخصصة للموارد البشرية"
              value={
                formData.financing.annualHRCost &&
                `${formData.financing.annualHRCost.toLocaleString()} درهم`
              }
            />
            <InfoRow
              label="الكلفة السنوية المخصصة للإطعام"
              value={
                formData.financing.annualMealsCost &&
                `${formData.financing.annualMealsCost.toLocaleString()} درهم`
              }
            />
          </CardContent>
        </Card>
      )}

      {/* Targeting Info */}
      {formData.targeting && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">معطيات حول الاستهداف وتوسعة الخدمات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow
              label="الجهة التي تقوم بعملية انتقاء المستفيدين"
              value={
                formData.targeting.selectionBody &&
                selectionBodyLabels[formData.targeting.selectionBody]
              }
            />
            <InfoRow
              label="خدمات المؤسسة مجانية"
              value={formData.targeting.servicesAreFree ? "نعم" : "لا"}
            />
            {!formData.targeting.servicesAreFree && (
              <>
                <InfoRow
                  label="مبلغ الاشتراك الشهري"
                  value={
                    formData.targeting.tariffType &&
                    tariffTypeLabels[formData.targeting.tariffType]
                  }
                />
                <InfoRow
                  label="قيمتها"
                  value={
                    formData.targeting.uniformAmount &&
                    `${formData.targeting.uniformAmount} درهم`
                  }
                />
              </>
            )}
            <InfoRow
              label="عدد الطلبات التي لم تتم الاستجابة لها"
              value={formData.targeting.unsatisfiedRequestsCount}
            />
          </CardContent>
        </Card>
      )}

      {/* Staff Info */}
      {formData.staffMembers && formData.staffMembers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">معطيات حول الموارد البشرية العاملة بالمؤسسة</CardTitle>
            <CardDescription>{formData.staffMembers.length} صنف من التأطير</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formData.staffMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-border last:border-0"
                >
                  <span className="font-medium">{staffTypeLabels[member.staffType]}</span>
                  <span className="text-muted-foreground">
                    {(member.nbAssociation || 0) +
                      (member.nbDeployed || 0) +
                      (member.nbVolunteers || 0)}{" "}
                    موظف
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Signed PDF Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">تحميل الاستبيان الموقع</CardTitle>
          <CardDescription>قم بتحميل نسخة PDF من الاستبيان بعد توقيعه</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.signedPdfUrl ? (
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">الاستبيان الموقع</p>
                  <a 
                    href={formData.signedPdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    عرض الملف
                  </a>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemovePdf}
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
                <span className="mr-1">حذف</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                disabled={isUploading}
                className="hidden"
                id="pdf-upload"
              />
              <Label
                htmlFor="pdf-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-muted-foreground">جاري التحميل...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="h-8 w-8" />
                    <span>اضغط لتحميل ملف PDF</span>
                    <span className="text-xs">(الحد الأقصى 10 ميغابايت)</span>
                  </div>
                )}
              </Label>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={goBack}
          disabled={isSubmitting}
          className="gap-2"
        >
          <ArrowRight className="h-4 w-4" />
          السابق
        </Button>
        <Button
          type="button"
          size="lg"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="gap-2 bg-accent hover:bg-accent/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEditMode ? "جاري التحديث..." : "جاري الحفظ..."}
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              {isEditMode ? "تحديث البيانات" : "حفظ البيانات"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
