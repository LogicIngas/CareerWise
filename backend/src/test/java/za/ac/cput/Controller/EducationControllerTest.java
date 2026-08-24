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
import za.ac.cput.domain.Education;
import za.ac.cput.factory.EducationFactory;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class EducationControllerTest {

    @LocalServerPort
    private int port;

    private String BASE_URL;

    private static Education testEducation;

    @Autowired
    private TestRestTemplate restTemplate;

    @BeforeEach
    void setUp() {
        BASE_URL = "http://localhost:" + port + "/api/educations/";
    }

    @Test
    @Order(1)
    void create() {
        testEducation = EducationFactory.createEducation(
                UUID.randomUUID().toString(),
                "Cape Peninsula University of Technology",
                "Bachelor of Technology",
                "Information Technology",
                LocalDate.of(2020, 2, 1),
                LocalDate.of(2024, 11, 30),
                "Focused on software development and databases"
        );

        assertNotNull(testEducation);

        String url = BASE_URL + "create";
        ResponseEntity<Education> response = restTemplate.postForEntity(url, testEducation, Education.class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        testEducation = response.getBody();
        System.out.println("Created Education with ID: " + testEducation.getEducationId());
    }

    @Test
    @Order(2)
    void read() {
        assertNotNull(testEducation);

        String url = BASE_URL + "read/" + testEducation.getEducationId();
        ResponseEntity<Education> response = restTemplate.getForEntity(url, Education.class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        System.out.println("Retrieved Education: " + response.getBody().getDegree() + " at " + response.getBody().getInstitution());
    }

    @Test
    @Order(3)
    void update() {
        assertNotNull(testEducation);

        Education updated = Education.builder()
                .educationId(testEducation.getEducationId())
                .institution(testEducation.getInstitution())
                .degree("Bachelor of Science")
                .fieldOfStudy("Computer Science")
                .startDate(testEducation.getStartDate())
                .endDate(testEducation.getEndDate())
                .description("Updated description: Computer Science focus")
                .build();

        String url = BASE_URL + "update";
        HttpEntity<Education> requestEntity = new HttpEntity<>(updated);
        ResponseEntity<Education> response = restTemplate.exchange(
                url,
                HttpMethod.PUT,
                requestEntity,
                Education.class
        );

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Bachelor of Science", response.getBody().getDegree());

        testEducation = response.getBody();
        System.out.println("Updated Education degree: " + testEducation.getDegree());
    }

    @Test
    @Order(4)
    void getAll() {
        String url = BASE_URL + "getAll";
        ResponseEntity<Education[]> response = restTemplate.getForEntity(url, Education[].class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        System.out.println("Found " + response.getBody().length + " Education records");
    }

    @Test
    @Order(5)
    void findByInstitution() {
        String url = BASE_URL + "findByInstitution?institution=Cape Peninsula University of Technology";
        ResponseEntity<Education[]> response = restTemplate.getForEntity(url, Education[].class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        System.out.println("Found " + response.getBody().length + " educations at CPUT");
    }

    @Test
    @Order(6)
    void findByDegree() {
        String url = BASE_URL + "findByDegree?degree=Bachelor of Science";
        ResponseEntity<Education[]> response = restTemplate.getForEntity(url, Education[].class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        System.out.println("Found " + response.getBody().length + " Bachelor of Science degrees");
    }

    @Test
    @Order(7)
    @Disabled
    void delete() {
        assertNotNull(testEducation);

        String url = BASE_URL + "delete/" + testEducation.getEducationId();
        ResponseEntity<Boolean> response = restTemplate.exchange(url, HttpMethod.DELETE, null, Boolean.class);

        assertNotNull(response);
        assertTrue(response.getStatusCode().is2xxSuccessful());
        System.out.println("Deleted Education with ID: " + testEducation.getEducationId());
    }
}
