package com.example.demo.controllers.plan;

import java.util.List;

public class PlanDto {
    private String id;
    private String name;
    private List<String> workoutIds;
    private boolean selected;
    private boolean current;

    public PlanDto() {
    }

    public PlanDto(String id, String name, List<String> workoutIds,  boolean selected, boolean current) {
        this.id = id;
        this.name = name;
        this.workoutIds = workoutIds;
        this.selected = selected;
        this.current = current;
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
    public void setSelected(boolean selected) {
        this.selected = selected;
    }
    public boolean isSelected() {
        return selected;
    }
    public void setCurrent(boolean current) {
        this.current = current;
    }
    public boolean isCurrent() {
        return current;
    }
}
