import type { InstitutionResponse } from "@/lib/types";

// Helper function to get display value
function getDisplayValue(value: any, defaultValue: string = '—'): string {
  if (value === undefined || value === null || value === '') return defaultValue;
  return String(value);
}

// Helper function for checkbox
function getCheckbox(value: boolean | undefined): string {
  return value ? '☑' : '☐';
}

// Labels mapping in Arabic based on the official form
const labels = {
  institutionType: {
    DAR_TALIB: 'دار الطالب',
    DAR_TALIBA: 'دار الطالبة',
    DAR_TALIB_TALIBA: 'دار الطالب والطالبة',
    DAR_ATFAL: 'دار الأطفال',
  } as Record<string, string>,
  milieu: {
    URBAIN: 'حضري',
    URBAN: 'حضري',
    RURAL: 'قروي',
    SEMI_URBAN: 'شبه حضري',
  } as Record<string, string>,
  legalStatus: {
    LICENSED: 'مرخصة',
    UNLICENSED: 'غير مرخصة',
    IN_PROGRESS: 'في طور الترخيص',
  } as Record<string, string>,
  distance: {
    INSIDE: 'داخل المؤسسة التعليمية',
    LESS_THAN_1KM: 'أقل من 1 كلم',
    LT_1KM: 'أقل من 1 كلم',
    BETWEEN_1_5KM: 'بين 1 و 5 كلم',
    BETWEEN_5_10KM: 'بين 5 و 10 كلم',
    GT_5KM: 'أكثر من 5 كلم',
    MORE_THAN_10KM: 'أكثر من 10 كلم',
  } as Record<string, string>,
  buildingStatus: {
    RENTAL: 'إيجار',
    OWNED: 'ملكية',
    AT_DISPOSAL: 'وضع رهن إشارة المؤسسة',
    LENT: 'معار',
    OTHER: 'آخر',
  } as Record<string, string>,
  buildingCondition: {
    GOOD: 'جيدة',
    AVERAGE: 'بعض علامات التدهور',
    SOME_DEGRADATION: 'بعض علامات التدهور',
    POOR: 'متردية',
    BAD: 'متردية',
  } as Record<string, string>,
  renovationCapability: {
    EASY: 'سهلة',
    DIFFICULT: 'صعبة',
    REBUILD: 'تتطلب إعادة البناء',
  } as Record<string, string>,
  landOwnership: {
    STATE: 'أملاك الدولة',
    COLLECTIVE: 'ملك جماعي',
    PRIVATE: 'ملك خصوصي',
    OTHER: 'آخر',
  } as Record<string, string>,
  staffType: {
    DIRECTOR: 'المدير(ة)',
    FINANCIAL_MANAGER: 'المسؤول المالي',
    GENERAL_GUARD: 'حارس عام',
    SOCIAL_WORKER: 'مساعد اجتماعي',
    DOCTOR: 'طبيب',
    NURSE: 'ممرض',
    PSYCHOLOGIST: 'أخصائي نفسي',
    EDUCATORS: 'المربون',
    KITCHEN_MANAGER: 'مسؤول عن المطبخ',
    KITCHEN_AGENTS: 'أعوان المطبخ',
    STORAGE_MANAGER: 'مسؤول عن المخزن',
    SECURITY: 'الحراسة',
    SERVICE_AGENTS: 'أعوان الخدمة',
    SUPERVISOR: 'مشرف',
    COOK: 'طباخ',
    GUARD: 'حارس',
    CLEANER: 'عامل نظافة',
    OTHER: 'آخر',
  } as Record<string, string>,
  fundingSource: {
    MINISTRY_SOLIDARITY: 'وزارة التضامن والإدماج الاجتماعي والأسرة',
    ENTRAIDE_NATIONALE: 'التعاون الوطني',
    INDH: 'المبادرة الوطنية للتنمية البشرية',
    COMMUNE: 'الجماعة',
    MOHAMMED_V_FOUNDATION: 'مؤسسة محمد الخامس للتضامن',
    NATIONAL_PROMOTION: 'الإنعاش الوطني',
    ASSOCIATION: 'الجمعية/مؤسسة',
    EDUCATION_SECTOR: 'قطاع التربية الوطنية',
    PARENTS: 'اشتراكات الآباء',
    DONORS: 'المحسنون (هبات وغيرها)',
    SELF_FUNDING: 'مصادر ذاتية للجمعية المسيرة',
    OTHER: 'آخر',
  } as Record<string, string>,
  mealType: {
    IN_HOUSE: 'إعداد الوجبات في مطبخ المؤسسة',
    READY_MEALS: 'وجبات جاهزة',
    OTHER: 'آخر',
  } as Record<string, string>,
  priorityCriteria: {
    socialSituation: 'الوضعية الاجتماعية للأسرة',
    distance: 'المسافة بين المدرسة ومحل سكن المستفيد',
    schoolResults: 'النتائج المدرسية للمستفيد',
    scholarship: 'الاستفادة من المنحة الدراسية',
    other: 'آخر',
  } as Record<string, string>,
};

