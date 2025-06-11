package com.example.employee.repositories;

import com.example.employee.entity.LogEmployee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface LogEmployeeRepository extends JpaRepository<LogEmployee, String> {
}