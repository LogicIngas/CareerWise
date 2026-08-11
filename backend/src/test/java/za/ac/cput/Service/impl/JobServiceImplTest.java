package za.ac.cput.Service.impl;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import za.ac.cput.domain.Employer;
import za.ac.cput.domain.Job;
import za.ac.cput.domain.JobStatus;
import za.ac.cput.factory.EmployerFactory;
import za.ac.cput.factory.JobFactory;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class JobServiceImplTest {

    @Autowired
    private JobServiceImpl jobService;

    // Problem: Job.employer is a required column (not null), but JobFactory does not
    // set an employer. Saving this job with no employer breaks the database rule.
    // How to fix it: use EmployerServiceImpl to make a real Employer and attach it to the job
    // before it gets saved. See create() below.
    @Autowired
    private EmployerServiceImpl employerService;

    private static String generatedJobId;
    private static String generatedEmployerId;

    private static Job job = JobFactory.createJob("Software Developer",
            "Build clean code using Java and Springboot",
            List.of("2 years experience", "Spring Framework", "RESTful APIs: @RestController, HTTP methods, status codes"),
            List.of("Participate in code refactoring sessions", "Update dependencies and security patches", "Review and update documentation"),
            "Cape Town", false, "50 000 - 70 000", "Permanent",
            LocalDate.of(2026, 11, 25));


    @AfterAll
    static void cleanupAfterAll(@Autowired JobServiceImpl jobService, @Autowired EmployerServiceImpl employerService) {
        if (generatedJobId != null) {
            try {
                if (jobService.read(generatedJobId) != null) {
                    jobService.delete(generatedJobId);
                }
            } catch (Exception e) {
            }
        }
        if (generatedEmployerId != null) {
            try {
                employerService.delete(generatedEmployerId);
            } catch (Exception e) {
            }
        }
    }

    @Test
    @Order(1)
    void create() {
        // Make a real Employer first, then attach it to the job.
        // (the insert fails because employer_id can't be null.)
        Employer employer = employerService.create(EmployerFactory.createEmployer(
                "jobserviceimpltest@gmail.com", "password123",
                "Jane", "Doe",
                "CareerWise", "Information Technology"));
        assertNotNull(employer);
        generatedEmployerId = employer.getUserId();
        job.setEmployer(employer);

        Job created = jobService.create(job);
        assertNotNull(created);
        assertNotNull(created.getJobId());
        generatedJobId = created.getJobId();
        System.out.println("Created Job" + created);
    }

    @Test
    @Order(2)
    void read() {
        Job found = jobService.read(generatedJobId);
        assertNotNull(found);
        assertEquals(generatedJobId, found.getJobId());
        System.out.println("Read: " + found);
    }

    @Test
    @Order(3)
    void update() {
        // Problem: "new Job()" has no id and no location. JobServiceImpl.update() needs
        // an id to find the row, and saving a mostly-empty Job would wipe out required
        // columns like title and employer (they would be saved as null).
        // How to fix it: fetch the real job first, then change fields on it, so everything else
        // (id, employer, title, etc.) stays the same.
        Job current = jobService.read(generatedJobId);
        current.setTitle("Software Dev");
        current.setLocation("Durban");

        Job result = jobService.update(current);

        assertNotNull(result);
        assertEquals("Durban", result.getLocation());
        System.out.println("Updated: " + result);
    }

    @Test
    @Order(4)
    void getAll() {
        List<Job> jobs = jobService.getAll();
        assertNotNull(jobs);
        assertFalse(jobs.isEmpty());
        System.out.println("All jobs: " + jobs);
    }

    @Test
    @Order(5)
    void findOpenPositions() {
        List<Job> jobs = jobService.findOpenPositions();
        assertTrue(jobs.stream().allMatch(j -> j.getStatus() == JobStatus.OPEN));
    }

    @Test
    @Order(6)
    void findJobsByLocation() {
        List<Job> jobs = jobService.findJobsByLocation("Durban");
        assertNotNull(jobs);
        assertFalse(jobs.isEmpty());
        assertTrue(jobs.stream().allMatch(j -> j.getLocation().equals("Durban")));
        System.out.println("Found by location: " + jobs);
    }

    @Test
    @Order(7)
    void findJobsByEmploymentType() {
        List<Job> jobs = jobService.findJobsByEmploymentType("Permanent");
        assertNotNull(jobs);
        assertFalse(jobs.isEmpty());
        assertTrue(jobs.stream().allMatch(j -> j.getEmploymentType().equals("Permanent")));
        System.out.println("Found by Employment Type: " + jobs);
    }

    @Test
    @Order(8)
    void findJobsByRemoteOption() {
        List<Job> jobs = jobService.findJobsByRemoteOption(false);
        assertNotNull(jobs);
        assertFalse(jobs.isEmpty());
        assertTrue(jobs.stream().allMatch(j -> j.getRemoteOption().equals(false)));
        System.out.println("Found by Remote Option: " + jobs);
    }

    @Test
    @Order(9)
    void delete() {
        jobService.delete(generatedJobId);
        Job deleted = jobService.read(generatedJobId);
        assertNull(deleted);
    }
}