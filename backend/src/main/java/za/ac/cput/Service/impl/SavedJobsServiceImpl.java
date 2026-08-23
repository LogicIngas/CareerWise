package za.ac.cput.Service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.Service.ISavedJobsService;
import za.ac.cput.domain.Job;
import za.ac.cput.domain.JobSeeker;
import za.ac.cput.domain.SavedJobs;
import za.ac.cput.factory.SavedJobsFactory;
import za.ac.cput.repository.IJobRepository;
import za.ac.cput.repository.IJobSeekerRepository;
import za.ac.cput.repository.ISavedJobsRepository;

import java.util.List;
import java.util.Optional;

@Service
public class SavedJobsServiceImpl implements ISavedJobsService {

    private final ISavedJobsRepository savedJobsRepository;
    private final IJobSeekerRepository jobSeekerRepository;
    private final IJobRepository jobRepository;

    @Autowired
    public SavedJobsServiceImpl(ISavedJobsRepository savedJobsRepository,
                                IJobSeekerRepository jobSeekerRepository,
                                IJobRepository jobRepository) {
        this.savedJobsRepository = savedJobsRepository;
        this.jobSeekerRepository = jobSeekerRepository;
        this.jobRepository = jobRepository;
    }

    @Override
    public SavedJobs create(SavedJobs savedJob) {
        if (savedJob == null) return null;
        return savedJobsRepository.save(savedJob);
    }

    @Override
    public SavedJobs read(String id) {
        return savedJobsRepository.findById(id).orElse(null);
    }

    @Override
    public SavedJobs update(SavedJobs savedJob) {
        if (savedJob != null && savedJob.getSavedJobId() != null && savedJobsRepository.existsById(savedJob.getSavedJobId())) {
            return savedJobsRepository.save(savedJob);
        }
        return null;
    }

    @Override
    public boolean delete(String id) {
        if (savedJobsRepository.existsById(id)) {
            savedJobsRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<SavedJobs> getAll() {
        return savedJobsRepository.findAll();
    }

    @Override
    @Transactional
    public SavedJobs saveJob(String jobSeekerId, String jobId) {
        if (savedJobsRepository.existsByJobSeekerUserIdAndJobJobId(jobSeekerId, jobId)) {
            return savedJobsRepository.findByJobSeekerUserIdAndJobJobId(jobSeekerId, jobId).orElse(null);
        }

        Optional<JobSeeker> jobSeekerOpt = jobSeekerRepository.findByUserId(jobSeekerId);
        Optional<Job> jobOpt = jobRepository.findById(jobId);

        if (jobSeekerOpt.isPresent() && jobOpt.isPresent()) {
            SavedJobs savedJob = SavedJobsFactory.buildSavedJob(jobSeekerOpt.get(), jobOpt.get());
            return savedJobsRepository.save(savedJob);
        }

        return null;
    }

    @Override
    @Transactional
    public boolean unsaveJob(String jobSeekerId, String jobId) {
        if (savedJobsRepository.existsByJobSeekerUserIdAndJobJobId(jobSeekerId, jobId)) {
            savedJobsRepository.deleteByJobSeekerUserIdAndJobJobId(jobSeekerId, jobId);
            return true;
        }
        return false;
    }

    @Override
    public List<SavedJobs> getSavedJobs(String jobSeekerId) {
        return savedJobsRepository.findByJobSeekerUserId(jobSeekerId);
    }

    @Override
    public boolean isJobSaved(String jobSeekerId, String jobId) {
        return savedJobsRepository.existsByJobSeekerUserIdAndJobJobId(jobSeekerId, jobId);
    }
}
