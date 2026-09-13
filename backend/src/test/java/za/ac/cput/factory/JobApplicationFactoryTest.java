package za.ac.cput.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.domain.Job;
import za.ac.cput.domain.JobApplication;
import za.ac.cput.domain.JobSeeker;

import static org.junit.jupiter.api.Assertions.*;

class JobApplicationFactoryTest {

    @Test
    void buildJobApplication() {
        JobSeeker jobSeeker = new JobSeeker();
        jobSeeker.setUserId("JS001");
        
        Job job = new Job();
        job.setJobId("J001");

        JobApplication application = JobApplicationFactory.buildJobApplication(
                jobSeeker,
                job,
                "Here are my notes for the application"
        );

        assertNotNull(application);
        assertEquals(jobSeeker, application.getJobSeeker());
        assertEquals(job, application.getJob());
        assertEquals("Here are my notes for the application", application.getNotes());
        assertEquals("Applied", application.getStatus());
        assertNotNull(application.getAppliedDate());
}

    @Test
    void buildJobApplicationWithNullJobSeeker() {
        Job job = new Job();
        job.setJobId("J001");

        JobApplication application = JobApplicationFactory.buildJobApplication(
                null,
                job,
                "Notes"
        );

        assertNull(application);
}
    
    @Test
    void buildJobApplicationWithNullJob() {
        JobSeeker jobSeeker = new JobSeeker();
        jobSeeker.setUserId("JS001");

        JobApplication application = JobApplicationFactory.buildJobApplication(
                jobSeeker,
                null,
                "Notes"
        );

        assertNull(application);
}
}
