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
    public ResponseEntity<Job> read(@PathVariable String id) {
        Job job = this.jobService.read(id);
        if (job == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(job);
    }

    @PutMapping("/update")
    public ResponseEntity<Job> update(@RequestBody Job job) {
        Job updated = this.jobService.update(job);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
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
    public List<Job> findJobsByRemoteOption(@RequestParam boolean remoteOption) {
        return this.jobService.findJobsByRemoteOption(remoteOption);
    }

    @GetMapping("/recommended/{jobSeekerId}")
    public List<Job> findRecommended(@PathVariable String jobSeekerId,
            @RequestParam(defaultValue = "6") int limit) {
        return this.jobService.findRecommendedForJobSeeker(jobSeekerId, limit);
    }

    @GetMapping("/search")
    public List<Job> search(@RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String employmentType,
            @RequestParam(required = false) Boolean remoteOption) {
        return this.jobService.searchJobs(keyword, location, employmentType, remoteOption);
    }
}