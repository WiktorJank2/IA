package com.example.demo.repository.workoutExercise;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.UUID;

public class WorkoutExerciseRepositoryImpl implements WorkoutExerciseRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public WorkoutExerciseEntity[] findByWorkoutId(UUID workoutId) {
        return entityManager
                .createQuery(
                        "SELECT we FROM WorkoutExerciseEntity we WHERE we.workout.id = :workoutId",
                        WorkoutExerciseEntity.class
                )
                .setParameter("workoutId", workoutId)
                .getResultList()
                .toArray(new WorkoutExerciseEntity[0]);
    }
}
