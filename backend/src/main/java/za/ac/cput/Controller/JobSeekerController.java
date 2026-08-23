package za.ac.cput.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.Service.IJobSeekerService;
import za.ac.cput.domain.JobSeeker;

import java.util.List;

@RestController
@RequestMapping("/api/jobseekers")
@CrossOrigin(origins = "*")
public class JobSeekerController {

    private final IJobSeekerService service;

    @Autowired
    public JobSeekerController(IJobSeekerService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public JobSeeker create(@RequestBody JobSeeker jobSeeker) {
        return this.service.create(jobSeeker);
    }

    @GetMapping("/read/{userId}")
    public JobSeeker read(@PathVariable String userId) {
        return this.service.read(userId);
    }

    @PutMapping("/update")
    public JobSeeker update(@RequestBody JobSeeker jobSeeker) {
        return this.service.updateProfile(jobSeeker);
    }

    // NEW: PUT /api/jobseekers/profile
    @PutMapping("/profile")
    public JobSeeker updateProfile(@RequestBody JobSeeker jobSeeker) {
        return this.service.updateProfile(jobSeeker);
    }

    @DeleteMapping("/delete/{userId}")
    public Boolean delete(@PathVariable String userId) {
        return this.service.delete(userId);
    }

    @GetMapping("/getAll")
    public List<JobSeeker> getAll() {
        return this.service.getAll();
    }
}