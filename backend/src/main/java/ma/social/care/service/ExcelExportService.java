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

    private static final Map<String, String> TARIFF_TYPE_LABELS = Map.of(
            "FREE", "مجاني",
            "UNIFORM", "موحد",
            "BRACKETED", "حسب الشرائح",
            "OTHER", "آخر"
    );

    private static final Map<String, String> TARIFF_BODY_LABELS = Map.of(
            "ASSOCIATION", "الجمعية",
            "COMMISSION", "لجنة",
            "MIXED_COMMITTEE", "لجنة مختلطة",
            "OTHER", "آخر"
    );

    private static final Map<String, String> TARIFF_BRACKET_LABELS = Map.of(
            "LT_50", "أقل من 50 درهم",
            "BETWEEN_50_100", "بين 50 و 100 درهم",
            "BETWEEN_100_200", "بين 100 و 200 درهم",
            "GT_200", "أكثر من 200 درهم"
    );

    private static final Map<String, String> PRIORITY_LABELS = Map.ofEntries(
            Map.entry("SOCIAL_SITUATION", "الوضعية الاجتماعية"),
            Map.entry("DISTANCE", "البعد الجغرافي"),
            Map.entry("SCHOOL_RESULTS", "النتائج الدراسية"),
            Map.entry("SCHOLARSHIP", "الحصول على منحة"),
            Map.entry("OTHER", "أخرى")
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
                "نوعية ا����مؤسسة",
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
                "تفاصيل آخر (السلك التعليمي)",
                // البعد الجغرافي
                "البعد الجغرافي عن أقرب مؤسسة تعليمية",
                "البعد الجغرافي عن أقرب داخلية تابعة لقطاع التربية الوطنية",
                // Section II: معطيات حول البناية
                "وضعية البناية",
                "تفاصيل وضعية البناية (آخر)",
                "الحالة العامة للبناية",
                "تفاصيل الحالة العامة (آخر)",
                "إمكانية الترميم",
                "نوع المالك",
                "تفاصيل نوع المالك (آخر)",
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
                "تفاصيل معايير أخرى",
                "الأولوية 1",
                "الأولوية 2",
                "الأولوية 3",
                "الأولوية 4",
                "الأولوية 5",
                // أعضاء لجنة الانتقاء
                "لجنة الانتقاء - الجمعية",
                "لجنة الانتقاء - التعاون الوطني",
                "لجنة الانتقاء - التربية الوطنية",
                "لجنة الانتقاء - الجماعة",
                "لجنة الانتقاء - السلطات المحلية",
                "لجنة الانتقاء - عضو آخر",
                "لجنة الانتقاء - تفاصيل العضو الآخر",
                "الجهة المكلفة بالانتقاء",
                "خدمات مجانية",
                "عدد الطلبات غير الملباة",
                // التعريفة
                "نوع التعريفة",
                "المبلغ الموحد",
                "شريحة التعريفة",
                "الجهة المحددة للتعريفة",
                "لجنة التعريفة - الجمعية",
                "لجنة التعريفة - التعاون الوطني",
                "لجنة التعريفة - التربية الوطنية",
                "لجنة التعريفة - الجماعة",
                "لجنة التعريفة - السلطات المحلية",
                "لجنة التعريفة - عضو آخر",
                "لجنة التعريفة - تفاصيل العضو الآخر",
                // Section V: التمويل - مصادر البناء
                "وزارة التضامن (البناء)",
                "التعاون الوطني (البناء)",
                "المبادرة الوطنية (البناء)",
                "الجماعة (البناء)",
                "مؤسسة محمد الخامس (البناء)",
                "التجديد الوطني (البناء)",
                "الجمعية (البناء)",
                "مصدر آخر (البناء)",
                "تفاصيل مصدر آخر (البناء)",
                "��لتكلفة الإجمالية للبناء",
                // مصادر التج��يز
                "وزارة التضامن (التجهيز)",
                "التعاون الوطني (التجهيز)",
                "المبادرة الوطنية (التجهيز)",
                "الجماعة (التجهيز)",
                "مؤسسة محمد الخامس (التجهيز)",
                "الجمعية (التجهيز)",
                "مصدر آخر (التجهيز)",
                "تفاصيل مصدر آخر (التجهيز)",
                // مصادر التسيير
                "المبادرة الوطنية (التسيير)",
                "التعاون الوطني (التسيير)",
                "التربية الوطنية (التسيير)",
                "الجماعة (التسيير)",
                "مساهمات الآباء (التسيير)",
                "مبلغ مساهمة الآباء",
                "المحسنون (التسيير)",
                "موارد الجمعية الذاتية (التسيير)",
                "مصدر آخر (التسيير)",
                "تفاصيل مصدر آخر (التسيير)",
                // التكاليف
                "التكلفة السنوية للتسيير",
                "التكلفة السنوية للموارد البشرية",
                "التكلفة السنوية للإطعام",
                "التكلفة السنوية لباقي النفقات",
                "التكلفة السنوية للفرد",
                "حصة الجمعية",
                "حصة التربية الوطنية",
                "حصص أخرى",
                // Section VI: الموارد البشرية
                "المديرون (الجمعية)",
                "المديرون (وضع رهن الإشارة)",
                "المديرون (متطوعون)",
                "المسيرون الماليون (الجمعية)",
                "المسيرون الماليون (وضع رهن الإشارة)",
                "المسيرون الماليون (متطوعون)",
                "الحراس العامون (الجمعية)",
                "الحراس العامون (وضع رهن الإشارة)",
                "الحراس العامون (متطوعون)",
                "المساعدون الاجتماعيون (الجمعية)",
                "المساعدون الاجتماعيون (وضع رهن الإشارة)",
                "المساعدون الاجتماعيون (متطوعون)",
                "الأطباء (الجمعية)",
                "الأطباء (وضع رهن الإشارة)",
                "الأطباء (متطوعون)",
                "الممرضون (الجمعية)",
                "الممرضون (وضع رهن الإشارة)",
                "الممرضون (متطوعون)",
                "الأخصائيون النفسانيون (الجمعية)",
                "الأخصائيون النفسانيون (وضع رهن الإشارة)",
                "الأخصائيون النفسانيون (متطوعون)",
                "المربون (الجمعية)",
                "المربون (وضع رهن الإشارة)",
                "المربون (متطوعون)",
                "مسؤولو المطبخ (الجمعية)",
                "مسؤولو المطبخ (وضع رهن الإشارة)",
                "مسؤولو المطبخ (متطوعون)",
                "عمال المطبخ (الجمعية)",
                "عمال المطبخ (وضع رهن الإشارة)",
                "عمال المطبخ (متطوعون)",
                "مسؤولو المخزن (الجمعية)",
                "مسؤولو المخزن (وضع رهن الإشارة)",
                "مسؤولو المخزن (متطوعون)",
                "الأمن (الجمعية)",
                "الأمن (وضع رهن الإشارة)",
                "الأمن (متطوعون)",
                "عمال الخدمة (الجمعية)",
                "عمال الخدمة (وضع رهن الإشارة)",
                "عمال الخدمة (متطوعون)",
                "آخرون (الجمعية)",
                "آخرون (وضع رهن الإشارة)",
                "آخرون (متطوعون)",
                "إجمالي الموارد البشرية",
                "الكلفة الشهرية للموارد البشرية",
                "الكلفة السنوية للموارد البشرية",
                // Section VII: معلومات إضافية
                "التأمين",
                "سبب عدم الترخيص",
                "رابط الاستبيان الموقع",
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
        List<StaffMemberDTO> staff = inst.getStaffMembers();
        
        // Build staff lookup map by type
        Map<String, StaffMemberDTO> staffMap = new HashMap<>();
        if (staff != null) {
            for (StaffMemberDTO s : staff) {
                if (s.getStaffType() != null) {
                    staffMap.put(s.getStaffType().name(), s);
                }
            }
        }

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
                getDisplayValue(inst.getOtherDetail()),
                // البعد الجغرافي
                getLabel(DISTANCE_LABELS, enumName(inst.getDistanceToSchool())),
                getLabel(DISTANCE_LABELS, enumName(inst.getDistanceToNationalBoardingSchool())),
                // Section II: البناية
                getLabel(BUILDING_STATUS_LABELS, bld != null ? enumName(bld.getBuildingStatus()) : null),
                getDisplayValue(bld != null ? bld.getBuildingStatusOther() : null),
                getLabel(BUILDING_CONDITION_LABELS, bld != null ? enumName(bld.getBuildingCondition()) : null),
                getDisplayValue(bld != null ? bld.getBuildingConditionOther() : null),
                getLabel(RENOVATION_LABELS, bld != null ? enumName(bld.getRenovationCapacity()) : null),
                getLabel(LAND_OWNERSHIP_LABELS, bld != null ? enumName(bld.getOwnerType()) : null),
                getDisplayValue(bld != null ? bld.getOwnerTypeOther() : null),
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
                getDisplayValue(tgt != null ? tgt.getOtherCriteriaDetail() : null),
                // الأولويات
                getLabel(PRIORITY_LABELS, tgt != null ? enumName(tgt.getPriority1()) : null),
                getLabel(PRIORITY_LABELS, tgt != null ? enumName(tgt.getPriority2()) : null),
                getLabel(PRIORITY_LABELS, tgt != null ? enumName(tgt.getPriority3()) : null),
                getLabel(PRIORITY_LABELS, tgt != null ? enumName(tgt.getPriority4()) : null),
                getLabel(PRIORITY_LABELS, tgt != null ? enumName(tgt.getPriority5()) : null),
                // أعضاء لجنة الانتقاء
                getCheckbox(tgt != null ? tgt.getCommitteeAssociation() : null),
                getCheckbox(tgt != null ? tgt.getCommitteeNationalEntraide() : null),
                getCheckbox(tgt != null ? tgt.getCommitteeNationalEducation() : null),
                getCheckbox(tgt != null ? tgt.getCommitteeCommune() : null),
                getCheckbox(tgt != null ? tgt.getCommitteeLocalAuthorities() : null),
                getCheckbox(tgt != null ? tgt.getOtherMember() : null),
                getDisplayValue(tgt != null ? tgt.getOtherMemberDetail() : null),
                getLabel(SELECTION_BODY_LABELS, tgt != null ? enumName(tgt.getSelectionBody()) : null),
                getCheckbox(tgt != null ? tgt.getServicesAreFree() : null),
                getDisplayValue(tgt != null ? tgt.getUnsatisfiedRequestsCount() : null),
                // التعريفة
                getLabel(TARIFF_TYPE_LABELS, tgt != null ? enumName(tgt.getTariffType()) : null),
                formatCurrency(tgt != null ? tgt.getUniformAmount() : null),
                getLabel(TARIFF_BRACKET_LABELS, tgt != null ? enumName(tgt.getTariffBracket()) : null),
                getLabel(TARIFF_BODY_LABELS, tgt != null ? enumName(tgt.getTariffDeterminationBody()) : null),
                getCheckbox(tgt != null ? tgt.getTariffCommitteeAssociation() : null),
                getCheckbox(tgt != null ? tgt.getTariffCommitteeNationalEntraide() : null),
                getCheckbox(tgt != null ? tgt.getTariffCommitteeNationalEducation() : null),
                getCheckbox(tgt != null ? tgt.getTariffCommitteeCommune() : null),
                getCheckbox(tgt != null ? tgt.getTariffCommitteeLocalAuthorities() : null),
                getCheckbox(tgt != null ? tgt.getTariffOtherMember() : null),
                getDisplayValue(tgt != null ? tgt.getTariffOtherMemberDetail() : null),
                // Section V: التمويل - مصادر البناء
                getCheckbox(fin != null ? fin.getSolidarityMinistry() : null),
                getCheckbox(fin != null ? fin.getNationalEntraide() : null),
                getCheckbox(fin != null ? fin.getIndh() : null),
                getCheckbox(fin != null ? fin.getCommune() : null),
                getCheckbox(fin != null ? fin.getFondationMohammed5() : null),
                getCheckbox(fin != null ? fin.getNationalRevival() : null),
                getCheckbox(fin != null ? fin.getAssociation() : null),
                fin != null && Boolean.TRUE.equals(fin.getOtherConstruction()) ? getDisplayValue(fin.getOtherConstructionDetail(), "☑") : "☐",
                getDisplayValue(fin != null ? fin.getOtherConstructionDetail() : null),
                formatCurrency(fin != null ? fin.getTotalConstructionCost() : null),
                // مصادر التجهيز
                getCheckbox(fin != null ? fin.getEquipmentSolidarityMinistry() : null),
                getCheckbox(fin != null ? fin.getEquipmentNationalEntraide() : null),
                getCheckbox(fin != null ? fin.getEquipmentIndh() : null),
                getCheckbox(fin != null ? fin.getEquipmentCommune() : null),
                getCheckbox(fin != null ? fin.getEquipmentFondationMohammed5() : null),
                getCheckbox(fin != null ? fin.getEquipmentAssociation() : null),
                getCheckbox(fin != null ? fin.getEquipmentOther() : null),
                getDisplayValue(fin != null ? fin.getEquipmentOtherDetail() : null),
                // مصادر التسيير
                getCheckbox(fin != null ? fin.getOperatingIndh() : null),
                getCheckbox(fin != null ? fin.getOperatingNationalEntraide() : null),
                getCheckbox(fin != null ? fin.getOperatingNationalEducation() : null),
                getCheckbox(fin != null ? fin.getOperatingCommune() : null),
                getCheckbox(fin != null ? fin.getOperatingParentContributions() : null),
                formatCurrency(fin != null ? fin.getParentContributionAmount() : null),
                getCheckbox(fin != null ? fin.getOperatingDonors() : null),
                getCheckbox(fin != null ? fin.getOperatingAssociationOwnSources() : null),
                getCheckbox(fin != null ? fin.getOperatingOther() : null),
                getDisplayValue(fin != null ? fin.getOperatingOtherDetail() : null),
                // التكاليف
                formatCurrency(fin != null ? fin.getAnnualManagementCost() : null),
                formatCurrency(fin != null ? fin.getAnnualHRCost() : null),
                formatCurrency(fin != null ? fin.getAnnualMealsCost() : null),
                formatCurrency(fin != null ? fin.getAnnualOtherExpenses() : null),
                formatCurrency(fin != null ? fin.getIndividualAnnualCost() : null),
                getDisplayValue(fin != null ? fin.getAssociationShare() : null),
                getDisplayValue(fin != null ? fin.getEducationShare() : null),
                getDisplayValue(fin != null ? fin.getOtherShare() : null),
                // Section VI: الموارد البشرية
                getStaffCount(staffMap, "DIRECTOR", "association"),
                getStaffCount(staffMap, "DIRECTOR", "deployed"),
                getStaffCount(staffMap, "DIRECTOR", "volunteers"),
                getStaffCount(staffMap, "FINANCIAL_MANAGER", "association"),
                getStaffCount(staffMap, "FINANCIAL_MANAGER", "deployed"),
                getStaffCount(staffMap, "FINANCIAL_MANAGER", "volunteers"),
                getStaffCount(staffMap, "GENERAL_GUARD", "association"),
                getStaffCount(staffMap, "GENERAL_GUARD", "deployed"),
                getStaffCount(staffMap, "GENERAL_GUARD", "volunteers"),
                getStaffCount(staffMap, "SOCIAL_WORKER", "association"),
                getStaffCount(staffMap, "SOCIAL_WORKER", "deployed"),
                getStaffCount(staffMap, "SOCIAL_WORKER", "volunteers"),
                getStaffCount(staffMap, "DOCTOR", "association"),
                getStaffCount(staffMap, "DOCTOR", "deployed"),
                getStaffCount(staffMap, "DOCTOR", "volunteers"),
                getStaffCount(staffMap, "NURSE", "association"),
                getStaffCount(staffMap, "NURSE", "deployed"),
                getStaffCount(staffMap, "NURSE", "volunteers"),
                getStaffCount(staffMap, "PSYCHOLOGIST", "association"),
                getStaffCount(staffMap, "PSYCHOLOGIST", "deployed"),
                getStaffCount(staffMap, "PSYCHOLOGIST", "volunteers"),
                getStaffCount(staffMap, "EDUCATORS", "association"),
                getStaffCount(staffMap, "EDUCATORS", "deployed"),
                getStaffCount(staffMap, "EDUCATORS", "volunteers"),
                getStaffCount(staffMap, "KITCHEN_MANAGER", "association"),
                getStaffCount(staffMap, "KITCHEN_MANAGER", "deployed"),
                getStaffCount(staffMap, "KITCHEN_MANAGER", "volunteers"),
                getStaffCount(staffMap, "KITCHEN_AGENTS", "association"),
                getStaffCount(staffMap, "KITCHEN_AGENTS", "deployed"),
                getStaffCount(staffMap, "KITCHEN_AGENTS", "volunteers"),
                getStaffCount(staffMap, "STORAGE_MANAGER", "association"),
                getStaffCount(staffMap, "STORAGE_MANAGER", "deployed"),
                getStaffCount(staffMap, "STORAGE_MANAGER", "volunteers"),
                getStaffCount(staffMap, "SECURITY", "association"),
                getStaffCount(staffMap, "SECURITY", "deployed"),
                getStaffCount(staffMap, "SECURITY", "volunteers"),
                getStaffCount(staffMap, "SERVICE_AGENTS", "association"),
                getStaffCount(staffMap, "SERVICE_AGENTS", "deployed"),
                getStaffCount(staffMap, "SERVICE_AGENTS", "volunteers"),
                getStaffCount(staffMap, "OTHER", "association"),
                getStaffCount(staffMap, "OTHER", "deployed"),
                getStaffCount(staffMap, "OTHER", "volunteers"),
                getTotalStaffCount(staff),
                getTotalStaffMonthlyCost(staff),
                getTotalStaffAnnualCost(staff),
                // Section VII: معلومات إضافية
                getCheckbox(inst.getInsurance()),
                getDisplayValue(inst.getUnlicensedReason()),
                getDisplayValue(inst.getSignedPdfUrl()),
                // تاريخ
                formatDateTime(inst.getCreatedAt()),
                formatDateTime(inst.getUpdatedAt())
        };
    }
    
    private String getStaffCount(Map<String, StaffMemberDTO> staffMap, String type, String category) {
        StaffMemberDTO s = staffMap.get(type);
        if (s == null) return "0";
        Integer count = switch (category) {
            case "association" -> s.getNbAssociation();
            case "deployed" -> s.getNbDeployed();
            case "volunteers" -> s.getNbVolunteers();
            default -> 0;
        };
        return count != null ? String.valueOf(count) : "0";
    }
    
    private String getTotalStaffCount(List<StaffMemberDTO> staff) {
        if (staff == null || staff.isEmpty()) return "0";
        int total = 0;
        for (StaffMemberDTO s : staff) {
            if (s.getNbAssociation() != null) total += s.getNbAssociation();
            if (s.getNbDeployed() != null) total += s.getNbDeployed();
            if (s.getNbVolunteers() != null) total += s.getNbVolunteers();
        }
        return String.valueOf(total);
    }
    
    private String getTotalStaffMonthlyCost(List<StaffMemberDTO> staff) {
        if (staff == null || staff.isEmpty()) return "—";
        BigDecimal total = BigDecimal.ZERO;
        for (StaffMemberDTO s : staff) {
            if (s.getMonthlyCost() != null) total = total.add(s.getMonthlyCost());
        }
        return formatCurrency(total);
    }
    
    private String getTotalStaffAnnualCost(List<StaffMemberDTO> staff) {
        if (staff == null || staff.isEmpty()) return "—";
        BigDecimal total = BigDecimal.ZERO;
        for (StaffMemberDTO s : staff) {
            if (s.getAnnualCost() != null) total = total.add(s.getAnnualCost());
        }
        return formatCurrency(total);
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
        return labelMap.getOrDefault(val, "—"); // Return "—" instead of English enum value
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
