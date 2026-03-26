import { NextRequest, NextResponse } from "next/server";
import type { GeoDTO } from "@/lib/types";

// Communes data by prefecture ID (synced with backend seed data)
const communesByPrefecture: Record<number, GeoDTO[]> = {
  // Tanger-Assilah
  1: [
    { id: 1, name: "طنجة المدينة" },
    { id: 2, name: "أصيلة" },
    { id: 3, name: "الغربية" },
    { id: 4, name: "العوامة" },
    { id: 5, name: "مقريصات" },
  ],
  // Tétouan
  3: [
    { id: 6, name: "تطوان" },
    { id: 7, name: "المرتيل" },
    { id: 8, name: "الفنيدق" },
    { id: 9, name: "عزلا" },
    { id: 10, name: "بني حزمار" },
  ],
  // Al Hoceïma
  6: [
    { id: 11, name: "الحسيمة" },
    { id: 12, name: "إمزورن" },
    { id: 13, name: "بني بوعياش" },
    { id: 14, name: "تاركيست" },
    { id: 15, name: "أجدير" },
  ],
  // Oujda-Angad
  9: [
    { id: 16, name: "وجدة" },
    { id: 17, name: "بني درار" },
    { id: 18, name: "سيدي يحيى" },
    { id: 19, name: "العيون سيدي ملوك" },
  ],
  // Nador
  10: [
    { id: 20, name: "الناظور" },
    { id: 21, name: "زايو" },
    { id: 22, name: "سلوان" },
    { id: 23, name: "العروي" },
    { id: 24, name: "بني أنصار" },
  ],
  // Fès
  17: [
    { id: 25, name: "فاس" },
    { id: 26, name: "الزواغة" },
    { id: 27, name: "مشرع حمادي" },
    { id: 28, name: "سيدي حرازم" },
  ],
  // Meknès
  18: [
    { id: 29, name: "مكناس" },
    { id: 30, name: "الحاجب" },
    { id: 31, name: "توليت" },
    { id: 32, name: "ويسلان" },
  ],
  // Rabat
  26: [
    { id: 33, name: "الرباط" },
    { id: 34, name: "أكدال الرياض" },
    { id: 35, name: "السويسي" },
    { id: 36, name: "اليوسفية" },
  ],
  // Salé
  27: [
    { id: 37, name: "سلا الجديدة" },
    { id: 38, name: "العيايدة" },
    { id: 39, name: "سيدي موسى" },
    { id: 40, name: "لمريسة" },
  ],
  // Kénitra
  29: [
    { id: 41, name: "القنيطرة" },
    { id: 42, name: "المهدية" },
    { id: 43, name: "سيدي الطيبي" },
    { id: 44, name: "سيدي يحيى الغرب" },
  ],
  // Béni Mellal
  33: [
    { id: 45, name: "بني ملال" },
    { id: 46, name: "قصبة تادلة" },
    { id: 47, name: "فم العنصر" },
    { id: 48, name: "سوق السبت" },
  ],
  // Casablanca
  38: [
    { id: 49, name: "عين الشق" },
    { id: 50, name: "عين السبع-الحي المحمدي" },
    { id: 51, name: "الفداء-مرس السلطان" },
    { id: 52, name: "بن مسيك" },
    { id: 53, name: "سباتة" },
    { id: 54, name: "المعاريف" },
    { id: 55, name: "أنفا" },
    { id: 56, name: "سيدي بليوط" },
  ],
  // Mohammedia
  39: [
    { id: 57, name: "المحمدية" },
    { id: 58, name: "عين حرودة" },
    { id: 59, name: "بني يخلف" },
    { id: 60, name: "المجاطية أولاد طالب" },
  ],
  // El Jadida
  40: [
    { id: 61, name: "الجديدة" },
    { id: 62, name: "أزمور" },
    { id: 63, name: "سيدي بوزيد" },
    { id: 64, name: "مولاي عبد الله" },
  ],
  // Settat
  45: [
    { id: 65, name: "سطات" },
    { id: 66, name: "برشيد" },
    { id: 67, name: "بن أحمد" },
    { id: 68, name: "الدروة" },
  ],
  // Marrakech
  47: [
    { id: 69, name: "المنارة" },
    { id: 70, name: "جليز" },
    { id: 71, name: "المدينة" },
    { id: 72, name: "سيدي يوسف بن علي" },
    { id: 73, name: "النخيل" },
    { id: 74, name: "مشوار القصبة" },
  ],
  // Al Haouz
  49: [
    { id: 75, name: "تحناوت" },
    { id: 76, name: "أمزميز" },
    { id: 77, name: "أسني" },
    { id: 78, name: "ويركان" },
  ],
  // Safi
  53: [
    { id: 79, name: "آسفي" },
    { id: 80, name: "الشماعية" },
    { id: 81, name: "جمعة سحيم" },
    { id: 82, name: "اليوسفية" },
  ],
  // Errachidia
  55: [
    { id: 83, name: "الرشيدية" },
    { id: 84, name: "أرفود" },
    { id: 85, name: "الريصاني" },
    { id: 86, name: "كلعة مكونة" },
  ],
  // Ouarzazate
  56: [
    { id: 87, name: "ورزازات" },
    { id: 88, name: "تنغير" },
    { id: 89, name: "سكورة" },
    { id: 90, name: "زاكورة" },
  ],
  // Agadir
  60: [
    { id: 91, name: "أكادير" },
    { id: 92, name: "الدشيرة الجهادية" },
    { id: 93, name: "تيكوين" },
    { id: 94, name: "بنسركاو" },
  ],
  // Inezgane-Aït Melloul
  61: [
    { id: 95, name: "إنزكان" },
    { id: 96, name: "أيت ملول" },
    { id: 97, name: "الدشيرة الجهادية" },
    { id: 98, name: "تمسية" },
  ],
  // Taroudant
  63: [
    { id: 99, name: "تارودانت" },
    { id: 100, name: "أولاد تايمة" },
    { id: 101, name: "أولاد برحيل" },
    { id: 102, name: "إغرم" },
  ],
  // Tiznit
  64: [
    { id: 103, name: "تيزنيت" },
    { id: 104, name: "أكلو" },
    { id: 105, name: "تافراوت" },
    { id: 106, name: "سيدي إفني" },
  ],
  // Guelmim
  66: [
    { id: 107, name: "كلميم" },
    { id: 108, name: "أبينو" },
    { id: 109, name: "تكانت" },
    { id: 110, name: "أسرير" },
  ],
  // Tan-Tan
  68: [
    { id: 111, name: "طانطان" },
    { id: 112, name: "الوطية" },
    { id: 113, name: "بن خليل" },
  ],
  // Laâyoune
  70: [
    { id: 114, name: "العيون" },
    { id: 115, name: "المرسى" },
    { id: 116, name: "بوكراع" },
  ],
  // Dakhla
  74: [
    { id: 117, name: "الداخلة" },
    { id: 118, name: "بئر كندوز" },
    { id: 119, name: "كليميم" },
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ prefectureId: string }> }
) {
  const { prefectureId } = await params;
  const id = parseInt(prefectureId, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid prefecture ID" }, { status: 400 });
  }

  const communes = communesByPrefecture[id] || [];
  return NextResponse.json(communes);
}
