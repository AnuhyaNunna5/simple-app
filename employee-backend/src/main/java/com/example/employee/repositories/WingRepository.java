package com.example.employee.repositories;

import com.example.employee.entity.Wing;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WingRepository extends JpaRepository<Wing, Long> {
}