package ma.social.care.dto.statistics;

import lombok.*;

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
}
