package ma.social.care.service;

import ma.social.care.dto.CommuneDTO;
import ma.social.care.dto.PrefectureDTO;
import ma.social.care.dto.RegionDTO;

import java.util.List;

public interface GeoService {
    List<RegionDTO> getAllRegions();
    List<PrefectureDTO> getPrefecturesByRegion(Long regionId);
    List<CommuneDTO> getCommunesByPrefecture(Long prefectureId);
}
