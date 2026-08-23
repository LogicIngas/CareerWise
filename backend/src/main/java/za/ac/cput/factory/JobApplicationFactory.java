package za.ac.cput.factory;

import za.ac.cput.domain.Job;
import za.ac.cput.domain.JobApplication;
import za.ac.cput.domain.JobSeeker;

import java.time.LocalDateTime;

public class JobApplicationFactory {

    public static JobApplication buildJobApplication(JobSeeker jobSeeker, Job job, String notes) {
        if (jobSeeker == null || job == null) {
            return null;
        }

        return JobApplication.builder()
                .jobSeeker(jobSeeker)
                .job(job)
                .status("Applied")
                .appliedDate(LocalDateTime.now())
                .notes(notes)
                .build();
    }
}
