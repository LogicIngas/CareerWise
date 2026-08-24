package za.ac.cput.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import za.ac.cput.Service.IJobSeekerService;
import za.ac.cput.domain.JobSeeker;

import java.io.IOException;
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

    @PostMapping(value = "/{userId}/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public JobSeeker uploadResume(@PathVariable String userId, @RequestParam("file") MultipartFile file) throws IOException {
        return this.service.uploadResume(userId, file);
    }

    @GetMapping("/{userId}/resume")
    public ResponseEntity<Resource> downloadResume(@PathVariable String userId) {
        Resource resource = this.service.loadResume(userId);
        if (resource == null) {
            return ResponseEntity.notFound().build();
        }
        String filename = resource.getFilename() != null ? resource.getFilename() : "resume";
        String displayName = filename.startsWith(userId + "_") ? filename.substring(userId.length() + 1) : filename;

        // Determine MIME type from extension so PDF opens inline in browser
        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        String lower = displayName.toLowerCase();
        if (lower.endsWith(".pdf")) {
            mediaType = MediaType.APPLICATION_PDF;
        } else if (lower.endsWith(".doc")) {
            mediaType = MediaType.parseMediaType("application/msword");
        } else if (lower.endsWith(".docx")) {
            mediaType = MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + displayName + "\"")
                .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                .contentType(mediaType)
                .body(resource);
    }

    @DeleteMapping("/{userId}/resume")
    public boolean deleteResume(@PathVariable String userId) throws IOException {
        return this.service.deleteResume(userId);
    }

    @PostMapping("/{userId}/view")
    public JobSeeker incrementProfileViews(@PathVariable String userId) {
        return this.service.incrementProfileViews(userId);
    }
}