package za.ac.cput.Service;

import za.ac.cput.domain.Notification;

import java.util.List;

public interface INotificationService {
    Notification create(String userId, String type, String title, String message, String jobId);
    List<Notification> getForUser(String userId);
    Notification markAsRead(String notificationId);
    int markAllAsRead(String userId);
}
