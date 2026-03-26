package ma.social.care.dto;

import jakarta.validation.constraints.Min;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeasonBeneficiariesDTO {

    @Min(value = 0, message = "Total cannot be negative")
    private Integer total;

    @Min(value = 0, message = "Male count cannot be negative")
    private Integer male;

    @Min(value = 0, message = "Female count cannot be negative")
    private Integer female;

    @Min(value = 0, message = "Primary count cannot be negative")
    private Integer primary;

    @Min(value = 0, message = "Middle school count cannot be negative")
    private Integer middleSchool;

    @Min(value = 0, message = "High school count cannot be negative")
    private Integer highSchool;

    @Min(value = 0, message = "Other count cannot be negative")
    private Integer other;
}
