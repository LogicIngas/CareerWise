package za.ac.cput.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.domain.SavedJob;

import java.util.List;
import java.util.Optional;

@Repository
public interface ISavedJobRepository extends JpaRepository<SavedJob, String> {
    List<SavedJob> findByJobSeekerUserId(String jobSeekerId);
    Optional<SavedJob> findByJobSeekerUserIdAndJobJobId(String jobSeekerId, String jobId);
    boolean existsByJobSeekerUserIdAndJobJobId(String jobSeekerId, String jobId);

    @Transactional
    void deleteByJobSeekerUserIdAndJobJobId(String jobSeekerId, String jobId);
}
