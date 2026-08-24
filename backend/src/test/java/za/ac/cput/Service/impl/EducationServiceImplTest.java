package za.ac.cput.Service.impl;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.domain.Education;
import za.ac.cput.factory.EducationFactory;
import za.ac.cput.repository.IEducationRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class EducationServiceImplTest {

    @Autowired
    private EducationServiceImpl educationService;

    @Autowired
    private IEducationRepository educationRepository;

    private static Education testEducation;

    @BeforeEach
    void setUp() {
        educationRepository.deleteAll();
        testEducation = EducationFactory.createEducation(
                UUID.randomUUID().toString(),
                "University of Cape Town",
                "Bachelor of Science",
                "Computer Science",
                LocalDate.of(2018, 2, 1),
                LocalDate.of(2021, 11, 30),
                "Majored in Software Engineering");
    }

    @Test
    @Order(1)
    void create() {
        assertNotNull(testEducation);

        Education created = educationService.create(testEducation);
        assertNotNull(created);
        System.out.println("Created Education: " + created.getInstitution());
    }

    @Test
    @Order(2)
    void read() {
        Education saved = educationService.create(testEducation);
        assertNotNull(saved);

        Education read = educationService.read(saved.getEducationId());
        assertNotNull(read);
        assertEquals(saved.getEducationId(), read.getEducationId());
        System.out.println("Read Education: " + read.getDegree());
    }

    @Test
    @Order(3)
    void update() {
        Education saved = educationService.create(testEducation);
        assertNotNull(saved);

        Education updatedEducation = Education.builder()
                .educationId(saved.getEducationId())
                .institution(saved.getInstitution())
                .degree("Honours in Computer Science")
                .fieldOfStudy(saved.getFieldOfStudy())
                .startDate(saved.getStartDate())
                .endDate(saved.getEndDate())
                .description(saved.getDescription())
                .build();

        Education updated = educationService.update(updatedEducation);
        assertNotNull(updated);
        assertEquals("Honours in Computer Science", updated.getDegree());
        System.out.println("Updated Education degree: " + updated.getDegree());
    }

    @Test
    @Order(7)
    void delete() {
        Education saved = educationService.create(testEducation);
        assertNotNull(saved);

        boolean deleted = educationService.delete(saved.getEducationId());
        assertTrue(deleted);
        System.out.println("Deleted Education with ID: " + saved.getEducationId());
    }

    @Test
    @Order(5)
    void getAll() {
        educationService.create(testEducation);
        List<Education> all = educationService.getAll();
        assertNotNull(all);
        assertFalse(all.isEmpty());
        System.out.println("Found " + all.size() + " educations");
    }

    @Test
    @Order(6)
    void findByInstitution() {
        educationService.create(testEducation);
        List<Education> found = educationService.findByInstitution("University of Cape Town");
        assertNotNull(found);
        assertFalse(found.isEmpty());
        System.out.println("Found " + found.size() + " educations at UCT");
    }

    @Test
    @Order(4)
    void findByDegree() {
        educationService.create(testEducation);
        List<Education> found = educationService.findByDegree("Bachelor of Science");
        assertNotNull(found);
        assertFalse(found.isEmpty());
        System.out.println("Found " + found.size() + " BSc educations");
    }
}
