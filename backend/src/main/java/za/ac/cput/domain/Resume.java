package za.ac.cput.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
// @Table(name = "resumes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(exclude = "jobSeeker")
@ToString(exclude = "jobSeeker")
public class Resume {

    // Original file name as uploaded by the user
    // Stored file name on disk: {userId}_{fileName}
    // MIME type: application/pdf, application/msword, etc.
    // File size in bytes

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String resumeId;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false, unique = true)
    private String storedName;

    @Column(nullable = false)
    private String contentType;

    private long fileSize;

    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_seeker_id", nullable = false, unique = true)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private JobSeeker jobSeeker;

    @PrePersist
    public void prePersist() {
        if (this.uploadedAt == null) {
            this.uploadedAt = LocalDateTime.now();
        }
    }
}
