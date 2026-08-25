package za.ac.cput.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.domain.Employer;
import za.ac.cput.Service.impl.EmployerServiceImpl;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employers")
@CrossOrigin(origins = "*")
public class EmployerController {

    private final EmployerServiceImpl employerService;

    @Autowired
    public EmployerController(EmployerServiceImpl employerService) {
        this.employerService = employerService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createEmployer(@RequestBody Employer employer) {
        Employer created = this.employerService.create(employer);
        if (created == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "An account with this email already exists."));
        }
        return ResponseEntity.ok(created);
    }

    @GetMapping("/read/{id}")
    public ResponseEntity<Employer> readEmployer(@PathVariable String id) {
        Employer employer = this.employerService.read(id);
        if (employer == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(employer);
    }

    @GetMapping("/getAll")
    public List<Employer> getAllEmployers() {
        return this.employerService.findAll();
    }

    @PutMapping("/update")
    public ResponseEntity<Employer> updateEmployer(@RequestBody Employer employer) {
        Employer updated = this.employerService.update(employer);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deleteEmployer(@PathVariable String id) {
        return ResponseEntity.ok(this.employerService.delete(id));
    }
}
