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
import za.ac.cput.domain.JobSeeker;
import za.ac.cput.factory.JobSeekerFactory;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class JobSeekerControllerTest {

    @LocalServerPort
    private int port;

    private String BASE_URL;

    private static JobSeeker testJobSeeker;

    @Autowired
    private TestRestTemplate restTemplate;

    @BeforeEach
    void setUp() {
        BASE_URL = "http://localhost:" + port + "/api/jobseekers/";
    }

    @Test
    @Order(1)
    void create() {
        testJobSeeker = JobSeekerFactory.createJobSeeker(
                "inga.dev@gmail.com",
                "securePassword123",
                "Inga",
                "Mbobo",
                "0712345678",
                "Cape Town",
                "Java Software Engineer",
                "Passionate backend developer with 5 years of experience"
        );

        assertNotNull(testJobSeeker);

        String url = BASE_URL + "create";
        ResponseEntity<JobSeeker> response = restTemplate.postForEntity(url, testJobSeeker, JobSeeker.class);

        assertNotNull(response.getBody());

        JobSeeker createdJobSeeker = response.getBody();
        testJobSeeker = createdJobSeeker;

        System.out.println("Created JobSeeker with ID: " + createdJobSeeker.getUserId());
    }

    @Test
    @Order(2)
    void read() {
        assertNotNull(testJobSeeker);

        String url = BASE_URL + "read/" + testJobSeeker.getUserId();
        ResponseEntity<JobSeeker> response = restTemplate.getForEntity(url, JobSeeker.class);

        assertNotNull(response.getBody());
        System.out.println("Retrieved JobSeeker: " + response.getBody().getFirstName());
    }

    @Test
    @Order(3)
    void update() {
        assertNotNull(testJobSeeker);

        // Using manual setters since @SuperBuilder doesn't have copy method
        JobSeeker updatedJobSeeker = new JobSeeker();
        updatedJobSeeker.setUserId(testJobSeeker.getUserId());
        updatedJobSeeker.setEmail(testJobSeeker.getEmail());
        updatedJobSeeker.setPassword(testJobSeeker.getPassword());
        updatedJobSeeker.setFirstName("Inga Updated");
        updatedJobSeeker.setLastName("Mbobo Updated");
        updatedJobSeeker.setHeadline("Senior Java Software Engineer");
        updatedJobSeeker.setSummary("Updated: Senior backend developer with 7 years of experience");
        updatedJobSeeker.setPhoneNumber(testJobSeeker.getPhoneNumber());
        updatedJobSeeker.setLocation(testJobSeeker.getLocation());

        String url = BASE_URL + "update";
        HttpEntity<JobSeeker> requestEntity = new HttpEntity<>(updatedJobSeeker);
        ResponseEntity<JobSeeker> response = restTemplate.exchange(
                url,
                HttpMethod.PUT,
                requestEntity,
                JobSeeker.class
        );

        assertNotNull(response.getBody());
        testJobSeeker = response.getBody();
        System.out.println("Updated JobSeeker: " + response.getBody().getFirstName());
    }

    @Test
    @Order(4)
    void getAll() {
        String url = BASE_URL + "getAll";
        ResponseEntity<JobSeeker[]> response = restTemplate.getForEntity(url, JobSeeker[].class);

        assertNotNull(response.getBody());
        System.out.println("Found " + response.getBody().length + " JobSeekers");
    }

    @Test
    @Order(5)
    @Disabled
    void delete() {
        assertNotNull(testJobSeeker);

        String url = BASE_URL + "delete/" + testJobSeeker.getUserId();
        ResponseEntity<Void> response = restTemplate.exchange(url, HttpMethod.DELETE, null, Void.class);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        System.out.println("Deleted JobSeeker with ID: " + testJobSeeker.getUserId());
    }
}