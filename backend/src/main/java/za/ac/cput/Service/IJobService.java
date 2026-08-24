package za.ac.cput.Service;

import za.ac.cput.domain.Job;

import java.util.List;

public interface IJobService extends IService<Job,String> {
    List<Job> getAll();
    boolean delete(String id);
    List<Job> findOpenPositions();
    List<Job> findJobsByLocation(String location);
    List<Job> findJobsByEmploymentType(String employmentType);
    List<Job> findJobsByRemoteOption(Boolean remoteOption);
    List<Job> findRecommendedForJobSeeker(String jobSeekerId, int limit);
    List<Job> searchJobs(String keyword, String location, String employmentType, Boolean remoteOption);
}
