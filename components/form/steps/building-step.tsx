"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useFormContext } from "@/lib/form-context";
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
import {
  BuildingStatus,
  BuildingCondition,
  RenovationCapacity,
  OwnerType,
  buildingStatusLabels,
  buildingConditionLabels,
  renovationCapacityLabels,
  ownerTypeLabels,
} from "@/lib/types";
import type { BuildingDTO } from "@/lib/types";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function BuildingStep() {
  const { formData, updateFormData, setCurrentStep, formVersion } = useFormContext();

  const { watch, setValue, handleSubmit, reset, register, formState: { errors }, trigger } = useForm<BuildingDTO>({
    defaultValues: formData.building || {},
  });

  // Reset form when formVersion changes (for edit mode)
  useEffect(() => {
    if (formVersion > 0) {
      reset(formData.building || {});
    }
  }, [formVersion, reset, formData.building]);

  const onSubmit = async (data: BuildingDTO) => {
    const isValid = await trigger(["buildingStatus", "buildingCondition", "ownerType"]);
    if (!isValid) return;
    updateFormData({ building: data });
    setCurrentStep("financing");
  };

  const goBack = () => {
    setCurrentStep("institution");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>معطيات حول البناية المخصصة للمؤسسة</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="buildingStatus">وضعية البناية *</Label>
            <input type="hidden" {...register("buildingStatus", { required: true })} />
            <Select
              value={watch("buildingStatus") || ""}
              onValueChange={(value) => setValue("buildingStatus", value as BuildingStatus, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر وضعية البناية" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(buildingStatusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.buildingStatus && (
              <p className="text-sm text-destructive">وضعية البناية مطلوبة</p>
            )}
            {watch("buildingStatus") === "OTHER" && (
              <Input
                placeholder="حدد وضعية البناية"
                value={watch("buildingStatusOther") || ""}
                onChange={(e) => setValue("buildingStatusOther", e.target.value)}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="buildingCondition">الحالة العامة للبناية *</Label>
            <input type="hidden" {...register("buildingCondition", { required: true })} />
            <Select
              value={watch("buildingCondition") || ""}
              onValueChange={(value) => setValue("buildingCondition", value as BuildingCondition, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر حالة البناية" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(buildingConditionLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.buildingCondition && (
              <p className="text-sm text-destructive">الحالة العامة للبناية مطلوبة</p>
            )}
            {watch("buildingCondition") === "OTHER" && (
              <Input
                placeholder="حدد حالة البناية"
                value={watch("buildingConditionOther") || ""}
                onChange={(e) => setValue("buildingConditionOther", e.target.value)}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="renovationCapacity">قابلية البناية للترميم والإصلاح</Label>
            <Select
              value={watch("renovationCapacity") || ""}
              onValueChange={(value) => setValue("renovationCapacity", value as RenovationCapacity)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر قابلية الترميم" />
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
            <Label htmlFor="ownerType">تحديد مالك الوعاء العقاري *</Label>
            <input type="hidden" {...register("ownerType", { required: true })} />
            <Select
              value={watch("ownerType") || ""}
              onValueChange={(value) => setValue("ownerType", value as OwnerType, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع المالك" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ownerTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ownerType && (
              <p className="text-sm text-destructive">تحديد مالك الوعاء العقاري مطلوب</p>
            )}
            {watch("ownerType") === "OTHER" && (
              <Input
                placeholder="حدد نوع المالك"
                value={watch("ownerTypeOther") || ""}
                onChange={(e) => setValue("ownerTypeOther", e.target.value)}
              />
            )}
          </div>

          <div className="flex items-center gap-2 sm:col-span-2">
            <Checkbox
              id="hasPartnershipAgreement"
              checked={watch("hasPartnershipAgreement") || false}
              onCheckedChange={(checked) =>
                setValue("hasPartnershipAgreement", checked as boolean)
              }
            />
            <Label htmlFor="hasPartnershipAgreement" className="cursor-pointer">
              وضع البناية رهن إشارة المؤسسة بموجب اتفاقية شراكة
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" size="lg" onClick={goBack} className="gap-2">
          <ArrowRight className="h-4 w-4" />
          السابق
        </Button>
        <Button type="submit" size="lg" className="gap-2">
          التالي
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
