package za.ac.cput.Controller;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import za.ac.cput.domain.JobSeeker;
import za.ac.cput.domain.User;
import za.ac.cput.factory.JobSeekerFactory;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class UserControllerTest {

    @LocalServerPort
    private int port;

    private String BASE_URL;

    private static User testUser;

    @Autowired
    private TestRestTemplate restTemplate;

    @BeforeEach
    void setUp() {
        BASE_URL = "http://localhost:" + port + "/api/users/";
    }

    @Test
    @Order(1)
    void signUp() {
        JobSeeker jobSeeker = JobSeekerFactory.createJobSeeker(
                "user.signup@gmail.com",
                "myPass123",
                "User",
                "Test",
                null,
                "0844445555",
                "Cape Town",
                "Developer",
                "Test summary"
        );

        String url = BASE_URL + "signup";
        ResponseEntity<User> response = restTemplate.postForEntity(url, jobSeeker, User.class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        
        testUser = response.getBody();
        System.out.println("Signed up user with ID: " + testUser.getUserId());
    }

    @Test
    @Order(2)
    void login() {
        assertNotNull(testUser);

        Map<String, String> payload = Map.of(
                "email", "user.signup@gmail.com",
                "password", "myPass123"
        );

        String url = BASE_URL + "login";
        ResponseEntity<User> response = restTemplate.postForEntity(url, payload, User.class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("user.signup@gmail.com", response.getBody().getEmail());
        
        System.out.println("Logged in user successfully");
    }

    @Test
    @Order(3)
    void changePassword() {
        assertNotNull(testUser);

        Map<String, String> payload = Map.of(
                "userId", testUser.getUserId(),
                "oldPassword", "myPass123",
                "newPassword", "newPass456"
        );

        String url = BASE_URL + "change-password";
        ResponseEntity<Boolean> response = restTemplate.postForEntity(url, payload, Boolean.class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody());
        
        System.out.println("Password changed successfully");
    }
}
