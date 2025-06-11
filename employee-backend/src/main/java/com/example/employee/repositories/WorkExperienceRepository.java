package com.example.employee.repositories;

import com.example.employee.entity.WorkExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface WorkExperienceRepository extends JpaRepository<WorkExperience, Long> {
    @Query("SELECT we FROM WorkExperience we WHERE we.employee.empId = :empId")
    List<WorkExperience> findByEmpId(String empId);

    void deleteByEmployeeEmpId(String empId);
}