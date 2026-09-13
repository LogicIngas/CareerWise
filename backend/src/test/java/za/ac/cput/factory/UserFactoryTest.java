package za.ac.cput.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.domain.User;

import static org.junit.jupiter.api.Assertions.*;

class UserFactoryTest {

    @Test
    void createUser() {

        User user = UserFactory.createUser(
                "9904165076082",
                "masingehanyanit@mail.com",
                "Hanyani16",
                "Hanyani",
                "Masinge",
                "profilepicture.jpg",
                "0839659906"
        );

        assertNotNull(user);
}

    @Test
    void createUserEmptyEmail() {
        User user = UserFactory.createUser(
                "9904165076082",
                "",
                "Hanyani16",
                "Hanyani",
                "Masinge",
                "profilepicture.jpg",
                "0839659906"
        );

        assertNull(user);
}

}