package ma.social.care.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ma.social.care.dto.*;
import ma.social.care.entity.enums.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class InstitutionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createInstitution_WithValidData_ReturnsCreatedInstitution() throws Exception {
        InstitutionRequestDTO request = createFullInstitutionRequest();

        mockMvc.perform(post("/api/v1/institutions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.institutionType").value("DAR_TALIB"))
                .andExpect(jsonPath("$.associationName").value("Test Association"))
                .andExpect(jsonPath("$.institutionName").value("Test Institution"))
                .andExpect(jsonPath("$.region").value("Casablanca-Settat"))
                .andExpect(jsonPath("$.building.buildingStatus").value("OWNED"))
                .andExpect(jsonPath("$.financing.totalConstructionCost").value(1000000.00))
                .andExpect(jsonPath("$.targeting.selectionBody").value("MIXED_COMMITTEE"))
                .andExpect(jsonPath("$.housingMeals.mealServiceType").value("INSTITUTION_KITCHEN"))
                .andExpect(jsonPath("$.staffMembers", hasSize(2)));
    }

    @Test
    void createInstitution_WithMissingRequiredFields_ReturnsBadRequest() throws Exception {
        InstitutionRequestDTO request = InstitutionRequestDTO.builder()
                .institutionType(InstitutionType.DAR_TALIB)
                // Missing associationName and institutionName
                .build();

        mockMvc.perform(post("/api/v1/institutions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors").isArray())
                .andExpect(jsonPath("$.fieldErrors", hasSize(greaterThan(0))));
    }

    @Test
    void getInstitutionById_WithExistingId_ReturnsInstitution() throws Exception {
        // First create an institution
        InstitutionRequestDTO request = createFullInstitutionRequest();
        MvcResult createResult = mockMvc.perform(post("/api/v1/institutions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        InstitutionResponseDTO created = objectMapper.readValue(
                createResult.getResponse().getContentAsString(),
                InstitutionResponseDTO.class
        );

        // Then retrieve it
        mockMvc.perform(get("/api/v1/institutions/{id}", created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(created.getId()))
                .andExpect(jsonPath("$.institutionName").value("Test Institution"));
    }

    @Test
    void getInstitutionById_WithNonExistingId_ReturnsNotFound() throws Exception {
        mockMvc.perform(get("/api/v1/institutions/{id}", 99999))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value(containsString("not found")));
    }

    @Test
    void getAllInstitutions_WithFilters_ReturnsFilteredList() throws Exception {
        // Create an institution
        InstitutionRequestDTO request = createFullInstitutionRequest();
        mockMvc.perform(post("/api/v1/institutions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Get with filters
        mockMvc.perform(get("/api/v1/institutions")
                        .param("region", "Casablanca-Settat")
                        .param("institutionType", "DAR_TALIB"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.totalElements").value(greaterThanOrEqualTo(1)));
    }

    @Test
    void updateInstitution_WithValidData_ReturnsUpdatedInstitution() throws Exception {
        // First create an institution
        InstitutionRequestDTO createRequest = createFullInstitutionRequest();
        MvcResult createResult = mockMvc.perform(post("/api/v1/institutions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        InstitutionResponseDTO created = objectMapper.readValue(
                createResult.getResponse().getContentAsString(),
                InstitutionResponseDTO.class
        );

        // Update it
        createRequest.setInstitutionName("Updated Institution Name");
        createRequest.setTotalCapacity(200);

        mockMvc.perform(put("/api/v1/institutions/{id}", created.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.institutionName").value("Updated Institution Name"))
                .andExpect(jsonPath("$.totalCapacity").value(200));
    }

    @Test
    void deleteInstitution_WithExistingId_ReturnsNoContent() throws Exception {
        // First create an institution
        InstitutionRequestDTO request = createFullInstitutionRequest();
        MvcResult createResult = mockMvc.perform(post("/api/v1/institutions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        InstitutionResponseDTO created = objectMapper.readValue(
                createResult.getResponse().getContentAsString(),
                InstitutionResponseDTO.class
        );

        // Delete it
        mockMvc.perform(delete("/api/v1/institutions/{id}", created.getId()))
                .andExpect(status().isNoContent());

        // Verify it's not found anymore (soft deleted)
        mockMvc.perform(get("/api/v1/institutions/{id}", created.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    void getStaffByInstitution_ReturnsStaffList() throws Exception {
        // Create institution with staff
        InstitutionRequestDTO request = createFullInstitutionRequest();
        MvcResult createResult = mockMvc.perform(post("/api/v1/institutions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        InstitutionResponseDTO created = objectMapper.readValue(
                createResult.getResponse().getContentAsString(),
                InstitutionResponseDTO.class
        );

        // Get staff
        mockMvc.perform(get("/api/v1/institutions/{id}/staff", created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void replaceStaff_WithNewStaffList_ReplacesAllStaff() throws Exception {
        // Create institution
        InstitutionRequestDTO request = createFullInstitutionRequest();
        MvcResult createResult = mockMvc.perform(post("/api/v1/institutions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        InstitutionResponseDTO created = objectMapper.readValue(
                createResult.getResponse().getContentAsString(),
                InstitutionResponseDTO.class
        );

        // Replace staff with new list
        StaffMemberDTO newStaff = StaffMemberDTO.builder()
                .staffType(StaffType.DOCTOR)
                .nbAssociation(1)
                .monthlyCost(new BigDecimal("8000.00"))
                .build();

        mockMvc.perform(put("/api/v1/institutions/{id}/staff", created.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Arrays.asList(newStaff))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].staffType").value("DOCTOR"));
    }

    @Test
    void exportToCsv_ReturnsValidCsv() throws Exception {
        // Create an institution
        InstitutionRequestDTO request = createFullInstitutionRequest();
        mockMvc.perform(post("/api/v1/institutions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Export to CSV
        mockMvc.perform(get("/api/v1/institutions/export/csv"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("text/csv"))
                .andExpect(content().string(containsString("ID")))
                .andExpect(content().string(containsString("Test Institution")));
    }

    private InstitutionRequestDTO createFullInstitutionRequest() {
        BuildingDTO building = BuildingDTO.builder()
                .buildingStatus(BuildingStatus.OWNED)
                .buildingCondition(BuildingCondition.GOOD)
                .renovationCapacity(RenovationCapacity.EASY)
                .ownerType(OwnerType.COMMUNAL)
                .hasPartnershipAgreement(true)
                .build();

        FinancingDTO financing = FinancingDTO.builder()
                .solidarityMinistry(true)
                .nationalEntraide(true)
                .indh(true)
                .totalConstructionCost(new BigDecimal("1000000.00"))
                .annualManagementCost(new BigDecimal("200000.00"))
                .operatingIndh(true)
                .operatingNationalEntraide(true)
                .annualHRCost(new BigDecimal("150000.00"))
                .annualMealsCost(new BigDecimal("100000.00"))
                .associationShare(50.0)
                .educationShare(30.0)
                .otherShare(20.0)
                .build();

        TargetingDTO targeting = TargetingDTO.builder()
                .socialSituation(true)
                .distance(true)
                .schoolResults(true)
                .priority1("Orphans")
                .priority2("Low income families")
                .priority3("Remote areas")
                .selectionBody(SelectionBody.MIXED_COMMITTEE)
                .committeeAssociation(true)
                .committeeNationalEntraide(true)
                .servicesAreFree(false)
                .tariffType(TariffType.UNIFORM)
                .uniformAmount(new BigDecimal("50.00"))
                .build();

        SeasonBeneficiariesDTO season2526 = SeasonBeneficiariesDTO.builder()
                .total(100)
                .male(50)
                .female(50)
                .primary(20)
                .middleSchool(40)
                .highSchool(40)
                .build();

        HousingMealsDTO housingMeals = HousingMealsDTO.builder()
                .season2526(season2526)
                .totalMealBeneficiaries2526(100)
                .associationMealBeneficiaries(70)
                .educationMealBeneficiaries(30)
                .fullGrantCount(50)
                .halfGrantCount(30)
                .mealServiceType(MealServiceType.INSTITUTION_KITCHEN)
                .build();

        StaffMemberDTO director = StaffMemberDTO.builder()
                .staffType(StaffType.DIRECTOR)
                .nbAssociation(1)
                .monthlyCost(new BigDecimal("5000.00"))
                .annualCost(new BigDecimal("60000.00"))
                .build();

        StaffMemberDTO educator = StaffMemberDTO.builder()
                .staffType(StaffType.EDUCATORS)
                .nbAssociation(5)
                .nbVolunteers(3)
                .monthlyCost(new BigDecimal("15000.00"))
                .annualCost(new BigDecimal("180000.00"))
                .build();

        return InstitutionRequestDTO.builder()
                .institutionType(InstitutionType.DAR_TALIB)
                .associationName("Test Association")
                .institutionName("Test Institution")
                .address("123 Test Street")
                .region("Casablanca-Settat")
                .prefectureProvince("Casablanca")
                .commune("Anfa")
                .milieu(Milieu.URBAIN)
                .creationYear(2010)
                .legalStatus(LegalStatus.LICENSED)
                .licenseNumber("LIC-2010-001")
                .serviceStartDate(LocalDate.of(2010, 9, 1))
                .housing(true)
                .meals(true)
                .educationalSupport(true)
                .culturalActivities(true)
                .healthCare(true)
                .insurance(true)
                .psychologicalSupport(false)
                .totalCapacity(120)
                .maleCapacity(60)
                .femaleCapacity(60)
                .primary(true)
                .middleSchool(true)
                .highSchool(true)
                .distanceToSchool(Distance.LT_1KM)
                .distanceToNationalBoardingSchool(Distance.BETWEEN_1_5KM)
                .building(building)
                .financing(financing)
                .targeting(targeting)
                .housingMeals(housingMeals)
                .staffMembers(Arrays.asList(director, educator))
                .build();
    }
}
