package za.ac.cput.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.Service.IEducationService;
import za.ac.cput.domain.Education;

import java.util.List;

@RestController
@RequestMapping("/api/educations")
@CrossOrigin(origins = "*")
public class EducationController {

    private final IEducationService educationService;

    @Autowired
    public EducationController(IEducationService educationService) {
        this.educationService = educationService;
    }

    @PostMapping("/create")
    public Education create(@RequestBody Education education) {
        return this.educationService.create(education);
    }

    @GetMapping("/read/{id}")
    public ResponseEntity<Education> read(@PathVariable String id) {
        Education education = this.educationService.read(id);
        if (education == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(education);
    }

    @PutMapping("/update")
    public ResponseEntity<Education> update(@RequestBody Education education) {
        Education updated = this.educationService.update(education);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public boolean delete(@PathVariable String id) {
        return this.educationService.delete(id);
    }

    @GetMapping("/getAll")
    public List<Education> getAll() {
        return this.educationService.getAll();
    }

    @GetMapping("/findByInstitution")
    public List<Education> findByInstitution(@RequestParam String institution) {
        return this.educationService.findByInstitution(institution);
    }

    @GetMapping("/findByDegree")
    public List<Education> findByDegree(@RequestParam String degree) {
        return this.educationService.findByDegree(degree);
    }
}