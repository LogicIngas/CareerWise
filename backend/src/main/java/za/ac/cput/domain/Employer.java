package za.ac.cput.domain;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "employer")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder // Use @SuperBuilder
@EqualsAndHashCode(callSuper = true, exclude = "postedJobs")
@ToString(callSuper = true, exclude = "postedJobs")
public class Employer extends User {

    private String companyName;
    private String companyWebsite;
    private String companySize;
    private String industry;
    private String companyLogo;
    private String companyDescription;
    private String companyHeadquarters;

    @OneToMany(mappedBy = "employer", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Job> postedJobs = new ArrayList<>();
}