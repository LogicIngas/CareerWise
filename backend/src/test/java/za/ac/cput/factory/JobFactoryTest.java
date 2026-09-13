package za.ac.cput.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.domain.Job;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JobFactoryTest {

    @Test
    void createJob() {
        Job job = JobFactory.createJob(
                "Software Developer",
                "Build clean code using Java and Springboot",
                List.of("2 years experience", "Spring Framework", "RESTful APIs"), //A job includes/compose a list of experiance
                List.of("Participate in code refactoring", "Update dependencies"),
                "Cape Town",
                false,
                "50 000 - 70 000",
                "Permanent",
                LocalDate.of(2026, 11, 25)
        );

        assertNotNull(job);
}

    @Test
    void createJobFails() {
        Job job = JobFactory.createJob(
                "",
                "Build clean code using Java",
                List.of("2 years experience"),
                List.of("Participate in code refactoring"),
                "Cape Town",
                false,
                "50 000 - 70 000",
                "Permanent",
                LocalDate.of(2026, 11, 25)
        );

        assertNull(job);
}
}