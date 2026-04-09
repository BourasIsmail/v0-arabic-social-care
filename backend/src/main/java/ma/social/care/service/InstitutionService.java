package ma.social.care.service;

import ma.social.care.dto.*;
import ma.social.care.entity.enums.*;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface InstitutionService {

    InstitutionResponseDTO createInstitution(InstitutionRequestDTO request);

    Page<InstitutionSummaryDTO> getAllInstitutions(
            String region,
            String commune,
            InstitutionType institutionType,
            Milieu milieu,
            LegalStatus legalStatus,
            Long userPrefectureId,
            boolean isAdmin,
            Pageable pageable
    );

    InstitutionResponseDTO getInstitutionById(Long id);

    InstitutionResponseDTO updateInstitution(Long id, InstitutionRequestDTO request);

    void deleteInstitution(Long id);

    List<StaffMemberDTO> getStaffByInstitutionId(Long institutionId);

    List<StaffMemberDTO> replaceStaff(Long institutionId, List<StaffMemberDTO> staffMembers);

    List<InstitutionResponseDTO> getAllForExport();

    List<String> getAllRegions();

    List<String> getAllCommunes();

    List<String> getCommunesByRegion(String region);

    InstitutionResponseDTO uploadSignedPdf(Long id, MultipartFile file);

    void deleteSignedPdf(Long id);

    Resource getSignedPdfResource(Long id);
}
