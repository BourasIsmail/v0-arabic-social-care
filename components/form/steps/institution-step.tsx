"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useFormContext } from "@/lib/form-context";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CascadeGeoSelect } from "@/components/form/cascade-geo-select";
import {
  InstitutionType,
  Milieu,
  LegalStatus,
  Distance,
  institutionTypeLabels,
  milieuLabels,
  legalStatusLabels,
  distanceLabels,
} from "@/lib/types";
import type { InstitutionRequest } from "@/lib/types";
import { ArrowLeft } from "lucide-react";

export function InstitutionStep() {
  const { formData, updateFormData, setCurrentStep, formVersion, isEditMode } = useFormContext();
  const { user } = useAuth();
  
  // Check if user has fixed region/prefecture (USER role)
  const isUserRole = user?.role === "USER";
  const userRegionId = user?.regionId || null;
  const userPrefectureId = user?.prefectureId || null;

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<
    Partial<InstitutionRequest>
  >({
    defaultValues: formData,
  });

  // Reset form when formVersion changes (for edit mode - ensures we only reset when new data is loaded)
  useEffect(() => {
    if (formVersion > 0) {
      reset(formData);
    }
  }, [formVersion, reset, formData]);

  // Pre-fill region and prefecture for USER role (only for new institutions)
  useEffect(() => {
    console.log("[v0] InstitutionStep - user:", user);
    console.log("[v0] isUserRole:", isUserRole, "userRegionId:", userRegionId, "userPrefectureId:", userPrefectureId);
    if (isUserRole && !isEditMode) {
      if (userRegionId && !watch("regionId")) {
        console.log("[v0] Setting regionId to:", userRegionId);
        setValue("regionId", userRegionId);
      }
      if (userPrefectureId && !watch("prefectureId")) {
        console.log("[v0] Setting prefectureId to:", userPrefectureId);
        setValue("prefectureId", userPrefectureId);
      }
    }
  }, [isUserRole, isEditMode, userRegionId, userPrefectureId, setValue, watch, user]);

  const legalStatus = watch("legalStatus");

  const onSubmit = (data: Partial<InstitutionRequest>) => {
    updateFormData(data);
    setCurrentStep("building");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>المعلومات الأساسية</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="institutionType">نوع المؤسسة *</Label>
            <Select
              value={watch("institutionType") || ""}
              onValueChange={(value) => setValue("institutionType", value as InstitutionType)}
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
            {errors.institutionType && (
              <p className="text-sm text-destructive">نوع المؤسسة مطلوب</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="associationName">اسم الجمعية *</Label>
            <Input
              id="associationName"
              {...register("associationName", { required: true })}
              placeholder="أدخل اسم الجمعية"
            />
            {errors.associationName && (
              <p className="text-sm text-destructive">اسم الجمعية مطلوب</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="institutionName">اسم المؤسسة *</Label>
            <Input
              id="institutionName"
              {...register("institutionName", { required: true })}
              placeholder="أدخل اسم المؤسسة"
            />
            {errors.institutionName && (
              <p className="text-sm text-destructive">اسم المؤسسة مطلوب</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="creationYear">سنة التأسيس</Label>
            <Input
              id="creationYear"
              type="number"
              {...register("creationYear", { valueAsNumber: true, min: 1900, max: 2100 })}
              placeholder="مثال: 2010"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>الموقع الجغرافي</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">العنوان</Label>
            <Input
              id="address"
              {...register("address")}
              placeholder="أدخل العنوان الكامل"
            />
          </div>

          <CascadeGeoSelect
            regionId={watch("regionId") || ""}
            prefectureId={watch("prefectureId") || ""}
            communeId={watch("communeId") || ""}
            onRegionChange={(value) => setValue("regionId", value)}
            onPrefectureChange={(value) => setValue("prefectureId", value)}
            onCommuneChange={(value) => setValue("communeId", value)}
            disabled={isUserRole && !isEditMode}
          />

          <div className="space-y-2">
            <Label htmlFor="milieu">الوسط</Label>
            <Select
              value={watch("milieu") || ""}
              onValueChange={(value) => setValue("milieu", value as Milieu)}
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>الوضعية القانونية</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="legalStatus">الوضعية القانونية</Label>
            <Select
              value={watch("legalStatus") || ""}
              onValueChange={(value) => setValue("legalStatus", value as LegalStatus)}
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
              <Label htmlFor="licenseNumber">رقم الترخيص</Label>
              <Input
                id="licenseNumber"
                {...register("licenseNumber")}
                placeholder="أدخل رقم الترخيص"
              />
            </div>
          )}

          {legalStatus === LegalStatus.UNLICENSED && (
            <div className="space-y-2">
              <Label htmlFor="unlicensedReason">سبب عدم الترخيص</Label>
              <Input
                id="unlicensedReason"
                {...register("unlicensedReason")}
                placeholder="أدخل السبب"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="serviceStartDate">تاريخ بدء الخدمة</Label>
            <Input
              id="serviceStartDate"
              type="date"
              {...register("serviceStartDate")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>الخدمات المقدمة</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { key: "housing", label: "الإيواء" },
            { key: "meals", label: "الإطعام" },
            { key: "educationalSupport", label: "الدعم التربوي" },
            { key: "culturalActivities", label: "الأنشطة الثقافية" },
            { key: "healthCare", label: "الرعاية الصحية" },
            { key: "insurance", label: "التأمين" },
            { key: "psychologicalSupport", label: "الدعم النفسي" },
          ].map((service) => (
            <div key={service.key} className="flex items-center gap-2">
              <Checkbox
                id={service.key}
                checked={(watch(service.key as keyof InstitutionRequest) as boolean) || false}
                onCheckedChange={(checked) =>
                  setValue(service.key as keyof InstitutionRequest, !!checked)
                }
              />
              <Label htmlFor={service.key} className="cursor-pointer">
                {service.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>الطاقة الاستيعابية</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="totalCapacity">الطاقة الإجمالية</Label>
            <Input
              id="totalCapacity"
              type="number"
              {...register("totalCapacity", { valueAsNumber: true, min: 0 })}
              placeholder="العدد الإجمالي"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maleCapacity">طاقة الذكور</Label>
            <Input
              id="maleCapacity"
              type="number"
              {...register("maleCapacity", { valueAsNumber: true, min: 0 })}
              placeholder="عدد الذكور"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="femaleCapacity">طاقة الإناث</Label>
            <Input
              id="femaleCapacity"
              type="number"
              {...register("femaleCapacity", { valueAsNumber: true, min: 0 })}
              placeholder="عدد الإناث"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>المستويات الدراسية المستهدفة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { key: "primary", label: "الابتدائي" },
              { key: "middleSchool", label: "الإعدادي" },
              { key: "highSchool", label: "الثانوي" },
              { key: "other", label: "أخرى" },
            ].map((level) => (
              <div key={level.key} className="flex items-center gap-2">
                <Checkbox
                  id={level.key}
                  checked={(watch(level.key as keyof InstitutionRequest) as boolean) || false}
                  onCheckedChange={(checked) =>
                    setValue(level.key as keyof InstitutionRequest, !!checked)
                  }
                />
                <Label htmlFor={level.key} className="cursor-pointer">
                  {level.label}
                </Label>
              </div>
            ))}
          </div>

          {watch("other") && (
            <div className="space-y-2">
              <Label htmlFor="otherDetail">تحديد المستوى الآخر</Label>
              <Input
                id="otherDetail"
                {...register("otherDetail")}
                placeholder="أدخل التفاصيل"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>المسافة</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="distanceToSchool">المسافة إلى أقرب مدرسة</Label>
            <Select
              value={watch("distanceToSchool") || ""}
              onValueChange={(value) => setValue("distanceToSchool", value as Distance)}
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
            <Label htmlFor="distanceToNationalBoardingSchool">
              المسافة إلى أقرب داخلية وطنية
            </Label>
            <Select
              value={watch("distanceToNationalBoardingSchool") || ""}
              onValueChange={(value) =>
                setValue("distanceToNationalBoardingSchool", value as Distance)
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
        </CardContent>
      </Card>

      <div className="flex justify-start">
        <Button type="submit" size="lg" className="gap-2">
          التالي
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
