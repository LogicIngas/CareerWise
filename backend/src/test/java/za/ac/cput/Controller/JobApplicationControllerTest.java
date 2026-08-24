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
import za.ac.cput.domain.JobApplication;
import za.ac.cput.domain.Job;
import za.ac.cput.domain.JobSeeker;
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
class JobApplicationControllerTest {

    @LocalServerPort
    private int port;

    private String BASE_URL;

    private static JobApplication testApplication;
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
        BASE_URL = "http://localhost:" + port + "/api/applications/";
    }

    @Test
    @Order(1)
    void apply() {
        // Create supporting entities via their services
        var employer = employerService.create(EmployerFactory.createEmployer(
                "apptest.employer@gmail.com", "password123",
                "Test", "Employer",
                "TestCorp", "Technology"
        ));
        assertNotNull(employer);

        var jobEntity = JobFactory.createJob(
                "QA Engineer",
                "Test software quality",
                List.of("2 years QA experience", "Selenium"),
                List.of("Write test cases", "Automate regression tests"),
                "Cape Town",
                false,
                "40 000 - 55 000",
                "Permanent",
                LocalDate.of(2026, 12, 31)
        );
        jobEntity.setEmployer(employer);

        ResponseEntity<Job> jobResponse = restTemplate.postForEntity(
                "http://localhost:" + port + "/api/jobs/create", jobEntity, Job.class);
        assertNotNull(jobResponse.getBody());
        testJob = jobResponse.getBody();

        testJobSeeker = jobSeekerService.create(JobSeekerFactory.createJobSeeker(
                "apptest.seeker@gmail.com", "password123",
                "App", "Seeker",
                null, "0811112222",
                "Johannesburg",
                "QA Tester",
                "Passionate about quality"
        ));
        assertNotNull(testJobSeeker);

        // Apply via controller
        Map<String, String> payload = Map.of(
                "jobSeekerId", testJobSeeker.getUserId(),
                "jobId", testJob.getJobId(),
                "notes", "I am very interested in this role."
        );

        String url = BASE_URL + "apply";
        ResponseEntity<JobApplication> response = restTemplate.postForEntity(url, payload, JobApplication.class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        testApplication = response.getBody();
        System.out.println("Created JobApplication with ID: " + testApplication.getApplicationId());
    }

    @Test
    @Order(2)
    void read() {
        assertNotNull(testApplication);

        String url = BASE_URL + "read/" + testApplication.getApplicationId();
        ResponseEntity<JobApplication> response = restTemplate.getForEntity(url, JobApplication.class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        System.out.println("Retrieved application with status: " + response.getBody().getStatus());
    }

    @Test
    @Order(3)
    void getApplicationsByJobSeeker() {
        assertNotNull(testJobSeeker);

        String url = BASE_URL + "jobseeker/" + testJobSeeker.getUserId();
        ResponseEntity<JobApplication[]> response = restTemplate.getForEntity(url, JobApplication[].class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().length > 0);

        System.out.println("Found " + response.getBody().length + " applications for job seeker");
    }

    @Test
    @Order(4)
    void getJobApplications() {
        assertNotNull(testJob);

        String url = BASE_URL + "job/" + testJob.getJobId();
        ResponseEntity<JobApplication[]> response = restTemplate.getForEntity(url, JobApplication[].class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        System.out.println("Found " + response.getBody().length + " applications for job ID: " + testJob.getJobId());
    }

    @Test
    @Order(5)
    void updateStatus() {
        assertNotNull(testApplication);

        Map<String, String> payload = Map.of(
                "applicationId", testApplication.getApplicationId(),
                "status", "Reviewed"
        );

        String url = BASE_URL + "update-status";
        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(payload);
        ResponseEntity<JobApplication> response = restTemplate.exchange(
                url,
                HttpMethod.PUT,
                requestEntity,
                JobApplication.class
        );

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Reviewed", response.getBody().getStatus());

        testApplication = response.getBody();
        System.out.println("Updated application status to: " + testApplication.getStatus());
    }

    @Test
    @Order(6)
    void getAll() {
        String url = BASE_URL + "getAll";
        ResponseEntity<JobApplication[]> response = restTemplate.getForEntity(url, JobApplication[].class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        System.out.println("Found " + response.getBody().length + " total job applications");
    }

    @Test
    @Order(7)
    @Disabled
    void delete() {
        assertNotNull(testApplication);

        String url = BASE_URL + "delete/" + testApplication.getApplicationId();
        ResponseEntity<Boolean> response = restTemplate.exchange(url, HttpMethod.DELETE, null, Boolean.class);

        assertNotNull(response);
        assertTrue(response.getStatusCode().is2xxSuccessful());
        System.out.println("Deleted application with ID: " + testApplication.getApplicationId());
    }
}
