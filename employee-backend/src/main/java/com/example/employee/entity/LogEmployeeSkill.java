package com.example.employee.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "log_employee_skills")
public class LogEmployeeSkill {

    @Embeddable
    public static class LogEmployeeSkillId implements Serializable {
        private static final long serialVersionUID = 1L;

        @Column(name = "emp_id", nullable = false)
        private String empId;

        @Column(name = "skill_id", nullable = false)
        private Long skillId;

        // Getters, Setters, equals, hashCode
        public String getEmpId() { return empId; }
        public void setEmpId(String empId) { this.empId = empId; }
        public Long getSkillId() { return skillId; }
        public void setSkillId(Long skillId) { this.skillId = skillId; }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            LogEmployeeSkillId that = (LogEmployeeSkillId) o;
            return Objects.equals(empId, that.empId) && Objects.equals(skillId, that.skillId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(empId, skillId);
        }
    }

    @EmbeddedId
    private LogEmployeeSkillId id;

    // Getters and Setters
    public LogEmployeeSkillId getId() { return id; }
    public void setId(LogEmployeeSkillId id) { this.id = id; }

    // Convenience methods
    public String getEmpId() { return id.getEmpId(); }
    public void setEmpId(String empId) { id.setEmpId(empId); }
    public Long getSkillId() { return id.getSkillId(); }
    public void setSkillId(Long skillId) { id.setSkillId(skillId); }

    public LogEmployeeSkill() {
        this.id = new LogEmployeeSkillId();
    }
}