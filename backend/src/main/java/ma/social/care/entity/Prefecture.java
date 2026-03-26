package ma.social.care.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "prefectures")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prefecture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id", nullable = false)
    private Region region;

    @OneToMany(mappedBy = "prefecture", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Commune> communes = new ArrayList<>();
}
