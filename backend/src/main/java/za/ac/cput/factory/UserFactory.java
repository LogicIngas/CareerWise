package za.ac.cput.factory;

import za.ac.cput.domain.User;
import za.ac.cput.util.Helper;

/**
 * UserFactory - Creates User instances
 * Uses Lombok's @Builder pattern
 */
public class UserFactory {

    /**
     * Create a User with required fields
     * @param userId Unique user ID
     * @param email User email
     * @param password User password
     * @return User instance
     */
    public static User createUser(String userId, String email, String password) {
        if (Helper.isNullOrEmpty(userId) ||
                !Helper.isValidEmail(email) ||
                Helper.isNullOrEmpty(password)) {
            return null;
        }

        return User.builder()
                .userId(userId)
                .email(email)
                .password(password)
                .build();
    }

    /**
     * Create a complete User with all fields
     */
    public static User createUser(String userId, String email, String password,
                                  String firstName, String lastName, String phoneNumber,
                                  String location) {
        if (Helper.isNullOrEmpty(userId) || !Helper.isValidEmail(email)) {
            return null;
        }

        return User.builder()
                .userId(userId)
                .email(email)
                .password(password)
                .firstName(firstName)
                .lastName(lastName)
                .phoneNumber(phoneNumber)
                .location(location)
                .build();
    }
}