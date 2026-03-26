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
import {
  institutionTypeLabels,
  milieuLabels,
  legalStatusLabels,
  buildingStatusLabels,
  buildingConditionLabels,
  renovationCapacityLabels,
  ownerTypeLabels,
  selectionBodyLabels,
  tariffTypeLabels,
  tariffBracketLabels,
  mealServiceTypeLabels,
  staffTypeLabels,
  distanceLabels,
} from "@/lib/types";

// Register Arabic font
Font.register({
  family: "Amiri",
  src: "https://cdn.jsdelivr.net/npm/@fontsource/amiri@5.0.8/files/amiri-arabic-400-normal.woff",
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Amiri",
    fontSize: 10,
    direction: "rtl",
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottom: "2px solid #000",
    paddingBottom: 10,
  },
  headerRight: {
    textAlign: "right",
  },
  headerLeft: {
    textAlign: "left",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    backgroundColor: "#f0f0f0",
    padding: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    backgroundColor: "#e0e0e0",
    padding: 5,
    marginTop: 15,
    marginBottom: 10,
    textAlign: "right",
  },
  row: {
    flexDirection: "row-reverse",
    borderBottom: "1px solid #ccc",
    paddingVertical: 4,
  },
  label: {
    width: "40%",
    textAlign: "right",
    fontWeight: "bold",
    paddingRight: 5,
  },
  value: {
    width: "60%",
    textAlign: "right",
    paddingLeft: 5,
  },
  checkboxRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    marginBottom: 5,
  },
  checkboxItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginLeft: 15,
    marginBottom: 3,
  },
  checkbox: {
    width: 10,
    height: 10,
    border: "1px solid #000",
    marginLeft: 3,
  },
  checkboxChecked: {
    width: 10,
    height: 10,
    border: "1px solid #000",
    backgroundColor: "#000",
    marginLeft: 3,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row-reverse",
    backgroundColor: "#e0e0e0",
    borderBottom: "1px solid #000",
    padding: 5,
  },
  tableRow: {
    flexDirection: "row-reverse",
    borderBottom: "1px solid #ccc",
    padding: 4,
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 8,
  },
  tableCellHeader: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 8,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#666",
  },
  pageNumber: {
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
  },
  gridRow: {
    flexDirection: "row-reverse",
    marginBottom: 5,
  },
  gridCell: {
    flex: 1,
    paddingHorizontal: 5,
  },
  subSection: {
    marginTop: 10,
    marginBottom: 5,
    paddingRight: 10,
  },
  subSectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 5,
    textDecoration: "underline",
  },
});

interface InstitutionPDFProps {
  data: InstitutionResponse;
}

const Checkbox = ({ checked, label }: { checked: boolean; label: string }) => (
  <View style={styles.checkboxItem}>
    <View style={checked ? styles.checkboxChecked : styles.checkbox} />
    <Text>{label}</Text>
  </View>
);

const DataRow = ({ label, value }: { label: string; value: string | number | undefined | null }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value ?? "-"}</Text>
  </View>
);

