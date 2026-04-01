package ma.social.care.mapper;

import ma.social.care.dto.*;
import ma.social.care.entity.*;
import ma.social.care.entity.embeddable.SeasonBeneficiaries;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface InstitutionMapper {

    // === Institution Mappings ===
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "signedPdfUrl", ignore = true)
    @Mapping(target = "building", ignore = true)
    @Mapping(target = "financing", ignore = true)
    @Mapping(target = "targeting", ignore = true)
    @Mapping(target = "housingMeals", ignore = true)
    @Mapping(target = "staffMembers", ignore = true)
    @Mapping(target = "region", ignore = true)
    @Mapping(target = "prefecture", ignore = true)
    @Mapping(target = "commune", ignore = true)
    Institution toEntity(InstitutionRequestDTO dto);

    @Mapping(target = "building", source = "building")
    @Mapping(target = "financing", source = "financing")
    @Mapping(target = "targeting", source = "targeting")
    @Mapping(target = "housingMeals", source = "housingMeals")
    @Mapping(target = "staffMembers", source = "staffMembers")
    @Mapping(target = "regionId", source = "region.id")
    @Mapping(target = "regionName", source = "region.name")
    @Mapping(target = "prefectureId", source = "prefecture.id")
    @Mapping(target = "prefectureName", source = "prefecture.name")
    @Mapping(target = "communeId", source = "commune.id")
    @Mapping(target = "communeName", source = "commune.name")
    InstitutionResponseDTO toResponseDTO(Institution entity);

    @Mapping(target = "regionId", source = "region.id")
    @Mapping(target = "regionName", source = "region.name")
    @Mapping(target = "communeId", source = "commune.id")
    @Mapping(target = "communeName", source = "commune.name")
    InstitutionSummaryDTO toSummaryDTO(Institution entity);

    List<InstitutionSummaryDTO> toSummaryDTOList(List<Institution> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "signedPdfUrl", ignore = true)
    @Mapping(target = "building", ignore = true)
    @Mapping(target = "financing", ignore = true)
    @Mapping(target = "targeting", ignore = true)
    @Mapping(target = "housingMeals", ignore = true)
    @Mapping(target = "staffMembers", ignore = true)
    @Mapping(target = "region", ignore = true)
    @Mapping(target = "prefecture", ignore = true)
    @Mapping(target = "commune", ignore = true)
    void updateEntityFromDTO(InstitutionRequestDTO dto, @MappingTarget Institution entity);

    // === Building Mappings ===
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "institution", ignore = true)
    Building toBuildingEntity(BuildingDTO dto);

    BuildingDTO toBuildingDTO(Building entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "institution", ignore = true)
    void updateBuildingFromDTO(BuildingDTO dto, @MappingTarget Building entity);

    // === Financing Mappings ===
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "institution", ignore = true)
    Financing toFinancingEntity(FinancingDTO dto);

    FinancingDTO toFinancingDTO(Financing entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "institution", ignore = true)
    void updateFinancingFromDTO(FinancingDTO dto, @MappingTarget Financing entity);

    // === Targeting Mappings ===
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "institution", ignore = true)
    Targeting toTargetingEntity(TargetingDTO dto);

    TargetingDTO toTargetingDTO(Targeting entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "institution", ignore = true)
    void updateTargetingFromDTO(TargetingDTO dto, @MappingTarget Targeting entity);

    // === HousingMeals Mappings ===
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "institution", ignore = true)
    HousingMeals toHousingMealsEntity(HousingMealsDTO dto);

    HousingMealsDTO toHousingMealsDTO(HousingMeals entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "institution", ignore = true)
    void updateHousingMealsFromDTO(HousingMealsDTO dto, @MappingTarget HousingMeals entity);

    // === SeasonBeneficiaries Mappings ===
    SeasonBeneficiaries toSeasonBeneficiariesEntity(SeasonBeneficiariesDTO dto);

    SeasonBeneficiariesDTO toSeasonBeneficiariesDTO(SeasonBeneficiaries entity);

    // === StaffMember Mappings ===
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "institution", ignore = true)
    StaffMember toStaffMemberEntity(StaffMemberDTO dto);

    StaffMemberDTO toStaffMemberDTO(StaffMember entity);

    List<StaffMemberDTO> toStaffMemberDTOList(List<StaffMember> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "institution", ignore = true)
    void updateStaffMemberFromDTO(StaffMemberDTO dto, @MappingTarget StaffMember entity);
}
