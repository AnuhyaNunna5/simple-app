package com.example.employee.repositories;

import com.example.employee.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EmployeeRepository extends JpaRepository<Employee, String> {
    @Query(value = "SELECT nextval('emp_id_sequence')", nativeQuery = true)
    Long getNextEmpIdSequence();

    @Query(value = "SELECT nextval('seq_id_sequence')", nativeQuery = true)
    Long getNextSeqIdSequence();
}