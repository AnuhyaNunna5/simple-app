package com.example.employee.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "log_employees")
public class LogEmployee {

    @Id
    @Column(name = "emp_id", nullable = false)
    private String empId;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "son_of", length = 50)
    private String sonOf;

    @Column(nullable = false)
    private LocalDate dob;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false)
    private LocalDate doj;

    @Column(nullable = false, length = 20)
    private String gender;

    @Column(nullable = false, length = 200)
    private String address;

    @Column(name = "wing_id", nullable = false)
    private Long wingId;

    @Column(name = "department_id")
    private Long departmentId;

    @Column(columnDefinition = "BYTEA")
    private byte[] photo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "log_time", nullable = false)
    private LocalDateTime logTime;

    // Getters and Setters
    
    public String getEmpId() { return empId; }
    public void setEmpId(String empId) { this.empId = empId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSonOf() { return sonOf; }
    public void setSonOf(String sonOf) { this.sonOf = sonOf; }
    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public LocalDate getDoj() { return doj; }
    public void setDoj(LocalDate doj) { this.doj = doj; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Long getWingId() { return wingId; }
    public void setWingId(Long wingId) { this.wingId = wingId; }
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public byte[] getPhoto() { return photo; }
    public void setPhoto(byte[] photo) { this.photo = photo; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public LocalDateTime getLogTime() { return logTime; }
    public void setLogTime(LocalDateTime logTime) { this.logTime = logTime; }
}