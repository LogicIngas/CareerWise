package za.ac.cput.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Message.java - Message Entity
 * Standalone entity for messaging between users
 */
@Entity
// @Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message { // A job seeker can leave a message in the frontend it will be cover letter
                       // cover letter

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String messageId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;

    @Column(name = "read_status")
    private Boolean readStatus = false;

    @PrePersist
    public void prePersist() {
        this.timestamp = LocalDateTime.now();
    }
}