package com.example.demo.repository.exercise;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ExerciseRepository extends JpaRepository<ExerciseEntity, UUID> { }