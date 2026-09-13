package za.ac.cput.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.domain.Skill;

import static org.junit.jupiter.api.Assertions.*;

class SkillFactoryTest {

    @Test
    void createSkill() {
        Skill skill = SkillFactory.createSkill("Python", "Technical Skill", 4);

        assertNotNull(skill);
}

    @Test
    void createSkillFails() {
        Skill skill = SkillFactory.createSkill("", "Technical Skill", 4);

        assertNull(skill);
}
}