package za.ac.cput.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.domain.JobSeeker;
import za.ac.cput.domain.Resume;

import static org.junit.jupiter.api.Assertions.*;

class ResumeFactoryTest {

    @Test
    void createResume() {
        JobSeeker jobSeeker = new JobSeeker();
        jobSeeker.setUserId("JS002");

        Resume resume = ResumeFactory.createResume(
                "my_resume.pdf",
                "JS002_my_resume.pdf",
                "application/pdf",
                1024000L,
                jobSeeker
        );

        assertNotNull(resume);
        assertEquals("my_resume.pdf", resume.getFileName());
        assertEquals("JS002_my_resume.pdf", resume.getStoredName());
        assertEquals("application/pdf", resume.getContentType());
        assertEquals(1024000L, resume.getFileSize());
        assertEquals(jobSeeker, resume.getJobSeeker());
        assertNotNull(resume.getResumeId());
        
        System.out.println("Built Resume successfully: " + resume);
    }

    @Test
    void createResumeWithEmptyFileName() {
        JobSeeker jobSeeker = new JobSeeker();
        jobSeeker.setUserId("JS002");

        Resume resume = ResumeFactory.createResume(
                "",
                "JS002_my_resume.pdf",
                "application/pdf",
                1024000L,
                jobSeeker
        );

        assertNull(resume);
        System.out.println("Empty file name correctly prevented Resume creation.");
    }
    
    @Test
    void createResumeWithInvalidFileSize() {
        JobSeeker jobSeeker = new JobSeeker();
        jobSeeker.setUserId("JS002");

        Resume resume = ResumeFactory.createResume(
                "my_resume.pdf",
                "JS002_my_resume.pdf",
                "application/pdf",
                0L,
                jobSeeker
        );

        assertNull(resume);
        System.out.println("Invalid file size correctly prevented Resume creation.");
    }
}
