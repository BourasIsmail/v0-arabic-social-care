import { NextResponse } from 'next/server';

// Helper function to get display value
function getDisplayValue(value: any, defaultValue: string = '—'): string {
  if (value === undefined || value === null || value === '') return defaultValue;
  return String(value);
}

// Helper function for boolean display
function getBooleanDisplay(value: boolean | undefined): string {
  return value ? 'نعم' : 'لا';
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
  },
  milieu: {
    URBAIN: 'حضري',
    RURAL: 'قروي',
  },
  legalStatus: {
    LICENSED: 'مرخصة',
    UNLICENSED: 'غير مرخصة',
  },
  distance: {
    INSIDE: 'داخل المؤسسة',
    LT_1KM: 'أقل من 1 كم',
    BETWEEN_1_5KM: 'بين 1 و 5 كم',
    GT_5KM: 'أكثر من 5 كم',
  },
  buildingStatus: {
    RENTAL: 'مكترى',
    OWNED: 'ملك',
    AT_DISPOSAL: 'رهن الإشارة',
    OTHER: 'أخرى',
  },
  buildingCondition: {
    GOOD: 'جيدة',
    SOME_DEGRADATION: 'متوسطة',
    BAD: 'سيئة',
  },
  renovationCapacity: {
    EASY: 'سهلة',
    DIFFICULT: 'صعبة',
    NEEDS_RECONSTRUCTION: 'تحتاج إعادة بناء',
  },
  ownerType: {
    STATE_DOMAIN: 'ملك الدولة',
    COMMUNAL: 'جماعي',
    PRIVATE: 'خاص',
    OTHER: 'أخرى',
  },
  selectionBody: {
    ASSOCIATION_ALONE: 'الجمعية لوحدها',
    MIXED_COMMITTEE: 'لجنة مختلطة',
  },
  tariffType: {
    UNIFORM: 'موحد',
    NON_UNIFORM: 'غير موحد',
  },
  tariffBracket: {
    LT_50: 'أقل من 50 درهم',
    BETWEEN_50_100: 'بين 50 و 100 درهم',
    BETWEEN_100_200: 'بين 100 و 200 درهم',
    GT_200: 'أكثر من 200 درهم',
  },
  mealServiceType: {
    INSTITUTION_KITCHEN: 'مطبخ المؤسسة',
    READY_MEALS: 'وجبات جاهزة',
    OTHER: 'أخرى',
  },
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
  },
};

