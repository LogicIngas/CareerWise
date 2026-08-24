package za.ac.cput.factory;

import za.ac.cput.domain.JobSeeker;
import za.ac.cput.domain.Resume;
import za.ac.cput.util.Helper;

import java.util.UUID;

public class ResumeFactory {
    public static Resume createResume(String fileName, String storedName, String contentType, long fileSize, JobSeeker jobSeeker) {
        if (Helper.isNullOrEmpty(fileName) || Helper.isNullOrEmpty(storedName) || Helper.isNullOrEmpty(contentType)) {
            return null;
        }

        if (fileSize <= 0 || jobSeeker == null) {
            return null;
        }

        return Resume.builder()
                .resumeId(UUID.randomUUID().toString())
                .fileName(fileName)
                .storedName(storedName)
                .contentType(contentType)
                .fileSize(fileSize)
                .jobSeeker(jobSeeker)
                .build();
    }
}
