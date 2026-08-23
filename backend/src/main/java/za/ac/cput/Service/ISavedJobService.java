package za.ac.cput.Service;

import za.ac.cput.domain.SavedJob;

import java.util.List;

public interface ISavedJobService extends IService<SavedJob, String> {
    SavedJob saveJob(String jobSeekerId, String jobId);
    boolean unsaveJob(String jobSeekerId, String jobId);
    List<SavedJob> getSavedJobsByJobSeeker(String jobSeekerId);
    boolean isJobSaved(String jobSeekerId, String jobId);
    List<SavedJob> getAll();
}
