package za.ac.cput.Service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import za.ac.cput.Service.IJobSeekerService;
import za.ac.cput.Service.INotificationService;
import za.ac.cput.domain.Education;
import za.ac.cput.domain.Experience;
import za.ac.cput.domain.JobSeeker;
import za.ac.cput.domain.Resume;
import za.ac.cput.domain.Skill;
import za.ac.cput.factory.ResumeFactory;
import za.ac.cput.repository.IEducationRepository;
import za.ac.cput.repository.IExperienceRepository;
import za.ac.cput.repository.IJobSeekerRepository;
import za.ac.cput.repository.ISkillRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class JobSeekerServiceImpl implements IJobSeekerService {

    private static final Path RESUME_DIR = Paths.get("uploads", "resumes");
    private static final Set<String> ALLOWED_RESUME_EXTENSIONS = Set.of("pdf", "doc", "docx");

    private final IJobSeekerRepository repository;
    private final INotificationService notificationService;
    private final ISkillRepository skillRepository;
    private final IEducationRepository educationRepository;
    private final IExperienceRepository experienceRepository;

    @Autowired
    public JobSeekerServiceImpl(IJobSeekerRepository repository,
            INotificationService notificationService,
            ISkillRepository skillRepository,
            IEducationRepository educationRepository,
            IExperienceRepository experienceRepository) {
        this.repository = repository;
        this.notificationService = notificationService;
        this.skillRepository = skillRepository;
        this.educationRepository = educationRepository;
        this.experienceRepository = experienceRepository;
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
                List<String> incomingIds = jobSeeker.getSkills().stream()
                        .map(Skill::getSkillId)
                        .filter(id -> id != null && !id.isBlank())
                        .collect(Collectors.toList());

                List<Skill> toRemove = existing.getSkills().stream()
                        .filter(s -> !incomingIds.contains(s.getSkillId()))
                        .collect(Collectors.toList());

                existing.getSkills().removeAll(toRemove);
                skillRepository.deleteAll(toRemove);

                for (Skill incoming : jobSeeker.getSkills()) {
                    incoming.setJobSeeker(existing);
                    if (incoming.getSkillId() != null && incoming.getSkillId().isBlank()) {
                        incoming.setSkillId(null);
                    }
                    if (incoming.getSkillId() != null) {
                        existing.getSkills().stream()
                                .filter(s -> s.getSkillId().equals(incoming.getSkillId()))
                                .findFirst()
                                .ifPresent(s -> {
                                    s.setName(incoming.getName());
                                    s.setCategory(incoming.getCategory());
                                    s.setYearsOfExperience(incoming.getYearsOfExperience());
                                    skillRepository.save(s);
                                });
                    } else {
                        Skill saved = skillRepository.save(incoming);
                        existing.getSkills().add(saved);
                    }
                }
            }

            if (jobSeeker.getEducations() != null) {
                List<String> incomingIds = jobSeeker.getEducations().stream()
                        .map(Education::getEducationId)
                        .filter(id -> id != null && !id.isBlank())
                        .collect(Collectors.toList());

                List<Education> toRemove = existing.getEducations().stream()
                        .filter(e -> !incomingIds.contains(e.getEducationId()))
                        .collect(Collectors.toList());

                existing.getEducations().removeAll(toRemove);
                educationRepository.deleteAll(toRemove);

                for (Education incoming : jobSeeker.getEducations()) {
                    incoming.setJobSeeker(existing);
                    if (incoming.getEducationId() != null && incoming.getEducationId().isBlank()) {
                        incoming.setEducationId(null);
                    }
                    if (incoming.getEducationId() != null) {
                        existing.getEducations().stream()
                                .filter(e -> e.getEducationId().equals(incoming.getEducationId()))
                                .findFirst()
                                .ifPresent(e -> {
                                    e.setInstitution(incoming.getInstitution());
                                    e.setDegree(incoming.getDegree());
                                    e.setFieldOfStudy(incoming.getFieldOfStudy());
                                    e.setStartDate(incoming.getStartDate());
                                    e.setEndDate(incoming.getEndDate());
                                    e.setDescription(incoming.getDescription());
                                    educationRepository.save(e);
                                });
                    } else {
                        Education saved = educationRepository.save(incoming);
                        existing.getEducations().add(saved);
                    }
                }
            }

            if (jobSeeker.getExperiences() != null) {
                List<String> incomingIds = jobSeeker.getExperiences().stream()
                        .map(Experience::getExperienceId)
                        .filter(id -> id != null && !id.isBlank())
                        .collect(Collectors.toList());

                List<Experience> toRemove = existing.getExperiences().stream()
                        .filter(ex -> !incomingIds.contains(ex.getExperienceId()))
                        .collect(Collectors.toList());

                existing.getExperiences().removeAll(toRemove);
                experienceRepository.deleteAll(toRemove);

                for (Experience incoming : jobSeeker.getExperiences()) {
                    incoming.setJobSeeker(existing);
                    if (incoming.getExperienceId() != null && incoming.getExperienceId().isBlank()) {
                        incoming.setExperienceId(null);
                    }
                    if (incoming.getExperienceId() != null) {
                        existing.getExperiences().stream()
                                .filter(ex -> ex.getExperienceId().equals(incoming.getExperienceId()))
                                .findFirst()
                                .ifPresent(ex -> {
                                    ex.setJobTitle(incoming.getJobTitle());
                                    ex.setCompany(incoming.getCompany());
                                    ex.setLocation(incoming.getLocation());
                                    ex.setStartDate(incoming.getStartDate());
                                    ex.setEndDate(incoming.getEndDate());
                                    ex.setDescription(incoming.getDescription());
                                    experienceRepository.save(ex);
                                });
                    } else {
                        Experience saved = experienceRepository.save(incoming);
                        existing.getExperiences().add(saved);
                    }
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
            throw new IllegalArgumentException("Only PDF, DOC, and DOCX files are supported. Received extension: '"
                    + extension + "' from file: '" + originalName + "'");
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
    public JobSeeker incrementProfileViews(String userId, String viewerCompany) {
        JobSeeker existing = repository.findById(userId).orElse(null);
        if (existing == null) {
            return null;
        }
        existing.setProfileViews(existing.getProfileViews() + 1);
        JobSeeker saved = repository.save(existing);

        String message = (viewerCompany != null && !viewerCompany.isBlank())
                ? "A recruiter from " + viewerCompany + " viewed your profile."
                : "Your profile was viewed.";
        notificationService.create(
                userId,
                "PROFILE_VIEW",
                "Profile viewed",
                message,
                null);

        return saved;
    }
}