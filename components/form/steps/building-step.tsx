"use client";

import { useForm } from "react-hook-form";
import { useFormContext } from "@/lib/form-context";
import { Button } from "@/components/ui/button";
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
  const { formData, updateFormData, setCurrentStep } = useFormContext();

  const { watch, setValue, handleSubmit } = useForm<BuildingDTO>({
    defaultValues: formData.building || {},
  });

  const onSubmit = (data: BuildingDTO) => {
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
          <CardTitle>معلومات البناية</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="buildingStatus">وضعية البناية</Label>
            <Select
              value={watch("buildingStatus") || ""}
              onValueChange={(value) => setValue("buildingStatus", value as BuildingStatus)}
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="buildingCondition">حالة البناية</Label>
            <Select
              value={watch("buildingCondition") || ""}
              onValueChange={(value) => setValue("buildingCondition", value as BuildingCondition)}
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="renovationCapacity">القدرة على التجديد</Label>
            <Select
              value={watch("renovationCapacity") || ""}
              onValueChange={(value) => setValue("renovationCapacity", value as RenovationCapacity)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر القدرة على التجديد" />
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
            <Label htmlFor="ownerType">نوع المالك</Label>
            <Select
              value={watch("ownerType") || ""}
              onValueChange={(value) => setValue("ownerType", value as OwnerType)}
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
              هل توجد اتفاقية شراكة؟
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
