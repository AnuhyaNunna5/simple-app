package com.example.employee.controllers;

import com.example.employee.entity.Employee;
import com.example.employee.entity.Skill;
import com.example.employee.entity.Wing;
import com.example.employee.entity.Department;
import com.example.employee.entity.WorkExperience;
import com.example.employee.entity.LogEmployee;
import com.example.employee.entity.LogEmployeeSkill;
import com.example.employee.entity.LogWorkExperience;
import com.example.employee.repositories.EmployeeRepository;
import com.example.employee.repositories.SkillRepository;
import com.example.employee.repositories.WingRepository;
import com.example.employee.repositories.DepartmentRepository;
import com.example.employee.repositories.WorkExperienceRepository;
import com.example.employee.repositories.LogEmployeeRepository;
import com.example.employee.repositories.LogEmployeeSkillRepository;
import com.example.employee.repositories.LogWorkExperienceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Base64;
import java.util.stream.Collectors;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
public class EmployeeController {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeController.class);

    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private SkillRepository skillRepository;
    @Autowired
    private WingRepository wingRepository;
    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private WorkExperienceRepository workExperienceRepository;
    @Autowired
    private LogEmployeeRepository logEmployeeRepository;
    @Autowired
    private LogEmployeeSkillRepository logEmployeeSkillRepository;
    @Autowired
    private LogWorkExperienceRepository logWorkExperienceRepository;

    @PostMapping("/employees")
    public ResponseEntity<String> createEmployee(
            @RequestPart("employee") EmployeeDTO employeeDTO,
            @RequestPart(value = "photo", required = false) MultipartFile photo) throws IOException {
        logger.info("Creating employee: {}", employeeDTO.getName());
        Employee employee = new Employee();
        employee.setName(employeeDTO.getName());
        employee.setSonOf(employeeDTO.getSonOf());
        employee.setDob(LocalDate.parse(employeeDTO.getDob()));
        employee.setDoj(LocalDate.parse(employeeDTO.getDoj()));
        employee.setGender(employeeDTO.getGender());
        employee.setAddress(employeeDTO.getAddress());
        employee.setAge(employeeDTO.getAge());

        // Set photo
        if (photo != null && !photo.isEmpty()) {
            employee.setPhoto(photo.getBytes());
        }

        // Set wing
        Wing wing = wingRepository.findById(employeeDTO.getWingId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid wing ID"));
        employee.setWing(wing);

        // Set department
        Department department = null;
        if (employeeDTO.getDepartmentId() != null) {
            department = departmentRepository.findById(employeeDTO.getDepartmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid department ID"));
        }
        employee.setDepartment(department);

        // Set skills
        List<Skill> skills = skillRepository.findAllById(employeeDTO.getSkillIds());
        if (skills.size() != employeeDTO.getSkillIds().size()) {
            throw new IllegalArgumentException("One or more skill IDs are invalid");
        }
        employee.setSkills(skills);

        // Initialize workExperiences
        employee.setWorkExperiences(new ArrayList<>());

        // Save employee first
        Employee savedEmployee = employeeRepository.save(employee);

        // Set work experiences
        if (employeeDTO.getWorkExperiences() != null && !employeeDTO.getWorkExperiences().isEmpty()) {
            logger.info("Processing {} work experiences", employeeDTO.getWorkExperiences().size());
            for (WorkExperienceDTO expDTO : employeeDTO.getWorkExperiences()) {
                // Skip if all fields are empty or null
                if (expDTO.getLocation() == null && expDTO.getCompanyName() == null &&
                    expDTO.getJobRole() == null && expDTO.getFromDate() == null &&
                    expDTO.getToDate() == null) {
                    continue;
                }
                WorkExperience experience = new WorkExperience();
                experience.setLocation(expDTO.getLocation());
                experience.setCompanyName(expDTO.getCompanyName());
                experience.setJobRole(expDTO.getJobRole());
                try {
                    experience.setFromDate(expDTO.getFromDate() != null && !expDTO.getFromDate().isEmpty() ? LocalDate.parse(expDTO.getFromDate()) : null);
                    experience.setToDate(expDTO.getToDate() != null && !expDTO.getToDate().isEmpty() ? LocalDate.parse(expDTO.getToDate()) : null);
                } catch (Exception e) {
                    logger.error("Invalid date format in work experience: {}", expDTO, e);
                    throw new IllegalArgumentException("Invalid date format in work experience");
                }
                experience.setExperienceYears(expDTO.getExperienceYears());
                experience.setEmployee(savedEmployee);
                workExperienceRepository.save(experience);
            }
        }

        return ResponseEntity.ok("Employee created successfully");
    }

    @GetMapping("/employees")
    public ResponseEntity<List<EmployeeDTO>> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        List<EmployeeDTO> employeeDTOs = employees.stream().map(employee -> {
            EmployeeDTO dto = new EmployeeDTO();
            dto.setId(employee.getId());
            dto.setName(employee.getName());
            dto.setSonOf(employee.getSonOf());
            dto.setGender(employee.getGender());
            dto.setDoj(employee.getDoj().toString());
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(employeeDTOs);
    }
    
    @GetMapping("/employees/{id}")
    public ResponseEntity<EmployeeDTO> getEmployeeById(@PathVariable Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setName(employee.getName());
        dto.setSonOf(employee.getSonOf());
        dto.setDob(employee.getDob().toString());
        dto.setAge(employee.getAge());
        dto.setDoj(employee.getDoj().toString());
        dto.setGender(employee.getGender());
        dto.setAddress(employee.getAddress());
        dto.setWingId(employee.getWing().getId());
        dto.setWingName(employee.getWing().getName());
        dto.setDepartmentId(employee.getDepartment() != null ? employee.getDepartment().getId() : null);
        dto.setDepartmentName(employee.getDepartment() != null ? employee.getDepartment().getName() : null);
        dto.setSkillIds(employee.getSkills().stream().map(Skill::getId).collect(Collectors.toList()));
        dto.setSkillNames(employee.getSkills().stream().map(Skill::getName).collect(Collectors.joining(", ")));
        if (employee.getPhoto() != null) {
            dto.setPhotoBase64(Base64.getEncoder().encodeToString(employee.getPhoto()));
        }
        List<WorkExperienceDTO> workExperienceDTOs = employee.getWorkExperiences().stream().map(exp -> {
            WorkExperienceDTO expDto = new WorkExperienceDTO();
            expDto.setLocation(exp.getLocation());
            expDto.setCompanyName(exp.getCompanyName());
            expDto.setJobRole(exp.getJobRole());
            expDto.setFromDate(exp.getFromDate() != null ? exp.getFromDate().toString() : null);
            expDto.setToDate(exp.getToDate() != null ? exp.getToDate().toString() : null);
            expDto.setExperienceYears(exp.getExperienceYears());
            return expDto;
        }).collect(Collectors.toList());
        dto.setWorkExperiences(workExperienceDTOs);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/employees/{id}")
    public ResponseEntity<String> updateEmployee(
            @PathVariable Long id,
            @RequestPart("employee") EmployeeDTO employeeDTO,
            @RequestPart(value = "photo", required = false) MultipartFile photo) throws IOException {
        logger.info("Updating employee ID: {}, Work Experiences: {}", id, employeeDTO.getWorkExperiences());
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        // Update basic fields
        employee.setName(employeeDTO.getName());
        employee.setSonOf(employeeDTO.getSonOf());
        try {
            employee.setDob(LocalDate.parse(employeeDTO.getDob()));
            employee.setDoj(LocalDate.parse(employeeDTO.getDoj()));
        } catch (Exception e) {
            logger.error("Invalid date format in employeeDTO: {}", employeeDTO, e);
            throw new IllegalArgumentException("Invalid date format in DOB or DOJ");
        }
        employee.setGender(employeeDTO.getGender());
        employee.setAddress(employeeDTO.getAddress());
        employee.setAge(employeeDTO.getAge());

        // Update photo
        if (photo != null && !photo.isEmpty()) {
            employee.setPhoto(photo.getBytes());
        }

        // Update wing
        Wing wing = wingRepository.findById(employeeDTO.getWingId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid wing ID"));
        employee.setWing(wing);

        // Update department
        Department department = null;
        if (employeeDTO.getDepartmentId() != null) {
            department = departmentRepository.findById(employeeDTO.getDepartmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid department ID"));
        }
        employee.setDepartment(department);

        // Update skills
        List<Skill> skills = skillRepository.findAllById(employeeDTO.getSkillIds());
        if (skills.size() != employeeDTO.getSkillIds().size()) {
            throw new IllegalArgumentException("One or more skill IDs are invalid");
        }
        employee.setSkills(skills);

        // Update work experiences
        List<WorkExperience> workExperiences = employee.getWorkExperiences();
        workExperiences.clear(); // Clear existing experiences (triggers orphanRemoval)
        if (employeeDTO.getWorkExperiences() != null && !employeeDTO.getWorkExperiences().isEmpty()) {
            for (WorkExperienceDTO expDTO : employeeDTO.getWorkExperiences()) {
                // Skip empty experiences
                if (expDTO.getLocation() == null && expDTO.getCompanyName() == null &&
                    expDTO.getJobRole() == null && expDTO.getFromDate() == null &&
                    expDTO.getToDate() == null) {
                    continue;
                }
                WorkExperience experience = new WorkExperience();
                experience.setLocation(expDTO.getLocation());
                experience.setCompanyName(expDTO.getCompanyName());
                experience.setJobRole(expDTO.getJobRole());
                try {
                    experience.setFromDate(expDTO.getFromDate() != null && !expDTO.getFromDate().isEmpty() ? LocalDate.parse(expDTO.getFromDate()) : null);
                    experience.setToDate(expDTO.getToDate() != null && !expDTO.getToDate().isEmpty() ? LocalDate.parse(expDTO.getToDate()) : null);
                } catch (Exception e) {
                    logger.error("Invalid date format in work experience: {}", expDTO, e);
                    throw new IllegalArgumentException("Invalid date format in work experience");
                }
                experience.setExperienceYears(expDTO.getExperienceYears());
                experience.setEmployee(employee);
                workExperiences.add(experience);
            }
        }

        // Save employee (cascade persists work experiences)
        try {
            employeeRepository.save(employee);
        } catch (Exception e) {
            logger.error("Failed to save employee: {}", employee, e);
            throw new RuntimeException("Failed to save employee", e);
        }
        logger.info("Employee updated successfully: ID {}", id);
        return ResponseEntity.ok("Employee updated successfully");
    }

    @DeleteMapping("/employees/{id}")
    @Transactional
    public ResponseEntity<String> deleteEmployee(@PathVariable Long id, @RequestBody DeleteRequestDTO deleteRequest) {
        logger.info("Deleting employee ID: {} with remarks: {}", id, deleteRequest.getRemarks());

        // Validate remarks
        String remarks = deleteRequest.getRemarks();
        if (remarks == null || remarks.trim().isEmpty()) {
            throw new IllegalArgumentException("Remarks are required");
        }
        if (remarks.length() < 10 || remarks.length() > 500) {
            throw new IllegalArgumentException("Remarks must be between 10 and 500 characters");
        }

        // Fetch employee
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        // Log to log_employees
        LogEmployee logEmployee = new LogEmployee();
        logEmployee.setEmployeeId(employee.getId());
        logEmployee.setName(employee.getName());
        logEmployee.setSonOf(employee.getSonOf());
        logEmployee.setDob(employee.getDob());
        logEmployee.setAge(employee.getAge());
        logEmployee.setDoj(employee.getDoj());
        logEmployee.setGender(employee.getGender());
        logEmployee.setAddress(employee.getAddress());
        logEmployee.setWingId(employee.getWing().getId());
        logEmployee.setDepartmentId(employee.getDepartment() != null ? employee.getDepartment().getId() : null);
        logEmployee.setPhoto(employee.getPhoto());
        logEmployee.setRemarks(remarks);
        logEmployee.setLogTime(LocalDateTime.now());
        logEmployeeRepository.save(logEmployee);

        // Log to log_employee_skills
        for (Skill skill : employee.getSkills()) {
            LogEmployeeSkill logSkill = new LogEmployeeSkill();
            logSkill.setEmployeeId(employee.getId());
            logSkill.setSkillId(skill.getId());
            logEmployeeSkillRepository.save(logSkill);
        }

        // Log to log_work_experience
        for (WorkExperience exp : employee.getWorkExperiences()) {
            LogWorkExperience logExp = new LogWorkExperience();
            logExp.setEmployeeId(employee.getId());
            logExp.setLocation(exp.getLocation());
            logExp.setCompanyName(exp.getCompanyName());
            logExp.setJobRole(exp.getJobRole());
            logExp.setFromDate(exp.getFromDate());
            logExp.setToDate(exp.getToDate());
            logExp.setExperienceYears(exp.getExperienceYears());
            logWorkExperienceRepository.save(logExp);
        }

        // Delete employee (cascade removes work experiences and skills)
        employeeRepository.delete(employee);
        logger.info("Employee ID: {} deleted successfully", id);
        return ResponseEntity.ok("Employee deleted successfully");
    }
}

class EmployeeDTO {
    private String name;
    private String sonOf;
    private String dob;
    private String doj;
    private String gender;
    private String address;
    private Long wingId;
    private Long departmentId;
    private List<Long> skillIds;
    private List<WorkExperienceDTO> workExperiences;
    private Integer age;
    private Long id;
    private String wingName;
    private String departmentName;
    private String skillNames;
    private String photoBase64;

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSonOf() { return sonOf; }
    public void setSonOf(String sonOf) { this.sonOf = sonOf; }
    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }
    public String getDoj() { return doj; }
    public void setDoj(String doj) { this.doj = doj; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Long getWingId() { return wingId; }
    public void setWingId(Long wingId) { this.wingId = wingId; }
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public List<Long> getSkillIds() { return skillIds; }
    public void setSkillIds(List<Long> skillIds) { this.skillIds = skillIds; }
    public List<WorkExperienceDTO> getWorkExperiences() { return workExperiences; }
    public void setWorkExperiences(List<WorkExperienceDTO> workExperiences) { this.workExperiences = workExperiences; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getWingName() { return wingName; }
    public void setWingName(String wingName) { this.wingName = wingName; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public String getSkillNames() { return skillNames; }
    public void setSkillNames(String skillNames) { this.skillNames = skillNames; }
    public String getPhotoBase64() { return photoBase64; }
    public void setPhotoBase64(String photoBase64) { this.photoBase64 = photoBase64; }
}