package za.ac.cput.Service.impl;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.domain.Skill;
import za.ac.cput.factory.SkillFactory;
import za.ac.cput.repository.ISkillRepository;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class wSkillServiceImpTest {

    @Autowired
    private SkillServiceImp skillService;

    @Autowired
    private ISkillRepository skillRepository;

    private static Skill testSkill;

    @BeforeEach
    void setUp() {
        skillRepository.deleteAll();
    }

    private Skill createTestSkill() {
        return SkillFactory.createSkill("JavaScript", "Web", 3);
    }

    @Test
    @Order(1)
    void create() {
        testSkill = SkillFactory.createSkill("Java", "Programming", 5);
        assertNotNull(testSkill);

        Skill created = skillService.create(testSkill);
        assertNotNull(created);
        System.out.println("Create passed");
    }

    @Test
    @Order(2)
    void read() {
        Skill saved = skillService.create(createTestSkill());
        assertNotNull(saved);

        Skill found = skillService.read(saved.getSkillId());
        assertNotNull(found);
        System.out.println("Read passed");
    }

    @Test
    @Order(3)
    void update() {
        Skill saved = skillService.create(createTestSkill());
        assertNotNull(saved);

        // Using builder since Skill doesn't extend any class
        Skill updated = Skill.builder()
                .skillId(saved.getSkillId())
                .name("Updated")
                .category(saved.getCategory())
                .yearsOfExperience(saved.getYearsOfExperience())
                .build();

        Skill result = skillService.update(updated);
        assertNotNull(result);
        System.out.println("Update passed");
    }

    @Test
    @Order(4)
    @Disabled
    void delete() {
        Skill saved = skillService.create(createTestSkill());
        assertNotNull(saved);

        boolean deleted = skillService.delete(saved.getSkillId());
        assertTrue(deleted);
        System.out.println("Delete passed");
    }
}