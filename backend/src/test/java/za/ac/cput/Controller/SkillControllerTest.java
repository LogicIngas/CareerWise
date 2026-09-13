package za.ac.cput.Controller;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import za.ac.cput.domain.Skill;
import za.ac.cput.factory.SkillFactory;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class SkillControllerTest {

    @LocalServerPort
    private int port;

    private String BASE_URL;

    private static Skill skill;

    @Autowired
    private TestRestTemplate restTemplate;

    @BeforeEach
    void setUp() {
        BASE_URL = "http://localhost:" + port + "/api/skills/";
    }

    @Test
    @Order(1)
    void create() {
        skill = SkillFactory.createSkill("COBOL", "Programming Language", 6);
        assertNotNull(skill);

        String url = BASE_URL + "create";
        ResponseEntity<Skill> response = restTemplate.postForEntity(url, skill, Skill.class);

        assertNotNull(response.getBody());
        skill = response.getBody();
}

    @Test
    @Order(2)
    void read() {
        assertNotNull(skill);

        String url = BASE_URL + "read/" + skill.getSkillId();
        ResponseEntity<Skill> response = restTemplate.getForEntity(url, Skill.class);

        assertNotNull(response.getBody());
}

    @Test
    @Order(3)
    void update() {
        assertNotNull(skill);

        Skill updatedSkill = Skill.builder()
                .skillId(skill.getSkillId())
                .name("COBOL Updated")
                .category(skill.getCategory())
                .yearsOfExperience(8)
                .build();

        String url = BASE_URL + "update";
        HttpEntity<Skill> requestEntity = new HttpEntity<>(updatedSkill);
        ResponseEntity<Skill> response = restTemplate.exchange(
                url,
                HttpMethod.PUT,
                requestEntity,
                Skill.class
        );

        assertNotNull(response.getBody());
        skill = response.getBody();
}

    @Test
    @Order(4)
    void getAll() {
        String url = BASE_URL + "getAll";
        ResponseEntity<Skill[]> response = restTemplate.getForEntity(url, Skill[].class);

        assertNotNull(response.getBody());
}

    @Test
    @Order(5)
    @Disabled
    void delete() {
        assertNotNull(skill);

        String url = BASE_URL + "delete/" + skill.getSkillId();
        restTemplate.delete(url);

        // Verify deletion
        String readUrl = BASE_URL + "read/" + skill.getSkillId();
        ResponseEntity<Skill> getResponse = restTemplate.getForEntity(readUrl, Skill.class);

        assertNull(getResponse.getBody());
}
}