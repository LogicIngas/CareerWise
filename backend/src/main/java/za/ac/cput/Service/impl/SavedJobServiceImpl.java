package za.ac.cput.Service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.Service.ISavedJobService;
import za.ac.cput.domain.Job;
import za.ac.cput.domain.JobSeeker;
import za.ac.cput.domain.SavedJob;
import za.ac.cput.factory.SavedJobFactory;
import za.ac.cput.repository.IJobRepository;
import za.ac.cput.repository.IJobSeekerRepository;
import za.ac.cput.repository.ISavedJobRepository;

import java.util.List;
import java.util.Optional;

@Service
public class SavedJobServiceImpl implements ISavedJobService {

    private final ISavedJobRepository savedJobRepository;
    private final IJobSeekerRepository jobSeekerRepository;
    private final IJobRepository jobRepository;

    @Autowired
    public SavedJobServiceImpl(ISavedJobRepository savedJobRepository,
                               IJobSeekerRepository jobSeekerRepository,
                               IJobRepository jobRepository) {
        this.savedJobRepository = savedJobRepository;
        this.jobSeekerRepository = jobSeekerRepository;
        this.jobRepository = jobRepository;
    }

    @Override
    public SavedJob create(SavedJob savedJob) {
        if (savedJob == null) return null;
        return savedJobRepository.save(savedJob);
    }

    @Override
    public SavedJob read(String id) {
        return savedJobRepository.findById(id).orElse(null);
    }

    @Override
    public SavedJob update(SavedJob savedJob) {
        if (savedJob != null && savedJob.getSavedJobId() != null && savedJobRepository.existsById(savedJob.getSavedJobId())) {
            return savedJobRepository.save(savedJob);
        }
        return null;
    }

    @Override
    public boolean delete(String id) {
        if (savedJobRepository.existsById(id)) {
            savedJobRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<SavedJob> getAll() {
        return savedJobRepository.findAll();
    }

    @Override
    @Transactional
    public SavedJob saveJob(String jobSeekerId, String jobId) {
        if (savedJobRepository.existsByJobSeekerUserIdAndJobJobId(jobSeekerId, jobId)) {
            return savedJobRepository.findByJobSeekerUserIdAndJobJobId(jobSeekerId, jobId).orElse(null);
        }

        Optional<JobSeeker> jobSeekerOpt = jobSeekerRepository.findByUserId(jobSeekerId);
        Optional<Job> jobOpt = jobRepository.findById(jobId);

        if (jobSeekerOpt.isPresent() && jobOpt.isPresent()) {
            SavedJob savedJob = SavedJobFactory.buildSavedJob(jobSeekerOpt.get(), jobOpt.get());
            return savedJobRepository.save(savedJob);
        }

        return null;
    }

    @Override
    @Transactional
    public boolean unsaveJob(String jobSeekerId, String jobId) {
        if (savedJobRepository.existsByJobSeekerUserIdAndJobJobId(jobSeekerId, jobId)) {
            savedJobRepository.deleteByJobSeekerUserIdAndJobJobId(jobSeekerId, jobId);
            return true;
        }
        return false;
    }

    @Override
    public List<SavedJob> getSavedJobsByJobSeeker(String jobSeekerId) {
        return savedJobRepository.findByJobSeekerUserId(jobSeekerId);
    }

    @Override
    public boolean isJobSaved(String jobSeekerId, String jobId) {
        return savedJobRepository.existsByJobSeekerUserIdAndJobJobId(jobSeekerId, jobId);
    }
}