function getLabelValue(category: keyof typeof labels, value: string | undefined): string {
  if (!value) return '—';
  const categoryLabels = labels[category];
  return categoryLabels[value] || value;
}

export function generatePrintableHTML(data: InstitutionResponse, logoBase64?: string): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString('ar-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Build staff table rows
  const staffRows = (data.staffMembers || []).map((staff: any) => `
    <tr>
      <td>${getLabelValue('staffType', staff.staffType || staff.position)}</td>
      <td>${getDisplayValue(staff.nbAssociation || staff.count || 1, '—')}</td>
      <td>${getDisplayValue(staff.nbDeployed || 0, '—')}</td>
      <td>${getDisplayValue(staff.nbVolunteers || 0, '—')}</td>
      <td>${getDisplayValue(staff.nbCNSS || 0, '—')}</td>
      <td>${getDisplayValue(staff.nbSMIG || 0, '—')}</td>
      <td>${getDisplayValue(staff.monthlyCost || 0, '—')}</td>
      <td>${getDisplayValue(staff.annualCost || 0, '—')}</td>
    </tr>
  `).join('');

  // Logo URL - use base64 if provided, otherwise use relative path
  const logoUrl = logoBase64 || '/images/header-logos.png';

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>استمارة تشخيص المؤسسة - ${getDisplayValue(data.institutionName, 'مؤسسة')}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Noto Sans Arabic', 'Segoe UI', sans-serif;
          direction: rtl;
          text-align: right;
          color: #333;
          padding: 0;
          font-size: 11px;
          line-height: 1.5;
          background: #f5f5f5;
        }
        .print-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
          color: white;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          z-index: 9999;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .print-bar button {
          background: white;
          color: #1e3a5f;
          border: none;
          padding: 10px 28px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .print-bar button:hover { 
          background: #e8f4f8;
          transform: translateY(-1px);
        }
        .content { 
          margin-top: 70px; 
          padding: 20px;
          max-width: 210mm;
          margin-left: auto;
          margin-right: auto;
          background: white;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .page {
          background: white;
          padding: 10mm;
        }
        .logos-header {
          text-align: center;
          padding: 10px 0;
          border-bottom: 3px solid #c9a227;
          margin-bottom: 15px;
        }
        .logos-header img {
          max-width: 100%;
          height: auto;
          max-height: 80px;
          object-fit: contain;
        }
        .header {
          text-align: center;
          padding: 15px 0;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 8px;
          border: 2px solid #1e3a5f;
        }
        .header h1 {
          font-size: 18px;
          color: #1e3a5f;
          margin-bottom: 8px;
          font-weight: 700;
        }
        .header h2 {
          font-size: 14px;
          color: #495057;
          font-weight: 600;
        }
        .header .date {
          font-size: 11px;
          color: #6c757d;
          margin-top: 8px;
        }
        .section {
          margin-bottom: 15px;
          break-inside: avoid;
        }
        .section-title {
          background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
          color: white;
          padding: 8px 14px;
          border-radius: 5px 5px 0 0;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .section-number {
          background: #c9a227;
          color: #1e3a5f;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 11px;
        }
        .fields-container {
          border: 1px solid #dee2e6;
          border-top: none;
          border-radius: 0 0 5px 5px;
          overflow: hidden;
        }
        .field-row {
          display: flex;
          border-bottom: 1px solid #dee2e6;
          min-height: 30px;
        }
        .field-row:last-child {
          border-bottom: none;
        }
        .field-label {
          background: #f8f9fa;
          padding: 5px 10px;
          font-weight: 600;
          color: #495057;
          width: 40%;
          border-left: 1px solid #dee2e6;
          display: flex;
          align-items: center;
          font-size: 10px;
        }
        .field-value {
          padding: 5px 10px;
          width: 60%;
          display: flex;
          align-items: center;
          color: #212529;
          font-size: 10px;
          background: white;
        }
        .checkbox-group {
          padding: 8px 10px;
          background: white;
        }
        .checkbox-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
        }
        .checkbox-item .check {
          font-size: 13px;
          color: #1e3a5f;
        }
        .sub-section {
          background: #e9ecef;
          padding: 5px 10px;
          font-weight: 600;
          color: #1e3a5f;
          border-bottom: 1px solid #dee2e6;
          font-size: 10px;
        }
        .stats-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9px;
        }
        .stats-table th {
          background: #1e3a5f;
          color: white;
          padding: 6px 4px;
          text-align: center;
          font-weight: 600;
          font-size: 8px;
        }
        .stats-table td {
          padding: 4px;
          border: 1px solid #dee2e6;
          text-align: center;
          font-size: 9px;
        }
        .stats-table tr:nth-child(even) {
          background: #f8f9fa;
        }
        .two-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .signature-section {
          margin-top: 25px;
          page-break-inside: avoid;
        }
        .main-signature {
          text-align: center;
          margin-bottom: 20px;
        }
        .main-signature h4 {
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 8px;
          color: #1e3a5f;
        }
        .main-signature-box {
          border: 2px solid #1e3a5f;
          border-radius: 8px;
          height: 80px;
          max-width: 400px;
          margin: 0 auto;
          background: #fafafa;
        }
        .visa-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 15px;
        }
        .visa-box {
          border: 2px solid #1e3a5f;
          border-radius: 5px;
          text-align: center;
          overflow: hidden;
        }
        .visa-box h4 {
          padding: 6px 4px;
          font-size: 9px;
          font-weight: 700;
          color: white;
          background: #1e3a5f;
        }
        .visa-box .visa-space {
          height: 80px;
          background: #fafafa;
        }
        .footer {
          text-align: center;
          margin-top: 15px;
          padding-top: 10px;
          border-top: 2px solid #c9a227;
          font-size: 9px;
          color: #6c757d;
        }
        @media print {
          .print-bar { display: none !important; }
          .content { 
            margin-top: 0; 
            padding: 0;
            box-shadow: none;
            max-width: none;
          }
          body { 
            padding: 0; 
            background: white;
            font-size: 10px;
          }
          @page { 
            margin: 8mm; 
            size: A4; 
          }
          .page {
            padding: 0;
          }
          .section {
            break-inside: avoid;
          }
          .signature-section {
            break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-bar">
        <span>معاينة استمارة التشخيص</span>
        <button onclick="window.print()">طباعة / حفظ PDF</button>
        <button onclick="window.close()">إغلاق</button>
      </div>
      <div class="content">
        <div class="page">
          <!-- Official Logos Header -->
          <div class="logos-header">
            <img src="${logoUrl}" alt="الشعارات الرسمية" onerror="this.style.display='none'" />
          </div>

          <!-- Title Header -->
          <div class="header">
            <h1>تشخيص مؤسسات الرعاية الاجتماعية التي تتكفل بالأطفال المتمدرسين</h1>
            <h2>(دور الطالب والطالبة)</h2>
            <div class="date">التاريخ: ${dateStr}</div>
          </div>

          <!-- Section I: معطيات حول المؤسسة -->
          <div class="section">
            <div class="section-title">
              <span class="section-number">I</span>
              معطيات حول المؤسسة
            </div>
            <div class="fields-container">
              <div class="field-row">
                <div class="field-label">نوعية المؤسسة</div>
                <div class="field-value">
                  <div class="checkbox-row">
                    <span class="checkbox-item"><span class="check">${data.institutionType === 'DAR_TALIB' ? '☑' : '☐'}</span> دار الطالب</span>
                    <span class="checkbox-item"><span class="check">${data.institutionType === 'DAR_TALIBA' ? '☑' : '☐'}</span> دار الطالبة</span>
                    <span class="checkbox-item"><span class="check">${data.institutionType === 'DAR_TALIB_TALIBA' ? '☑' : '☐'}</span> دار الطالب والطالبة</span>
                  </div>
                </div>
              </div>
              <div class="field-row">
                <div class="field-label">اسم الجمعية المشرفة</div>
                <div class="field-value">${getDisplayValue(data.associationName)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">اسم المؤسسة</div>
                <div class="field-value">${getDisplayValue(data.institutionName)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">العنوان</div>
                <div class="field-value">${getDisplayValue(data.address)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">الجهة</div>
                <div class="field-value">${getDisplayValue(data.regionName)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">العمالة أو الإقليم</div>
                <div class="field-value">${getDisplayValue(data.prefectureName)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">الجماعة</div>
                <div class="field-value">${getDisplayValue(data.communeName)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">المجال</div>
                <div class="field-value">
                  <div class="checkbox-row">
                    <span class="checkbox-item"><span class="check">${data.milieu === 'RURAL' ? '☑' : '☐'}</span> قروي</span>
                    <span class="checkbox-item"><span class="check">${data.milieu === 'URBAN' || data.milieu === 'URBAIN' ? '☑' : '☐'}</span> حضري</span>
                  </div>
                </div>
              </div>
              <div class="field-row">
                <div class="field-label">سنة إحداث المؤسسة</div>
                <div class="field-value">${getDisplayValue(data.creationYear)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">الوضعية القانونية للمؤسسة</div>
                <div class="field-value">
                  <div class="checkbox-row">
                    <span class="checkbox-item"><span class="check">${data.legalStatus === 'LICENSED' ? '☑' : '☐'}</span> مرخصة</span>
                    <span class="checkbox-item"><span class="check">${data.legalStatus === 'UNLICENSED' ? '☑' : '☐'}</span> غير مرخصة</span>
                  </div>
                </div>
              </div>
              ${data.legalStatus === 'LICENSED' ? `
              <div class="field-row">
                <div class="field-label">رقم وتاريخ الرخصة</div>
                <div class="field-value">${getDisplayValue(data.licenseNumber)}</div>
              </div>
              ` : ''}
              <div class="field-row">
                <div class="field-label">تاريخ شروع المؤسسة في تقديم خدماتها</div>
                <div class="field-value">${getDisplayValue(data.serviceStartDate)}</div>
              </div>
              <div class="sub-section">الخدمات المقدمة بالمؤسسة</div>
              <div class="checkbox-group">
                <div class="checkbox-row">
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.housing)}</span> الإيواء</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.meals)}</span> الإطعام</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.educationalSupport)}</span> التتبع التربوي والمواكبة الاجتماعية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.culturalActivities)}</span> التنشيط الثقافي والرياضي والترفيهي</span>
                </div>
                <div class="checkbox-row" style="margin-top: 5px;">
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.healthCare)}</span> العلاجات الصحية الأولية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.psychologicalSupport)}</span> الدعم والمواكبة الطبية والنفسية</span>
                </div>
              </div>
              <div class="field-row">
                <div class="field-label">الطاقة الاستيعابية الإجمالية المرخصة</div>
                <div class="field-value">${getDisplayValue(data.totalCapacity)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">الطاقة الاستيعابية المرخصة ذكور</div>
                <div class="field-value">${getDisplayValue(data.maleCapacity)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">الطاقة الاستيعابية المرخصة إناث</div>
                <div class="field-value">${getDisplayValue(data.femaleCapacity)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">المستوى التعليمي للفئة المستهدفة</div>
                <div class="field-value">
                  <div class="checkbox-row">
                    <span class="checkbox-item"><span class="check">${getCheckbox(data.primary)}</span> ابتدائي</span>
                    <span class="checkbox-item"><span class="check">${getCheckbox(data.middleSchool)}</span> ثانوي إعدادي</span>
                    <span class="checkbox-item"><span class="check">${getCheckbox(data.highSchool)}</span> ثانوي تأهيلي</span>
                    <span class="checkbox-item"><span class="check">${getCheckbox(data.other)}</span> آخر</span>
                  </div>
                </div>
              </div>
              <div class="field-row">
                <div class="field-label">البعد الجغرافي عن أقرب مؤسسة تعليمية</div>
                <div class="field-value">${getLabelValue('distance', data.distanceToSchool)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">البعد الجغرافي عن أقرب داخلية تابعة لقطاع التربية الوطنية</div>
                <div class="field-value">${getLabelValue('distance', data.distanceToNationalBoardingSchool)}</div>
              </div>
            </div>
          </div>

          <!-- Section II: معطيات حول البناية -->
          <div class="section">
            <div class="section-title">
              <span class="section-number">II</span>
              معطيات حول البناية المخصصة للمؤسسة
            </div>
            <div class="fields-container">
              <div class="field-row">
                <div class="field-label">وضعية البناية</div>
                <div class="field-value">
                  <div class="checkbox-row">
                    <span class="checkbox-item"><span class="check">${data.building?.buildingStatus === 'RENTAL' ? '☑' : '☐'}</span> إيجار</span>
                    <span class="checkbox-item"><span class="check">${data.building?.buildingStatus === 'OWNED' ? '☑' : '☐'}</span> ملكية</span>
                    <span class="checkbox-item"><span class="check">${data.building?.buildingStatus === 'AT_DISPOSAL' ? '☑' : '☐'}</span> وضع رهن إشارة المؤسسة</span>
                    <span class="checkbox-item"><span class="check">${data.building?.buildingStatus === 'OTHER' ? '☑' : '☐'}</span> آخر</span>
                  </div>
                </div>
              </div>
              <div class="field-row">
                <div class="field-label">الحالة العامة للبناية</div>
                <div class="field-value">
                  <div class="checkbox-row">
                    <span class="checkbox-item"><span class="check">${data.building?.buildingCondition === 'GOOD' ? '☑' : '☐'}</span> جيدة</span>
                    <span class="checkbox-item"><span class="check">${data.building?.buildingCondition === 'SOME_DEGRADATION' ? '☑' : '☐'}</span> بعض علامات التدهور</span>
                    <span class="checkbox-item"><span class="check">${data.building?.buildingCondition === 'BAD' ? '☑' : '☐'}</span> متردية</span>
                  </div>
                </div>
              </div>
              <div class="field-row">
                <div class="field-label">نوع المالك</div>
                <div class="field-value">
                  <div class="checkbox-row">
                    <span class="checkbox-item"><span class="check">${data.building?.ownerType === 'STATE_DOMAIN' ? '☑' : '☐'}</span> الملك العام للدولة</span>
                    <span class="checkbox-item"><span class="check">${data.building?.ownerType === 'COMMUNAL' ? '☑' : '☐'}</span> جماعي</span>
                    <span class="checkbox-item"><span class="check">${data.building?.ownerType === 'PRIVATE' ? '☑' : '☐'}</span> خاص</span>
                    <span class="checkbox-item"><span class="check">${data.building?.ownerType === 'OTHER' ? '☑' : '☐'}</span> آخر</span>
                  </div>
                </div>
              </div>
              <div class="field-row">
                <div class="field-label">إمكانية الترميم</div>
                <div class="field-value">
                  <div class="checkbox-row">
                    <span class="checkbox-item"><span class="check">${data.building?.renovationCapacity === 'EASY' ? '☑' : '☐'}</span> سهل</span>
                    <span class="checkbox-item"><span class="check">${data.building?.renovationCapacity === 'DIFFICULT' ? '☑' : '☐'}</span> صعب</span>
                    <span class="checkbox-item"><span class="check">${data.building?.renovationCapacity === 'NEEDS_RECONSTRUCTION' ? '☑' : '☐'}</span> يتطلب إعادة بناء</span>
                  </div>
                </div>
              </div>
              <div class="field-row">
                <div class="field-label">وجود اتفاقية شراكة</div>
                <div class="field-value">${data.building?.hasPartnershipAgreement ? 'نعم' : 'لا'}</div>
              </div>
            </div>
          </div>

          <!-- Section III: معطيات حول التمويل -->
          <div class="section">
            <div class="section-title">
              <span class="section-number">III</span>
              معطيات حول تمويل المؤسسة
            </div>
            <div class="fields-container">
              <div class="sub-section">مصادر تمويل البناء</div>
              <div class="checkbox-group">
                <div class="checkbox-row">
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.solidarityMinistry)}</span> وزارة التضامن والإدماج الإجتماعي والأُسْرَة</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.nationalEntraide)}</span> التعاون الوطني</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.indh)}</span> المبادرة الوطنية للتنمية البشرية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.commune)}</span> الجماعة</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.fondationMohammed5)}</span> مؤسسة محمد الخامس للتضامن</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.nationalRevival)}</span> الإنعاش الوطني</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.association)}</span> الجمعية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.otherConstruction)}</span> أخرى ${data.financing?.otherConstructionDetail ? `(${data.financing.otherConstructionDetail})` : ''}</span>
                </div>
              </div>
              <div class="field-row">
                <div class="field-label">التكلفة الإجمالية للبناء</div>
                <div class="field-value">${getDisplayValue(data.financing?.totalConstructionCost)} درهم</div>
              </div>
              <div class="sub-section">مصادر تمويل التجهيز</div>
              <div class="checkbox-group">
                <div class="checkbox-row">
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.equipmentSolidarityMinistry)}</span> وزارة التضامن والإدماج الإجتماعي والأُسْرَة</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.equipmentNationalEntraide)}</span> التعاون الوطني</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.equipmentIndh)}</span> المبادرة الوطنية للتنمية البشرية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.equipmentCommune)}</span> الجماعة</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.equipmentFondationMohammed5)}</span> مؤسسة محمد الخامس للتضامن</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.equipmentAssociation)}</span> الجمعية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.equipmentOther)}</span> أخرى ${data.financing?.equipmentOtherDetail ? `(${data.financing.equipmentOtherDetail})` : ''}</span>
                </div>
              </div>
              <div class="sub-section">مصادر تمويل التسيير</div>
              <div class="checkbox-group">
                <div class="checkbox-row">
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.operatingIndh)}</span> المبادرة الوطنية للتنمية البشرية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.operatingNationalEntraide)}</span> التعاون الوطني</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.operatingNationalEducation)}</span> التربية الوطنية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.operatingCommune)}</span> الجماعة</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.operatingParentContributions)}</span> مساهمات أولياء الأمور</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.operatingDonors)}</span> المحسنون</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.operatingAssociationOwnSources)}</span> موارد الجمعية الذاتية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.operatingOther)}</span> أخرى</span>
                </div>
              </div>
              <div class="sub-section">التكاليف</div>
              <div class="field-row">
                <div class="field-label">التكلفة السنوية للتسيير</div>
                <div class="field-value">${getDisplayValue(data.financing?.annualManagementCost)} درهم</div>
              </div>
              <div class="field-row">
                <div class="field-label">التكلفة السنوية للموارد البشرية</div>
                <div class="field-value">${getDisplayValue(data.financing?.annualHRCost)} درهم</div>
              </div>
              <div class="field-row">
                <div class="field-label">التكلفة السنوية للإطعام</div>
                <div class="field-value">${getDisplayValue(data.financing?.annualMealsCost)} درهم</div>
              </div>
              <div class="field-row">
                <div class="field-label">التكلفة السنوية للفرد</div>
                <div class="field-value">${getDisplayValue(data.financing?.individualAnnualCost)} درهم</div>
              </div>
              <div class="sub-section">توزيع الحصص</div>
              <div class="field-row">
                <div class="field-label">حصة الجمعية</div>
                <div class="field-value">${getDisplayValue(data.financing?.associationShare)}%</div>
              </div>
              <div class="field-row">
                <div class="field-label">حصة التربية الوطنية</div>
                <div class="field-value">${getDisplayValue(data.financing?.educationShare)}%</div>
              </div>
              <div class="field-row">
                <div class="field-label">حصص أخرى</div>
                <div class="field-value">${getDisplayValue(data.financing?.otherShare)}%</div>
              </div>
            </div>
          </div>

          <!-- Section IV: الاستهداف -->
          <div class="section">
            <div class="section-title">
              <span class="section-number">IV</span>
              معطيات حول الاستهداف
            </div>
            <div class="fields-container">
              <div class="sub-section">معايير الانتقاء</div>
              <div class="checkbox-group">
                <div class="checkbox-row">
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.targeting?.socialSituation)}</span> الوضعية الاجتماعية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.targeting?.distance)}</span> البعد عن المؤسسة التعليمية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.targeting?.schoolResults)}</span> النتائج الدراسية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.targeting?.scholarship)}</span> الحصول على منحة</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.targeting?.otherCriteria)}</span> أخرى ${data.targeting?.otherCriteriaDetail ? `(${data.targeting.otherCriteriaDetail})` : ''}</span>
                </div>
              </div>
  <div class="sub-section">ترتيب الأولويات</div>
  <div class="field-row">
  <div class="field-label">الأولوية 1</div>
  <div class="field-value">${getLabelValue('priorityCriteria', data.targeting?.priority1)}</div>
  </div>
  <div class="field-row">
  <div class="field-label">الأولوية 2</div>
  <div class="field-value">${getLabelValue('priorityCriteria', data.targeting?.priority2)}</div>
  </div>
  <div class="field-row">
  <div class="field-label">الأولوية 3</div>
  <div class="field-value">${getLabelValue('priorityCriteria', data.targeting?.priority3)}</div>
  </div>
  <div class="field-row">
  <div class="field-label">الأولوية 4</div>
  <div class="field-value">${getLabelValue('priorityCriteria', data.targeting?.priority4)}</div>
  </div>
  <div class="field-row">
  <div class="field-label">الأولوية 5</div>
  <div class="field-value">${getLabelValue('priorityCriteria', data.targeting?.priority5)}</div>
  </div>
              <div class="sub-section">جهة الانتقاء</div>
              <div class="field-row">
                <div class="field-label">جهة الانتقاء</div>
                <div class="field-value">
                  <div class="checkbox-row">
                    <span class="checkbox-item"><span class="check">${data.targeting?.selectionBody === 'ASSOCIATION_ALONE' ? '☑' : '☐'}</span> الجمعية لوحدها</span>
                    <span class="checkbox-item"><span class="check">${data.targeting?.selectionBody === 'MIXED_COMMITTEE' ? '☑' : '☐'}</span> لجنة مختلطة</span>
                  </div>
                </div>
              </div>
              ${data.targeting?.selectionBody === 'MIXED_COMMITTEE' ? `
              <div class="sub-section">أعضاء اللجنة</div>
              <div class="checkbox-group">
                <div class="checkbox-row">
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.targeting?.committeeAssociation)}</span> الجمعية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.targeting?.committeeNationalEntraide)}</span> التعاون الوطني</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.targeting?.committeeNationalEducation)}</span> التربية الوطنية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.targeting?.committeeCommune)}</span> الجماعة</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.targeting?.committeeLocalAuthorities)}</span> السلطات المحلية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.targeting?.otherMember)}</span> أخرى ${data.targeting?.otherMemberDetail ? `(${data.targeting.otherMemberDetail})` : ''}</span>
                </div>
              </div>
              ` : ''}
              <div class="sub-section">التعريفة</div>
              <div class="field-row">
                <div class="field-label">الخدمات مجانية</div>
                <div class="field-value">${data.targeting?.servicesAreFree ? 'نعم' : 'لا'}</div>
              </div>
              ${!data.targeting?.servicesAreFree ? `
              <div class="field-row">
                <div class="field-label">نوع التعريفة</div>
                <div class="field-value">
                  <div class="checkbox-row">
                    <span class="checkbox-item"><span class="check">${data.targeting?.tariffType === 'UNIFORM' ? '☑' : '☐'}</span> موحد</span>
                    <span class="checkbox-item"><span class="check">${data.targeting?.tariffType === 'NON_UNIFORM' ? '☑' : '☐'}</span> حسب الشرائح</span>
                  </div>
                </div>
              </div>
              ${data.targeting?.tariffType === 'UNIFORM' ? `
              <div class="field-row">
                <div class="field-label">المبلغ الموحد</div>
                <div class="field-value">${getDisplayValue(data.targeting?.uniformAmount)} درهم</div>
              </div>
              ` : ''}
              ` : ''}
              <div class="field-row">
                <div class="field-label">عدد الطلبات غير الملباة</div>
                <div class="field-value">${getDisplayValue(data.targeting?.unsatisfiedRequestsCount)}</div>
              </div>
            </div>
          </div>

          <!-- Section V: الإيواء والإطعام -->
          <div class="section">
            <div class="section-title">
              <span class="section-number">V</span>
              عدد المستفيدين من خدمتي الإيواء والإطعام بالمؤسسة
            </div>
            <div class="fields-container">
              <div class="sub-section">المستفيدون من الإيواء حسب المواسم</div>
              <table class="stats-table">
                <thead>
                  <tr>
                    <th>الموسم</th>
                    <th>المجموع</th>
                    <th>ذكور</th>
                    <th>إناث</th>
                    <th>ابتدائي</th>
                    <th>إعدادي</th>
                    <th>ثانوي</th>
                    <th>أيتام</th>
                    <th>في وضعية إعاقة</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2023-2024</td>
                    <td>${getDisplayValue(data.housingMeals?.season2324?.totalBeneficiaries)}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2324?.maleBeneficiaries)}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2324?.femaleBeneficiaries)}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2324?.primaryBeneficiaries)}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2324?.middleSchoolBeneficiaries)}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2324?.highSchoolBeneficiaries)}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2324?.orphans)}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2324?.disabled)}</td>
                  </tr>
                  <tr>
                    <td>2024-2025</td>
                    <td>${getDisplayValue(data.housingMeals?.season2425?.totalBeneficiaries)}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2425?.maleBeneficiaries)}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2425?.femaleBeneficiaries)}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2425?.primaryBeneficiaries)}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2425?.middleSchoolBeneficiaries)}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2425?.highSchoolBeneficiaries)}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2425?.orphans)}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2425?.disabled)}</td>
                  </tr>
                  <tr>
                    <td>2025-2026</td>
                    <td>${getDisplayValue(data.housingMeals?.season2526?.totalBeneficiaries)}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2526?.maleBeneficiaries)}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2526?.femaleBeneficiaries)}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2526?.primaryBeneficiaries)}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2526?.middleSchoolBeneficiaries)}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2526?.highSchoolBeneficiaries)}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2526?.orphans)}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2526?.disabled)}</td>
                  </tr>
                </tbody>
              </table>
              <div class="field-row">
                <div class="field-label">ملاحظات حول الطاقة الاستيعابية</div>
                <div class="field-value">${getDisplayValue(data.housingMeals?.capacityRemarks)}</div>
              </div>
              <div class="sub-section">معطيات الإطعام</div>
              <div class="field-row">
                <div class="field-label">مجموع المستفيدين من الإطعام 2025-2026</div>
                <div class="field-value">${getDisplayValue(data.housingMeals?.totalMealBeneficiaries2526)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">المستفيدون من الجمعية</div>
                <div class="field-value">${getDisplayValue(data.housingMeals?.associationMealBeneficiaries)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">المستفيدون من التربية الوطنية</div>
                <div class="field-value">${getDisplayValue(data.housingMeals?.educationMealBeneficiaries)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">عدد المستفيدين من المنحة الكاملة</div>
                <div class="field-value">${getDisplayValue(data.housingMeals?.fullGrantCount)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">عدد المستفيدين من نصف المنحة</div>
                <div class="field-value">${getDisplayValue(data.housingMeals?.halfGrantCount)}</div>
              </div>
  <div class="field-row">
  <div class="field-label">نوعية خدمة الإطعام المقدمة</div>
  <div class="field-value">
  <div class="checkbox-row">
  <span class="checkbox-item"><span class="check">${data.housingMeals?.mealServiceType === 'INSTITUTION_KITCHEN' ? '☑' : '☐'}</span> إعداد الوجبات في مطبخ المؤسسة</span>
  <span class="checkbox-item"><span class="check">${data.housingMeals?.mealServiceType === 'READY_MEALS' ? '☑' : '☐'}</span> وجبات جاهزة</span>
  <span class="checkbox-item"><span class="check">${data.housingMeals?.mealServiceType === 'OTHER' ? '☑' : '☐'}</span> آخر ${data.housingMeals?.mealServiceType === 'OTHER' && data.housingMeals?.mealServiceTypeOther ? `(${data.housingMeals.mealServiceTypeOther})` : ''}</span>
  </div>
  </div>
  </div>
              <div class="sub-section">اقتراحات التحسين</div>
              <div class="checkbox-group">
                <div class="checkbox-row">
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.housingMeals?.increaseProducts)}</span> الرفع من المواد الغذائية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.housingMeals?.externalCaterer)}</span> الاستعانة بمموّن خارجي</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.housingMeals?.otherSuggestion)}</span> أخرى ${data.housingMeals?.otherSuggestionDetail ? `(${data.housingMeals.otherSuggestionDetail})` : ''}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Section VI: الموارد البشرية -->
          ${staffRows ? `
          <div class="section">
            <div class="section-title">
              <span class="section-number">VI</span>
              معطيات حول الموارد البشرية العاملة بالمؤسسة
            </div>
            <table class="stats-table">
              <thead>
                <tr>
                  <th>نوع التأطير</th>
                  <th>عدد المستخدمين بالجمعية</th>
                  <th>عدد الأطر الموضوعة رهن الإشارة</th>
                  <th>عدد الأطر المتطوعة</th>
                  <th>المستفيدون من CNSS</th>
                  <th>المستفيدون من SMIG</th>
                  <th>الكلفة الشهرية (درهم)</th>
                  <th>الكلفة السنوية (درهم)</th>
                </tr>
              </thead>
              <tbody>
                ${staffRows}
              </tbody>
            </table>
          </div>
          ` : ''}

          <!-- Signature Section -->
          <div class="signature-section">
            <div class="main-signature">
              <h4>توقيع رئيس الجهة المدبرة لدار الطالب(ة)</h4>
              <div class="main-signature-box"></div>
            </div>
            <div class="visa-row">
              <div class="visa-box">
                <h4>تأشيرة المدير الإقليمي للتعاون الوطني</h4>
                <div class="visa-space"></div>
              </div>
              <div class="visa-box">
                <h4>تأشيرة المدير الإقليمي لوزارة التربية الوطنية والتعليم الأولي والرياضة</h4>
                <div class="visa-space"></div>
              </div>
              <div class="visa-box">
                <h4>تأشيرة رئيس قسم العمل الاجتماعي</h4>
                <div class="visa-space"></div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            نظام إدارة مؤسسات الرعاية الاجتماعية - مؤسسة التعاون الوطني | المملكة المغربية
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
