package za.ac.cput.factory;

import za.ac.cput.domain.Job;
import za.ac.cput.domain.JobSeeker;
import za.ac.cput.domain.SavedJobs;

import java.time.LocalDateTime;

public class SavedJobsFactory {

    public static SavedJobs buildSavedJob(JobSeeker jobSeeker, Job job) {
        if (jobSeeker == null || job == null) {
            return null;
        }

        return SavedJobs.builder()
                .jobSeeker(jobSeeker)
                .job(job)
                .savedAt(LocalDateTime.now())
                .build();
    }
}
