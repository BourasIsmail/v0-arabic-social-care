package ma.social.care.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import ma.social.care.entity.enums.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstitutionRequestDTO {

    // === Section 1: Institution Info ===
    @NotNull(message = "Institution type is required")
    private InstitutionType institutionType;

    @NotBlank(message = "Association name is required")
    @Size(max = 255, message = "Association name cannot exceed 255 characters")
    private String associationName;

    @NotBlank(message = "Institution name is required")
    @Size(max = 255, message = "Institution name cannot exceed 255 characters")
    private String institutionName;

    @Size(max = 500, message = "Address cannot exceed 500 characters")
    private String address;

    private Long regionId;

    private Long prefectureId;

    private Long communeId;

    private Milieu milieu;

    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    private Double longitude;

    @Min(value = 1900, message = "Creation year must be at least 1900")
    @Max(value = 2100, message = "Creation year cannot exceed 2100")
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
    @Min(value = 0, message = "Total capacity cannot be negative")
    private Integer totalCapacity;

    @Min(value = 0, message = "Male capacity cannot be negative")
    private Integer maleCapacity;

    @Min(value = 0, message = "Female capacity cannot be negative")
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

    // === Section 2: Building Info ===
    @Valid
    private BuildingDTO building;

    // === Section 3: Financing ===
    @Valid
    private FinancingDTO financing;

    // === Section 4: Targeting ===
    @Valid
    private TargetingDTO targeting;

    // === Section 5: Housing & Meals ===
    @Valid
    private HousingMealsDTO housingMeals;

    // === Section 6: Staff ===
    @Valid
    private List<StaffMemberDTO> staffMembers;
}
