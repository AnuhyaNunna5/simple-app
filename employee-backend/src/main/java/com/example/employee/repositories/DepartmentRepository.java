package com.example.employee.repositories;

import com.example.employee.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findByWingId(Long wingId);
}