function getLabelValue(category: keyof typeof labels, value: string | undefined): string {
  if (!value) return '—';
  const categoryLabels = labels[category] as Record<string, string>;
  return categoryLabels[value] || value;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = body.data || {};
    
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

    const htmlContent = `
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
            <!-- Logos Header -->
            <div class="logos-header">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled-3-0A5X35LevNjDCojiGr2ARp26r3Ti5k.png" alt="الشعارات الرسمية" style="height: 70px; width: 100%; object-fit: contain;" />
            </div>
            
            <!-- Header -->
            <div class="header">
              <div class="header-top">
                <div>
                  التاريخ: ${dateStr}
                </div>
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
                ${data.legalStatus === 'UNLICENSED' ? `
                <div class="field-row">
                  <div class="field-label">سبب عدم الترخيص</div>
                  <div class="field-value">${getDisplayValue(data.unlicensedReason)}</div>
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
                <div class="field-row">
                  <div class="field-label">المسافة عن الداخلية الوطنية</div>
                  <div class="field-value">${getLabelValue('distance', data.distanceToNationalBoardingSchool)}</div>
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
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.other)}</span> أخرى ${data.otherDetail ? `(${data.otherDetail})` : ''}</span>
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
                  <div class="field-label">إمكانية الترميم</div>
                  <div class="field-value">${getLabelValue('renovationCapacity', data.building?.renovationCapacity)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">نوع المالك</div>
                  <div class="field-value">${getLabelValue('ownerType', data.building?.ownerType)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">وجود اتفاقية شراكة</div>
                  <div class="field-value">${getBooleanDisplay(data.building?.hasPartnershipAgreement)}</div>
                </div>
              </div>
            </div>

            <!-- Section 6: التمويل -->
            <div class="section">
              <div class="section-title">
                <span class="section-number">VI</span>
                التمويل
              </div>
              <div class="fields-container">
                <div class="sub-section">مصادر تمويل البناء</div>
                <div class="checkbox-row">
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.solidarityMinistry)}</span> وزارة التضامن</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.nationalEntraide)}</span> التعاون الوطني</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.indh)}</span> المبادرة الوطنية للتنمية البشرية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.commune)}</span> الجماعة</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.fondationMohammed5)}</span> مؤسسة محمد الخامس للتضامن</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.nationalRevival)}</span> الإنعاش الوطني</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.association)}</span> الجمعية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.otherConstruction)}</span> أخرى ${data.financing?.otherConstructionDetail ? `(${data.financing.otherConstructionDetail})` : ''}</span>
                </div>
                <div class="field-row">
                  <div class="field-label">التكلفة الإجمالية للبناء (درهم)</div>
                  <div class="field-value">${getDisplayValue(data.financing?.totalConstructionCost)}</div>
                </div>
                
                <div class="sub-section">مصادر تمويل التجهيز</div>
                <div class="checkbox-row">
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.equipmentSolidarityMinistry)}</span> وزارة التضامن</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.equipmentNationalEntraide)}</span> التعاون الوطني</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.equipmentIndh)}</span> المبادرة الوطنية للتنمية البشرية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.equipmentCommune)}</span> الجماعة</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.equipmentFondationMohammed5)}</span> مؤسسة محمد الخامس للتضامن</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.equipmentAssociation)}</span> الجمعية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.financing?.equipmentOther)}</span> أخرى ${data.financing?.equipmentOtherDetail ? `(${data.financing.equipmentOtherDetail})` : ''}</span>
                </div>
                
                <div class="sub-section">مصادر تمويل التسيير</div>
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
                
                <div class="sub-section">التكاليف السنوية</div>
                <div class="field-row">
                  <div class="field-label">التكلفة السنوية للتسيير (درهم)</div>
                  <div class="field-value">${getDisplayValue(data.financing?.annualManagementCost)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">التكلفة السنوية للموارد البشرية (درهم)</div>
                  <div class="field-value">${getDisplayValue(data.financing?.annualHRCost)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">التكلفة السنوية للإطعام (درهم)</div>
                  <div class="field-value">${getDisplayValue(data.financing?.annualMealsCost)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">المبلغ الإجمالي للوجبات (درهم)</div>
                  <div class="field-value">${getDisplayValue(data.financing?.totalMealsAmount)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">المصاريف الأخرى السنوية (درهم)</div>
                  <div class="field-value">${getDisplayValue(data.financing?.annualOtherExpenses)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">التكلفة السنوية للفرد (درهم)</div>
                  <div class="field-value">${getDisplayValue(data.financing?.individualAnnualCost)}</div>
                </div>
                
                <div class="sub-section">توزيع الحصص (%)</div>
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

            <!-- Section 7: الاستهداف -->
            <div class="section">
              <div class="section-title">
                <span class="section-number">VII</span>
                الاستهداف
              </div>
              <div class="fields-container">
                <div class="sub-section">معايير الاختيار</div>
                <div class="checkbox-row">
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.targeting?.socialSituation)}</span> الوضعية الاجتماعية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.targeting?.distance)}</span> البعد عن المؤسسة التعليمية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.targeting?.schoolResults)}</span> النتائج الدراسية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.targeting?.scholarship)}</span> الحصول على منحة</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.targeting?.otherCriteria)}</span> أخرى ${data.targeting?.otherCriteriaDetail ? `(${data.targeting.otherCriteriaDetail})` : ''}</span>
                </div>
                
                <div class="sub-section">ترتيب الأولويات</div>
                <div class="field-row">
                  <div class="field-label">الأولوية 1</div>
                  <div class="field-value">${getDisplayValue(data.targeting?.priority1)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">الأولوية 2</div>
                  <div class="field-value">${getDisplayValue(data.targeting?.priority2)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">الأولوية 3</div>
                  <div class="field-value">${getDisplayValue(data.targeting?.priority3)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">الأولوية 4</div>
                  <div class="field-value">${getDisplayValue(data.targeting?.priority4)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">الأولوية 5</div>
                  <div class="field-value">${getDisplayValue(data.targeting?.priority5)}</div>
                </div>
                
                <div class="sub-section">جهة الانتقاء</div>
                <div class="field-row">
                  <div class="field-label">جهة الانتقاء</div>
                  <div class="field-value">${getLabelValue('selectionBody', data.targeting?.selectionBody)}</div>
                </div>
                ${data.targeting?.selectionBody === 'MIXED_COMMITTEE' ? `
                <div class="sub-section">أعضاء اللجنة</div>
                <div class="checkbox-row">
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.targeting?.committeeAssociation)}</span> الجمعية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.targeting?.committeeNationalEntraide)}</span> التعاون الوطني</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.targeting?.committeeNationalEducation)}</span> التربية الوطنية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.targeting?.committeeCommune)}</span> الجماعة</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.targeting?.committeeLocalAuthorities)}</span> السلطات المحلية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.targeting?.otherMember)}</span> أخرى ${data.targeting?.otherMemberDetail ? `(${data.targeting.otherMemberDetail})` : ''}</span>
                </div>
                ` : ''}
                
                <div class="sub-section">التعريفة</div>
                <div class="field-row">
                  <div class="field-label">الخدمات مجانية</div>
                  <div class="field-value">${getBooleanDisplay(data.targeting?.servicesAreFree)}</div>
                </div>
                ${!data.targeting?.servicesAreFree ? `
                <div class="field-row">
                  <div class="field-label">نوع التعريفة</div>
                  <div class="field-value">${getLabelValue('tariffType', data.targeting?.tariffType)}</div>
                </div>
                ${data.targeting?.tariffType === 'UNIFORM' ? `
                <div class="field-row">
                  <div class="field-label">المبلغ الموحد (درهم)</div>
                  <div class="field-value">${getDisplayValue(data.targeting?.uniformAmount)}</div>
                </div>
                ` : ''}
                ${data.targeting?.tariffType === 'BRACKETED' ? `
                <div class="field-row">
                  <div class="field-label">شريحة التعريفة</div>
                  <div class="field-value">${getLabelValue('tariffBracket', data.targeting?.tariffBracket)}</div>
                </div>
                ` : ''}
                ` : ''}
                
                <div class="sub-section">معلومات إضافية</div>
                <div class="field-row">
                  <div class="field-label">عدد الطلبات غير الملباة</div>
                  <div class="field-value">${getDisplayValue(data.targeting?.unsatisfiedRequestsCount)}</div>
                </div>
              </div>
            </div>

            <!-- Section 8: الإيواء والإطعام -->
            <div class="section">
              <div class="section-title">
                <span class="section-number">VIII</span>
                الإيواء والإطعام
              </div>
              <div class="fields-container">
                <div class="sub-section">ملاحظات حول الطاقة الاستيعابية</div>
                <div class="field-row">
                  <div class="field-label">ملاحظات</div>
                  <div class="field-value" style="width:100%;">${getDisplayValue(data.housingMeals?.capacityRemarks)}</div>
                </div>
                
                <div class="sub-section">الإطعام</div>
                <div class="field-row">
                  <div class="field-label">إجمالي المستفيدين من الإطعام 2025-2026</div>
                  <div class="field-value">${getDisplayValue(data.housingMeals?.totalMealBeneficiaries2526)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">مستفيدون من الجمعية</div>
                  <div class="field-value">${getDisplayValue(data.housingMeals?.associationMealBeneficiaries)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">مستفيدون من التربية الوطنية</div>
                  <div class="field-value">${getDisplayValue(data.housingMeals?.educationMealBeneficiaries)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">عدد المنح الكاملة</div>
                  <div class="field-value">${getDisplayValue(data.housingMeals?.fullGrantCount)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">عدد نصف المنح</div>
                  <div class="field-value">${getDisplayValue(data.housingMeals?.halfGrantCount)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">نوع خدمة الإطعام</div>
                  <div class="field-value">${getLabelValue('mealServiceType', data.housingMeals?.mealServiceType)}</div>
                </div>
                
                <div class="sub-section">مقترحات التحسين</div>
                <div class="checkbox-row">
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.housingMeals?.increaseProducts)}</span> زيادة المنتجات الغذائية</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.housingMeals?.externalCaterer)}</span> الاستعانة بمتعهد خارجي</span>
                  <span class="checkbox-item"><span class="check">${getCheckbox(data.housingMeals?.otherSuggestion)}</span> أخرى ${data.housingMeals?.otherSuggestionDetail ? `(${data.housingMeals.otherSuggestionDetail})` : ''}</span>
                </div>
              </div>
              
              <!-- Season Statistics -->
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
                    <th>ذوي إعاقة</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2023-2024</td>
                    <td>${getDisplayValue(data.housingMeals?.season2324?.totalBeneficiaries, '0')}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2324?.maleBeneficiaries, '0')}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2324?.femaleBeneficiaries, '0')}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2324?.primaryBeneficiaries, '0')}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2324?.middleSchoolBeneficiaries, '0')}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2324?.highSchoolBeneficiaries, '0')}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2324?.orphans, '0')}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2324?.disabled, '0')}</td>
                  </tr>
                  <tr>
                    <td>2024-2025</td>
                    <td>${getDisplayValue(data.housingMeals?.season2425?.totalBeneficiaries, '0')}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2425?.maleBeneficiaries, '0')}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2425?.femaleBeneficiaries, '0')}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2425?.primaryBeneficiaries, '0')}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2425?.middleSchoolBeneficiaries, '0')}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2425?.highSchoolBeneficiaries, '0')}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2425?.orphans, '0')}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2425?.disabled, '0')}</td>
                  </tr>
                  <tr>
                    <td>2025-2026</td>
                    <td>${getDisplayValue(data.housingMeals?.season2526?.totalBeneficiaries, '0')}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2526?.maleBeneficiaries, '0')}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2526?.femaleBeneficiaries, '0')}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2526?.primaryBeneficiaries, '0')}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2526?.middleSchoolBeneficiaries, '0')}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2526?.highSchoolBeneficiaries, '0')}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2526?.orphans, '0')}</td>
                    <td>${getDisplayValue(data.housingMeals?.season2526?.disabled, '0')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Section 9: الموارد البشرية -->
            <div class="section">
              <div class="section-title">
                <span class="section-number">IX</span>
                الموارد البشرية
              </div>
              ${(data.staffMembers && data.staffMembers.length > 0) ? `
              <table class="stats-table">
                <thead>
                  <tr>
                    <th>نوع الموظف</th>
                    <th>الجمعية</th>
                    <th>المنتدبون</th>
                    <th>المتطوعون</th>
                    <th>CNSS</th>
                    <th>SMIG</th>
                    <th>الشهري (درهم)</th>
                    <th>السنوي (درهم)</th>
                  </tr>
                </thead>
                <tbody>
                  ${staffRows}
                </tbody>
              </table>
              ` : '<div class="fields-container"><div class="field-row"><div class="field-value" style="width:100%; text-align:center;">لا يوجد موظفون مسجلون</div></div></div>'}
            </div>

            <!-- Signatures -->
            <div class="signature-section">
              <!-- Main Signature -->
              <div class="main-signature">
                <h4>توقيع رئيس الجهة المديرة لدار الطالب(ة)</h4>
                <div class="main-signature-box"></div>
              </div>
              
              <!-- Visa Row -->
              <div class="visa-row">
                <div class="visa-box">
                  <h4>تأشيرة رئيس قسم العمل الاجتماعي</h4>
                  <div class="visa-space"></div>
                </div>
                <div class="visa-box">
                  <h4>تأشيرة المدير الإقليمي لوزارة التربية الوطنية والتعليم الأولي والرياضة</h4>
                  <div class="visa-space"></div>
                </div>
                <div class="visa-box">
                  <h4>تأشيرة المدير الإقليمي للتعاون الوطني</h4>
                  <div class="visa-space"></div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              استمارة تشخيص مؤسسات الرعاية الاجتماعية - نظام إلكتروني
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error: any) {
    console.error('PDF API error:', error);
    return NextResponse.json({ success: false, error: error?.message ?? 'Internal error' }, { status: 500 });
  }
}
