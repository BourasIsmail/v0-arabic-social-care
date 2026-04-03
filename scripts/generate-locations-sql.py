#!/usr/bin/env python3
"""
Script to generate SQL migration for Morocco regions, prefectures, and communes
from the communes CSV file.
"""

import csv
import sys

# Arabic translations for regions
REGION_TRANSLATIONS = {
    "Tanger-Tetouan-Al Hoceima": "طنجة-تطوان-الحسيمة",
    "L'oriental": "الشرق",
    "Fès-Meknès": "فاس-مكناس",
    "Rabat-Salé-Kénitra": "الرباط-سلا-القنيطرة",
    "Béni Mellal-Khénifra": "بني ملال-خنيفرة",
    "Casablanca-Settat": "الدار البيضاء-سطات",
    "Marrakech-Safi": "مراكش-آسفي",
    "Drâa-Tafilalet": "درعة-تافيلالت",
    "Souss-Massa": "سوس-ماسة",
    "Guelmim-Oued Noun": "كلميم-واد نون",
    "Laâyoune-Sakia El Hamra": "العيون-الساقية الحمراء",
    "Dakhla-Oued Ed-Dahab": "الداخلة-وادي الذهب",
}

# Arabic translations for prefectures
PREFECTURE_TRANSLATIONS = {
    "AL HOCEIMA": "الحسيمة",
    "TANGER-ASSILAH": "طنجة-أصيلة",
    "TETOUAN": "تطوان",
    "LARACHE": "العرائش",
    "CHEFCHAOUE": "شفشاون",
    "FAHS-ANJARA": "الفحص-أنجرة",
    "M'DIQ - FNIDQ": "المضيق-الفنيدق",
    "OUEZZANE": "وزان",
    "OUJDA-ANGAD": "وجدة-أنكاد",
    "JERADA": "جرادة",
    "BERKANE": "بركان",
    "TAOURIRT": "تاوريرت",
    "FIGUIG": "فجيج",
    "NADOR": "الناظور",
    "GUERCIF": "جرسيف",
    "DRIOUCH": "الدريوش",
    "TAZA": "تازة",
    "TAOUNATE": "تاونات",
    "SEFROU": "صفرو",
    "BOULEMANE": "بولمان",
    "EL HAJEB": "الحاجب",
    "IFRANE": "إفران",
    "FES": "فاس",
    "MOULAY YACOUB": "مولاي يعقوب",
    "MEKNES": "مكناس",
    "RABAT": "الرباط",
    "SKHIRATE-TEMARA": "الصخيرات-تمارة",
    "KHEMISSET": "الخميسات",
    "KENITRA": "القنيطرة",
    "SIDI KACEM": "سيدي قاسم",
    "SALE": "سلا",
    "SIDI SLIMANE": "سيدي سليمان",
    "BENI MELLAL": "بني ملال",
    "AZILAL": "أزيلال",
    "KHENIFRA": "خنيفرة",
    "KHOURIBGA": "خريبكة",
    "FQUIH BEN SALAH": "الفقيه بن صالح",
    "MOHAMMADIA": "المحمدية",
    "EL JADIDA": "الجديدة",
    "SETTAT": "سطات",
    "BENSLIMANE": "بنسليمان",
    "CASABLANCA": "الدار البيضاء",
    "HAY HASSANI": "الحي الحسني",
    "AIN CHOCK": "عين الشق",
    "SIDI BERNOUSSI": "سيدي البرنوصي",
    "BEN M'SICK": "بن مسيك",
    "MOULAY RACHID": "مولاي رشيد",
    "NOUACEUR": "النواصر",
    "MEDIOUNA": "مديونة",
    "CASABLANCA ANFA": "الدار البيضاء أنفا",
    "AL FIDA MERS SULTA": "الفداء مرس السلطان",
    "AIN SEBAA HAY MOHAMMADI": "عين السبع الحي المحمدي",
    "SIDI BENNOUR": "سيدي بنور",
    "BERRECHID": "برشيد",
    "CHICHAOUA": "شيشاوة",
    "AL HAOUZ": "الحوز",
    "EL KELAA DES SRAGHNA": "قلعة السراغنة",
    "ESSAOUIRA": "الصويرة",
    "SAFI": "آسفي",
    "MARRAKECH": "مراكش",
    "REHAMNA": "الرحامنة",
    "YOUSSOUFIA": "اليوسفية",
    "OUARZAZATE": "ورزازات",
    "ZAGORA": "زاكورة",
    "ERRACHIDIA": "الرشيدية",
    "TINGHIR": "تنغير",
    "MIDELT": "ميدلت",
    "AGADIR IDA OUTANANE": "أكادير إداوتنان",
    "INEZGANE-AIT MELLOUL": "إنزكان-آيت ملول",
    "CHTOUKA-AIT BAHA": "اشتوكة آيت باها",
    "TAROUDANNT": "تارودانت",
    "TIZNIT": "تيزنيت",
    "TATA": "طاطا",
    "GUELMIM": "كلميم",
    "ASSA-ZAG": "آسا-الزاك",
    "TAN-TA": "طانطان",
    "SIDI IFNI": "سيدي إفني",
    "ES-SEMARA": "السمارة",
    "LAAYOUNE": "العيون",
    "BOUJDOUR": "بوجدور",
    "TARFAYA": "طرفاية",
    "OUED ED DAHAB": "وادي الذهب",
    "AOUSSERD": "أوسرد",
}

