"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { InstitutionResponse } from "@/lib/types";

// Priority criteria labels mapping
const priorityLabels: Record<string, string> = {
  socialSituation: "الوضعية الاجتماعية للأسرة",
  distance: "المسافة بين المدرسة ومحل سكن المستفيد",
  schoolResults: "النتائج المدرسية للمستفيد",
  scholarship: "الاستفادة من المنحة الدراسية",
  other: "آخر",
};

const getPriorityLabel = (value: string | undefined): string => {
  if (!value) return "—";
  return priorityLabels[value] || value;
};

// Register Arabic fonts
Font.register({
  family: "Amiri",
  fonts: [
    { src: "https://cdn.jsdelivr.net/npm/@fontsource/amiri@5.0.8/files/amiri-arabic-400-normal.woff", fontWeight: 400 },
    { src: "https://cdn.jsdelivr.net/npm/@fontsource/amiri@5.0.8/files/amiri-arabic-700-normal.woff", fontWeight: 700 },
  ],
});

Font.register({
  family: "Cairo",
  src: "https://cdn.jsdelivr.net/npm/@fontsource/cairo@5.0.8/files/cairo-arabic-400-normal.woff",
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Amiri",
    fontSize: 10,
    direction: "rtl",
    backgroundColor: "#fff",
  },
  // Header styles
  docHeader: {
    border: "2pt solid #111",
    marginBottom: 0,
  },
  docHeaderTop: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8pt 14pt",
    borderBottom: "2pt solid #111",
  },
  logoBlock: {
    flexDirection: "column",
    alignItems: "center",
    width: 80,
  },
  logoEmblem: {
    fontSize: 24,
    marginBottom: 2,
  },
  logoText: {
    textAlign: "center",
    fontWeight: 700,
    fontSize: 8,
  },
  logoSub: {
    color: "#444",
    fontSize: 7,
    textAlign: "center",
  },
  ministryBlock: {
    flex: 1,
    textAlign: "center",
    fontSize: 9,
    fontWeight: 700,
    lineHeight: 1.6,
    borderRight: "1pt solid #ccc",
    borderLeft: "1pt solid #ccc",
    padding: "0 12pt",
  },
  titleMain: {
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1.3,
    marginTop: 4,
  },
  titleSub: {
    fontSize: 12,
    fontWeight: 700,
    marginTop: 2,
  },
  // Section title
  sectionTitle: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    textAlign: "center",
    padding: "7pt 12pt",
    fontSize: 12,
    fontWeight: 700,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionNum: {
    backgroundColor: "#fff",
    color: "#1a1a1a",
    borderRadius: 11,
    width: 22,
    height: 22,
    textAlign: "center",
    fontSize: 11,
    fontWeight: 700,
    marginLeft: 8,
    paddingTop: 3,
  },
  // Form table
  formTable: {
    border: "1pt solid #111",
    borderTop: "none",
  },
  tableRow: {
    flexDirection: "row-reverse",
    borderBottom: "1pt solid #bbb",
    minHeight: 24,
  },
  labelCell: {
    backgroundColor: "#f5f5f5",
    fontWeight: 700,
    width: "35%",
    padding: "5pt 10pt",
    fontSize: 10,
    textAlign: "right",
    borderLeft: "1pt solid #bbb",
  },
  valueCell: {
    width: "65%",
    padding: "5pt 10pt",
    fontSize: 10,
    textAlign: "right",
  },
  // Checkbox styles
  cbRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
  },
  cbItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  checkbox: {
    width: 10,
    height: 10,
    border: "1pt solid #333",
    marginLeft: 3,
  },
  checkboxChecked: {
    width: 10,
    height: 10,
    border: "1pt solid #333",
    backgroundColor: "#333",
    marginLeft: 3,
  },
  // Inner table for statistics
  innerTable: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 9,
  },
  innerTableHeader: {
    flexDirection: "row-reverse",
    backgroundColor: "#2c2c2c",
  },
  innerTableHeaderCell: {
    color: "#fff",
    padding: "5pt 8pt",
    border: "1pt solid #555",
    fontSize: 8,
    textAlign: "center",
    flex: 1,
  },
  innerTableRow: {
    flexDirection: "row-reverse",
    borderBottom: "1pt solid #ccc",
  },
  innerTableCell: {
    border: "1pt solid #ccc",
    padding: "4pt 8pt",
    textAlign: "center",
    fontSize: 9,
    flex: 1,
  },
  innerTableLabelCell: {
    textAlign: "right",
    backgroundColor: "#fafafa",
    fontSize: 9,
    flex: 2,
    padding: "4pt 8pt",
    border: "1pt solid #ccc",
  },
  // Heading row
  headingRow: {
    flexDirection: "row-reverse",
    backgroundColor: "#e8e8e8",
    borderBottom: "1pt solid #999",
  },
  headingCell: {
    fontWeight: 700,
    fontSize: 10,
    textAlign: "center",
    padding: "5pt 10pt",
    width: "100%",
  },
  // Signature block
  sigBlock: {
    flexDirection: "row-reverse",
    border: "1pt solid #111",
    borderTop: "none",
  },
  sigCell: {
    borderLeft: "1pt solid #bbb",
    padding: "12pt 14pt",
    minHeight: 80,
    flex: 1,
    flexDirection: "column",
    gap: 6,
  },
  sigLabel: {
    fontSize: 9,
    fontWeight: 700,
    textAlign: "center",
    lineHeight: 1.4,
  },
  sigLine: {
    flex: 1,
    borderBottom: "1pt dashed #999",
    marginTop: 30,
  },
  // Page number
  pageNum: {
    textAlign: "left",
    fontSize: 9,
    color: "#666",
    padding: "4pt 8pt",
    border: "1pt solid #bbb",
    borderTop: "none",
  },
  pgTop: {
    borderTop: "2pt solid #111",
    marginTop: 15,
  },
});

