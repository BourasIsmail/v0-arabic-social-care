package ma.social.care.repository;

import ma.social.care.entity.Prefecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrefectureRepository extends JpaRepository<Prefecture, Long> {
    List<Prefecture> findByRegionIdOrderByNameAsc(Long regionId);
}
