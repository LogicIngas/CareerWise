package za.ac.cput.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.Service.IJobService;
import za.ac.cput.domain.Job;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    private final IJobService jobService;

    @Autowired
    public JobController(IJobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping("/create")
    public Job create(@RequestBody Job job) {
         return this.jobService.create(job);
    }

    @GetMapping("/read/{id}")
    public Job read(@PathVariable String id) {
        return this.jobService.read(id);
    }

    @PutMapping("/update")
    public Job update(@RequestBody Job job) {
        return this.jobService.update(job);
    }

    @DeleteMapping("/delete/{id}")
    public boolean delete(@PathVariable String id) {
        return this.jobService.delete(id);
    }

    @GetMapping("/getAll")
    public List<Job> getAll() {
        return this.jobService.getAll();
    }

    @GetMapping("/findOpenPositions")
    public List<Job> findOpenPositions() {
        return this.jobService.findOpenPositions();
    }

    @GetMapping("/findByLocation")
    public List<Job> findJobsByLocation(@RequestParam String location) {
        return this.jobService.findJobsByLocation(location);
    }

    @GetMapping("/findByEmploymentType")
    public List<Job> findJobsByEmploymentType(@RequestParam String employmentType) {
        return this.jobService.findJobsByEmploymentType(employmentType);
    }

    @GetMapping("/findByRemoteOption")
    public List<Job> findJobsByRemoteOption(@RequestParam Boolean remoteOption) {
        return this.jobService.findJobsByRemoteOption(remoteOption);
    }
}