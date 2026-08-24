package za.ac.cput.Service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import za.ac.cput.Service.IJobSeekerService;
import za.ac.cput.domain.Education;
import za.ac.cput.domain.JobSeeker;
import za.ac.cput.domain.Resume;
import za.ac.cput.domain.Skill;
import za.ac.cput.factory.ResumeFactory;
import za.ac.cput.repository.IJobSeekerRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;

@Service
public class JobSeekerServiceImpl implements IJobSeekerService {

    private static final Path RESUME_DIR = Paths.get("uploads", "resumes");
    private static final Set<String> ALLOWED_RESUME_EXTENSIONS = Set.of("pdf", "doc", "docx");

    private final IJobSeekerRepository repository;

    @Autowired
    public JobSeekerServiceImpl(IJobSeekerRepository repository) {
        this.repository = repository;
    }

    @Override
    public JobSeeker create(JobSeeker jobSeeker) {
        if (jobSeeker.getEmail() != null &&
                !repository.existsByEmail(jobSeeker.getEmail())) {
            return repository.save(jobSeeker);
        }
        return null;
    }

    @Override
    public JobSeeker read(String id) {
        return repository.findByUserId(id).orElse(null);
    }

    @Override
    public JobSeeker update(JobSeeker jobSeeker) {
        if (jobSeeker.getUserId() != null &&
                repository.existsById(jobSeeker.getUserId())) {
            return repository.save(jobSeeker);
        }
        return null;
    }

    // NEW: Update profile with phone, location, skills, and educations
    @Override
    @Transactional
    public JobSeeker updateProfile(JobSeeker jobSeeker) {
        if (jobSeeker == null || jobSeeker.getUserId() == null) {
            return null;
        }
        JobSeeker existing = repository.findById(jobSeeker.getUserId()).orElse(null);
        if (existing != null) {
            if (jobSeeker.getFirstName() != null)
                existing.setFirstName(jobSeeker.getFirstName());
            if (jobSeeker.getLastName() != null)
                existing.setLastName(jobSeeker.getLastName());
            if (jobSeeker.getEmail() != null && !jobSeeker.getEmail().equals(existing.getEmail())) {
                existing.setEmail(jobSeeker.getEmail());
            }
            if (jobSeeker.getPhoneNumber() != null)
                existing.setPhoneNumber(jobSeeker.getPhoneNumber());
            if (jobSeeker.getLocation() != null)
                existing.setLocation(jobSeeker.getLocation());
            if (jobSeeker.getHeadline() != null)
                existing.setHeadline(jobSeeker.getHeadline());
            if (jobSeeker.getSummary() != null)
                existing.setSummary(jobSeeker.getSummary());

            if (jobSeeker.getSkills() != null) {
                existing.getSkills().clear();
                for (Skill s : jobSeeker.getSkills()) {
                    s.setJobSeeker(existing);
                    existing.getSkills().add(s);
                }
            }
            if (jobSeeker.getEducations() != null) {
                existing.getEducations().clear();
                for (Education e : jobSeeker.getEducations()) {
                    e.setJobSeeker(existing);
                    existing.getEducations().add(e);
                }
            }
            return repository.save(existing);
        }
        return null;
    }

    @Override
    public boolean delete(String id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<JobSeeker> getAll() {
        return repository.findAll();
    }

    @Override
    public List<JobSeeker> getByEmail(String email) {
        return repository.findByEmail(email)
                .map(List::of)
                .orElse(List.of());
    }

    @Override
    public JobSeeker uploadResume(String userId, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("No file was provided.");
        }
        String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume";
        String extension = originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf('.') + 1).toLowerCase()
                : "";
        if (!ALLOWED_RESUME_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Only PDF, DOC, and DOCX files are supported. Received extension: '" + extension + "' from file: '" + originalName + "'");
        }

        JobSeeker existing = repository.findById(userId).orElse(null);
        if (existing == null) {
            return null;
        }

        Files.createDirectories(RESUME_DIR);
        String safeUserId = existing.getUserId().replaceAll("[^a-zA-Z0-9-]", "");
        String safeName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
        String storedName = safeUserId + "_" + safeName;

        Path safeDir = RESUME_DIR.toAbsolutePath().normalize();
        Path destination = safeDir.resolve(storedName).normalize();
        if (!destination.startsWith(safeDir)) {
            throw new IllegalArgumentException("Invalid file name.");
        }

        if (existing.getResume() != null && !existing.getResume().getStoredName().equals(storedName)) {
            Files.deleteIfExists(RESUME_DIR.resolve(existing.getResume().getStoredName()));
        }

        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

        Resume newResume = ResumeFactory.createResume(originalName, storedName, file.getContentType(), file.getSize(),
                existing);
        existing.setResume(newResume);
        return repository.save(existing);
    }

    @Override
    public Resource loadResume(String userId) {
        JobSeeker existing = repository.findById(userId).orElse(null);
        if (existing == null || existing.getResume() == null) {
            return null;
        }
        Path file = RESUME_DIR.resolve(existing.getResume().getStoredName());
        if (!Files.exists(file)) {
            return null;
        }
        return new FileSystemResource(file);
    }

    @Override
    public boolean deleteResume(String userId) throws IOException {
        JobSeeker existing = repository.findById(userId).orElse(null);
        if (existing == null || existing.getResume() == null) {
            return false;
        }
        Files.deleteIfExists(RESUME_DIR.resolve(existing.getResume().getStoredName()));
        existing.setResume(null);
        repository.save(existing);
        return true;
    }

    @Override
    @Transactional
    public JobSeeker incrementProfileViews(String userId) {
        JobSeeker existing = repository.findById(userId).orElse(null);
        if (existing == null) {
            return null;
        }
        existing.setProfileViews(existing.getProfileViews() + 1);
        return repository.save(existing);
    }
}