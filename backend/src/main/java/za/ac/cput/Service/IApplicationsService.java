package za.ac.cput.Service;

import za.ac.cput.domain.JobApplication;

import java.util.List;

public interface IApplicationsService extends IService<JobApplication, String> {
    List<JobApplication> getApplications(String jobSeekerId);
    List<JobApplication> getJobApplications(String jobId);
    JobApplication apply(String jobSeekerId, String jobId, String notes);
    JobApplication updateStatus(String applicationId, String status);
    List<JobApplication> getAll();
}
