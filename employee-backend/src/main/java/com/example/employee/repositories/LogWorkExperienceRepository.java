package com.example.employee.repositories;

import com.example.employee.entity.LogWorkExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface LogWorkExperienceRepository extends JpaRepository<LogWorkExperience, String> {
}