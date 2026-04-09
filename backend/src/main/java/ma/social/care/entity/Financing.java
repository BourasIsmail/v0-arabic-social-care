package ma.social.care.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "financings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Financing extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institution_id", nullable = false, unique = true)
    private Institution institution;

    // === Construction Funding Sources ===
    @Column(name = "construction_solidarity_ministry")
    private Boolean solidarityMinistry;

    @Column(name = "construction_national_entraide")
    private Boolean nationalEntraide;

    @Column(name = "construction_indh")
    private Boolean indh;

    @Column(name = "construction_commune")
    private Boolean commune;

    @Column(name = "construction_fondation_mohammed5")
    private Boolean fondationMohammed5;

    @Column(name = "construction_national_revival")
    private Boolean nationalRevival;

    @Column(name = "construction_association")
    private Boolean association;

    @Column(name = "construction_other")
    private Boolean otherConstruction;

    @Column(name = "construction_other_detail")
    private String otherConstructionDetail;

    // === Equipment Funding Sources ===
    @Column(name = "equipment_solidarity_ministry")
    private Boolean equipmentSolidarityMinistry;

    @Column(name = "equipment_national_entraide")
    private Boolean equipmentNationalEntraide;

    @Column(name = "equipment_indh")
    private Boolean equipmentIndh;

    @Column(name = "equipment_commune")
    private Boolean equipmentCommune;

    @Column(name = "equipment_fondation_mohammed5")
    private Boolean equipmentFondationMohammed5;

    @Column(name = "equipment_association")
    private Boolean equipmentAssociation;

    @Column(name = "equipment_other")
    private Boolean equipmentOther;

    @Column(name = "equipment_other_detail")
    private String equipmentOtherDetail;

    // === Costs ===
    @Column(name = "total_construction_cost", precision = 15, scale = 2)
    private BigDecimal totalConstructionCost;

    @Column(name = "annual_management_cost", precision = 15, scale = 2)
    private BigDecimal annualManagementCost;

    // === Operating Funding Sources ===
    @Column(name = "operating_indh")
    private Boolean operatingIndh;

    @Column(name = "operating_national_entraide")
    private Boolean operatingNationalEntraide;

    @Column(name = "operating_national_education")
    private Boolean operatingNationalEducation;

    @Column(name = "operating_commune")
    private Boolean operatingCommune;

    @Column(name = "operating_parent_contributions")
    private Boolean operatingParentContributions;

    @Column(name = "parent_contribution_amount", precision = 15, scale = 2)
    private BigDecimal parentContributionAmount;

    @Column(name = "operating_donors")
    private Boolean operatingDonors;

    @Column(name = "operating_association_own_sources")
    private Boolean operatingAssociationOwnSources;

    @Column(name = "operating_other")
    private Boolean operatingOther;

    @Column(name = "operating_other_detail")
    private String operatingOtherDetail;

    // === Additional Costs ===
    @Column(name = "annual_hr_cost", precision = 15, scale = 2)
    private BigDecimal annualHRCost;

    @Column(name = "annual_meals_cost", precision = 15, scale = 2)
    private BigDecimal annualMealsCost;

    @Column(name = "total_meals_amount", precision = 15, scale = 2)
    private BigDecimal totalMealsAmount;

    // === Shares (percentages) ===
    @Column(name = "association_share")
    private Double associationShare;

    @Column(name = "education_share")
    private Double educationShare;

    @Column(name = "other_share")
    private Double otherShare;

    // === Other Expenses ===
    @Column(name = "annual_other_expenses", precision = 15, scale = 2)
    private BigDecimal annualOtherExpenses;

    @Column(name = "individual_annual_cost", precision = 15, scale = 2)
    private BigDecimal individualAnnualCost;
}
