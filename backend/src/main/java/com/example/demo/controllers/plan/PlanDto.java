package com.example.demo.controllers.plan;

import java.util.List;

public class PlanDto {
    private String id;
    private String name;
    private List<String> workoutIds;

    public PlanDto() {
    }

    public PlanDto(String id, String name, List<String> workoutIds) {
        this.id = id;
        this.name = name;
        this.workoutIds = workoutIds;
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
    public List<String> getWorkoutIds() {
        return workoutIds;
    }
    public void setWorkoutIds(List<String> workoutIds) {
        this.workoutIds = workoutIds;
    }
}
