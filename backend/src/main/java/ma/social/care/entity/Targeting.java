package ma.social.care.entity;

import jakarta.persistence.*;
import lombok.*;
import ma.social.care.entity.enums.*;

import java.math.BigDecimal;

@Entity
@Table(name = "targetings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Targeting extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institution_id", nullable = false, unique = true)
    private Institution institution;

    // === Selection Criteria ===
    @Column(name = "criteria_social_situation")
    private Boolean socialSituation;

    @Column(name = "criteria_distance")
    private Boolean distance;

    @Column(name = "criteria_school_results")
    private Boolean schoolResults;

    @Column(name = "criteria_scholarship")
    private Boolean scholarship;

    @Column(name = "criteria_other")
    private Boolean otherCriteria;

    @Column(name = "criteria_other_detail")
    private String otherCriteriaDetail;

    // === Priorities ===
    @Column(name = "priority_1")
    private String priority1;

    @Column(name = "priority_2")
    private String priority2;

    @Column(name = "priority_3")
    private String priority3;

    @Column(name = "priority_4")
    private String priority4;

    @Column(name = "priority_5")
    private String priority5;

    // === Selection Body ===
    @Enumerated(EnumType.STRING)
    @Column(name = "selection_body")
    private SelectionBody selectionBody;

    // === Committee Members ===
    @Column(name = "committee_association")
    private Boolean committeeAssociation;

    @Column(name = "committee_national_entraide")
    private Boolean committeeNationalEntraide;

    @Column(name = "committee_national_education")
    private Boolean committeeNationalEducation;

    @Column(name = "committee_commune")
    private Boolean committeeCommune;

    @Column(name = "committee_local_authorities")
    private Boolean committeeLocalAuthorities;

    @Column(name = "committee_other_member")
    private Boolean otherMember;

    @Column(name = "committee_other_member_detail")
    private String otherMemberDetail;

    // === Additional Info ===
    @Column(name = "unsatisfied_requests_count")
    private Integer unsatisfiedRequestsCount;

    @Column(name = "services_are_free")
    private Boolean servicesAreFree;

    @Enumerated(EnumType.STRING)
    @Column(name = "tariff_type")
    private TariffType tariffType;

    @Column(name = "uniform_amount", precision = 10, scale = 2)
    private BigDecimal uniformAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "tariff_bracket")
    private TariffBracket tariffBracket;
}
