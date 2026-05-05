package ma.social.care.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.social.care.dto.statistics.DashboardStatsDTO;
import ma.social.care.dto.statistics.DashboardStatsDTO.*;
import ma.social.care.dto.statistics.PrefectureStatsDTO;
import ma.social.care.dto.statistics.RegionStatsDTO;
import ma.social.care.entity.*;
import ma.social.care.entity.embeddable.SeasonBeneficiaries;
import ma.social.care.entity.enums.*;
import ma.social.care.repository.InstitutionRepository;
import ma.social.care.repository.StaffMemberRepository;
import ma.social.care.service.StatisticsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
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
        log.info("Computing comprehensive dashboard statistics");
        
        // Fetch all institutions with relations for comprehensive stats
        List<Institution> institutions = institutionRepository.findAllActiveWithRelations();
        
        if (institutions.isEmpty()) {
            log.info("No institutions found, returning empty statistics");
            return buildEmptyStats();
        }

        long totalInstitutions = institutions.size();
        
        // Basic counts
        long totalCapacity = institutions.stream()
                .mapToLong(i -> i.getTotalCapacity() != null ? i.getTotalCapacity() : 0)
                .sum();
        
        // By institution type
        long darTalibCount = countByType(institutions, InstitutionType.DAR_TALIB);
        long darTalibaCount = countByType(institutions, InstitutionType.DAR_TALIBA);
        long mixedCount = countByType(institutions, InstitutionType.DAR_TALIB_TALIBA);
        
        // By milieu
        long urbanCount = countByMilieu(institutions, Milieu.URBAIN);
        long ruralCount = countByMilieu(institutions, Milieu.RURAL);
        
        // By legal status
        long licensedCount = countByLegalStatus(institutions, LegalStatus.LICENSED);
        long unlicensedCount = totalInstitutions - licensedCount;
        
        // Services
        long institutionsWithHousing = institutions.stream()
                .filter(i -> Boolean.TRUE.equals(i.getHousing()))
                .count();
        long institutionsWithMeals = institutions.stream()
                .filter(i -> Boolean.TRUE.equals(i.getMeals()))
                .count();
        
        // Calculate total beneficiaries
        long totalBeneficiaries = calculateTotalBeneficiaries(institutions);
        
        // Group by region and prefecture
        List<RegionStatsDTO> byRegion = computeRegionStats(institutions);
        List<PrefectureStatsDTO> byPrefecture = computePrefectureStats(institutions);
        
        // Staff count
        long totalStaffCount = staffMemberRepository.count();
        
        double averageCapacity = totalInstitutions > 0 
                ? (double) totalCapacity / totalInstitutions 
                : 0.0;
        
        // === Compute new KPIs ===
        TypeStatsDTO typeStats = computeTypeStats(institutions);
        TargetLevelsDTO targetLevels = computeTargetLevels(institutions);
        BuildingFinancingDTO buildingFinancing = computeBuildingFinancing(institutions);
        EquipmentFinancingDTO equipmentFinancing = computeEquipmentFinancing(institutions);
        OperatingFinancingDTO operatingFinancing = computeOperatingFinancing(institutions);
        MealServiceDTO mealService = computeMealService(institutions);
        BeneficiariesDTO beneficiaries = computeBeneficiaries(institutions);
        HumanResourcesDTO humanResources = computeHumanResources(institutions);
        
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
                // New KPIs
                .typeStats(typeStats)
                .targetLevels(targetLevels)
                .buildingFinancing(buildingFinancing)
                .equipmentFinancing(equipmentFinancing)
                .operatingFinancing(operatingFinancing)
                .mealService(mealService)
                .beneficiaries(beneficiaries)
                .humanResources(humanResources)
                .build();
        
        log.info("Dashboard statistics computed: {} institutions, {} capacity, {} beneficiaries", 
                totalInstitutions, totalCapacity, totalBeneficiaries);
        
        return stats;
    }
    
    private DashboardStatsDTO buildEmptyStats() {
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
    
    // === Type Stats ===
    private TypeStatsDTO computeTypeStats(List<Institution> institutions) {
        return TypeStatsDTO.builder()
                .darTalib(computeTypeDetail(institutions, InstitutionType.DAR_TALIB))
                .darTaliba(computeTypeDetail(institutions, InstitutionType.DAR_TALIBA))
                .mixed(computeTypeDetail(institutions, InstitutionType.DAR_TALIB_TALIBA))
                .build();
    }
    
    private TypeDetailDTO computeTypeDetail(List<Institution> institutions, InstitutionType type) {
        List<Institution> filtered = institutions.stream()
                .filter(i -> i.getInstitutionType() == type)
                .collect(Collectors.toList());
        
        return TypeDetailDTO.builder()
                .total(filtered.size())
                .licensed(filtered.stream().filter(i -> i.getLegalStatus() == LegalStatus.LICENSED).count())
                .unlicensed(filtered.stream().filter(i -> i.getLegalStatus() != LegalStatus.LICENSED).count())
                .urban(filtered.stream().filter(i -> i.getMilieu() == Milieu.URBAIN).count())
                .rural(filtered.stream().filter(i -> i.getMilieu() == Milieu.RURAL).count())
                .build();
    }
    
    // === Target Levels ===
    private TargetLevelsDTO computeTargetLevels(List<Institution> institutions) {
        return TargetLevelsDTO.builder()
                .primary(institutions.stream().filter(i -> Boolean.TRUE.equals(i.getPrimary())).count())
                .middleSchool(institutions.stream().filter(i -> Boolean.TRUE.equals(i.getMiddleSchool())).count())
                .highSchool(institutions.stream().filter(i -> Boolean.TRUE.equals(i.getHighSchool())).count())
                .other(institutions.stream().filter(i -> Boolean.TRUE.equals(i.getOther())).count())
                .build();
    }
    
    // === Building Financing ===
    private BuildingFinancingDTO computeBuildingFinancing(List<Institution> institutions) {
        BigDecimal totalCost = BigDecimal.ZERO;
        long solidarityMinistry = 0, nationalEntraide = 0, indh = 0, commune = 0;
        long fondationMohammed5 = 0, nationalRevival = 0, association = 0, other = 0;
        
        for (Institution inst : institutions) {
            Financing f = inst.getFinancing();
            if (f != null) {
                if (Boolean.TRUE.equals(f.getSolidarityMinistry())) solidarityMinistry++;
                if (Boolean.TRUE.equals(f.getNationalEntraide())) nationalEntraide++;
                if (Boolean.TRUE.equals(f.getIndh())) indh++;
                if (Boolean.TRUE.equals(f.getCommune())) commune++;
                if (Boolean.TRUE.equals(f.getFondationMohammed5())) fondationMohammed5++;
                if (Boolean.TRUE.equals(f.getNationalRevival())) nationalRevival++;
                if (Boolean.TRUE.equals(f.getAssociation())) association++;
                if (Boolean.TRUE.equals(f.getOtherConstruction())) other++;
                if (f.getTotalConstructionCost() != null) {
                    totalCost = totalCost.add(f.getTotalConstructionCost());
                }
            }
        }
        
        return BuildingFinancingDTO.builder()
                .solidarityMinistry(solidarityMinistry)
                .nationalEntraide(nationalEntraide)
                .indh(indh)
                .commune(commune)
                .fondationMohammed5(fondationMohammed5)
                .nationalRevival(nationalRevival)
                .association(association)
                .other(other)
                .totalCost(totalCost)
                .build();
    }
    
    // === Equipment Financing ===
    private EquipmentFinancingDTO computeEquipmentFinancing(List<Institution> institutions) {
        long solidarityMinistry = 0, nationalEntraide = 0, indh = 0, commune = 0;
        long fondationMohammed5 = 0, association = 0, other = 0;
        
        for (Institution inst : institutions) {
            Financing f = inst.getFinancing();
            if (f != null) {
                if (Boolean.TRUE.equals(f.getEquipmentSolidarityMinistry())) solidarityMinistry++;
                if (Boolean.TRUE.equals(f.getEquipmentNationalEntraide())) nationalEntraide++;
                if (Boolean.TRUE.equals(f.getEquipmentIndh())) indh++;
                if (Boolean.TRUE.equals(f.getEquipmentCommune())) commune++;
                if (Boolean.TRUE.equals(f.getEquipmentFondationMohammed5())) fondationMohammed5++;
                if (Boolean.TRUE.equals(f.getEquipmentAssociation())) association++;
                if (Boolean.TRUE.equals(f.getEquipmentOther())) other++;
            }
        }
        
        return EquipmentFinancingDTO.builder()
                .solidarityMinistry(solidarityMinistry)
                .nationalEntraide(nationalEntraide)
                .indh(indh)
                .commune(commune)
                .fondationMohammed5(fondationMohammed5)
                .association(association)
                .other(other)
                .build();
    }
    
    // === Operating Financing ===
    private OperatingFinancingDTO computeOperatingFinancing(List<Institution> institutions) {
        long opIndh = 0, opNationalEntraide = 0, opNationalEducation = 0, opCommune = 0;
        long opParentContributions = 0, opDonors = 0, opAssociationOwnSources = 0, opOther = 0;
        BigDecimal totalManagement = BigDecimal.ZERO, totalHR = BigDecimal.ZERO;
        BigDecimal totalMeals = BigDecimal.ZERO, totalIndividual = BigDecimal.ZERO;
        double sumAssociationShare = 0, sumEducationShare = 0, sumOtherShare = 0;
        int shareCount = 0;
        
        for (Institution inst : institutions) {
            Financing f = inst.getFinancing();
            if (f != null) {
                if (Boolean.TRUE.equals(f.getOperatingIndh())) opIndh++;
                if (Boolean.TRUE.equals(f.getOperatingNationalEntraide())) opNationalEntraide++;
                if (Boolean.TRUE.equals(f.getOperatingNationalEducation())) opNationalEducation++;
                if (Boolean.TRUE.equals(f.getOperatingCommune())) opCommune++;
                if (Boolean.TRUE.equals(f.getOperatingParentContributions())) opParentContributions++;
                if (Boolean.TRUE.equals(f.getOperatingDonors())) opDonors++;
                if (Boolean.TRUE.equals(f.getOperatingAssociationOwnSources())) opAssociationOwnSources++;
                if (Boolean.TRUE.equals(f.getOperatingOther())) opOther++;
                
                if (f.getAnnualManagementCost() != null) totalManagement = totalManagement.add(f.getAnnualManagementCost());
                if (f.getAnnualHRCost() != null) totalHR = totalHR.add(f.getAnnualHRCost());
                if (f.getAnnualMealsCost() != null) totalMeals = totalMeals.add(f.getAnnualMealsCost());
                if (f.getIndividualAnnualCost() != null) totalIndividual = totalIndividual.add(f.getIndividualAnnualCost());
                
                if (f.getAssociationShare() != null || f.getEducationShare() != null || f.getOtherShare() != null) {
                    sumAssociationShare += f.getAssociationShare() != null ? f.getAssociationShare() : 0;
                    sumEducationShare += f.getEducationShare() != null ? f.getEducationShare() : 0;
                    sumOtherShare += f.getOtherShare() != null ? f.getOtherShare() : 0;
                    shareCount++;
                }
            }
        }
        
        return OperatingFinancingDTO.builder()
                .indh(opIndh)
                .nationalEntraide(opNationalEntraide)
                .nationalEducation(opNationalEducation)
                .commune(opCommune)
                .parentContributions(opParentContributions)
                .donors(opDonors)
                .associationOwnSources(opAssociationOwnSources)
                .other(opOther)
                .annualManagementCost(totalManagement)
                .annualHRCost(totalHR)
                .annualMealsCost(totalMeals)
                .individualAnnualCost(totalIndividual)
                .averageAssociationShare(shareCount > 0 ? Math.round((sumAssociationShare / shareCount) * 100.0) / 100.0 : 0)
                .averageEducationShare(shareCount > 0 ? Math.round((sumEducationShare / shareCount) * 100.0) / 100.0 : 0)
                .averageOtherShare(shareCount > 0 ? Math.round((sumOtherShare / shareCount) * 100.0) / 100.0 : 0)
                .build();
    }
    
    // === Meal Service ===
    private MealServiceDTO computeMealService(List<Institution> institutions) {
        long institutionKitchen = 0, readyMeals = 0, other = 0;
        long totalMealBeneficiaries = 0;
        
        for (Institution inst : institutions) {
            HousingMeals hm = inst.getHousingMeals();
            if (hm != null) {
                if (hm.getMealServiceType() == MealServiceType.INSTITUTION_KITCHEN) institutionKitchen++;
                else if (hm.getMealServiceType() == MealServiceType.READY_MEALS) readyMeals++;
                else if (hm.getMealServiceType() == MealServiceType.OTHER) other++;
                
                if (hm.getTotalMealBeneficiaries2526() != null) {
                    totalMealBeneficiaries += hm.getTotalMealBeneficiaries2526();
                }
            }
        }
        
        return MealServiceDTO.builder()
                .institutionKitchen(institutionKitchen)
                .readyMeals(readyMeals)
                .other(other)
                .totalMealBeneficiaries(totalMealBeneficiaries)
                .build();
    }
    
    // === Beneficiaries ===
    private BeneficiariesDTO computeBeneficiaries(List<Institution> institutions) {
        SeasonBeneficiariesDTO s2324 = computeSeasonBeneficiaries(institutions, "2324");
        SeasonBeneficiariesDTO s2425 = computeSeasonBeneficiaries(institutions, "2425");
        SeasonBeneficiariesDTO s2526 = computeSeasonBeneficiaries(institutions, "2526");
        
        return BeneficiariesDTO.builder()
                .season2324(s2324)
                .season2425(s2425)
                .season2526(s2526)
                .build();
    }
    
    private SeasonBeneficiariesDTO computeSeasonBeneficiaries(List<Institution> institutions, String season) {
        long total = 0, male = 0, female = 0, primary = 0, middle = 0, high = 0;
        
        for (Institution inst : institutions) {
            HousingMeals hm = inst.getHousingMeals();
            if (hm != null) {
                SeasonBeneficiaries sb = null;
                switch (season) {
                    case "2324": sb = hm.getSeason2324(); break;
                    case "2425": sb = hm.getSeason2425(); break;
                    case "2526": sb = hm.getSeason2526(); break;
                }
                
                if (sb != null) {
                    if (sb.getTotalBeneficiaries() != null) total += sb.getTotalBeneficiaries();
                    if (sb.getMaleBeneficiaries() != null) male += sb.getMaleBeneficiaries();
                    if (sb.getFemaleBeneficiaries() != null) female += sb.getFemaleBeneficiaries();
                    if (sb.getPrimaryBeneficiaries() != null) primary += sb.getPrimaryBeneficiaries();
                    if (sb.getMiddleSchoolBeneficiaries() != null) middle += sb.getMiddleSchoolBeneficiaries();
                    if (sb.getHighSchoolBeneficiaries() != null) high += sb.getHighSchoolBeneficiaries();
                }
            }
        }
        
        return SeasonBeneficiariesDTO.builder()
                .total(total)
                .male(male)
                .female(female)
                .primary(primary)
                .middle(middle)
                .high(high)
                .build();
    }
    
    // === Human Resources ===
    private HumanResourcesDTO computeHumanResources(List<Institution> institutions) {
        Map<StaffType, StaffCategoryDTO.StaffCategoryDTOBuilder> staffMap = new EnumMap<>(StaffType.class);
        for (StaffType type : StaffType.values()) {
            staffMap.put(type, StaffCategoryDTO.builder()
                    .total(0).association(0).deployed(0).volunteers(0).cnss(0).smig(0)
                    .monthlyCost(BigDecimal.ZERO).annualCost(BigDecimal.ZERO));
        }
        
        long totalStaff = 0, totalCnss = 0, totalSmig = 0;
        BigDecimal totalMonthlyCost = BigDecimal.ZERO, totalAnnualCost = BigDecimal.ZERO;
        
        for (Institution inst : institutions) {
            for (StaffMember sm : inst.getStaffMembers()) {
                StaffCategoryDTO.StaffCategoryDTOBuilder builder = staffMap.get(sm.getStaffType());
                if (builder != null) {
                    int assoc = sm.getNbAssociation() != null ? sm.getNbAssociation() : 0;
                    int deployed = sm.getNbDeployed() != null ? sm.getNbDeployed() : 0;
                    int volunteers = sm.getNbVolunteers() != null ? sm.getNbVolunteers() : 0;
                    int cnss = sm.getNbCNSS() != null ? sm.getNbCNSS() : 0;
                    int smig = sm.getNbSMIG() != null ? sm.getNbSMIG() : 0;
                    int staffTotal = assoc + deployed + volunteers;
                    
                    // We need to get and update values - this is a bit tricky with builder pattern
                    // Let's use a different approach with mutable objects
                }
            }
        }
        
        // Recalculate using direct accumulation
        StaffCategoryDTO directors = computeStaffCategory(institutions, StaffType.DIRECTOR);
        StaffCategoryDTO educators = computeStaffCategory(institutions, StaffType.EDUCATORS);
        StaffCategoryDTO cooks = computeStaffCategory(institutions, StaffType.KITCHEN_AGENTS);
        StaffCategoryDTO guards = computeStaffCategory(institutions, StaffType.SECURITY);
        StaffCategoryDTO otherStaff = computeStaffCategory(institutions, StaffType.OTHER);
        
        totalStaff = directors.getTotal() + educators.getTotal() + cooks.getTotal() + guards.getTotal() + otherStaff.getTotal();
        totalCnss = directors.getCnss() + educators.getCnss() + cooks.getCnss() + guards.getCnss() + otherStaff.getCnss();
        totalSmig = directors.getSmig() + educators.getSmig() + cooks.getSmig() + guards.getSmig() + otherStaff.getSmig();
        totalMonthlyCost = directors.getMonthlyCost().add(educators.getMonthlyCost()).add(cooks.getMonthlyCost())
                .add(guards.getMonthlyCost()).add(otherStaff.getMonthlyCost());
        totalAnnualCost = directors.getAnnualCost().add(educators.getAnnualCost()).add(cooks.getAnnualCost())
                .add(guards.getAnnualCost()).add(otherStaff.getAnnualCost());
        
        return HumanResourcesDTO.builder()
                .directors(directors)
                .educators(educators)
                .cooks(cooks)
                .guards(guards)
                .other(otherStaff)
                .totalStaff(totalStaff)
                .totalWithCnss(totalCnss)
                .totalWithSmig(totalSmig)
                .totalMonthlyCost(totalMonthlyCost)
                .totalAnnualCost(totalAnnualCost)
                .build();
    }
    
    private StaffCategoryDTO computeStaffCategory(List<Institution> institutions, StaffType type) {
        long total = 0, association = 0, deployed = 0, volunteers = 0, cnss = 0, smig = 0;
        BigDecimal monthlyCost = BigDecimal.ZERO, annualCost = BigDecimal.ZERO;
        
        for (Institution inst : institutions) {
            for (StaffMember sm : inst.getStaffMembers()) {
                if (sm.getStaffType() == type) {
                    int assoc = sm.getNbAssociation() != null ? sm.getNbAssociation() : 0;
                    int dep = sm.getNbDeployed() != null ? sm.getNbDeployed() : 0;
                    int vol = sm.getNbVolunteers() != null ? sm.getNbVolunteers() : 0;
                    
                    total += assoc + dep + vol;
                    association += assoc;
                    deployed += dep;
                    volunteers += vol;
                    cnss += sm.getNbCNSS() != null ? sm.getNbCNSS() : 0;
                    smig += sm.getNbSMIG() != null ? sm.getNbSMIG() : 0;
                    
                    if (sm.getMonthlyCost() != null) monthlyCost = monthlyCost.add(sm.getMonthlyCost());
                    if (sm.getAnnualCost() != null) annualCost = annualCost.add(sm.getAnnualCost());
                }
            }
        }
        
        return StaffCategoryDTO.builder()
                .total(total)
                .association(association)
                .deployed(deployed)
                .volunteers(volunteers)
                .cnss(cnss)
                .smig(smig)
                .monthlyCost(monthlyCost)
                .annualCost(annualCost)
                .build();
    }
    
    // === Helper methods ===
    
    private long countByType(List<Institution> institutions, InstitutionType type) {
        return institutions.stream().filter(i -> i.getInstitutionType() == type).count();
    }
    
    private long countByMilieu(List<Institution> institutions, Milieu milieu) {
        return institutions.stream().filter(i -> i.getMilieu() == milieu).count();
    }
    
    private long countByLegalStatus(List<Institution> institutions, LegalStatus status) {
        return institutions.stream().filter(i -> i.getLegalStatus() == status).count();
    }
    
    private long calculateTotalBeneficiaries(List<Institution> institutions) {
        long total = 0;
        
        for (Institution institution : institutions) {
            HousingMeals housingMeals = institution.getHousingMeals();
            if (housingMeals != null) {
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
