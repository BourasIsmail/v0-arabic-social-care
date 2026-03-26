package ma.social.care.service.impl;

import lombok.RequiredArgsConstructor;
import ma.social.care.dto.CommuneDTO;
import ma.social.care.dto.PrefectureDTO;
import ma.social.care.dto.RegionDTO;
import ma.social.care.repository.CommuneRepository;
import ma.social.care.repository.PrefectureRepository;
import ma.social.care.repository.RegionRepository;
import ma.social.care.service.GeoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GeoServiceImpl implements GeoService {

    private final RegionRepository regionRepository;
    private final PrefectureRepository prefectureRepository;
    private final CommuneRepository communeRepository;

    @Override
    public List<RegionDTO> getAllRegions() {
        return regionRepository.findAllByOrderByNameAsc().stream()
                .map(region -> RegionDTO.builder()
                        .id(region.getId())
                        .name(region.getName())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<PrefectureDTO> getPrefecturesByRegion(Long regionId) {
        return prefectureRepository.findByRegionIdOrderByNameAsc(regionId).stream()
                .map(prefecture -> PrefectureDTO.builder()
                        .id(prefecture.getId())
                        .name(prefecture.getName())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<CommuneDTO> getCommunesByPrefecture(Long prefectureId) {
        return communeRepository.findByPrefectureIdOrderByNameAsc(prefectureId).stream()
                .map(commune -> CommuneDTO.builder()
                        .id(commune.getId())
                        .name(commune.getName())
                        .build())
                .collect(Collectors.toList());
    }
}
