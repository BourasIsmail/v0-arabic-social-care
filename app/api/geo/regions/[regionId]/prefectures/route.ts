import { NextRequest, NextResponse } from "next/server";
import type { GeoDTO } from "@/lib/types";

// Prefectures data by region ID (synced with backend seed data)
const prefecturesByRegion: Record<number, GeoDTO[]> = {
  1: [
    { id: 1, name: "طنجة-أصيلة" },
    { id: 2, name: "المضيق-الفنيدق" },
    { id: 3, name: "تطوان" },
    { id: 4, name: "الفحص-أنجرة" },
    { id: 5, name: "العرائش" },
    { id: 6, name: "الحسيمة" },
    { id: 7, name: "شفشاون" },
    { id: 8, name: "وزان" },
  ],
  2: [
    { id: 9, name: "وجدة-أنجاد" },
    { id: 10, name: "الناظور" },
    { id: 11, name: "الدريوش" },
    { id: 12, name: "جرادة" },
    { id: 13, name: "بركان" },
    { id: 14, name: "تاوريرت" },
    { id: 15, name: "جرسيف" },
    { id: 16, name: "فجيج" },
  ],
  3: [
    { id: 17, name: "فاس" },
    { id: 18, name: "مكناس" },
    { id: 19, name: "الحاجب" },
    { id: 20, name: "إفران" },
    { id: 21, name: "مولاي يعقوب" },
    { id: 22, name: "صفرو" },
    { id: 23, name: "بولمان" },
    { id: 24, name: "تاونات" },
    { id: 25, name: "تازة" },
  ],
  4: [
    { id: 26, name: "الرباط" },
    { id: 27, name: "سلا" },
    { id: 28, name: "الصخيرات-تمارة" },
    { id: 29, name: "القنيطرة" },
    { id: 30, name: "الخميسات" },
    { id: 31, name: "سيدي قاسم" },
    { id: 32, name: "سيدي سليمان" },
  ],
  5: [
    { id: 33, name: "بني ملال" },
    { id: 34, name: "أزيلال" },
    { id: 35, name: "الفقيه بن صالح" },
    { id: 36, name: "خنيفرة" },
    { id: 37, name: "خريبكة" },
  ],
  6: [
    { id: 38, name: "الدار البيضاء" },
    { id: 39, name: "المحمدية" },
    { id: 40, name: "الجديدة" },
    { id: 41, name: "النواصر" },
    { id: 42, name: "مديونة" },
    { id: 43, name: "بن سليمان" },
    { id: 44, name: "برشيد" },
    { id: 45, name: "سطات" },
    { id: 46, name: "سيدي بنور" },
  ],
  7: [
    { id: 47, name: "مراكش" },
    { id: 48, name: "شيشاوة" },
    { id: 49, name: "الحوز" },
    { id: 50, name: "قلعة السراغنة" },
    { id: 51, name: "الصويرة" },
    { id: 52, name: "الرحامنة" },
    { id: 53, name: "آسفي" },
    { id: 54, name: "اليوسفية" },
  ],
  8: [
    { id: 55, name: "الرشيدية" },
    { id: 56, name: "ورزازات" },
    { id: 57, name: "ميدلت" },
    { id: 58, name: "تنغير" },
    { id: 59, name: "زاكورة" },
  ],
  9: [
    { id: 60, name: "أكادير-إدا أوتانان" },
    { id: 61, name: "إنزكان-أيت ملول" },
    { id: 62, name: "شتوكة-آيت باها" },
    { id: 63, name: "تارودانت" },
    { id: 64, name: "تيزنيت" },
    { id: 65, name: "طاطا" },
  ],
  10: [
    { id: 66, name: "كلميم" },
    { id: 67, name: "أسا-الزاك" },
    { id: 68, name: "طانطان" },
    { id: 69, name: "سيدي إفني" },
  ],
  11: [
    { id: 70, name: "العيون" },
    { id: 71, name: "بوجدور" },
    { id: 72, name: "طرفاية" },
    { id: 73, name: "السمارة" },
  ],
  12: [
    { id: 74, name: "وادي الذهب" },
    { id: 75, name: "أوسرد" },
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ regionId: string }> }
) {
  const { regionId } = await params;
  const id = parseInt(regionId, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid region ID" }, { status: 400 });
  }

  const prefectures = prefecturesByRegion[id] || [];
  return NextResponse.json(prefectures);
}
