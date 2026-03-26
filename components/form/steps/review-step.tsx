"use client";

import { useState } from "react";
import { useFormContext } from "@/lib/form-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ReviewStep() {
  const { formData, setCurrentStep, resetForm } = useFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goBack = () => {
    setCurrentStep("staff");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/institutions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      toast.success("تم حفظ البيانات بنجاح");
      resetForm();
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
          <CardTitle className="text-base">معلومات المؤسسة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <InfoRow
            label="نوع المؤسسة"
            value={formData.institutionType && institutionTypeLabels[formData.institutionType]}
          />
          <InfoRow label="اسم الجمعية" value={formData.associationName} />
          <InfoRow label="اسم المؤسسة" value={formData.institutionName} />
          <InfoRow label="العنوان" value={formData.address} />
          <InfoRow label="الجهة" value={formData.region} />
          <InfoRow label="العمالة/الإقليم" value={formData.prefectureProvince} />
          <InfoRow label="الجماعة" value={formData.commune} />
          <InfoRow label="الوسط" value={formData.milieu && milieuLabels[formData.milieu]} />
          <InfoRow label="سنة التأسيس" value={formData.creationYear} />
          <InfoRow
            label="الوضعية القانونية"
            value={formData.legalStatus && legalStatusLabels[formData.legalStatus]}
          />
          <InfoRow label="الطاقة الإجمالية" value={formData.totalCapacity} />
          <InfoRow label="طاقة الذكور" value={formData.maleCapacity} />
          <InfoRow label="طاقة الإناث" value={formData.femaleCapacity} />
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">الخدمات المقدمة</CardTitle>
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
                الدعم التربوي
              </span>
            )}
            {formData.culturalActivities && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                الأنشطة الثقافية
              </span>
            )}
            {formData.healthCare && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                الرعاية الصحية
              </span>
            )}
            {formData.insurance && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                التأمين
              </span>
            )}
            {formData.psychologicalSupport && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                الدعم النفسي
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Building Info */}
      {formData.building && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">معلومات البناية</CardTitle>
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
              label="حالة البناية"
              value={
                formData.building.buildingCondition &&
                buildingConditionLabels[formData.building.buildingCondition]
              }
            />
            <InfoRow
              label="القدرة على التجديد"
              value={
                formData.building.renovationCapacity &&
                renovationCapacityLabels[formData.building.renovationCapacity]
              }
            />
            <InfoRow
              label="نوع المالك"
              value={
                formData.building.ownerType && ownerTypeLabels[formData.building.ownerType]
              }
            />
            <InfoRow
              label="اتفاقية شراكة"
              value={formData.building.hasPartnershipAgreement ? "نعم" : "لا"}
            />
          </CardContent>
        </Card>
      )}

      {/* Financing Info */}
      {formData.financing && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">معلومات التمويل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow
              label="التكلفة الإجمالية للبناء"
              value={
                formData.financing.totalConstructionCost &&
                `${formData.financing.totalConstructionCost.toLocaleString()} درهم`
              }
            />
            <InfoRow
              label="التكلفة السنوية للتسيير"
              value={
                formData.financing.annualManagementCost &&
                `${formData.financing.annualManagementCost.toLocaleString()} درهم`
              }
            />
            <InfoRow
              label="التكلفة السنوية للموارد البشرية"
              value={
                formData.financing.annualHRCost &&
                `${formData.financing.annualHRCost.toLocaleString()} درهم`
              }
            />
            <InfoRow
              label="التكلفة السنوية للإطعام"
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
            <CardTitle className="text-base">معلومات الاستهداف</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow
              label="جهة الانتقاء"
              value={
                formData.targeting.selectionBody &&
                selectionBodyLabels[formData.targeting.selectionBody]
              }
            />
            <InfoRow
              label="الخدمات مجانية"
              value={formData.targeting.servicesAreFree ? "نعم" : "لا"}
            />
            {!formData.targeting.servicesAreFree && (
              <>
                <InfoRow
                  label="نوع التعريفة"
                  value={
                    formData.targeting.tariffType &&
                    tariffTypeLabels[formData.targeting.tariffType]
                  }
                />
                <InfoRow
                  label="المبلغ الموحد"
                  value={
                    formData.targeting.uniformAmount &&
                    `${formData.targeting.uniformAmount} درهم`
                  }
                />
              </>
            )}
            <InfoRow
              label="عدد الطلبات غير الملباة"
              value={formData.targeting.unsatisfiedRequestsCount}
            />
          </CardContent>
        </Card>
      )}

      {/* Staff Info */}
      {formData.staffMembers && formData.staffMembers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">الموارد البشرية</CardTitle>
            <CardDescription>{formData.staffMembers.length} موظف(ين)</CardDescription>
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
              جاري الحفظ...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              حفظ البيانات
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
