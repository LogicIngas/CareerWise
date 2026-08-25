package za.ac.cput.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Skill> read(@PathVariable String skillId) {
        Skill skill = this.service.read(skillId);
        if (skill == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(skill);
    }

    @PutMapping("/update")
    public ResponseEntity<Skill> update(@RequestBody Skill skill) {
        Skill updated = this.service.update(skill);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{skillId}")
    public ResponseEntity<Boolean> delete(@PathVariable String skillId) {
        return ResponseEntity.ok(this.service.delete(skillId));
    }

    @GetMapping("/getAll")
    public List<Skill> getAll() {
        return this.service.getAll();
    }
}
