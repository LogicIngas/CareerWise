package za.ac.cput.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.domain.JobSeeker;

import static org.junit.jupiter.api.Assertions.*;

class JobSeekerFactoryTest {

    @Test
    void createJobSeeker() {
        JobSeeker jobSeeker = JobSeekerFactory.createJobSeeker(
                "test@mycput.ac.za",
                "password123",
                "Inga",
                "Mbobo",
                "0123456789",
                "Cape Town",
                "Java Software Engineer",
                "Passionate backend developer with 5 years of experience"
        );

        assertNotNull(jobSeeker);
        System.out.println(jobSeeker);
    }

    @Test
    void createJobSeekerInvalidEmail() {
        JobSeeker jobSeeker = JobSeekerFactory.createJobSeeker(
                "invalidEmail",
                "password123",
                "Inga",
                "Mbobo",
                null,
                null,
                "Java Software Engineer",
                "Passionate backend developer with 5 years of experience"
        );

        assertNull(jobSeeker); //is null? yes so pass the test
        System.out.println("Failed as expected");
    }

}