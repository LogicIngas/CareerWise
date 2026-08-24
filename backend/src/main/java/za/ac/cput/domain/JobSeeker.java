package za.ac.cput.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.ArrayList;
import java.util.List;

@Entity
// @Table(name = "job_seekers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true, exclude = { "skills", "experiences", "educations", "resume" })
@ToString(callSuper = true, exclude = { "skills", "experiences", "educations", "resume" })
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class JobSeeker extends User {

    private String headline;
    private String summary;

    @OneToOne(mappedBy = "jobSeeker", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({ "jobSeeker", "hibernateLazyInitializer", "handler" })
    private Resume resume;

    @Builder.Default
    private int profileViews = 0;

    @OneToMany(mappedBy = "jobSeeker", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<Skill> skills = new ArrayList<>();

    @OneToMany(mappedBy = "jobSeeker", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Experience> experiences = new ArrayList<>();

    @OneToMany(mappedBy = "jobSeeker", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<Education> educations = new ArrayList<>();
}