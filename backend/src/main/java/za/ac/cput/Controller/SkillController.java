package za.ac.cput.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.Service.ISkillService;
import za.ac.cput.domain.Skill;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "*")
public class SkillController {
    private final ISkillService service;

    @Autowired
    public SkillController(ISkillService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public Skill create(@RequestBody Skill skill) {
        return this.service.create(skill);
    }

    @GetMapping("/read/{skillId}")
    public Skill read(@PathVariable String skillId) {
        return this.service.read(skillId);
    }

    @PutMapping("/update")
    public Skill update(@RequestBody Skill skill) {
        return this.service.update(skill);
    }

    @DeleteMapping("/delete/{skillId}")
    public boolean delete(@PathVariable String skillId) {
        return this.service.delete(skillId);
    }

    @GetMapping("/getAll")
    public List<Skill> getAll() {
        return this.service.getAll();
    }
}
