"use client";

import { useState } from "react";
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
  const { formData, updateFormData, setCurrentStep } = useFormContext();
  const [staffMembers, setStaffMembers] = useState<StaffMemberDTO[]>(
    formData.staffMembers || []
  );

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
          <CardTitle>إضافة موظف جديد</CardTitle>
          <CardDescription>أدخل بيانات الموظف ثم اضغط على زر الإضافة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="staffType">نوع الموظف *</Label>
              <Select
                value={newMember.staffType || ""}
                onValueChange={(value) =>
                  setNewMember({ ...newMember, staffType: value as StaffType })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الموظف" />
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
              <Label htmlFor="nbAssociation">عدد الجمعية</Label>
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
              <Label htmlFor="nbDeployed">عدد المنتدبين</Label>
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
              <Label htmlFor="nbVolunteers">عدد المتطوعين</Label>
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
              <Label htmlFor="nbCNSS">عدد CNSS</Label>
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
              <Label htmlFor="nbSMIG">عدد SMIG</Label>
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
              <Label htmlFor="monthlyCost">التكلفة الشهرية (درهم)</Label>
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
              <Label htmlFor="annualCost">التكلفة السنوية (درهم)</Label>
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
            إضافة موظف
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
                    <TableHead>نوع الموظف</TableHead>
                    <TableHead>الجمعية</TableHead>
                    <TableHead>المنتدبون</TableHead>
                    <TableHead>المتطوعون</TableHead>
                    <TableHead>CNSS</TableHead>
                    <TableHead>SMIG</TableHead>
                    <TableHead>الشهري</TableHead>
                    <TableHead>السنوي</TableHead>
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
