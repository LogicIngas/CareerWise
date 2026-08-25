package za.ac.cput.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.Service.IApplicationsService;
import za.ac.cput.domain.JobApplication;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/applications", "/api/job-applications"})
@CrossOrigin(origins = "*")
public class JobApplicationController {

    private final IApplicationsService applicationService;

    @Autowired
    public JobApplicationController(IApplicationsService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/apply")
    public ResponseEntity<JobApplication> apply(@RequestBody Map<String, String> payload) {
        String jobSeekerId = payload.get("jobSeekerId");
        String jobId = payload.get("jobId");
        String notes = payload.getOrDefault("notes", "");

        if (jobSeekerId == null || jobId == null) {
            return ResponseEntity.badRequest().build();
        }

        JobApplication application = this.applicationService.apply(jobSeekerId, jobId, notes);
        if (application == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(application);
    }

    @GetMapping("/jobseeker/{jobSeekerId}")
    public List<JobApplication> getApplications(@PathVariable String jobSeekerId) {
        return this.applicationService.getApplications(jobSeekerId);
    }

    @GetMapping("/getApplications/{jobSeekerId}")
    public List<JobApplication> getApplicationsAlt(@PathVariable String jobSeekerId) {
        return this.applicationService.getApplications(jobSeekerId);
    }

    @GetMapping("/job/{jobId}")
    public List<JobApplication> getJobApplications(@PathVariable String jobId) {
        return this.applicationService.getJobApplications(jobId);
    }

    @GetMapping("/read/{id}")
    public ResponseEntity<JobApplication> read(@PathVariable String id) {
        JobApplication application = this.applicationService.read(id);
        if (application == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(application);
    }

    @PutMapping("/update-status")
    public ResponseEntity<JobApplication> updateStatus(@RequestBody Map<String, String> payload) {
        String applicationId = payload.get("applicationId");
        String status = payload.get("status");

        if (applicationId == null || status == null) {
            return ResponseEntity.badRequest().build();
        }

        JobApplication updated = this.applicationService.updateStatus(applicationId, status);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public boolean delete(@PathVariable String id) {
        return this.applicationService.delete(id);
    }

    @GetMapping("/getAll")
    public List<JobApplication> getAll() {
        return this.applicationService.getAll();
    }
}
