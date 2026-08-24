package za.ac.cput.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
// @Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(exclude = { "requirements", "responsibilities", "employer" })
@ToString(exclude = { "requirements", "responsibilities", "employer" })
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String jobId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "job_requirements", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "requirement")
    @Builder.Default
    private List<String> requirements = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "job_responsibilities", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "responsibility")
    @Builder.Default
    private List<String> responsibilities = new ArrayList<>();

    private String location;

    @Column(name = "remote_option")
    @Builder.Default
    private Boolean remoteOption = false;

    @Column(name = "salary_range")
    private String salaryRange;

    @Column(name = "employment_type")
    private String employmentType;

    @Column(name = "deadline_date")
    private LocalDate deadlineDate;

    // Job <-> Employer is a bidirectional relationship, so serializing a Job walks
    // into
    // Employer.postedJobs and back into Job, looping forever (StackOverflowError).
    // The lazy
    // proxy also breaks Jackson with its extra Hibernate fields. How i fixed it:
    // ignore those fields on
    // Job.employer only, so Employer's own JSON output is unaffected.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id", nullable = false)
    @JsonIgnoreProperties({ "postedJobs", "hibernateLazyInitializer", "handler" })
    private Employer employer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private JobStatus status = JobStatus.OPEN; // cane be OPEN, CLOSED, FILLED, ARCHIVED

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Runs: Before an entity is saved for the first time (INSERT)
    // Purpose: Set initial values like createdAt and updatedAt
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Runs: Before an entity is updated (UPDATE)
    // Purpose: Update timestamp fields like updatedAt
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
