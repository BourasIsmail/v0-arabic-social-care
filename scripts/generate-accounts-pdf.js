const PDFDocument = require('pdfkit');
const fs = require('fs');

// Create a new PDF document
const doc = new PDFDocument({ 
  size: 'A4', 
  margin: 50,
  info: {
    Title: 'Prefecture Accounts - Entraide Nationale',
    Author: 'Entraide Nationale'
  }
});

// Pipe the PDF to a file
doc.pipe(fs.createWriteStream('/vercel/share/v0-project/scripts/prefecture-accounts.pdf'));

// Define regions and their prefectures
const regions = [
  {
    id: 1,
    name: 'طنجة - تطوان - الحسيمة',
    nameFr: 'Tanger-Tétouan-Al Hoceïma',
    prefectures: [
      { id: 1, name: 'طنجة أصيلة', email: 'tanger-assilah@entraide.ma' },
      { id: 2, name: 'المضيق الفنيدق', email: 'mdiq-fnideq@entraide.ma' },
      { id: 3, name: 'تطوان', email: 'tetouan@entraide.ma' },
      { id: 4, name: 'الفحص أنجرة', email: 'fahs-anjra@entraide.ma' },
      { id: 5, name: 'العرائش', email: 'larache@entraide.ma' },
      { id: 6, name: 'الحسيمة', email: 'al-hoceima@entraide.ma' },
      { id: 7, name: 'شفشاون', email: 'chefchaouen@entraide.ma' },
      { id: 8, name: 'وزان', email: 'ouezzane@entraide.ma' },
    ]
  },
  {
    id: 2,
    name: 'الشرق',
    nameFr: 'L\'Oriental',
    prefectures: [
      { id: 9, name: 'وجدة أنكاد', email: 'oujda-angad@entraide.ma' },
      { id: 10, name: 'الناظور', email: 'nador@entraide.ma' },
      { id: 11, name: 'الدريوش', email: 'driouch@entraide.ma' },
      { id: 12, name: 'جرادة', email: 'jerada@entraide.ma' },
      { id: 13, name: 'بركان', email: 'berkane@entraide.ma' },
      { id: 14, name: 'تاوريرت', email: 'taourirt@entraide.ma' },
      { id: 15, name: 'كرسيف', email: 'guercif@entraide.ma' },
      { id: 16, name: 'فكيك', email: 'figuig@entraide.ma' },
    ]
  },
  {
    id: 3,
    name: 'فاس - مكناس',
    nameFr: 'Fès-Meknès',
    prefectures: [
      { id: 17, name: 'فاس', email: 'fes@entraide.ma' },
      { id: 18, name: 'مكناس', email: 'meknes@entraide.ma' },
      { id: 19, name: 'الحاجب', email: 'el-hajeb@entraide.ma' },
      { id: 20, name: 'إفران', email: 'ifrane@entraide.ma' },
      { id: 21, name: 'مولاي يعقوب', email: 'moulay-yacoub@entraide.ma' },
      { id: 22, name: 'صفرو', email: 'sefrou@entraide.ma' },
      { id: 23, name: 'بولمان', email: 'boulemane@entraide.ma' },
      { id: 24, name: 'تاونات', email: 'taounate@entraide.ma' },
      { id: 25, name: 'تازة', email: 'taza@entraide.ma' },
    ]
  },
  {
    id: 4,
    name: 'الرباط - سلا - القنيطرة',
    nameFr: 'Rabat-Salé-Kénitra',
    prefectures: [
      { id: 26, name: 'الرباط', email: 'rabat@entraide.ma' },
      { id: 27, name: 'سلا', email: 'sale@entraide.ma' },
      { id: 28, name: 'الصخيرات تمارة', email: 'skhirat-temara@entraide.ma' },
      { id: 29, name: 'القنيطرة', email: 'kenitra@entraide.ma' },
      { id: 30, name: 'الخميسات', email: 'khemisset@entraide.ma' },
      { id: 31, name: 'سيدي قاسم', email: 'sidi-kacem@entraide.ma' },
      { id: 32, name: 'سيدي سليمان', email: 'sidi-slimane@entraide.ma' },
    ]
  },
  {
    id: 5,
    name: 'بني ملال - خنيفرة',
    nameFr: 'Béni Mellal-Khénifra',
    prefectures: [
      { id: 33, name: 'بني ملال', email: 'beni-mellal@entraide.ma' },
      { id: 34, name: 'أزيلال', email: 'azilal@entraide.ma' },
      { id: 35, name: 'الفقيه بن صالح', email: 'fquih-ben-salah@entraide.ma' },
      { id: 36, name: 'خنيفرة', email: 'khenifra@entraide.ma' },
      { id: 37, name: 'خريبكة', email: 'khouribga@entraide.ma' },
    ]
  },
  {
    id: 6,
    name: 'الدار البيضاء - سطات',
    nameFr: 'Casablanca-Settat',
    prefectures: [
      { id: 38, name: 'الدار البيضاء', email: 'casablanca@entraide.ma' },
      { id: 39, name: 'المحمدية', email: 'mohammedia@entraide.ma' },
      { id: 40, name: 'النواصر', email: 'nouaceur@entraide.ma' },
      { id: 41, name: 'مديونة', email: 'mediouna@entraide.ma' },
      { id: 42, name: 'بنسليمان', email: 'benslimane@entraide.ma' },
      { id: 43, name: 'برشيد', email: 'berrechid@entraide.ma' },
      { id: 44, name: 'سطات', email: 'settat@entraide.ma' },
      { id: 45, name: 'سيدي بنور', email: 'sidi-bennour@entraide.ma' },
      { id: 46, name: 'الجديدة', email: 'el-jadida@entraide.ma' },
    ]
  },
  {
    id: 7,
    name: 'مراكش - آسفي',
    nameFr: 'Marrakech-Safi',
    prefectures: [
      { id: 47, name: 'مراكش', email: 'marrakech@entraide.ma' },
      { id: 48, name: 'الحوز', email: 'al-haouz@entraide.ma' },
      { id: 49, name: 'قلعة السراغنة', email: 'kelaa-sraghna@entraide.ma' },
      { id: 50, name: 'الرحامنة', email: 'rehamna@entraide.ma' },
      { id: 51, name: 'شيشاوة', email: 'chichaoua@entraide.ma' },
      { id: 52, name: 'آسفي', email: 'safi@entraide.ma' },
      { id: 53, name: 'اليوسفية', email: 'youssoufia@entraide.ma' },
      { id: 54, name: 'الصويرة', email: 'essaouira@entraide.ma' },
    ]
  },
  {
    id: 8,
    name: 'درعة - تافيلالت',
    nameFr: 'Drâa-Tafilalet',
    prefectures: [
      { id: 55, name: 'ورزازات', email: 'ouarzazate@entraide.ma' },
      { id: 56, name: 'تنغير', email: 'tinghir@entraide.ma' },
      { id: 57, name: 'زاكورة', email: 'zagora@entraide.ma' },
      { id: 58, name: 'الرشيدية', email: 'errachidia@entraide.ma' },
      { id: 59, name: 'ميدلت', email: 'midelt@entraide.ma' },
    ]
  },
  {
    id: 9,
    name: 'سوس - ماسة',
    nameFr: 'Souss-Massa',
    prefectures: [
      { id: 60, name: 'أكادير إداوتانان', email: 'agadir-ida-outanane@entraide.ma' },
      { id: 61, name: 'إنزكان آيت ملول', email: 'inezgane-ait-melloul@entraide.ma' },
      { id: 62, name: 'شتوكة آيت باها', email: 'chtouka-ait-baha@entraide.ma' },
      { id: 63, name: 'تارودانت', email: 'taroudannt@entraide.ma' },
      { id: 64, name: 'تيزنيت', email: 'tiznit@entraide.ma' },
      { id: 65, name: 'طاطا', email: 'tata@entraide.ma' },
    ]
  },
  {
    id: 10,
    name: 'كلميم - واد نون',
    nameFr: 'Guelmim-Oued Noun',
    prefectures: [
      { id: 66, name: 'كلميم', email: 'guelmim@entraide.ma' },
      { id: 67, name: 'أسا الزاك', email: 'assa-zag@entraide.ma' },
      { id: 68, name: 'طانطان', email: 'tan-tan@entraide.ma' },
      { id: 69, name: 'سيدي إفني', email: 'sidi-ifni@entraide.ma' },
    ]
  },
  {
    id: 11,
    name: 'العيون - الساقية الحمراء',
    nameFr: 'Laâyoune-Sakia El Hamra',
    prefectures: [
      { id: 70, name: 'السمارة', email: 'es-semara@entraide.ma' },
      { id: 71, name: 'العيون', email: 'laayoune@entraide.ma' },
      { id: 72, name: 'بوجدور', email: 'boujdour@entraide.ma' },
      { id: 73, name: 'طرفاية', email: 'tarfaya@entraide.ma' },
    ]
  },
  {
    id: 12,
    name: 'الداخلة - وادي الذهب',
    nameFr: 'Dakhla-Oued Ed-Dahab',
    prefectures: [
      { id: 74, name: 'وادي الذهب', email: 'oued-ed-dahab@entraide.ma' },
      { id: 75, name: 'أوسرد', email: 'aousserd@entraide.ma' },
    ]
  }
];

