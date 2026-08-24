package za.ac.cput.Service.impl;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.domain.Job;
import za.ac.cput.domain.JobApplication;
import za.ac.cput.domain.JobSeeker;
import za.ac.cput.factory.EmployerFactory;
import za.ac.cput.factory.JobFactory;
import za.ac.cput.factory.JobSeekerFactory;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class ApplicationsServiceImplTest {

    @Autowired
    private ApplicationsServiceImpl applicationsService;

    @Autowired
    private EmployerServiceImpl employerService;

    @Autowired
    private JobServiceImpl jobService;

    @Autowired
    private JobSeekerServiceImpl jobSeekerService;

    private Job testJob;
    private JobSeeker testJobSeeker;
    private JobApplication testApplication;

    @BeforeEach
    void setUp() {
        var employer = employerService.create(EmployerFactory.createEmployer(
                "app.svc@gmail.com", "password", "Svc", "Employer", "AppSvcCorp", "IT"
        ));

        var jobEntity = JobFactory.createJob(
                "Svc Engineer", "Desc", List.of("Skill"), List.of("Resp"),
                "Cape Town", true, "50k", "Perm", LocalDate.of(2026, 12, 31)
        );
        jobEntity.setEmployer(employer);
        testJob = jobService.create(jobEntity);

        testJobSeeker = jobSeekerService.create(JobSeekerFactory.createJobSeeker(
                "app.svc.seeker@gmail.com", "password", "Svc", "Seeker",
                null, "0811223344", "Cape Town", "Dev", "Summary"
        ));
    }

    @Test
    @Order(1)
    void apply() {
        JobApplication applied = applicationsService.apply(testJobSeeker.getUserId(), testJob.getJobId(), "My application notes");
        assertNotNull(applied);
        assertEquals("Applied", applied.getStatus());
        System.out.println("Applied successfully with ID: " + applied.getApplicationId());
        testApplication = applied;
    }

    @Test
    @Order(2)
    void read() {
        JobApplication applied = applicationsService.apply(testJobSeeker.getUserId(), testJob.getJobId(), "Notes");
        assertNotNull(applied);

        JobApplication read = applicationsService.read(applied.getApplicationId());
        assertNotNull(read);
        assertEquals(applied.getApplicationId(), read.getApplicationId());
        System.out.println("Read application with status: " + read.getStatus());
    }

    @Test
    @Order(3)
    void getApplications() {
        applicationsService.apply(testJobSeeker.getUserId(), testJob.getJobId(), "Notes");

        List<JobApplication> apps = applicationsService.getApplications(testJobSeeker.getUserId());
        assertNotNull(apps);
        assertFalse(apps.isEmpty());
        System.out.println("Found " + apps.size() + " applications for job seeker");
    }

    @Test
    @Order(4)
    void getJobApplications() {
        applicationsService.apply(testJobSeeker.getUserId(), testJob.getJobId(), "Notes");

        List<JobApplication> apps = applicationsService.getJobApplications(testJob.getJobId());
        assertNotNull(apps);
        assertFalse(apps.isEmpty());
        System.out.println("Found " + apps.size() + " applications for job");
    }

    @Test
    @Order(5)
    void updateStatus() {
        JobApplication applied = applicationsService.apply(testJobSeeker.getUserId(), testJob.getJobId(), "Notes");
        assertNotNull(applied);

        JobApplication updated = applicationsService.updateStatus(applied.getApplicationId(), "Rejected");
        assertNotNull(updated);
        assertEquals("Rejected", updated.getStatus());
        System.out.println("Updated application status to: " + updated.getStatus());
    }

    @Test
    @Order(6)
    void delete() {
        JobApplication applied = applicationsService.apply(testJobSeeker.getUserId(), testJob.getJobId(), "Notes");
        assertNotNull(applied);

        boolean deleted = applicationsService.delete(applied.getApplicationId());
        assertTrue(deleted);
        System.out.println("Deleted application with ID: " + applied.getApplicationId());
    }

    @Test
    @Order(7)
    void getAll() {
        applicationsService.apply(testJobSeeker.getUserId(), testJob.getJobId(), "Notes");
        List<JobApplication> all = applicationsService.getAll();
        assertNotNull(all);
        assertFalse(all.isEmpty());
        System.out.println("Found " + all.size() + " total applications");
    }
}
