package za.ac.cput.Service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.Service.IJobService;
import za.ac.cput.Service.INotificationService;
import za.ac.cput.domain.Job;
import za.ac.cput.domain.JobSeeker;
import za.ac.cput.domain.JobStatus;
import za.ac.cput.repository.IJobRepository;
import za.ac.cput.repository.IJobSeekerRepository;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobServiceImpl implements IJobService {

    private final IJobRepository repository;
    private final IJobSeekerRepository jobSeekerRepository;
    private final INotificationService notificationService;

    @Autowired
    public JobServiceImpl(
            IJobRepository repository,
            IJobSeekerRepository jobSeekerRepository,
            INotificationService notificationService) {

        this.repository = repository;
        this.jobSeekerRepository = jobSeekerRepository;
        this.notificationService = notificationService;
    }

    @Override
    public Job create(Job job) {

        // Make sure a deadline was provided
        if (job == null) {
            throw new IllegalArgumentException("Job cannot be null.");
        }

        if (job.getDeadlineDate() == null) {
            throw new IllegalArgumentException(
                    "Application deadline is required."
            );
        }

        // Deadline must be AFTER today
        if (!job.getDeadlineDate().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "Application deadline must be after today."
            );
        }

        // Only save the job after the deadline has passed validation
        Job savedJob = repository.save(job);

        // Create notifications for all job seekers
        List<JobSeeker> jobSeekers = jobSeekerRepository.findAll();

        for (JobSeeker jobSeeker : jobSeekers) {

            notificationService.create(
                    jobSeeker.getUserId(),
                    "NEW_JOB",
                    "New job available",
                    savedJob.getTitle() + " has just been posted.",
                    savedJob.getJobId()
            );
        }

        return savedJob;
    }

    @Override
    public Job read(String id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Job update(Job job) {

        if (job.getJobId() != null && repository.existsById(job.getJobId())) {

            // Validate deadline when updating a job
            if (job.getDeadlineDate() == null) {
                throw new IllegalArgumentException(
                        "Application deadline is required."
                );
            }

            if (!job.getDeadlineDate().isAfter(LocalDate.now())) {
                throw new IllegalArgumentException(
                        "Application deadline must be after today."
                );
            }

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
        return repository.findByStatusAndLocationContainingIgnoreCase(
                JobStatus.OPEN,
                location
        );
    }

    @Override
    public List<Job> findJobsByEmploymentType(String employmentType) {
        return repository.findByStatusAndEmploymentType(
                JobStatus.OPEN,
                employmentType
        );
    }

    @Override
    public List<Job> findJobsByRemoteOption(Boolean remoteOption) {
        return repository.findByStatusAndRemoteOption(
                JobStatus.OPEN,
                remoteOption
        );
    }

    @Override
    public List<Job> findRecommendedForJobSeeker(
            String jobSeekerId,
            int limit
    ) {

        List<Job> openJobs = repository.findByStatus(JobStatus.OPEN);

        List<String> skillNames = jobSeekerRepository
                .findByUserId(jobSeekerId)
                .map(JobSeeker::getSkills)
                .orElse(List.of())
                .stream()
                .map(s -> s.getName() == null
                        ? ""
                        : s.getName().toLowerCase())
                .filter(name -> !name.isBlank())
                .collect(Collectors.toList());

        Comparator<Job> byScoreThenRecency =
                Comparator
                        .comparingInt(
                                (Job j) -> scoreJob(j, skillNames)
                        )
                        .reversed()
                        .thenComparing(
                                Job::getCreatedAt,
                                Comparator.nullsLast(
                                        Comparator.reverseOrder()
                                )
                        );

        return openJobs.stream()
                .sorted(byScoreThenRecency)
                .limit(limit)
                .collect(Collectors.toList());
    }

    private int scoreJob(
            Job job,
            List<String> skillNames
    ) {

        if (skillNames.isEmpty()) {
            return 0;
        }

        String haystack =
                (
                        (job.getTitle() != null
                                ? job.getTitle()
                                : "")
                                + " "
                                + (job.getDescription() != null
                                ? job.getDescription()
                                : "")
                                + " "
                                + String.join(
                                " ",
                                job.getRequirements() != null
                                        ? job.getRequirements()
                                        : List.of()
                        )
                ).toLowerCase();

        int score = 0;

        for (String skill : skillNames) {

            if (haystack.contains(skill)) {
                score++;
            }
        }

        return score;
    }

    @Override
    public List<Job> searchJobs(
            String keyword,
            String location,
            String employmentType,
            Boolean remoteOption
    ) {

        List<Job> jobs = repository.findByStatus(JobStatus.OPEN);

        return jobs.stream()

                .filter(j ->
                        keyword == null
                                || keyword.isBlank()
                                || containsIgnoreCase(
                                j.getTitle(),
                                keyword
                        )
                                || containsIgnoreCase(
                                j.getDescription(),
                                keyword
                        )
                )

                .filter(j ->
                        location == null
                                || location.isBlank()
                                || containsIgnoreCase(
                                j.getLocation(),
                                location
                        )
                )

                .filter(j ->
                        employmentType == null
                                || employmentType.isBlank()
                                || employmentType.equalsIgnoreCase(
                                j.getEmploymentType()
                        )
                )

                .filter(j ->
                        remoteOption == null
                                || remoteOption.equals(
                                j.getRemoteOption()
                        )
                )

                .collect(Collectors.toList());
    }

    private boolean containsIgnoreCase(
            String haystack,
            String needle
    ) {

        return haystack != null
                && haystack.toLowerCase()
                .contains(needle.toLowerCase());
    }
}