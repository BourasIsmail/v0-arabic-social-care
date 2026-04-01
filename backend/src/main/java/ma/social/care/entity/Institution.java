package ma.social.care.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import ma.social.care.entity.enums.*;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "institutions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@SQLRestriction("is_deleted = false")
public class Institution extends BaseEntity {

    // === Institution Info ===
    @Enumerated(EnumType.STRING)
    @Column(name = "institution_type", nullable = false)
    private InstitutionType institutionType;

    @Column(name = "association_name", nullable = false)
    private String associationName;

    @Column(name = "institution_name", nullable = false)
    private String institutionName;

    @Column(name = "address")
    private String address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id")
    private Region region;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prefecture_id")
    private Prefecture prefecture;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commune_id")
    private Commune commune;

    @Enumerated(EnumType.STRING)
    @Column(name = "milieu")
    private Milieu milieu;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "creation_year")
    private Integer creationYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "legal_status")
    private LegalStatus legalStatus;

    @Column(name = "unlicensed_reason")
    private String unlicensedReason;

    @Column(name = "license_number")
    private String licenseNumber;

    @Column(name = "service_start_date")
    private LocalDate serviceStartDate;

    // Services (booleans)
    @Column(name = "service_housing")
    private Boolean housing;

    @Column(name = "service_meals")
    private Boolean meals;

    @Column(name = "service_educational_support")
    private Boolean educationalSupport;

    @Column(name = "service_cultural_activities")
    private Boolean culturalActivities;

    @Column(name = "service_health_care")
    private Boolean healthCare;

    @Column(name = "service_insurance")
    private Boolean insurance;

    @Column(name = "service_psychological_support")
    private Boolean psychologicalSupport;

    // Capacity
    @Column(name = "total_capacity")
    private Integer totalCapacity;

    @Column(name = "male_capacity")
    private Integer maleCapacity;

    @Column(name = "female_capacity")
    private Integer femaleCapacity;

    // Target Levels
    @Column(name = "target_primary")
    private Boolean primary;

    @Column(name = "target_middle_school")
    private Boolean middleSchool;

    @Column(name = "target_high_school")
    private Boolean highSchool;

    @Column(name = "target_other")
    private Boolean other;

    @Column(name = "target_other_detail")
    private String otherDetail;

    // Distance
    @Enumerated(EnumType.STRING)
    @Column(name = "distance_to_school")
    private Distance distanceToSchool;

    @Enumerated(EnumType.STRING)
    @Column(name = "distance_to_national_boarding_school")
    private Distance distanceToNationalBoardingSchool;

    // === Relationships ===
    @OneToOne(mappedBy = "institution", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Building building;

    @OneToOne(mappedBy = "institution", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Financing financing;

    @OneToOne(mappedBy = "institution", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Targeting targeting;

    @OneToOne(mappedBy = "institution", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private HousingMeals housingMeals;

    @OneToMany(mappedBy = "institution", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<StaffMember> staffMembers = new ArrayList<>();

    // Signed PDF URL
    @Column(name = "signed_pdf_url")
    private String signedPdfUrl;

    // === Soft Delete ===
    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // === Helper methods for bidirectional relationships ===
    public void setBuilding(Building building) {
        this.building = building;
        if (building != null) {
            building.setInstitution(this);
        }
    }

    public void setFinancing(Financing financing) {
        this.financing = financing;
        if (financing != null) {
            financing.setInstitution(this);
        }
    }

    public void setTargeting(Targeting targeting) {
        this.targeting = targeting;
        if (targeting != null) {
            targeting.setInstitution(this);
        }
    }

    public void setHousingMeals(HousingMeals housingMeals) {
        this.housingMeals = housingMeals;
        if (housingMeals != null) {
            housingMeals.setInstitution(this);
        }
    }

    public void addStaffMember(StaffMember staffMember) {
        staffMembers.add(staffMember);
        staffMember.setInstitution(this);
    }

    public void removeStaffMember(StaffMember staffMember) {
        staffMembers.remove(staffMember);
        staffMember.setInstitution(null);
    }

    public void clearStaffMembers() {
        staffMembers.forEach(s -> s.setInstitution(null));
        staffMembers.clear();
    }
}
