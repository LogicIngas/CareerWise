package za.ac.cput.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.Service.UserService;
import za.ac.cput.domain.User;

import java.util.Map;

@RestController
@RequestMapping({"/api/users", "/api/auth"})
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public User signUp(@RequestBody User user) throws Exception {
        return this.userService.signUp(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody Map<String, String> loginRequest) throws Exception {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        return this.userService.login(email, password);
    }

    @PostMapping("/change-password")
    public boolean changePassword(@RequestBody Map<String, String> payload) throws Exception {
        String userId = payload.get("userId");
        String oldPassword = payload.get("oldPassword");
        String newPassword = payload.get("newPassword");
        return this.userService.changePassword(userId, oldPassword, newPassword);
    }
}