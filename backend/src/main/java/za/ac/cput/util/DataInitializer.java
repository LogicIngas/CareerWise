// package za.ac.cput.util;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.stereotype.Component;
// import za.ac.cput.domain.*;
// import za.ac.cput.repository.*;

// import java.time.LocalDate;
// import java.time.LocalDateTime;
// import java.util.List;

// @Component
// public class DataInitializer implements CommandLineRunner {

// private final IEmployerRepository employerRepository;
// private final IJobRepository jobRepository;
// private final IJobSeekerRepository jobSeekerRepository;
// private final ISavedJobsRepository savedJobsRepository;
// private final IJobApplicationRepository applicationRepository;

// @Autowired
// public DataInitializer(IEmployerRepository employerRepository,
// IJobRepository jobRepository,
// IJobSeekerRepository jobSeekerRepository,
// ISavedJobsRepository savedJobsRepository,
// IJobApplicationRepository applicationRepository) {
// this.employerRepository = employerRepository;
// this.jobRepository = jobRepository;
// this.jobSeekerRepository = jobSeekerRepository;
// this.savedJobsRepository = savedJobsRepository;
// this.applicationRepository = applicationRepository;
// }

// @Override
// public void run(String... args) {
// if (employerRepository.count() > 0 && jobRepository.count() > 0) {
// return;
// }

// // 1. Create Employers
// Employer nimbus = Employer.builder()
// .email("contact@nimbuslabs.com")
// .password("password123")
// .firstName("Sarah")
// .lastName("Jenkins")
// .companyName("Nimbus Labs")
// .companyWebsite("https://nimbuslabs.example.com")
// .companySize("50-100")
// .industry("Engineering")
// .companyHeadquarters("San Francisco, CA")
// .companyDescription("Leading developer tooling and modern cloud software.")
// .location("San Francisco, CA")
// .build();
// nimbus = employerRepository.save(nimbus);

// Employer auroria = Employer.builder()
// .email("careers@auroria.design")
// .password("password123")
// .firstName("Liam")
// .lastName("Chen")
// .companyName("Auroria")
// .companyWebsite("https://auroria.example.com")
// .companySize("20-50")
// .industry("Design")
// .companyHeadquarters("Remote")
// .companyDescription("Human-centered digital product design studio.")
// .location("Remote")
// .build();
// auroria = employerRepository.save(auroria);

// Employer datastack = Employer.builder()
// .email("team@datastack.io")
// .password("password123")
// .firstName("Marcus")
// .lastName("Vance")
// .companyName("Datastack")
// .companyWebsite("https://datastack.example.com")
// .companySize("100-250")
// .industry("Data & AI")
// .companyHeadquarters("Austin, TX")
// .companyDescription("Next-generation data warehousing and distributed
// systems.")
// .location("Austin, TX")
// .build();
// datastack = employerRepository.save(datastack);

// Employer brightwave = Employer.builder()
// .email("jobs@brightwave.com")
// .password("password123")
// .firstName("Elena")
// .lastName("Rostova")
// .companyName("BrightWave")
// .companyWebsite("https://brightwave.example.com")
// .companySize("10-50")
// .industry("Marketing")
// .companyHeadquarters("New York, NY")
// .companyDescription("Full-funnel digital growth and brand acceleration.")
// .location("New York, NY")
// .build();
// brightwave = employerRepository.save(brightwave);

// Employer quantify = Employer.builder()
// .email("talent@quantify.ai")
// .password("password123")
// .firstName("David")
// .lastName("Kim")
// .companyName("Quantify")
// .companyWebsite("https://quantify.example.com")
// .companySize("50-200")
// .industry("Data & AI")
// .companyHeadquarters("Remote")
// .companyDescription("AI-driven statistical analysis and machine learning
// workflows.")
// .location("Remote")
// .build();
// quantify = employerRepository.save(quantify);

// Employer cloudforge = Employer.builder()
// .email("hr@cloudforge.tech")
// .password("password123")
// .firstName("Rachel")
// .lastName("Adams")
// .companyName("CloudForge")
// .companyWebsite("https://cloudforge.example.com")
// .companySize("200-500")
// .industry("Operations")
// .companyHeadquarters("Seattle, WA")
// .companyDescription("Cloud infrastructure automation and DevOps pipelines.")
// .location("Seattle, WA")
// .build();
// cloudforge = employerRepository.save(cloudforge);

// // 2. Create Jobs
// Job job1 = Job.builder()
// .title("Senior Frontend Engineer")
// .employer(nimbus)
// .description("Join our core product team to build high-performance web
// applications using React, TypeScript, and modern styling architectures.")
// .requirements(List.of("React", "TypeScript", "Tailwind CSS"))
// .responsibilities(List.of("Architect reusable UI components", "Collaborate
// with product and design teams", "Optimize web performance and
// accessibility"))
// .location("San Francisco, CA")
// .salaryRange("$140k - $180k")
// .employmentType("Full-time")
// .remoteOption(false)
// .deadlineDate(LocalDate.now().plusMonths(2))
// .status(JobStatus.OPEN)
// .build();
// job1 = jobRepository.save(job1);

