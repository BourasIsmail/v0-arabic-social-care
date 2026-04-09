package ma.social.care.repository;

import ma.social.care.entity.Institution;
import ma.social.care.entity.enums.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InstitutionRepository extends JpaRepository<Institution, Long> {

    @Query("SELECT i FROM Institution i " +
            "WHERE (:region IS NULL OR i.region = :region) " +
            "AND (:commune IS NULL OR i.commune = :commune) " +
            "AND (:institutionType IS NULL OR i.institutionType = :institutionType) " +
            "AND (:milieu IS NULL OR i.milieu = :milieu) " +
            "AND (:legalStatus IS NULL OR i.legalStatus = :legalStatus) " +
            "AND (:prefectureId IS NULL OR i.prefecture.id = :prefectureId) " +
            "AND i.isDeleted = false")
    Page<Institution> findAllWithFilters(
            @Param("region") String region,
            @Param("commune") String commune,
            @Param("institutionType") InstitutionType institutionType,
            @Param("milieu") Milieu milieu,
            @Param("legalStatus") LegalStatus legalStatus,
            @Param("prefectureId") Long prefectureId,
            Pageable pageable
    );

    @Query("SELECT i FROM Institution i " +
            "LEFT JOIN FETCH i.building " +
            "LEFT JOIN FETCH i.financing " +
            "LEFT JOIN FETCH i.targeting " +
            "LEFT JOIN FETCH i.housingMeals " +
            "WHERE i.id = :id")
    Optional<Institution> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT i FROM Institution i WHERE i.isDeleted = false")
    List<Institution> findAllActive();

    @Query("SELECT DISTINCT i.region FROM Institution i WHERE i.region IS NOT NULL ORDER BY i.region")
    List<String> findAllRegions();

    @Query("SELECT DISTINCT i.commune FROM Institution i WHERE i.commune IS NOT NULL ORDER BY i.commune")
    List<String> findAllCommunes();

    @Query("SELECT DISTINCT i.commune FROM Institution i WHERE i.region = :region AND i.commune IS NOT NULL ORDER BY i.commune")
    List<String> findCommunesByRegion(@Param("region") String region);

    // Statistics queries
    @Query("SELECT COUNT(i) FROM Institution i WHERE i.isDeleted = false")
    long countActiveInstitutions();

    @Query("SELECT COUNT(i) FROM Institution i WHERE i.isDeleted = false AND i.institutionType = :type")
    long countByInstitutionType(@Param("type") InstitutionType type);

    @Query("SELECT COUNT(i) FROM Institution i WHERE i.isDeleted = false AND i.milieu = :milieu")
    long countByMilieu(@Param("milieu") Milieu milieu);

    @Query("SELECT COUNT(i) FROM Institution i WHERE i.isDeleted = false AND i.legalStatus = :status")
    long countByLegalStatus(@Param("status") LegalStatus status);

    @Query("SELECT COALESCE(SUM(i.totalCapacity), 0) FROM Institution i WHERE i.isDeleted = false")
    long sumTotalCapacity();

    @Query("SELECT COUNT(i) FROM Institution i WHERE i.isDeleted = false AND i.housing = true")
    long countWithHousing();

    @Query("SELECT COUNT(i) FROM Institution i WHERE i.isDeleted = false AND i.meals = true")
    long countWithMeals();

    @Query("SELECT i FROM Institution i LEFT JOIN FETCH i.region LEFT JOIN FETCH i.prefecture LEFT JOIN FETCH i.housingMeals WHERE i.isDeleted = false")
    List<Institution> findAllActiveWithRelations();
}
