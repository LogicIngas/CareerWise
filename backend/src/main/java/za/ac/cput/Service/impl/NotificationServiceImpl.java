package za.ac.cput.Service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.Service.INotificationService;
import za.ac.cput.domain.Notification;
import za.ac.cput.repository.INotificationRepository;

import java.util.List;

@Service
public class NotificationServiceImpl implements INotificationService {

    private final INotificationRepository repository;

    @Autowired
    public NotificationServiceImpl(INotificationRepository repository) {
        this.repository = repository;
    }

    @Override
    public Notification create(String userId, String type, String title, String message) {
        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .message(message)
                .build();
        return repository.save(notification);
    }

    @Override
    public List<Notification> getForUser(String userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public Notification markAsRead(String notificationId) {
        Notification notification = repository.findById(notificationId).orElse(null);
        if (notification == null) {
            return null;
        }
        notification.setRead(true);
        return repository.save(notification);
    }

    @Override
    public int markAllAsRead(String userId) {
        List<Notification> notifications = repository.findByUserIdOrderByCreatedAtDesc(userId);
        int count = 0;
        for (Notification n : notifications) {
            if (!n.isRead()) {
                n.setRead(true);
                count++;
            }
        }
        repository.saveAll(notifications);
        return count;
    }
}
