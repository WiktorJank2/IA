package com.example.demo.controllers.workout;

import com.example.demo.controllers.workoutExercise.WorkoutExerciseDto;

import java.util.List;
import java.util.UUID;


public class WorkoutDto {
    private UUID id;
    private String name;
    private List<WorkoutExerciseDto> exercises; // store exercises with sets & reps

    public WorkoutDto() {}

    public WorkoutDto(UUID id, String name, List<WorkoutExerciseDto> exercises) {
        this.id = id;
        this.name = name;
        this.exercises = exercises;
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

    public List<WorkoutExerciseDto> getExercises() {
        return exercises;
    }

    public void setExercises(List<WorkoutExerciseDto> exercises) {
        this.exercises = exercises;
    }
}

