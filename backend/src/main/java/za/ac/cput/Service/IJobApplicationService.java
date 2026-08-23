package za.ac.cput.Service;

import za.ac.cput.domain.JobApplication;

import java.util.List;

public interface IJobApplicationService extends IService<JobApplication, String> {
    JobApplication apply(String jobSeekerId, String jobId, String notes);
    List<JobApplication> getApplicationsByJobSeeker(String jobSeekerId);
    List<JobApplication> getApplicationsByJob(String jobId);
    JobApplication updateStatus(String applicationId, String status);
    List<JobApplication> getAll();
}
