package com.example.demo.repository.workoutExercise;

import java.util.UUID;

public interface WorkoutExerciseRepositoryCustom {

    WorkoutExerciseEntity[] findByWorkoutId(UUID workoutId);

}
