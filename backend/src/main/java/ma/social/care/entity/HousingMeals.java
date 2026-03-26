package ma.social.care.entity;

import jakarta.persistence.*;
import lombok.*;
import ma.social.care.entity.embeddable.SeasonBeneficiaries;
import ma.social.care.entity.enums.MealServiceType;

@Entity
@Table(name = "housing_meals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HousingMeals extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institution_id", nullable = false, unique = true)
    private Institution institution;

    // === Season Beneficiaries ===
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "total", column = @Column(name = "season_2324_total")),
            @AttributeOverride(name = "male", column = @Column(name = "season_2324_male")),
            @AttributeOverride(name = "female", column = @Column(name = "season_2324_female")),
            @AttributeOverride(name = "primary", column = @Column(name = "season_2324_primary")),
            @AttributeOverride(name = "middleSchool", column = @Column(name = "season_2324_middle_school")),
            @AttributeOverride(name = "highSchool", column = @Column(name = "season_2324_high_school")),
            @AttributeOverride(name = "other", column = @Column(name = "season_2324_other"))
    })
    private SeasonBeneficiaries season2324;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "total", column = @Column(name = "season_2425_total")),
            @AttributeOverride(name = "male", column = @Column(name = "season_2425_male")),
            @AttributeOverride(name = "female", column = @Column(name = "season_2425_female")),
            @AttributeOverride(name = "primary", column = @Column(name = "season_2425_primary")),
            @AttributeOverride(name = "middleSchool", column = @Column(name = "season_2425_middle_school")),
            @AttributeOverride(name = "highSchool", column = @Column(name = "season_2425_high_school")),
            @AttributeOverride(name = "other", column = @Column(name = "season_2425_other"))
    })
    private SeasonBeneficiaries season2425;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "total", column = @Column(name = "season_2526_total")),
            @AttributeOverride(name = "male", column = @Column(name = "season_2526_male")),
            @AttributeOverride(name = "female", column = @Column(name = "season_2526_female")),
            @AttributeOverride(name = "primary", column = @Column(name = "season_2526_primary")),
            @AttributeOverride(name = "middleSchool", column = @Column(name = "season_2526_middle_school")),
            @AttributeOverride(name = "highSchool", column = @Column(name = "season_2526_high_school")),
            @AttributeOverride(name = "other", column = @Column(name = "season_2526_other"))
    })
    private SeasonBeneficiaries season2526;

    @Column(name = "capacity_remarks", columnDefinition = "TEXT")
    private String capacityRemarks;

    // === Meal Beneficiaries ===
    @Column(name = "total_meal_beneficiaries_2526")
    private Integer totalMealBeneficiaries2526;

    @Column(name = "association_meal_beneficiaries")
    private Integer associationMealBeneficiaries;

    @Column(name = "education_meal_beneficiaries")
    private Integer educationMealBeneficiaries;

    @Column(name = "full_grant_count")
    private Integer fullGrantCount;

    @Column(name = "half_grant_count")
    private Integer halfGrantCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "meal_service_type")
    private MealServiceType mealServiceType;

    // === Improvement Suggestions ===
    @Column(name = "suggestion_increase_products")
    private Boolean increaseProducts;

    @Column(name = "suggestion_external_caterer")
    private Boolean externalCaterer;

    @Column(name = "suggestion_other")
    private Boolean otherSuggestion;

    @Column(name = "suggestion_other_detail")
    private String otherSuggestionDetail;
}
