package com.example.demo.controllers.plan;

public class PlanDto {
    private String id;
    private String name;
    private String[] workoutIds;

    public PlanDto() {
    }

    public PlanDto(String id, String name, String description, String[] workoutIds) {
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
    public String[] getWorkoutIds() {
        return workoutIds;
    }
    public void setWorkoutIds(String[] workoutIds) {
        this.workoutIds = workoutIds;
    }
}
