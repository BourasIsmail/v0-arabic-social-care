package ma.social.care.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.social.care.dto.*;
import ma.social.care.entity.enums.*;
import ma.social.care.service.CsvExportService;
import ma.social.care.service.InstitutionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/institutions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InstitutionController {

    private final InstitutionService institutionService;
    private final CsvExportService csvExportService;

    /**
     * Create a new institution with all nested data in one request
     */
    @PostMapping
    public ResponseEntity<InstitutionResponseDTO> createInstitution(
            @Valid @RequestBody InstitutionRequestDTO request
    ) {
        log.info("POST /api/v1/institutions - Creating new institution");
        InstitutionResponseDTO created = institutionService.createInstitution(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Get paginated list of institutions with optional filters
     */
    @GetMapping
    public ResponseEntity<Page<InstitutionSummaryDTO>> getAllInstitutions(
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String commune,
            @RequestParam(required = false) InstitutionType institutionType,
            @RequestParam(required = false) Milieu milieu,
            @RequestParam(required = false) LegalStatus legalStatus,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        log.info("GET /api/v1/institutions - Fetching institutions with filters");
        Page<InstitutionSummaryDTO> institutions = institutionService.getAllInstitutions(
                region, commune, institutionType, milieu, legalStatus, pageable
        );
        return ResponseEntity.ok(institutions);
    }

    /**
     * Get full institution details by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<InstitutionResponseDTO> getInstitutionById(@PathVariable Long id) {
        log.info("GET /api/v1/institutions/{} - Fetching institution details", id);
        InstitutionResponseDTO institution = institutionService.getInstitutionById(id);
        return ResponseEntity.ok(institution);
    }

    /**
     * Update full institution data
     */
    @PutMapping("/{id}")
    public ResponseEntity<InstitutionResponseDTO> updateInstitution(
            @PathVariable Long id,
            @Valid @RequestBody InstitutionRequestDTO request
    ) {
        log.info("PUT /api/v1/institutions/{} - Updating institution", id);
        InstitutionResponseDTO updated = institutionService.updateInstitution(id, request);
        return ResponseEntity.ok(updated);
    }

    /**
     * Soft delete an institution
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInstitution(@PathVariable Long id) {
        log.info("DELETE /api/v1/institutions/{} - Soft deleting institution", id);
        institutionService.deleteInstitution(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get staff list for an institution
     */
    @GetMapping("/{id}/staff")
    public ResponseEntity<List<StaffMemberDTO>> getStaffByInstitution(@PathVariable Long id) {
        log.info("GET /api/v1/institutions/{}/staff - Fetching staff members", id);
        List<StaffMemberDTO> staffMembers = institutionService.getStaffByInstitutionId(id);
        return ResponseEntity.ok(staffMembers);
    }

    /**
     * Replace full staff list for an institution
     */
    @PutMapping("/{id}/staff")
    public ResponseEntity<List<StaffMemberDTO>> replaceStaff(
            @PathVariable Long id,
            @Valid @RequestBody List<StaffMemberDTO> staffMembers
    ) {
        log.info("PUT /api/v1/institutions/{}/staff - Replacing staff members", id);
        List<StaffMemberDTO> updatedStaff = institutionService.replaceStaff(id, staffMembers);
        return ResponseEntity.ok(updatedStaff);
    }

    /**
     * Export all institutions as CSV
     */
    @GetMapping("/export/csv")
    public ResponseEntity<String> exportToCsv() {
        log.info("GET /api/v1/institutions/export/csv - Exporting institutions to CSV");
        String csvContent = csvExportService.exportInstitutionsToCsv();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "institutions_export.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvContent);
    }

    /**
     * Get all distinct regions
     */
    @GetMapping("/regions")
    public ResponseEntity<List<String>> getAllRegions() {
        log.info("GET /api/v1/institutions/regions - Fetching all regions");
        return ResponseEntity.ok(institutionService.getAllRegions());
    }

    /**
     * Get all distinct communes
     */
    @GetMapping("/communes")
    public ResponseEntity<List<String>> getAllCommunes(
            @RequestParam(required = false) String region
    ) {
        log.info("GET /api/v1/institutions/communes - Fetching communes");
        if (region != null && !region.isBlank()) {
            return ResponseEntity.ok(institutionService.getCommunesByRegion(region));
        }
        return ResponseEntity.ok(institutionService.getAllCommunes());
    }

    /**
     * Upload signed PDF for an institution
     */
    @PostMapping("/{id}/signed-pdf")
    public ResponseEntity<InstitutionResponseDTO> uploadSignedPdf(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) {
        log.info("POST /api/v1/institutions/{}/signed-pdf - Uploading signed PDF", id);
        InstitutionResponseDTO updated = institutionService.uploadSignedPdf(id, file);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete signed PDF for an institution
     */
    @DeleteMapping("/{id}/signed-pdf")
    public ResponseEntity<Void> deleteSignedPdf(@PathVariable Long id) {
        log.info("DELETE /api/v1/institutions/{}/signed-pdf - Deleting signed PDF", id);
        institutionService.deleteSignedPdf(id);
        return ResponseEntity.noContent().build();
    }
}
