package com.example.demo.controllers.workout;

import com.example.demo.controllers.exercise.ExerciseDto;
import com.example.demo.controllers.workoutExercise.WorkoutExerciseDto;
import com.example.demo.repository.workoutExercise.WorkoutExerciseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


public class WorkoutDto {
    private UUID id;
    private String name;
    @OneToMany(mappedBy = "workout", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkoutExerciseEntity> workoutExercises = new ArrayList<>();
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

    public List<WorkoutExerciseDto> getExercises() {
        return workoutExercises;
    }
    public void setExercises(List<WorkoutExerciseDto> workoutExercises) {
        this.workoutExercises = workoutExercises;
    }

}

