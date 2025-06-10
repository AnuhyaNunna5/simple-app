package com.example.employee.repositories;

import com.example.employee.entity.LogEmployee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogEmployeeRepository extends JpaRepository<LogEmployee, Long> {
}
