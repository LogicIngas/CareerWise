package za.ac.cput.Controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import za.ac.cput.Service.IJobSeekerService;
import za.ac.cput.domain.JobSeeker;

import java.io.IOException;
import java.util.List;

/**
 * REST controller that handles all HTTP requests related to JobSeeker profiles.
 * Base path: /api/jobseekers
 * Allows cross-origin requests from any origin (suitable for frontend integration).
 */
@RestController
@RequestMapping("/api/jobseekers")
@CrossOrigin(origins = "*")
public class JobSeekerController {

    // The service layer that contains all business logic for JobSeeker operations
    private final IJobSeekerService service;

    @Autowired
    public JobSeekerController(IJobSeekerService service) {
        this.service = service;
    }

    /**
     * POST /api/jobseekers/create
     * Creates a new JobSeeker profile from the request body and persists it.
     */
    @PostMapping("/create")
    public JobSeeker create(@RequestBody JobSeeker jobSeeker) {
        return this.service.create(jobSeeker);
    }

    /**
     * GET /api/jobseekers/read/{userId}
     * Retrieves a single JobSeeker profile by their unique user ID.
     */
    @GetMapping("/read/{userId}")
    public JobSeeker read(@PathVariable String userId) {
        return this.service.read(userId);
    }

    /**
     * PUT /api/jobseekers/update
     * Updates an existing JobSeeker profile using the full object in the request body.
     */
    @PutMapping("/update")
    public JobSeeker update(@RequestBody JobSeeker jobSeeker) {
        return this.service.updateProfile(jobSeeker);
    }

    /**
     * PUT /api/jobseekers/profile
     * Alternative endpoint for updating a JobSeeker's profile details.
     * Delegates to the same service method as /update.
     */
    @PutMapping("/profile")
    public JobSeeker updateProfile(@RequestBody JobSeeker jobSeeker) {
        return this.service.updateProfile(jobSeeker);
    }

    /**
     * DELETE /api/jobseekers/delete/{userId}
     * Deletes the JobSeeker profile associated with the given user ID.
     * Returns true if the deletion was successful, false otherwise.
     */
    @DeleteMapping("/delete/{userId}")
    public Boolean delete(@PathVariable String userId) {
        return this.service.delete(userId);
    }

    /**
     * GET /api/jobseekers/getAll
     * Returns a list of all registered JobSeeker profiles.
     */
    @GetMapping("/getAll")
    public List<JobSeeker> getAll() {
        return this.service.getAll();
    }

    /**
     * POST /api/jobseekers/{userId}/resume
     * Accepts a multipart file upload and stores it as the resume for the given user.
     * Returns the updated JobSeeker profile (which includes the resume filename/path).
     */
    @PostMapping(value = "/{userId}/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public JobSeeker uploadResume(@PathVariable String userId, @RequestParam("file") MultipartFile file) throws IOException {
        return this.service.uploadResume(userId, file);
    }

    /**
     * GET /api/jobseekers/{userId}/resume
     * Streams the stored resume file directly to the HTTP response.
     * The file is served inline (viewable in-browser) with the correct MIME type.
     */
    @GetMapping("/{userId}/resume")
    public void downloadResume(@PathVariable String userId, HttpServletResponse response) throws IOException {
        // Ask the service to locate and load the resume file as a Spring Resource
        Resource resource = this.service.loadResume(userId);

        // If no resume exists for this user, respond with a 404 Not Found
        if (resource == null) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        // Get the stored filename; fall back to "resume" if the resource has no name
        String filename = resource.getFilename() != null ? resource.getFilename() : "resume";

        // Files are stored prefixed with "{userId}_" (e.g. "abc123_MyCV.pdf").
        // Strip that prefix so the client sees the original filename (e.g. "MyCV.pdf")
        String displayName = filename.startsWith(userId + "_") ? filename.substring(userId.length() + 1) : filename;

        // Default to a generic binary content type; override based on file extension
        String contentType = "application/octet-stream";
        String lower = displayName.toLowerCase();
        if (lower.endsWith(".pdf")) {
            contentType = "application/pdf";
        } else if (lower.endsWith(".doc")) {
            contentType = "application/msword";
        } else if (lower.endsWith(".docx")) {
            contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        }

        // Set the response headers so the browser knows how to handle the file
        response.setContentType(contentType);
        // "inline" tells the browser to display the file rather than download it
        response.setHeader("Content-Disposition", "inline; filename=\"" + displayName + "\"");
        // Expose Content-Disposition to the frontend so it can read the filename (needed for CORS)
        response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

        // Stream the file bytes directly into the HTTP response output stream
        resource.getInputStream().transferTo(response.getOutputStream());
    }

    /**
     * DELETE /api/jobseekers/{userId}/resume
     * Deletes the resume file associated with the given user ID.
     * Returns true if the file was successfully deleted.
     */
    @DeleteMapping("/{userId}/resume")
    public boolean deleteResume(@PathVariable String userId) throws IOException {
        return this.service.deleteResume(userId);
    }

    /**
     * POST /api/jobseekers/{userId}/view
     * Records a profile view for the given JobSeeker.
     * Optionally accepts the viewing company's name as a query parameter.
     * Returns the updated JobSeeker with the incremented view count.
     */
    @PostMapping("/{userId}/view")
    public JobSeeker incrementProfileViews(@PathVariable String userId,
            @RequestParam(required = false) String viewerCompany) {
        return this.service.incrementProfileViews(userId, viewerCompany);
    }
}
