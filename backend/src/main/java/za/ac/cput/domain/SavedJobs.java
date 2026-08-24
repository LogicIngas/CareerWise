package za.ac.cput.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "saved_jobs", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "job_seeker_id", "job_id" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedJobs {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String savedJobId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_seeker_id", nullable = false)
    @JsonIgnoreProperties({ "skills", "experiences", "educations", "password",
            "hibernateLazyInitializer", "handler" })
    private JobSeeker jobSeeker;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id", nullable = false)
    @JsonIgnoreProperties({ "employer", "hibernateLazyInitializer", "handler" })
    private Job job;

    @Column(name = "saved_at", nullable = false, updatable = false)
    private LocalDateTime savedAt;

    @PrePersist
    public void prePersist() {
        if (this.savedAt == null) {
            this.savedAt = LocalDateTime.now();
        }
    }
}
