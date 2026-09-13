package za.ac.cput.Service.impl;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.domain.Job;
import za.ac.cput.domain.JobSeeker;
import za.ac.cput.domain.SavedJobs;
import za.ac.cput.factory.EmployerFactory;
import za.ac.cput.factory.JobFactory;
import za.ac.cput.factory.JobSeekerFactory;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class SavedJobsServiceImplTest {

    @Autowired
    private SavedJobsServiceImpl savedJobsService;

    @Autowired
    private EmployerServiceImpl employerService;

    @Autowired
    private JobServiceImpl jobService;

    @Autowired
    private JobSeekerServiceImpl jobSeekerService;

    private Job testJob;
    private JobSeeker testJobSeeker;

    @BeforeEach
    void setUp() {
        var employer = employerService.create(EmployerFactory.createEmployer(
                "saved.svc@gmail.com", "password", "Saved", "Employer", "SavedCorp", "Finance"
        ));

        var jobEntity = JobFactory.createJob(
                "Finance Analyst", "Desc", List.of("Skill"), List.of("Resp"),
                "Cape Town", true, "50k", "Perm", LocalDate.of(2026, 12, 31)
        );
        jobEntity.setEmployer(employer);
        testJob = jobService.create(jobEntity);

        testJobSeeker = jobSeekerService.create(JobSeekerFactory.createJobSeeker(
                "saved.svc.seeker@gmail.com", "password", "Saved", "Seeker",
                "0811223344", "Cape Town", "Analyst", "Summary"
        ));
    }

    @Test
    @Order(1)
    void saveJob() {
        SavedJobs savedJob = savedJobsService.saveJob(testJobSeeker.getUserId(), testJob.getJobId());
        assertNotNull(savedJob);
        assertNotNull(savedJob.getSavedJobId());
}

    @Test
    @Order(2)
    void isJobSaved() {
        savedJobsService.saveJob(testJobSeeker.getUserId(), testJob.getJobId());

        boolean isSaved = savedJobsService.isJobSaved(testJobSeeker.getUserId(), testJob.getJobId());
        assertTrue(isSaved);
}

    @Test
    @Order(3)
    void getSavedJobs() {
        savedJobsService.saveJob(testJobSeeker.getUserId(), testJob.getJobId());

        List<SavedJobs> savedJobs = savedJobsService.getSavedJobs(testJobSeeker.getUserId());
        assertNotNull(savedJobs);
        assertFalse(savedJobs.isEmpty());
}

    @Test
    @Order(4)
    void unsaveJob() {
        savedJobsService.saveJob(testJobSeeker.getUserId(), testJob.getJobId());

        boolean unsaved = savedJobsService.unsaveJob(testJobSeeker.getUserId(), testJob.getJobId());
        assertTrue(unsaved);
boolean isSaved = savedJobsService.isJobSaved(testJobSeeker.getUserId(), testJob.getJobId());
        assertFalse(isSaved);
    }

    @Test
    @Order(5)
    void getAll() {
        savedJobsService.saveJob(testJobSeeker.getUserId(), testJob.getJobId());

        List<SavedJobs> all = savedJobsService.getAll();
        assertNotNull(all);
        assertFalse(all.isEmpty());
}

    @Test
    @Order(6)
    void delete() {
        SavedJobs savedJob = savedJobsService.saveJob(testJobSeeker.getUserId(), testJob.getJobId());
        assertNotNull(savedJob);

        boolean deleted = savedJobsService.delete(savedJob.getSavedJobId());
        assertTrue(deleted);
}
}
