package com.example.demo.controllers.workout;

import java.util.List;
import java.util.UUID;


public class WorkoutDto {
    private UUID id;
    private String name;
    public List<UUID> workoutExerciseIds;
    public WorkoutDto() {}

    public WorkoutDto(UUID id, String name) {
        this.id = id;
        this.name = name;
    }


    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<UUID> getWorkoutExerciseIds() {
        return workoutExerciseIds;
    }
    public void setWorkoutExerciseIds(List<UUID> workoutExerciseIds) {
        this.workoutExerciseIds = workoutExerciseIds;
    }
}

