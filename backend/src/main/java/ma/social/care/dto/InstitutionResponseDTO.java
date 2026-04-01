package ma.social.care.dto;

import lombok.*;
import ma.social.care.entity.enums.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstitutionResponseDTO {

    private Long id;

    // === Section 1: Institution Info ===
    private InstitutionType institutionType;
    private String associationName;
    private String institutionName;
    private String address;
    private Long regionId;
    private String regionName;
    private Long prefectureId;
    private String prefectureName;
    private Long communeId;
    private String communeName;
    private Milieu milieu;
    private Double latitude;
    private Double longitude;
    private Integer creationYear;
    private LegalStatus legalStatus;
    private String unlicensedReason;
    private String licenseNumber;
    private LocalDate serviceStartDate;

    // Services
    private Boolean housing;
    private Boolean meals;
    private Boolean educationalSupport;
    private Boolean culturalActivities;
    private Boolean healthCare;
    private Boolean insurance;
    private Boolean psychologicalSupport;

    // Capacity
    private Integer totalCapacity;
    private Integer maleCapacity;
    private Integer femaleCapacity;

    // Target Levels
    private Boolean primary;
    private Boolean middleSchool;
    private Boolean highSchool;
    private Boolean other;
    private String otherDetail;

    // Distance
    private Distance distanceToSchool;
    private Distance distanceToNationalBoardingSchool;

    // === Nested Sections ===
    private BuildingDTO building;
    private FinancingDTO financing;
    private TargetingDTO targeting;
    private HousingMealsDTO housingMeals;
    private List<StaffMemberDTO> staffMembers;

    // Signed PDF
    private String signedPdfUrl;

    // === Audit Fields ===
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
