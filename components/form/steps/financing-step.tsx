"use client";

import { useForm } from "react-hook-form";
import { useFormContext } from "@/lib/form-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { FinancingDTO } from "@/lib/types";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function FinancingStep() {
  const { formData, updateFormData, setCurrentStep } = useFormContext();

  const { register, watch, setValue, handleSubmit } = useForm<FinancingDTO>({
    defaultValues: formData.financing || {},
  });

  const onSubmit = (data: FinancingDTO) => {
    updateFormData({ financing: data });
    setCurrentStep("targeting");
  };

  const goBack = () => {
    setCurrentStep("building");
  };

  const constructionSources = [
    { key: "solidarityMinistry", label: "وزارة التضامن" },
    { key: "nationalEntraide", label: "التعاون الوطني" },
    { key: "indh", label: "المبادرة الوطنية للتنمية البشرية" },
    { key: "commune", label: "الجماعة" },
    { key: "fondationMohammed5", label: "مؤسسة محمد الخامس للتضامن" },
    { key: "nationalRevival", label: "الإنعاش الوطني" },
    { key: "association", label: "الجمعية" },
    { key: "otherConstruction", label: "أخرى" },
  ];

  const equipmentSources = [
    { key: "equipmentSolidarityMinistry", label: "وزارة التضامن" },
    { key: "equipmentNationalEntraide", label: "التعاون الوطني" },
    { key: "equipmentIndh", label: "المبادرة الوطنية للتنمية البشرية" },
    { key: "equipmentCommune", label: "الجماعة" },
    { key: "equipmentFondationMohammed5", label: "مؤسسة محمد الخامس للتضامن" },
    { key: "equipmentAssociation", label: "الجمعية" },
    { key: "equipmentOther", label: "أخرى" },
  ];

  const operatingSources = [
    { key: "operatingIndh", label: "المبادرة الوطنية للتنمية البشرية" },
    { key: "operatingNationalEntraide", label: "التعاون الوطني" },
    { key: "operatingNationalEducation", label: "التربية الوطنية" },
    { key: "operatingCommune", label: "الجماعة" },
    { key: "operatingParentContributions", label: "مساهمات أولياء الأمور" },
    { key: "operatingDonors", label: "المحسنون" },
    { key: "operatingAssociationOwnSources", label: "موارد الجمعية الذاتية" },
    { key: "operatingOther", label: "أخرى" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>مصادر تمويل البناء</CardTitle>
          <CardDescription>حدد مصادر تمويل بناء المؤسسة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {constructionSources.map((source) => (
              <div key={source.key} className="flex items-center gap-2">
                <Checkbox
                  id={source.key}
                  checked={watch(source.key as keyof FinancingDTO) as boolean}
                  onCheckedChange={(checked) =>
                    setValue(source.key as keyof FinancingDTO, checked as boolean)
                  }
                />
                <Label htmlFor={source.key} className="cursor-pointer text-sm">
                  {source.label}
                </Label>
              </div>
            ))}
          </div>

          {watch("otherConstruction") && (
            <div className="space-y-2">
              <Label htmlFor="otherConstructionDetail">تحديد المصدر الآخر</Label>
              <Input
                id="otherConstructionDetail"
                {...register("otherConstructionDetail")}
                placeholder="أدخل المصدر"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="totalConstructionCost">التكلفة الإجمالية للبناء (درهم)</Label>
            <Input
              id="totalConstructionCost"
              type="number"
              step="0.01"
              {...register("totalConstructionCost", { valueAsNumber: true })}
              placeholder="0.00"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>مصادر تمويل التجهيز</CardTitle>
          <CardDescription>حدد مصادر تمويل تجهيز المؤسسة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {equipmentSources.map((source) => (
              <div key={source.key} className="flex items-center gap-2">
                <Checkbox
                  id={source.key}
                  checked={watch(source.key as keyof FinancingDTO) as boolean}
                  onCheckedChange={(checked) =>
                    setValue(source.key as keyof FinancingDTO, checked as boolean)
                  }
                />
                <Label htmlFor={source.key} className="cursor-pointer text-sm">
                  {source.label}
                </Label>
              </div>
            ))}
          </div>

          {watch("equipmentOther") && (
            <div className="space-y-2">
              <Label htmlFor="equipmentOtherDetail">تحديد المصدر الآخر</Label>
              <Input
                id="equipmentOtherDetail"
                {...register("equipmentOtherDetail")}
                placeholder="أدخل المصدر"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>مصادر تمويل التسيير</CardTitle>
          <CardDescription>حدد مصادر تمويل تسيير المؤسسة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {operatingSources.map((source) => (
              <div key={source.key} className="flex items-center gap-2">
                <Checkbox
                  id={source.key}
                  checked={watch(source.key as keyof FinancingDTO) as boolean}
                  onCheckedChange={(checked) =>
                    setValue(source.key as keyof FinancingDTO, checked as boolean)
                  }
                />
                <Label htmlFor={source.key} className="cursor-pointer text-sm">
                  {source.label}
                </Label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualManagementCost">التكلفة السنوية للتسيير (درهم)</Label>
            <Input
              id="annualManagementCost"
              type="number"
              step="0.01"
              {...register("annualManagementCost", { valueAsNumber: true })}
              placeholder="0.00"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>التكاليف الإضافية</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="annualHRCost">التكلفة السنوية للموارد البشرية (درهم)</Label>
            <Input
              id="annualHRCost"
              type="number"
              step="0.01"
              {...register("annualHRCost", { valueAsNumber: true })}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualMealsCost">التكلفة السنوية للإطعام (درهم)</Label>
            <Input
              id="annualMealsCost"
              type="number"
              step="0.01"
              {...register("annualMealsCost", { valueAsNumber: true })}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalMealsAmount">المبلغ الإجمالي للوجبات (درهم)</Label>
            <Input
              id="totalMealsAmount"
              type="number"
              step="0.01"
              {...register("totalMealsAmount", { valueAsNumber: true })}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualOtherExpenses">المصاريف الأخرى السنوية (درهم)</Label>
            <Input
              id="annualOtherExpenses"
              type="number"
              step="0.01"
              {...register("annualOtherExpenses", { valueAsNumber: true })}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="individualAnnualCost">التكلفة السنوية للفرد (درهم)</Label>
            <Input
              id="individualAnnualCost"
              type="number"
              step="0.01"
              {...register("individualAnnualCost", { valueAsNumber: true })}
              placeholder="0.00"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>توزيع الحصص (%)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="associationShare">حصة الجمعية</Label>
            <Input
              id="associationShare"
              type="number"
              step="0.01"
              max="100"
              {...register("associationShare", { valueAsNumber: true })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="educationShare">حصة التربية الوطنية</Label>
            <Input
              id="educationShare"
              type="number"
              step="0.01"
              max="100"
              {...register("educationShare", { valueAsNumber: true })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherShare">حصص أخرى</Label>
            <Input
              id="otherShare"
              type="number"
              step="0.01"
              max="100"
              {...register("otherShare", { valueAsNumber: true })}
              placeholder="0"
            />
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
