package ma.social.care.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import ma.social.care.entity.enums.*;

@Entity
@Table(name = "buildings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Building extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institution_id", nullable = false, unique = true)
    private Institution institution;

    @Enumerated(EnumType.STRING)
    @Column(name = "building_status")
    private BuildingStatus buildingStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "building_condition")
    private BuildingCondition buildingCondition;

    @Enumerated(EnumType.STRING)
    @Column(name = "renovation_capacity")
    private RenovationCapacity renovationCapacity;

    @Enumerated(EnumType.STRING)
    @Column(name = "owner_type")
    private OwnerType ownerType;

    @Column(name = "has_partnership_agreement")
    private Boolean hasPartnershipAgreement;
}
