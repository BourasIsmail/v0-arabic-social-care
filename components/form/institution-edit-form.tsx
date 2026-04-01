"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthFetcher, useAuthMutate } from "@/lib/use-auth-swr";
import { LocationPicker } from "@/components/form/location-picker";
import useSWR from "swr";
import type {
  InstitutionRequest,
  InstitutionResponse,
  StaffMemberDTO,
  GeoDTO,
} from "@/lib/types";
import {
  InstitutionType,
  institutionTypeLabels,
  Milieu,
  milieuLabels,
  LegalStatus,
  legalStatusLabels,
  Distance,
  distanceLabels,
  BuildingStatus,
  buildingStatusLabels,
  BuildingCondition,
  buildingConditionLabels,
  RenovationCapacity,
  renovationCapacityLabels,
  OwnerType,
  ownerTypeLabels,
  SelectionBody,
  selectionBodyLabels,
  TariffType,
  tariffTypeLabels,
  TariffBracket,
  tariffBracketLabels,
  MealServiceType,
  mealServiceTypeLabels,
  StaffType,
  staffTypeLabels,
} from "@/lib/types";

interface InstitutionEditFormProps {
  institution: InstitutionResponse;
}

export function InstitutionEditForm({ institution }: InstitutionEditFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const fetcher = useAuthFetcher();
  const authMutate = useAuthMutate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if user has fixed region/prefecture (USER role) - but allow editing all in edit mode
  const isUserRole = user?.role === "USER";
  const [staffMembers, setStaffMembers] = useState<StaffMemberDTO[]>(
    institution.staffMembers || []
  );
  const [newStaff, setNewStaff] = useState<Partial<StaffMemberDTO>>({});

  // Geo data
  const { data: regions } = useSWR<GeoDTO[]>("/api/api/v1/regions", fetcher);
  const [selectedRegion, setSelectedRegion] = useState<number | undefined>(
    institution.regionId
  );
  const [selectedPrefecture, setSelectedPrefecture] = useState<number | undefined>(
    institution.prefectureId
  );

  const { data: prefectures } = useSWR<GeoDTO[]>(
    selectedRegion ? `/api/api/v1/regions/${selectedRegion}/prefectures` : null,
    fetcher
  );
  const { data: communes } = useSWR<GeoDTO[]>(
    selectedPrefecture ? `/api/api/v1/prefectures/${selectedPrefecture}/communes` : null,
    fetcher
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InstitutionRequest>({
    defaultValues: {
      institutionType: institution.institutionType,
      associationName: institution.associationName,
      institutionName: institution.institutionName,
      address: institution.address || "",
      regionId: institution.regionId,
      prefectureId: institution.prefectureId,
      communeId: institution.communeId,
      milieu: institution.milieu,
      creationYear: institution.creationYear,
      legalStatus: institution.legalStatus,
      licenseNumber: institution.licenseNumber || "",
      unlicensedReason: institution.unlicensedReason || "",
      serviceStartDate: institution.serviceStartDate || "",
      housing: institution.housing || false,
      meals: institution.meals || false,
      educationalSupport: institution.educationalSupport || false,
      culturalActivities: institution.culturalActivities || false,
      healthCare: institution.healthCare || false,
      insurance: institution.insurance || false,
      psychologicalSupport: institution.psychologicalSupport || false,
      totalCapacity: institution.totalCapacity,
      maleCapacity: institution.maleCapacity,
      femaleCapacity: institution.femaleCapacity,
      primary: institution.primary || false,
      middleSchool: institution.middleSchool || false,
      highSchool: institution.highSchool || false,
      other: institution.other || false,
      distanceToSchool: institution.distanceToSchool,
      distanceToNationalBoardingSchool: institution.distanceToNationalBoardingSchool,
      building: institution.building || {},
      financing: institution.financing || {},
      targeting: institution.targeting || {},
      housingMeals: institution.housingMeals || {
        season2324: {},
        season2425: {},
        season2526: {},
      },
    },
  });

  const legalStatus = watch("legalStatus");
  const targetOther = watch("other");

  const addStaffMember = () => {
    if (newStaff.staffType) {
      setStaffMembers([...staffMembers, newStaff as StaffMemberDTO]);
      setNewStaff({});
    }
  };

  const removeStaffMember = (index: number) => {
    setStaffMembers(staffMembers.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: InstitutionRequest) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        staffMembers,
      };

      const response = await authMutate(`/api/api/v1/institutions/${institution.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }

      toast.success("تم تحديث بيانات المؤسسة بنجاح");
      router.push(`/institutions/${institution.id}`);
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث البيانات");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Section 1: Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>المعلومات الأساسية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>نوع المؤسسة *</Label>
              <Select
                value={watch("institutionType")}
                onValueChange={(v) => setValue("institutionType", v as InstitutionType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع المؤسسة" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(institutionTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>اسم الجمعية *</Label>
              <Input {...register("associationName", { required: true })} />
            </div>

            <div className="space-y-2">
              <Label>اسم المؤسسة *</Label>
              <Input {...register("institutionName", { required: true })} />
            </div>

            <div className="space-y-2">
              <Label>العنوان</Label>
              <Input {...register("address")} />
            </div>

            <div className="space-y-2">
              <Label>الجهة</Label>
              <Select
                value={selectedRegion?.toString() || ""}
                onValueChange={(v) => {
                  const val = parseInt(v);
                  setSelectedRegion(val);
                  setValue("regionId", val);
                  setSelectedPrefecture(undefined);
                  setValue("prefectureId", "" as unknown as number);
                  setValue("communeId", "" as unknown as number);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الجهة" />
                </SelectTrigger>
                <SelectContent>
                  {regions?.map((r) => (
                    <SelectItem key={r.id} value={r.id.toString()}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الإقليم</Label>
              <Select
                value={selectedPrefecture?.toString() || ""}
                onValueChange={(v) => {
                  const val = parseInt(v);
                  setSelectedPrefecture(val);
                  setValue("prefectureId", val);
                  setValue("communeId", "" as unknown as number);
                }}
                disabled={!selectedRegion}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الإقليم" />
                </SelectTrigger>
                <SelectContent>
                  {prefectures?.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الجماعة</Label>
              <Select
                value={watch("communeId")?.toString() || ""}
                onValueChange={(v) => setValue("communeId", parseInt(v))}
                disabled={!selectedPrefecture}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الجماعة" />
                </SelectTrigger>
                <SelectContent>
                  {communes?.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الوسط</Label>
              <Select
              value={watch("milieu") || ""}
              onValueChange={(v) => setValue("milieu", v as Milieu)}
              >
              <SelectTrigger>
              <SelectValue placeholder="اختر الوسط" />
              </SelectTrigger>
              <SelectContent>
              {Object.entries(milieuLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
              {label}
              </SelectItem>
              ))}
              </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <LocationPicker
                latitude={watch("latitude")}
                longitude={watch("longitude")}
                onLocationChange={(lat, lng) => {
                  setValue("latitude", lat);
                  setValue("longitude", lng);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>سنة التأسيس</Label>
              <Input
                type="number"
                {...register("creationYear", { 
                  valueAsNumber: true,
                  max: {
                    value: 2026,
                    message: "سنة إحداث المؤسسة يجب أن تكون أصغر أو تساوي 2026"
                  }
                })}
              />
              {errors.creationYear && (
                <p className="text-sm text-destructive">{errors.creationYear.message || "سنة إحداث المؤسسة غير صالحة"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>الوضعية القانونية</Label>
              <Select
                value={legalStatus || ""}
                onValueChange={(v) => setValue("legalStatus", v as LegalStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الوضعية" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(legalStatusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {legalStatus === LegalStatus.LICENSED && (
              <div className="space-y-2">
                <Label>رقم الترخيص</Label>
                <Input {...register("licenseNumber")} />
              </div>
            )}

            {legalStatus === LegalStatus.UNLICENSED && (
              <div className="space-y-2">
                <Label>سبب عدم الترخيص</Label>
                <Input {...register("unlicensedReason")} />
              </div>
            )}

            <div className="space-y-2">
              <Label>تاريخ بداية الخدمة</Label>
              <Input 
                type="date" 
                max={new Date().toISOString().split('T')[0]}
                {...register("serviceStartDate", {
                  validate: (value) => {
                    if (value && new Date(value) >= new Date()) {
                      return "تاريخ شروع المؤسسة يجب أن يكون أصغر من تاريخ اليوم";
                    }
                    return true;
                  }
                })}
              />
              {errors.serviceStartDate && (
                <p className="text-sm text-destructive">{errors.serviceStartDate.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Services */}
      <Card>
        <CardHeader>
          <CardTitle>الخدمات المقدمة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "housing", label: "الإيواء" },
              { name: "meals", label: "الإطعام" },
              { name: "educationalSupport", label: "التتبع التربوي والمواكبة الاجتماعية" },
              { name: "culturalActivities", label: "التنشيط الثقافي والرياضي والترفيهي" },
              { name: "healthCare", label: "العلاجات الصحية الأولية" },
              { name: "psychologicalSupport", label: "الدعم والمواكبة الطبية والنفسية" },
            ].map((service) => (
              <div key={service.name} className="flex items-center gap-2">
                <Checkbox
                  id={service.name}
                  checked={watch(service.name as keyof InstitutionRequest) as boolean}
                  onCheckedChange={(checked) =>
                    setValue(service.name as keyof InstitutionRequest, checked as boolean)
                  }
                />
                <Label htmlFor={service.name}>{service.label}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Capacity */}
      <Card>
        <CardHeader>
          <CardTitle>الطاقة الاستيعابية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>الطاقة الإجمالية</Label>
              <Input
                type="number"
                value={watch("totalCapacity") || ""}
                readOnly
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">يتم حسابها تلقائيا</p>
            </div>
            <div className="space-y-2">
              <Label>طاقة الذكور</Label>
              <Input
                type="number"
                {...register("maleCapacity", { 
                  valueAsNumber: true,
                  onChange: (e) => {
                    const males = parseInt(e.target.value) || 0;
                    const females = watch("femaleCapacity") || 0;
                    setValue("totalCapacity", males + females);
                  }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label>طاقة الإناث</Label>
              <Input
                type="number"
                {...register("femaleCapacity", { 
                  valueAsNumber: true,
                  onChange: (e) => {
                    const females = parseInt(e.target.value) || 0;
                    const males = watch("maleCapacity") || 0;
                    setValue("totalCapacity", males + females);
                  }
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Target Levels */}
      <Card>
        <CardHeader>
          <CardTitle>المستويات المستهدفة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "primary", label: "ابتدائي" },
              { name: "middleSchool", label: "إعدادي" },
              { name: "highSchool", label: "ثانوي" },
              { name: "other", label: "أخرى" },
            ].map((level) => (
              <div key={level.name} className="flex items-center gap-2">
                <Checkbox
                  id={level.name}
                  checked={watch(level.name as keyof InstitutionRequest) as boolean}
                  onCheckedChange={(checked) =>
                    setValue(level.name as keyof InstitutionRequest, checked as boolean)
                  }
                />
                <Label htmlFor={level.name}>{level.label}</Label>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>المسافة إلى المدرسة</Label>
              <Select
                value={watch("distanceToSchool") || ""}
                onValueChange={(v) => setValue("distanceToSchool", v as Distance)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المسافة" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(distanceLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>المسافة إلى الداخلية الوطنية</Label>
              <Select
                value={watch("distanceToNationalBoardingSchool") || ""}
                onValueChange={(v) =>
                  setValue("distanceToNationalBoardingSchool", v as Distance)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المسافة" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(distanceLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Building */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات المبنى</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>وضعية البناء</Label>
              <Select
                value={watch("building.buildingStatus") || ""}
                onValueChange={(v) =>
                  setValue("building.buildingStatus", v as BuildingStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الوضعية" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(buildingStatusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {watch("building.buildingStatus") === "OTHER" && (
                <Input
                  placeholder="حدد وضعية البناية"
                  {...register("building.buildingStatusOther")}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label>حالة البناء</Label>
              <Select
                value={watch("building.buildingCondition") || ""}
                onValueChange={(v) =>
                  setValue("building.buildingCondition", v as BuildingCondition)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(buildingConditionLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {watch("building.buildingCondition") === "OTHER" && (
                <Input
                  placeholder="حدد حالة البناية"
                  {...register("building.buildingConditionOther")}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label>قابلية الترميم</Label>
              <Select
                value={watch("building.renovationCapacity") || ""}
                onValueChange={(v) =>
                  setValue("building.renovationCapacity", v as RenovationCapacity)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر القابلية" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(renovationCapacityLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>نوع الملكية</Label>
              <Select
                value={watch("building.ownerType") || ""}
                onValueChange={(v) => setValue("building.ownerType", v as OwnerType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الملكية" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ownerTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {watch("building.ownerType") === "OTHER" && (
                <Input
                  placeholder="حدد نوع المالك"
                  {...register("building.ownerTypeOther")}
                />
              )}
            </div>

            <div className="flex items-center gap-2 col-span-full">
              <Checkbox
                id="hasPartnershipAgreement"
                checked={watch("building.hasPartnershipAgreement") || false}
                onCheckedChange={(checked) =>
                  setValue("building.hasPartnershipAgreement", checked as boolean)
                }
              />
              <Label htmlFor="hasPartnershipAgreement">يوجد اتفاق شراكة</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Housing & Meals */}
      <Card>
        <CardHeader>
          <CardTitle>الإيواء والإطعام</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>نوع خدمة الوجبات</Label>
            <Select
              value={watch("housingMeals.mealServiceType") || ""}
              onValueChange={(v) =>
                setValue("housingMeals.mealServiceType", v as MealServiceType)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع الخدمة" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(mealServiceTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {watch("housingMeals.mealServiceType") === "OTHER" && (
              <Input
                placeholder="حدد نوعية خدمة الإطعام"
                {...register("housingMeals.mealServiceTypeOther")}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label>ملاحظات حول الطاقة الاستيعابية</Label>
            <Input {...register("housingMeals.capacityRemarks")} />
          </div>

          {/* Season data */}
          {["season2324", "season2425", "season2526"].map((season) => {
            const seasonLabel = season === "season2324" ? "2023-2024" : season === "season2425" ? "2024-2025" : "2025-2026";
            const seasonKey = season as "season2324" | "season2425" | "season2526";
            return (
              <div key={season} className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">موسم {seasonLabel}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>إجمالي المستفيدين</Label>
                    <Input
                      type="number"
                      value={watch(`housingMeals.${seasonKey}.totalBeneficiaries`) || ""}
                      readOnly
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">يتم حسابه تلقائيا</p>
                  </div>
                  <div className="space-y-2">
                    <Label>المستفيدون (ذكور)</Label>
                    <Input
                      type="number"
                      {...register(`housingMeals.${seasonKey}.maleBeneficiaries` as keyof InstitutionRequest, { 
                        valueAsNumber: true,
                        onChange: (e) => {
                          const males = parseInt(e.target.value) || 0;
                          const females = watch(`housingMeals.${seasonKey}.femaleBeneficiaries`) || 0;
                          setValue(`housingMeals.${seasonKey}.totalBeneficiaries` as keyof InstitutionRequest, males + females);
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>المستفيدون (إناث)</Label>
                    <Input
                      type="number"
                      {...register(`housingMeals.${seasonKey}.femaleBeneficiaries` as keyof InstitutionRequest, { 
                        valueAsNumber: true,
                        onChange: (e) => {
                          const females = parseInt(e.target.value) || 0;
                          const males = watch(`housingMeals.${seasonKey}.maleBeneficiaries`) || 0;
                          setValue(`housingMeals.${seasonKey}.totalBeneficiaries` as keyof InstitutionRequest, males + females);
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>مستفيدون ابتدائي</Label>
                    <Input
                      type="number"
                      {...register(`housingMeals.${season}.primaryBeneficiaries` as keyof InstitutionRequest, { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>مستفيدون إعدادي</Label>
                    <Input
                      type="number"
                      {...register(`housingMeals.${season}.middleSchoolBeneficiaries` as keyof InstitutionRequest, { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>مستفيدون ثانوي</Label>
                    <Input
                      type="number"
                      {...register(`housingMeals.${season}.highSchoolBeneficiaries` as keyof InstitutionRequest, { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>الأيتام</Label>
                    <Input
                      type="number"
                      {...register(`housingMeals.${season}.orphans` as keyof InstitutionRequest, { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ذوو الإعاقة</Label>
                    <Input
                      type="number"
                      {...register(`housingMeals.${season}.disabled` as keyof InstitutionRequest, { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Section 7: Targeting */}
      <Card>
        <CardHeader>
          <CardTitle>الاستهداف</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-2 block">معايير الاختيار</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: "targeting.socialSituation", label: "الفقر" },
                { name: "targeting.distance", label: "البعد عن المدرسة" },
                { name: "targeting.scholarship", label: "اليتم" },
                { name: "targeting.schoolResults", label: "الإعاقة" },
                { name: "targeting.otherCriteria", label: "أخرى" },
              ].map((criteria) => (
                <div key={criteria.name} className="flex items-center gap-2">
                  <Checkbox
                    id={criteria.name}
                    checked={watch(criteria.name as keyof InstitutionRequest) as boolean || false}
                    onCheckedChange={(checked) =>
                      setValue(criteria.name as keyof InstitutionRequest, checked as boolean)
                    }
                  />
                  <Label htmlFor={criteria.name}>{criteria.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>جه�� الاختيار</Label>
            <Select
              value={watch("targeting.selectionBody") || ""}
              onValueChange={(v) =>
                setValue("targeting.selectionBody", v as SelectionBody)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر جهة الاختيار" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(selectionBodyLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="servicesAreFree"
              checked={watch("targeting.servicesAreFree") || false}
              onCheckedChange={(checked) =>
                setValue("targeting.servicesAreFree", checked as boolean)
              }
            />
            <Label htmlFor="servicesAreFree">الخدمات مجانية</Label>
          </div>
        </CardContent>
      </Card>

      {/* Section 8: Staff */}
      <Card>
        <CardHeader>
          <CardTitle>الموارد البشرية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing staff list */}
          {staffMembers.length > 0 && (
            <div className="space-y-2">
              {staffMembers.map((staff, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-medium">
                      {staffTypeLabels[staff.staffType]}
                    </span>
                    <span className="text-muted-foreground">العدد: {staff.count || 1}</span>
                    {staff.monthlySalary && (
                      <span className="text-muted-foreground">
                        الراتب: {staff.monthlySalary} درهم
                      </span>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStaffMember(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add new staff */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <Label>نوع الموظف</Label>
              <Select
                value={newStaff.staffType || ""}
                onValueChange={(v) =>
                  setNewStaff({ ...newStaff, staffType: v as StaffType })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(staffTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>العدد</Label>
              <Input
                type="number"
                value={newStaff.count || ""}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, count: parseInt(e.target.value) || undefined })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>الراتب الشهري</Label>
              <Input
                type="number"
                value={newStaff.monthlySalary || ""}
                onChange={(e) =>
                  setNewStaff({
                    ...newStaff,
                    monthlySalary: parseInt(e.target.value) || undefined,
                  })
                }
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={addStaffMember}
                disabled={!newStaff.staffType}
                className="w-full"
              >
                <Plus className="h-4 w-4 ml-2" />
                اضافة مستخدم
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/institutions/${institution.id}`)}
        >
          إلغاء
        </Button>
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              حفظ التغييرات
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
