package ma.social.care.controller;

import lombok.RequiredArgsConstructor;
import ma.social.care.dto.CommuneDTO;
import ma.social.care.dto.PrefectureDTO;
import ma.social.care.dto.RegionDTO;
import ma.social.care.service.GeoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GeoController {

    private final GeoService geoService;

    @GetMapping("/regions")
    public ResponseEntity<List<RegionDTO>> getAllRegions() {
        return ResponseEntity.ok(geoService.getAllRegions());
    }

    @GetMapping("/regions/{regionId}/prefectures")
    public ResponseEntity<List<PrefectureDTO>> getPrefecturesByRegion(@PathVariable Long regionId) {
        return ResponseEntity.ok(geoService.getPrefecturesByRegion(regionId));
    }

    @GetMapping("/prefectures/{prefectureId}/communes")
    public ResponseEntity<List<CommuneDTO>> getCommunesByPrefecture(@PathVariable Long prefectureId) {
        return ResponseEntity.ok(geoService.getCommunesByPrefecture(prefectureId));
    }
}
