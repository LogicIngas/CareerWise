package za.ac.cput.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "skills")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(exclude = "jobSeeker")
@ToString(exclude = "jobSeeker")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String skillId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    @Builder.Default
    private String category = "Technical";

    @Builder.Default
    private int yearsOfExperience = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_seeker_id", nullable = true)
    @JsonIgnoreProperties({"skills", "educations", "experiences", "password", "hibernateLazyInitializer", "handler"})
    private JobSeeker jobSeeker;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.category == null || this.category.isBlank()) {
            this.category = "Technical";
        }
    }
}