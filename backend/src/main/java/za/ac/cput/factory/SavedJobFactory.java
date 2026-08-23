package za.ac.cput.factory;

import za.ac.cput.domain.Job;
import za.ac.cput.domain.JobSeeker;
import za.ac.cput.domain.SavedJob;

import java.time.LocalDateTime;

public class SavedJobFactory {

    public static SavedJob buildSavedJob(JobSeeker jobSeeker, Job job) {
        if (jobSeeker == null || job == null) {
            return null;
        }

        return SavedJob.builder()
                .jobSeeker(jobSeeker)
                .job(job)
                .savedAt(LocalDateTime.now())
                .build();
    }
}
