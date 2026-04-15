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
  setValue,
  errors,
  isRequired = false,
}: {
  seasonKey: "season2324" | "season2425" | "season2526";
  seasonLabel: string;
  register: ReturnType<typeof useForm<HousingMealsDTO>>["register"];
  watch: ReturnType<typeof useForm<HousingMealsDTO>>["watch"];
  setValue: ReturnType<typeof useForm<HousingMealsDTO>>["setValue"];
  errors: Record<string, string>;
  isRequired?: boolean;
}) {
  const updateTotal = (males: number, females: number) => {
    setValue(`${seasonKey}.totalBeneficiaries`, males + females);
  };

  const totalBeneficiaries = watch(`${seasonKey}.totalBeneficiaries`) || 0;
  const primaryBeneficiaries = watch(`${seasonKey}.primaryBeneficiaries`) || 0;
  const middleSchoolBeneficiaries = watch(`${seasonKey}.middleSchoolBeneficiaries`) || 0;
  const highSchoolBeneficiaries = watch(`${seasonKey}.highSchoolBeneficiaries`) || 0;
  const orphans = watch(`${seasonKey}.orphans`) || 0;
  
  const schoolLevelTotal = primaryBeneficiaries + middleSchoolBeneficiaries + highSchoolBeneficiaries + orphans;
  const schoolLevelExceedsTotal = schoolLevelTotal > totalBeneficiaries && totalBeneficiaries > 0;
  const schoolLevelNotEqual = schoolLevelTotal !== totalBeneficiaries && totalBeneficiaries > 0 && schoolLevelTotal > 0;

  return (
    <Card className={schoolLevelExceedsTotal ? "border-destructive" : schoolLevelNotEqual ? "border-amber-500" : ""}>
      <CardHeader>
        <CardTitle className="text-base">{seasonLabel}{isRequired && " *"}</CardTitle>
        {schoolLevelExceedsTotal && (
          <p className="text-sm text-destructive">
            خطأ: مجموع التوزيع حسب السلك الدراسي ({schoolLevelTotal}) يتجاوز العدد الإجمالي للمستفيدين ({totalBeneficiaries})
          </p>
        )}
        {!schoolLevelExceedsTotal && schoolLevelNotEqual && (
          <p className="text-sm text-amber-600">
            تنبيه: مجموع التوزيع حسب السلك الدراسي ({schoolLevelTotal}) لا يساوي العدد الإجمالي للمستفيدين ({totalBeneficiaries})
          </p>
        )}
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor={`${seasonKey}.totalBeneficiaries`}>العدد الإجمالي للمستفيدين فعليا</Label>
          <Input
            id={`${seasonKey}.totalBeneficiaries`}
            type="number"
            value={watch(`${seasonKey}.totalBeneficiaries`) || ""}
            readOnly
            className="bg-muted"
            placeholder="يتم حسابه تلقائيا"
          />
          <p className="text-xs text-muted-foreground">يتم حسابه تلقائيا (ذكور + إناث)</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${seasonKey}.maleBeneficiaries`}>توزيعه حسب الذكور{isRequired && " *"}</Label>
          <Input
            id={`${seasonKey}.maleBeneficiaries`}
            type="number"
            min="0"
            {...register(`${seasonKey}.maleBeneficiaries`, { 
              required: isRequired,
              valueAsNumber: true,
              min: 0,
              onChange: (e) => {
                const males = Math.max(0, parseInt(e.target.value) || 0);
                const females = watch(`${seasonKey}.femaleBeneficiaries`) || 0;
                updateTotal(males, females);
              }
            })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${seasonKey}.femaleBeneficiaries`}>توزيعه حسب الإناث{isRequired && " *"}</Label>
          <Input
            id={`${seasonKey}.femaleBeneficiaries`}
            type="number"
            min="0"
            {...register(`${seasonKey}.femaleBeneficiaries`, { 
              required: isRequired,
              valueAsNumber: true,
              min: 0,
              onChange: (e) => {
                const females = Math.max(0, parseInt(e.target.value) || 0);
                const males = watch(`${seasonKey}.maleBeneficiaries`) || 0;
                updateTotal(males, females);
              }
            })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${seasonKey}.primaryBeneficiaries`}>الابتدائي</Label>
          <Input
            id={`${seasonKey}.primaryBeneficiaries`}
            type="number"
            min="0"
            className={schoolLevelExceedsTotal ? "border-destructive" : ""}
            {...register(`${seasonKey}.primaryBeneficiaries`, { valueAsNumber: true, min: 0 })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${seasonKey}.middleSchoolBeneficiaries`}>الثانوي الإعدادي</Label>
          <Input
            id={`${seasonKey}.middleSchoolBeneficiaries`}
            type="number"
            min="0"
            className={schoolLevelExceedsTotal ? "border-destructive" : ""}
            {...register(`${seasonKey}.middleSchoolBeneficiaries`, { valueAsNumber: true, min: 0 })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${seasonKey}.highSchoolBeneficiaries`}>الثانوي التأهيلي</Label>
          <Input
            id={`${seasonKey}.highSchoolBeneficiaries`}
            type="number"
            min="0"
            className={schoolLevelExceedsTotal ? "border-destructive" : ""}
            {...register(`${seasonKey}.highSchoolBeneficiaries`, { valueAsNumber: true, min: 0 })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${seasonKey}.orphans`}>اخر يحدد (التكوين المهني، مدارس الفرصة الثانية...)</Label>
          <Input
            id={`${seasonKey}.orphans`}
            type="number"
            min="0"
            className={schoolLevelExceedsTotal ? "border-destructive" : ""}
            {...register(`${seasonKey}.orphans`, { valueAsNumber: true, min: 0 })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${seasonKey}.disabled`}>ذوي الاحتياجات الخاصة</Label>
          <Input
            id={`${seasonKey}.disabled`}
            type="number"
            min="0"
            {...register(`${seasonKey}.disabled`, { valueAsNumber: true, min: 0 })}
            placeholder="0"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function HousingStep() {
  const { formData, updateFormData, setCurrentStep, formVersion } = useFormContext();

  const { register, watch, setValue, handleSubmit, reset, formState: { errors }, trigger } = useForm<HousingMealsDTO>({
    defaultValues: formData.housingMeals || {
      season2324: {},
      season2425: {},
      season2526: {},
    },
  });

  // Reset form when formVersion changes (for edit mode)
  useEffect(() => {
    if (formVersion > 0) {
      reset(formData.housingMeals || {
        season2324: {},
        season2425: {},
        season2526: {},
      });
    }
  }, [formVersion, reset, formData.housingMeals]);



  const onSubmit = async (data: HousingMealsDTO) => {
    const isValid = await trigger([
      "season2526.maleBeneficiaries", "season2526.femaleBeneficiaries",
      "mealServiceType"
    ]);
    if (!isValid) return;
    updateFormData({ housingMeals: data });
    setCurrentStep("staff");
  };

  const goBack = () => {
    setCurrentStep("targeting");
  };

  const improvementSuggestions = [
    { key: "increaseProducts", label: "زيادة المواد الغذائية وتجويدها" },
    { key: "externalCaterer", label: "اللجوء إلى ممون خارجي لتقديم وجبات جاهزة" },
    { key: "otherSuggestion", label: "آخر (للتحديد)" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>عدد المستفيدين من خدمتي الإيواء والإطعام بالمؤسسة</CardTitle>
          <CardDescription>بالنسبة لخدمة الإيواء - أدخل بيانات المستفيدين لكل موسم دراسي</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SeasonFields
            seasonKey="season2324"
            seasonLabel="الموسم 2023-2024"
            register={register}
            watch={watch}
            setValue={setValue}
            errors={{}}
            isRequired={false}
          />
          <SeasonFields
            seasonKey="season2425"
            seasonLabel="الموسم 2024-2025"
            register={register}
            watch={watch}
            setValue={setValue}
            errors={{}}
            isRequired={false}
          />
          <SeasonFields
            seasonKey="season2526"
            seasonLabel="الموسم 2025-2026"
            register={register}
            watch={watch}
            setValue={setValue}
            errors={{}}
            isRequired={true}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>توضيحات حول استقبال المؤسسة</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="capacityRemarks">المرجو إعطاء توضيحات مركزة حول استقبال المؤسسة لعدد أقل أو أكثر من طاقتها الاستيعابية المرخصة</Label>
          <Textarea
            {...register("capacityRemarks")}
            placeholder="أدخل توضيحاتك هنا..."
            rows={4}
            className="mt-2"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>بالنسبة لخدمة الإطعام خلال الموسم الدراسي 2025-2026</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullGrantCount">عدد المستفيدين من منحة كاملة</Label>
            <Input
              id="fullGrantCount"
              type="number"
              min="0"
              {...register("fullGrantCount", { 
                valueAsNumber: true, 
                min: 0,
                onChange: (e) => {
                  const fullGrant = Math.max(0, parseInt(e.target.value) || 0);
                  const halfGrant = watch("halfGrantCount") || 0;
                  const educationTotal = fullGrant + halfGrant;
                  setValue("educationMealBeneficiaries", educationTotal);
                  const associationBeneficiaries = watch("associationMealBeneficiaries") || 0;
                  setValue("totalMealBeneficiaries2526", associationBeneficiaries + educationTotal);
                }
              })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="halfGrantCount">عدد المستفيدين من نصف منحة (وجبة غذاء)</Label>
            <Input
              id="halfGrantCount"
              type="number"
              min="0"
              {...register("halfGrantCount", { 
                valueAsNumber: true, 
                min: 0,
                onChange: (e) => {
                  const halfGrant = Math.max(0, parseInt(e.target.value) || 0);
                  const fullGrant = watch("fullGrantCount") || 0;
                  const educationTotal = fullGrant + halfGrant;
                  setValue("educationMealBeneficiaries", educationTotal);
                  const associationBeneficiaries = watch("associationMealBeneficiaries") || 0;
                  setValue("totalMealBeneficiaries2526", associationBeneficiaries + educationTotal);
                }
              })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="educationMealBeneficiaries">العدد الإجمالي للمستفيدين فعليا من خدمة الإطعام التي يؤمنها قطاع التربية الوطنية</Label>
            <Input
              id="educationMealBeneficiaries"
              type="number"
              value={watch("educationMealBeneficiaries") || ""}
              readOnly
              className="bg-muted"
              placeholder="يتم حسابه تلقائيا"
            />
            <p className="text-xs text-muted-foreground">يتم حسابه تلقائيا (منحة كاملة + نصف منحة)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="associationMealBeneficiaries">العدد الإجمالي للمستفيدين فعليا من خدمة الإطعام الممول من طرف الجمعية</Label>
            <Input
              id="associationMealBeneficiaries"
              type="number"
              min="0"
              {...register("associationMealBeneficiaries", { 
                valueAsNumber: true, 
                min: 0,
                onChange: (e) => {
                  const associationBeneficiaries = Math.max(0, parseInt(e.target.value) || 0);
                  const educationBeneficiaries = watch("educationMealBeneficiaries") || 0;
                  setValue("totalMealBeneficiaries2526", associationBeneficiaries + educationBeneficiaries);
                }
              })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="totalMealBeneficiaries2526">
              العدد الإجمالي للمستفيدين فعليا من هذه الخدمة
            </Label>
            <Input
              id="totalMealBeneficiaries2526"
              type="number"
              value={watch("totalMealBeneficiaries2526") || ""}
              readOnly
              className="bg-muted"
              placeholder="يتم حسابه تلقائيا"
            />
            <p className="text-xs text-muted-foreground">يتم حسابه تلقائيا (الجمعية + قطاع التربية الوطنية)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mealServiceType">نوعية خدمة الإطعام المقدمة *</Label>
            <input type="hidden" {...register("mealServiceType", { required: true })} />
            <Select
              value={watch("mealServiceType") || ""}
              onValueChange={(value) => setValue("mealServiceType", value as MealServiceType, { shouldValidate: true })}
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
            {errors.mealServiceType && (
              <p className="text-sm text-destructive">نوعية خدمة الإطعام المقدمة مطلوبة</p>
            )}
            {watch("mealServiceType") === "OTHER" && (
              <Input
                placeholder="حدد نوعية خدمة الإطعام"
                {...register("mealServiceTypeOther")}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ما هي مقترحاتكم من أجل تحسين جودة ال��طعام بالمؤسسة</CardTitle>
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
