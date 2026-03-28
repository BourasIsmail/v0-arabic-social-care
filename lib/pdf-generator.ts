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

// Labels mapping in Arabic
const labels = {
  institutionType: {
    DAR_TALIB: 'دار الطالب',
    DAR_TALIBA: 'دار الطالبة',
    DAR_TALIB_TALIBA: 'دار الطالب والطالبة',
  } as Record<string, string>,
  milieu: {
    URBAIN: 'حضري',
    RURAL: 'قروي',
  } as Record<string, string>,
  legalStatus: {
    LICENSED: 'مرخصة',
    UNLICENSED: 'غير مرخصة',
  } as Record<string, string>,
  distance: {
    INSIDE: 'داخل المؤسسة',
    LT_1KM: 'أقل من 1 كم',
    BETWEEN_1_5KM: 'بين 1 و 5 كم',
    GT_5KM: 'أكثر من 5 كم',
  } as Record<string, string>,
  buildingStatus: {
    RENTAL: 'مكترى',
    OWNED: 'ملك',
    AT_DISPOSAL: 'رهن الإشارة',
    OTHER: 'أخرى',
  } as Record<string, string>,
  buildingCondition: {
    GOOD: 'جيدة',
    SOME_DEGRADATION: 'متوسطة',
    BAD: 'سيئة',
  } as Record<string, string>,
  staffType: {
    DIRECTOR: 'مدير',
    FINANCIAL_MANAGER: 'مسؤول مالي',
    GENERAL_GUARD: 'حارس عام',
    SOCIAL_WORKER: 'مساعد اجتماعي',
    DOCTOR: 'طبيب',
    NURSE: 'ممرض',
    PSYCHOLOGIST: 'أخصائي نفسي',
    EDUCATORS: 'مربين',
    KITCHEN_MANAGER: 'مسؤول المطبخ',
    KITCHEN_AGENTS: 'عمال المطبخ',
    STORAGE_MANAGER: 'مسؤول المخزن',
    SECURITY: 'الأمن',
    SERVICE_AGENTS: 'عمال الخدمة',
    OTHER: 'أخرى',
  } as Record<string, string>,
};

function getLabelValue(category: keyof typeof labels, value: string | undefined): string {
  if (!value) return '—';
  const categoryLabels = labels[category];
  return categoryLabels[value] || value;
}

