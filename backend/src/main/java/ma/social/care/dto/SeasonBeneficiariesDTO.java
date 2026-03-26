package ma.social.care.dto;

import jakarta.validation.constraints.Min;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeasonBeneficiariesDTO {

    @Min(value = 0, message = "Total beneficiaries cannot be negative")
    private Integer totalBeneficiaries;

    @Min(value = 0, message = "Male beneficiaries cannot be negative")
    private Integer maleBeneficiaries;

    @Min(value = 0, message = "Female beneficiaries cannot be negative")
    private Integer femaleBeneficiaries;

    @Min(value = 0, message = "Primary beneficiaries cannot be negative")
    private Integer primaryBeneficiaries;

    @Min(value = 0, message = "Middle school beneficiaries cannot be negative")
    private Integer middleSchoolBeneficiaries;

    @Min(value = 0, message = "High school beneficiaries cannot be negative")
    private Integer highSchoolBeneficiaries;

    @Min(value = 0, message = "Orphans count cannot be negative")
    private Integer orphans;

    @Min(value = 0, message = "Disabled count cannot be negative")
    private Integer disabled;
}
