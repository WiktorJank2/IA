package com.example.demo.repository.workout;

import com.example.demo.entities.Workout;
import com.example.demo.entities.WorkoutExercise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface WorkoutRepository extends JpaRepository<WorkoutEntity, UUID> { }