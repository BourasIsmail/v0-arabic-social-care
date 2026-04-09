package ma.social.care.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinancingDTO {

    // Construction Funding Sources
    private Boolean solidarityMinistry;
    private Boolean nationalEntraide;
    private Boolean indh;
    private Boolean commune;
    private Boolean fondationMohammed5;
    private Boolean nationalRevival;
    private Boolean association;
    private Boolean otherConstruction;
    private String otherConstructionDetail;

    // Equipment Funding Sources
    private Boolean equipmentSolidarityMinistry;
    private Boolean equipmentNationalEntraide;
    private Boolean equipmentIndh;
    private Boolean equipmentCommune;
    private Boolean equipmentFondationMohammed5;
    private Boolean equipmentAssociation;
    private Boolean equipmentOther;
    private String equipmentOtherDetail;

    // Costs
    @DecimalMin(value = "0.0", message = "Total construction cost cannot be negative")
    private BigDecimal totalConstructionCost;

    @DecimalMin(value = "0.0", message = "Annual management cost cannot be negative")
    private BigDecimal annualManagementCost;

    // Operating Funding Sources
    private Boolean operatingIndh;
    private Boolean operatingNationalEntraide;
    private Boolean operatingNationalEducation;
    private Boolean operatingCommune;
    private Boolean operatingParentContributions;
    
    @DecimalMin(value = "0.0", message = "Parent contribution amount cannot be negative")
    private BigDecimal parentContributionAmount;
    
    private Boolean operatingDonors;
    private Boolean operatingAssociationOwnSources;
    private Boolean operatingOther;
    private String operatingOtherDetail;

    // Additional Costs
    @DecimalMin(value = "0.0", message = "Annual HR cost cannot be negative")
    private BigDecimal annualHRCost;

    @DecimalMin(value = "0.0", message = "Annual meals cost cannot be negative")
    private BigDecimal annualMealsCost;

    @DecimalMin(value = "0.0", message = "Total meals amount cannot be negative")
    private BigDecimal totalMealsAmount;

    // Shares (percentages)
    @Min(value = 0, message = "Association share cannot be negative")
    @Max(value = 100, message = "Association share cannot exceed 100%")
    private Double associationShare;

    @Min(value = 0, message = "Education share cannot be negative")
    @Max(value = 100, message = "Education share cannot exceed 100%")
    private Double educationShare;

    @Min(value = 0, message = "Other share cannot be negative")
    @Max(value = 100, message = "Other share cannot exceed 100%")
    private Double otherShare;

    // Other Expenses
    @DecimalMin(value = "0.0", message = "Annual other expenses cannot be negative")
    private BigDecimal annualOtherExpenses;

    @DecimalMin(value = "0.0", message = "Individual annual cost cannot be negative")
    private BigDecimal individualAnnualCost;
}
