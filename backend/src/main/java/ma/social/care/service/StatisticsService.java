package ma.social.care.service;

import ma.social.care.dto.statistics.DashboardStatsDTO;

public interface StatisticsService {
    
    /**
     * Get comprehensive dashboard statistics including:
     * - Total counts (institutions, capacity, beneficiaries)
     * - Distribution by type (Dar Talib, Dar Taliba, Mixed)
     * - Distribution by milieu (Urban, Rural)
     * - Distribution by legal status (Licensed, Unlicensed)
     * - Breakdown by region and prefecture
     * - Additional stats (staff count, housing, meals)
     * @param regionId Optional region filter
     * @param prefectureId Optional prefecture filter
     */
    DashboardStatsDTO getDashboardStatistics(Long regionId, Long prefectureId);
}
