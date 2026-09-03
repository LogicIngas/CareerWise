package za.ac.cput.Controller;

import org.springframework.beans.factory.annotation.Autowired;
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
    public JobApplication apply(@RequestBody Map<String, String> payload) {
        String jobSeekerId = payload.get("jobSeekerId");
        String jobId = payload.get("jobId");
        String notes = payload.getOrDefault("notes", "");
        return this.applicationService.apply(jobSeekerId, jobId, notes);
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
    public JobApplication read(@PathVariable String id) {
        return this.applicationService.read(id);
    }

    @PutMapping("/update-status")
    public JobApplication updateStatus(@RequestBody Map<String, String> payload) {
        String applicationId = payload.get("applicationId");
        String status = payload.get("status");
        return this.applicationService.updateStatus(applicationId, status);
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
