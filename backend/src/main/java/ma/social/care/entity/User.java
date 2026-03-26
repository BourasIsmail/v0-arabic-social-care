package ma.social.care.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import ma.social.care.entity.enums.Role;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class User extends BaseEntity {

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, columnDefinition = "VARCHAR(20)")
    @Builder.Default
    private Role role = Role.USER;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
}
