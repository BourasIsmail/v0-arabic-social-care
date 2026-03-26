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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  SelectionBody,
  TariffType,
  TariffBracket,
  selectionBodyLabels,
  tariffTypeLabels,
  tariffBracketLabels,
} from "@/lib/types";
import type { TargetingDTO } from "@/lib/types";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function TargetingStep() {
  const { formData, updateFormData, setCurrentStep } = useFormContext();

  const { register, watch, setValue, handleSubmit, reset } = useForm<TargetingDTO>({
    defaultValues: formData.targeting || {},
  });

  // Reset form when formData changes (for edit mode)
  useEffect(() => {
    reset(formData.targeting || {});
  }, [formData.targeting, reset]);

  const onSubmit = (data: TargetingDTO) => {
    updateFormData({ targeting: data });
    setCurrentStep("housing");
  };

  const goBack = () => {
    setCurrentStep("financing");
  };

  const selectionCriteria = [
    { key: "socialSituation", label: "الوضعية الاجتماعية" },
    { key: "distance", label: "البعد عن المؤسسة التعليمية" },
    { key: "schoolResults", label: "النتائج الدراسية" },
    { key: "scholarship", label: "الحصول على منحة" },
    { key: "otherCriteria", label: "أخرى" },
  ];

  const committeeMembers = [
    { key: "committeeAssociation", label: "الجمعية" },
    { key: "committeeNationalEntraide", label: "التعاون الوطني" },
    { key: "committeeNationalEducation", label: "التربية الوطنية" },
    { key: "committeeCommune", label: "الجماعة" },
    { key: "committeeLocalAuthorities", label: "السلطات المحلية" },
    { key: "otherMember", label: "أخرى" },
  ];

  const tariffType = watch("tariffType");
  const servicesAreFree = watch("servicesAreFree");
  const selectionBody = watch("selectionBody");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>معايير الاختيار</CardTitle>
          <CardDescription>حدد المعايير المستخدمة لاختيار المستفيدين</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {selectionCriteria.map((criteria) => (
              <div key={criteria.key} className="flex items-center gap-2">
                <Checkbox
                  id={criteria.key}
                  checked={(watch(criteria.key as keyof TargetingDTO) as boolean) || false}
                  onCheckedChange={(checked) =>
                    setValue(criteria.key as keyof TargetingDTO, checked as boolean)
                  }
                />
                <Label htmlFor={criteria.key} className="cursor-pointer">
                  {criteria.label}
                </Label>
              </div>
            ))}
          </div>

          {watch("otherCriteria") && (
            <div className="space-y-2">
              <Label htmlFor="otherCriteriaDetail">تحديد المعيار الآخر</Label>
              <Input
                id="otherCriteriaDetail"
                {...register("otherCriteriaDetail")}
                placeholder="أدخل المعيار"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ترتيب الأولويات</CardTitle>
          <CardDescription>رتب الأولويات من 1 إلى 5</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="space-y-2">
              <Label htmlFor={`priority${num}`}>الأولوية {num}</Label>
              <Input
                id={`priority${num}`}
                {...register(`priority${num}` as keyof TargetingDTO)}
                placeholder={`الأولوية ${num}`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>جهة الانتقاء</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="selectionBody">جهة الانتقاء</Label>
            <Select
              value={watch("selectionBody") || ""}
              onValueChange={(value) => setValue("selectionBody", value as SelectionBody)}
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

          {selectionBody === SelectionBody.COMMITTEE && (
            <div className="space-y-4">
              <Label>أعضاء اللجنة</Label>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {committeeMembers.map((member) => (
                  <div key={member.key} className="flex items-center gap-2">
                    <Checkbox
                      id={member.key}
                      checked={(watch(member.key as keyof TargetingDTO) as boolean) || false}
                      onCheckedChange={(checked) =>
                        setValue(member.key as keyof TargetingDTO, checked as boolean)
                      }
                    />
                    <Label htmlFor={member.key} className="cursor-pointer">
                      {member.label}
                    </Label>
                  </div>
                ))}
              </div>

              {watch("otherMember") && (
                <div className="space-y-2">
                  <Label htmlFor="otherMemberDetail">تحديد العضو الآخر</Label>
                  <Input
                    id="otherMemberDetail"
                    {...register("otherMemberDetail")}
                    placeholder="أدخل اسم العضو"
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>التعريفة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="servicesAreFree"
              checked={servicesAreFree || false}
              onCheckedChange={(checked) => setValue("servicesAreFree", checked as boolean)}
            />
            <Label htmlFor="servicesAreFree" className="cursor-pointer">
              الخدمات مجانية
            </Label>
          </div>

          {!servicesAreFree && (
            <>
              <div className="space-y-2">
                <Label htmlFor="tariffType">نوع التعريفة</Label>
                <Select
                  value={tariffType || ""}
                  onValueChange={(value) => setValue("tariffType", value as TariffType)}
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
                  <Label htmlFor="uniformAmount">المبلغ الموحد (درهم)</Label>
                  <Input
                    id="uniformAmount"
                    type="number"
                    step="0.01"
                    {...register("uniformAmount", { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                </div>
              )}

              {tariffType === TariffType.BRACKETED && (
                <div className="space-y-2">
                  <Label htmlFor="tariffBracket">شريحة التعريفة</Label>
                  <Select
                    value={watch("tariffBracket") || ""}
                    onValueChange={(value) => setValue("tariffBracket", value as TariffBracket)}
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
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>معلومات إضافية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="unsatisfiedRequestsCount">عدد الطلبات غير الملباة</Label>
            <Input
              id="unsatisfiedRequestsCount"
              type="number"
              {...register("unsatisfiedRequestsCount", { valueAsNumber: true })}
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
