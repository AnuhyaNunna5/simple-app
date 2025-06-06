package com.example.employee.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.employee.entity.WorkExperience;

public interface WorkExperienceRepository extends JpaRepository<WorkExperience, Long> {
}