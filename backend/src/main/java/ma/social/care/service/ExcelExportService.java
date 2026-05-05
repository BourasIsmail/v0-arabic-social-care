package ma.social.care.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.social.care.dto.*;
import ma.social.care.entity.enums.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExcelExportService {

    private final InstitutionService institutionService;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    // Arabic labels matching the PDF generator exactly
    private static final Map<String, String> INSTITUTION_TYPE_LABELS = Map.of(
            "DAR_TALIB", "دار الطالب",
            "DAR_TALIBA", "دار الطالبة",
            "DAR_TALIB_TALIBA", "دار الطالب والطالبة",
            "DAR_ATFAL", "دار الأطفال"
    );

    private static final Map<String, String> MILIEU_LABELS = Map.of(
            "URBAIN", "حضري",
            "URBAN", "حضري",
            "RURAL", "قروي",
            "SEMI_URBAN", "شبه حضري"
    );

    private static final Map<String, String> LEGAL_STATUS_LABELS = Map.of(
            "LICENSED", "مرخصة",
            "UNLICENSED", "غير مرخصة",
            "IN_PROGRESS", "في طور الترخيص"
    );

    private static final Map<String, String> DISTANCE_LABELS = Map.ofEntries(
            Map.entry("INSIDE", "داخل المؤسسة التعليمية"),
            Map.entry("LESS_THAN_1KM", "أقل من 1 كلم"),
            Map.entry("LT_1KM", "أقل من 1 كلم"),
            Map.entry("BETWEEN_1_5KM", "بين 1 و 5 كلم"),
            Map.entry("BETWEEN_5_10KM", "بين 5 و 10 كلم"),
            Map.entry("GT_5KM", "أكثر من 5 كلم"),
            Map.entry("MORE_THAN_10KM", "أكثر من 10 كلم")
    );

    private static final Map<String, String> BUILDING_STATUS_LABELS = Map.of(
            "RENTAL", "إيجار",
            "OWNED", "ملكية",
            "AT_DISPOSAL", "وضع رهن إشارة المؤسسة",
            "LENT", "معار",
            "OTHER", "آخر"
    );

    private static final Map<String, String> BUILDING_CONDITION_LABELS = Map.of(
            "GOOD", "جيدة",
            "AVERAGE", "بعض علامات التدهور",
            "SOME_DEGRADATION", "بعض علامات التدهور",
            "POOR", "متردية",
            "BAD", "متردية"
    );

    private static final Map<String, String> RENOVATION_LABELS = Map.of(
            "EASY", "سهلة",
            "DIFFICULT", "صعبة",
            "NEEDS_RECONSTRUCTION", "تتطلب إعادة البناء",
            "REBUILD", "تتطلب إعادة البناء"
    );

    private static final Map<String, String> LAND_OWNERSHIP_LABELS = Map.of(
            "STATE", "أملاك الدولة",
            "STATE_DOMAIN", "الملك العام للدولة",
            "COLLECTIVE", "ملك جماعي",
            "COMMUNAL", "جماعي",
            "PRIVATE", "ملك خصوصي",
            "OTHER", "آخر"
    );

    private static final Map<String, String> MEAL_TYPE_LABELS = Map.of(
            "IN_HOUSE", "إعداد الوجبات في مطبخ المؤسسة",
            "INSTITUTION_KITCHEN", "إعداد الوجبات في مطبخ المؤسسة",
            "READY_MEALS", "وجبات جاهزة",
            "OTHER", "آخر"
    );

    private static final Map<String, String> SELECTION_BODY_LABELS = Map.of(
            "ASSOCIATION_ALONE", "الجمعية بمفردها",
            "COMMISSION", "لجنة مختلطة",
            "MIXED_COMMITTEE", "لجنة مختلطة",
            "OTHER", "آخر"
    );

    public byte[] exportInstitutionsToExcel() {
        log.info("Generating Excel export of all institutions");

        List<InstitutionResponseDTO> institutions = institutionService.getAllForExport();
        
        // Remove duplicates by ID
        Set<Long> seenIds = new HashSet<>();
        List<InstitutionResponseDTO> uniqueInstitutions = new ArrayList<>();
        for (InstitutionResponseDTO inst : institutions) {
            if (seenIds.add(inst.getId())) {
                uniqueInstitutions.add(inst);
            }
        }
        
        log.info("Exporting {} unique institutions (removed {} duplicates)", 
                uniqueInstitutions.size(), institutions.size() - uniqueInstitutions.size());

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("المؤسسات");
            sheet.setRightToLeft(true);

            // Create header style
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);

            // Create data style
            CellStyle dataStyle = workbook.createCellStyle();
            dataStyle.setBorderBottom(BorderStyle.THIN);
            dataStyle.setBorderTop(BorderStyle.THIN);
            dataStyle.setBorderLeft(BorderStyle.THIN);
            dataStyle.setBorderRight(BorderStyle.THIN);
            dataStyle.setWrapText(true);

            // Headers
            String[] headers = getHeaders();
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data rows
            int rowNum = 1;
            for (InstitutionResponseDTO inst : uniqueInstitutions) {
                Row row = sheet.createRow(rowNum++);
                String[] rowData = getRowData(inst);
                for (int i = 0; i < rowData.length; i++) {
                    Cell cell = row.createCell(i);
                    cell.setCellValue(rowData[i]);
                    cell.setCellStyle(dataStyle);
                }
            }

            // Auto-size columns (limit to avoid performance issues)
            for (int i = 0; i < Math.min(headers.length, 20); i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();

        } catch (Exception e) {
            log.error("Error generating Excel export", e);
            throw new RuntimeException("Failed to generate Excel export", e);
        }
    }

    private String[] getHeaders() {
        return new String[] {
                // Section I: معطيات حول المؤسسة
                "نوعية ا��مؤسسة",
                "اسم الجمعية المشرفة",
                "اسم المؤسسة",
                "العنوان",
                "الجهة",
                "العمالة أو الإقليم",
                "الجماعة",
                "المجال",
                "الإحداثيات (خط العرض)",
                "الإحداثيات (خط الطول)",
                "سنة إحداث المؤسسة",
                "الوضعية القانونية للمؤسسة",
                "رقم وتاريخ الرخصة",
                "تاريخ شروع المؤسسة في تقديم خدماتها",
                // الخدمات المقدمة
                "الإيواء",
                "الإطعام",
                "التتبع التربوي والمواكبة الاجتماعية",
                "التنشيط الثقافي والرياضي والترفيهي",
                "العلاجات الصحية الأولية",
                "الدعم والمواكبة الطبية والنفسية",
                // الطاقة الاستيعابية
                "الطاقة الاستيعابية الإجمالية المرخصة",
                "الطاقة الاستيعابية المرخصة ذكور",
                "الطاقة الاستيعابية المرخصة إناث",
                // السلك التعليمي
                "ابتدائي",
                "ثانوي إعدادي",
                "ثانوي تأهيلي",
                "آخر",
                // البعد الجغرافي
                "البعد الجغرافي عن أقرب مؤسسة تعليمية",
                "البعد الجغرافي عن أقرب داخلية تابعة لقطاع التربية الوطنية",
                // Section II: معطيات حول البناية
                "وضعية البناية",
                "الحالة العامة للبناية",
                "إمكانية الترميم",
                "نوع المالك",
                "وجود اتفاقية شراكة",
                // Section III: الإيواء والإطعام - الموسم 2023-2024
                "المستفيدون من الإيواء 2023-2024 (إجمالي)",
                "المستفيدون من الإيواء 2023-2024 (ذكور)",
                "المستفيدون من الإيواء 2023-2024 (إناث)",
                "المستفيدون من الإيواء 2023-2024 (ابتدائي)",
                "المستفيدون من الإيواء 2023-2024 (إعدادي)",
                "المستفيدون من الإيواء 2023-2024 (تأهيلي)",
                // الموسم 2024-2025
                "المستفيدون من الإيواء 2024-2025 (إجمالي)",
                "المستفيدون من الإيواء 2024-2025 (ذكور)",
                "المستفيدون من الإيواء 2024-2025 (إناث)",
                "المستفيدون من الإيواء 2024-2025 (ابتدائي)",
                "المستفيدون من الإيواء 2024-2025 (إعدادي)",
                "المستفيدون من الإيواء 2024-2025 (تأهيلي)",
                // الموسم 2025-2026
                "المستفيدون من الإيواء 2025-2026 (إجمالي)",
                "المستفيدون من الإيواء 2025-2026 (ذكور)",
                "المستفيدون من الإيواء 2025-2026 (إناث)",
                "المستفيدون من الإيواء 2025-2026 (ابتدائي)",
                "المستفيدون من الإيواء 2025-2026 (إعدادي)",
                "المستفيدون من الإيواء 2025-2026 (تأهيلي)",
                // الإطعام
                "المستفيدون من الإطعام 2025-2026",
                "طريقة تقديم الوجبات",
                // Section IV: الاستهداف
                "الوضعية الاجتماعية",
                "البعد الجغرافي",
                "النتائج الدراسية",
                "الحصول على منحة",
                "معايير أخرى",
                "الجهة المكلفة بالانتقاء",
                "خدمات مجانية",
                "عدد الطلبات غير الملباة",
                // Section V: التمويل
                "وزارة التضامن (البناء)",
                "التعاون الوطني (البناء)",
                "المبادرة الوطنية (البناء)",
                "الجماعة (البناء)",
                "مؤسسة محمد الخامس (البناء)",
                "التجديد الوطني (البناء)",
                "الجمعية (البناء)",
                "مصدر آخر (البناء)",
                "التكلفة الإجمالية للبناء",
                "التكلفة السنوية للتسيير",
                "التكلفة السنوية للموارد البشرية",
                "التكلفة السنوية للإطعام",
                "التكلفة السنوية للفرد",
                "حصة الجمعية",
                "حصة التربية الوطنية",
                "حصص أخرى",
                // تاريخ
                "تاريخ الإنشاء",
                "تاريخ التحديث"
        };
    }

    private String[] getRowData(InstitutionResponseDTO inst) {
        HousingMealsDTO hm = inst.getHousingMeals();
        SeasonBeneficiariesDTO s2324 = hm != null ? hm.getSeason2324() : null;
        SeasonBeneficiariesDTO s2425 = hm != null ? hm.getSeason2425() : null;
        SeasonBeneficiariesDTO s2526 = hm != null ? hm.getSeason2526() : null;
        BuildingDTO bld = inst.getBuilding();
        TargetingDTO tgt = inst.getTargeting();
        FinancingDTO fin = inst.getFinancing();

        return new String[] {
                // Section I
                getLabel(INSTITUTION_TYPE_LABELS, enumName(inst.getInstitutionType())),
                getDisplayValue(inst.getAssociationName()),
                getDisplayValue(inst.getInstitutionName()),
                getDisplayValue(inst.getAddress()),
                getDisplayValue(inst.getRegionName()),
                getDisplayValue(inst.getPrefectureName()),
                getDisplayValue(inst.getCommuneName()),
                getLabel(MILIEU_LABELS, enumName(inst.getMilieu())),
                getDisplayValue(inst.getLatitude()),
                getDisplayValue(inst.getLongitude()),
                getDisplayValue(inst.getCreationYear()),
                getLabel(LEGAL_STATUS_LABELS, enumName(inst.getLegalStatus())),
                getDisplayValue(inst.getLicenseNumber()),
                formatDate(inst.getServiceStartDate()),
                // الخدمات
                getCheckbox(inst.getHousing()),
                getCheckbox(inst.getMeals()),
                getCheckbox(inst.getEducationalSupport()),
                getCheckbox(inst.getCulturalActivities()),
                getCheckbox(inst.getHealthCare()),
                getCheckbox(inst.getPsychologicalSupport()),
                // الطاقة الاستيعابية
                getDisplayValue(inst.getTotalCapacity()),
                getDisplayValue(inst.getMaleCapacity()),
                getDisplayValue(inst.getFemaleCapacity()),
                // السلك التعليمي
                getCheckbox(inst.getPrimary()),
                getCheckbox(inst.getMiddleSchool()),
                getCheckbox(inst.getHighSchool()),
                inst.getOther() != null && inst.getOther() ? getDisplayValue(inst.getOtherDetail(), "☑") : "☐",
                // البعد الجغرافي
                getLabel(DISTANCE_LABELS, enumName(inst.getDistanceToSchool())),
                getLabel(DISTANCE_LABELS, enumName(inst.getDistanceToNationalBoardingSchool())),
                // Section II: البناية
                getLabel(BUILDING_STATUS_LABELS, bld != null ? enumName(bld.getBuildingStatus()) : null),
                getLabel(BUILDING_CONDITION_LABELS, bld != null ? enumName(bld.getBuildingCondition()) : null),
                getLabel(RENOVATION_LABELS, bld != null ? enumName(bld.getRenovationCapacity()) : null),
                getLabel(LAND_OWNERSHIP_LABELS, bld != null ? enumName(bld.getOwnerType()) : null),
                getCheckbox(bld != null ? bld.getHasPartnershipAgreement() : null),
                // Section III: الإيواء 2023-2024
                getDisplayValue(s2324 != null ? s2324.getTotalBeneficiaries() : null),
                getDisplayValue(s2324 != null ? s2324.getMaleBeneficiaries() : null),
                getDisplayValue(s2324 != null ? s2324.getFemaleBeneficiaries() : null),
                getDisplayValue(s2324 != null ? s2324.getPrimaryBeneficiaries() : null),
                getDisplayValue(s2324 != null ? s2324.getMiddleSchoolBeneficiaries() : null),
                getDisplayValue(s2324 != null ? s2324.getHighSchoolBeneficiaries() : null),
                // 2024-2025
                getDisplayValue(s2425 != null ? s2425.getTotalBeneficiaries() : null),
                getDisplayValue(s2425 != null ? s2425.getMaleBeneficiaries() : null),
                getDisplayValue(s2425 != null ? s2425.getFemaleBeneficiaries() : null),
                getDisplayValue(s2425 != null ? s2425.getPrimaryBeneficiaries() : null),
                getDisplayValue(s2425 != null ? s2425.getMiddleSchoolBeneficiaries() : null),
                getDisplayValue(s2425 != null ? s2425.getHighSchoolBeneficiaries() : null),
                // 2025-2026
                getDisplayValue(s2526 != null ? s2526.getTotalBeneficiaries() : null),
                getDisplayValue(s2526 != null ? s2526.getMaleBeneficiaries() : null),
                getDisplayValue(s2526 != null ? s2526.getFemaleBeneficiaries() : null),
                getDisplayValue(s2526 != null ? s2526.getPrimaryBeneficiaries() : null),
                getDisplayValue(s2526 != null ? s2526.getMiddleSchoolBeneficiaries() : null),
                getDisplayValue(s2526 != null ? s2526.getHighSchoolBeneficiaries() : null),
                // الإطعام
                getDisplayValue(hm != null ? hm.getTotalMealBeneficiaries2526() : null),
                getLabel(MEAL_TYPE_LABELS, hm != null ? enumName(hm.getMealServiceType()) : null),
                // Section IV: الاستهداف
                getCheckbox(tgt != null ? tgt.getSocialSituation() : null),
                getCheckbox(tgt != null ? tgt.getDistance() : null),
                getCheckbox(tgt != null ? tgt.getSchoolResults() : null),
                getCheckbox(tgt != null ? tgt.getScholarship() : null),
                tgt != null && Boolean.TRUE.equals(tgt.getOtherCriteria()) ? getDisplayValue(tgt.getOtherCriteriaDetail(), "☑") : "☐",
                getLabel(SELECTION_BODY_LABELS, tgt != null ? enumName(tgt.getSelectionBody()) : null),
                getCheckbox(tgt != null ? tgt.getServicesAreFree() : null),
                getDisplayValue(tgt != null ? tgt.getUnsatisfiedRequestsCount() : null),
                // Section V: التمويل
                getCheckbox(fin != null ? fin.getSolidarityMinistry() : null),
                getCheckbox(fin != null ? fin.getNationalEntraide() : null),
                getCheckbox(fin != null ? fin.getIndh() : null),
                getCheckbox(fin != null ? fin.getCommune() : null),
                getCheckbox(fin != null ? fin.getFondationMohammed5() : null),
                getCheckbox(fin != null ? fin.getNationalRevival() : null),
                getCheckbox(fin != null ? fin.getAssociation() : null),
                fin != null && Boolean.TRUE.equals(fin.getOtherConstruction()) ? getDisplayValue(fin.getOtherConstructionDetail(), "☑") : "☐",
                formatCurrency(fin != null ? fin.getTotalConstructionCost() : null),
                formatCurrency(fin != null ? fin.getAnnualManagementCost() : null),
                formatCurrency(fin != null ? fin.getAnnualHRCost() : null),
                formatCurrency(fin != null ? fin.getAnnualMealsCost() : null),
                formatCurrency(fin != null ? fin.getIndividualAnnualCost() : null),
                getDisplayValue(fin != null ? fin.getAssociationShare() : null),
                getDisplayValue(fin != null ? fin.getEducationShare() : null),
                getDisplayValue(fin != null ? fin.getOtherShare() : null),
                // تاريخ
                formatDateTime(inst.getCreatedAt()),
                formatDateTime(inst.getUpdatedAt())
        };
    }

    private String getDisplayValue(Object value) {
        return getDisplayValue(value, "—");
    }

    private String getDisplayValue(Object value, String defaultValue) {
        if (value == null) return defaultValue;
        String str = String.valueOf(value);
        return str.isEmpty() ? defaultValue : str;
    }

    private String getCheckbox(Boolean val) {
        return Boolean.TRUE.equals(val) ? "☑" : "☐";
    }

    private String getLabel(Map<String, String> labelMap, String val) {
        if (val == null || val.isEmpty()) return "—";
        return labelMap.getOrDefault(val, val);
    }

    private String enumName(Object enumVal) {
        return enumVal != null ? enumVal.toString() : null;
    }

    private String formatDate(LocalDate date) {
        if (date == null) return "—";
        return date.format(DATE_FORMATTER);
    }

    private String formatDateTime(Object dateTime) {
        if (dateTime == null) return "—";
        return dateTime.toString().split("T")[0];
    }

    private String formatCurrency(BigDecimal value) {
        if (value == null) return "—";
        return String.format("%,.2f", value);
    }
}
