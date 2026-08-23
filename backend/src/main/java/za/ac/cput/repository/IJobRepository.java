package za.ac.cput.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.domain.Job;
import za.ac.cput.domain.JobStatus;

import java.util.List;

@Repository
public interface IJobRepository extends JpaRepository<Job, String> {
    List<Job> findByStatus(JobStatus status);
    List<Job> findByLocationContainingIgnoreCase(String location);
    List<Job> findByEmploymentType(String employmentType);
    List<Job> findByRemoteOption(Boolean remoteOption);
    List<Job> findByStatusAndLocationContainingIgnoreCase(JobStatus status, String location);
    List<Job> findByStatusAndEmploymentType(JobStatus status, String employmentType);
    List<Job> findByStatusAndRemoteOption(JobStatus status, Boolean remoteOption);
}