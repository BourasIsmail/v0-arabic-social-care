package ma.social.care.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import ma.social.care.entity.enums.StaffType;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffMemberDTO {

    private Long id;

    @NotNull(message = "Staff type is required")
    private StaffType staffType;

    @Min(value = 0, message = "Association staff count cannot be negative")
    private Integer nbAssociation;

    @Min(value = 0, message = "Deployed staff count cannot be negative")
    private Integer nbDeployed;

    @Min(value = 0, message = "Volunteers count cannot be negative")
    private Integer nbVolunteers;

    @Min(value = 0, message = "CNSS count cannot be negative")
    private Integer nbCNSS;

    @Min(value = 0, message = "SMIG count cannot be negative")
    private Integer nbSMIG;

    @DecimalMin(value = "0.0", message = "Monthly cost cannot be negative")
    private BigDecimal monthlyCost;

    @DecimalMin(value = "0.0", message = "Annual cost cannot be negative")
    private BigDecimal annualCost;
}
