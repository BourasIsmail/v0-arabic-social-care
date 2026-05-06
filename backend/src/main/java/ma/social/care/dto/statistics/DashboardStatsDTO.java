package ma.social.care.dto.statistics;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {
    
    // General counts
    private long totalInstitutions;
    private long totalCapacity;
    private long totalBeneficiaries;
    
    // By institution type
    private long darTalibCount;
    private long darTalibaCount;
    private long mixedCount;
    
    // By milieu
    private long urbanCount;
    private long ruralCount;
    
    // By legal status
    private long licensedCount;
    private long unlicensedCount;
    
    // Breakdown by geography
    private List<RegionStatsDTO> byRegion;
    private List<PrefectureStatsDTO> byPrefecture;
    
    // Additional stats
    private long totalStaffCount;
    private double averageCapacity;
    private long institutionsWithHousing;
    private long institutionsWithMeals;
    
    // === NEW KPIs ===
    
    // Type breakdown by milieu and status
    private TypeStatsDTO typeStats;
    
    // Target levels (المستويات المستهدفة)
    private TargetLevelsDTO targetLevels;
    
    // Building financing (تمويل بناء المؤسسة)
    private BuildingFinancingDTO buildingFinancing;
    
    // Equipment financing (تمويل تجهيز المؤسسة)
    private EquipmentFinancingDTO equipmentFinancing;
    
    // Operating financing (مصادر تمويل تسيير المؤسسة)
    private OperatingFinancingDTO operatingFinancing;
    
    // Meal service (خدمة الإطعام)
    private MealServiceDTO mealService;
    
    // Beneficiaries (المستفيدين من الإيواء والإطعام)
    private BeneficiariesDTO beneficiaries;
    
    // Human resources (الموارد البشرية)
    private HumanResourcesDTO humanResources;
    
    // Building stats (معطيات حول البناية)
    private BuildingStatsDTO buildingStats;
    
    // === Nested DTOs ===
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TypeStatsDTO {
        private TypeDetailDTO darTalib;
        private TypeDetailDTO darTaliba;
        private TypeDetailDTO mixed;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TypeDetailDTO {
        private long total;
        private long licensed;
        private long unlicensed;
        private long urban;
        private long rural;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TargetLevelsDTO {
        private long primary;
        private long middleSchool;
        private long highSchool;
        private long other;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BuildingFinancingDTO {
        private long solidarityMinistry;
        private long nationalEntraide;
        private long indh;
        private long commune;
        private long fondationMohammed5;
        private long nationalRevival;
        private long association;
        private long other;
        private BigDecimal totalCost;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EquipmentFinancingDTO {
        private long solidarityMinistry;
        private long nationalEntraide;
        private long indh;
        private long commune;
        private long fondationMohammed5;
        private long association;
        private long other;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OperatingFinancingDTO {
        private long indh;
        private long nationalEntraide;
        private long nationalEducation;
        private long commune;
        private long parentContributions;
        private long donors;
        private long associationOwnSources;
        private long other;
        private BigDecimal annualManagementCost;
        private BigDecimal annualHRCost;
        private BigDecimal annualMealsCost;
        private BigDecimal individualAnnualCost;
        private double averageAssociationShare;
        private double averageEducationShare;
        private double averageOtherShare;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MealServiceDTO {
        private long institutionKitchen;
        private long readyMeals;
        private long other;
        private long totalMealBeneficiaries;
        // New KPIs
        private long fullGrantBeneficiaries;      // عدد المستفيدين من منحة كاملة
        private long halfGrantBeneficiaries;      // عدد المستفيدين من نصف منحة
        private long associationMealBeneficiaries; // المستفيدون من الإطعام من الجمعية
        private long educationMealBeneficiaries;   // المستفيدون من الإطعام من التربية الوطنية
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BeneficiariesDTO {
        private SeasonBeneficiariesDTO season2324;
        private SeasonBeneficiariesDTO season2425;
        private SeasonBeneficiariesDTO season2526;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SeasonBeneficiariesDTO {
        private long total;
        private long male;
        private long female;
        private long primary;
        private long middle;
        private long high;
        // Housing KPIs
        private long orphans;    // اليتامى
        private long disabled;   // ذوي الاحتياجات الخاصة
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class HumanResourcesDTO {
        private StaffCategoryDTO directors;
        private StaffCategoryDTO educators;
        private StaffCategoryDTO cooks;
        private StaffCategoryDTO guards;
        private StaffCategoryDTO other;
        private long totalStaff;
        private long totalWithCnss;
        private long totalWithSmig;
        private BigDecimal totalMonthlyCost;
        private BigDecimal totalAnnualCost;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StaffCategoryDTO {
        private long total;
        private long association;
        private long deployed;
        private long volunteers;
        private long cnss;
        private long smig;
        private BigDecimal monthlyCost;
        private BigDecimal annualCost;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BuildingStatsDTO {
        // Building Status (وضعية البناية)
        private long rental;        // إيجار
        private long owned;         // ملكية
        private long atDisposal;    // وضع رهن إشارة المؤسسة
        private long statusOther;   // آخر
        
        // Building Condition (الحالة العامة للبناية)
        private long good;              // جيدة
        private long someDegradation;   // بعض علامات التدهور
        private long bad;               // متردية
        private long conditionOther;    // آخر
        
        // Renovation Capacity (إمكانية الترميم)
        private long easy;              // سهلة
        private long difficult;         // صعبة
        private long needsReconstruction; // تتطلب إعادة البناء
        
        // Owner Type (نوع المالك)
        private long stateDomain;   // الملك العام للدولة
        private long communal;      // جماعي
        private long privateOwner;  // ملك خصوصي
        private long ownerOther;    // آخر
        
        // Partnership Agreement (اتفاقية شراكة)
        private long hasPartnership;    // نعم
        private long noPartnership;     // لا
    }
}
