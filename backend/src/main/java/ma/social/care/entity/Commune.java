package ma.social.care.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "communes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Commune {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prefecture_id", nullable = false)
    private Prefecture prefecture;
}
