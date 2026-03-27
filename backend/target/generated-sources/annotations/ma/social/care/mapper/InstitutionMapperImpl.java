package ma.social.care.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import ma.social.care.dto.BuildingDTO;
import ma.social.care.dto.FinancingDTO;
import ma.social.care.dto.HousingMealsDTO;
import ma.social.care.dto.InstitutionRequestDTO;
import ma.social.care.dto.InstitutionResponseDTO;
import ma.social.care.dto.InstitutionSummaryDTO;
import ma.social.care.dto.SeasonBeneficiariesDTO;
import ma.social.care.dto.StaffMemberDTO;
import ma.social.care.dto.TargetingDTO;
import ma.social.care.entity.Building;
import ma.social.care.entity.Commune;
import ma.social.care.entity.Financing;
import ma.social.care.entity.HousingMeals;
import ma.social.care.entity.Institution;
import ma.social.care.entity.Prefecture;
import ma.social.care.entity.Region;
import ma.social.care.entity.StaffMember;
import ma.social.care.entity.Targeting;
import ma.social.care.entity.embeddable.SeasonBeneficiaries;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-27T11:28:31+0100",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.8 (Oracle Corporation)"
)
@Component
public class InstitutionMapperImpl implements InstitutionMapper {

    @Override
    public Institution toEntity(InstitutionRequestDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Institution.InstitutionBuilder<?, ?> institution = Institution.builder();

        institution.institutionType( dto.getInstitutionType() );
        institution.associationName( dto.getAssociationName() );
        institution.institutionName( dto.getInstitutionName() );
        institution.address( dto.getAddress() );
        institution.milieu( dto.getMilieu() );
        institution.creationYear( dto.getCreationYear() );
        institution.legalStatus( dto.getLegalStatus() );
        institution.unlicensedReason( dto.getUnlicensedReason() );
        institution.licenseNumber( dto.getLicenseNumber() );
        institution.serviceStartDate( dto.getServiceStartDate() );
        institution.housing( dto.getHousing() );
        institution.meals( dto.getMeals() );
        institution.educationalSupport( dto.getEducationalSupport() );
        institution.culturalActivities( dto.getCulturalActivities() );
        institution.healthCare( dto.getHealthCare() );
        institution.insurance( dto.getInsurance() );
        institution.psychologicalSupport( dto.getPsychologicalSupport() );
        institution.totalCapacity( dto.getTotalCapacity() );
        institution.maleCapacity( dto.getMaleCapacity() );
        institution.femaleCapacity( dto.getFemaleCapacity() );
        institution.primary( dto.getPrimary() );
        institution.middleSchool( dto.getMiddleSchool() );
        institution.highSchool( dto.getHighSchool() );
        institution.other( dto.getOther() );
        institution.otherDetail( dto.getOtherDetail() );
        institution.distanceToSchool( dto.getDistanceToSchool() );
        institution.distanceToNationalBoardingSchool( dto.getDistanceToNationalBoardingSchool() );

        return institution.build();
    }

    @Override
    public InstitutionResponseDTO toResponseDTO(Institution entity) {
        if ( entity == null ) {
            return null;
        }

        InstitutionResponseDTO.InstitutionResponseDTOBuilder institutionResponseDTO = InstitutionResponseDTO.builder();

        institutionResponseDTO.building( toBuildingDTO( entity.getBuilding() ) );
        institutionResponseDTO.financing( toFinancingDTO( entity.getFinancing() ) );
        institutionResponseDTO.targeting( toTargetingDTO( entity.getTargeting() ) );
        institutionResponseDTO.housingMeals( toHousingMealsDTO( entity.getHousingMeals() ) );
        institutionResponseDTO.staffMembers( toStaffMemberDTOList( entity.getStaffMembers() ) );
        institutionResponseDTO.regionId( entityRegionId( entity ) );
        institutionResponseDTO.regionName( entityRegionName( entity ) );
        institutionResponseDTO.prefectureId( entityPrefectureId( entity ) );
        institutionResponseDTO.prefectureName( entityPrefectureName( entity ) );
        institutionResponseDTO.communeId( entityCommuneId( entity ) );
        institutionResponseDTO.communeName( entityCommuneName( entity ) );
        institutionResponseDTO.id( entity.getId() );
        institutionResponseDTO.institutionType( entity.getInstitutionType() );
        institutionResponseDTO.associationName( entity.getAssociationName() );
        institutionResponseDTO.institutionName( entity.getInstitutionName() );
        institutionResponseDTO.address( entity.getAddress() );
        institutionResponseDTO.milieu( entity.getMilieu() );
        institutionResponseDTO.creationYear( entity.getCreationYear() );
        institutionResponseDTO.legalStatus( entity.getLegalStatus() );
        institutionResponseDTO.unlicensedReason( entity.getUnlicensedReason() );
        institutionResponseDTO.licenseNumber( entity.getLicenseNumber() );
        institutionResponseDTO.serviceStartDate( entity.getServiceStartDate() );
        institutionResponseDTO.housing( entity.getHousing() );
        institutionResponseDTO.meals( entity.getMeals() );
        institutionResponseDTO.educationalSupport( entity.getEducationalSupport() );
        institutionResponseDTO.culturalActivities( entity.getCulturalActivities() );
        institutionResponseDTO.healthCare( entity.getHealthCare() );
        institutionResponseDTO.insurance( entity.getInsurance() );
        institutionResponseDTO.psychologicalSupport( entity.getPsychologicalSupport() );
        institutionResponseDTO.totalCapacity( entity.getTotalCapacity() );
        institutionResponseDTO.maleCapacity( entity.getMaleCapacity() );
        institutionResponseDTO.femaleCapacity( entity.getFemaleCapacity() );
        institutionResponseDTO.primary( entity.getPrimary() );
        institutionResponseDTO.middleSchool( entity.getMiddleSchool() );
        institutionResponseDTO.highSchool( entity.getHighSchool() );
        institutionResponseDTO.other( entity.getOther() );
        institutionResponseDTO.otherDetail( entity.getOtherDetail() );
        institutionResponseDTO.distanceToSchool( entity.getDistanceToSchool() );
        institutionResponseDTO.distanceToNationalBoardingSchool( entity.getDistanceToNationalBoardingSchool() );
        institutionResponseDTO.createdAt( entity.getCreatedAt() );
        institutionResponseDTO.updatedAt( entity.getUpdatedAt() );

        return institutionResponseDTO.build();
    }