export function generatePrintableHTML(data: InstitutionResponse): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString('ar-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Build staff table rows
  const staffRows = (data.staffMembers || []).map((staff: any) => `
    <tr>
      <td>${getLabelValue('staffType', staff.staffType)}</td>
      <td>${getDisplayValue(staff.nbAssociation, '0')}</td>
      <td>${getDisplayValue(staff.nbDeployed, '0')}</td>
      <td>${getDisplayValue(staff.nbVolunteers, '0')}</td>
      <td>${getDisplayValue(staff.nbCNSS, '0')}</td>
      <td>${getDisplayValue(staff.nbSMIG, '0')}</td>
      <td>${getDisplayValue(staff.monthlyCost, '0')}</td>
      <td>${getDisplayValue(staff.annualCost, '0')}</td>
    </tr>
  `).join('');

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
          line-height: 1.6;
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
          padding: 12mm;
        }
        .logos-header {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
          padding: 10px 0;
          border-bottom: 2px solid #c8a415;
          margin-bottom: 15px;
        }
        .logos-header img {
          height: 60px;
          object-fit: contain;
        }
        .header {
          text-align: center;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
          font-size: 10px;
        }
        .header h1 {
          font-size: 18px;
          color: #1e3a5f;
          margin-bottom: 5px;
        }
        .header h2 {
          font-size: 13px;
          color: #666;
          font-weight: 600;
        }
        .section {
          margin-bottom: 18px;
          break-inside: avoid;
        }
        .section-title {
          background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
          color: white;
          padding: 8px 14px;
          border-radius: 5px;
          margin-bottom: 10px;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .section-number {
          background: white;
          color: #1e3a5f;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 12px;
        }
        .fields-container {
          border: 1px solid #e0e0e0;
          border-radius: 5px;
          overflow: hidden;
        }
        .field-row {
          display: flex;
          border-bottom: 1px solid #e0e0e0;
          min-height: 32px;
        }
        .field-row:last-child {
          border-bottom: none;
        }
        .field-label {
          background: #f8f9fa;
          padding: 6px 10px;
          font-weight: 600;
          color: #555;
          width: 40%;
          border-left: 1px solid #e0e0e0;
          display: flex;
          align-items: center;
          font-size: 10px;
        }
        .field-value {
          padding: 6px 10px;
          width: 60%;
          display: flex;
          align-items: center;
          color: #333;
          font-size: 10px;
        }
        .checkbox-row {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          padding: 8px 10px;
        }
        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
        }
        .checkbox-item .check {
          font-size: 14px;
        }
        .sub-section {
          background: #f0f4f8;
          padding: 6px 10px;
          font-weight: 600;
          color: #1e3a5f;
          border-bottom: 1px solid #e0e0e0;
          font-size: 11px;
        }
        .stats-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
          font-size: 9px;
        }
        .stats-table th {
          background: #1e3a5f;
          color: white;
          padding: 6px;
          text-align: center;
          font-weight: 600;
        }
        .stats-table td {
          padding: 5px 6px;
          border: 1px solid #e0e0e0;
          text-align: center;
        }
        .stats-table tr:nth-child(even) {
          background: #f8f9fa;
        }
        .signature-section {
          margin-top: 30px;
        }
        .main-signature {
          text-align: center;
          margin-bottom: 20px;
        }
        .main-signature h4 {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 10px;
          color: #333;
          text-decoration: underline;
        }
        .main-signature-box {
          border: 1px solid #333;
          border-radius: 10px;
          height: 120px;
          max-width: 600px;
          margin: 0 auto;
        }
        .visa-row {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          margin-top: 20px;
        }
        .visa-box {
          flex: 1;
          border: 1px solid #333;
          text-align: center;
        }
        .visa-box h4 {
          padding: 10px;
          font-size: 11px;
          font-weight: 700;
          color: #333;
          text-decoration: underline;
          border-bottom: 1px solid #333;
          background: #fff;
        }
        .visa-box .visa-space {
          height: 150px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          padding-top: 10px;
          border-top: 2px solid #1e3a5f;
          font-size: 9px;
          color: #999;
        }
        @media print {
          .print-bar { display: none !important; }
          .content { 
            margin-top: 0; 
            padding: 0;
            box-shadow: none;
          }
          body { 
            padding: 0; 
            background: white;
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
          <!-- Header -->
          <div class="header">
            <div class="header-top">
              <div>التاريخ: ${dateStr}</div>
            </div>
            <h1>استمارة تشخيص مؤسسات الرعاية الاجتماعية</h1>
            <h2>دور الطالب والطالبة</h2>
          </div>

          <!-- Section 1: معلومات المؤسسة -->
          <div class="section">
            <div class="section-title">
              <span class="section-number">I</span>
              معلومات المؤسسة
            </div>
            <div class="fields-container">
              <div class="field-row">
                <div class="field-label">نوع المؤسسة</div>
                <div class="field-value">${getLabelValue('institutionType', data.institutionType)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">اسم الجمعية المسيرة</div>
                <div class="field-value">${getDisplayValue(data.associationName)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">اسم المؤسسة</div>
                <div class="field-value">${getDisplayValue(data.institutionName)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">سنة التأسيس</div>
                <div class="field-value">${getDisplayValue(data.creationYear)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">الوضعية القانونية</div>
                <div class="field-value">${getLabelValue('legalStatus', data.legalStatus)}</div>
              </div>
              ${data.legalStatus === 'LICENSED' ? `
              <div class="field-row">
                <div class="field-label">رقم الترخيص</div>
                <div class="field-value">${getDisplayValue(data.licenseNumber)}</div>
              </div>
              ` : ''}
              <div class="field-row">
                <div class="field-label">تاريخ بداية الخدمة</div>
                <div class="field-value">${getDisplayValue(data.serviceStartDate)}</div>
              </div>
            </div>
          </div>

          <!-- Section 2: الموقع الجغرافي -->
          <div class="section">
            <div class="section-title">
              <span class="section-number">II</span>
              الموقع الجغرافي
            </div>
            <div class="fields-container">
              <div class="field-row">
                <div class="field-label">الجهة</div>
                <div class="field-value">${getDisplayValue(data.regionName)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">العمالة / الإقليم</div>
                <div class="field-value">${getDisplayValue(data.prefectureName)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">الجماعة</div>
                <div class="field-value">${getDisplayValue(data.communeName)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">الوسط</div>
                <div class="field-value">${getLabelValue('milieu', data.milieu)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">العنوان</div>
                <div class="field-value">${getDisplayValue(data.address)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">المسافة عن المؤسسة التعليمية</div>
                <div class="field-value">${getLabelValue('distance', data.distanceToSchool)}</div>
              </div>
            </div>
          </div>

          <!-- Section 3: الخدمات المقدمة -->
          <div class="section">
            <div class="section-title">
              <span class="section-number">III</span>
              الخدمات المقدمة
            </div>
            <div class="fields-container">
              <div class="checkbox-row">
                <span class="checkbox-item"><span class="check">${getCheckbox(data.housing)}</span> الإيواء</span>
                <span class="checkbox-item"><span class="check">${getCheckbox(data.meals)}</span> الإطعام</span>
                <span class="checkbox-item"><span class="check">${getCheckbox(data.educationalSupport)}</span> الدعم التربوي</span>
                <span class="checkbox-item"><span class="check">${getCheckbox(data.culturalActivities)}</span> الأنشطة الثقافية</span>
                <span class="checkbox-item"><span class="check">${getCheckbox(data.healthCare)}</span> الرعاية الصحية</span>
                <span class="checkbox-item"><span class="check">${getCheckbox(data.insurance)}</span> التأمين</span>
                <span class="checkbox-item"><span class="check">${getCheckbox(data.psychologicalSupport)}</span> الدعم النفسي</span>
              </div>
            </div>
          </div>

          <!-- Section 4: الطاقة الاستيعابية -->
          <div class="section">
            <div class="section-title">
              <span class="section-number">IV</span>
              الطاقة الاستيعابية والمستويات المستهدفة
            </div>
            <div class="fields-container">
              <div class="field-row">
                <div class="field-label">الطاقة الاستيعابية الإجمالية</div>
                <div class="field-value">${getDisplayValue(data.totalCapacity)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">طاقة الذكور</div>
                <div class="field-value">${getDisplayValue(data.maleCapacity)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">طاقة الإناث</div>
                <div class="field-value">${getDisplayValue(data.femaleCapacity)}</div>
              </div>
              <div class="sub-section">المستويات المستهدفة</div>
              <div class="checkbox-row">
                <span class="checkbox-item"><span class="check">${getCheckbox(data.primary)}</span> ابتدائي</span>
                <span class="checkbox-item"><span class="check">${getCheckbox(data.middleSchool)}</span> إعدادي</span>
                <span class="checkbox-item"><span class="check">${getCheckbox(data.highSchool)}</span> ثانوي</span>
              </div>
            </div>
          </div>

          <!-- Section 5: معلومات البناية -->
          <div class="section">
            <div class="section-title">
              <span class="section-number">V</span>
              معلومات البناية
            </div>
            <div class="fields-container">
              <div class="field-row">
                <div class="field-label">وضعية البناية</div>
                <div class="field-value">${getLabelValue('buildingStatus', data.building?.buildingStatus)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">حالة البناية</div>
                <div class="field-value">${getLabelValue('buildingCondition', data.building?.buildingCondition)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">المساحة الإجمالية (م²)</div>
                <div class="field-value">${getDisplayValue(data.building?.totalArea)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">عدد الغرف</div>
                <div class="field-value">${getDisplayValue(data.building?.roomsCount)}</div>
              </div>
              <div class="field-row">
                <div class="field-label">عدد الأسرة</div>
                <div class="field-value">${getDisplayValue(data.building?.bedsCount)}</div>
              </div>
            </div>
          </div>

          <!-- Section 6: الموارد البشرية -->
          ${staffRows ? `
          <div class="section">
            <div class="section-title">
              <span class="section-number">VI</span>
              الموارد البشرية
            </div>
            <table class="stats-table">
              <thead>
                <tr>
                  <th>الوظيفة</th>
                  <th>الجمعية</th>
                  <th>الموظفين</th>
                  <th>المتطوعين</th>
                  <th>CNSS</th>
                  <th>SMIG</th>
                  <th>التكلفة الشهرية</th>
                  <th>التكلفة السنوية</th>
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
              <h4>إمضاء وختم الجمعية</h4>
              <div class="main-signature-box"></div>
            </div>
            <div class="visa-row">
              <div class="visa-box">
                <h4>تأشيرة المندوبية الإقليمية</h4>
                <div class="visa-space"></div>
              </div>
              <div class="visa-box">
                <h4>تأشيرة التنسيقية الجهوية</h4>
                <div class="visa-space"></div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            نظام إدارة مؤسسات الرعاية الاجتماعية - مؤسسة التعاون الوطني
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
