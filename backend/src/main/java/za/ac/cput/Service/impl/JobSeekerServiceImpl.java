package za.ac.cput.Service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.Service.IJobSeekerService;
import za.ac.cput.domain.Education;
import za.ac.cput.domain.JobSeeker;
import za.ac.cput.domain.Skill;
import za.ac.cput.repository.IJobSeekerRepository;

import java.util.List;

@Service
public class JobSeekerServiceImpl implements IJobSeekerService {

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
            if (jobSeeker.getFirstName() != null) existing.setFirstName(jobSeeker.getFirstName());
            if (jobSeeker.getLastName() != null) existing.setLastName(jobSeeker.getLastName());
            if (jobSeeker.getPhoneNumber() != null) existing.setPhoneNumber(jobSeeker.getPhoneNumber());
            if (jobSeeker.getLocation() != null) existing.setLocation(jobSeeker.getLocation());
            if (jobSeeker.getHeadline() != null) existing.setHeadline(jobSeeker.getHeadline());
            if (jobSeeker.getSummary() != null) existing.setSummary(jobSeeker.getSummary());
            
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
}