    @Override
    public InstitutionSummaryDTO toSummaryDTO(Institution entity) {
        if ( entity == null ) {
            return null;
        }

        InstitutionSummaryDTO.InstitutionSummaryDTOBuilder institutionSummaryDTO = InstitutionSummaryDTO.builder();

        institutionSummaryDTO.regionId( entityRegionId( entity ) );
        institutionSummaryDTO.regionName( entityRegionName( entity ) );
        institutionSummaryDTO.communeId( entityCommuneId( entity ) );
        institutionSummaryDTO.communeName( entityCommuneName( entity ) );
        institutionSummaryDTO.id( entity.getId() );
        institutionSummaryDTO.institutionType( entity.getInstitutionType() );
        institutionSummaryDTO.associationName( entity.getAssociationName() );
        institutionSummaryDTO.institutionName( entity.getInstitutionName() );
        institutionSummaryDTO.milieu( entity.getMilieu() );
        institutionSummaryDTO.legalStatus( entity.getLegalStatus() );
        institutionSummaryDTO.totalCapacity( entity.getTotalCapacity() );
        institutionSummaryDTO.createdAt( entity.getCreatedAt() );
        institutionSummaryDTO.updatedAt( entity.getUpdatedAt() );

        return institutionSummaryDTO.build();
    }

    @Override
    public List<InstitutionSummaryDTO> toSummaryDTOList(List<Institution> entities) {
        if ( entities == null ) {
            return null;
        }

        List<InstitutionSummaryDTO> list = new ArrayList<InstitutionSummaryDTO>( entities.size() );
        for ( Institution institution : entities ) {
            list.add( toSummaryDTO( institution ) );
        }

        return list;
    }

