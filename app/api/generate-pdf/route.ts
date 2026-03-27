import { NextResponse } from 'next/server';

// Helper function to get display value for different field types
function getDisplayValue(value: any, defaultValue: string = '—'): string {
  if (value === undefined || value === null || value === '') return defaultValue;
  return String(value);
}

// Helper function to format date
function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-MA');
  } catch {
    return dateStr;
  }
}

// Labels mapping
const labels = {
  legalStatus: {
    PUBLIC: 'عمومية',
    PRIVATE: 'خاصة',
    ASSOCIATION: 'جمعوية',
  },
  institutionType: {
    DAR_TALIB: 'دار الطالب',
    DAR_TALIBA: 'دار الطالبة',
    DAR_TALIB_TALIBA: 'دار الطالب والطالبة',
    CENTRE_ACCUEIL: 'مركز الاستقبال',
  },
  buildingOwnership: {
    OWNED: 'ملك',
    RENTED: 'كراء',
    BORROWED: 'إعارة',
    OTHER: 'أخرى',
  },
  buildingCondition: {
    GOOD: 'جيدة',
    AVERAGE: 'متوسطة',
    BAD: 'سيئة',
  },
  milieu: {
    URBAN: 'حضري',
    RURAL: 'قروي',
  },
  gender: {
    MALE: 'ذكور',
    FEMALE: 'إناث',
    MIXED: 'مختلط',
  },
  educationLevel: {
    PRIMARY: 'ابتدائي',
    MIDDLE: 'إعدادي',
    SECONDARY: 'ثانوي',
    MIXED: 'مختلط',
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

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>استمارة تشخيص المؤسسة</title>
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
            padding: 15mm;
            min-height: 297mm;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #1e3a5f;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .header-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
          }
          .header-top div {
            font-size: 10px;
            line-height: 1.4;
          }
          .header h1 {
            font-size: 18px;
            color: #1e3a5f;
            margin-bottom: 5px;
          }
          .header h2 {
            font-size: 14px;
            color: #666;
            font-weight: 600;
          }
          .section {
            margin-bottom: 20px;
            break-inside: avoid;
          }
          .section-title {
            background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
            color: white;
            padding: 10px 16px;
            border-radius: 6px;
            margin-bottom: 12px;
            font-size: 14px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .section-number {
            background: white;
            color: #1e3a5f;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 14px;
          }
          .field-row {
            display: flex;
            border-bottom: 1px solid #e0e0e0;
            min-height: 36px;
          }
          .field-row:last-child {
            border-bottom: none;
          }
          .field-label {
            background: #f8f9fa;
            padding: 8px 12px;
            font-weight: 600;
            color: #555;
            width: 40%;
            border-left: 1px solid #e0e0e0;
            display: flex;
            align-items: center;
          }
          .field-value {
            padding: 8px 12px;
            width: 60%;
            display: flex;
            align-items: center;
            color: #333;
          }
          .fields-container {
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            overflow: hidden;
          }
          .two-columns {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .stats-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 10px;
          }
          .stats-table th {
            background: #1e3a5f;
            color: white;
            padding: 8px;
            text-align: center;
            font-weight: 600;
          }
          .stats-table td {
            padding: 6px 8px;
            border: 1px solid #e0e0e0;
            text-align: center;
          }
          .stats-table tr:nth-child(even) {
            background: #f8f9fa;
          }
          .signature-section {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            gap: 30px;
          }
          .signature-box {
            flex: 1;
            text-align: center;
            padding: 20px;
            border: 1px dashed #ccc;
            border-radius: 8px;
          }
          .signature-box h4 {
            margin-bottom: 40px;
            color: #555;
          }
          .signature-line {
            border-top: 1px solid #333;
            margin-top: 50px;
            padding-top: 5px;
            font-size: 10px;
            color: #666;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #1e3a5f;
            font-size: 10px;
            color: #999;
          }
          .checkbox {
            display: inline-block;
            width: 14px;
            height: 14px;
            border: 2px solid #1e3a5f;
            border-radius: 3px;
            margin-left: 5px;
            vertical-align: middle;
          }
          .checkbox.checked {
            background: #1e3a5f;
            position: relative;
          }
          .checkbox.checked::after {
            content: '✓';
            color: white;
            font-size: 10px;
            position: absolute;
            top: -1px;
            left: 1px;
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
              margin: 10mm; 
              size: A4; 
            }
            .page {
              padding: 0;
              min-height: auto;
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
                <div>
                  المملكة المغربية<br/>
                  وزارة التضامن والإدماج الاجتماعي والأسرة
                </div>
                <div>
                  التاريخ: ${dateStr}
                </div>
              </div>
              <h1>استمارة تشخيص مؤسسات الرعاية الاجتماعية</h1>
              <h2>التي تتكفل بالأطفال المتمدرسين (دور الطالب والطالبة)</h2>
            </div>

            <!-- Section 1: Basic Information -->
            <div class="section">
              <div class="section-title">
                <span class="section-number">I</span>
                المعلومات الأساسية
              </div>
              <div class="fields-container">
                <div class="field-row">
                  <div class="field-label">نوع المؤسسة</div>
                  <div class="field-value">${getLabelValue('institutionType', data.institutionType)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">الصفة القانونية</div>
                  <div class="field-value">${getLabelValue('legalStatus', data.legalStatus)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">اسم المؤسسة</div>
                  <div class="field-value">${getDisplayValue(data.institutionName)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">اسم الجمعية المسيرة</div>
                  <div class="field-value">${getDisplayValue(data.associationName)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">سنة التأسيس</div>
                  <div class="field-value">${getDisplayValue(data.creationYear)}</div>
                </div>
              </div>
            </div>

            <!-- Section 2: Geographic Location -->
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
              </div>
            </div>

            <!-- Section 3: Building Information -->
            <div class="section">
              <div class="section-title">
                <span class="section-number">III</span>
                معلومات البناية
              </div>
              <div class="fields-container">
                <div class="field-row">
                  <div class="field-label">طبيعة ملكية البناية</div>
                  <div class="field-value">${getLabelValue('buildingOwnership', data.buildingOwnership)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">حالة البناية</div>
                  <div class="field-value">${getLabelValue('buildingCondition', data.buildingCondition)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">المساحة الإجمالية (م²)</div>
                  <div class="field-value">${getDisplayValue(data.totalArea)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">عدد الطوابق</div>
                  <div class="field-value">${getDisplayValue(data.numberOfFloors)}</div>
                </div>
              </div>
            </div>

            <!-- Section 4: Beneficiaries -->
            <div class="section">
              <div class="section-title">
                <span class="section-number">IV</span>
                المستفيدون
              </div>
              <div class="fields-container">
                <div class="field-row">
                  <div class="field-label">الجنس المستهدف</div>
                  <div class="field-value">${getLabelValue('gender', data.beneficiaryGender)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">المستوى التعليمي</div>
                  <div class="field-value">${getLabelValue('educationLevel', data.educationLevel)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">الطاقة الاستيعابية</div>
                  <div class="field-value">${getDisplayValue(data.totalCapacity)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">العدد الفعلي للمستفيدين</div>
                  <div class="field-value">${getDisplayValue(data.currentOccupancy)}</div>
                </div>
              </div>
              
              ${data.beneficiaryStats ? `
              <table class="stats-table">
                <thead>
                  <tr>
                    <th>المستوى</th>
                    <th>ذكور</th>
                    <th>إناث</th>
                    <th>المجموع</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ابتدائي</td>
                    <td>${getDisplayValue(data.beneficiaryStats?.primaryMale, '0')}</td>
                    <td>${getDisplayValue(data.beneficiaryStats?.primaryFemale, '0')}</td>
                    <td>${(Number(data.beneficiaryStats?.primaryMale || 0) + Number(data.beneficiaryStats?.primaryFemale || 0))}</td>
                  </tr>
                  <tr>
                    <td>إعدادي</td>
                    <td>${getDisplayValue(data.beneficiaryStats?.middleMale, '0')}</td>
                    <td>${getDisplayValue(data.beneficiaryStats?.middleFemale, '0')}</td>
                    <td>${(Number(data.beneficiaryStats?.middleMale || 0) + Number(data.beneficiaryStats?.middleFemale || 0))}</td>
                  </tr>
                  <tr>
                    <td>ثانوي</td>
                    <td>${getDisplayValue(data.beneficiaryStats?.secondaryMale, '0')}</td>
                    <td>${getDisplayValue(data.beneficiaryStats?.secondaryFemale, '0')}</td>
                    <td>${(Number(data.beneficiaryStats?.secondaryMale || 0) + Number(data.beneficiaryStats?.secondaryFemale || 0))}</td>
                  </tr>
                </tbody>
              </table>
              ` : ''}
            </div>

            <!-- Section 5: Staff -->
            <div class="section">
              <div class="section-title">
                <span class="section-number">V</span>
                الموارد البشرية
              </div>
              <div class="fields-container">
                <div class="field-row">
                  <div class="field-label">عدد المديرين</div>
                  <div class="field-value">${getDisplayValue(data.directorsCount, '0')}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">عدد المشرفين</div>
                  <div class="field-value">${getDisplayValue(data.supervisorsCount, '0')}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">عدد الطباخين</div>
                  <div class="field-value">${getDisplayValue(data.cooksCount, '0')}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">عدد الحراس</div>
                  <div class="field-value">${getDisplayValue(data.guardsCount, '0')}</td>
                </div>
                <div class="field-row">
                  <div class="field-label">عدد عمال النظافة</div>
                  <div class="field-value">${getDisplayValue(data.cleanersCount, '0')}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">موظفون آخرون</div>
                  <div class="field-value">${getDisplayValue(data.otherStaffCount, '0')}</div>
                </div>
              </div>
            </div>

            <!-- Section 6: Financing -->
            <div class="section">
              <div class="section-title">
                <span class="section-number">VI</span>
                التمويل
              </div>
              <div class="fields-container">
                <div class="field-row">
                  <div class="field-label">الميزانية السنوية (درهم)</div>
                  <div class="field-value">${getDisplayValue(data.annualBudget)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">مصادر التمويل</div>
                  <div class="field-value">${getDisplayValue(data.fundingSources)}</div>
                </div>
              </div>
            </div>

            <!-- Signatures -->
            <div class="signature-section">
              <div class="signature-box">
                <h4>توقيع المدير</h4>
                <div class="signature-line">التاريخ: ____/____/________</div>
              </div>
              <div class="signature-box">
                <h4>ختم المؤسسة</h4>
                <div class="signature-line"></div>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              تقرير مُنشأ تلقائياً - نظام تشخيص مؤسسات الرعاية الاجتماعية
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
