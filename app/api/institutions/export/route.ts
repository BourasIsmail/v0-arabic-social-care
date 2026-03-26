import { NextResponse } from "next/server";
import type { InstitutionRequest } from "@/lib/types";
import { institutionTypeLabels, milieuLabels, legalStatusLabels } from "@/lib/types";

// Reference to global storage
const getInstitutions = () => {
  // @ts-ignore
  if (!global.institutions) {
    // @ts-ignore
    global.institutions = [];
  }
  // @ts-ignore
  return global.institutions as (InstitutionRequest & { id: number; createdAt: string; updatedAt: string })[];
};

export async function GET() {
  const institutions = getInstitutions();

  // CSV headers
  const headers = [
    "المعرف",
    "نوع المؤسسة",
    "اسم المؤسسة",
    "اسم الجمعية",
    "العنوان",
    "الجهة",
    "العمالة/الإقليم",
    "الجماعة",
    "الوسط",
    "سنة التأسيس",
    "الوضعية القانونية",
    "الطاقة الإجمالية",
    "طاقة الذكور",
    "طاقة الإناث",
    "تاريخ الإنشاء",
  ];

  // Convert data to CSV rows
  const rows = institutions.map((inst) => [
    inst.id,
    inst.institutionType ? institutionTypeLabels[inst.institutionType] : "",
    inst.institutionName || "",
    inst.associationName || "",
    inst.address || "",
    inst.region || "",
    inst.prefectureProvince || "",
    inst.commune || "",
    inst.milieu ? milieuLabels[inst.milieu] : "",
    inst.creationYear || "",
    inst.legalStatus ? legalStatusLabels[inst.legalStatus] : "",
    inst.totalCapacity || "",
    inst.maleCapacity || "",
    inst.femaleCapacity || "",
    inst.createdAt ? new Date(inst.createdAt).toLocaleDateString("ar-MA") : "",
  ]);

  // Build CSV content
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  // Add BOM for UTF-8 Excel compatibility
  const bom = "\uFEFF";
  const csvWithBom = bom + csvContent;

  return new NextResponse(csvWithBom, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="institutions_${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