    @Override
    public void updateEntityFromDTO(InstitutionRequestDTO dto, Institution entity) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getInstitutionType() != null ) {
            entity.setInstitutionType( dto.getInstitutionType() );
        }
        if ( dto.getAssociationName() != null ) {
            entity.setAssociationName( dto.getAssociationName() );
        }
        if ( dto.getInstitutionName() != null ) {
            entity.setInstitutionName( dto.getInstitutionName() );
        }
        if ( dto.getAddress() != null ) {
            entity.setAddress( dto.getAddress() );
        }
        if ( dto.getMilieu() != null ) {
            entity.setMilieu( dto.getMilieu() );
        }
        if ( dto.getCreationYear() != null ) {
            entity.setCreationYear( dto.getCreationYear() );
        }
        if ( dto.getLegalStatus() != null ) {
            entity.setLegalStatus( dto.getLegalStatus() );
        }
        if ( dto.getUnlicensedReason() != null ) {
            entity.setUnlicensedReason( dto.getUnlicensedReason() );
        }
        if ( dto.getLicenseNumber() != null ) {
            entity.setLicenseNumber( dto.getLicenseNumber() );
        }
        if ( dto.getServiceStartDate() != null ) {
            entity.setServiceStartDate( dto.getServiceStartDate() );
        }
        if ( dto.getHousing() != null ) {
            entity.setHousing( dto.getHousing() );
        }
        if ( dto.getMeals() != null ) {
            entity.setMeals( dto.getMeals() );
        }
        if ( dto.getEducationalSupport() != null ) {
            entity.setEducationalSupport( dto.getEducationalSupport() );
        }
        if ( dto.getCulturalActivities() != null ) {
            entity.setCulturalActivities( dto.getCulturalActivities() );
        }
        if ( dto.getHealthCare() != null ) {
            entity.setHealthCare( dto.getHealthCare() );
        }
        if ( dto.getInsurance() != null ) {
            entity.setInsurance( dto.getInsurance() );
        }
        if ( dto.getPsychologicalSupport() != null ) {
            entity.setPsychologicalSupport( dto.getPsychologicalSupport() );
        }
        if ( dto.getTotalCapacity() != null ) {
            entity.setTotalCapacity( dto.getTotalCapacity() );
        }
        if ( dto.getMaleCapacity() != null ) {
            entity.setMaleCapacity( dto.getMaleCapacity() );
        }
        if ( dto.getFemaleCapacity() != null ) {
            entity.setFemaleCapacity( dto.getFemaleCapacity() );
        }
        if ( dto.getPrimary() != null ) {
            entity.setPrimary( dto.getPrimary() );
        }
        if ( dto.getMiddleSchool() != null ) {
            entity.setMiddleSchool( dto.getMiddleSchool() );
        }
        if ( dto.getHighSchool() != null ) {
            entity.setHighSchool( dto.getHighSchool() );
        }
        if ( dto.getOther() != null ) {
            entity.setOther( dto.getOther() );
        }
        if ( dto.getOtherDetail() != null ) {
            entity.setOtherDetail( dto.getOtherDetail() );
        }
        if ( dto.getDistanceToSchool() != null ) {
            entity.setDistanceToSchool( dto.getDistanceToSchool() );
        }
        if ( dto.getDistanceToNationalBoardingSchool() != null ) {
            entity.setDistanceToNationalBoardingSchool( dto.getDistanceToNationalBoardingSchool() );
        }
    }

    @Override
    public Building toBuildingEntity(BuildingDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Building.BuildingBuilder<?, ?> building = Building.builder();

        building.buildingStatus( dto.getBuildingStatus() );
        building.buildingCondition( dto.getBuildingCondition() );
        building.renovationCapacity( dto.getRenovationCapacity() );
        building.ownerType( dto.getOwnerType() );
        building.hasPartnershipAgreement( dto.getHasPartnershipAgreement() );

        return building.build();
    }

    @Override
    public BuildingDTO toBuildingDTO(Building entity) {
        if ( entity == null ) {
            return null;
        }

        BuildingDTO.BuildingDTOBuilder buildingDTO = BuildingDTO.builder();

        buildingDTO.buildingStatus( entity.getBuildingStatus() );
        buildingDTO.buildingCondition( entity.getBuildingCondition() );
        buildingDTO.renovationCapacity( entity.getRenovationCapacity() );
        buildingDTO.ownerType( entity.getOwnerType() );
        buildingDTO.hasPartnershipAgreement( entity.getHasPartnershipAgreement() );

        return buildingDTO.build();
    }

    @Override
    public void updateBuildingFromDTO(BuildingDTO dto, Building entity) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getBuildingStatus() != null ) {
            entity.setBuildingStatus( dto.getBuildingStatus() );
        }
        if ( dto.getBuildingCondition() != null ) {
            entity.setBuildingCondition( dto.getBuildingCondition() );
        }
        if ( dto.getRenovationCapacity() != null ) {
            entity.setRenovationCapacity( dto.getRenovationCapacity() );
        }
        if ( dto.getOwnerType() != null ) {
            entity.setOwnerType( dto.getOwnerType() );
        }
        if ( dto.getHasPartnershipAgreement() != null ) {
            entity.setHasPartnershipAgreement( dto.getHasPartnershipAgreement() );
        }
    }

    @Override
    public Financing toFinancingEntity(FinancingDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Financing.FinancingBuilder<?, ?> financing = Financing.builder();

        financing.solidarityMinistry( dto.getSolidarityMinistry() );
        financing.nationalEntraide( dto.getNationalEntraide() );
        financing.indh( dto.getIndh() );
        financing.commune( dto.getCommune() );
        financing.fondationMohammed5( dto.getFondationMohammed5() );
        financing.nationalRevival( dto.getNationalRevival() );
        financing.association( dto.getAssociation() );
        financing.otherConstruction( dto.getOtherConstruction() );
        financing.otherConstructionDetail( dto.getOtherConstructionDetail() );
        financing.equipmentSolidarityMinistry( dto.getEquipmentSolidarityMinistry() );
        financing.equipmentNationalEntraide( dto.getEquipmentNationalEntraide() );
        financing.equipmentIndh( dto.getEquipmentIndh() );
        financing.equipmentCommune( dto.getEquipmentCommune() );
        financing.equipmentFondationMohammed5( dto.getEquipmentFondationMohammed5() );
        financing.equipmentAssociation( dto.getEquipmentAssociation() );
        financing.equipmentOther( dto.getEquipmentOther() );
        financing.equipmentOtherDetail( dto.getEquipmentOtherDetail() );
        financing.totalConstructionCost( dto.getTotalConstructionCost() );
        financing.annualManagementCost( dto.getAnnualManagementCost() );
        financing.operatingIndh( dto.getOperatingIndh() );
        financing.operatingNationalEntraide( dto.getOperatingNationalEntraide() );
        financing.operatingNationalEducation( dto.getOperatingNationalEducation() );
        financing.operatingCommune( dto.getOperatingCommune() );
        financing.operatingParentContributions( dto.getOperatingParentContributions() );
        financing.operatingDonors( dto.getOperatingDonors() );
        financing.operatingAssociationOwnSources( dto.getOperatingAssociationOwnSources() );
        financing.operatingOther( dto.getOperatingOther() );
        financing.annualHRCost( dto.getAnnualHRCost() );
        financing.annualMealsCost( dto.getAnnualMealsCost() );
        financing.totalMealsAmount( dto.getTotalMealsAmount() );
        financing.associationShare( dto.getAssociationShare() );
        financing.educationShare( dto.getEducationShare() );
        financing.otherShare( dto.getOtherShare() );
        financing.annualOtherExpenses( dto.getAnnualOtherExpenses() );
        financing.individualAnnualCost( dto.getIndividualAnnualCost() );

        return financing.build();
    }

    @Override
    public FinancingDTO toFinancingDTO(Financing entity) {
        if ( entity == null ) {
            return null;
        }

        FinancingDTO.FinancingDTOBuilder financingDTO = FinancingDTO.builder();

        financingDTO.solidarityMinistry( entity.getSolidarityMinistry() );
        financingDTO.nationalEntraide( entity.getNationalEntraide() );
        financingDTO.indh( entity.getIndh() );
        financingDTO.commune( entity.getCommune() );
        financingDTO.fondationMohammed5( entity.getFondationMohammed5() );
        financingDTO.nationalRevival( entity.getNationalRevival() );
        financingDTO.association( entity.getAssociation() );
        financingDTO.otherConstruction( entity.getOtherConstruction() );
        financingDTO.otherConstructionDetail( entity.getOtherConstructionDetail() );
        financingDTO.equipmentSolidarityMinistry( entity.getEquipmentSolidarityMinistry() );
        financingDTO.equipmentNationalEntraide( entity.getEquipmentNationalEntraide() );
        financingDTO.equipmentIndh( entity.getEquipmentIndh() );
        financingDTO.equipmentCommune( entity.getEquipmentCommune() );
        financingDTO.equipmentFondationMohammed5( entity.getEquipmentFondationMohammed5() );
        financingDTO.equipmentAssociation( entity.getEquipmentAssociation() );
        financingDTO.equipmentOther( entity.getEquipmentOther() );
        financingDTO.equipmentOtherDetail( entity.getEquipmentOtherDetail() );
        financingDTO.totalConstructionCost( entity.getTotalConstructionCost() );
        financingDTO.annualManagementCost( entity.getAnnualManagementCost() );
        financingDTO.operatingIndh( entity.getOperatingIndh() );
        financingDTO.operatingNationalEntraide( entity.getOperatingNationalEntraide() );
        financingDTO.operatingNationalEducation( entity.getOperatingNationalEducation() );
        financingDTO.operatingCommune( entity.getOperatingCommune() );
        financingDTO.operatingParentContributions( entity.getOperatingParentContributions() );
        financingDTO.operatingDonors( entity.getOperatingDonors() );
        financingDTO.operatingAssociationOwnSources( entity.getOperatingAssociationOwnSources() );
        financingDTO.operatingOther( entity.getOperatingOther() );
        financingDTO.annualHRCost( entity.getAnnualHRCost() );
        financingDTO.annualMealsCost( entity.getAnnualMealsCost() );
        financingDTO.totalMealsAmount( entity.getTotalMealsAmount() );
        financingDTO.associationShare( entity.getAssociationShare() );
        financingDTO.educationShare( entity.getEducationShare() );
        financingDTO.otherShare( entity.getOtherShare() );
        financingDTO.annualOtherExpenses( entity.getAnnualOtherExpenses() );
        financingDTO.individualAnnualCost( entity.getIndividualAnnualCost() );

        return financingDTO.build();
    }

    @Override
    public void updateFinancingFromDTO(FinancingDTO dto, Financing entity) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getSolidarityMinistry() != null ) {
            entity.setSolidarityMinistry( dto.getSolidarityMinistry() );
        }
        if ( dto.getNationalEntraide() != null ) {
            entity.setNationalEntraide( dto.getNationalEntraide() );
        }
        if ( dto.getIndh() != null ) {
            entity.setIndh( dto.getIndh() );
        }
        if ( dto.getCommune() != null ) {
            entity.setCommune( dto.getCommune() );
        }
        if ( dto.getFondationMohammed5() != null ) {
            entity.setFondationMohammed5( dto.getFondationMohammed5() );
        }
        if ( dto.getNationalRevival() != null ) {
            entity.setNationalRevival( dto.getNationalRevival() );
        }
        if ( dto.getAssociation() != null ) {
            entity.setAssociation( dto.getAssociation() );
        }
        if ( dto.getOtherConstruction() != null ) {
            entity.setOtherConstruction( dto.getOtherConstruction() );
        }
        if ( dto.getOtherConstructionDetail() != null ) {
            entity.setOtherConstructionDetail( dto.getOtherConstructionDetail() );
        }
        if ( dto.getEquipmentSolidarityMinistry() != null ) {
            entity.setEquipmentSolidarityMinistry( dto.getEquipmentSolidarityMinistry() );
        }
        if ( dto.getEquipmentNationalEntraide() != null ) {
            entity.setEquipmentNationalEntraide( dto.getEquipmentNationalEntraide() );
        }
        if ( dto.getEquipmentIndh() != null ) {
            entity.setEquipmentIndh( dto.getEquipmentIndh() );
        }
        if ( dto.getEquipmentCommune() != null ) {
            entity.setEquipmentCommune( dto.getEquipmentCommune() );
        }
        if ( dto.getEquipmentFondationMohammed5() != null ) {
            entity.setEquipmentFondationMohammed5( dto.getEquipmentFondationMohammed5() );
        }
        if ( dto.getEquipmentAssociation() != null ) {
            entity.setEquipmentAssociation( dto.getEquipmentAssociation() );
        }
        if ( dto.getEquipmentOther() != null ) {
            entity.setEquipmentOther( dto.getEquipmentOther() );
        }
        if ( dto.getEquipmentOtherDetail() != null ) {
            entity.setEquipmentOtherDetail( dto.getEquipmentOtherDetail() );
        }
        if ( dto.getTotalConstructionCost() != null ) {
            entity.setTotalConstructionCost( dto.getTotalConstructionCost() );
        }
        if ( dto.getAnnualManagementCost() != null ) {
            entity.setAnnualManagementCost( dto.getAnnualManagementCost() );
        }
        if ( dto.getOperatingIndh() != null ) {
            entity.setOperatingIndh( dto.getOperatingIndh() );
        }
        if ( dto.getOperatingNationalEntraide() != null ) {
            entity.setOperatingNationalEntraide( dto.getOperatingNationalEntraide() );
        }
        if ( dto.getOperatingNationalEducation() != null ) {
            entity.setOperatingNationalEducation( dto.getOperatingNationalEducation() );
        }
        if ( dto.getOperatingCommune() != null ) {
            entity.setOperatingCommune( dto.getOperatingCommune() );
        }
        if ( dto.getOperatingParentContributions() != null ) {
            entity.setOperatingParentContributions( dto.getOperatingParentContributions() );
        }
        if ( dto.getOperatingDonors() != null ) {
            entity.setOperatingDonors( dto.getOperatingDonors() );
        }
        if ( dto.getOperatingAssociationOwnSources() != null ) {
            entity.setOperatingAssociationOwnSources( dto.getOperatingAssociationOwnSources() );
        }
        if ( dto.getOperatingOther() != null ) {
            entity.setOperatingOther( dto.getOperatingOther() );
        }
        if ( dto.getAnnualHRCost() != null ) {
            entity.setAnnualHRCost( dto.getAnnualHRCost() );
        }
        if ( dto.getAnnualMealsCost() != null ) {
            entity.setAnnualMealsCost( dto.getAnnualMealsCost() );
        }
        if ( dto.getTotalMealsAmount() != null ) {
            entity.setTotalMealsAmount( dto.getTotalMealsAmount() );
        }
        if ( dto.getAssociationShare() != null ) {
            entity.setAssociationShare( dto.getAssociationShare() );
        }
        if ( dto.getEducationShare() != null ) {
            entity.setEducationShare( dto.getEducationShare() );
        }
        if ( dto.getOtherShare() != null ) {
            entity.setOtherShare( dto.getOtherShare() );
        }
        if ( dto.getAnnualOtherExpenses() != null ) {
            entity.setAnnualOtherExpenses( dto.getAnnualOtherExpenses() );
        }
        if ( dto.getIndividualAnnualCost() != null ) {
            entity.setIndividualAnnualCost( dto.getIndividualAnnualCost() );
        }
    }

    @Override
    public Targeting toTargetingEntity(TargetingDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Targeting.TargetingBuilder<?, ?> targeting = Targeting.builder();

        targeting.socialSituation( dto.getSocialSituation() );
        targeting.distance( dto.getDistance() );
        targeting.schoolResults( dto.getSchoolResults() );
        targeting.scholarship( dto.getScholarship() );
        targeting.otherCriteria( dto.getOtherCriteria() );
        targeting.otherCriteriaDetail( dto.getOtherCriteriaDetail() );
        targeting.priority1( dto.getPriority1() );
        targeting.priority2( dto.getPriority2() );
        targeting.priority3( dto.getPriority3() );
        targeting.priority4( dto.getPriority4() );
        targeting.priority5( dto.getPriority5() );
        targeting.selectionBody( dto.getSelectionBody() );
        targeting.committeeAssociation( dto.getCommitteeAssociation() );
        targeting.committeeNationalEntraide( dto.getCommitteeNationalEntraide() );
        targeting.committeeNationalEducation( dto.getCommitteeNationalEducation() );
        targeting.committeeCommune( dto.getCommitteeCommune() );
        targeting.committeeLocalAuthorities( dto.getCommitteeLocalAuthorities() );
        targeting.otherMember( dto.getOtherMember() );
        targeting.otherMemberDetail( dto.getOtherMemberDetail() );
        targeting.unsatisfiedRequestsCount( dto.getUnsatisfiedRequestsCount() );
        targeting.servicesAreFree( dto.getServicesAreFree() );
        targeting.tariffType( dto.getTariffType() );
        targeting.uniformAmount( dto.getUniformAmount() );
        targeting.tariffBracket( dto.getTariffBracket() );

        return targeting.build();
    }

    @Override
    public TargetingDTO toTargetingDTO(Targeting entity) {
        if ( entity == null ) {
            return null;
        }

        TargetingDTO.TargetingDTOBuilder targetingDTO = TargetingDTO.builder();

        targetingDTO.socialSituation( entity.getSocialSituation() );
        targetingDTO.distance( entity.getDistance() );
        targetingDTO.schoolResults( entity.getSchoolResults() );
        targetingDTO.scholarship( entity.getScholarship() );
        targetingDTO.otherCriteria( entity.getOtherCriteria() );
        targetingDTO.otherCriteriaDetail( entity.getOtherCriteriaDetail() );
        targetingDTO.priority1( entity.getPriority1() );
        targetingDTO.priority2( entity.getPriority2() );
        targetingDTO.priority3( entity.getPriority3() );
        targetingDTO.priority4( entity.getPriority4() );
        targetingDTO.priority5( entity.getPriority5() );
        targetingDTO.selectionBody( entity.getSelectionBody() );
        targetingDTO.committeeAssociation( entity.getCommitteeAssociation() );
        targetingDTO.committeeNationalEntraide( entity.getCommitteeNationalEntraide() );
        targetingDTO.committeeNationalEducation( entity.getCommitteeNationalEducation() );
        targetingDTO.committeeCommune( entity.getCommitteeCommune() );
        targetingDTO.committeeLocalAuthorities( entity.getCommitteeLocalAuthorities() );
        targetingDTO.otherMember( entity.getOtherMember() );
        targetingDTO.otherMemberDetail( entity.getOtherMemberDetail() );
        targetingDTO.unsatisfiedRequestsCount( entity.getUnsatisfiedRequestsCount() );
        targetingDTO.servicesAreFree( entity.getServicesAreFree() );
        targetingDTO.tariffType( entity.getTariffType() );
        targetingDTO.uniformAmount( entity.getUniformAmount() );
        targetingDTO.tariffBracket( entity.getTariffBracket() );

        return targetingDTO.build();
    }

    @Override
    public void updateTargetingFromDTO(TargetingDTO dto, Targeting entity) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getSocialSituation() != null ) {
            entity.setSocialSituation( dto.getSocialSituation() );
        }
        if ( dto.getDistance() != null ) {
            entity.setDistance( dto.getDistance() );
        }
        if ( dto.getSchoolResults() != null ) {
            entity.setSchoolResults( dto.getSchoolResults() );
        }
        if ( dto.getScholarship() != null ) {
            entity.setScholarship( dto.getScholarship() );
        }
        if ( dto.getOtherCriteria() != null ) {
            entity.setOtherCriteria( dto.getOtherCriteria() );
        }
        if ( dto.getOtherCriteriaDetail() != null ) {
            entity.setOtherCriteriaDetail( dto.getOtherCriteriaDetail() );
        }
        if ( dto.getPriority1() != null ) {
            entity.setPriority1( dto.getPriority1() );
        }
        if ( dto.getPriority2() != null ) {
            entity.setPriority2( dto.getPriority2() );
        }
        if ( dto.getPriority3() != null ) {
            entity.setPriority3( dto.getPriority3() );
        }
        if ( dto.getPriority4() != null ) {
            entity.setPriority4( dto.getPriority4() );
        }
        if ( dto.getPriority5() != null ) {
            entity.setPriority5( dto.getPriority5() );
        }
        if ( dto.getSelectionBody() != null ) {
            entity.setSelectionBody( dto.getSelectionBody() );
        }
        if ( dto.getCommitteeAssociation() != null ) {
            entity.setCommitteeAssociation( dto.getCommitteeAssociation() );
        }
        if ( dto.getCommitteeNationalEntraide() != null ) {
            entity.setCommitteeNationalEntraide( dto.getCommitteeNationalEntraide() );
        }
        if ( dto.getCommitteeNationalEducation() != null ) {
            entity.setCommitteeNationalEducation( dto.getCommitteeNationalEducation() );
        }
        if ( dto.getCommitteeCommune() != null ) {
            entity.setCommitteeCommune( dto.getCommitteeCommune() );
        }
        if ( dto.getCommitteeLocalAuthorities() != null ) {
            entity.setCommitteeLocalAuthorities( dto.getCommitteeLocalAuthorities() );
        }
        if ( dto.getOtherMember() != null ) {
            entity.setOtherMember( dto.getOtherMember() );
        }
        if ( dto.getOtherMemberDetail() != null ) {
            entity.setOtherMemberDetail( dto.getOtherMemberDetail() );
        }
        if ( dto.getUnsatisfiedRequestsCount() != null ) {
            entity.setUnsatisfiedRequestsCount( dto.getUnsatisfiedRequestsCount() );
        }
        if ( dto.getServicesAreFree() != null ) {
            entity.setServicesAreFree( dto.getServicesAreFree() );
        }
        if ( dto.getTariffType() != null ) {
            entity.setTariffType( dto.getTariffType() );
        }
        if ( dto.getUniformAmount() != null ) {
            entity.setUniformAmount( dto.getUniformAmount() );
        }
        if ( dto.getTariffBracket() != null ) {
            entity.setTariffBracket( dto.getTariffBracket() );
        }
    }

    @Override
    public HousingMeals toHousingMealsEntity(HousingMealsDTO dto) {
        if ( dto == null ) {
            return null;
        }

        HousingMeals.HousingMealsBuilder<?, ?> housingMeals = HousingMeals.builder();

        housingMeals.season2324( toSeasonBeneficiariesEntity( dto.getSeason2324() ) );
        housingMeals.season2425( toSeasonBeneficiariesEntity( dto.getSeason2425() ) );
        housingMeals.season2526( toSeasonBeneficiariesEntity( dto.getSeason2526() ) );
        housingMeals.capacityRemarks( dto.getCapacityRemarks() );
        housingMeals.totalMealBeneficiaries2526( dto.getTotalMealBeneficiaries2526() );
        housingMeals.associationMealBeneficiaries( dto.getAssociationMealBeneficiaries() );
        housingMeals.educationMealBeneficiaries( dto.getEducationMealBeneficiaries() );
        housingMeals.fullGrantCount( dto.getFullGrantCount() );
        housingMeals.halfGrantCount( dto.getHalfGrantCount() );
        housingMeals.mealServiceType( dto.getMealServiceType() );
        housingMeals.increaseProducts( dto.getIncreaseProducts() );
        housingMeals.externalCaterer( dto.getExternalCaterer() );
        housingMeals.otherSuggestion( dto.getOtherSuggestion() );
        housingMeals.otherSuggestionDetail( dto.getOtherSuggestionDetail() );

        return housingMeals.build();
    }

    @Override
    public HousingMealsDTO toHousingMealsDTO(HousingMeals entity) {
        if ( entity == null ) {
            return null;
        }

        HousingMealsDTO.HousingMealsDTOBuilder housingMealsDTO = HousingMealsDTO.builder();

        housingMealsDTO.season2324( toSeasonBeneficiariesDTO( entity.getSeason2324() ) );
        housingMealsDTO.season2425( toSeasonBeneficiariesDTO( entity.getSeason2425() ) );
        housingMealsDTO.season2526( toSeasonBeneficiariesDTO( entity.getSeason2526() ) );
        housingMealsDTO.capacityRemarks( entity.getCapacityRemarks() );
        housingMealsDTO.totalMealBeneficiaries2526( entity.getTotalMealBeneficiaries2526() );
        housingMealsDTO.associationMealBeneficiaries( entity.getAssociationMealBeneficiaries() );
        housingMealsDTO.educationMealBeneficiaries( entity.getEducationMealBeneficiaries() );
        housingMealsDTO.fullGrantCount( entity.getFullGrantCount() );
        housingMealsDTO.halfGrantCount( entity.getHalfGrantCount() );
        housingMealsDTO.mealServiceType( entity.getMealServiceType() );
        housingMealsDTO.increaseProducts( entity.getIncreaseProducts() );
        housingMealsDTO.externalCaterer( entity.getExternalCaterer() );
        housingMealsDTO.otherSuggestion( entity.getOtherSuggestion() );
        housingMealsDTO.otherSuggestionDetail( entity.getOtherSuggestionDetail() );

        return housingMealsDTO.build();
    }

    @Override
    public void updateHousingMealsFromDTO(HousingMealsDTO dto, HousingMeals entity) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getSeason2324() != null ) {
            entity.setSeason2324( toSeasonBeneficiariesEntity( dto.getSeason2324() ) );
        }
        if ( dto.getSeason2425() != null ) {
            entity.setSeason2425( toSeasonBeneficiariesEntity( dto.getSeason2425() ) );
        }
        if ( dto.getSeason2526() != null ) {
            entity.setSeason2526( toSeasonBeneficiariesEntity( dto.getSeason2526() ) );
        }
        if ( dto.getCapacityRemarks() != null ) {
            entity.setCapacityRemarks( dto.getCapacityRemarks() );
        }
        if ( dto.getTotalMealBeneficiaries2526() != null ) {
            entity.setTotalMealBeneficiaries2526( dto.getTotalMealBeneficiaries2526() );
        }
        if ( dto.getAssociationMealBeneficiaries() != null ) {
            entity.setAssociationMealBeneficiaries( dto.getAssociationMealBeneficiaries() );
        }
        if ( dto.getEducationMealBeneficiaries() != null ) {
            entity.setEducationMealBeneficiaries( dto.getEducationMealBeneficiaries() );
        }
        if ( dto.getFullGrantCount() != null ) {
            entity.setFullGrantCount( dto.getFullGrantCount() );
        }
        if ( dto.getHalfGrantCount() != null ) {
            entity.setHalfGrantCount( dto.getHalfGrantCount() );
        }
        if ( dto.getMealServiceType() != null ) {
            entity.setMealServiceType( dto.getMealServiceType() );
        }
        if ( dto.getIncreaseProducts() != null ) {
            entity.setIncreaseProducts( dto.getIncreaseProducts() );
        }
        if ( dto.getExternalCaterer() != null ) {
            entity.setExternalCaterer( dto.getExternalCaterer() );
        }
        if ( dto.getOtherSuggestion() != null ) {
            entity.setOtherSuggestion( dto.getOtherSuggestion() );
        }
        if ( dto.getOtherSuggestionDetail() != null ) {
            entity.setOtherSuggestionDetail( dto.getOtherSuggestionDetail() );
        }
    }

    @Override
    public SeasonBeneficiaries toSeasonBeneficiariesEntity(SeasonBeneficiariesDTO dto) {
        if ( dto == null ) {
            return null;
        }

        SeasonBeneficiaries.SeasonBeneficiariesBuilder seasonBeneficiaries = SeasonBeneficiaries.builder();

        seasonBeneficiaries.totalBeneficiaries( dto.getTotalBeneficiaries() );
        seasonBeneficiaries.maleBeneficiaries( dto.getMaleBeneficiaries() );
        seasonBeneficiaries.femaleBeneficiaries( dto.getFemaleBeneficiaries() );
        seasonBeneficiaries.primaryBeneficiaries( dto.getPrimaryBeneficiaries() );
        seasonBeneficiaries.middleSchoolBeneficiaries( dto.getMiddleSchoolBeneficiaries() );
        seasonBeneficiaries.highSchoolBeneficiaries( dto.getHighSchoolBeneficiaries() );
        seasonBeneficiaries.orphans( dto.getOrphans() );
        seasonBeneficiaries.disabled( dto.getDisabled() );

        return seasonBeneficiaries.build();
    }

    @Override
    public SeasonBeneficiariesDTO toSeasonBeneficiariesDTO(SeasonBeneficiaries entity) {
        if ( entity == null ) {
            return null;
        }

        SeasonBeneficiariesDTO.SeasonBeneficiariesDTOBuilder seasonBeneficiariesDTO = SeasonBeneficiariesDTO.builder();

        seasonBeneficiariesDTO.totalBeneficiaries( entity.getTotalBeneficiaries() );
        seasonBeneficiariesDTO.maleBeneficiaries( entity.getMaleBeneficiaries() );
        seasonBeneficiariesDTO.femaleBeneficiaries( entity.getFemaleBeneficiaries() );
        seasonBeneficiariesDTO.primaryBeneficiaries( entity.getPrimaryBeneficiaries() );
        seasonBeneficiariesDTO.middleSchoolBeneficiaries( entity.getMiddleSchoolBeneficiaries() );
        seasonBeneficiariesDTO.highSchoolBeneficiaries( entity.getHighSchoolBeneficiaries() );
        seasonBeneficiariesDTO.orphans( entity.getOrphans() );
        seasonBeneficiariesDTO.disabled( entity.getDisabled() );

        return seasonBeneficiariesDTO.build();
    }

    @Override
    public StaffMember toStaffMemberEntity(StaffMemberDTO dto) {
        if ( dto == null ) {
            return null;
        }

        StaffMember.StaffMemberBuilder<?, ?> staffMember = StaffMember.builder();

        staffMember.staffType( dto.getStaffType() );
        staffMember.nbAssociation( dto.getNbAssociation() );
        staffMember.nbDeployed( dto.getNbDeployed() );
        staffMember.nbVolunteers( dto.getNbVolunteers() );
        staffMember.nbCNSS( dto.getNbCNSS() );
        staffMember.nbSMIG( dto.getNbSMIG() );
        staffMember.monthlyCost( dto.getMonthlyCost() );
        staffMember.annualCost( dto.getAnnualCost() );

        return staffMember.build();
    }

    @Override
    public StaffMemberDTO toStaffMemberDTO(StaffMember entity) {
        if ( entity == null ) {
            return null;
        }

        StaffMemberDTO.StaffMemberDTOBuilder staffMemberDTO = StaffMemberDTO.builder();

        staffMemberDTO.id( entity.getId() );
        staffMemberDTO.staffType( entity.getStaffType() );
        staffMemberDTO.nbAssociation( entity.getNbAssociation() );
        staffMemberDTO.nbDeployed( entity.getNbDeployed() );
        staffMemberDTO.nbVolunteers( entity.getNbVolunteers() );
        staffMemberDTO.nbCNSS( entity.getNbCNSS() );
        staffMemberDTO.nbSMIG( entity.getNbSMIG() );
        staffMemberDTO.monthlyCost( entity.getMonthlyCost() );
        staffMemberDTO.annualCost( entity.getAnnualCost() );

        return staffMemberDTO.build();
    }

    @Override
    public List<StaffMemberDTO> toStaffMemberDTOList(List<StaffMember> entities) {
        if ( entities == null ) {
            return null;
        }

        List<StaffMemberDTO> list = new ArrayList<StaffMemberDTO>( entities.size() );
        for ( StaffMember staffMember : entities ) {
            list.add( toStaffMemberDTO( staffMember ) );
        }

        return list;
    }

    @Override
    public void updateStaffMemberFromDTO(StaffMemberDTO dto, StaffMember entity) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getStaffType() != null ) {
            entity.setStaffType( dto.getStaffType() );
        }
        if ( dto.getNbAssociation() != null ) {
            entity.setNbAssociation( dto.getNbAssociation() );
        }
        if ( dto.getNbDeployed() != null ) {
            entity.setNbDeployed( dto.getNbDeployed() );
        }
        if ( dto.getNbVolunteers() != null ) {
            entity.setNbVolunteers( dto.getNbVolunteers() );
        }
        if ( dto.getNbCNSS() != null ) {
            entity.setNbCNSS( dto.getNbCNSS() );
        }
        if ( dto.getNbSMIG() != null ) {
            entity.setNbSMIG( dto.getNbSMIG() );
        }
        if ( dto.getMonthlyCost() != null ) {
            entity.setMonthlyCost( dto.getMonthlyCost() );
        }
        if ( dto.getAnnualCost() != null ) {
            entity.setAnnualCost( dto.getAnnualCost() );
        }
    }

    private Long entityRegionId(Institution institution) {
        if ( institution == null ) {
            return null;
        }
        Region region = institution.getRegion();
        if ( region == null ) {
            return null;
        }
        Long id = region.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String entityRegionName(Institution institution) {
        if ( institution == null ) {
            return null;
        }
        Region region = institution.getRegion();
        if ( region == null ) {
            return null;
        }
        String name = region.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private Long entityPrefectureId(Institution institution) {
        if ( institution == null ) {
            return null;
        }
        Prefecture prefecture = institution.getPrefecture();
        if ( prefecture == null ) {
            return null;
        }
        Long id = prefecture.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String entityPrefectureName(Institution institution) {
        if ( institution == null ) {
            return null;
        }
        Prefecture prefecture = institution.getPrefecture();
        if ( prefecture == null ) {
            return null;
        }
        String name = prefecture.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private Long entityCommuneId(Institution institution) {
        if ( institution == null ) {
            return null;
        }
        Commune commune = institution.getCommune();
        if ( commune == null ) {
            return null;
        }
        Long id = commune.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String entityCommuneName(Institution institution) {
        if ( institution == null ) {
            return null;
        }
        Commune commune = institution.getCommune();
        if ( commune == null ) {
            return null;
        }
        String name = commune.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
