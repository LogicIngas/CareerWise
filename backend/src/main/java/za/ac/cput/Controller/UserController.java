package za.ac.cput.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.Service.UserService;
import za.ac.cput.domain.User;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
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
}