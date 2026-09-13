package za.ac.cput.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.domain.Employer;

import static org.junit.jupiter.api.Assertions.*;

class EmployerFactoryTest {

    @Test
    void createEmployer() {
        Employer employer = EmployerFactory.createEmployer(
                "capitec@email.com",
                "password123",
                "Avatar",
                "Ang",
                "Capitec",
                "Banking"
        );

        assertNotNull(employer);
}

    @Test
    void createEmployerEmptyCompanyName() {
        Employer employer = EmployerFactory.createEmployer(
                "test@email.com",
                "password123",
                "John",
                "Ang",
                "",
                "Retail"
        );

        assertNull(employer);
}
}