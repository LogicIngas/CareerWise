package za.ac.cput.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.cput.domain.User;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUserId(String userId);

    boolean existsByEmail(String email);
}
