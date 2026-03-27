package ma.social.care.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.social.care.dto.statistics.DashboardStatsDTO;
import ma.social.care.dto.statistics.PrefectureStatsDTO;
import ma.social.care.dto.statistics.RegionStatsDTO;
import ma.social.care.entity.Institution;
import ma.social.care.entity.HousingMeals;
import ma.social.care.entity.enums.InstitutionType;
import ma.social.care.entity.enums.LegalStatus;
import ma.social.care.entity.enums.Milieu;
import ma.social.care.repository.InstitutionRepository;
import ma.social.care.repository.StaffMemberRepository;
import ma.social.care.service.StatisticsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StatisticsServiceImpl implements StatisticsService {

    private final InstitutionRepository institutionRepository;
    private final StaffMemberRepository staffMemberRepository;

    @Override
    public DashboardStatsDTO getDashboardStatistics() {
        log.info("Computing dashboard statistics");
        
        // Use optimized count queries for basic stats
        long totalInstitutions = institutionRepository.countActiveInstitutions();
        
        if (totalInstitutions == 0) {
            log.info("No institutions found, returning empty statistics");
            return DashboardStatsDTO.builder()
                    .totalInstitutions(0)
                    .totalCapacity(0)
                    .totalBeneficiaries(0)
                    .darTalibCount(0)
                    .darTalibaCount(0)
                    .mixedCount(0)
                    .urbanCount(0)
                    .ruralCount(0)
                    .licensedCount(0)
                    .unlicensedCount(0)
                    .byRegion(Collections.emptyList())
                    .byPrefecture(Collections.emptyList())
                    .totalStaffCount(0)
                    .averageCapacity(0.0)
                    .institutionsWithHousing(0)
                    .institutionsWithMeals(0)
                    .build();
        }

        // Optimized count queries
        long totalCapacity = institutionRepository.sumTotalCapacity();
        
        // By institution type - optimized queries
        long darTalibCount = institutionRepository.countByInstitutionType(InstitutionType.DAR_TALIB);
        long darTalibaCount = institutionRepository.countByInstitutionType(InstitutionType.DAR_TALIBA);
        long mixedCount = institutionRepository.countByInstitutionType(InstitutionType.DAR_TALIB_TALIBA);
        
        // By milieu - optimized queries
        long urbanCount = institutionRepository.countByMilieu(Milieu.URBAIN);
        long ruralCount = institutionRepository.countByMilieu(Milieu.RURAL);
        
        // By legal status - optimized queries
        long licensedCount = institutionRepository.countByLegalStatus(LegalStatus.LICENSED);
        long unlicensedCount = institutionRepository.countByLegalStatus(LegalStatus.UNLICENSED);
        
        // Services - optimized queries
        long institutionsWithHousing = institutionRepository.countWithHousing();
        long institutionsWithMeals = institutionRepository.countWithMeals();
        
        // For region/prefecture stats and beneficiaries, we need to fetch institutions with relations
        List<Institution> institutions = institutionRepository.findAllActiveWithRelations();
        
        // Calculate total beneficiaries from housing meals season data
        long totalBeneficiaries = calculateTotalBeneficiaries(institutions);
        
        // Group by region
        List<RegionStatsDTO> byRegion = computeRegionStats(institutions);
        
        // Group by prefecture
        List<PrefectureStatsDTO> byPrefecture = computePrefectureStats(institutions);
        
        // Additional stats
        long totalStaffCount = staffMemberRepository.count();
        
        double averageCapacity = totalInstitutions > 0 
                ? (double) totalCapacity / totalInstitutions 
                : 0.0;
        
        DashboardStatsDTO stats = DashboardStatsDTO.builder()
                .totalInstitutions(totalInstitutions)
                .totalCapacity(totalCapacity)
                .totalBeneficiaries(totalBeneficiaries)
                .darTalibCount(darTalibCount)
                .darTalibaCount(darTalibaCount)
                .mixedCount(mixedCount)
                .urbanCount(urbanCount)
                .ruralCount(ruralCount)
                .licensedCount(licensedCount)
                .unlicensedCount(unlicensedCount)
                .byRegion(byRegion)
                .byPrefecture(byPrefecture)
                .totalStaffCount(totalStaffCount)
                .averageCapacity(Math.round(averageCapacity * 100.0) / 100.0)
                .institutionsWithHousing(institutionsWithHousing)
                .institutionsWithMeals(institutionsWithMeals)
                .build();
        
        log.info("Dashboard statistics computed: {} institutions, {} capacity, {} beneficiaries", 
                totalInstitutions, totalCapacity, totalBeneficiaries);
        
        return stats;
    }
    
    private long calculateTotalBeneficiaries(List<Institution> institutions) {
        long total = 0;
        
        for (Institution institution : institutions) {
            HousingMeals housingMeals = institution.getHousingMeals();
            if (housingMeals != null) {
                // Try to get beneficiaries from the most recent season data
                // Priority: 25-26 > 24-25 > 23-24
                if (housingMeals.getSeason2526() != null && housingMeals.getSeason2526().getTotalBeneficiaries() != null) {
                    total += housingMeals.getSeason2526().getTotalBeneficiaries();
                } else if (housingMeals.getSeason2425() != null && housingMeals.getSeason2425().getTotalBeneficiaries() != null) {
                    total += housingMeals.getSeason2425().getTotalBeneficiaries();
                } else if (housingMeals.getSeason2324() != null && housingMeals.getSeason2324().getTotalBeneficiaries() != null) {
                    total += housingMeals.getSeason2324().getTotalBeneficiaries();
                }
            }
        }
        
        return total;
    }
    
    private List<RegionStatsDTO> computeRegionStats(List<Institution> institutions) {
        Map<Long, RegionStatsDTO> regionMap = new HashMap<>();
        
        for (Institution institution : institutions) {
            if (institution.getRegion() != null) {
                Long regionId = institution.getRegion().getId();
                String regionName = institution.getRegion().getName();
                
                RegionStatsDTO stats = regionMap.computeIfAbsent(regionId, id -> 
                        RegionStatsDTO.builder()
                                .regionId(id)
                                .regionName(regionName)
                                .count(0)
                                .capacity(0)
                                .beneficiaries(0)
                                .build()
                );
                
                stats.setCount(stats.getCount() + 1);
                
                if (institution.getTotalCapacity() != null) {
                    stats.setCapacity(stats.getCapacity() + institution.getTotalCapacity());
                }
                
                // Add beneficiaries from housing meals
                HousingMeals housingMeals = institution.getHousingMeals();
                if (housingMeals != null) {
                    Integer beneficiaries = getLatestBeneficiaries(housingMeals);
                    if (beneficiaries != null) {
                        stats.setBeneficiaries(stats.getBeneficiaries() + beneficiaries);
                    }
                }
            }
        }
        
        return regionMap.values().stream()
                .sorted((a, b) -> Long.compare(b.getCount(), a.getCount()))
                .collect(Collectors.toList());
    }
    
    private List<PrefectureStatsDTO> computePrefectureStats(List<Institution> institutions) {
        Map<Long, PrefectureStatsDTO> prefectureMap = new HashMap<>();
        
        for (Institution institution : institutions) {
            if (institution.getPrefecture() != null) {
                Long prefectureId = institution.getPrefecture().getId();
                String prefectureName = institution.getPrefecture().getName();
                
                PrefectureStatsDTO stats = prefectureMap.computeIfAbsent(prefectureId, id -> 
                        PrefectureStatsDTO.builder()
                                .prefectureId(id)
                                .prefectureName(prefectureName)
                                .count(0)
                                .capacity(0)
                                .beneficiaries(0)
                                .build()
                );
                
                stats.setCount(stats.getCount() + 1);
                
                if (institution.getTotalCapacity() != null) {
                    stats.setCapacity(stats.getCapacity() + institution.getTotalCapacity());
                }
                
                // Add beneficiaries from housing meals
                HousingMeals housingMeals = institution.getHousingMeals();
                if (housingMeals != null) {
                    Integer beneficiaries = getLatestBeneficiaries(housingMeals);
                    if (beneficiaries != null) {
                        stats.setBeneficiaries(stats.getBeneficiaries() + beneficiaries);
                    }
                }
            }
        }
        
        return prefectureMap.values().stream()
                .sorted((a, b) -> Long.compare(b.getCount(), a.getCount()))
                .collect(Collectors.toList());
    }
    
    private Integer getLatestBeneficiaries(HousingMeals housingMeals) {
        if (housingMeals.getSeason2526() != null && housingMeals.getSeason2526().getTotalBeneficiaries() != null) {
            return housingMeals.getSeason2526().getTotalBeneficiaries();
        } else if (housingMeals.getSeason2425() != null && housingMeals.getSeason2425().getTotalBeneficiaries() != null) {
            return housingMeals.getSeason2425().getTotalBeneficiaries();
        } else if (housingMeals.getSeason2324() != null && housingMeals.getSeason2324().getTotalBeneficiaries() != null) {
            return housingMeals.getSeason2324().getTotalBeneficiaries();
        }
        return null;
    }
}
