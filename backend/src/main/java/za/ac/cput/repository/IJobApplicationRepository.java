package za.ac.cput.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.domain.JobApplication;

import java.util.List;
import java.util.Optional;

@Repository
public interface IJobApplicationRepository extends JpaRepository<JobApplication, String> {
    List<JobApplication> findByJobSeekerUserId(String jobSeekerId);
    List<JobApplication> findByJobJobId(String jobId);
    Optional<JobApplication> findByJobSeekerUserIdAndJobJobId(String jobSeekerId, String jobId);
    boolean existsByJobSeekerUserIdAndJobJobId(String jobSeekerId, String jobId);
}
