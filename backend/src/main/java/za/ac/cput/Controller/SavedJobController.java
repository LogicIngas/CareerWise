package za.ac.cput.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.Service.ISavedJobService;
import za.ac.cput.domain.SavedJob;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/savedjob-legacy")
@CrossOrigin(origins = "*")
public class SavedJobController {

    private final ISavedJobService savedJobService;

    @Autowired
    public SavedJobController(ISavedJobService savedJobService) {
        this.savedJobService = savedJobService;
    }

    @PostMapping("/save")
    public SavedJob saveJob(@RequestBody(required = false) Map<String, String> body,
                            @RequestParam(required = false) String jobSeekerId,
                            @RequestParam(required = false) String jobId) {
        String jsId = (body != null && body.containsKey("jobSeekerId")) ? body.get("jobSeekerId") : jobSeekerId;
        String jId = (body != null && body.containsKey("jobId")) ? body.get("jobId") : jobId;

        if (jsId == null || jId == null) {
            return null;
        }

        return this.savedJobService.saveJob(jsId, jId);
    }

    @DeleteMapping("/unsave")
    public boolean unsaveJob(@RequestBody(required = false) Map<String, String> body,
                             @RequestParam(required = false) String jobSeekerId,
                             @RequestParam(required = false) String jobId) {
        String jsId = (body != null && body.containsKey("jobSeekerId")) ? body.get("jobSeekerId") : jobSeekerId;
        String jId = (body != null && body.containsKey("jobId")) ? body.get("jobId") : jobId;

        if (jsId == null || jId == null) {
            return false;
        }

        return this.savedJobService.unsaveJob(jsId, jId);
    }

    @GetMapping("/jobseeker/{jobSeekerId}")
    public List<SavedJob> getSavedJobsByJobSeeker(@PathVariable String jobSeekerId) {
        return this.savedJobService.getSavedJobsByJobSeeker(jobSeekerId);
    }

    @GetMapping("/is-saved")
    public boolean isJobSaved(@RequestParam String jobSeekerId, @RequestParam String jobId) {
        return this.savedJobService.isJobSaved(jobSeekerId, jobId);
    }

    @DeleteMapping("/delete/{id}")
    public boolean delete(@PathVariable String id) {
        return this.savedJobService.delete(id);
    }

    @GetMapping("/getAll")
    public List<SavedJob> getAll() {
        return this.savedJobService.getAll();
    }
}
