package ma.social.care.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import ma.social.care.entity.enums.StaffType;

import java.math.BigDecimal;

@Entity
@Table(name = "staff_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class StaffMember extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institution_id", nullable = false)
    private Institution institution;

    @Enumerated(EnumType.STRING)
    @Column(name = "staff_type", nullable = false)
    private StaffType staffType;

    @Column(name = "nb_association")
    private Integer nbAssociation;

    @Column(name = "nb_deployed")
    private Integer nbDeployed;

    @Column(name = "nb_volunteers")
    private Integer nbVolunteers;

    @Column(name = "nb_cnss")
    private Integer nbCNSS;

    @Column(name = "nb_smig")
    private Integer nbSMIG;

    @Column(name = "monthly_cost", precision = 12, scale = 2)
    private BigDecimal monthlyCost;

    @Column(name = "annual_cost", precision = 15, scale = 2)
    private BigDecimal annualCost;
}