const password = 'Entraide2026';

// Register Arabic font
doc.registerFont('Arabic', '/vercel/share/v0-project/public/fonts/NotoSansArabic-Regular.ttf');

// Title
doc.fontSize(20)
   .font('Helvetica-Bold')
   .text('Prefecture Accounts - Entraide Nationale', { align: 'center' });

doc.moveDown(0.5);
doc.fontSize(12)
   .font('Helvetica')
   .text('Comptes des Préfectures - Entraide Nationale', { align: 'center' });

doc.moveDown(1);
doc.fontSize(10)
   .fillColor('#666')
   .text(`Generated: ${new Date().toLocaleDateString('fr-FR')}`, { align: 'center' });

doc.moveDown(1);
doc.fillColor('#000');

// Password info box
doc.rect(50, doc.y, 495, 40)
   .fill('#f0f0f0');

doc.fillColor('#000')
   .fontSize(11)
   .font('Helvetica-Bold')
   .text('Password / Mot de passe: ', 60, doc.y - 30, { continued: true })
   .font('Helvetica')
   .text(password);

doc.moveDown(2);

// Loop through regions
regions.forEach((region, regionIndex) => {
  // Check if we need a new page
  if (doc.y > 680) {
    doc.addPage();
  }

  // Region header
  doc.rect(50, doc.y, 495, 30)
     .fill('#2c5282');

  doc.fillColor('#fff')
     .fontSize(12)
     .font('Helvetica-Bold')
     .text(`${region.nameFr}`, 60, doc.y - 22);

  doc.moveDown(1.5);
  doc.fillColor('#000');

  // Table header
  const tableTop = doc.y;
  doc.rect(50, tableTop, 495, 20)
     .fill('#e2e8f0');

  doc.fillColor('#000')
     .fontSize(9)
     .font('Helvetica-Bold')
     .text('ID', 55, tableTop + 5, { width: 30 })
     .text('Prefecture / العمالة', 90, tableTop + 5, { width: 180 })
     .text('Email', 280, tableTop + 5, { width: 220 });

  doc.moveDown(0.8);

  // Prefecture rows
  region.prefectures.forEach((prefecture, index) => {
    const rowY = doc.y;
    
    // Alternate row colors
    if (index % 2 === 0) {
      doc.rect(50, rowY - 2, 495, 18).fill('#f8fafc');
    }

    doc.fillColor('#000')
       .fontSize(9)
       .font('Helvetica')
       .text(prefecture.id.toString(), 55, rowY, { width: 30 })
       .text(prefecture.name, 90, rowY, { width: 180, features: ['rtla'] })
       .text(prefecture.email, 280, rowY, { width: 220 });

    doc.moveDown(0.7);
  });

  doc.moveDown(1);
});

// Footer on last page
doc.fontSize(8)
   .fillColor('#666')
   .text('Confidential - Entraide Nationale', 50, 780, { align: 'center' });

// Finalize the PDF
doc.end();

console.log('PDF generated: /vercel/share/v0-project/scripts/prefecture-accounts.pdf');
