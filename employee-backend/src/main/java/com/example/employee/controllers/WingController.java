package com.example.employee.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.employee.entity.Wing;
import com.example.employee.repositories.WingRepository;

import java.util.List;

@RestController
@RequestMapping("/api/wings")
public class WingController {
    @Autowired
    private WingRepository wingRepository;

    @GetMapping
    public List<Wing> getAllWings() {
        return wingRepository.findAll();
    }
}