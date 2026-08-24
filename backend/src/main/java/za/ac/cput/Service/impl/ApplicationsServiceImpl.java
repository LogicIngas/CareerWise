package za.ac.cput.Service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.Service.IApplicationsService;
import za.ac.cput.Service.INotificationService;
import za.ac.cput.domain.Job;
import za.ac.cput.domain.JobApplication;
import za.ac.cput.domain.JobSeeker;
import za.ac.cput.factory.JobApplicationFactory;
import za.ac.cput.repository.IJobApplicationRepository;
import za.ac.cput.repository.IJobRepository;
import za.ac.cput.repository.IJobSeekerRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ApplicationsServiceImpl implements IApplicationsService {

    private final IJobApplicationRepository applicationRepository;
    private final IJobSeekerRepository jobSeekerRepository;
    private final IJobRepository jobRepository;
    private final INotificationService notificationService;

    @Autowired
    public ApplicationsServiceImpl(IJobApplicationRepository applicationRepository,
            IJobSeekerRepository jobSeekerRepository,
            IJobRepository jobRepository,
            INotificationService notificationService) {
        this.applicationRepository = applicationRepository;
        this.jobSeekerRepository = jobSeekerRepository;
        this.jobRepository = jobRepository;
        this.notificationService = notificationService;
    }

    @Override
    public JobApplication create(JobApplication jobApplication) {
        // if (jobApplication == null) return null;
        return applicationRepository.save(jobApplication);
    }

    @Override
    public JobApplication read(String id) {
        return applicationRepository.findById(id).orElse(null);
    }

    @Override
    public JobApplication update(JobApplication jobApplication) {
        if (jobApplication != null && jobApplication.getApplicationId() != null
                && applicationRepository.existsById(jobApplication.getApplicationId())) {
            return applicationRepository.save(jobApplication);
        }
        return null;
    }

    @Override
    public boolean delete(String id) {
        if (applicationRepository.existsById(id)) {
            applicationRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<JobApplication> getAll() {
        return applicationRepository.findAll();
    }

    @Override
    @Transactional
    public JobApplication apply(String jobSeekerId, String jobId, String notes) {
        Optional<JobApplication> existing = applicationRepository.findByJobSeekerUserIdAndJobJobId(jobSeekerId, jobId);
        if (existing.isPresent()) {
            return existing.get();
        }

        Optional<JobSeeker> jobSeekerOpt = jobSeekerRepository.findByUserId(jobSeekerId);
        Optional<Job> jobOpt = jobRepository.findById(jobId);

        if (jobSeekerOpt.isPresent() && jobOpt.isPresent()) {
            JobSeeker jobSeeker = jobSeekerOpt.get();
            Job job = jobOpt.get();
            JobApplication app = JobApplicationFactory.buildJobApplication(jobSeeker, job, notes);
            JobApplication saved = applicationRepository.save(app);

            if (job.getEmployer() != null) {
                String applicantName = (jobSeeker.getFirstName() != null ? jobSeeker.getFirstName() : "")
                        + " " + (jobSeeker.getLastName() != null ? jobSeeker.getLastName() : "");
                notificationService.create(
                        job.getEmployer().getUserId(),
                        "NEW_APPLICANT",
                        "New applicant",
                        applicantName.trim() + " applied to " + job.getTitle() + "."
                );
            }

            return saved;
        }

        return null;
    }

    @Override
    public List<JobApplication> getApplications(String jobSeekerId) {
        return applicationRepository.findByJobSeekerUserId(jobSeekerId);
    }

    @Override
    public List<JobApplication> getJobApplications(String jobId) {
        return applicationRepository.findByJobJobId(jobId);
    }

    @Override
    @Transactional
    public JobApplication updateStatus(String applicationId, String status) {
        Optional<JobApplication> opt = applicationRepository.findById(applicationId);
        if (opt.isPresent()) {
            JobApplication app = opt.get();
            app.setStatus(status);
            JobApplication saved = applicationRepository.save(app);

            if (app.getJobSeeker() != null && app.getJob() != null) {
                notificationService.create(
                        app.getJobSeeker().getUserId(),
                        "APPLICATION_STATUS",
                        "Application updated",
                        "Your application for " + app.getJob().getTitle() + " was updated to " + status + "."
                );
            }

            return saved;
        }
        return null;
    }
}