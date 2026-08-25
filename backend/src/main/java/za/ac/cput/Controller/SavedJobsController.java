package za.ac.cput.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.Service.ISavedJobsService;
import za.ac.cput.domain.SavedJobs;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({ "/api/saved-jobs", "/api/savedjobs" })
@CrossOrigin(origins = "*")
public class SavedJobsController {

    private final ISavedJobsService savedJobsService;

    @Autowired
    public SavedJobsController(ISavedJobsService savedJobsService) {
        this.savedJobsService = savedJobsService;
    }

    @PostMapping("/save")
    public ResponseEntity<SavedJobs> saveJob(@RequestBody(required = false) Map<String, String> body,
            @RequestParam(required = false) String jobSeekerId,
            @RequestParam(required = false) String jobId) {
        String jsId = (body != null && body.containsKey("jobSeekerId")) ? body.get("jobSeekerId") : jobSeekerId;
        String jId = (body != null && body.containsKey("jobId")) ? body.get("jobId")
                : jobId;

        if (jsId == null || jId == null) {
            return ResponseEntity.badRequest().build();
        }

        SavedJobs saved = this.savedJobsService.saveJob(jsId, jId);
        if (saved == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/unsave")
    public boolean unsaveJob(@RequestBody(required = false) Map<String, String> body,
            @RequestParam(required = false) String jobSeekerId,
            @RequestParam(required = false) String jobId) {
        String jsId = (body != null && body.containsKey("jobSeekerId")) ? body.get("jobSeekerId") : jobSeekerId;
        String jId = (body != null && body.containsKey("jobId")) ? body.get("jobId")
                : jobId;

        if (jsId == null || jId == null) {
            return false;
        }

        return this.savedJobsService.unsaveJob(jsId, jId);
    }

    @GetMapping("/jobseeker/{jobSeekerId}")
    public List<SavedJobs> getSavedJobs(@PathVariable String jobSeekerId) {
        return this.savedJobsService.getSavedJobs(jobSeekerId);
    }

    @GetMapping("/getSavedJobs/{jobSeekerId}")
    public List<SavedJobs> getSavedJobsByPath(@PathVariable String jobSeekerId) {
        return this.savedJobsService.getSavedJobs(jobSeekerId);
    }

    @GetMapping("/is-saved")
    public boolean isJobSaved(@RequestParam String jobSeekerId, @RequestParam String jobId) {
        return this.savedJobsService.isJobSaved(jobSeekerId, jobId);
    }

    @DeleteMapping("/delete/{id}")
    public boolean delete(@PathVariable String id) {
        return this.savedJobsService.delete(id);
    }

    @GetMapping("/getAll")
    public List<SavedJobs> getAll() {
        return this.savedJobsService.getAll();
    }
}
