package za.ac.cput.Service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import za.ac.cput.domain.JobSeeker;

import java.io.IOException;
import java.util.List;

public interface IJobSeekerService extends IService<JobSeeker, String> {
    List<JobSeeker> getAll();
    List<JobSeeker> getByEmail(String email);
    JobSeeker updateProfile(JobSeeker jobSeeker); // NEW
    JobSeeker uploadResume(String userId, MultipartFile file) throws IOException;
    Resource loadResume(String userId);
    boolean deleteResume(String userId) throws IOException;
    JobSeeker incrementProfileViews(String userId, String viewerCompany);
}