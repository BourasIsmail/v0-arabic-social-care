package ma.social.care.dto;

import lombok.*;
import ma.social.care.entity.enums.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstitutionSummaryDTO {

    private Long id;
    private InstitutionType institutionType;
    private String associationName;
    private String institutionName;
    private String region;
    private String commune;
    private Milieu milieu;
    private LegalStatus legalStatus;
    private Integer totalCapacity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
