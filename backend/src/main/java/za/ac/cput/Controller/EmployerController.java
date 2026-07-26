package za.ac.cput.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.domain.Employer;
import za.ac.cput.Service.impl.EmployerServiceImpl;

import java.util.List;

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
    public Employer createEmployer(@RequestBody Employer employer) {
        return this.employerService.create(employer);
    }

    @GetMapping("/read/{id}")
    public Employer readEmployer(@PathVariable String id) {
        return this.employerService.read(id);
    }

    @GetMapping("/getAll")
    public List<Employer> getAllEmployers() {
        return this.employerService.findAll();
    }

    @PutMapping("/update")
    public Employer updateEmployer(@RequestBody Employer employer) {
        return this.employerService.update(employer);
    }

    @DeleteMapping("/delete/{id}")
    public Boolean deleteEmployer(@PathVariable String id) {
        return this.employerService.delete(id);
    }
}