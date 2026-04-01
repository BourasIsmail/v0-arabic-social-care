"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "@/lib/form-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StaffType, staffTypeLabels } from "@/lib/types";
import type { StaffMemberDTO } from "@/lib/types";
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";

export function StaffStep() {
  const { formData, updateFormData, setCurrentStep, formVersion } = useFormContext();
  const [staffMembers, setStaffMembers] = useState<StaffMemberDTO[]>(
    formData.staffMembers || []
  );

  // Sync staffMembers when formVersion changes (for edit mode)
  useEffect(() => {
    if (formVersion > 0) {
      setStaffMembers(formData.staffMembers || []);
    }
  }, [formVersion, formData.staffMembers]);

  const [newMember, setNewMember] = useState<Partial<StaffMemberDTO>>({
    staffType: undefined,
    nbAssociation: 0,
    nbDeployed: 0,
    nbVolunteers: 0,
    nbCNSS: 0,
    nbSMIG: 0,
    monthlyCost: 0,
    annualCost: 0,
  });

  const addStaffMember = () => {
    if (!newMember.staffType) return;

    setStaffMembers([...staffMembers, newMember as StaffMemberDTO]);
    setNewMember({
      staffType: undefined,
      nbAssociation: 0,
      nbDeployed: 0,
      nbVolunteers: 0,
      nbCNSS: 0,
      nbSMIG: 0,
      monthlyCost: 0,
      annualCost: 0,
    });
  };

  const removeStaffMember = (index: number) => {
    setStaffMembers(staffMembers.filter((_, i) => i !== index));
  };

  const onSubmit = () => {
    updateFormData({ staffMembers });
    setCurrentStep("review");
  };

  const goBack = () => {
    updateFormData({ staffMembers });
    setCurrentStep("housing");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>معطيات حول الموارد البشرية العاملة بالمؤسسة</CardTitle>
          <CardDescription>أدخل بيانات الموظف ثم اضغط على زر الإضافة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="staffType">نوع التأطير *</Label>
              <Select
                value={newMember.staffType || ""}
                onValueChange={(value) =>
                  setNewMember({ ...newMember, staffType: value as StaffType })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع التأطير" />
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
              <Label htmlFor="nbAssociation">عدد المستخدمين بالجمعية</Label>
              <Input
                id="nbAssociation"
                type="number"
                value={newMember.nbAssociation || ""}
                onChange={(e) =>
                  setNewMember({ ...newMember, nbAssociation: parseInt(e.target.value) || 0 })
                }
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nbDeployed">عدد الأطر الموضوعة رهن الإشارة</Label>
              <Input
                id="nbDeployed"
                type="number"
                value={newMember.nbDeployed || ""}
                onChange={(e) =>
                  setNewMember({ ...newMember, nbDeployed: parseInt(e.target.value) || 0 })
                }
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nbVolunteers">عدد الأطر المتطوعة</Label>
              <Input
                id="nbVolunteers"
                type="number"
                value={newMember.nbVolunteers || ""}
                onChange={(e) =>
                  setNewMember({ ...newMember, nbVolunteers: parseInt(e.target.value) || 0 })
                }
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nbCNSS">عدد المستخدمين المستفيدين من الصندوق الوطني للضمان الاجتماعي (CNSS)</Label>
              <Input
                id="nbCNSS"
                type="number"
                value={newMember.nbCNSS || ""}
                onChange={(e) =>
                  setNewMember({ ...newMember, nbCNSS: parseInt(e.target.value) || 0 })
                }
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nbSMIG">عدد المستخدمين المستفيدين من الحد الأدنى للأجر المهني المضمون (SMIG)</Label>
              <Input
                id="nbSMIG"
                type="number"
                value={newMember.nbSMIG || ""}
                onChange={(e) =>
                  setNewMember({ ...newMember, nbSMIG: parseInt(e.target.value) || 0 })
                }
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyCost">الكلفة الشهرية (بالدرهم)</Label>
              <Input
                id="monthlyCost"
                type="number"
                step="0.01"
                value={newMember.monthlyCost || ""}
                onChange={(e) =>
                  setNewMember({ ...newMember, monthlyCost: parseFloat(e.target.value) || 0 })
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualCost">الكلفة السنوية (بالدرهم)</Label>
              <Input
                id="annualCost"
                type="number"
                step="0.01"
                value={newMember.annualCost || ""}
                onChange={(e) =>
                  setNewMember({ ...newMember, annualCost: parseFloat(e.target.value) || 0 })
                }
                placeholder="0.00"
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={addStaffMember}
            disabled={!newMember.staffType}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            اضافة مستخدم
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الموظفين</CardTitle>
          <CardDescription>
            {staffMembers.length > 0
              ? `تم إضافة ${staffMembers.length} موظف(ين)`
              : "لم يتم إضافة أي موظف بعد"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {staffMembers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>نوع التأطير</TableHead>
                    <TableHead>عدد المستخدمين بالجمعية</TableHead>
                    <TableHead>الأطر رهن الإشارة</TableHead>
                    <TableHead>الأطر المتطوعة</TableHead>
                    <TableHead>CNSS</TableHead>
                    <TableHead>SMIG</TableHead>
                    <TableHead>الكلفة الشهرية</TableHead>
                    <TableHead>الكلفة السنوية</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffMembers.map((member, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {staffTypeLabels[member.staffType]}
                      </TableCell>
                      <TableCell>{member.nbAssociation || 0}</TableCell>
                      <TableCell>{member.nbDeployed || 0}</TableCell>
                      <TableCell>{member.nbVolunteers || 0}</TableCell>
                      <TableCell>{member.nbCNSS || 0}</TableCell>
                      <TableCell>{member.nbSMIG || 0}</TableCell>
                      <TableCell>{member.monthlyCost?.toLocaleString() || 0} درهم</TableCell>
                      <TableCell>{member.annualCost?.toLocaleString() || 0} درهم</TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStaffMember(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              لا يوجد موظفون مضافون. استخدم النموذج أعلاه لإضافة موظفين.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" size="lg" onClick={goBack} className="gap-2">
          <ArrowRight className="h-4 w-4" />
          السابق
        </Button>
        <Button type="button" size="lg" onClick={onSubmit} className="gap-2">
          التالي
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
