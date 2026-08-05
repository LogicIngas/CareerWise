package za.ac.cput.Service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.Service.IEmployerService;
import za.ac.cput.domain.Employer;
import za.ac.cput.repository.IEmployerRepository;

import java.util.List;

@Service
public class EmployerServiceImpl implements IEmployerService {

    private final IEmployerRepository employerRepository;

    @Autowired
    public EmployerServiceImpl(IEmployerRepository employerRepository) {
        this.employerRepository = employerRepository;
    }

    @Override
    public Employer create(Employer employer) {
            return employerRepository.save(employer);
        }


    @Override
    public Employer read(String id) { // Fix: String not Integer
        return employerRepository.findById(id).orElse(null);
    }

    @Override
    public Employer update(Employer employer) {
        if (employer.getUserId() != null &&
                employerRepository.existsById(employer.getUserId())) {
            return employerRepository.save(employer);
        }
        return null;
    }

    @Override
    public boolean delete(String id) { // Fix: String not Integer
        if (employerRepository.existsById(id)) {
            employerRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<Employer> findAll() {
        return employerRepository.findAll();
    }

    @Override
    public List<Employer> findByName(String name) {
        return employerRepository.findByCompanyName(name)
                .map(List::of)
                .orElse(List.of());
    }
}