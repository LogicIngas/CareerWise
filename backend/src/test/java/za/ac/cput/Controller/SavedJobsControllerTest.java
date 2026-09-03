package za.ac.cput.Controller;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import za.ac.cput.domain.Job;
import za.ac.cput.domain.JobSeeker;
import za.ac.cput.domain.SavedJobs;
import za.ac.cput.factory.EmployerFactory;
import za.ac.cput.factory.JobFactory;
import za.ac.cput.factory.JobSeekerFactory;
import za.ac.cput.Service.impl.EmployerServiceImpl;
import za.ac.cput.Service.impl.JobSeekerServiceImpl;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class SavedJobsControllerTest {

    @LocalServerPort
    private int port;

    private String BASE_URL;

    private static SavedJobs testSavedJob;
    private static JobSeeker testJobSeeker;
    private static Job testJob;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private EmployerServiceImpl employerService;

    @Autowired
    private JobSeekerServiceImpl jobSeekerService;

    @BeforeEach
    void setUp() {
        BASE_URL = "http://localhost:" + port + "/api/saved-jobs/";
    }

    @Test
    @Order(1)
    void saveJob() {
        var employer = employerService.create(EmployerFactory.createEmployer(
                "savedjob.test@gmail.com", "password123",
                "Save", "Employer",
                "SaveCorp", "Finance"
        ));
        assertNotNull(employer);

        var jobEntity = JobFactory.createJob(
                "Financial Analyst",
                "Analyze finance data",
                List.of("Excel", "SQL"),
                List.of("Reports"),
                "Cape Town",
                true,
                "50 000",
                "Contract",
                LocalDate.of(2026, 12, 31)
        );
        jobEntity.setEmployer(employer);

        ResponseEntity<Job> jobResponse = restTemplate.postForEntity(
                "http://localhost:" + port + "/api/jobs/create", jobEntity, Job.class);
        assertNotNull(jobResponse.getBody());
        testJob = jobResponse.getBody();

        testJobSeeker = jobSeekerService.create(JobSeekerFactory.createJobSeeker(
                "savedjob.seeker@gmail.com", "password123",
                "Saver", "Seeker",
                null, "0822223333",
                "Johannesburg",
                "Analyst",
                "Loves saving jobs"
        ));
        assertNotNull(testJobSeeker);

        Map<String, String> payload = Map.of(
                "jobSeekerId", testJobSeeker.getUserId(),
                "jobId", testJob.getJobId()
        );

        String url = BASE_URL + "save";
        ResponseEntity<SavedJobs> response = restTemplate.postForEntity(url, payload, SavedJobs.class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        testSavedJob = response.getBody();
        System.out.println("Saved Job with ID: " + testSavedJob.getSavedJobId());
    }

    @Test
    @Order(2)
    void isJobSaved() {
        assertNotNull(testJobSeeker);
        assertNotNull(testJob);

        String url = BASE_URL + "is-saved?jobSeekerId=" + testJobSeeker.getUserId() + "&jobId=" + testJob.getJobId();
        ResponseEntity<Boolean> response = restTemplate.getForEntity(url, Boolean.class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody());
        System.out.println("Job is saved: " + response.getBody());
    }

    @Test
    @Order(3)
    void getSavedJobs() {
        assertNotNull(testJobSeeker);

        String url = BASE_URL + "jobseeker/" + testJobSeeker.getUserId();
        ResponseEntity<SavedJobs[]> response = restTemplate.getForEntity(url, SavedJobs[].class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().length > 0);
        System.out.println("Found " + response.getBody().length + " saved jobs for job seeker");
    }

    @Test
    @Order(4)
    void getAll() {
        String url = BASE_URL + "getAll";
        ResponseEntity<SavedJobs[]> response = restTemplate.getForEntity(url, SavedJobs[].class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        System.out.println("Found " + response.getBody().length + " total saved jobs");
    }

    @Test
    @Order(5)
    void unsaveJob() {
        assertNotNull(testJobSeeker);
        assertNotNull(testJob);

        Map<String, String> payload = Map.of(
                "jobSeekerId", testJobSeeker.getUserId(),
                "jobId", testJob.getJobId()
        );

        String url = BASE_URL + "unsave";
        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(payload);
        ResponseEntity<Boolean> response = restTemplate.exchange(url, HttpMethod.DELETE, requestEntity, Boolean.class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody());
        System.out.println("Unsaved job successfully.");
    }
}
