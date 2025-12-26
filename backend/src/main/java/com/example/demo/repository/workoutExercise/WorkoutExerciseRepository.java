package com.example.demo.repository.workoutExercise;

import com.example.demo.entities.WorkoutExercise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface WorkoutExerciseRepository extends JpaRepository<WorkoutExerciseEntity, UUID> { }