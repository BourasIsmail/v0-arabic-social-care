package ma.social.care.dto.statistics;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegionStatsDTO {
    private Long regionId;
    private String regionName;
    private long count;
    private long capacity;
    private long beneficiaries;
}
