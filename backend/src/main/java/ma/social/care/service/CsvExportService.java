package ma.social.care.service;

import com.opencsv.CSVWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.social.care.dto.InstitutionResponseDTO;
import ma.social.care.dto.StaffMemberDTO;
import org.springframework.stereotype.Service;

import java.io.StringWriter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CsvExportService {

    private final InstitutionService institutionService;

    public String exportInstitutionsToCsv() {
        log.info("Generating CSV export of all institutions");

        List<InstitutionResponseDTO> institutions = institutionService.getAllForExport();

        StringWriter stringWriter = new StringWriter();
        try (CSVWriter writer = new CSVWriter(stringWriter)) {
            // Write header
            String[] header = {
                    "ID",
                    "Institution Type",
                    "Association Name",
                    "Institution Name",
                    "Address",
                    "Region",
                    "Prefecture/Province",
                    "Commune",
                    "Milieu",
                    "Creation Year",
                    "Legal Status",
                    "License Number",
                    "Service Start Date",
                    "Total Capacity",
                    "Male Capacity",
                    "Female Capacity",
                    "Housing Service",
                    "Meals Service",
                    "Educational Support",
                    "Cultural Activities",
                    "Health Care",
                    "Insurance",
                    "Psychological Support",
                    "Building Status",
                    "Building Condition",
                    "Renovation Capacity",
                    "Owner Type",
                    "Total Construction Cost",
                    "Annual Management Cost",
                    "Staff Count",
                    "Created At",
                    "Updated At"
            };
            writer.writeNext(header);

            // Write data rows
            for (InstitutionResponseDTO inst : institutions) {
                String[] row = {
                        String.valueOf(inst.getId()),
                        inst.getInstitutionType() != null ? inst.getInstitutionType().name() : "",
                        nullSafe(inst.getAssociationName()),
                        nullSafe(inst.getInstitutionName()),
                        nullSafe(inst.getAddress()),
                        nullSafe(inst.getRegion()),
                        nullSafe(inst.getPrefectureProvince()),
                        nullSafe(inst.getCommune()),
                        inst.getMilieu() != null ? inst.getMilieu().name() : "",
                        inst.getCreationYear() != null ? String.valueOf(inst.getCreationYear()) : "",
                        inst.getLegalStatus() != null ? inst.getLegalStatus().name() : "",
                        nullSafe(inst.getLicenseNumber()),
                        inst.getServiceStartDate() != null ? inst.getServiceStartDate().toString() : "",
                        inst.getTotalCapacity() != null ? String.valueOf(inst.getTotalCapacity()) : "",
                        inst.getMaleCapacity() != null ? String.valueOf(inst.getMaleCapacity()) : "",
                        inst.getFemaleCapacity() != null ? String.valueOf(inst.getFemaleCapacity()) : "",
                        boolToString(inst.getHousing()),
                        boolToString(inst.getMeals()),
                        boolToString(inst.getEducationalSupport()),
                        boolToString(inst.getCulturalActivities()),
                        boolToString(inst.getHealthCare()),
                        boolToString(inst.getInsurance()),
                        boolToString(inst.getPsychologicalSupport()),
                        inst.getBuilding() != null && inst.getBuilding().getBuildingStatus() != null
                                ? inst.getBuilding().getBuildingStatus().name() : "",
                        inst.getBuilding() != null && inst.getBuilding().getBuildingCondition() != null
                                ? inst.getBuilding().getBuildingCondition().name() : "",
                        inst.getBuilding() != null && inst.getBuilding().getRenovationCapacity() != null
                                ? inst.getBuilding().getRenovationCapacity().name() : "",
                        inst.getBuilding() != null && inst.getBuilding().getOwnerType() != null
                                ? inst.getBuilding().getOwnerType().name() : "",
                        inst.getFinancing() != null && inst.getFinancing().getTotalConstructionCost() != null
                                ? inst.getFinancing().getTotalConstructionCost().toString() : "",
                        inst.getFinancing() != null && inst.getFinancing().getAnnualManagementCost() != null
                                ? inst.getFinancing().getAnnualManagementCost().toString() : "",
                        inst.getStaffMembers() != null ? String.valueOf(countTotalStaff(inst.getStaffMembers())) : "0",
                        inst.getCreatedAt() != null ? inst.getCreatedAt().toString() : "",
                        inst.getUpdatedAt() != null ? inst.getUpdatedAt().toString() : ""
                };
                writer.writeNext(row);
            }
        } catch (Exception e) {
            log.error("Error generating CSV export", e);
            throw new RuntimeException("Failed to generate CSV export", e);
        }

        return stringWriter.toString();
    }

    private String nullSafe(String value) {
        return value != null ? value : "";
    }

    private String boolToString(Boolean value) {
        return value != null && value ? "Yes" : "No";
    }

    private int countTotalStaff(List<StaffMemberDTO> staffMembers) {
        return staffMembers.stream()
                .mapToInt(s -> {
                    int count = 0;
                    if (s.getNbAssociation() != null) count += s.getNbAssociation();
                    if (s.getNbDeployed() != null) count += s.getNbDeployed();
                    if (s.getNbVolunteers() != null) count += s.getNbVolunteers();
                    return count;
                })
                .sum();
    }
}
