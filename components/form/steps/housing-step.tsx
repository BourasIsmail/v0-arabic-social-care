"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useFormContext } from "@/lib/form-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MealServiceType, mealServiceTypeLabels } from "@/lib/types";
import type { HousingMealsDTO, SeasonBeneficiaries } from "@/lib/types";
import { ArrowLeft, ArrowRight } from "lucide-react";

function SeasonFields({
  seasonKey,
  seasonLabel,
  register,
  watch,
}: {
  seasonKey: "season2324" | "season2425" | "season2526";
  seasonLabel: string;
  register: ReturnType<typeof useForm<HousingMealsDTO>>["register"];
  watch: ReturnType<typeof useForm<HousingMealsDTO>>["watch"];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{seasonLabel}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor={`${seasonKey}.totalBeneficiaries`}>العدد الإجمالي</Label>
          <Input
            id={`${seasonKey}.totalBeneficiaries`}
            type="number"
            {...register(`${seasonKey}.totalBeneficiaries`, { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${seasonKey}.maleBeneficiaries`}>الذكور</Label>
          <Input
            id={`${seasonKey}.maleBeneficiaries`}
            type="number"
            {...register(`${seasonKey}.maleBeneficiaries`, { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${seasonKey}.femaleBeneficiaries`}>الإناث</Label>
          <Input
            id={`${seasonKey}.femaleBeneficiaries`}
            type="number"
            {...register(`${seasonKey}.femaleBeneficiaries`, { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${seasonKey}.primaryBeneficiaries`}>الابتدائي</Label>
          <Input
            id={`${seasonKey}.primaryBeneficiaries`}
            type="number"
            {...register(`${seasonKey}.primaryBeneficiaries`, { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${seasonKey}.middleSchoolBeneficiaries`}>الإعدادي</Label>
          <Input
            id={`${seasonKey}.middleSchoolBeneficiaries`}
            type="number"
            {...register(`${seasonKey}.middleSchoolBeneficiaries`, { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${seasonKey}.highSchoolBeneficiaries`}>الثانوي</Label>
          <Input
            id={`${seasonKey}.highSchoolBeneficiaries`}
            type="number"
            {...register(`${seasonKey}.highSchoolBeneficiaries`, { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${seasonKey}.orphans`}>اليتامى</Label>
          <Input
            id={`${seasonKey}.orphans`}
            type="number"
            {...register(`${seasonKey}.orphans`, { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${seasonKey}.disabled`}>ذوي الاحتياجات الخاصة</Label>
          <Input
            id={`${seasonKey}.disabled`}
            type="number"
            {...register(`${seasonKey}.disabled`, { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function HousingStep() {
  const { formData, updateFormData, setCurrentStep } = useFormContext();

  const { register, watch, setValue, handleSubmit, reset } = useForm<HousingMealsDTO>({
    defaultValues: formData.housingMeals || {
      season2324: {},
      season2425: {},
      season2526: {},
    },
  });

  // Reset form when formData changes (for edit mode)
  useEffect(() => {
    reset(formData.housingMeals || {
      season2324: {},
      season2425: {},
      season2526: {},
    });
  }, [formData.housingMeals, reset]);

  const onSubmit = (data: HousingMealsDTO) => {
    updateFormData({ housingMeals: data });
    setCurrentStep("staff");
  };

  const goBack = () => {
    setCurrentStep("targeting");
  };

  const improvementSuggestions = [
    { key: "increaseProducts", label: "زيادة المنتجات الغذائية" },
    { key: "externalCaterer", label: "الاستعانة بمتعهد خارجي" },
    { key: "otherSuggestion", label: "أخرى" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>المستفيدون حسب الموسم الدراسي</CardTitle>
          <CardDescription>أدخل بيانات المستفيدين لكل موسم دراسي</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SeasonFields
            seasonKey="season2324"
            seasonLabel="الموسم 2023-2024"
            register={register}
            watch={watch}
          />
          <SeasonFields
            seasonKey="season2425"
            seasonLabel="الموسم 2024-2025"
            register={register}
            watch={watch}
          />
          <SeasonFields
            seasonKey="season2526"
            seasonLabel="الموسم 2025-2026"
            register={register}
            watch={watch}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ملاحظات حول الطاقة الاستيعابية</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            {...register("capacityRemarks")}
            placeholder="أدخل ملاحظاتك هنا..."
            rows={4}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>الإطعام</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="totalMealBeneficiaries2526">
              إجمالي المستفيدين من الإطعام 2025-2026
            </Label>
            <Input
              id="totalMealBeneficiaries2526"
              type="number"
              {...register("totalMealBeneficiaries2526", { valueAsNumber: true })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="associationMealBeneficiaries">مستفيدون من الجمعية</Label>
            <Input
              id="associationMealBeneficiaries"
              type="number"
              {...register("associationMealBeneficiaries", { valueAsNumber: true })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="educationMealBeneficiaries">مستفيدون من التربية الوطنية</Label>
            <Input
              id="educationMealBeneficiaries"
              type="number"
              {...register("educationMealBeneficiaries", { valueAsNumber: true })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullGrantCount">عدد المنح الكاملة</Label>
            <Input
              id="fullGrantCount"
              type="number"
              {...register("fullGrantCount", { valueAsNumber: true })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="halfGrantCount">عدد نصف المنح</Label>
            <Input
              id="halfGrantCount"
              type="number"
              {...register("halfGrantCount", { valueAsNumber: true })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mealServiceType">نوع خدمة الإطعام</Label>
            <Select
              value={watch("mealServiceType") || ""}
              onValueChange={(value) => setValue("mealServiceType", value as MealServiceType)}
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>مقترحات التحسين</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {improvementSuggestions.map((suggestion) => (
              <div key={suggestion.key} className="flex items-center gap-2">
                <Checkbox
                  id={suggestion.key}
                  checked={(watch(suggestion.key as keyof HousingMealsDTO) as boolean) || false}
                  onCheckedChange={(checked) =>
                    setValue(suggestion.key as keyof HousingMealsDTO, checked as boolean)
                  }
                />
                <Label htmlFor={suggestion.key} className="cursor-pointer">
                  {suggestion.label}
                </Label>
              </div>
            ))}
          </div>

          {watch("otherSuggestion") && (
            <div className="space-y-2">
              <Label htmlFor="otherSuggestionDetail">تحديد المقترح الآخر</Label>
              <Input
                id="otherSuggestionDetail"
                {...register("otherSuggestionDetail")}
                placeholder="أدخل المقترح"
              />
            </div>
          )}
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
