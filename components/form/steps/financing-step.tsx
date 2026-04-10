"use client";

import { useEffect } from "react";
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
  const { formData, updateFormData, setCurrentStep, formVersion } = useFormContext();

  const { register, watch, setValue, handleSubmit, reset } = useForm<FinancingDTO>({
    defaultValues: formData.financing || {},
  });

  // Reset form when formVersion changes (for edit mode)
  useEffect(() => {
    if (formVersion > 0) {
      reset(formData.financing || {});
    }
  }, [formVersion, reset, formData.financing]);

  const onSubmit = (data: FinancingDTO) => {
    updateFormData({ financing: data });
    setCurrentStep("targeting");
  };

  const goBack = () => {
    setCurrentStep("building");
  };

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

  // Watch for parent contributions to show paid option
  const parentContributionsSelected = watch("operatingParentContributions");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  id={source.key}
                  checked={(watch(source.key as keyof FinancingDTO) as boolean) || false}
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
              min="0"
              {...register("totalConstructionCost", { valueAsNumber: true, min: 0 })}
              placeholder="0.00"
            />
          </div>
        </CardContent>
      </Card>

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
                  id={source.key}
                  checked={(watch(source.key as keyof FinancingDTO) as boolean) || false}
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
          <CardTitle>مصادر تمويل تسيير المؤسسة</CardTitle>
          <CardDescription>حدد مصادر تمويل تسيير المؤسسة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {operatingSources.map((source) => (
              <div key={source.key} className="flex items-center gap-2">
                <Checkbox
                  id={source.key}
                  checked={(watch(source.key as keyof FinancingDTO) as boolean) || false}
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

          {watch("operatingOther") && (
            <div className="space-y-2 sm:col-span-2 lg:col-span-4">
              <Label htmlFor="operatingOtherDetail">تحديد المصدر الآخر</Label>
              <Input
                id="operatingOtherDetail"
                {...register("operatingOtherDetail")}
                placeholder="أدخل المصدر"
              />
            </div>
          )}

          {parentContributionsSelected && (
            <div className="space-y-2 sm:col-span-2 lg:col-span-4">
              <Label htmlFor="parentContributionAmount">مبلغ اشتراكات الآباء الشهري (درهم)</Label>
              <Input
                id="parentContributionAmount"
                type="number"
                step="0.01"
                min="0"
                {...register("parentContributionAmount", { valueAsNumber: true, min: 0 })}
                placeholder="0.00"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="annualManagementCost">التكلفة السنوية للتسيير (درهم)</Label>
            <Input
              id="annualManagementCost"
              type="number"
              step="0.01"
              min="0"
              {...register("annualManagementCost", { valueAsNumber: true, min: 0 })}
              placeholder="0.00"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>التكاليف السنوية</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="annualHRCost">الكلفة السنوية المخصصة للموارد البشرية (درهم)</Label>
            <Input
              id="annualHRCost"
              type="number"
              step="0.01"
              min="0"
              {...register("annualHRCost", { valueAsNumber: true, min: 0 })}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualMealsCost">الكلفة السنوية المخصصة للإطعام (درهم)</Label>
            <Input
              id="annualMealsCost"
              type="number"
              step="0.01"
              min="0"
              {...register("annualMealsCost", { valueAsNumber: true, min: 0 })}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualOtherExpenses">الكلفة السنوية المخصصة لباقي النفقات (الماء، الكهرباء، الغاز، مواد النظافة...) (درهم)</Label>
            <Input
              id="annualOtherExpenses"
              type="number"
              step="0.01"
              min="0"
              {...register("annualOtherExpenses", { valueAsNumber: true, min: 0 })}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="individualAnnualCost">الكلفة السنوية للتكفل بكل مستفيد داخل المؤسسة (الكلفة الفردية) (درهم)</Label>
            <Input
              id="individualAnnualCost"
              type="number"
              step="0.01"
              min="0"
              {...register("individualAnnualCost", { valueAsNumber: true, min: 0 })}
              placeholder="0.00"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>نسب المساهمة في تمويل الإطعام (%)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="associationShare">نسبة مساهمة الجمعية المسيرة</Label>
            <Input
              id="associationShare"
              type="number"
              step="0.01"
              min="0"
              max="100"
              {...register("associationShare", { valueAsNumber: true, min: 0, max: 100 })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="educationShare">نسبة مساهمة قطاع التربية الوطنية</Label>
            <Input
              id="educationShare"
              type="number"
              step="0.01"
              min="0"
              max="100"
              {...register("educationShare", { valueAsNumber: true, min: 0, max: 100 })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherShare">نسبة مساهمة أخرى (للتحديد)</Label>
            <Input
              id="otherShare"
              type="number"
              step="0.01"
              min="0"
              max="100"
              {...register("otherShare", { valueAsNumber: true, min: 0, max: 100 })}
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
