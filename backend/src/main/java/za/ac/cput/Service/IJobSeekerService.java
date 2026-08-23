package za.ac.cput.Service;

import za.ac.cput.domain.JobSeeker;

import java.util.List;

public interface IJobSeekerService extends IService<JobSeeker, String> {
    List<JobSeeker> getAll();
    List<JobSeeker> getByEmail(String email);
    JobSeeker updateProfile(JobSeeker jobSeeker); // NEW
}