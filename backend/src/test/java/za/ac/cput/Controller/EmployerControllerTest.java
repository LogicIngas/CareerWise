package za.ac.cput.Controller;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import za.ac.cput.domain.Employer;
import za.ac.cput.factory.EmployerFactory;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class EmployerControllerTest {

    @LocalServerPort
    private int port;

    private String BASE_URL;

    private static Employer employer;

    @Autowired
    private TestRestTemplate restTemplate;

    @BeforeEach
    void setUp() {
        BASE_URL = "http://localhost:" + port + "/api/employers/";
    }

    @Test
    @Order(1)
    void createEmployer() {
        employer = EmployerFactory.createEmployer(
                "masinaa55@gmail.com", "123masina",
                "Pamela", "Masina",
                "CPUT", "Information Technology");
        assertNotNull(employer);
        assertNull(employer.getUserId());

        String url = BASE_URL + "create";
        ResponseEntity<Employer> response = restTemplate.postForEntity(url, employer, Employer.class);

        assertNotNull(response.getBody());
        employer = response.getBody();
        assertNotNull(employer.getUserId());
        System.out.println("Created employer with ID: " + employer.getUserId());
    }

    @Test
    @Order(2)
    void readEmployer() {
        assertNotNull(employer);

        String url = BASE_URL + "read/" + employer.getUserId();
        ResponseEntity<Employer> response = restTemplate.getForEntity(url, Employer.class);

        assertNotNull(response.getBody());
        System.out.println("Retrieved employer: " + response.getBody().getCompanyName());
    }

    @Test
    @Order(3)
    void updateEmployer() {
        assertNotNull(employer);

        Employer updatedEmployer = Employer.builder()
                .userId(employer.getUserId())
                .email(employer.getEmail())
                .password(employer.getPassword())
                .firstName(employer.getFirstName())
                .lastName(employer.getLastName())
                .companyName("CPUT Updated")
                .industry(employer.getIndustry())
                .build();

        String url = BASE_URL + "update";
        HttpEntity<Employer> requestEntity = new HttpEntity<>(updatedEmployer);
        ResponseEntity<Employer> response = restTemplate.exchange(
                url,
                HttpMethod.PUT,
                requestEntity,
                Employer.class
        );

        assertNotNull(response.getBody());
        employer = response.getBody();
        System.out.println("Updated employer: " + employer.getCompanyName());
    }

    @Test
    @Order(4)
    void getAllEmployers() {
        String url = BASE_URL + "getAll";
        ResponseEntity<Employer[]> response = restTemplate.getForEntity(url, Employer[].class);

        assertNotNull(response.getBody());
        System.out.println("Found " + response.getBody().length + " employers");
    }

    @Test
    @Order(5)
    @Disabled
    void deleteEmployer() {
        assertNotNull(employer);

        String url = BASE_URL + "delete/" + employer.getUserId();
        restTemplate.delete(url);

        String readUrl = BASE_URL + "read/" + employer.getUserId();
        ResponseEntity<Employer> getResponse = restTemplate.getForEntity(readUrl, Employer.class);

        assertNull(getResponse.getBody());
        System.out.println("Deleted employer with ID: " + employer.getUserId());
    }
}