package ma.social.care.repository;

import ma.social.care.entity.Commune;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommuneRepository extends JpaRepository<Commune, Long> {
    List<Commune> findByPrefectureIdOrderByNameAsc(Long prefectureId);
}
