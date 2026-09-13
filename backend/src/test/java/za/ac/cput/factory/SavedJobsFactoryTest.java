package za.ac.cput.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.domain.Job;
import za.ac.cput.domain.JobSeeker;
import za.ac.cput.domain.SavedJobs;

import static org.junit.jupiter.api.Assertions.*;

class SavedJobsFactoryTest {

    @Test
    void buildSavedJob() {
        JobSeeker jobSeeker = new JobSeeker();
        jobSeeker.setUserId("JS003");
        
        Job job = new Job();
        job.setJobId("J003");

        SavedJobs savedJob = SavedJobsFactory.buildSavedJob(jobSeeker, job);

        assertNotNull(savedJob);
        assertEquals(jobSeeker, savedJob.getJobSeeker());
        assertEquals(job, savedJob.getJob());
        assertNotNull(savedJob.getSavedAt());
}

    @Test
    void buildSavedJobWithNullJobSeeker() {
        Job job = new Job();
        job.setJobId("J003");

        SavedJobs savedJob = SavedJobsFactory.buildSavedJob(null, job);

        assertNull(savedJob);
}
    
    @Test
    void buildSavedJobWithNullJob() {
        JobSeeker jobSeeker = new JobSeeker();
        jobSeeker.setUserId("JS003");

        SavedJobs savedJob = SavedJobsFactory.buildSavedJob(jobSeeker, null);

        assertNull(savedJob);
}
}
