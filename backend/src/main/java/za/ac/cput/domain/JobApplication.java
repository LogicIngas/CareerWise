package za.ac.cput.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "job_seeker_id", "job_id" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String applicationId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_seeker_id", nullable = false)
    @JsonIgnoreProperties({ "skills", "experiences", "educations", "password", "hibernateLazyInitializer", "handler" })
    private JobSeeker jobSeeker;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id", nullable = false)
    @JsonIgnoreProperties({ "employer", "hibernateLazyInitializer", "handler" })
    private Job job;

    @Column(nullable = false)
    @Builder.Default
    private String status = "Applied"; // Applied, Under Review, Interview, Offer, Rejected

    @Column(name = "applied_date", nullable = false, updatable = false)
    private LocalDateTime appliedDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @PrePersist
    public void prePersist() {
        if (this.appliedDate == null) {
            this.appliedDate = LocalDateTime.now();
        }
        if (this.status == null || this.status.isBlank()) {
            this.status = "Applied";
        }
    }
}
