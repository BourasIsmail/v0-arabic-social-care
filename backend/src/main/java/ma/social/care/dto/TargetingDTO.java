package ma.social.care.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import lombok.*;
import ma.social.care.entity.enums.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TargetingDTO {

    // Selection Criteria
    private Boolean socialSituation;
    private Boolean distance;
    private Boolean schoolResults;
    private Boolean scholarship;
    private Boolean otherCriteria;
    private String otherCriteriaDetail;

    // Priorities
    private String priority1;
    private String priority2;
    private String priority3;
    private String priority4;
    private String priority5;

    // Selection Body
    private SelectionBody selectionBody;

    // Committee Members
    private Boolean committeeAssociation;
    private Boolean committeeNationalEntraide;
    private Boolean committeeNationalEducation;
    private Boolean committeeCommune;
    private Boolean committeeLocalAuthorities;
    private Boolean otherMember;
    private String otherMemberDetail;

    // Additional Info
    @Min(value = 0, message = "Unsatisfied requests count cannot be negative")
    private Integer unsatisfiedRequestsCount;

    private Boolean servicesAreFree;
    private TariffType tariffType;

    @DecimalMin(value = "0.0", message = "Uniform amount cannot be negative")
    private BigDecimal uniformAmount;

    private TariffBracket tariffBracket;
}
