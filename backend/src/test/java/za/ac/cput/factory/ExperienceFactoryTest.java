package za.ac.cput.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.domain.Experience;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class ExperienceFactoryTest {

    @Test
    void createExperience() {
        Experience experience = ExperienceFactory.createExperience(
                "EXP001",
                "Software Developer",
                "Google",
                "Cape Town",
                LocalDate.of(2020, 1, 1),  // startDate
                LocalDate.of(2022, 12, 31),  // endDate
                "Developed Java applications"  // description
        );

        assertNotNull(experience);
}

    @Test
    void createExperienceFails() {
        Experience experience = ExperienceFactory.createExperience(
                "",
                "Software Developer",
                "Google",
                "Cape Town",
                LocalDate.of(2020, 1, 1),
                LocalDate.of(2022, 12, 31),
                "Developed Java applications"
        );

        assertNull(experience); //
}

}