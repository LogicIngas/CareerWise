package za.ac.cput.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.domain.SavedJobs;

import java.util.List;
import java.util.Optional;

@Repository
public interface ISavedJobsRepository extends JpaRepository<SavedJobs, String> {
    List<SavedJobs> findByJobSeekerUserId(String jobSeekerId);

    Optional<SavedJobs> findByJobSeekerUserIdAndJobJobId(String jobSeekerId,
            String jobId);

    boolean existsByJobSeekerUserIdAndJobJobId(String jobSeekerId, String jobId);

    @Transactional
    void deleteByJobSeekerUserIdAndJobJobId(String jobSeekerId, String jobId);
}