def escape_sql(s):
    """Escape single quotes for SQL"""
    return s.replace("'", "''")

def transliterate_commune(name):
    """Basic transliteration of commune name to Arabic"""
    # This is a simplified transliteration - for production use proper Arabic names
    # Common patterns
    replacements = {
        "AIT ": "آيت ",
        "BNI ": "بني ",
        "SIDI ": "سيدي ",
        "OULED ": "أولاد ",
        "OULAD ": "أولاد ",
        "EL ": "ال",
        "AL ": "ال",
        "AIN ": "عين ",
        "OUED ": "واد ",
        "DAR ": "دار ",
        "ZAOUIA": "زاوية",
        "MOULAY ": "مولاي ",
    }
    
    result = name
    for en, ar in replacements.items():
        if result.startswith(en):
            result = ar + result[len(en):]
    
    return result

def main():
    # Read CSV data
    csv_file = "communes.csv"
    
    # Parse data
    regions = {}  # name -> id
    prefectures = {}  # name -> (id, region_id)
    communes = []  # [(name, prefecture_id)]
    
    region_id = 0
    prefecture_id = 0
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            region_name = row['Region']
            prefecture_name = row['Province']
            commune_name = row['Commune']
            
            # Add region if new
            if region_name not in regions:
                region_id += 1
                regions[region_name] = region_id
            
            # Add prefecture if new
            if prefecture_name not in prefectures:
                prefecture_id += 1
                prefectures[prefecture_name] = (prefecture_id, regions[region_name])
            
            # Add commune
            communes.append((commune_name, prefectures[prefecture_name][0]))
    
    # Generate SQL
    print("-- ============================================")
    print("-- Complete Migration Script for Morocco Locations")
    print("-- Generated automatically from CSV data")
    print("-- ============================================")
    print()
    print("SET FOREIGN_KEY_CHECKS = 0;")
    print("TRUNCATE TABLE communes;")
    print("TRUNCATE TABLE prefectures;")
    print("TRUNCATE TABLE regions;")
    print("SET FOREIGN_KEY_CHECKS = 1;")
    print()
    
    # Regions
    print("-- REGIONS")
    print("INSERT INTO regions (id, name, name_ar) VALUES")
    region_values = []
    for name, rid in sorted(regions.items(), key=lambda x: x[1]):
        ar_name = REGION_TRANSLATIONS.get(name, name)
        region_values.append(f"({rid}, '{escape_sql(name)}', '{escape_sql(ar_name)}')")
    print(",\n".join(region_values) + ";")
    print()
    
    # Prefectures
    print("-- PREFECTURES")
    print("INSERT INTO prefectures (id, name, name_ar, region_id) VALUES")
    pref_values = []
    for name, (pid, rid) in sorted(prefectures.items(), key=lambda x: x[1][0]):
        ar_name = PREFECTURE_TRANSLATIONS.get(name, name)
        pref_values.append(f"({pid}, '{escape_sql(name)}', '{escape_sql(ar_name)}', {rid})")
    print(",\n".join(pref_values) + ";")
    print()
    
    # Communes - batch insert
    print("-- COMMUNES")
    batch_size = 100
    for i in range(0, len(communes), batch_size):
        batch = communes[i:i+batch_size]
        print(f"INSERT INTO communes (name, name_ar, prefecture_id) VALUES")
        commune_values = []
        for name, pid in batch:
            ar_name = transliterate_commune(name)
            commune_values.append(f"('{escape_sql(name)}', '{escape_sql(ar_name)}', {pid})")
        print(",\n".join(commune_values) + ";")
        print()

if __name__ == "__main__":
    main()
