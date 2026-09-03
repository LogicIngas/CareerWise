package za.ac.cput.Controller;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import za.ac.cput.Service.INotificationService;
import za.ac.cput.Service.impl.JobSeekerServiceImpl;
import za.ac.cput.domain.JobSeeker;
import za.ac.cput.domain.Notification;
import za.ac.cput.factory.JobSeekerFactory;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class NotificationControllerTest {

    @LocalServerPort
    private int port;

    private String BASE_URL;

    private static Notification testNotification;
    private static String testUserId;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private JobSeekerServiceImpl jobSeekerService;

    @Autowired
    private INotificationService notificationService;

    @BeforeEach
    void setUp() {
        BASE_URL = "http://localhost:" + port + "/api/notifications/";
    }

    @Test
    @Order(1)
    void getForUser() {
        JobSeeker jobSeeker = jobSeekerService.create(JobSeekerFactory.createJobSeeker(
                "test@gmail.com", "password123",
                "Notif", "Tester",
                null, "0855556666",
                "Cape Town",
                "Developer",
                "Test user for notifications"
        ));
        assertNotNull(jobSeeker);
        testUserId = jobSeeker.getUserId();

        testNotification = notificationService.create(
                testUserId,
                "NEW_JOB",
                "New job available",
                "Backend Developer has just been posted.",
                null
        );
        assertNotNull(testNotification);

        notificationService.create(
                testUserId,
                "APPLICATION_STATUS",
                "Application updated",
                "Your application was updated to Reviewed.",
                null
        );

        String url = BASE_URL + "user/" + testUserId;
        ResponseEntity<Notification[]> response = restTemplate.getForEntity(url, Notification[].class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().length >= 2);

        System.out.println("Found " + response.getBody().length + " notifications for user");
    }

    @Test
    @Order(2)
    void markAsRead() {
        assertNotNull(testNotification);

        String url = BASE_URL + testNotification.getNotificationId() + "/read";
        ResponseEntity<Notification> response = restTemplate.exchange(
                url,
                org.springframework.http.HttpMethod.PUT,
                null,
                Notification.class
        );

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isRead());

        System.out.println("Marked notification as read: " + response.getBody().getTitle());
    }

    @Test
    @Order(3)
    void markAllAsRead() {
        assertNotNull(testUserId);

        String url = BASE_URL + "user/" + testUserId + "/read-all";
        ResponseEntity<Integer> response = restTemplate.exchange(
                url,
                org.springframework.http.HttpMethod.PUT,
                null,
                Integer.class
        );

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        System.out.println("Marked " + response.getBody() + " notifications as read");
    }
}
