"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "@/lib/form-context";
import { useAuthMutate, useAuthFetcher } from "@/lib/use-auth-swr";
import { Button } from "@/components/ui/button";
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
import { ArrowRight, Check, Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { LocationMapDisplay } from "@/components/form/location-map-display";

export function ReviewStep() {
  const { formData, setCurrentStep, resetForm, isEditMode, editId } = useFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const authFetch = useAuthMutate();
  const fetcher = useAuthFetcher();
  const [geoNames, setGeoNames] = useState<{
    region?: string;
    prefecture?: string;
    commune?: string;
  }>({});

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

      {/* Location Map */}
      {formData.latitude && formData.longitude && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              الموقع الجغرافي للمؤسسة
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              خط العرض: {formData.latitude.toFixed(6)} | خط الطول: {formData.longitude.toFixed(6)}
            </p>
          </CardHeader>
          <CardContent>
            <LocationMapDisplay
              latitude={formData.latitude}
              longitude={formData.longitude}
              height="250px"
            />
          </CardContent>
        </Card>
      )}

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
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <h4 className="font-medium text-sm text-muted-foreground">مصادر تمويل البناء</h4>
              <div className="flex flex-wrap gap-2">
                {formData.financing.solidarityMinistry && <span className="px-2 py-1 bg-secondary rounded text-xs">وزارة التضامن والإدماج الاجتماعي والأسرة</span>}
                {formData.financing.nationalEntraide && <span className="px-2 py-1 bg-secondary rounded text-xs">التعاون الوطني</span>}
                {formData.financing.indh && <span className="px-2 py-1 bg-secondary rounded text-xs">المبادرة الوطنية للتنمية البشرية</span>}
                {formData.financing.commune && <span className="px-2 py-1 bg-secondary rounded text-xs">الجماعة</span>}
                {formData.financing.fondationMohammed5 && <span className="px-2 py-1 bg-secondary rounded text-xs">مؤسسة محمد الخامس للتضامن</span>}
                {formData.financing.nationalRevival && <span className="px-2 py-1 bg-secondary rounded text-xs">الإنعاش الوطني</span>}
                {formData.financing.association && <span className="px-2 py-1 bg-secondary rounded text-xs">الجمعية/مؤسسة</span>}
                {formData.financing.otherConstruction && <span className="px-2 py-1 bg-secondary rounded text-xs">آخر: {formData.financing.otherConstructionDetail}</span>}
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-medium text-sm text-muted-foreground">مصادر تمويل التجهيز</h4>
              <div className="flex flex-wrap gap-2">
                {formData.financing.equipmentSolidarityMinistry && <span className="px-2 py-1 bg-secondary rounded text-xs">وزارة التضامن والإدماج الاجتماعي والأسرة</span>}
                {formData.financing.equipmentNationalEntraide && <span className="px-2 py-1 bg-secondary rounded text-xs">التعاون الوطني</span>}
                {formData.financing.equipmentIndh && <span className="px-2 py-1 bg-secondary rounded text-xs">المبادرة الوطنية للتنمية البشرية</span>}
                {formData.financing.equipmentCommune && <span className="px-2 py-1 bg-secondary rounded text-xs">الجماعة</span>}
                {formData.financing.equipmentFondationMohammed5 && <span className="px-2 py-1 bg-secondary rounded text-xs">مؤسسة محمد الخامس للتضامن</span>}
                {formData.financing.equipmentAssociation && <span className="px-2 py-1 bg-secondary rounded text-xs">الجمعية/مؤسسة</span>}
                {formData.financing.equipmentOther && <span className="px-2 py-1 bg-secondary rounded text-xs">آخر: {formData.financing.equipmentOtherDetail}</span>}
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-medium text-sm text-muted-foreground">مصادر تمويل التسيير</h4>
              <div className="flex flex-wrap gap-2">
                {formData.financing.operatingIndh && <span className="px-2 py-1 bg-secondary rounded text-xs">المبادرة الوطنية للتنمية البشرية</span>}
                {formData.financing.operatingNationalEntraide && <span className="px-2 py-1 bg-secondary rounded text-xs">التعاون الوطني</span>}
                {formData.financing.operatingNationalEducation && <span className="px-2 py-1 bg-secondary rounded text-xs">قطاع التربية الوطنية</span>}
                {formData.financing.operatingCommune && <span className="px-2 py-1 bg-secondary rounded text-xs">الجماعة</span>}
                {formData.financing.operatingParentContributions && <span className="px-2 py-1 bg-secondary rounded text-xs">اشتراكات الآباء</span>}
                {formData.financing.operatingDonors && <span className="px-2 py-1 bg-secondary rounded text-xs">المحسنون (هبات وغيرها)</span>}
                {formData.financing.operatingAssociationOwnSources && <span className="px-2 py-1 bg-secondary rounded text-xs">مصادر ذاتية للجمعية المسيرة</span>}
                {formData.financing.operatingOther && <span className="px-2 py-1 bg-secondary rounded text-xs">آخر: {formData.financing.operatingOtherDetail}</span>}
              </div>
            </div>

            <div className="border-t pt-4 space-y-1">
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
              {formData.financing.parentContributionAmount && (
                <InfoRow
                  label="مبلغ اشتراكات الآباء الشهري"
                  value={`${formData.financing.parentContributionAmount.toLocaleString()} درهم`}
                />
              )}
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
              <InfoRow
                label="الكلفة السنوية لباقي النفقات"
                value={
                  formData.financing.annualOtherExpenses &&
                  `${formData.financing.annualOtherExpenses.toLocaleString()} درهم`
                }
              />
              <InfoRow
                label="الكلفة الفردية السنوية"
                value={
                  formData.financing.individualAnnualCost &&
                  `${formData.financing.individualAnnualCost.toLocaleString()} درهم`
                }
              />
            </div>

            {(formData.financing.associationShare || formData.financing.educationShare || formData.financing.otherShare) && (
              <div className="border-t pt-4 space-y-1">
                <h4 className="font-medium text-sm text-muted-foreground mb-2">نسب المساهمة في تمويل الإطعام</h4>
                <InfoRow label="نسبة مساهمة الجمعية المسيرة" value={formData.financing.associationShare ? `${formData.financing.associationShare}%` : undefined} />
                <InfoRow label="نسبة مساهمة قطاع التربية الوطنية" value={formData.financing.educationShare ? `${formData.financing.educationShare}%` : undefined} />
                <InfoRow label="نسبة مساهمة أخر��" value={formData.financing.otherShare ? `${formData.financing.otherShare}%` : undefined} />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Targeting Info */}
      {formData.targeting && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">معطيات حول الاستهداف وتوسعة الخدمات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <h4 className="font-medium text-sm text-muted-foreground">معايير الاستهداف</h4>
              <div className="flex flex-wrap gap-2">
                {formData.targeting.socialSituation && <span className="px-2 py-1 bg-secondary rounded text-xs">الوضعية الاجتماعية للأسرة</span>}
                {formData.targeting.distance && <span className="px-2 py-1 bg-secondary rounded text-xs">المسافة بين المدرسة ومحل سكن المستفيد</span>}
                {formData.targeting.schoolResults && <span className="px-2 py-1 bg-secondary rounded text-xs">النتائج المدرسية للمستفيد</span>}
                {formData.targeting.scholarship && <span className="px-2 py-1 bg-secondary rounded text-xs">الاستفادة من المنحة الدراسية</span>}
                {formData.targeting.otherCriteria && <span className="px-2 py-1 bg-secondary rounded text-xs">آخر: {formData.targeting.otherCriteriaDetail}</span>}
              </div>
            </div>

            <div className="border-t pt-4 space-y-1">
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
                    label="نوع التعريفة"
                    value={
                      formData.targeting.tariffType &&
                      tariffTypeLabels[formData.targeting.tariffType]
                    }
                  />
                  <InfoRow
                    label="قيمة الاشتراك الموحد"
                    value={
                      formData.targeting.uniformAmount &&
                      `${formData.targeting.uniformAmount} درهم`
                    }
                  />
                  {formData.targeting.tariffBracket && (
                    <InfoRow
                      label="شريحة الاشتراك"
                      value={tariffBracketLabels[formData.targeting.tariffBracket]}
                    />
                  )}
                  <InfoRow
                    label="الجهة المحددة للتعريفة"
                    value={formData.targeting.tariffDeterminationBody && selectionBodyLabels[formData.targeting.tariffDeterminationBody]}
                  />
                </>
              )}
              <InfoRow
                label="عدد الطلبات التي لم تتم الاستجابة لها"
                value={formData.targeting.unsatisfiedRequestsCount}
              />
            </div>
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
                    مستخدم
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
