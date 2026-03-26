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
            "AND (:legalStatus IS NULL OR i.legalStatus = :legalStatus)")
    Page<Institution> findAllWithFilters(
            @Param("region") String region,
            @Param("commune") String commune,
            @Param("institutionType") InstitutionType institutionType,
            @Param("milieu") Milieu milieu,
            @Param("legalStatus") LegalStatus legalStatus,
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
}
