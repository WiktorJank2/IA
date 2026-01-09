package com.example.demo.repository.workout;

import com.example.demo.repository.workout.WorkoutEntity;
import com.example.demo.repository.workoutExercise.WorkoutExerciseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface WorkoutRepository extends JpaRepository<WorkoutEntity, UUID> { }