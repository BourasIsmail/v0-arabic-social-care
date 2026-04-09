package ma.social.care.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.social.care.dto.*;
import ma.social.care.entity.*;
import ma.social.care.entity.enums.*;
import ma.social.care.exception.ResourceNotFoundException;
import ma.social.care.mapper.InstitutionMapper;
import ma.social.care.repository.*;
import ma.social.care.service.InstitutionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class InstitutionServiceImpl implements InstitutionService {

    private final InstitutionRepository institutionRepository;
    private final StaffMemberRepository staffMemberRepository;
    private final RegionRepository regionRepository;
    private final PrefectureRepository prefectureRepository;
    private final CommuneRepository communeRepository;
    private final InstitutionMapper mapper;

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    @Value("${app.upload.base-url:/uploads}")
    private String uploadBaseUrl;

    public InstitutionServiceImpl(
            InstitutionRepository institutionRepository,
            StaffMemberRepository staffMemberRepository,
            RegionRepository regionRepository,
            PrefectureRepository prefectureRepository,
            CommuneRepository communeRepository,
            InstitutionMapper mapper
    ) {
        this.institutionRepository = institutionRepository;
        this.staffMemberRepository = staffMemberRepository;
        this.regionRepository = regionRepository;
        this.prefectureRepository = prefectureRepository;
        this.communeRepository = communeRepository;
        this.mapper = mapper;
    }

    @Override
    public InstitutionResponseDTO createInstitution(InstitutionRequestDTO request) {
        log.info("Creating new institution: {}", request.getInstitutionName());

        Institution institution = mapper.toEntity(request);

        // Set geo relationships
        if (request.getRegionId() != null) {
            Region region = regionRepository.findById(request.getRegionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Region", "id", request.getRegionId()));
            institution.setRegion(region);
        }
        if (request.getPrefectureId() != null) {
            Prefecture prefecture = prefectureRepository.findById(request.getPrefectureId())
                    .orElseThrow(() -> new ResourceNotFoundException("Prefecture", "id", request.getPrefectureId()));
            institution.setPrefecture(prefecture);
        }
        if (request.getCommuneId() != null) {
            Commune commune = communeRepository.findById(request.getCommuneId())
                    .orElseThrow(() -> new ResourceNotFoundException("Commune", "id", request.getCommuneId()));
            institution.setCommune(commune);
        }

        // Set nested entities
        if (request.getBuilding() != null) {
            Building building = mapper.toBuildingEntity(request.getBuilding());
            institution.setBuilding(building);
        }

        if (request.getFinancing() != null) {
            Financing financing = mapper.toFinancingEntity(request.getFinancing());
            institution.setFinancing(financing);
        }

        if (request.getTargeting() != null) {
            Targeting targeting = mapper.toTargetingEntity(request.getTargeting());
            institution.setTargeting(targeting);
        }

        if (request.getHousingMeals() != null) {
            HousingMeals housingMeals = mapper.toHousingMealsEntity(request.getHousingMeals());
            institution.setHousingMeals(housingMeals);
        }

        if (request.getStaffMembers() != null && !request.getStaffMembers().isEmpty()) {
            for (StaffMemberDTO staffDTO : request.getStaffMembers()) {
                StaffMember staff = mapper.toStaffMemberEntity(staffDTO);
                institution.addStaffMember(staff);
            }
        }

        Institution saved = institutionRepository.save(institution);
        log.info("Institution created with ID: {}", saved.getId());

        return mapper.toResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InstitutionSummaryDTO> getAllInstitutions(
            String region,
            String commune,
            InstitutionType institutionType,
            Milieu milieu,
            LegalStatus legalStatus,
            Long userPrefectureId,
            boolean isAdmin,
            Pageable pageable
    ) {
        // For non-admin users (USER role), filter by their prefecture
        Long prefectureFilter = isAdmin ? null : userPrefectureId;
        
        log.debug("Fetching institutions with filters - region: {}, commune: {}, type: {}, milieu: {}, status: {}, prefectureId: {}, isAdmin: {}",
                region, commune, institutionType, milieu, legalStatus, prefectureFilter, isAdmin);

        Page<Institution> institutions = institutionRepository.findAllWithFilters(
                region, commune, institutionType, milieu, legalStatus, prefectureFilter, pageable
        );

        return institutions.map(mapper::toSummaryDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public InstitutionResponseDTO getInstitutionById(Long id) {
        log.debug("Fetching institution with ID: {}", id);

        Institution institution = institutionRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Institution", "id", id));

        // Fetch staff members separately to avoid N+1
        List<StaffMember> staffMembers = staffMemberRepository.findByInstitutionId(id);
        institution.setStaffMembers(staffMembers);

        return mapper.toResponseDTO(institution);
    }

    @Override
    public InstitutionResponseDTO updateInstitution(Long id, InstitutionRequestDTO request) {
        log.info("Updating institution with ID: {}", id);

        Institution institution = institutionRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Institution", "id", id));

        // Update main entity fields
        mapper.updateEntityFromDTO(request, institution);

        // Update geo relationships
        if (request.getRegionId() != null) {
            Region region = regionRepository.findById(request.getRegionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Region", "id", request.getRegionId()));
            institution.setRegion(region);
        } else {
            institution.setRegion(null);
        }
        if (request.getPrefectureId() != null) {
            Prefecture prefecture = prefectureRepository.findById(request.getPrefectureId())
                    .orElseThrow(() -> new ResourceNotFoundException("Prefecture", "id", request.getPrefectureId()));
            institution.setPrefecture(prefecture);
        } else {
            institution.setPrefecture(null);
        }
        if (request.getCommuneId() != null) {
            Commune commune = communeRepository.findById(request.getCommuneId())
                    .orElseThrow(() -> new ResourceNotFoundException("Commune", "id", request.getCommuneId()));
            institution.setCommune(commune);
        } else {
            institution.setCommune(null);
        }

        // Update Building
        if (request.getBuilding() != null) {
            if (institution.getBuilding() == null) {
                Building building = mapper.toBuildingEntity(request.getBuilding());
                institution.setBuilding(building);
            } else {
                mapper.updateBuildingFromDTO(request.getBuilding(), institution.getBuilding());
            }
        }

        // Update Financing
        if (request.getFinancing() != null) {
            if (institution.getFinancing() == null) {
                Financing financing = mapper.toFinancingEntity(request.getFinancing());
                institution.setFinancing(financing);
            } else {
                mapper.updateFinancingFromDTO(request.getFinancing(), institution.getFinancing());
            }
        }

        // Update Targeting
        if (request.getTargeting() != null) {
            if (institution.getTargeting() == null) {
                Targeting targeting = mapper.toTargetingEntity(request.getTargeting());
                institution.setTargeting(targeting);
            } else {
                mapper.updateTargetingFromDTO(request.getTargeting(), institution.getTargeting());
            }
        }

        // Update HousingMeals
        if (request.getHousingMeals() != null) {
            if (institution.getHousingMeals() == null) {
                HousingMeals housingMeals = mapper.toHousingMealsEntity(request.getHousingMeals());
                institution.setHousingMeals(housingMeals);
            } else {
                mapper.updateHousingMealsFromDTO(request.getHousingMeals(), institution.getHousingMeals());
            }
        }

        // Update Staff Members - replace all
        if (request.getStaffMembers() != null) {
            institution.clearStaffMembers();
            for (StaffMemberDTO staffDTO : request.getStaffMembers()) {
                StaffMember staff = mapper.toStaffMemberEntity(staffDTO);
                institution.addStaffMember(staff);
            }
        }

        Institution saved = institutionRepository.save(institution);
        log.info("Institution updated successfully");

        return mapper.toResponseDTO(saved);
    }

    @Override
    public void deleteInstitution(Long id) {
        log.info("Soft deleting institution with ID: {}", id);

        Institution institution = institutionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Institution", "id", id));

        institution.setIsDeleted(true);
        institution.setDeletedAt(LocalDateTime.now());
        institutionRepository.save(institution);

        log.info("Institution soft deleted successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public List<StaffMemberDTO> getStaffByInstitutionId(Long institutionId) {
        log.debug("Fetching staff for institution ID: {}", institutionId);

        // Verify institution exists
        if (!institutionRepository.existsById(institutionId)) {
            throw new ResourceNotFoundException("Institution", "id", institutionId);
        }

        List<StaffMember> staffMembers = staffMemberRepository.findByInstitutionId(institutionId);
        return mapper.toStaffMemberDTOList(staffMembers);
    }

    @Override
    public List<StaffMemberDTO> replaceStaff(Long institutionId, List<StaffMemberDTO> staffMembersDTO) {
        log.info("Replacing staff for institution ID: {}", institutionId);

        Institution institution = institutionRepository.findById(institutionId)
                .orElseThrow(() -> new ResourceNotFoundException("Institution", "id", institutionId));

        // Remove existing staff
        staffMemberRepository.deleteByInstitutionId(institutionId);
        institution.getStaffMembers().clear();

        // Add new staff
        List<StaffMember> newStaffMembers = new ArrayList<>();
        for (StaffMemberDTO dto : staffMembersDTO) {
            StaffMember staff = mapper.toStaffMemberEntity(dto);
            staff.setInstitution(institution);
            newStaffMembers.add(staff);
        }

        List<StaffMember> savedStaff = staffMemberRepository.saveAll(newStaffMembers);
        log.info("Staff replaced successfully");

        return mapper.toStaffMemberDTOList(savedStaff);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InstitutionResponseDTO> getAllForExport() {
        log.info("Exporting all institutions");

        List<Institution> institutions = institutionRepository.findAllActive();
        return institutions.stream()
                .map(mapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getAllRegions() {
        return institutionRepository.findAllRegions();
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getAllCommunes() {
        return institutionRepository.findAllCommunes();
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getCommunesByRegion(String region) {
        return institutionRepository.findCommunesByRegion(region);
    }

    @Override
    public InstitutionResponseDTO uploadSignedPdf(Long id, MultipartFile file) {
        log.info("Uploading signed PDF for institution: {}", id);

        Institution institution = institutionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Institution", "id", id));

        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir, "signed-pdfs");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                    ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                    : ".pdf";
            String filename = "institution_" + id + "_" + UUID.randomUUID().toString() + extension;

            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Delete old file if exists
            if (institution.getSignedPdfUrl() != null) {
                try {
                    String oldFilename = institution.getSignedPdfUrl().replace(uploadBaseUrl + "/signed-pdfs/", "");
                    Path oldFilePath = uploadPath.resolve(oldFilename);
                    Files.deleteIfExists(oldFilePath);
                } catch (Exception e) {
                    log.warn("Failed to delete old signed PDF: {}", e.getMessage());
                }
            }

            // Update institution
            String fileUrl = uploadBaseUrl + "/signed-pdfs/" + filename;
            institution.setSignedPdfUrl(fileUrl);
            institution = institutionRepository.save(institution);

            log.info("Signed PDF uploaded successfully: {}", fileUrl);
            return mapper.toResponseDTO(institution);

        } catch (IOException e) {
            log.error("Failed to upload signed PDF", e);
            throw new RuntimeException("Failed to upload signed PDF: " + e.getMessage());
        }
    }

    @Override
    public void deleteSignedPdf(Long id) {
        log.info("Deleting signed PDF for institution: {}", id);

        Institution institution = institutionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Institution", "id", id));

        if (institution.getSignedPdfUrl() != null) {
            try {
                Path uploadPath = Paths.get(uploadDir, "signed-pdfs");
                String filename = institution.getSignedPdfUrl().replace(uploadBaseUrl + "/signed-pdfs/", "");
                Path filePath = uploadPath.resolve(filename);
                Files.deleteIfExists(filePath);
            } catch (Exception e) {
                log.warn("Failed to delete signed PDF file: {}", e.getMessage());
            }

            institution.setSignedPdfUrl(null);
            institutionRepository.save(institution);
            log.info("Signed PDF deleted successfully");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Resource getSignedPdfResource(Long id) {
        log.info("Getting signed PDF resource for institution: {}", id);

        Institution institution = institutionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Institution", "id", id));

        if (institution.getSignedPdfUrl() == null) {
            throw new ResourceNotFoundException("SignedPdf", "institutionId", id);
        }

        try {
            Path uploadPath = Paths.get(uploadDir, "signed-pdfs");
            String filename = institution.getSignedPdfUrl().replace(uploadBaseUrl + "/signed-pdfs/", "");
            Path filePath = uploadPath.resolve(filename);
            
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("SignedPdf file", "path", filePath.toString());
            }
        } catch (IOException e) {
            log.error("Failed to read signed PDF file", e);
            throw new RuntimeException("Failed to read signed PDF: " + e.getMessage());
        }
    }
}
