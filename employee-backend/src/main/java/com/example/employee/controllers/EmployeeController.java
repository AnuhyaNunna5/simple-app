package com.example.employee.controllers;

import com.example.employee.entity.Employee;
import com.example.employee.entity.Skill;
import com.example.employee.entity.Wing;
import com.example.employee.entity.Department;
import com.example.employee.repositories.EmployeeRepository;
import com.example.employee.repositories.SkillRepository;
import com.example.employee.repositories.WingRepository;
import com.example.employee.repositories.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private SkillRepository skillRepository;
    @Autowired
    private WingRepository wingRepository;
    @Autowired
    private DepartmentRepository departmentRepository;

    @PostMapping("/employees")
    public ResponseEntity<String> createEmployee(
            @RequestPart("employee") EmployeeDTO employeeDTO,
            @RequestPart(value = "photo", required = false) MultipartFile photo) throws IOException {
        Employee employee = new Employee();
        employee.setName(employeeDTO.getName());
        employee.setSonOf(employeeDTO.getSonOf());
        employee.setDob(LocalDate.parse(employeeDTO.getDob()));
        employee.setDoj(LocalDate.parse(employeeDTO.getDoj()));
        employee.setGender(employeeDTO.getGender());
        employee.setAddress(employeeDTO.getAddress());

        // Set photo
        if (photo != null && !photo.isEmpty()) {
            employee.setPhoto(photo.getBytes());
        }

        // Set wing
        Wing wing = wingRepository.findById(employeeDTO.getWingId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid wing ID"));
        employee.setWing(wing);

        // Set department
        Department department = departmentRepository.findById(employeeDTO.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid department ID"));
        employee.setDepartment(department);

        // Set skills
        List<Skill> skills = skillRepository.findAllById(employeeDTO.getSkillIds());
        if (skills.size() != employeeDTO.getSkillIds().size()) {
            throw new IllegalArgumentException("One or more skill IDs are invalid");
        }
        employee.setSkills(skills);

        employeeRepository.save(employee);
        return ResponseEntity.ok("Employee created successfully");
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
}