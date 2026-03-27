package ma.social.care.dto.statistics;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrefectureStatsDTO {
    private Long prefectureId;
    private String prefectureName;
    private long count;
    private long capacity;
    private long beneficiaries;
}
