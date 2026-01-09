package com.example.demo.repository.workoutExercise;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

public class WorkoutExerciseRepositoryImpl implements WorkoutExerciseRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;
}
