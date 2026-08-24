package za.ac.cput.Service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.Service.IJobService;
import za.ac.cput.domain.Job;
import za.ac.cput.domain.JobStatus;
import za.ac.cput.repository.IJobRepository;

import java.util.List;

@Service
public class JobServiceImpl implements IJobService {

    private final IJobRepository repository;

    @Autowired
    public JobServiceImpl(IJobRepository repository) {
        this.repository = repository;
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
}