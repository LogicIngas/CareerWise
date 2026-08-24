package za.ac.cput.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.domain.Resume;

@Repository
public interface IResumeRepository extends JpaRepository<Resume, String> {
}
