import { NextResponse } from "next/server";
import type { GeoDTO } from "@/lib/types";

// In-memory Moroccan regions data (synced with backend seed data)
const regions: GeoDTO[] = [
  { id: 1, name: "طنجة-تطوان-الحسيمة" },
  { id: 2, name: "الشرق" },
  { id: 3, name: "فاس-مكناس" },
  { id: 4, name: "الرباط-سلا-القنيطرة" },
  { id: 5, name: "بني ملال-خنيفرة" },
  { id: 6, name: "الدار البيضاء-سطات" },
  { id: 7, name: "مراكش-آسفي" },
  { id: 8, name: "درعة-تافيلالت" },
  { id: 9, name: "سوس-ماسة" },
  { id: 10, name: "كلميم-واد نون" },
  { id: 11, name: "العيون-الساقية الحمراء" },
  { id: 12, name: "الداخلة-وادي الذهب" },
];

export async function GET() {
  return NextResponse.json(regions);
}