interface InstitutionPDFProps {
  data: InstitutionResponse;
}

const Checkbox = ({ checked, label }: { checked: boolean; label: string }) => (
  <View style={styles.cbItem}>
    <View style={checked ? styles.checkboxChecked : styles.checkbox} />
    <Text>{label}</Text>
  </View>
);

const FormRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <View style={styles.tableRow}>
    <View style={styles.labelCell}>
      <Text>{label}</Text>
    </View>
    <View style={styles.valueCell}>{children}</View>
  </View>
);

const DataRow = ({ label, value }: { label: string; value: string | number | undefined | null }) => (
  <FormRow label={label}>
    <Text>{value ?? "-"}</Text>
  </FormRow>
);

const SectionTitle = ({ num, title }: { num: string; title: string }) => (
  <View style={styles.sectionTitle}>
    <View style={styles.sectionNum}>
      <Text>{num}</Text>
    </View>
    <Text>{title}</Text>
  </View>
);

export function InstitutionPDF({ data }: InstitutionPDFProps) {
  return (
    <Document>
      {/* Page 1: Institution Info */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.docHeader}>
          <View style={styles.docHeaderTop}>
            <View style={styles.logoBlock}>
              <Text style={styles.logoEmblem}>🇲🇦</Text>
              <Text style={styles.logoText}>المملكة المغربية</Text>
              <Text style={styles.logoSub}>وزارة الداخلية</Text>
            </View>
            <View style={styles.ministryBlock}>
              <Text style={{ fontSize: 8, color: "#555", marginBottom: 2 }}>
                المملكة المغربية — وزارة التضامن والإدماج الاجتماعي والأسرة
              </Text>
              <Text style={styles.titleMain}>
                تشخيص مؤسسات الرعاية الاجتماعية التي تتكفل بالأطفال المتمدرسين
              </Text>
              <Text style={styles.titleSub}>(دور الطالب والطالبة)</Text>
            </View>
            <View style={styles.logoBlock}>
              <Text style={styles.logoEmblem}>🏛️</Text>
              <Text style={styles.logoText}>وزارة التربية الوطني��</Text>
              <Text style={styles.logoSub}>والتعليم الأولي والرياضة</Text>
            </View>
          </View>
        </View>

        {/* Section I */}
        <SectionTitle num="I" title="معطيات حول المؤسسة" />
        <View style={styles.formTable}>
          <FormRow label="نوعية المؤسسة">
            <View style={styles.cbRow}>
              <Checkbox checked={data.institutionType === "DAR_TALIB"} label="دار الطالب" />
              <Checkbox checked={data.institutionType === "DAR_TALIBA"} label="دار الطالبة" />
              <Checkbox checked={data.institutionType === "DAR_TALIB_TALIBA"} label="دار الطالب والطالبة" />
            </View>
          </FormRow>
          <DataRow label="اسم الجمعية المشرفة" value={data.associationName} />
          <DataRow label="اسم المؤسسة" value={data.institutionName} />
          <DataRow label="العنوان" value={data.address} />
          <DataRow label="الجهة" value={data.regionName} />
          <DataRow label="العمالة أو الإقليم" value={data.prefectureName} />
          <DataRow label="الجماعة" value={data.communeName} />
          <FormRow label="المجال">
            <View style={styles.cbRow}>
              <Checkbox checked={data.milieu === "URBAIN"} label="حضري" />
              <Checkbox checked={data.milieu === "RURAL"} label="قروي" />
            </View>
          </FormRow>
          <DataRow label="سنة إحداث المؤسسة" value={data.creationYear} />
          <FormRow label="الوضعية القانونية للمؤسسة">
            <View style={styles.cbRow}>
              <Checkbox checked={data.legalStatus === "LICENSED"} label="مرخصة" />
              <Checkbox checked={data.legalStatus === "UNLICENSED"} label="غير مرخصة" />
            </View>
            {data.legalStatus === "UNLICENSED" && data.unlicensedReason && (
              <Text style={{ marginTop: 4, fontSize: 9 }}>أسباب عدم الترخيص: {data.unlicensedReason}</Text>
            )}
          </FormRow>
          <DataRow label="رقم وتاريخ الرخصة" value={data.licenseNumber} />
          <DataRow label="تاريخ شروع المؤسسة في تقديم خدماتها" value={data.serviceStartDate} />
          <FormRow label="الخدمات المقدمة بالمؤسسة">
            <View style={styles.cbRow}>
              <Checkbox checked={data.housing || false} label="الإيواء" />
              <Checkbox checked={data.meals || false} label="الإطعام" />
              <Checkbox checked={data.educationalSupport || false} label="التتبع التربوي والمواكبة الاجتماعية" />
            </View>
            <View style={[styles.cbRow, { marginTop: 4 }]}>
              <Checkbox checked={data.culturalActivities || false} label="التنشيط الثقافي والرياضي والترفيهي" />
              <Checkbox checked={data.healthCare || false} label="تأمين العلاجات الصحية الأولية" />
            </View>
            <View style={[styles.cbRow, { marginTop: 4 }]}>
              <Checkbox checked={data.psychologicalSupport || false} label="الدعم والمواكبة الطبية والنفسية" />
            </View>
          </FormRow>
          <DataRow label="الطاقة الاستيعابية الإجمالية المرخصة" value={data.totalCapacity} />
          <DataRow label="الطاقة الاستيعابية المرخصة ذكور" value={data.maleCapacity} />
          <DataRow label="الطاقة الاستيعابية المرخصة إناث" value={data.femaleCapacity} />
          <FormRow label="المستوى التعليمي للفئة المستهدفة">
            <View style={styles.cbRow}>
              <Checkbox checked={data.primary || false} label="ابتدائي" />
              <Checkbox checked={data.middleSchool || false} label="ثانوي إعدادي" />
              <Checkbox checked={data.highSchool || false} label="ثانوي تأهيلي" />
              <Checkbox checked={data.other || false} label={data.other && data.otherDetail ? `آخر: ${data.otherDetail}` : "آخر"} />
            </View>
          </FormRow>
          <FormRow label="البعد الجغرافي عن أقرب مؤسسة تعليمية مستقبلة للمستفيدين">
            <View style={styles.cbRow}>
              <Checkbox checked={data.distanceToSchool === "INSIDE_INSTITUTION"} label="داخل المؤسسة التعليمية" />
              <Checkbox checked={data.distanceToSchool === "LESS_THAN_1KM"} label="أقل من 1 كلم" />
              <Checkbox checked={data.distanceToSchool === "BETWEEN_1_AND_5KM"} label="بين 1 و5 كلم" />
              <Checkbox checked={data.distanceToSchool === "MORE_THAN_5KM"} label="أكثر من 5 كلم" />
            </View>
          </FormRow>
          <FormRow label="البعد الجغرافي عن أقرب داخلية تابعة لقطاع التربية الوطنية">
            <View style={styles.cbRow}>
              <Checkbox checked={data.distanceToNationalBoardingSchool === "LESS_THAN_1KM"} label="أقل من 1 كلم" />
              <Checkbox checked={data.distanceToNationalBoardingSchool === "BETWEEN_1_AND_5KM"} label="بين 1 و5 كلم" />
              <Checkbox checked={data.distanceToNationalBoardingSchool === "MORE_THAN_5KM"} label="أكثر من 5 كلم" />
            </View>
          </FormRow>
        </View>
        <View style={styles.pageNum}><Text>1 sur 5</Text></View>
      </Page>

      {/* Page 2: Building & Financing */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pgTop}>
          <SectionTitle num="II" title="معطيات حول البناية المخصصة للمؤسسة" />
        </View>
        <View style={styles.formTable}>
          <FormRow label="وضعية البناية">
            <View style={styles.cbRow}>
              <Checkbox checked={data.building?.buildingStatus === "RENTAL"} label="إيجار" />
              <Checkbox checked={data.building?.buildingStatus === "OWNED"} label="ملكية" />
              <Checkbox checked={data.building?.buildingStatus === "AT_DISPOSAL"} label="وضع رهن إشارة المؤسسة" />
              <Checkbox checked={data.building?.buildingStatus === "OTHER"} label={data.building?.buildingStatus === "OTHER" && data.building?.buildingStatusOther ? `آخر: ${data.building.buildingStatusOther}` : "آخر"} />
            </View>
          </FormRow>
          <FormRow label="الحالة العامة للبناية">
            <View style={styles.cbRow}>
              <Checkbox checked={data.building?.buildingCondition === "GOOD"} label="جيدة" />
              <Checkbox checked={data.building?.buildingCondition === "SOME_DEGRADATION"} label="بعض علامات التدهور" />
              <Checkbox checked={data.building?.buildingCondition === "BAD"} label="مردية" />
            </View>
          </FormRow>
          <FormRow label="قابلية البناية للترميم والإصلاح">
            <View style={styles.cbRow}>
              <Checkbox checked={data.building?.renovationCapacity === "EASY"} label="سهلة" />
              <Checkbox checked={data.building?.renovationCapacity === "DIFFICULT"} label="صعبة" />
              <Checkbox checked={data.building?.renovationCapacity === "NEEDS_RECONSTRUCTION"} label="تتطلب إعادة البناء" />
            </View>
          </FormRow>
          <FormRow label="تحد��د مالك الوعاء العقاري">
            <View style={styles.cbRow}>
              <Checkbox checked={data.building?.ownerType === "STATE_DOMAIN"} label="أملاك الدولة" />
              <Checkbox checked={data.building?.ownerType === "COMMUNAL"} label="ملك جماعي" />
              <Checkbox checked={data.building?.ownerType === "PRIVATE"} label="ملك خصوصي" />
              <Checkbox checked={data.building?.ownerType === "OTHER"} label={data.building?.ownerType === "OTHER" && data.building?.ownerTypeOther ? `آخر: ${data.building.ownerTypeOther}` : "آخر"} />
            </View>
          </FormRow>
          <FormRow label="وضع البناية رهن إشارة المؤسسة بموجب اتفاقية شراكة">
            <View style={styles.cbRow}>
              <Checkbox checked={data.building?.hasPartnershipAgreement === true} label="نعم" />
              <Checkbox checked={data.building?.hasPartnershipAgreement === false} label="لا" />
            </View>
          </FormRow>
        </View>

        <View style={styles.pgTop}>
          <SectionTitle num="III" title="معطيات حول تمويل المؤسسة" />
        </View>
        <View style={styles.formTable}>
          <FormRow label="تمويل بناء المؤسسة">
            <View style={styles.cbRow}>
              <Checkbox checked={data.financing?.constructionByMinistry || false} label="وزارة التضامن والإدماج الاجتماعي والأسرة" />
              <Checkbox checked={data.financing?.constructionByCooperation || false} label="التعاون الوطني" />
            </View>
            <View style={[styles.cbRow, { marginTop: 4 }]}>
              <Checkbox checked={data.financing?.constructionByINDH || false} label="المبادرة الوطنية للتنمية البشرية" />
              <Checkbox checked={data.financing?.constructionByCouncil || false} label="الجماعة" />
              <Checkbox checked={data.financing?.constructionByMohamed5 || false} label="مؤسسة محمد الخامس للتضامن" />
            </View>
            <View style={[styles.cbRow, { marginTop: 4 }]}>
              <Checkbox checked={data.financing?.constructionByPromotion || false} label="الإنعاش الوطني" />
              <Checkbox checked={data.financing?.constructionByAssociation || false} label="جمعية / مؤسسة" />
              <Checkbox checked={data.financing?.constructionByOther || false} label={data.financing?.constructionByOther && data.financing?.otherConstructionDetail ? `آخر: ${data.financing.otherConstructionDetail}` : "آخر"} />
            </View>
          </FormRow>
          <FormRow label="تمويل تجهيز المؤسسة">
            <View style={styles.cbRow}>
              <Checkbox checked={data.financing?.equipmentByMinistry || false} label="وزارة التضامن والإدماج الاجتماعي والأسرة" />
              <Checkbox checked={data.financing?.equipmentByCooperation || false} label="التعاون الوطني" />
            </View>
            <View style={[styles.cbRow, { marginTop: 4 }]}>
              <Checkbox checked={data.financing?.equipmentByINDH || false} label="المبادرة الوطنية للتنمية البشرية" />
              <Checkbox checked={data.financing?.equipmentByCouncil || false} label="الجماعة" />
              <Checkbox checked={data.financing?.equipmentByMohamed5 || false} label="مؤسسة محمد الخامس للتضامن" />
            </View>
            <View style={[styles.cbRow, { marginTop: 4 }]}>
              <Checkbox checked={data.financing?.equipmentByAssociation || false} label="جمعية / مؤسسة" />
              <Checkbox checked={data.financing?.equipmentByOther || false} label={data.financing?.equipmentByOther && data.financing?.equipmentOtherDetail ? `آخر: ${data.financing.equipmentOtherDetail}` : "آخر"} />
            </View>
          </FormRow>
          <DataRow label="الكلفة الإجمالية لبناء المؤسسة" value={data.financing?.totalConstructionCost ? `${data.financing.totalConstructionCost} درهم` : "-"} />
          <DataRow label="الكلفة السنوية لتسيير المؤسسة" value={data.financing?.annualOperatingCost ? `${data.financing.annualOperatingCost} درهم` : "-"} />
          <FormRow label="مصادر تمويل تسيير المؤسسة">
            <View style={styles.cbRow}>
              <Checkbox checked={data.financing?.operatingByINDH || false} label="المبادرة الوطنية للتنمية البشرية" />
              <Checkbox checked={data.financing?.operatingByCooperation || false} label="التعاون الوطني" />
              <Checkbox checked={data.financing?.operatingByEducation || false} label="قطاع التربية الوطنية" />
            </View>
            <View style={[styles.cbRow, { marginTop: 4 }]}>
              <Checkbox checked={data.financing?.operatingByCouncil || false} label="الجماعة" />
              <Checkbox checked={data.financing?.operatingByParents || false} label="اشتراكات الآباء" />
              <Checkbox checked={data.financing?.operatingByDonors || false} label="المحسنون (هبات وغيرها)" />
            </View>
            <View style={[styles.cbRow, { marginTop: 4 }]}>
              <Checkbox checked={data.financing?.operatingByAssociation || false} label="مصادر ذاتية للجمعية المسيرة" />
              <Checkbox checked={data.financing?.operatingByOther || false} label={data.financing?.operatingByOther && data.financing?.operatingOtherDetail ? `آخر: ${data.financing.operatingOtherDetail}` : "آخر"} />
            </View>
          </FormRow>
          <DataRow label="الكلفة السنوية المخصصة للموارد البشرية" value={data.financing?.annualHRCost ? `${data.financing.annualHRCost} درهم` : "-"} />
          <FormRow label="الكلفة السنوية المخصصة للإطعام">
            <View>
              <Text style={{ marginBottom: 4 }}>المبلغ الإجمالي: {data.financing?.totalMealsCost ? `${data.financing.totalMealsCost} درهم` : "-"}</Text>
              <Text style={{ fontSize: 9 }}>▪ نسبة مساهمة الجمعية المسيرة: {data.financing?.mealsAssociationShare || "-"}%</Text>
              <Text style={{ fontSize: 9 }}>▪ نسبة مساهمة قطاع التربية الوطنية: {data.financing?.mealsEducationShare || "-"}%</Text>
              <Text style={{ fontSize: 9 }}>▪ نسبة مساهمة أخرى: {data.financing?.mealsOtherShare || "-"}%</Text>
            </View>
          </FormRow>
          <DataRow label="الكلفة السنوية لباقي النفقات" value={data.financing?.annualOtherCost ? `${data.financing.annualOtherCost} درهم` : "-"} />
          <DataRow label="الكلفة السنوية للتكفل بكل مستفيد (الكلفة الفردية)" value={data.financing?.costPerBeneficiary ? `${data.financing.costPerBeneficiary} درهم` : "-"} />
        </View>
        <View style={styles.pageNum}><Text>2 sur 5</Text></View>
      </Page>

      {/* Page 3: Targeting & Services */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pgTop}>
          <SectionTitle num="IV" title="معطيات حول الاستهداف وتسعيرة الخدمات" />
        </View>
        <View style={styles.formTable}>
          <FormRow label="المعايير المعتمدة في الاستهداف">
            <View style={styles.cbRow}>
              <Checkbox checked={data.targeting?.povertyBased || false} label=".1 الوضعية الاجتماعية للأسرة" />
              <Checkbox checked={data.targeting?.distanceBased || false} label=".2 المسافة بين المدرسة ومحل سكن المستفيد" />
            </View>
            <View style={[styles.cbRow, { marginTop: 4 }]}>
              <Checkbox checked={data.targeting?.resultsBased || false} label=".3 النتائج المدرسية للمستفيد" />
              <Checkbox checked={data.targeting?.scholarshipBased || false} label=".4 الاستفادة من المنحة الدراسية" />
              <Checkbox checked={data.targeting?.otherCriteria || false} label={data.targeting?.otherCriteria && data.targeting?.otherCriteriaDetail ? `.5 آخر: ${data.targeting.otherCriteriaDetail}` : ".5 آخر"} />
            </View>
          </FormRow>
          <FormRow label="تصنيف المعايير حسب الأولوية">
            <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", marginTop: 4 }}>
              <Text style={{ fontSize: 9 }}>الأولوية 1: {getPriorityLabel(data.targeting?.priority1)}</Text>
              <Text style={{ fontSize: 9 }}>الأولوية 2: {getPriorityLabel(data.targeting?.priority2)}</Text>
              <Text style={{ fontSize: 9 }}>الأولوية 3: {getPriorityLabel(data.targeting?.priority3)}</Text>
              <Text style={{ fontSize: 9 }}>الأولوية 4: {getPriorityLabel(data.targeting?.priority4)}</Text>
              <Text style={{ fontSize: 9 }}>الأولوية 5: {getPriorityLabel(data.targeting?.priority5)}</Text>
            </View>
          </FormRow>
          <FormRow label="الجهة التي تقوم بعملية انتقاء المستفيدين">
            <View style={styles.cbRow}>
              <Checkbox checked={data.targeting?.selectionBody === "ASSOCIATION_ALONE"} label="-1 الجمعية بمفردها" />
              <Checkbox checked={data.targeting?.selectionBody === "MIXED_COMMITTEE"} label="-2 لجنة مختلطة تضم:" />
            </View>
            {data.targeting?.selectionBody === "MIXED_COMMITTEE" && (
              <View style={[styles.cbRow, { marginTop: 4, paddingRight: 20 }]}>
                <Checkbox checked={data.targeting?.committeeHasAssociation || false} label="الجمعية" />
                <Checkbox checked={data.targeting?.committeeHasCooperation || false} label="التعاون الوطني" />
                <Checkbox checked={data.targeting?.committeeHasEducation || false} label="التربية الوطنية" />
                <Checkbox checked={data.targeting?.committeeHasCouncil || false} label="الجماعة" />
                <Checkbox checked={data.targeting?.committeeHasAuthority || false} label="السلطات المحلية" />
              </View>
            )}
          </FormRow>
          <DataRow label="عدد الطلبات لم تتم الاستجابة لها برسم الموسم الدراسي الحالي" value={data.targeting?.unmetRequestsCount} />
          <FormRow label="خدمات المؤسسة">
            <View style={styles.cbRow}>
              <Checkbox checked={data.targeting?.servicesAreFree === true} label="مجانية" />
              <Checkbox checked={data.targeting?.servicesAreFree === false} label="باشتراك" />
            </View>
          </FormRow>
          {!data.targeting?.servicesAreFree && (
            <FormRow label="مبلغ الاشتراك الشهري لكل مستفيد (بالدرهم)">
              <View style={styles.cbRow}>
                <Checkbox checked={data.targeting?.tariffType === "UNIFORM"} label="-1 تعريفة موحدة" />
              </View>
              {data.targeting?.tariffType === "UNIFORM" && (
                <Text style={{ fontSize: 9, marginTop: 2 }}>قيمتها: {data.targeting?.fixedTariffAmount || "-"} درهم</Text>
              )}
              <Text style={{ marginTop: 4, fontSize: 9 }}>-2 تعريفة غير موحدة قيمتها:</Text>
              <View style={[styles.cbRow, { marginTop: 4, paddingRight: 16 }]}>
                <Checkbox checked={data.targeting?.tariffBracket === "LESS_THAN_50"} label="50 درهم أو أقل" />
                <Checkbox checked={data.targeting?.tariffBracket === "BETWEEN_50_AND_100"} label="بين 50 و100 درهم" />
                <Checkbox checked={data.targeting?.tariffBracket === "BETWEEN_100_AND_200"} label="بين 100 و200 درهم" />
                <Checkbox checked={data.targeting?.tariffBracket === "MORE_THAN_200"} label="أكثر من 200 درهم" />
              </View>
            </FormRow>
          )}
          <FormRow label="من يحدد مبلغ الاشتراك الشهري لكل مستفيد">
            <View style={styles.cbRow}>
              <Checkbox checked={data.targeting?.tariffDecisionBody === "ASSOCIATION_ALONE"} label="-1 الجمعية بمفردها" />
              <Checkbox checked={data.targeting?.tariffDecisionBody === "MIXED_COMMITTEE"} label="-2 لجنة مختلطة" />
            </View>
          </FormRow>
        </View>
        <View style={styles.pageNum}><Text>3 sur 5</Text></View>
      </Page>

      {/* Page 4: Housing & Meals */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pgTop}>
          <SectionTitle num="V" title="الإيواء والإطعام بالمؤسسة" />
        </View>
        <View style={styles.formTable}>
          <View style={styles.headingRow}>
            <View style={styles.headingCell}>
              <Text>-1 بالنسبة لخدمة الإيواء — عدد المستفيدين من خدمة الإيواء</Text>
            </View>
          </View>
          
          {/* Statistics Table */}
          <View style={{ padding: 0 }}>
            <View style={styles.innerTableHeader}>
              <View style={[styles.innerTableHeaderCell, { flex: 2 }]}>
                <Text>البيان</Text>
              </View>
              <View style={styles.innerTableHeaderCell}>
                <Text>2023–2024</Text>
              </View>
              <View style={styles.innerTableHeaderCell}>
                <Text>2024–2025</Text>
              </View>
              <View style={styles.innerTableHeaderCell}>
                <Text>2025–2026</Text>
              </View>
            </View>
            {[
              { label: "العدد الإجمالي للمستفيدين فعليا", y1: data.housingMeals?.totalBeneficiaries2023, y2: data.housingMeals?.totalBeneficiaries2024, y3: data.housingMeals?.totalBeneficiaries2025 },
              { label: "الذكور", y1: data.housingMeals?.maleBeneficiaries2023, y2: data.housingMeals?.maleBeneficiaries2024, y3: data.housingMeals?.maleBeneficiaries2025 },
              { label: "الإناث", y1: data.housingMeals?.femaleBeneficiaries2023, y2: data.housingMeals?.femaleBeneficiaries2024, y3: data.housingMeals?.femaleBeneficiaries2025 },
              { label: "الابتدائي", y1: data.housingMeals?.primaryBeneficiaries2023, y2: data.housingMeals?.primaryBeneficiaries2024, y3: data.housingMeals?.primaryBeneficiaries2025 },
              { label: "الثانوي الإعدادي", y1: data.housingMeals?.middleBeneficiaries2023, y2: data.housingMeals?.middleBeneficiaries2024, y3: data.housingMeals?.middleBeneficiaries2025 },
              { label: "الثانوي التأهيلي", y1: data.housingMeals?.highBeneficiaries2023, y2: data.housingMeals?.highBeneficiaries2024, y3: data.housingMeals?.highBeneficiaries2025 },
              { label: "آخر", y1: data.housingMeals?.otherBeneficiaries2023, y2: data.housingMeals?.otherBeneficiaries2024, y3: data.housingMeals?.otherBeneficiaries2025 },
            ].map((row, idx) => (
              <View key={idx} style={styles.innerTableRow}>
                <View style={styles.innerTableLabelCell}>
                  <Text>{row.label}</Text>
                </View>
                <View style={styles.innerTableCell}>
                  <Text>{row.y1 ?? "-"}</Text>
                </View>
                <View style={styles.innerTableCell}>
                  <Text>{row.y2 ?? "-"}</Text>
                </View>
                <View style={styles.innerTableCell}>
                  <Text>{row.y3 ?? "-"}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.headingRow}>
            <View style={styles.headingCell}>
              <Text>-2 بالنسبة لخدمة الإطعام خلال الموسم الدراسي 2025–2026</Text>
            </View>
          </View>
          <DataRow label="العدد الإجمالي للمستفيدين فعليا من هذه الخدمة" value={data.housingMeals?.totalMealBeneficiaries} />
          <DataRow label="العدد الإجمالي للمستفيدين من خدمة الإطعام الممول من طرف الجمعية" value={data.housingMeals?.associationMealBeneficiaries} />
          <DataRow label="العدد الإجمالي للمستفيدين من خدمة الإطعام التي يؤمنها قطاع التربية الوطنية" value={data.housingMeals?.educationMealBeneficiaries} />
          <DataRow label="عدد المستفيدين من منحة كاملة" value={data.housingMeals?.fullScholarshipCount} />
          <DataRow label="عدد المستفيدين من نصف منحة (وجبة غذاء)" value={data.housingMeals?.halfScholarshipCount} />
          <FormRow label="نوعية خدمة الإطعام المقدمة">
            <View style={styles.cbRow}>
              <Checkbox checked={data.housingMeals?.mealServiceType === "INSTITUTION_KITCHEN"} label="إعداد الوجبات في مطبخ المؤسسة" />
              <Checkbox checked={data.housingMeals?.mealServiceType === "READY_MEALS"} label="وجبات جاهزة" />
              <Checkbox checked={data.housingMeals?.mealServiceType === "OTHER"} label={data.housingMeals?.mealServiceType === "OTHER" && data.housingMeals?.mealServiceTypeOther ? `آخر: ${data.housingMeals.mealServiceTypeOther}` : "آخر"} />
            </View>
          </FormRow>
          <FormRow label="مقترحاتكم من أجل تحسين جودة الإطعام بالمؤسسة">
            <View style={styles.cbRow}>
              <Checkbox checked={data.housingMeals?.improveByExternalSupplier || false} label="اللجوء إلى ممون خارجي" />
              <Checkbox checked={data.housingMeals?.improveByMoreFood || false} label="زيادة المواد الغذائية وتجويدها" />
              <Checkbox checked={data.housingMeals?.improveByReadyMeals || false} label="تقديم وجبات جاهزة" />
              <Checkbox checked={data.housingMeals?.improveByOther || false} label={data.housingMeals?.improveByOther && data.housingMeals?.otherSuggestionDetail ? `آخر: ${data.housingMeals.otherSuggestionDetail}` : "آخر"} />
            </View>
          </FormRow>
        </View>
        <View style={styles.pageNum}><Text>4 sur 5</Text></View>
      </Page>

      {/* Page 5: Staff */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pgTop}>
          <SectionTitle num="VI" title="معطيات حول الموارد البشرية العاملة بالمؤسسة" />
        </View>
        <View style={styles.formTable}>
          <View style={{ padding: 0 }}>
            <View style={styles.innerTableHeader}>
              <View style={[styles.innerTableHeaderCell, { flex: 1.5 }]}>
                <Text>نوع التأطير</Text>
              </View>
              <View style={styles.innerTableHeaderCell}>
                <Text>عدد المستخدمين</Text>
              </View>
              <View style={styles.innerTableHeaderCell}>
                <Text>الأطر الموضوعة رهن الإشارة</Text>
              </View>
              <View style={styles.innerTableHeaderCell}>
                <Text>الأطر المتطوعة</Text>
              </View>
              <View style={styles.innerTableHeaderCell}>
                <Text>CNSS</Text>
              </View>
              <View style={styles.innerTableHeaderCell}>
                <Text>SMIG</Text>
              </View>
            </View>
            {(data.staff || []).map((s, idx) => (
              <View key={idx} style={styles.innerTableRow}>
                <View style={[styles.innerTableLabelCell, { flex: 1.5 }]}>
                  <Text>{s.staffType || "-"}</Text>
                </View>
                <View style={styles.innerTableCell}>
                  <Text>{s.employeeCount ?? "-"}</Text>
                </View>
                <View style={styles.innerTableCell}>
                  <Text>{s.secondedCount ?? "-"}</Text>
                </View>
                <View style={styles.innerTableCell}>
                  <Text>{s.volunteerCount ?? "-"}</Text>
                </View>
                <View style={styles.innerTableCell}>
                  <Text>{s.hasCNSS ? "نعم" : "لا"}</Text>
                </View>
                <View style={styles.innerTableCell}>
                  <Text>{s.hasSMIG ? "نعم" : "لا"}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.pageNum}><Text>5 sur 5</Text></View>

        {/* Signature Block */}
        <View style={[styles.sigBlock, { marginTop: 20 }]}>
          <View style={styles.sigCell}>
            <Text style={styles.sigLabel}>توقيع رئيس الجهة المدبرة لدار الطالب(ة)</Text>
            <View style={styles.sigLine} />
          </View>
          <View style={styles.sigCell}>
            <Text style={styles.sigLabel}>تأشيرة المدير الإقليمي للتعاون الوطني</Text>
            <View style={styles.sigLine} />
          </View>
          <View style={[styles.sigCell, { borderLeft: "none" }]}>
            <Text style={styles.sigLabel}>تأشيرة المدير الإقليمي لوزارة التربية الوطنية</Text>
            <View style={styles.sigLine} />
          </View>
        </View>
        <View style={{ border: "1pt solid #111", borderTop: "1pt solid #bbb", padding: "12pt 14pt", minHeight: 70 }}>
          <Text style={[styles.sigLabel, { marginBottom: 30 }]}>تأشيرة رئيس قسم العمل الاجتماعي</Text>
          <View style={{ borderBottom: "1pt dashed #999" }} />
        </View>
      </Page>
    </Document>
  );
}
