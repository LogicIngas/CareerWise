package za.ac.cput.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.Service.IExperienceService;
import za.ac.cput.domain.Experience;

import java.util.List;

@RestController
@RequestMapping("/api/experiences")
@CrossOrigin(origins = "*")
public class ExperienceController {

    private final IExperienceService experienceService;

    @Autowired
    public ExperienceController(IExperienceService experienceService) {
        this.experienceService = experienceService;
    }

    @PostMapping("/create")
    public Experience create(@RequestBody Experience experience) {
        return this.experienceService.create(experience);
    }

    @GetMapping("/read/{id}")
    public Experience read(@PathVariable String id) {
        return this.experienceService.read(id);
    }

    @PutMapping("/update")
    public Experience update(@RequestBody Experience experience) {
        return this.experienceService.update(experience);
    }

    @DeleteMapping("/delete/{id}")
    public boolean delete(@PathVariable String id) {
        return this.experienceService.delete(id);
    }

    @GetMapping("/getAll")
    public List<Experience> getAll() {
        return this.experienceService.getAll();
    }

    @GetMapping("/findByCompany")
    public List<Experience> findByCompany(@RequestParam String company) {
        return this.experienceService.findByCompany(company);
    }
}
