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

    @Column(name = "total")
    private Integer total;

    @Column(name = "male")
    private Integer male;

    @Column(name = "female")
    private Integer female;

    @Column(name = "primary_level")
    private Integer primary;

    @Column(name = "middle_school")
    private Integer middleSchool;

    @Column(name = "high_school")
    private Integer highSchool;

    @Column(name = "other_level")
    private Integer other;
}
