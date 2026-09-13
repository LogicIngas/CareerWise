package za.ac.cput.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.domain.Education;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class EducationFactoryTest {

    @Test
    void createEducation() {
        Education education = EducationFactory.createEducation(
                "ED001",
                "CPUT",
                "ICT: Application Development",
                "Computer Science",
                LocalDate.of(2023, 2, 25),  // startDate
                LocalDate.of(2027, 10, 25),  // endDate
                "ICT: Application Development - Computer Science"  // description
        );

        assertNotNull(education);
}

    @Test
    void createEducationFails() {
        Education education = EducationFactory.createEducation(
                "",
                "CPUT",
                "ICT: Application Development",
                "Computer Science",
                LocalDate.of(2024, 1, 25),
                LocalDate.of(2026, 1, 25),
                "ICT: Application Development - Computer Science"
        );

        assertNull(education);
}
}