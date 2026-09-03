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
import za.ac.cput.Service.INotificationService;
import za.ac.cput.Service.impl.JobSeekerServiceImpl;
import za.ac.cput.domain.Experience;
import za.ac.cput.domain.JobSeeker;
import za.ac.cput.factory.ExperienceFactory;
import za.ac.cput.factory.JobSeekerFactory;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ExperienceControllerTest {

    @LocalServerPort
    private int port;

    private String BASE_URL;

    private static Experience testExperience;
    private static JobSeeker testJobSeeker;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private JobSeekerServiceImpl jobSeekerService;

    @BeforeEach
    void setUp() {
        BASE_URL = "http://localhost:" + port + "/api/experiences/";
    }

    @Test
    @Order(1)
    void create() {
        testJobSeeker = jobSeekerService.create(JobSeekerFactory.createJobSeeker(
                "test@gmail.com", "password123",
                "Exp", "Tester",
                null, "0833334444",
                "Cape Town",
                "Software Developer",
                "Experienced developer"
        ));
        assertNotNull(testJobSeeker);

        testExperience = ExperienceFactory.createExperience(
                null,
                "Software Developer",
                "TechCorp",
                "Cape Town",
                LocalDate.of(2022, 1, 15),
                LocalDate.of(2024, 6, 30),
                "Developed and maintained web applications"
        );
        assertNotNull(testExperience);
        testExperience.setJobSeeker(testJobSeeker);

        String url = BASE_URL + "create";
        ResponseEntity<Experience> response = restTemplate.postForEntity(url, testExperience, Experience.class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        testExperience = response.getBody();
        System.out.println("Created Experience with ID: " + testExperience.getExperienceId());
    }

    @Test
    @Order(2)
    void read() {
        assertNotNull(testExperience);

        String url = BASE_URL + "read/" + testExperience.getExperienceId();
        ResponseEntity<Experience> response = restTemplate.getForEntity(url, Experience.class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        System.out.println("Retrieved Experience: " + response.getBody().getJobTitle() + " at " + response.getBody().getCompany());
    }

    @Test
    @Order(3)
    void update() {
        assertNotNull(testExperience);

        Experience updated = Experience.builder()
                .experienceId(testExperience.getExperienceId())
                .jobTitle("Senior Software Developer")
                .company(testExperience.getCompany())
                .location(testExperience.getLocation())
                .startDate(testExperience.getStartDate())
                .endDate(testExperience.getEndDate())
                .description("Updated: Led a team of 5 developers")
                .build();

        String url = BASE_URL + "update";
        HttpEntity<Experience> requestEntity = new HttpEntity<>(updated);
        ResponseEntity<Experience> response = restTemplate.exchange(
                url,
                HttpMethod.PUT,
                requestEntity,
                Experience.class
        );

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Senior Software Developer", response.getBody().getJobTitle());

        testExperience = response.getBody();
        System.out.println("Updated Experience title: " + testExperience.getJobTitle());
    }

    @Test
    @Order(4)
    void getAll() {
        String url = BASE_URL + "getAll";
        ResponseEntity<Experience[]> response = restTemplate.getForEntity(url, Experience[].class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        System.out.println("Found " + response.getBody().length + " Experience records");
    }

    @Test
    @Order(5)
    void findByCompany() {
        String url = BASE_URL + "findByCompany?company=TechCorp";
        ResponseEntity<Experience[]> response = restTemplate.getForEntity(url, Experience[].class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        System.out.println("Found " + response.getBody().length + " experiences at TechCorp");
    }

    @Test
    @Order(6)
    @Disabled
    void delete() {
        assertNotNull(testExperience);

        String url = BASE_URL + "delete/" + testExperience.getExperienceId();
        ResponseEntity<Boolean> response = restTemplate.exchange(url, HttpMethod.DELETE, null, Boolean.class);

        assertNotNull(response);
        assertTrue(response.getStatusCode().is2xxSuccessful());
        System.out.println("Deleted Experience with ID: " + testExperience.getExperienceId());
    }
}
