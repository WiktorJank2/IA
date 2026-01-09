package com.example.demo.repository.workoutExercise;

import com.example.demo.repository.workoutExercise.WorkoutExerciseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface WorkoutExerciseRepository extends JpaRepository<WorkoutExerciseEntity, UUID> { }