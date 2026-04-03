const { readFileSync, writeFileSync } = require('fs');

// Read the CSV file
const csvContent = readFileSync('/vercel/share/v0-project/scripts/communes.csv', 'utf-8');
const lines = csvContent.trim().split('\n').slice(1); // Skip header

// Arabic translations for regions
const regionTranslations = {
  'Tanger-Tetouan-Al Hoceima': 'طنجة - تطوان - الحسيمة',
  "L'oriental": 'الشرق',
  'Fès-Meknès': 'فاس - مكناس',
  'Rabat-Salé-Kénitra': 'الرباط - سلا - القنيطرة',
  'Béni Mellal-Khénifra': 'بني ملال - خنيفرة',
  'Casablanca-Settat': 'الدار البيضاء - سطات',
  'Marrakech-Safi': 'مراكش - آسفي',
  'Drâa-Tafilalet': 'درعة - تافيلالت',
  'Souss-Massa': 'سوس - ماسة',
  'Guelmim-Oued Noun': 'كلميم - واد نون',
  'Laâyoune-Sakia El Hamra': 'العيون - الساقية الحمراء',
  'Dakhla-Oued Ed-Dahab': 'الداخلة - وادي الذهب',
};

// Function to transliterate French to Arabic (basic mapping)
function transliterate(text) {
  const mappings = {
    // Common Moroccan place name patterns
    'OUED': 'واد', 'OULED': 'أولاد', 'OULAD': 'أولاد', 'BNI': 'بني', 'BENI': 'بني',
    'AIT': 'آيت', 'AIN': 'عين', 'SIDI': 'سيدي', 'MOULAY': 'مولاي',
    'DAR': 'دار', 'BIR': 'بئر', 'FOUM': 'فم', 'TIZI': 'تيزي',
    'AGADIR': 'أكادير', 'RABAT': 'الرباط', 'CASABLANCA': 'الدار البيضاء',
    'FES': 'فاس', 'MEKNES': 'مكناس', 'MARRAKECH': 'مراكش',
    'TANGER': 'طنجة', 'TETOUAN': 'تطوان', 'NADOR': 'الناظور',
    'OUJDA': 'وجدة', 'KENITRA': 'القنيطرة', 'SALE': 'سلا',
    'SETTAT': 'سطات', 'EL JADIDA': 'الجديدة', 'SAFI': 'آسفي',
    'ESSAOUIRA': 'الصويرة', 'TAROUDANT': 'تارودانت',
    'TIZNIT': 'تزنيت', 'GUELMIM': 'كلميم', 'TAN-TAN': 'طانطان',
    'LAAYOUNE': 'العيون', 'DAKHLA': 'الداخلة', 'SMARA': 'السمارة',
    'BOUJDOUR': 'بوجدور', 'TARFAYA': 'طرفاية', 'AOUSSERD': 'أوسرد',
    'ERRACHIDIA': 'الراشيدية', 'OUARZAZATE': 'ورزازات',
    'ZAGORA': 'زاكورة', 'TINGHIR': 'تنغير', 'MIDELT': 'ميدلت',
    'IFRANE': 'إفران', 'AZROU': 'أزرو', 'SEFROU': 'صفرو',
    'TAZA': 'تازة', 'TAOUNATE': 'تاونات', 'GUERCIF': 'جرسيف',
    'KHEMISSET': 'الخميسات', 'SKHIRATE': 'الصخيرات', 'TEMARA': 'تمارة',
    'BERRECHID': 'برشيد', 'BENSLIMANE': 'بن سليمان', 'MOHAMMEDIA': 'المحمدية',
    'KHOURIBGA': 'خريبكة', 'BENI MELLAL': 'بني ملال', 'FQUIH BEN SALAH': 'الفقيه بن صالح',
    'AZILAL': 'أزيلال', 'CHICHAOUA': 'شيشاوة', 'EL HAOUZ': 'الحوز',
    'EL KELAA DES SRAGHNA': 'قلعة السراغنة', 'REHAMNA': 'الرحامنة', 'YOUSSOUFIA': 'اليوسفية',
    'CHTOUKA AIT BAHA': 'شتوكة آيت باها', 'INEZGANE AIT MELLOUL': 'إنزكان آيت ملول',
    'TATA': 'طاطا', 'ASSA-ZAG': 'آسا الزاك', 'SIDI IFNI': 'سيدي إفني',
    'ES-SEMARA': 'السمارة', 'OUED ED DAHAB': 'وادي الذهب',
    'AL HOCEIMA': 'الحسيمة', 'CHEFCHAOUEN': 'شفشاون', 'LARACHE': 'العرائش',
    'OUEZZANE': 'وزان', 'FAHS-ANJRA': 'الفحص أنجرة', 'M\'DIQ-FNIDEQ': 'المضيق الفنيدق',
    'BERKANE': 'بركان', 'DRIOUCH': 'الدريوش', 'FIGUIG': 'فجيج',
    'JERADA': 'جرادة', 'TAOURIRT': 'تاوريرت', 'BOULEMANE': 'بولمان',
    'EL HAJEB': 'الحاجب', 'MOULAY YACOUB': 'مولاي يعقوب',
    'SIDI KACEM': 'سيدي قاسم', 'SIDI SLIMANE': 'سيدي سليمان',
    'MEDIOUNA': 'مديونة', 'NOUACEUR': 'النواصر', 'SIDI BENNOUR': 'سيدي بنور',
  };

  // Return the mapping if exists, otherwise return the original with basic transliteration
  let result = text;
  for (const [french, arabic] of Object.entries(mappings)) {
    if (text.toUpperCase() === french) {
      return arabic;
    }
  }
  
  // Basic character transliteration for remaining names
  return text
    .replace(/OU/gi, 'و')
    .replace(/CH/gi, 'ش')
    .replace(/KH/gi, 'خ')
    .replace(/GH/gi, 'غ')
    .replace(/TH/gi, 'ث')
    .replace(/DH/gi, 'ذ')
    .replace(/SH/gi, 'ش')
    .replace(/PH/gi, 'ف')
    .replace(/QU/gi, 'ك')
    .replace(/A/gi, 'ا')
    .replace(/B/gi, 'ب')
    .replace(/C/gi, 'ك')
    .replace(/D/gi, 'د')
    .replace(/E/gi, 'ي')
    .replace(/F/gi, 'ف')
    .replace(/G/gi, 'ج')
    .replace(/H/gi, 'ه')
    .replace(/I/gi, 'ي')
    .replace(/J/gi, 'ج')
    .replace(/K/gi, 'ك')
    .replace(/L/gi, 'ل')
    .replace(/M/gi, 'م')
    .replace(/N/gi, 'ن')
    .replace(/O/gi, 'و')
    .replace(/P/gi, 'ب')
    .replace(/Q/gi, 'ق')
    .replace(/R/gi, 'ر')
    .replace(/S/gi, 'س')
    .replace(/T/gi, 'ت')
    .replace(/U/gi, 'و')
    .replace(/V/gi, 'ف')
    .replace(/W/gi, 'و')
    .replace(/X/gi, 'كس')
    .replace(/Y/gi, 'ي')
    .replace(/Z/gi, 'ز')
    .replace(/'/g, '')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Parse CSV and extract unique regions, prefectures, communes
const regions = new Map();
const prefectures = new Map();
const communes = [];

for (const line of lines) {
  const parts = line.split(',');
  if (parts.length < 3) continue;
  
  const [regionName, prefectureName, communeName] = parts.map(p => p.trim());
  
  // Add region
  if (!regions.has(regionName)) {
    regions.set(regionName, {
      id: regions.size + 1,
      name: regionTranslations[regionName] || transliterate(regionName),
    });
  }
  
  // Add prefecture
  const prefKey = `${regionName}|${prefectureName}`;
  if (!prefectures.has(prefKey)) {
    prefectures.set(prefKey, {
      id: prefectures.size + 1,
      name: transliterate(prefectureName),
      regionId: regions.get(regionName).id,
    });
  }
  
  // Add commune
  communes.push({
    name: transliterate(communeName),
    prefectureId: prefectures.get(prefKey).id,
  });
}

// Generate SQL
let sql = `-- ============================================================
-- Complete Moroccan Regions, Prefectures, and Communes (Arabic)
-- Generated from CSV file
-- Total: ${regions.size} regions, ${prefectures.size} prefectures, ${communes.length} communes
-- ============================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ============================================================
-- CLEAR OLD DATA
-- ============================================================
UPDATE institutions SET commune_id = NULL WHERE commune_id IS NOT NULL;
DELETE FROM communes;
DELETE FROM prefectures;
DELETE FROM regions;

-- ============================================================
-- REGIONS (${regions.size})
-- ============================================================
INSERT INTO regions (id, name) VALUES
`;

sql += Array.from(regions.values())
  .map(r => `(${r.id}, '${r.name}')`)
  .join(',\n') + ';\n\n';

sql += `-- ============================================================
-- PREFECTURES (${prefectures.size})
-- ============================================================
INSERT INTO prefectures (id, name, region_id) VALUES
`;

sql += Array.from(prefectures.values())
  .map(p => `(${p.id}, '${p.name}', ${p.regionId})`)
  .join(',\n') + ';\n\n';

sql += `-- ============================================================
-- COMMUNES (${communes.length})
-- ============================================================
INSERT INTO communes (name, prefecture_id) VALUES
`;

sql += communes
  .map(c => `('${c.name}', ${c.prefectureId})`)
  .join(',\n') + ';\n';

writeFileSync('/vercel/share/v0-project/scripts/complete-locations-from-csv.sql', sql, 'utf-8');
console.log(`Generated SQL with ${regions.size} regions, ${prefectures.size} prefectures, ${communes.length} communes`);
