package za.ac.cput.Service.impl;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.domain.Employer;
import za.ac.cput.factory.EmployerFactory;
import za.ac.cput.repository.IEmployerRepository;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class EmployerServiceImplTest {

    @Autowired
    private EmployerServiceImpl employerService;

    @Autowired
    private IEmployerRepository employerRepository;

    @BeforeEach
    void setUp() {
        employerRepository.deleteAll();
    }

    private Employer createTestEmployer() {
        return EmployerFactory.createEmployer(
                "test" + System.currentTimeMillis() + "masinaa55@gmail.com",
                "12389",
                "Pamela",
                "Nkosi",
                "CPUT",
                "Information Technology"
        );
    }

    @Test
    @Order(1)
    void create() {
        Employer employer = createTestEmployer();
        assertNotNull(employer);

        Employer created = employerService.create(employer);
        assertNotNull(created);
        System.out.println("Created Employer: " + created.getCompanyName());
        System.out.println("ID: " + created.getUserId());
    }

    @Test
    @Order(2)
    void read() {
        Employer saved = employerService.create(createTestEmployer());
        assertNotNull(saved);

        Employer found = employerService.read(saved.getUserId());
        assertNotNull(found);
        System.out.println("Read Employer: " + found.getCompanyName());
    }

    @Test
    @Order(3)
    void update() {
        Employer saved = employerService.create(createTestEmployer());
        assertNotNull(saved);

        // Using manual setters since @SuperBuilder doesn't have a copy method
        Employer updatedEmployer = new Employer();
        updatedEmployer.setUserId(saved.getUserId());
        updatedEmployer.setEmail(saved.getEmail());
        updatedEmployer.setPassword(saved.getPassword());
        updatedEmployer.setFirstName(saved.getFirstName());
        updatedEmployer.setLastName(saved.getLastName());
        updatedEmployer.setCompanyName("CPUT Updated");
        updatedEmployer.setCompanyWebsite("https://CPUT-updated.com");
        updatedEmployer.setIndustry(saved.getIndustry());

        Employer updated = employerService.update(updatedEmployer);
        assertNotNull(updated);
        System.out.println("Updated Employer: " + updated.getCompanyName());
    }

    @Test
    @Order(4)
    @Disabled
    void delete() {
        Employer saved = employerService.create(createTestEmployer());
        assertNotNull(saved);

        boolean deleted = employerService.delete(saved.getUserId());
        assertTrue(deleted);
        System.out.println("Deleted Employer: " + saved.getUserId());
    }

    @Test
    @Order(5)
    void findAll() {
        employerService.create(createTestEmployer());
        employerService.create(createTestEmployer());

        List<Employer> employers = employerService.findAll();
        assertNotNull(employers);
        System.out.println("Found " + employers.size() + " Employers");
    }

    @Test
    @Order(6)
    void findByName() {
        Employer saved = employerService.create(createTestEmployer());
        assertNotNull(saved);

        List<Employer> found = employerService.findByName(saved.getCompanyName());
        assertNotNull(found);
        assertFalse(found.isEmpty());
        System.out.println("Found Employer with company name: " + saved.getCompanyName());
    }

    @Test
    @Order(7)
    void findByNameNotFound() {
        List<Employer> found = employerService.findByName("DoesNotExistCorp");
        assertNotNull(found);
        assertTrue(found.isEmpty());
        System.out.println("No Employer found for company name: DoesNotExistCorp");
    }

}