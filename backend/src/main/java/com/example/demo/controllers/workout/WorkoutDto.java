package com.example.demo.controllers.workout;

import com.example.demo.controllers.exercise.ExerciseDto;

import java.util.List;
import java.util.UUID;


public class WorkoutDto {
    private UUID id;
    private String name;

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

}

