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
    private String buildingStatusOther;
    private BuildingCondition buildingCondition;
    private String buildingConditionOther;
    private RenovationCapacity renovationCapacity;
    private OwnerType ownerType;
    private String ownerTypeOther;
    private Boolean hasPartnershipAgreement;
}