// Job job2 = Job.builder()
// .title("Product Designer")
// .employer(auroria)
// .description("Craft intuitive, accessible, and delightful design systems and
// user experiences for fast-growing global brands.")
// .requirements(List.of("Figma", "UX Research", "Design Systems"))
// .responsibilities(List.of("Lead user research sessions", "Design interactive
// prototypes in Figma", "Maintain design tokens and UI library"))
// .location("Remote")
// .salaryRange("$90k - $120k")
// .employmentType("Full-time")
// .remoteOption(true)
// .deadlineDate(LocalDate.now().plusMonths(1))
// .status(JobStatus.OPEN)
// .build();
// job2 = jobRepository.save(job2);

// Job job3 = Job.builder()
// .title("Backend Engineer")
// .employer(datastack)
// .description("Scale backend APIs, data pipelines, and microservices powering
// millions of concurrent queries daily.")
// .requirements(List.of("Java", "Spring Boot", "MySQL"))
// .responsibilities(List.of("Build robust RESTful endpoints", "Design
// relational database schemas and queries", "Ensure system reliability and
// performance"))
// .location("Austin, TX")
// .salaryRange("$130k - $170k")
// .employmentType("Full-time")
// .remoteOption(false)
// .deadlineDate(LocalDate.now().plusMonths(3))
// .status(JobStatus.OPEN)
// .build();
// job3 = jobRepository.save(job3);

// Job job4 = Job.builder()
// .title("Marketing Manager")
// .employer(brightwave)
// .description("Drive multi-channel acquisition campaigns, oversee digital
// content strategy, and optimize conversion funnels.")
// .requirements(List.of("SEO", "Content Strategy", "Growth Marketing"))
// .responsibilities(List.of("Manage marketing budget and ad spend", "Execute
// SEO and inbound content strategy", "Analyze conversion funnels"))
// .location("New York, NY")
// .salaryRange("$85k - $110k")
// .employmentType("Full-time")
// .remoteOption(false)
// .deadlineDate(LocalDate.now().plusMonths(2))
// .status(JobStatus.OPEN)
// .build();
// job4 = jobRepository.save(job4);

// Job job5 = Job.builder()
// .title("Data Scientist")
// .employer(quantify)
// .description("Develop predictive models, extract actionable business
// intelligence, and train machine learning algorithms on high-volume
// datasets.")
// .requirements(List.of("Python", "Machine Learning", "Pandas"))
// .responsibilities(List.of("Build ML predictive models", "Analyze
// high-throughput structured data", "Present data-driven insights to
// leadership"))
// .location("Remote")
// .salaryRange("$70/hr")
// .employmentType("Contract")
// .remoteOption(true)
// .deadlineDate(LocalDate.now().plusMonths(1))
// .status(JobStatus.OPEN)
// .build();
// job5 = jobRepository.save(job5);

// Job job6 = Job.builder()
// .title("DevOps Engineer")
// .employer(cloudforge)
// .description("Maintain automated CI/CD deployment pipelines, manage container
// clusters with Kubernetes, and maintain cloud infrastructure.")
// .requirements(List.of("Kubernetes", "Terraform", "CI/CD"))
// .responsibilities(List.of("Maintain Kubernetes clusters", "Manage Terraform
// infrastructure-as-code", "Automate CI/CD releases"))
// .location("Seattle, WA")
// .salaryRange("$120k - $160k")
// .employmentType("Full-time")
// .remoteOption(false)
// .deadlineDate(LocalDate.now().plusMonths(2))
// .status(JobStatus.OPEN)
// .build();
// job6 = jobRepository.save(job6);

// // 3. Create Default JobSeeker
// if (!jobSeekerRepository.existsByEmail("alex@email.com")) {
// JobSeeker alex = JobSeeker.builder()
// .email("alex@email.com")
// .password("password")
// .firstName("Alex")
// .lastName("Morgan")
// .phoneNumber("+1 (555) 012-3456")
// .location("San Francisco, CA")
// .headline("Senior Frontend Engineer")
// .summary("Senior frontend engineer with 6 years building performant,
// accessible web apps.")
// .build();
// alex = jobSeekerRepository.save(alex);

// // Seed initial Saved Jobs for Alex
// SavedJobs saved1 = SavedJobs.builder()
// .jobSeeker(alex)
// .job(job1)
// .savedAt(LocalDateTime.now().minusDays(2))
// .build();
// savedJobsRepository.save(saved1);

// SavedJobs saved2 = SavedJobs.builder()
// .jobSeeker(alex)
// .job(job2)
// .savedAt(LocalDateTime.now().minusDays(3))
// .build();
// savedJobsRepository.save(saved2);

// // Seed initial Applications for Alex
// JobApplication app1 = JobApplication.builder()
// .jobSeeker(alex)
// .job(job1)
// .status("Interview")
// .appliedDate(LocalDateTime.now().minusDays(7))
// .notes("Initial technical phone screen scheduled.")
// .build();
// applicationRepository.save(app1);

// JobApplication app2 = JobApplication.builder()
// .jobSeeker(alex)
// .job(job2)
// .status("Under Review")
// .appliedDate(LocalDateTime.now().minusDays(4))
// .notes("Portfolio review in progress.")
// .build();
// applicationRepository.save(app2);

// JobApplication app3 = JobApplication.builder()
// .jobSeeker(alex)
// .job(job3)
// .status("Applied")
// .appliedDate(LocalDateTime.now().minusDays(1))
// .notes("Application submitted.")
// .build();
// applicationRepository.save(app3);
// }
// }
// }
