package ma.social.care.entity.embeddable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeasonBeneficiaries {

    @Column(name = "total_beneficiaries")
    private Integer totalBeneficiaries;

    @Column(name = "male_beneficiaries")
    private Integer maleBeneficiaries;

    @Column(name = "female_beneficiaries")
    private Integer femaleBeneficiaries;

    @Column(name = "primary_beneficiaries")
    private Integer primaryBeneficiaries;

    @Column(name = "middle_school_beneficiaries")
    private Integer middleSchoolBeneficiaries;

    @Column(name = "high_school_beneficiaries")
    private Integer highSchoolBeneficiaries;

    @Column(name = "orphans")
    private Integer orphans;

    @Column(name = "disabled")
    private Integer disabled;
}