export function InstitutionPDF({ data }: InstitutionPDFProps) {
  return (
    <Document>
      {/* Page 1: Institution Info */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerRight}>
            <Text>المملكة المغربية</Text>
            <Text>وزارة الداخلية</Text>
          </View>
          <View style={styles.headerLeft}>
            <Text>Royaume du Maroc</Text>
            <Text>Ministère de l&apos;Intérieur</Text>
          </View>
        </View>

        <Text style={styles.title}>
          تشخيص مؤسسات الرعاية الاجتماعية التي تتكفل بالأطفال المتمدرسين
          {"\n"}(دور الطالب والطالبة)
        </Text>

        <Text style={styles.sectionTitle}>I. معطيات حول المؤسسة</Text>

        <View style={styles.row}>
          <Text style={styles.label}>نوعية المؤسسة</Text>
          <View style={[styles.value, styles.checkboxRow]}>
            <Checkbox checked={data.institutionType === "DAR_TALIB"} label="دار الطالب" />
            <Checkbox checked={data.institutionType === "DAR_TALIBA"} label="دار الطالبة" />
            <Checkbox checked={data.institutionType === "DAR_TALIB_TALIBA"} label="دار الطالب والطالبة" />
          </View>
        </View>

        <DataRow label="اسم الجمعية المشرفة" value={data.associationName} />
        <DataRow label="اسم المؤسسة" value={data.institutionName} />
        <DataRow label="العنوان" value={data.address} />
        <DataRow label="الجهة" value={data.regionName} />
        <DataRow label="العمالة أو الإقليم" value={data.prefectureName} />
        <DataRow label="الجماعة" value={data.communeName} />

        <View style={styles.row}>
          <Text style={styles.label}>المجال</Text>
          <View style={[styles.value, styles.checkboxRow]}>
            <Checkbox checked={data.milieu === "RURAL"} label="قروي" />
            <Checkbox checked={data.milieu === "URBAIN"} label="حضري" />
          </View>
        </View>

        <DataRow label="سنة إحداث المؤسسة" value={data.creationYear} />

        <View style={styles.row}>
          <Text style={styles.label}>الوضعية القانونية للمؤسسة</Text>
          <View style={[styles.value, styles.checkboxRow]}>
            <Checkbox checked={data.legalStatus === "LICENSED"} label="مرخصة" />
            <Checkbox checked={data.legalStatus === "UNLICENSED"} label="غير مرخصة" />
          </View>
        </View>

        <DataRow label="رقم وتاريخ الرخصة" value={data.licenseNumber} />
        <DataRow label="تاريخ شروع المؤسسة في تقديم خدماتها" value={data.serviceStartDate} />

        <View style={styles.subSection}>
          <Text style={styles.subSectionTitle}>الخدمات المقدمة بالمؤسسة</Text>
          <View style={styles.checkboxRow}>
            <Checkbox checked={data.housing || false} label="الإيواء" />
            <Checkbox checked={data.meals || false} label="الإطعام" />
            <Checkbox checked={data.educationalSupport || false} label="التتبع التربوي والمواكبة الاجتماعية" />
            <Checkbox checked={data.culturalActivities || false} label="التنشيط الثقافي والرياضي والترفيهي" />
            <Checkbox checked={data.healthCare || false} label="تأمير العلاجات الصحية الأولية" />
            <Checkbox checked={data.psychologicalSupport || false} label="الدعم والمواكبة الطبية والنفسية" />
          </View>
        </View>

        <DataRow label="الطاقة الاستيعابية الإجمالية المرخصة" value={data.totalCapacity} />
        <DataRow label="الطاقة الاستيعابية المرخصة ذكور" value={data.maleCapacity} />
        <DataRow label="الطاقة الاستيعابية المرخصة إناث" value={data.femaleCapacity} />

        <View style={styles.subSection}>
          <Text style={styles.subSectionTitle}>المستوى التعليمي للفئة المستهدفة</Text>
          <View style={styles.checkboxRow}>
            <Checkbox checked={data.primary || false} label="ابتدائي" />
            <Checkbox checked={data.middleSchool || false} label="ثانوي إعدادي" />
            <Checkbox checked={data.highSchool || false} label="ثانوي تأهيلي" />
            <Checkbox checked={data.other || false} label="آخر" />
          </View>
        </View>

        <DataRow 
          label="البعد الجغرافي عن أقرب مؤسسة تعليمية" 
          value={data.distanceToSchool ? distanceLabels[data.distanceToSchool] : "-"} 
        />
        <DataRow 
          label="البعد الجغرافي عن أقرب داخلية تابعة لقطاع التربية الوطنية" 
          value={data.distanceToNationalBoardingSchool ? distanceLabels[data.distanceToNationalBoardingSchool] : "-"} 
        />

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>

      {/* Page 2: Building & Financing */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>II. معطيات حول البناية المخصصة للمؤسسة</Text>

        <View style={styles.row}>
          <Text style={styles.label}>وضعية البناية</Text>
          <View style={[styles.value, styles.checkboxRow]}>
            <Checkbox checked={data.building?.buildingStatus === "RENTAL"} label="إيجار" />
            <Checkbox checked={data.building?.buildingStatus === "OWNED"} label="ملكية" />
            <Checkbox checked={data.building?.buildingStatus === "AT_DISPOSAL"} label="وضع رهن إشارة المؤسسة" />
            <Checkbox checked={data.building?.buildingStatus === "OTHER"} label="آخر" />
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>الحالة العامة للبناية</Text>
          <View style={[styles.value, styles.checkboxRow]}>
            <Checkbox checked={data.building?.buildingCondition === "GOOD"} label="جيدة" />
            <Checkbox checked={data.building?.buildingCondition === "SOME_DEGRADATION"} label="بعض علامات التدهور" />
            <Checkbox checked={data.building?.buildingCondition === "BAD"} label="مردية" />
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>قابلية البناية للترميم والإصلاح</Text>
          <View style={[styles.value, styles.checkboxRow]}>
            <Checkbox checked={data.building?.renovationCapacity === "EASY"} label="سهلة" />
            <Checkbox checked={data.building?.renovationCapacity === "DIFFICULT"} label="صعبة" />
            <Checkbox checked={data.building?.renovationCapacity === "NEEDS_RECONSTRUCTION"} label="تتطلب إعادة البناء" />
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>تحديد مالك الوعاء العقاري</Text>
          <View style={[styles.value, styles.checkboxRow]}>
            <Checkbox checked={data.building?.ownerType === "STATE_DOMAIN"} label="أملاك الدولة" />
            <Checkbox checked={data.building?.ownerType === "COMMUNAL"} label="ملك جماعي" />
            <Checkbox checked={data.building?.ownerType === "PRIVATE"} label="ملك خصوصي" />
            <Checkbox checked={data.building?.ownerType === "OTHER"} label="آخر" />
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>وضع البناية رهن إشارة المؤسسة بموجب اتفاقية شراكة</Text>
          <View style={[styles.value, styles.checkboxRow]}>
            <Checkbox checked={data.building?.hasPartnershipAgreement === true} label="نعم" />
            <Checkbox checked={data.building?.hasPartnershipAgreement === false} label="لا" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>III. معطيات حول تمويل المؤسسة</Text>

        <View style={styles.subSection}>
          <Text style={styles.subSectionTitle}>تمويل بناء المؤسسة</Text>
          <View style={styles.checkboxRow}>
            <Checkbox checked={data.financing?.constructionByMinistry || false} label="وزارة التضامن والإدماج الاجتماعي والأسرة" />
            <Checkbox checked={data.financing?.constructionByINDH || false} label="المبادرة الوطنية للتنمية البشرية" />
            <Checkbox checked={data.financing?.constructionByCouncil || false} label="الجماعة" />
            <Checkbox checked={data.financing?.constructionByAssociation || false} label="جمعية/مؤسسة" />
            <Checkbox checked={data.financing?.constructionByDonors || false} label="محسنون" />
            <Checkbox checked={data.financing?.constructionByOther || false} label="آخر" />
          </View>
        </View>

        <View style={styles.subSection}>
          <Text style={styles.subSectionTitle}>تمويل تجهيز المؤسسة</Text>
          <View style={styles.checkboxRow}>
            <Checkbox checked={data.financing?.equipmentByMinistry || false} label="وزارة التضامن والإدماج الاجتماعي والأسرة" />
            <Checkbox checked={data.financing?.equipmentByINDH || false} label="المبادرة الوطنية للتنمية البشرية" />
            <Checkbox checked={data.financing?.equipmentByCouncil || false} label="الجماعة" />
            <Checkbox checked={data.financing?.equipmentByAssociation || false} label="جمعية/مؤسسة" />
            <Checkbox checked={data.financing?.equipmentByDonors || false} label="محسنون" />
            <Checkbox checked={data.financing?.equipmentByOther || false} label="آخر" />
          </View>
        </View>

        <View style={styles.subSection}>
          <Text style={styles.subSectionTitle}>مصادر تمويل تسيير المؤسسة</Text>
          <View style={styles.checkboxRow}>
            <Checkbox checked={data.financing?.operatingByMinistry || false} label="التربية الوطنية" />
            <Checkbox checked={data.financing?.operatingByINDH || false} label="المبادرة الوطنية للتنمية البشرية" />
            <Checkbox checked={data.financing?.operatingByCouncil || false} label="الجماعة" />
            <Checkbox checked={data.financing?.operatingByAssociation || false} label="الجمعية المسيرة" />
            <Checkbox checked={data.financing?.operatingByDonors || false} label="محسنون" />
            <Checkbox checked={data.financing?.operatingByOther || false} label="آخر" />
          </View>
        </View>

        <DataRow label="الميزانية السنوية" value={data.financing?.annualBudget ? `${data.financing.annualBudget} درهم` : "-"} />
        <DataRow label="مساهمة الوزارة" value={data.financing?.ministryContribution ? `${data.financing.ministryContribution} درهم` : "-"} />
        <DataRow label="مساهمة الجمعية" value={data.financing?.associationContribution ? `${data.financing.associationContribution} درهم` : "-"} />
        <DataRow label="مساهمة الجماعة" value={data.financing?.councilContribution ? `${data.financing.councilContribution} درهم` : "-"} />
        <DataRow label="مساهمات أخرى" value={data.financing?.otherContribution ? `${data.financing.otherContribution} درهم` : "-"} />

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>

      {/* Page 3: Targeting & Services */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>IV. معطيات حول الاستهداف وتوسعة الخدمات</Text>

        <View style={styles.subSection}>
          <Text style={styles.subSectionTitle}>المعايير المعتمدة في الاستهداف</Text>
          <View style={styles.checkboxRow}>
            <Checkbox checked={data.targeting?.povertyBased || false} label="الوضعية الاجتماعية للأسرة" />
            <Checkbox checked={data.targeting?.distanceBased || false} label="المسافة بين المدرسة ومحل سكن المستفيد" />
            <Checkbox checked={data.targeting?.orphansBased || false} label="الأيتام" />
            <Checkbox checked={data.targeting?.disabilityBased || false} label="ذوي الاحتياجات الخاصة" />
            <Checkbox checked={data.targeting?.otherCriteria || false} label="معايير أخرى" />
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>الجهة التي تقوم بعملية انتقاء المستفيدين</Text>
          <View style={[styles.value, styles.checkboxRow]}>
            <Checkbox checked={data.targeting?.selectionBody === "ASSOCIATION_ALONE"} label="الجمعية بمفردها" />
            <Checkbox checked={data.targeting?.selectionBody === "MIXED_COMMITTEE"} label="لجنة مختلطة" />
          </View>
        </View>

        {data.targeting?.selectionBody === "MIXED_COMMITTEE" && (
          <View style={styles.subSection}>
            <Text style={styles.subSectionTitle}>تضم اللجنة المختلطة:</Text>
            <View style={styles.checkboxRow}>
              <Checkbox checked={data.targeting?.committeeHasAssociation || false} label="الجمعية" />
              <Checkbox checked={data.targeting?.committeeHasAuthority || false} label="السلطات المحلية" />
              <Checkbox checked={data.targeting?.committeeHasEducation || false} label="التربية الوطنية" />
              <Checkbox checked={data.targeting?.committeeHasSocial || false} label="التعاون الوطني" />
              <Checkbox checked={data.targeting?.committeeHasOther || false} label="آخر" />
            </View>
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.label}>خدمات المؤسسة</Text>
          <View style={[styles.value, styles.checkboxRow]}>
            <Checkbox checked={data.targeting?.servicesAreFree === true} label="مجانية" />
            <Checkbox checked={data.targeting?.servicesAreFree === false} label="بالاشتراك" />
          </View>
        </View>

        {!data.targeting?.servicesAreFree && (
          <>
            <View style={styles.row}>
              <Text style={styles.label}>المبلغ الشهري للاشتراك لكل مستفيد</Text>
              <View style={[styles.value, styles.checkboxRow]}>
                <Checkbox checked={data.targeting?.tariffType === "UNIFORM"} label="تعريفة موحدة" />
                <Checkbox checked={data.targeting?.tariffType === "NON_UNIFORM"} label="تعريفة غير موحدة" />
              </View>
            </View>
            {data.targeting?.tariffType === "UNIFORM" && (
              <DataRow label="قيمة التعريفة الموحدة" value={data.targeting?.fixedTariffAmount ? `${data.targeting.fixedTariffAmount} درهم` : "-"} />
            )}
            {data.targeting?.tariffType === "NON_UNIFORM" && data.targeting?.tariffBracket && (
              <DataRow label="شريحة التعريفة" value={tariffBracketLabels[data.targeting.tariffBracket]} />
            )}
          </>
        )}

        <Text style={styles.sectionTitle}>V. خدمتي الإيواء والإطعام بالمؤسسة</Text>

        <DataRow label="عدد الغرف الإجمالي" value={data.housingMeals?.totalRooms} />
        <DataRow label="عدد الأسرة الإجمالي" value={data.housingMeals?.totalBeds} />
        <DataRow label="عدد الأسرة في كل غرفة" value={data.housingMeals?.bedsPerRoom} />

        <View style={styles.row}>
          <Text style={styles.label}>هل توجد قاعة للأكل</Text>
          <View style={[styles.value, styles.checkboxRow]}>
            <Checkbox checked={data.housingMeals?.hasRefectory === true} label="نعم" />
            <Checkbox checked={data.housingMeals?.hasRefectory === false} label="لا" />
          </View>
        </View>

        {data.housingMeals?.hasRefectory && (
          <DataRow label="سعة قاعة الأكل" value={data.housingMeals?.refectoryCapacity} />
        )}

        <View style={styles.row}>
          <Text style={styles.label}>نوعية خدمة الإطعام المقدمة</Text>
          <View style={[styles.value, styles.checkboxRow]}>
            <Checkbox checked={data.housingMeals?.mealServiceType === "INSTITUTION_KITCHEN"} label="إعداد الوجبات في مطبخ المؤسسة" />
            <Checkbox checked={data.housingMeals?.mealServiceType === "READY_MEALS"} label="وجبات جاهزة" />
            <Checkbox checked={data.housingMeals?.mealServiceType === "OTHER"} label="آخر" />
          </View>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>

      {/* Page 4: Beneficiaries Statistics */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>عدد المستفيدين من خدمتي الإيواء والإطعام بالمؤسسة</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellHeader}>الموسم الدراسي 2025-2026</Text>
            <Text style={styles.tableCellHeader}>الموسم الدراسي 2024-2025</Text>
            <Text style={styles.tableCellHeader}>الموسم الدراسي 2023-2024</Text>
            <Text style={styles.tableCellHeader}>البيان</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{data.housingMeals?.season2526?.totalBeneficiaries ?? "-"}</Text>
            <Text style={styles.tableCell}>{data.housingMeals?.season2425?.totalBeneficiaries ?? "-"}</Text>
            <Text style={styles.tableCell}>{data.housingMeals?.season2324?.totalBeneficiaries ?? "-"}</Text>
            <Text style={styles.tableCell}>العدد الإجمالي للمستفيدين</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{data.housingMeals?.season2526?.maleBeneficiaries ?? "-"}</Text>
            <Text style={styles.tableCell}>{data.housingMeals?.season2425?.maleBeneficiaries ?? "-"}</Text>
            <Text style={styles.tableCell}>{data.housingMeals?.season2324?.maleBeneficiaries ?? "-"}</Text>
            <Text style={styles.tableCell}>الذكور</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{data.housingMeals?.season2526?.femaleBeneficiaries ?? "-"}</Text>
            <Text style={styles.tableCell}>{data.housingMeals?.season2425?.femaleBeneficiaries ?? "-"}</Text>
            <Text style={styles.tableCell}>{data.housingMeals?.season2324?.femaleBeneficiaries ?? "-"}</Text>
            <Text style={styles.tableCell}>الإناث</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{data.housingMeals?.season2526?.primaryBeneficiaries ?? "-"}</Text>
            <Text style={styles.tableCell}>{data.housingMeals?.season2425?.primaryBeneficiaries ?? "-"}</Text>
            <Text style={styles.tableCell}>{data.housingMeals?.season2324?.primaryBeneficiaries ?? "-"}</Text>
            <Text style={styles.tableCell}>الابتدائي</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{data.housingMeals?.season2526?.middleSchoolBeneficiaries ?? "-"}</Text>
            <Text style={styles.tableCell}>{data.housingMeals?.season2425?.middleSchoolBeneficiaries ?? "-"}</Text>
            <Text style={styles.tableCell}>{data.housingMeals?.season2324?.middleSchoolBeneficiaries ?? "-"}</Text>
            <Text style={styles.tableCell}>الثانوي الإعدادي</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{data.housingMeals?.season2526?.highSchoolBeneficiaries ?? "-"}</Text>
            <Text style={styles.tableCell}>{data.housingMeals?.season2425?.highSchoolBeneficiaries ?? "-"}</Text>
            <Text style={styles.tableCell}>{data.housingMeals?.season2324?.highSchoolBeneficiaries ?? "-"}</Text>
            <Text style={styles.tableCell}>الثانوي التأهيلي</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{data.housingMeals?.season2526?.orphans ?? "-"}</Text>
            <Text style={styles.tableCell}>{data.housingMeals?.season2425?.orphans ?? "-"}</Text>
            <Text style={styles.tableCell}>{data.housingMeals?.season2324?.orphans ?? "-"}</Text>
            <Text style={styles.tableCell}>الأيتام</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{data.housingMeals?.season2526?.disabled ?? "-"}</Text>
            <Text style={styles.tableCell}>{data.housingMeals?.season2425?.disabled ?? "-"}</Text>
            <Text style={styles.tableCell}>{data.housingMeals?.season2324?.disabled ?? "-"}</Text>
            <Text style={styles.tableCell}>ذوي الاحتياجات الخاصة</Text>
          </View>
        </View>

        <View style={styles.subSection}>
          <Text style={styles.subSectionTitle}>مقترحات تحسين جودة الإطعام بالمؤسسة</Text>
          <View style={styles.checkboxRow}>
            <Checkbox checked={data.housingMeals?.suggestBuildingRenovation || false} label="ترميم البناية" />
            <Checkbox checked={data.housingMeals?.suggestNewBuilding || false} label="بناء جديد" />
            <Checkbox checked={data.housingMeals?.suggestEquipment || false} label="التجهيز" />
            <Checkbox checked={data.housingMeals?.suggestCapacityIncrease || false} label="الرفع من الطاقة الاستيعابية" />
            <Checkbox checked={data.housingMeals?.suggestStaffTraining || false} label="تكوين الموارد البشرية" />
          </View>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>

      {/* Page 5: Staff */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>VI. معطيات حول الموارد البشرية العاملة بالمؤسسة</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellHeader}>الكلفة الشهرية (بالدرهم)</Text>
            <Text style={styles.tableCellHeader}>حاصل على شهادة</Text>
            <Text style={styles.tableCellHeader}>العدد</Text>
            <Text style={styles.tableCellHeader}>نوع التأطير</Text>
          </View>

          {data.staffMembers?.map((staff, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{staff.monthlySalary ?? "-"}</Text>
              <Text style={styles.tableCell}>{staff.isCertified ? "نعم" : "لا"}</Text>
              <Text style={styles.tableCell}>{staff.count ?? "-"}</Text>
              <Text style={styles.tableCell}>{staff.staffType ? staffTypeLabels[staff.staffType] : "-"}</Text>
            </View>
          ))}

          {(!data.staffMembers || data.staffMembers.length === 0) && (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 4 }]}>لا توجد بيانات</Text>
            </View>
          )}
        </View>

        <View style={{ marginTop: 40 }}>
          <View style={styles.gridRow}>
            <View style={styles.gridCell}>
              <Text style={{ textAlign: "center", marginBottom: 40 }}>توقيع رئيس الجهة المدبرة لدار الطالب(ة)</Text>
              <Text style={{ textAlign: "center", borderTop: "1px solid #000", paddingTop: 5 }}>________________</Text>
            </View>
          </View>

          <View style={[styles.gridRow, { marginTop: 30 }]}>
            <View style={styles.gridCell}>
              <Text style={{ textAlign: "center", marginBottom: 20 }}>تأشيرة المدير الإقليمي للتعاون الوطني</Text>
              <Text style={{ textAlign: "center", borderTop: "1px solid #000", paddingTop: 5 }}>________________</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={{ textAlign: "center", marginBottom: 20 }}>تأشيرة المدير الإقليمي لوزارة التربية الوطنية والتعليم الأولي والرياضة</Text>
              <Text style={{ textAlign: "center", borderTop: "1px solid #000", paddingTop: 5 }}>________________</Text>
            </View>
          </View>

          <View style={[styles.gridRow, { marginTop: 30 }]}>
            <View style={styles.gridCell}>
              <Text style={{ textAlign: "center", marginBottom: 20 }}>تأشيرة رئيس قسم العمل الاجتماعي</Text>
              <Text style={{ textAlign: "center", borderTop: "1px solid #000", paddingTop: 5 }}>________________</Text>
            </View>
          </View>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
}
