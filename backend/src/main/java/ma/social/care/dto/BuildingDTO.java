package ma.social.care.dto;

import lombok.*;
import ma.social.care.entity.enums.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuildingDTO {

    private BuildingStatus buildingStatus;
    private BuildingCondition buildingCondition;
    private RenovationCapacity renovationCapacity;
    private OwnerType ownerType;
    private Boolean hasPartnershipAgreement;
}
