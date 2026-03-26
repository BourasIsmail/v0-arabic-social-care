package ma.social.care.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.*;
import ma.social.care.entity.enums.MealServiceType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HousingMealsDTO {

    @Valid
    private SeasonBeneficiariesDTO season2324;

    @Valid
    private SeasonBeneficiariesDTO season2425;

    @Valid
    private SeasonBeneficiariesDTO season2526;

    private String capacityRemarks;

    @Min(value = 0, message = "Total meal beneficiaries cannot be negative")
    private Integer totalMealBeneficiaries2526;

    @Min(value = 0, message = "Association meal beneficiaries cannot be negative")
    private Integer associationMealBeneficiaries;

    @Min(value = 0, message = "Education meal beneficiaries cannot be negative")
    private Integer educationMealBeneficiaries;

    @Min(value = 0, message = "Full grant count cannot be negative")
    private Integer fullGrantCount;

    @Min(value = 0, message = "Half grant count cannot be negative")
    private Integer halfGrantCount;

    private MealServiceType mealServiceType;

    // Improvement Suggestions
    private Boolean increaseProducts;
    private Boolean externalCaterer;
    private Boolean otherSuggestion;
    private String otherSuggestionDetail;
}
