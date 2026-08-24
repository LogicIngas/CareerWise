package za.ac.cput.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Experience.java - Work Experience Entity
 * ManyToOne relationship with JobSeeker
 */
@Entity
// @Table(name = "experiences")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(exclude = "jobSeeker")
@ToString(exclude = "jobSeeker")
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String experienceId;

    @Column(nullable = false)
    private String jobTitle;

    @Column(nullable = false)
    private String company;

    private String location;
    private LocalDate startDate;
    private LocalDate endDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Many Experiences : One JobSeeker
     * Foreign key: job_seeker_id
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_seeker_id", nullable = true)
    private JobSeeker jobSeeker;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}