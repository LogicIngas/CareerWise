package za.ac.cput.Service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.Service.IExperienceService;
import za.ac.cput.domain.Experience;
import za.ac.cput.repository.IExperienceRepository;

import java.util.List;

@Service
public class ExperienceServiceImpl implements IExperienceService {

    private final IExperienceRepository repository;

    @Autowired
    public ExperienceServiceImpl(IExperienceRepository repository) {
        this.repository = repository;
    }

    @Override
    public Experience create(Experience experience) {
        return repository.save(experience);
    }

    @Override
    public Experience read(String id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Experience update(Experience experience) {
        if (experience.getExperienceId() != null &&
                repository.existsById(experience.getExperienceId())) {
            return repository.save(experience);
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
    public List<Experience> getAll() {
        return repository.findAll();
    }

    @Override
    public List<Experience> findByCompany(String company) {
        return repository.findByCompanyContainingIgnoreCase(company);
    }
}
