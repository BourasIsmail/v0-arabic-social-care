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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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
  FinancingDTO,
  TargetingDTO,
  HousingMealsDTO,
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
  
  const [staffMembers, setStaffMembers] = useState<StaffMemberDTO[]>(
    institution.staffMembers || []
  );
  const [newStaff, setNewStaff] = useState<Partial<StaffMemberDTO>>({});
  
  // Debug log to see what staffMembers data is being loaded
  console.log("[v0] institution.staffMembers:", institution.staffMembers);

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
      latitude: institution.latitude,
      longitude: institution.longitude,
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
      otherDetail: institution.otherDetail || "",
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
  const selectionBody = watch("targeting.selectionBody");
  const tariffDeterminationBody = watch("targeting.tariffDeterminationBody");
  const servicesAreFree = watch("targeting.servicesAreFree");
  const tariffType = watch("targeting.tariffType");

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

  // Financing sources
  const constructionSources = [
    { key: "solidarityMinistry", label: "وزارة التضامن والإدماج الاجتماعي والأسرة" },
    { key: "nationalEntraide", label: "التعاون الوطني" },
    { key: "indh", label: "المبادرة الوطنية للتنمية البشرية" },
    { key: "commune", label: "الجماعة" },
    { key: "fondationMohammed5", label: "مؤسسة محمد الخامس للتضامن" },
    { key: "nationalRevival", label: "الإنعاش الوطني" },
    { key: "association", label: "الجمعية/مؤسسة" },
    { key: "otherConstruction", label: "آخر (للتحديد)" },
  ];

  const equipmentSources = [
    { key: "equipmentSolidarityMinistry", label: "وزارة التضامن والإدماج الاجتماعي والأسرة" },
    { key: "equipmentNationalEntraide", label: "التعاون الوطني" },
    { key: "equipmentIndh", label: "المبادرة الوطنية للتنمية البشرية" },
    { key: "equipmentCommune", label: "الجماعة" },
    { key: "equipmentFondationMohammed5", label: "مؤسسة محمد الخامس للتضامن" },
    { key: "equipmentAssociation", label: "الجمعية/مؤسسة" },
    { key: "equipmentOther", label: "آخر (للتحديد)" },
  ];

  const operatingSources = [
    { key: "operatingIndh", label: "المبادرة الوطنية للتنمية البشرية" },
    { key: "operatingNationalEntraide", label: "التعاون الوطني" },
    { key: "operatingNationalEducation", label: "قطاع التربية الوطنية" },
    { key: "operatingCommune", label: "الجماعة" },
    { key: "operatingParentContributions", label: "اشتراكات الآباء" },
    { key: "operatingDonors", label: "المحسنون (هبات وغيرها)" },
    { key: "operatingAssociationOwnSources", label: "مصادر ذاتية للجمعية المسيرة" },
    { key: "operatingOther", label: "آخر (للتحديد)" },
  ];

  // Targeting
  const selectionCriteria = [
    { key: "socialSituation", label: "الوضعية الاجتماعية للأسرة" },
    { key: "distance", label: "المسافة بين المدرسة ومحل سكن المستفيد" },
    { key: "schoolResults", label: "النتائج المدرسية للمستفيد" },
    { key: "scholarship", label: "الاستفادة من المنحة الدراسية" },
    { key: "otherCriteria", label: "آخر (للتحديد)" },
  ];

  const committeeMembers = [
    { key: "committeeAssociation", label: "الجمعية" },
    { key: "committeeNationalEntraide", label: "التعاون الوطني" },
    { key: "committeeNationalEducation", label: "التربية الوطنية" },
    { key: "committeeCommune", label: "الجماعة" },
    { key: "committeeLocalAuthorities", label: "السلطات المحلية" },
    { key: "otherMember", label: "آخر (للتحديد)" },
  ];

  const tariffCommitteeMembers = [
    { key: "tariffCommitteeAssociation", label: "الجمعية" },
    { key: "tariffCommitteeNationalEntraide", label: "التعاون الوطني" },
    { key: "tariffCommitteeNationalEducation", label: "قطاع التربية الوطنية" },
    { key: "tariffCommitteeCommune", label: "الجماعة" },
    { key: "tariffCommitteeLocalAuthorities", label: "السلطات المحلية" },
    { key: "tariffOtherMember", label: "آخر (للتحديد)" },
  ];

  const improvementSuggestions = [
    { key: "increaseProducts", label: "زيادة المواد الغذائية وتجويدها" },
    { key: "externalCaterer", label: "اللجوء إلى ممون خارجي لتقديم وجبات جاهزة" },
    { key: "otherSuggestion", label: "آخر (للتحديد)" },
  ];

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
                {...register("serviceStartDate")}
              />
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

          {targetOther && (
            <div className="space-y-2">
              <Label>تحديد السلك الآخر</Label>
              <Input {...register("otherDetail")} placeholder="أدخل السلك" />
            </div>
          )}

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

      {/* Section 6: Financing - Construction */}
      <Card>
        <CardHeader>
          <CardTitle>تمويل بناء المؤسسة</CardTitle>
          <CardDescription>حدد مصادر تمويل بناء المؤسسة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {constructionSources.map((source) => (
              <div key={source.key} className="flex items-center gap-2">
                <Checkbox
                  id={`financing.${source.key}`}
                  checked={(watch(`financing.${source.key}` as keyof InstitutionRequest) as boolean) || false}
                  onCheckedChange={(checked) =>
                    setValue(`financing.${source.key}` as keyof InstitutionRequest, checked as boolean)
                  }
                />
                <Label htmlFor={`financing.${source.key}`} className="cursor-pointer text-sm">
                  {source.label}
                </Label>
              </div>
            ))}
          </div>

          {watch("financing.otherConstruction") && (
            <div className="space-y-2">
              <Label>تحديد المصدر الآخر</Label>
              <Input {...register("financing.otherConstructionDetail")} placeholder="أدخل المصدر" />
            </div>
          )}

          <div className="space-y-2">
            <Label>التكلفة الإجمالية للبناء (درهم)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("financing.totalConstructionCost", { valueAsNumber: true })}
              placeholder="0.00"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 6b: Financing - Equipment */}
      <Card>
        <CardHeader>
          <CardTitle>تمويل تجهيز المؤسسة</CardTitle>
          <CardDescription>حدد مصادر تمويل تجهيز المؤسسة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {equipmentSources.map((source) => (
              <div key={source.key} className="flex items-center gap-2">
                <Checkbox
                  id={`financing.${source.key}`}
                  checked={(watch(`financing.${source.key}` as keyof InstitutionRequest) as boolean) || false}
                  onCheckedChange={(checked) =>
                    setValue(`financing.${source.key}` as keyof InstitutionRequest, checked as boolean)
                  }
                />
                <Label htmlFor={`financing.${source.key}`} className="cursor-pointer text-sm">
                  {source.label}
                </Label>
              </div>
            ))}
          </div>

          {watch("financing.equipmentOther") && (
            <div className="space-y-2">
              <Label>تحديد المصدر الآخر</Label>
              <Input {...register("financing.equipmentOtherDetail")} placeholder="أدخل المصدر" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 6c: Financing - Operating */}
      <Card>
        <CardHeader>
          <CardTitle>مصادر تمويل تسيير المؤسسة</CardTitle>
          <CardDescription>حدد مصادر تمويل تسيير المؤسسة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {operatingSources.map((source) => (
              <div key={source.key} className="flex items-center gap-2">
                <Checkbox
                  id={`financing.${source.key}`}
                  checked={(watch(`financing.${source.key}` as keyof InstitutionRequest) as boolean) || false}
                  onCheckedChange={(checked) =>
                    setValue(`financing.${source.key}` as keyof InstitutionRequest, checked as boolean)
                  }
                />
                <Label htmlFor={`financing.${source.key}`} className="cursor-pointer text-sm">
                  {source.label}
                </Label>
              </div>
            ))}
          </div>

          {watch("financing.operatingOther") && (
            <div className="space-y-2">
              <Label>تحديد المصدر الآخر</Label>
              <Input {...register("financing.operatingOtherDetail")} placeholder="أدخل المصدر" />
            </div>
          )}

          <div className="space-y-2">
            <Label>التكلفة السنوية للتسيير (درهم)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("financing.annualManagementCost", { valueAsNumber: true })}
              placeholder="0.00"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 6d: Financing - Costs */}
      <Card>
        <CardHeader>
          <CardTitle>التكاليف السنوية</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>الكلفة السنوية المخصصة للموارد البشرية (درهم)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("financing.annualHRCost", { valueAsNumber: true })}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label>الكلفة السنوية المخصصة للإطعام (درهم)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("financing.annualMealsCost", { valueAsNumber: true })}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label>الكلفة السنوية المخصصة لباقي النفقات (درهم)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("financing.annualOtherExpenses", { valueAsNumber: true })}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label>الكلفة السنوية للتكفل بكل مستفيد (درهم)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("financing.individualAnnualCost", { valueAsNumber: true })}
              placeholder="0.00"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 6e: Financing - Meal Contribution */}
      <Card>
        <CardHeader>
          <CardTitle>نسب المساهمة في تمويل الإطعام (%)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>نسبة مساهمة الجمعية المسيرة</Label>
            <Input
              type="number"
              step="0.01"
              max="100"
              {...register("financing.associationShare", { valueAsNumber: true })}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>نسبة مساهمة قطاع التربية الوطنية</Label>
            <Input
              type="number"
              step="0.01"
              max="100"
              {...register("financing.educationShare", { valueAsNumber: true })}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>نسبة مساهمة أخرى (للتحديد)</Label>
            <Input
              type="number"
              step="0.01"
              max="100"
              {...register("financing.otherShare", { valueAsNumber: true })}
              placeholder="0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 7: Targeting */}
      <Card>
        <CardHeader>
          <CardTitle>المعايير المعتمدة في الاستهداف</CardTitle>
          <CardDescription>حدد المعايير المستخدمة لاختيار المستفيدين</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {selectionCriteria.map((criteria) => (
              <div key={criteria.key} className="flex items-center gap-2">
                <Checkbox
                  id={`targeting.${criteria.key}`}
                  checked={(watch(`targeting.${criteria.key}` as keyof InstitutionRequest) as boolean) || false}
                  onCheckedChange={(checked) =>
                    setValue(`targeting.${criteria.key}` as keyof InstitutionRequest, checked as boolean)
                  }
                />
                <Label htmlFor={`targeting.${criteria.key}`} className="cursor-pointer">
                  {criteria.label}
                </Label>
              </div>
            ))}
          </div>

          {watch("targeting.otherCriteria") && (
            <div className="space-y-2">
              <Label>تحديد المعيار الآخر</Label>
              <Input {...register("targeting.otherCriteriaDetail")} placeholder="أدخل المعيار" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 7b: Targeting - Priority Ranking */}
      <Card>
        <CardHeader>
          <CardTitle>تصنيف المعايير المعتمدة حسب الأولوية في الاستهداف</CardTitle>
          <CardDescription>رتب الأولويات من 1 إلى 5</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="space-y-2">
              <Label>الأولوية {num}</Label>
              <Select
                value={(watch(`targeting.priority${num}` as keyof InstitutionRequest) as string) || ""}
                onValueChange={(value) => setValue(`targeting.priority${num}` as keyof InstitutionRequest, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`اختر الأولوية ${num}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="socialSituation">الوضعية الاجتماعية للأسرة</SelectItem>
                  <SelectItem value="distance">المسافة بين المدرسة ومحل سكن المستفيد</SelectItem>
                  <SelectItem value="schoolResults">النتائج المدرسية للمستفيد</SelectItem>
                  <SelectItem value="scholarship">الاستفادة من المنحة الدراسية</SelectItem>
                  <SelectItem value="other">آخر</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Section 7c: Targeting - Selection Body */}
      <Card>
        <CardHeader>
          <CardTitle>الجهة التي تقوم بعملية انتقاء المستفيدين</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>الجهة التي تقوم بعملية انتقاء المستفيدين</Label>
            <Select
              value={selectionBody || ""}
              onValueChange={(value) => setValue("targeting.selectionBody", value as SelectionBody)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر جهة الانتقاء" />
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

          {selectionBody === SelectionBody.MIXED_COMMITTEE && (
            <div className="space-y-4">
              <Label>تضم اللجنة المختلطة</Label>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {committeeMembers.map((member) => (
                  <div key={member.key} className="flex items-center gap-2">
                    <Checkbox
                      id={`targeting.${member.key}`}
                      checked={(watch(`targeting.${member.key}` as keyof InstitutionRequest) as boolean) || false}
                      onCheckedChange={(checked) =>
                        setValue(`targeting.${member.key}` as keyof InstitutionRequest, checked as boolean)
                      }
                    />
                    <Label htmlFor={`targeting.${member.key}`} className="cursor-pointer">
                      {member.label}
                    </Label>
                  </div>
                ))}
              </div>

              {watch("targeting.otherMember") && (
                <div className="space-y-2">
                  <Label>تحديد العضو الآخر</Label>
                  <Input {...register("targeting.otherMemberDetail")} placeholder="أدخل اسم العضو" />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 7d: Targeting - Services & Tariff */}
      <Card>
        <CardHeader>
          <CardTitle>خدمات المؤسسة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="targeting.servicesAreFree"
              checked={servicesAreFree || false}
              onCheckedChange={(checked) => setValue("targeting.servicesAreFree", checked as boolean)}
            />
            <Label htmlFor="targeting.servicesAreFree" className="cursor-pointer">
              مجانية
            </Label>
          </div>

          {!servicesAreFree && (
            <>
              <div className="space-y-2">
                <Label>مبلغ الاشتراك الشهري لكل مستفيد (بالدرهم)</Label>
                <Select
                  value={tariffType || ""}
                  onValueChange={(value) => setValue("targeting.tariffType", value as TariffType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع التعريفة" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(tariffTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {tariffType === TariffType.UNIFORM && (
                <div className="space-y-2">
                  <Label>قيمتها (درهم)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("targeting.uniformAmount", { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                </div>
              )}

              {tariffType === TariffType.NON_UNIFORM && (
                <div className="space-y-2">
                  <Label>قيمتها</Label>
                  <Select
                    value={watch("targeting.tariffBracket") || ""}
                    onValueChange={(value) => setValue("targeting.tariffBracket", value as TariffBracket)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الشريحة" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(tariffBracketLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Tariff Determination Body */}
              <div className="space-y-4 pt-4 border-t">
                <Label>من يحدد مبلغ الاشتراك الشهري لكل مستفيد</Label>
                <Select
                  value={tariffDeterminationBody || ""}
                  onValueChange={(value) => setValue("targeting.tariffDeterminationBody", value as SelectionBody)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الجهة" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(selectionBodyLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {tariffDeterminationBody === SelectionBody.MIXED_COMMITTEE && (
                  <div className="space-y-4">
                    <Label>تضم اللجنة المختلطة</Label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {tariffCommitteeMembers.map((member) => (
                        <div key={member.key} className="flex items-center gap-2">
                          <Checkbox
                            id={`targeting.${member.key}`}
                            checked={(watch(`targeting.${member.key}` as keyof InstitutionRequest) as boolean) || false}
                            onCheckedChange={(checked) =>
                              setValue(`targeting.${member.key}` as keyof InstitutionRequest, !!checked)
                            }
                          />
                          <Label htmlFor={`targeting.${member.key}`} className="cursor-pointer">
                            {member.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {watch("targeting.tariffOtherMember") && (
                      <Input
                        {...register("targeting.tariffOtherMemberDetail")}
                        placeholder="حدد العضو الآخر..."
                      />
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Section 7e: Targeting - Unsatisfied Requests */}
      <Card>
        <CardHeader>
          <CardTitle>الطلبات غير الملباة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>عدد الطلبات التي لم تتم الاستجابة لها برسم الموسم الدراسي الحالي</Label>
            <Input
              type="number"
              {...register("targeting.unsatisfiedRequestsCount", { valueAsNumber: true })}
              placeholder="0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 8: Housing & Meals - Seasons */}
      <Card>
        <CardHeader>
          <CardTitle>عدد المستفيدين من خدمتي الإيواء والإطعام بالمؤسسة</CardTitle>
          <CardDescription>بالنسبة لخدمة الإيواء - أدخل بيانات المستفيدين لكل موسم دراسي</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {(["season2324", "season2425", "season2526"] as const).map((seasonKey) => {
            const seasonLabel = seasonKey === "season2324" ? "الموسم 2023-2024" : seasonKey === "season2425" ? "الموسم 2024-2025" : "الموسم 2025-2026";
            return (
              <div key={seasonKey} className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">{seasonLabel}</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    <Label>ذوي الاحتياجات الخاصة</Label>
                    <Input
                      type="number"
                      {...register(`housingMeals.${seasonKey}.disabled` as keyof InstitutionRequest, { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>مستفيدون ابتدائي</Label>
                    <Input
                      type="number"
                      {...register(`housingMeals.${seasonKey}.primaryBeneficiaries` as keyof InstitutionRequest, { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>مستفيدون إعدادي</Label>
                    <Input
                      type="number"
                      {...register(`housingMeals.${seasonKey}.middleSchoolBeneficiaries` as keyof InstitutionRequest, { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>مستفيدون ثانوي</Label>
                    <Input
                      type="number"
                      {...register(`housingMeals.${seasonKey}.highSchoolBeneficiaries` as keyof InstitutionRequest, { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>آخر (تكوين مهني...)</Label>
                    <Input
                      type="number"
                      {...register(`housingMeals.${seasonKey}.orphans` as keyof InstitutionRequest, { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Section 8b: Housing - Remarks */}
      <Card>
        <CardHeader>
          <CardTitle>توضيحات حول استقبال المؤسسة</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>المرجو إعطاء توضيحات مركزة حول استقبال المؤسسة لعدد أقل أو أكثر من طاقتها الاستيعابية المرخصة</Label>
          <Textarea
            {...register("housingMeals.capacityRemarks")}
            placeholder="أدخل توضيحاتك هنا..."
            rows={4}
            className="mt-2"
          />
        </CardContent>
      </Card>

      {/* Section 8c: Housing - Meal Service 2025-2026 */}
      <Card>
        <CardHeader>
          <CardTitle>بالنسبة لخدمة الإطعام خلال الموسم الدراسي 2025-2026</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>العدد الإجمالي للمستفيدين فعليا من هذه الخدمة</Label>
            <Input
              type="number"
              {...register("housingMeals.totalMealBeneficiaries2526", { valueAsNumber: true })}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>العدد الإجمالي للمستفيدين فعليا من خدمة الإطعام الممول من طرف الجمعية</Label>
            <Input
              type="number"
              {...register("housingMeals.associationMealBeneficiaries", { valueAsNumber: true })}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>العدد الإجمالي للمستفيدين فعليا من خدمة الإطعام التي يؤمنها قطاع التربية الوطنية</Label>
            <Input
              type="number"
              {...register("housingMeals.educationMealBeneficiaries", { valueAsNumber: true })}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>عدد المستفيدين من منحة كاملة</Label>
            <Input
              type="number"
              {...register("housingMeals.fullGrantCount", { valueAsNumber: true })}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>عدد المستفيدين من نصف منحة (وجبة غذاء)</Label>
            <Input
              type="number"
              {...register("housingMeals.halfGrantCount", { valueAsNumber: true })}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>نوعية خدمة الإطعام المقدمة</Label>
            <Select
              value={watch("housingMeals.mealServiceType") || ""}
              onValueChange={(v) => setValue("housingMeals.mealServiceType", v as MealServiceType)}
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
        </CardContent>
      </Card>

      {/* Section 8d: Housing - Improvement Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>ما هي مقترحاتكم من أجل تحسين جودة الإطعام بالمؤسسة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {improvementSuggestions.map((suggestion) => (
              <div key={suggestion.key} className="flex items-center gap-2">
                <Checkbox
                  id={`housingMeals.${suggestion.key}`}
                  checked={(watch(`housingMeals.${suggestion.key}` as keyof InstitutionRequest) as boolean) || false}
                  onCheckedChange={(checked) =>
                    setValue(`housingMeals.${suggestion.key}` as keyof InstitutionRequest, checked as boolean)
                  }
                />
                <Label htmlFor={`housingMeals.${suggestion.key}`} className="cursor-pointer">
                  {suggestion.label}
                </Label>
              </div>
            ))}
          </div>

          {watch("housingMeals.otherSuggestion") && (
            <div className="space-y-2">
              <Label>تحديد المقترح الآخر</Label>
              <Input {...register("housingMeals.otherSuggestionDetail")} placeholder="أدخل المقترح" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 9: Staff */}
      <Card>
        <CardHeader>
          <CardTitle>معطيات حول الموارد البشرية العاملة بالمؤسسة</CardTitle>
          <CardDescription>أدخل بيانات المستخدم ثم اضغط على زر الإضافة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add new staff form */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <Label>نوع التأطير *</Label>
              <Select
                value={newStaff.staffType || ""}
                onValueChange={(v) =>
                  setNewStaff({ ...newStaff, staffType: v as StaffType })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع التأطير" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(staffTypeLabels)
                    .filter(([value]) => !staffMembers.some(m => m.staffType === value))
                    .map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>عدد المستخدمين بالجمعية</Label>
              <Input
                type="number"
                min="0"
                value={newStaff.nbAssociation || ""}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, nbAssociation: Math.max(0, parseInt(e.target.value) || 0) })
                }
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label>عدد الأطر الموضوعة رهن الإشارة</Label>
              <Input
                type="number"
                min="0"
                value={newStaff.nbDeployed || ""}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, nbDeployed: Math.max(0, parseInt(e.target.value) || 0) })
                }
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label>عدد الأطر المتطوعة</Label>
              <Input
                type="number"
                min="0"
                value={newStaff.nbVolunteers || ""}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, nbVolunteers: Math.max(0, parseInt(e.target.value) || 0) })
                }
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label>المستفيدين من CNSS</Label>
              <Input
                type="number"
                min="0"
                value={newStaff.nbCNSS || ""}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, nbCNSS: Math.max(0, parseInt(e.target.value) || 0) })
                }
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label>المستفيدين من SMIG</Label>
              <Input
                type="number"
                min="0"
                value={newStaff.nbSMIG || ""}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, nbSMIG: Math.max(0, parseInt(e.target.value) || 0) })
                }
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label>الكلفة الشهرية (درهم)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={newStaff.monthlyCost || ""}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, monthlyCost: Math.max(0, parseFloat(e.target.value) || 0) })
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>الكلفة السنوية (درهم)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={newStaff.annualCost || ""}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, annualCost: Math.max(0, parseFloat(e.target.value) || 0) })
                }
                placeholder="0.00"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={addStaffMember}
                disabled={!newStaff.staffType}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                اضافة مستخدم
              </Button>
            </div>
          </div>

          {/* Existing staff list */}
          {staffMembers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-2">نوع التأطير</th>
                    <th className="text-right p-2">بالجمعية</th>
                    <th className="text-right p-2">رهن الإشارة</th>
                    <th className="text-right p-2">المتطوعون</th>
                    <th className="text-right p-2">CNSS</th>
                    <th className="text-right p-2">SMIG</th>
                    <th className="text-right p-2">الكلفة الشهرية</th>
                    <th className="text-right p-2">الكلفة السنوية</th>
                    <th className="text-right p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {staffMembers.map((staff, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{staffTypeLabels[staff.staffType]}</td>
                      <td className="p-2">{staff.nbAssociation || 0}</td>
                      <td className="p-2">{staff.nbDeployed || 0}</td>
                      <td className="p-2">{staff.nbVolunteers || 0}</td>
                      <td className="p-2">{staff.nbCNSS || 0}</td>
                      <td className="p-2">{staff.nbSMIG || 0}</td>
                      <td className="p-2">{staff.monthlyCost?.toLocaleString() || 0} درهم</td>
                      <td className="p-2">{staff.annualCost?.toLocaleString() || 0} درهم</td>
                      <td className="p-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStaffMember(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              لا يوجد مستخدمون مضافون. استخدم النموذج أعلاه لإضافة مستخدمين.
            </div>
          )}
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
