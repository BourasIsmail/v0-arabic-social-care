package ma.social.care.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.social.care.dto.statistics.DashboardStatsDTO;
import ma.social.care.service.StatisticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/statistics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StatisticsController {

    private final StatisticsService statisticsService;

    /**
     * Get comprehensive dashboard statistics
     * Includes counts, distributions, and geographic breakdowns
     */
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDTO> getDashboardStatistics() {
        log.info("GET /api/v1/statistics/dashboard - Fetching dashboard statistics");
        DashboardStatsDTO stats = statisticsService.getDashboardStatistics();
        return ResponseEntity.ok(stats);
    }
}
