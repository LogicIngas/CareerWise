package za.ac.cput.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.Service.INotificationService;
import za.ac.cput.domain.Notification;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final INotificationService notificationService;

    @Autowired
    public NotificationController(INotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/user/{userId}")
    public List<Notification> getForUser(@PathVariable String userId) {
        return notificationService.getForUser(userId);
    }

    @PutMapping("/{id}/read")
    public Notification markAsRead(@PathVariable String id) {
        return notificationService.markAsRead(id);
    }

    @PutMapping("/user/{userId}/read-all")
    public int markAllAsRead(@PathVariable String userId) {
        return notificationService.markAllAsRead(userId);
    }
}
