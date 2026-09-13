package za.ac.cput.Service;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.domain.User;
import za.ac.cput.factory.JobSeekerFactory;
// import za.ac.cput.repository.UserRepo;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class UserServiceTest {

    @Autowired
    private UserService userService;

    // @Autowired
    // private UserRepo userRepo;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = JobSeekerFactory.createJobSeeker(
                "userservice.test@gmail.com",
                "myPass123",
                "User",
                "Service",
                "0844445555",
                "Cape Town",
                "Developer",
                "Testing User Service");
    }

    @Test
    @Order(1)
    void signUp() throws Exception {
        User savedUser = userService.signUp(testUser);
        assertNotNull(savedUser);
        assertNotNull(savedUser.getUserId());
}

    @Test
    @Order(2)
    void signUpThrowsExceptionForDuplicateEmail() {
        assertDoesNotThrow(() -> userService.signUp(testUser));

        Exception exception = assertThrows(Exception.class, () -> userService.signUp(testUser));
        assertEquals("email already exists", exception.getMessage());
}

    @Test
    @Order(3)
    void login() throws Exception {
        userService.signUp(testUser);

        User loggedIn = userService.login(testUser.getEmail(), testUser.getPassword());
        assertNotNull(loggedIn);
        assertEquals(testUser.getEmail(), loggedIn.getEmail());
}

    @Test
    @Order(4)
    void loginThrowsExceptionForInvalidPassword() {
        assertDoesNotThrow(() -> userService.signUp(testUser));

        Exception exception = assertThrows(Exception.class,
                () -> userService.login(testUser.getEmail(), "wrongPassword"));
        assertEquals("Invalid password", exception.getMessage());
}

    @Test
    @Order(5)
    void changePassword() throws Exception {
        User savedUser = userService.signUp(testUser);
        assertNotNull(savedUser);

        boolean changed = userService.changePassword(savedUser.getUserId(), "myPass123", "newPass456");
        assertTrue(changed);

        User loggedIn = userService.login(savedUser.getEmail(), "newPass456");
        assertNotNull(loggedIn);
}
}
