package za.ac.cput.Service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.Service.IJobService;
import za.ac.cput.domain.Job;
import za.ac.cput.domain.JobSeeker;
import za.ac.cput.domain.JobStatus;
import za.ac.cput.repository.IJobRepository;
import za.ac.cput.repository.IJobSeekerRepository;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobServiceImpl implements IJobService {

    private final IJobRepository repository;
    private final IJobSeekerRepository jobSeekerRepository;

    @Autowired
    public JobServiceImpl(IJobRepository repository, IJobSeekerRepository jobSeekerRepository) {
        this.repository = repository;
        this.jobSeekerRepository = jobSeekerRepository;
    }

    @Override
    public Job create(Job job) {
        return repository.save(job);
    }

    @Override
    public Job read(String id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Job update(Job job) {
        if (job.getJobId() != null && repository.existsById(job.getJobId())) {
            return repository.save(job);
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
    public List<Job> getAll() {
        return repository.findAll();
    }

    @Override
    public List<Job> findOpenPositions() {
        return repository.findByStatus(JobStatus.OPEN);
    }

    @Override
    public List<Job> findJobsByLocation(String location) {
        return repository.findByStatusAndLocationContainingIgnoreCase(JobStatus.OPEN, location);
    }

    @Override
    public List<Job> findJobsByEmploymentType(String employmentType) {
        return repository.findByStatusAndEmploymentType(JobStatus.OPEN, employmentType);
    }

    @Override
    public List<Job> findJobsByRemoteOption(Boolean remoteOption) {
        return repository.findByStatusAndRemoteOption(JobStatus.OPEN, remoteOption);
    }

    @Override
    public List<Job> findRecommendedForJobSeeker(String jobSeekerId, int limit) {
        List<Job> openJobs = repository.findByStatus(JobStatus.OPEN);

        List<String> skillNames = jobSeekerRepository.findByUserId(jobSeekerId)
                .map(JobSeeker::getSkills)
                .orElse(List.of())
                .stream()
                .map(s -> s.getName() == null ? "" : s.getName().toLowerCase())
                .filter(name -> !name.isBlank())
                .collect(Collectors.toList());

        Comparator<Job> byScoreThenRecency = Comparator
                .comparingInt((Job j) -> scoreJob(j, skillNames)).reversed()
                .thenComparing(Job::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder()));

        return openJobs.stream()
                .sorted(byScoreThenRecency)
                .limit(limit)
                .collect(Collectors.toList());
    }

    private int scoreJob(Job job, List<String> skillNames) {
        if (skillNames.isEmpty()) {
            return 0;
        }
        String haystack = ((job.getTitle() != null ? job.getTitle() : "") + " "
                + (job.getDescription() != null ? job.getDescription() : "") + " "
                + String.join(" ", job.getRequirements() != null ? job.getRequirements() : List.of()))
                .toLowerCase();

        int score = 0;
        for (String skill : skillNames) {
            if (haystack.contains(skill)) {
                score++;
            }
        }
        return score;
    }

    @Override
    public List<Job> searchJobs(String keyword, String location, String employmentType, Boolean remoteOption) {
        List<Job> jobs = repository.findByStatus(JobStatus.OPEN);

        return jobs.stream()
                .filter(j -> keyword == null || keyword.isBlank()
                        || containsIgnoreCase(j.getTitle(), keyword)
                        || containsIgnoreCase(j.getDescription(), keyword))
                .filter(j -> location == null || location.isBlank()
                        || containsIgnoreCase(j.getLocation(), location))
                .filter(j -> employmentType == null || employmentType.isBlank()
                        || employmentType.equalsIgnoreCase(j.getEmploymentType()))
                .filter(j -> remoteOption == null || remoteOption.equals(j.getRemoteOption()))
                .collect(Collectors.toList());
    }

    private boolean containsIgnoreCase(String haystack, String needle) {
        return haystack != null && haystack.toLowerCase().contains(needle.toLowerCase());
    }
}