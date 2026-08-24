package za.ac.cput.Service;

import za.ac.cput.domain.SavedJobs;

import java.util.List;

public interface ISavedJobsService extends IService<SavedJobs, String> {
    SavedJobs saveJob(String jobSeekerId, String jobId);

    boolean unsaveJob(String jobSeekerId, String jobId);

    List<SavedJobs> getSavedJobs(String jobSeekerId);

    boolean isJobSaved(String jobSeekerId, String jobId);

    List<SavedJobs> getAll();
}
