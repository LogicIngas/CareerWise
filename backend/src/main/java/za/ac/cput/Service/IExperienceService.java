package za.ac.cput.Service;

import za.ac.cput.domain.Experience;

import java.util.List;

public interface IExperienceService extends IService<Experience, String> {
    List<Experience> getAll();
    List<Experience> findByCompany(String company);
}
