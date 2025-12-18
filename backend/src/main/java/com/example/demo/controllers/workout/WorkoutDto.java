package com.example.demo.controllers.workout;

import java.util.List;

public class WorkoutDto {
private String id;
private String name;
private List<String> exercisesIds;


    public WorkoutDto() {
    }

    public WorkoutDto(String id, String name, List<String> exercisesIds) {
        this.id = id;
        this.name = name;
        this.exercisesIds = exercisesIds;

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public List<String> getExercisesIds() {
        return exercisesIds;
    }
    public void setExercisesIds(List<String> exercisesIds) {
        this.exercisesIds = exercisesIds;
    }


}
